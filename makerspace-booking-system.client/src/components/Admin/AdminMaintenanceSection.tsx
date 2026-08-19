import {
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button,
} from '@mui/material';
import { useAdminTools } from "../../pages/Admin/useAdminTools";
import { isOverdue } from "./adminToolUtils";

function AdminMaintenanceSection() {
    const { tools, loading, markMaintained } = useAdminTools();

    const overdueTools = (tools ?? []).filter(isOverdue);

    return (
        <section>
            <h2>Maintenance</h2>
            <p>Tools that have passed their maintenance period and need servicing.</p>

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

                        {!loading && overdueTools.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>Nothing overdue right now.</TableCell>
                            </TableRow>
                        )}

                        {overdueTools.map((tool) => (
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