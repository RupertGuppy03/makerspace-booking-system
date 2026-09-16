import { useEffect, useState } from 'react';
import type { DashboardMetrics } from '../../types/metrics.ts';

export type DashboardMetricsState = {
    metrics: DashboardMetrics | null;
    loading: boolean;
    error: string | null;
};

export function useDashboardMetrics(): DashboardMetricsState {
    // The figures, once they arrive. Null means there is nothing to show yet.
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

    // True while the request is still in flight.
    const [loading, setLoading] = useState<boolean>(true);

    // A message to show if the request failed. Null means nothing went wrong.
    const [error, setError] = useState<string | null>(null);

    // This runs once, when the page first appears.
    useEffect(() => {
        // Lets us ignore a reply that turns up after the user has left the page.
        let cancelled = false;

        async function loadMetrics() {
            try {
                const response = await fetch('/api/management/metrics');

                // fetch only rejects if the network itself failed, so a 500
                // still counts as "ok" unless we check for it ourselves.
                if (!response.ok) {
                    throw new Error(`The server returned ${response.status}.`);
                }

                const data: DashboardMetrics = await response.json();
                if (!cancelled) {
                    setMetrics(data);
                }
            } catch (problem) {
                if (!cancelled) {
                    setError(
                        problem instanceof Error
                            ? problem.message
                            : 'Could not load the dashboard figures.'
                    );
                    setMetrics(null);
                }
            } finally {
                // Runs whether it worked or not, so the spinner always stops.
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadMetrics();

        // React runs this when the page is closed, before it forgets about us.
        return () => {
            cancelled = true;
        };
    }, []);

    return { metrics, loading, error };
}