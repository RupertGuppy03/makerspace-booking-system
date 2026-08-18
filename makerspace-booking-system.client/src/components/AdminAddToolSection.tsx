import { Button, Stack, TextField } from "@mui/material";
import { useAdminTools } from "../pages/Admin/useAdminTools";
import { useState } from 'react';

function AdminAddToolSection() {
    const { addTool } = useAdminTools();
    const [name, setName] = useState('');
    const [maintenancePeriod, setMaintenancePeriod] = useState('');
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await addTool({
            name,
            maintenancePeriod: Number(maintenancePeriod),
            isTakenOut: false,
            lastMaintained: new Date(),
            createdAt: new Date()
        });
        setSubmitted(true);
        setName('');
        setMaintenancePeriod('');
    }

      return (
          <section>
              <h2>Add Tools</h2>
              <p>Register a new tool in the makerspace inventiry</p>

              <form onSubmit={handleSubmit} className="admin-add-tool-form">
                  <Stack spacing={2} sx={{ maxWidth: 360 }}>
                      <TextField
                          label="Tool name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                      />
                      <TextField
                          label="Maintenance period (days)"
                          type="number"
                          value={maintenancePeriod}
                          onChange={(e) => setMaintenancePeriod(e.target.value)}
                          required
                      />
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