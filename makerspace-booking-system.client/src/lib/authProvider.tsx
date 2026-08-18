import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

type AuthState = { user: User | null; loading: boolean };
const AuthContext = createContext<AuthState>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!mounted) return;
            setUser(user ?? null);
            setLoading(false);
        }
        init();

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            mounted = false;
            data?.subscription?.unsubscribe?.();
        };
    }, []);

    return <AuthContext.Provider value={ { user, loading } }> { children } </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);