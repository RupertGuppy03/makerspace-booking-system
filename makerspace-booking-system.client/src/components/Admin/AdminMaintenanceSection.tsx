import {
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button,
    TextField,
} from '@mui/material';
import { useAdminTools } from "../../pages/Admin/useAdminTools";
import { isOverdue } from "./adminToolUtils";
import { useState } from 'react';

function AdminMaintenanceSection() {
    const { tools, loading, markMaintained } = useAdminTools();
    const [searchQuery, setSearchQuery] = useState('');

    const overdueTools = (tools ?? []).filter(isOverdue);
    const filteredTools = overdueTools.filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section>
            <h2>Maintenance</h2>
            <p>Tools that have passed their maintenance period and need servicing.</p>

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

                //--------------------------------------------------------------------
            />

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Last maintained</TableCell>
                            <TableCell>Maintenance period</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={4}>Loading tools…</TableCell>
                            </TableRow>
                        )}

                        {!loading && filteredTools.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    {searchQuery ? `No tools match "${searchQuery}"` : 'No tools found.'}
                                </TableCell>
                            </TableRow>
                        )}

                        {filteredTools.map((tool) => (
                            <TableRow key={tool.id}>
                                <TableCell>{tool.name}</TableCell>
                                <TableCell>{new Date(tool.lastMaintained).toDateString()}</TableCell>
                                <TableCell>{tool.maintenancePeriod} days</TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => markMaintained(tool.id)}
                                    >
                                        Mark maintained
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

export default AdminMaintenanceSection;