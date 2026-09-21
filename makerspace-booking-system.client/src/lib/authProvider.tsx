import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';
import type { Role } from '../types/role';

type AuthState = { user: User | null; role: Role; loading: boolean };
const AuthContext = createContext<AuthState>({ user: null, role: "guest", loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role>("guest");
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        let mounted = true;

        //When this first loads (mounts), get the logged in user from supabase auth and the role from the profile related to the user
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!mounted) return

            if (user) await fetchRole(user.id);
            else setRole("guest");

            setUser(user ?? null);
            setLoading(false);
        }

        //Get the user's role from the profiles table using the logged in user
        async function fetchRole(userId: string) {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                if (mounted) {
                    setRole(data?.role || "guest");
                }
            } catch (error) {
                console.error('Error fetching auth level:', error);
                if (mounted) setRole("guest");
            }
        }
        init();

        //Whenever the user logs in or out, update the user and role state in this context
        const { data } = supabase.auth.onAuthStateChange(async (_event, session) => { //Having this function be async may cause extra lag whenever the context updates, but that should only be when logging in/out
            if (!mounted) return;
            setUser(session?.user ?? null);

            if (session?.user) await fetchRole(session.user.id);
            else setRole("guest");
            
            setLoading(false);
        });

        return () => {
            mounted = false;
            data?.subscription?.unsubscribe?.();
        };
    }, []);

    //When you call this (useAuth) from another file, these three values are accessible. user, role, loading
    return <AuthContext.Provider value={{ user, role, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);