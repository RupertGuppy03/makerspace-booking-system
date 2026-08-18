

import type { Tool } from '../../types/tool.ts';
import type { NewTool } from '../../types/newTool.ts'

export type AdminToolsState = {
    tools: Tool[] | null;
    loading: boolean;
    error: string | null;

    addTool: (tool: NewTool) => Promise<void>;
    markMaintained: (toolId: number) => Promise<void>;
};
export function useAdminTools(): AdminToolsState {
    return {
        tools: null,
        loading: true,
        error: null,
        //will hookup to the backend and supabase once the endpoints are created
        addTool: async (tool) => {
            console.warn('addTool not yet wired to backend:', tool);
        },
        markMaintained: async (toolId) => {
            console.warn('markMaintained not yet wired to backend:', toolId);
         },
    }
}