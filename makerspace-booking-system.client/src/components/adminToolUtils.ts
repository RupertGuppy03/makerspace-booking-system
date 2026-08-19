import type { Tool } from '../types/tool';

/**
    keeps track of a tools maintanenace days
    > a tool is overdue when more days have passed lastMaintained than its 
    maintenancePeriod allows whoch comes from the AdminDashboardSection and 
    AdminMaintenanceSection so the definition only lives in one place
 */

export function isOverdue(tool: Tool): boolean {
    const last = new Date(tool.lastMaintained).getTime();
    const daysSince = (Date.now() - last) / (1000 * 60 * 60 * 24);
    return daysSince >= tool.maintenancePeriod;
};