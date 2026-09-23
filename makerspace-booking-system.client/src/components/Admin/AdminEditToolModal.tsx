/**
 * The dialog that opens when Edit is clicked on a row in the inventory.
 *
 * Takes a tool, lets its five fields be changed, and hands the changes back to
 * whoever opened it. It does not save anything itself.
 *
 * Props:
 * - tool      the tool being edited, or null when nothing is
 * - open      whether the dialog should be on screen
 * - onClose   called when Cancel, the backdrop or a finished save closes it
 * - onSave    called with the tool's id and the changed fields
 * - onDelete  called with the tool's id, after the user confirms
 */

import { useEffect, useState, useRef } from 'react';
import type { Tool } from '../../types/tool';
import type { ToolUpdate } from '../../pages/Admin/useAdminTools';

type Props = {
    tool: Tool | null;
    open: boolean;
    onClose: () => void;
    onSave: (toolId: number, changes: ToolUpdate) => Promise<void>;
    onDelete: (toolId: number) => Promise<void>;
}

function toDateInputValue(date: Date) {
    return new Date(date).toISOString().slice(0, 10);
}


function AdminEditToolModal({ tool, open, onClose, onSave, onDelete }: Props) {
    const [name, setName] = useState<string>('');
    const [isTakenOut, setIsTakenOut] = useState<boolean>(false);
    const [maintenancePeriod, setMaintenancePeriod] = useState<number>(0);
    const [lastMaintained, setLastMaintained] = useState<string>('');
    const [dailyRate, setDailyRate] = useState<number>(0);
    const [saving, setSaving] = useState<boolean>(false);
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Runs whenever a different tool is handed in, and copies its values into
    // the boxes so the dialog opens showing what is already there.
    useEffect(() => {
        if (tool) {
            setName(tool.name);
            setIsTakenOut(tool.isTakenOut);
            setMaintenancePeriod(tool.maintenancePeriod);
            setLastMaintained(toDateInputValue(tool.lastMaintained));
            setDailyRate(tool.dailyRate);
        }
    }, [tool]);

    // Returning null is React for "draw nothing at all here". Both checks sit
    // below the hooks above, because React needs every hook to run in the same
    // order on every redraw.
    if (!tool) return null;
    if (!open) return null;

    async function handleSave() {
        if (!tool) return;
        setSaving(true);
        await onSave(tool.id, {
            name,
            isTakenOut,
            maintenancePeriod: Number(maintenancePeriod),
            lastMaintained: new Date(lastMaintained),
            dailyRate: Number(dailyRate),
        });
        setSaving(false);
        onClose();
    }

    async function handleDelete() {
        if (!tool) return;
        if (window.confirm(`Are you sure you want to delete the tool "${tool.name}"? This action cannot be undone.`)) {
            await onDelete(tool.id);
            onClose();
        }
    }

    return (
        <div
            className="admin-modal-backdrop"
            /*
             * Closes when the dark area around the dialog is clicked, which is
             * what the old MUI dialog did. The check makes sure a click inside
             * the dialog does not count - without it, clicking any field would
             * close the whole thing.
             */
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Edit tool">
                <div className="admin-modal-head">
                    <h2 className="admin-modal-title">Edit tool</h2>
                </div>

                <div className="admin-modal-body">
                    <div>
                        <label className="admin-field-label" htmlFor="edit-name">Name</label>
                        <input
                            id="edit-name"
                            className="admin-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="admin-field-label" htmlFor="edit-status">Status</label>
                        <select
                            id="edit-status"
                            className="admin-input"
                            value={isTakenOut ? 'true' : 'false'}
                            onChange={(e) => setIsTakenOut(e.target.value === 'true')}
                        >
                            <option value="false">Available</option>
                            <option value="true">Taken out</option>
                        </select>
                    </div>

                    <div>
                        <label className="admin-field-label" htmlFor="edit-period">
                            Maintenance period (days)
                        </label>
                        <input
                            id="edit-period"
                            className="admin-input"
                            type="number"
                            value={maintenancePeriod}
                            onChange={(e) => setMaintenancePeriod(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label className="admin-field-label" htmlFor="edit-maintained">Last maintained</label>
                        <input
                            id="edit-maintained"
                            className="admin-input"
                            type="date"
                            ref={dateInputRef}
                            value={lastMaintained}
                            onChange={(e) => setLastMaintained(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="admin-field-label" htmlFor="edit-rate">Daily rate</label>
                        <input
                            id="edit-rate"
                            className="admin-input"
                            type="number"
                            value={dailyRate}
                            onChange={(e) => setDailyRate(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="admin-modal-foot">
                    <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>
                        Delete tool
                    </button>
                    <div className="admin-modal-actions">
                        <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="admin-btn admin-btn--primary"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminEditToolModal;
