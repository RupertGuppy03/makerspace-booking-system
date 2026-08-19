import {
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button
} from '@mui/material';
import { useAdminTools } from "../pages/Admin/useAdminTools";
import { isOverdue } from './adminToolUtils';


function AdminInventorySection() {
    const { tools, loading, error, removeTool } = useAdminTools();

    return (
        <section>
            <h2>Inventory</h2>
            <p>Every tool currently in the makerspace.</p>

            {error && <p className="admin-error-note">{error}</p>}

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Maintenance period</TableCell>
                            <TableCell>Last maintained</TableCell>
                            <TableCell>Daily Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={4}>Loading tools…</TableCell>
                            </TableRow>
                        )}

                        {!loading && (tools?.length ?? 0) === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>No tools found.</TableCell>
                            </TableRow>
                        )}

                        {tools?.map((tool) => (
                            <TableRow key={tool.id}>
                                <TableCell>{tool.name}</TableCell>
                                <TableCell>
                                    {tool.isTakenOut ? 'Taken out' : 'Available'}
                                    {isOverdue(tool) && ' · Overdue'}
                                </TableCell>
                                <TableCell>{tool.maintenancePeriod} days</TableCell>
                                <TableCell>
                                    {new Date(tool.lastMaintained).toDateString()}
                                </TableCell>
                                <TableCell>${tool.dailyRate.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        className="admin-delete-button"
                                        onClick={() => {
                                            if (window.confirm(`Delete ${tool.name}? This can't be undone.`)) {
                                                removeTool(tool.id);
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </section>
    );
}

export default AdminInventorySection;