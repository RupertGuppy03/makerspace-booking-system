import { useCallback, useEffect, useState } from 'react';
import type { Reservation } from '../../types/reservation';

export type ReservationFilters = {
    toolId?: number;
    userId?: string;
    startDate?: string; // yyyy-mm-dd
    endDate?: string;   // yyyy-mm-dd
};

export type AdminReservationsState = {
    reservations: Reservation[] | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};

export function useAdminReservation(filters: ReservationFilters): AdminReservationsState {
    const [reservations, setReservations] = useState<Reservation[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = useCallback(async () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters.toolId !== undefined) params.set('toolId', String(filters.toolId));
        if (filters.userId) params.set('userId', filters.userId);
        if (filters.startDate) params.set('startDate', filters.startDate);
        if (filters.endDate) params.set('endDate', filters.endDate);

        const response = await fetch(`/api/reservations?${params.toString()}`);
        if (response.ok) {
            const data = await response.json();
            setReservations(data);
        } else {
            const errorData = await response.json();
            setError(errorData.detail ?? errorData.message ?? 'Failed to load reservations');
            setReservations(null);
        }

        setLoading(false);
    }, [filters.toolId, filters.userId, filters.startDate, filters.endDate]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    return { reservations, loading, error, refresh: fetchReservations }

}
