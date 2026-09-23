/**
 * Inventory: every tool in the makerspace, with a search box and an Edit
 * button on each row that opens the edit dialog.
 *
 * Same columns, same search, same buttons as before - this is the plain HTML
 * version of what used to be a MUI table.
 */

import { useState } from 'react';
import { useAdminTools } from '../../pages/Admin/useAdminTools';
import { isOverdue } from './adminToolUtils';
import type { Tool } from '../../types/tool';
import AdminEditToolModal from './AdminEditToolModal';

function AdminInventorySection() {
    const { tools, loading, error, removeTool, updateTool } = useAdminTools();

    // Which tool the dialog is editing. null means the dialog is closed.
    const [editingTool, setEditingTool] = useState<Tool | null>(null);

    // What has been typed in the search box.
    const [searchQuery, setSearchQuery] = useState('');

    // Both sides are lowercased so searching is not fussy about capitals.
    const filteredTools = (tools ?? []).filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section>
            <p className="admin-lede">Every tool currently in the makerspace.</p>

            {error && <p className="admin-error-note">{error}</p>}

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
                            <th>Status</th>
                            <th>Maintenance period</th>
                            <th>Last maintained</th>
                            <th className="admin-num">Daily rate</th>
                            {/* The Edit button's column. No heading to give it. */}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={6} className="admin-table-empty">
                                    {searchQuery ? `No Tools Match "${searchQuery}"` : 'No tools found.'}
                                </td>
                            </tr>
                        )}

                        {!loading && filteredTools.length === 0 && (
                            <tr>
                                <td colSpan={6} className="admin-table-empty">No tools found.</td>
                            </tr>
                        )}

                        {filteredTools.map((tool) => (
                            <tr key={tool.id}>
                                <td>{tool.name}</td>
                                <td>
                                    {/* Pills instead of plain words, so the state
                                        of a tool reads at a glance. */}
                                    <span className="admin-pill-group">
                                        {tool.isTakenOut ? (
                                            <span className="admin-pill admin-pill--blue">Taken out</span>
                                        ) : (
                                            <span className="admin-pill admin-pill--green">Available</span>
                                        )}
                                        {isOverdue(tool) && (
                                            <span className="admin-pill admin-pill--amber">Overdue</span>
                                        )}
                                    </span>
                                </td>
                                <td>{tool.maintenancePeriod} days</td>
                                <td>{new Date(tool.lastMaintained).toDateString()}</td>
                                <td className="admin-num">${tool.dailyRate.toFixed(2)}</td>
                                <td className="admin-num">
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn--ghost"
                                        onClick={() => setEditingTool(tool)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminEditToolModal
                open={editingTool !== null}
                tool={editingTool}
                onClose={() => setEditingTool(null)}
                onDelete={removeTool}
                onSave={updateTool}
            />
        </section>
    );
}

export default AdminInventorySection;
