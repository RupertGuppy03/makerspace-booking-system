import {
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button,
    TextField
} from '@mui/material';
import { useAdminTools } from "../../pages/Admin/useAdminTools";
import { isOverdue } from './adminToolUtils';
import { useState } from 'react';
import type { Tool } from "../../../src/types/tool";
import AdminEditToolModal from './AdminEditToolModal';


function AdminInventorySection() {
    const { tools, loading, error, removeTool, updateTool } = useAdminTools();
    const [editingTool, setEditingTool] = useState<Tool | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTools = (tools ?? []).filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section>
            <h2>Inventory</h2>
            <p>Every tool currently in the makerspace.</p>

            {error && <p className="admin-error-note">{error}</p>}

            <TextField 
                size="small"
                placeholder="Search tools by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-bar"
                fullWidth

                // -------- Can remove this block when styling is finalized --------
                 sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#fff',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#fff',
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: '#fff',
                        opacity: 1,
                    },
                 }}
                 // --------------------------------------------------------------------

            />

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
                                <TableCell colSpan={4}>
                                    {searchQuery ? `No Tools Match "${searchQuery}"` : 'No tools found.'}
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && filteredTools.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>No tools found.</TableCell>
                            </TableRow>
                        )}

                        {filteredTools.map((tool) => (
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