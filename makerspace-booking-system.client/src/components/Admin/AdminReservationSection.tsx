import { useState } from 'react';
import {
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
    TextField, MenuItem, Stack
} from '@mui/material';
import { useAdminReservation } from '../../pages/Admin/useAdminReservation';
import { useAdminTools } from '../../pages/Admin/useAdminTools';

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
            <h2>Reservations</h2>
            <p>All reservations made across every tool. Filter by tool, user, or date range.</p>

            {error && <p className="admin-error-note">{error}</p>}

            <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    select
                    label="Tool"
                    size="small"
                    value={toolId}
                    onChange={(e) => setToolId(e.target.value)}
                    sx={{ minWidth: 180 }}
                >
                    <MenuItem value="">All tools</MenuItem>
                    {tools?.map((tool) => (
                        <MenuItem key={tool.id} value={tool.id}>{tool.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="User ID"
                    size="small"
                    placeholder="Search by user id…"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />

                <TextField
                    label="From"
                    type="date"
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <TextField
                    label="To"
                    type="date"
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </Stack>

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Tool</TableCell>
                            <TableCell>User Id</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Amount Charged</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={7}>Loading reservations…</TableCell>
                            </TableRow>
                        )}

                        {!loading && (reservations?.length ?? 0) === 0 && (
                            <TableRow>
                                <TableCell colSpan={7}>No reservations match these filters.</TableCell>
                            </TableRow>
                        )}

                        {reservations?.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.id}</TableCell>
                                <TableCell>{r.tool ? r.tool.name : `#${r.toolId}`}</TableCell>
                                <TableCell>{r.userId}</TableCell>
                                <TableCell>{r.status}</TableCell>
                                <TableCell>{new Date(r.startDay).toDateString()}</TableCell>
                                <TableCell>{new Date(r.endDay).toDateString()}</TableCell>
                                <TableCell>${r.amountCharged}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </section>
    );
}

export default AdminReservationSection;