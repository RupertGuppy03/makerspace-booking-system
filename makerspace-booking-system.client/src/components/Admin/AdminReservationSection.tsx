/**
 * Reservations: every booking ever made, with filters for tool, user and date
 * range.
 *
 * Same filters, same columns as before - this is the plain HTML version of
 * what used to be a MUI table.
 */

import { useState } from 'react';
import { useAdminReservation } from '../../pages/Admin/useAdminReservation';
import { useAdminTools } from '../../pages/Admin/useAdminTools';

/*
 * The colour each booking status is shown in. Statuses arrive from the
 * database as lower-case words like "no_show", so this also decides how they
 * are spelled on screen.
 */
const STATUS_STYLES: Record<string, { label: string; colour: string }> = {
    booked: { label: 'Booked', colour: 'blue' },
    collected: { label: 'Collected', colour: 'amber' },
    returned: { label: 'Returned', colour: 'green' },
    cancelled: { label: 'Cancelled', colour: 'grey' },
    no_show: { label: 'No show', colour: 'rose' },
};

function AdminReservationSection() {
    const { tools } = useAdminTools();
    const [toolId, setToolId] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const { reservations, loading, error } = useAdminReservation({
        toolId: toolId ? Number(toolId) : undefined,
        userId: userId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    });

    return (
        <section>
            <p className="admin-lede">
                All reservations made across every tool. Filter by tool, user, or date range.
            </p>

            {error && <p className="admin-error-note">{error}</p>}

            <div className="row g-3 mb-3">
                <div className="col-sm-6 col-lg-3">
                    <label className="admin-field-label" htmlFor="filter-tool">Tool</label>
                    <select
                        id="filter-tool"
                        className="admin-input"
                        value={toolId}
                        onChange={(e) => setToolId(e.target.value)}
                    >
                        <option value="">All tools</option>
                        {tools?.map((tool) => (
                            <option key={tool.id} value={tool.id}>{tool.name}</option>
                        ))}
                    </select>
                </div>

                <div className="col-sm-6 col-lg-3">
                    <label className="admin-field-label" htmlFor="filter-user">User ID</label>
                    <input
                        id="filter-user"
                        className="admin-input"
                        placeholder="Search by user id..."
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>

                <div className="col-sm-6 col-lg-3">
                    <label className="admin-field-label" htmlFor="filter-from">From</label>
                    <input
                        id="filter-from"
                        className="admin-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="col-sm-6 col-lg-3">
                    <label className="admin-field-label" htmlFor="filter-to">To</label>
                    <input
                        id="filter-to"
                        className="admin-input"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Tool</th>
                            <th>User id</th>
                            <th>Status</th>
                            <th>Start date</th>
                            <th>End date</th>
                            <th className="admin-num">Amount charged</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={7} className="admin-table-empty">Loading reservations...</td>
                            </tr>
                        )}

                        {!loading && (reservations?.length ?? 0) === 0 && (
                            <tr>
                                <td colSpan={7} className="admin-table-empty">
                                    No reservations match these filters.
                                </td>
                            </tr>
                        )}

                        {reservations?.map((r) => {
                            /* An unrecognised status still gets a pill, just a
                               grey one with the raw word in it. */
                            const status = STATUS_STYLES[r.status] ?? { label: r.status, colour: 'grey' };

                            return (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.tool ? r.tool.name : `#${r.toolId}`}</td>
                                    <td className="admin-mono">{r.userId}</td>
                                    <td>
                                        <span className={`admin-pill admin-pill--${status.colour}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td>{new Date(r.startDay).toDateString()}</td>
                                    <td>{new Date(r.endDay).toDateString()}</td>
                                    <td className="admin-num">${r.amountCharged}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default AdminReservationSection;
