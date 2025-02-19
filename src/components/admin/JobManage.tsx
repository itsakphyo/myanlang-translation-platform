import { Backdrop, Box, SpeedDial, SpeedDialAction, SpeedDialIcon, Modal } from "@mui/material";
import Grid2 from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import CreateJobDialog from "./CreateJobDialog";
import { useJob } from "@/hooks/useJob";
import { Job as JobType } from "@/types/job";

import JobCard from "./jobCard";

export default function JobDashboard() {
  const [open, setOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  const { getAllJobs } = useJob();
  const { data: jobs, isLoading, isError, refetch } = getAllJobs;

  const handleOpen = async () => {
    setOpen(true);
    await refetch();
  }
  const handleClose = async () => {
    setOpen(false);
    await refetch();
  }
  const handleCreateJobOpen = async () => {
    setIsCreateJobOpen(true);
    await refetch();
  };
  const handleCreateJobClose = async () => {
    setIsCreateJobOpen(false);
    await refetch();
  };

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        minHeight: '100vh',
        // zIndex: 1300,
        width: '100%',
      }}
    >
      {isLoading && <Box>Loading jobs...</Box>}
      {isError && <Box>Error loading jobs.</Box>}

      <CreateJobDialog open={isCreateJobOpen} onClose={handleCreateJobClose} />

      {!isLoading && !isError && jobs && (
        <Grid2 container spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
          {jobs.map((job: JobType) => (
            <Grid2
              key={job.job_id}
              sx={{
                width: '96%',
                marginLeft: '2%',
                marginRight: '2%',
                position: 'relative',
              }}
              component="div"
            >
              <JobCard job={job} />
            </Grid2>
          ))}
          <Box sx={{ height: 100 }} />
        </Grid2>
      )}

      <Backdrop open={open} onClick={handleClose} sx={{ zIndex: 1500 }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1500 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add-Job"
          tooltipOpen
          onClick={handleCreateJobOpen}
        />
      </SpeedDial>
    </Box>
  );
}
