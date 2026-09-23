/**
 * Maintenance: the tools that have passed their maintenance period, with a
 * button on each row to mark it serviced.
 *
 * Same search, same columns, same button as before - this is the plain HTML
 * version of what used to be a MUI table.
 */

import { useState } from 'react';
import { useAdminTools } from '../../pages/Admin/useAdminTools';
import { isOverdue } from './adminToolUtils';

function AdminMaintenanceSection() {
    const { tools, loading, markMaintained } = useAdminTools();
    const [searchQuery, setSearchQuery] = useState('');

    const overdueTools = (tools ?? []).filter(isOverdue);
    const filteredTools = overdueTools.filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section>
            <p className="admin-lede">
                Tools that have passed their maintenance period and need servicing.
            </p>

            <div className="row g-3 mb-3">
                <div className="col-12">
                    <input
                        type="search"
                        className="admin-input"
                        placeholder="Search tools by name..."
                        aria-label="Search tools by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Last maintained</th>
                            <th>Maintenance period</th>
                            <th className="admin-num">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={4} className="admin-table-empty">Loading tools...</td>
                            </tr>
                        )}

                        {!loading && filteredTools.length === 0 && (
                            <tr>
                                <td colSpan={4} className="admin-table-empty">
                                    {searchQuery ? `No tools match "${searchQuery}"` : 'No tools found.'}
                                </td>
                            </tr>
                        )}

                        {filteredTools.map((tool) => (
                            <tr key={tool.id}>
                                <td>{tool.name}</td>
                                <td>{new Date(tool.lastMaintained).toDateString()}</td>
                                <td>{tool.maintenancePeriod} days</td>
                                <td className="admin-num">
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn--ghost"
                                        onClick={() => markMaintained(tool.id)}
                                    >
                                        Mark maintained
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default AdminMaintenanceSection;
