

import type { Tool } from '../../types/tool.ts';
import type { NewTool } from '../../types/newTool.ts'
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient.ts';

export type AdminToolsState = {
    tools: Tool[] | null;
    loading: boolean;
    error: string | null;

    addTool: (tool: NewTool) => Promise<void>;
    markMaintained: (toolId: number) => Promise<void>;
    removeTool: (toolId: number) => Promise<void>;
    updateTool: (toolId: number, changes: ToolUpdate) => Promise<void>;
};

/**
  * will be use to update a tool in the database, only the fields that are provided will be updated
 */
export type ToolUpdate = Partial<{
    name: string;
    isTakenOut: boolean;
    maintenancePeriod: number;
    lastMaintained: Date;
    dailyRate: number;
}>;



// --- collects a row from the backend and maps it to a Tool type
function mapRowToTool(row: any): Tool {
    return {
        id: row.id,
        createdAt: new Date(row.created_at),
        name: row.name,
        isTakenOut: row.is_taken_out,
        maintenancePeriod: row.maintenance_period,
        lastMaintained: new Date(row.last_maintained),
        dailyRate: parseFloat(row.daily_rate)
    }   
}

export function useAdminTools(): AdminToolsState {
    const [tools, setTools] = useState<Tool[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    // --- fetching Tools from supabase ---
    const fetchTools = useCallback(async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('Tools')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            setError(error.message);
            setTools(null);
        } else {
            setTools((data ?? []).map(mapRowToTool));
        }

        setLoading(false);

    }, []);

    useEffect(() => {
        fetchTools();
    }, [fetchTools]);

    // --- adding tools to the supabase ---
    const addTool = useCallback(async (tool: NewTool) => {
        const { error } = await supabase.from('Tools').insert({
            name: tool.name,
            created_at: tool.createdAt,
            is_taken_out: tool.isTakenOut,
            maintenance_period: tool.maintenancePeriod,
            last_maintained: tool.lastMaintained,
            daily_rate: tool.dailyRate
        });

        if (error) {
            setError(error.message);
            return;
        }

        await fetchTools();
    }, [fetchTools]);


    // --- Mark Maintained on tool ---
    const markMaintained = useCallback(async (toolId: number) => {
        const { error } = await supabase
            .from('Tools')
            .update({ last_maintained: new Date().toISOString() })
            .eq('id', toolId);

        if (error) {
            setError(error.message);
            return;
        }

        await fetchTools();
    }, [fetchTools]);


    // --- remove a Tool ---
    const removeTool = useCallback(async (toolId: number) => {
        const { error } = await supabase
            .from('Tools')
            .delete()
            .eq('id', toolId);

        console.log('called');

        if (error) {
            setError(error.message);
            return;
        }

        await fetchTools();
    }, [fetchTools]);

    const updateTool = useCallback(async (toolId: number, changes: ToolUpdate) => {
        // map camelCase client fields to snake_case DB columns
        const dbChanges: any = {};
        if (changes.name !== undefined) dbChanges.name = changes.name;
        if (changes.isTakenOut !== undefined) dbChanges.is_taken_out = changes.isTakenOut;
        if (changes.maintenancePeriod !== undefined) dbChanges.maintenance_period = changes.maintenancePeriod;
        if (changes.lastMaintained !== undefined) dbChanges.last_maintained = (changes.lastMaintained instanceof Date)
            ? changes.lastMaintained.toISOString()
            : changes.lastMaintained;
        if (changes.dailyRate !== undefined) dbChanges.daily_rate = changes.dailyRate;

        const { error } = await supabase
            .from('Tools')
            .update(dbChanges)
            .eq('id', toolId);

        if (error) {
            setError(error.message);
            return;
        }

        await fetchTools();
    }, [fetchTools]);


    return {
        tools, loading, error, addTool, markMaintained, removeTool, updateTool
    };
}