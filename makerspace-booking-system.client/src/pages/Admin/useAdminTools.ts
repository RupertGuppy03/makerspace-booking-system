

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
};

// --- collects a row from the backend and maps it to a Tool type
// ### This should be unnecessary now with EF core backend
//
// function mapRowToTool(row: any): Tool {
//     return {
//         id: row.id,
//         createdAt: new Date(row.created_at),
//         name: row.name,
//         isTakenOut: row.is_taken_out,
//         maintenancePeriod: row.maintenance_period,
//         lastMaintained: new Date(row.last_maintained),
//         dailyRate: parseFloat(row.daily_rate)
//     }   
// }

export function useAdminTools(): AdminToolsState {
    const [tools, setTools] = useState<Tool[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    // --- fetching Tools from supabase ---
    const fetchTools = useCallback(async () => {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/tools');
        if (response.ok) {
            const data = await response.json();
            setTools(data);
        } else {
            const errorData = await response.json();
            alert(`Error fetching tools: ${errorData.message}`);
            setError(errorData.message);
            setTools(null);
        }

        setLoading(false);

    }, []);

    useEffect(() => {
        fetchTools();
    }, [fetchTools]);

    // --- adding tools to the supabase ---
    const addTool = useCallback(async (tool: NewTool) => {

        const response = await fetch("/api/tool", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tool)
        });

        if (response.ok) {
            const data = await response.json()
            alert(`Reservation created: ${data}`);
        } else {
            const errorData = await response.json();
            alert(`Error creating tool: ${errorData.message}`);
            setError(errorData.message);
        }

        await fetchTools();
    }, [fetchTools]);


    // --- Mark Maintained on tool ---
    const markMaintained = useCallback(async (toolId: number) => {

        const response = await fetch(`/api/tool/${toolId}/maintain`, {
            method: "Patch",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(new Date().toISOString())
        });

        if (response.ok) {
            const data = await response.json()
            alert(`Tool marked as maintained: ${data}`);
        } else {
            const errorData = await response.json();
            alert(`Error marking tool as maintained: ${errorData.message}`);
            setError(errorData.message);
        }

        await fetchTools();
    }, [fetchTools]);


    // --- remove a Tool ---
    const removeTool = useCallback(async (toolId: number) => {

        const response = await fetch(`/api/tool/${toolId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            const data = await response.json()
            alert(`Tool deleted: ${data}`);
        } else {
            const errorData = await response.json();
            alert(`Error deleting tool: ${errorData.message}`);
            setError(errorData.message);
        }

        await fetchTools();
    }, [fetchTools]);
    

    return {
        tools, loading, error, addTool, markMaintained, removeTool
    };
}