/**
 * Add tools: the form for registering a new tool in the inventory.
 *
 * Same four fields and the same submit as before - this is the plain HTML
 * version of what used to be a MUI form.
 */

import { useState } from 'react';
import { useAdminTools } from '../../pages/Admin/useAdminTools';

function AdminAddToolSection() {
    const { addTool } = useAdminTools();
    const [name, setName] = useState('');
    const [maintenancePeriod, setMaintenancePeriod] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [lastMaintained, setLastMaintained] = useState('');
    const [dailyRate, setDailyRate] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await addTool({
            name,
            maintenancePeriod: Number(maintenancePeriod),
            isTakenOut: false,                              //default to false
            lastMaintained: new Date(lastMaintained),
            createdAt: new Date(),                          //default to the day the form is submitted
            dailyRate: Number(dailyRate)
        });
        setSubmitted(true);
        setName('');
        setMaintenancePeriod('');
        setDailyRate('');
        setLastMaintained('');
    }

    return (
        <section>
            <p className="admin-lede">Register a new tool in the makerspace inventiry</p>

            <form onSubmit={handleSubmit} className="admin-form-card">
                <div className="row g-3">

                    {/* Tool Name inputField */}
                    <div className="col-12">
                        <label className="admin-field-label" htmlFor="tool-name">Tool name</label>
                        <input
                            id="tool-name"
                            className="admin-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* maintenacePeriod inputField */}
                    <div className="col-12">
                        <label className="admin-field-label" htmlFor="maintenance-period">
                            Maintenance period
                        </label>
                        <input
                            id="maintenance-period"
                            className="admin-input"
                            value={maintenancePeriod}
                            onChange={(e) => setMaintenancePeriod(e.target.value)}
                            required
                        />
                        <p className="admin-form-hint">In days. How long before it needs servicing again.</p>
                    </div>

                    {/* lastMaintained (Date) inputField */}
                    <div className="col-12">
                        <label className="admin-field-label" htmlFor="last-maintained">Last maintained</label>
                        <input
                            id="last-maintained"
                            className="admin-input"
                            type="date"
                            value={lastMaintained}
                            onChange={(e) => setLastMaintained(e.target.value)}
                            required
                        />
                    </div>

                    {/* dailyRate inputField */}
                    <div className="col-12">
                        <label className="admin-field-label" htmlFor="daily-rate">Daily rate</label>
                        <input
                            id="daily-rate"
                            className="admin-input"
                            value={dailyRate}
                            onChange={(e) => setDailyRate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-12">
                        <button type="submit" className="admin-btn admin-btn--primary">
                            Add tool
                        </button>
                    </div>
                </div>

                {submitted && <p className="admin-success-note">Tool added successfully!</p>}
            </form>
        </section>
    );
}

export default AdminAddToolSection;
