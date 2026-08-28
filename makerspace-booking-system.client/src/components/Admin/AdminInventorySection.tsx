import {
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button
} from '@mui/material';
import { useAdminTools } from "../../pages/Admin/useAdminTools";
import { isOverdue } from './adminToolUtils';
import { useState } from 'react';
import type { Tool } from "../types/tool";
import AdminEditToolModal from './AdminEditToolModal';


function AdminInventorySection() {
    const { tools, loading, error, removeTool, updateTool } = useAdminTools();
    const [editingTool, setEditingTool] = useState<Tool | null>(null);

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
                                        className="admin-edit-button"
                                        onClick={() => setEditingTool(tool)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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