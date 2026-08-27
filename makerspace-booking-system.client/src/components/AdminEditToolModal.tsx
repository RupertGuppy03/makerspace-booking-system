import { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Stack, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import type { Tool } from '../types/tool';
import type { ToolUpdate } from '../pages/Admin/useAdminTools';
import { useRef } from 'react';

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

    useEffect(() => {
        if (tool) {
            setName(tool.name);
            setIsTakenOut(tool.isTakenOut);
            setMaintenancePeriod(tool.maintenancePeriod);
            setLastMaintained(toDateInputValue(tool.lastMaintained));
            setDailyRate(tool.dailyRate);
        }
    }, [tool]);

    if (!tool) return null;

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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Edit tool</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />

                    <FormControl fullWidth>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            label="Status"
                            value={isTakenOut ? 'true' : 'false'}
                            onChange={(e) => setIsTakenOut(e.target.value === 'true')}
                        >
                            <MenuItem value="false">Available</MenuItem>
                            <MenuItem value="true">Taken out</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Maintenance period (days)"
                        type="number"
                        value={maintenancePeriod}
                        onChange={(e) => setMaintenancePeriod(Number(e.target.value))}
                        fullWidth
                    />

                    <TextField
                        label="Last maintained"
                        type="date"
                        value={lastMaintained}
                        onChange={(e) => setLastMaintained(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                        inputRef={dateInputRef}
                        onClick={() => dateInputRef.current}

                    />

                    <TextField
                        label="Daily rate"
                        type="number"
                        value={dailyRate}
                        onChange={(e) => setDailyRate(Number(e.target.value))}
                        fullWidth
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
                <Button color="error" onClick={handleDelete}>
                    Delete tool
                </Button>
                <Stack direction="row" spacing={1}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}

export default AdminEditToolModal;