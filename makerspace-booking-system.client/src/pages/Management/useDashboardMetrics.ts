/**
 *  this page is used to display the dashboard metrics for the management page
 * 
 * 
 * 
 */

import type { DashboardMetrics } from '../../types/metrics.ts'

// this constant is used to store the state of the dashboard metrics
export type DashbaordMetricsState = {
    metrics: DashboardMetrics | null;
    loading: boolean;
    error: string | null;
    awaitingScema: boolean;
}

// this function is used to return the initial state of the dashboard metrics
export function useDashboardMetrics(): DashbaordMetricsState {
    return {
        metrics: null,
        loading: true,
        error: null,
        awaitingScema: true
    }
}