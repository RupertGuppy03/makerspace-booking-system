/**
 * the dashboard is just an overview of the tools for now will ipdate properly
 * later
 */

import { useAdminTools } from "../../pages/Admin/useAdminTools"
import { isOverdue } from "./adminToolUtils";


function AdminDashboardSection() {
    const { tools, loading } = useAdminTools();

    const toolList = tools ?? [];
    const totalTools = toolList.length;
    const takenOut = toolList.filter((t) => t.isTakenOut).length;
    const overdue = toolList.filter(isOverdue).length;

    return (
        <section>
            <h2>Dashboard</h2>
            <p>this just shows the summary of the makerspace</p>

            <div className="admin-summary-grid">
                <article className="admin-summary-card">
                    <p className="admin-summary-value">{loading ? '-' : totalTools}</p>
                    <p className="admin-summary-label">Total tools</p>
                </article>

                <article className="admin-summary-card">
                    <p className="admin-summary-value">{loading ? '-' : takenOut}</p>
                    <p className="admin-summary-label">Currently taken out</p>
                </article>

                <article className="admin-summary-card">
                    <p className="admin-summary-value">{loading ? '-' : overdue}</p>
                    <p className="admin-summary-label">Overdue for maintenance</p>
                </article>

                {loading && <p className="admin-loading-note">Loading tool date</p>}
            </div>
        </section>
    );
}

export default AdminDashboardSection;