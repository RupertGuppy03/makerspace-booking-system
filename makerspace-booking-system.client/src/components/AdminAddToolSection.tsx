import { Button, Stack } from "@mui/material";
import { useAdminTools } from "../pages/Admin/useAdminTools";
import { useState } from 'react';

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
              <h2>Add Tools</h2>
              <p>Register a new tool in the makerspace inventiry</p>

              <form onSubmit={handleSubmit} className="admin-add-tool-form">
                  <Stack spacing={2} sx={{ maxWidth: 360 }}>

                      {/* Tool Name inputField */}
                      <div className="admin-form-field">
                          <label htmlFor="tool-name">Tool Name</label>
                          <input
                              id="tool-name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                          />
                      </div>

                      {/* maintenacePeriod inputField */}
                      <div className="admin-form-field">
                          <label htmlFor="maintenance-period">Maintenance Period</label>
                          <input
                              id="maintenance-period"
                              value={maintenancePeriod}
                              onChange={(e) => setMaintenancePeriod(e.target.value)}
                              required
                          />
                      </div>

                      {/* lastMaintained (Date) inputField */}
                      <div className="admin-form-field">
                          <label htmlFor="last-maintained">Last Maintained</label>
                          <input
                              id="last-maintained"
                              type="date"
                              value={lastMaintained}
                              onChange={(e) => setLastMaintained(e.target.value)}
                              required
                          />
                      </div>

                      {/* dailyRate inputField */}
                      <div className="admin-form-field">
                          <label htmlFor="daily-rate">Daily Rate</label>
                          <input
                              id="daily-rate"
                              value={dailyRate}
                              onChange={(e) => setDailyRate(e.target.value)}
                              required
                          />
                      </div>
                      
                      <Button type="submit" variant="contained">
                          Add tool
                      </Button>
                      {submitted && <p>Tool added successfully!</p>}
                  </Stack>
              </form>
          </section>
      );
}

export default AdminAddToolSection;