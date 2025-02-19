import { Backdrop, Box, SpeedDial, SpeedDialAction, SpeedDialIcon, Modal, Typography } from "@mui/material";
import Grid2 from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import CreateAssJobDialog from "./CreateAssJobDialog";
import CreateLanguageDialog from "./CreateLanguageDialog";
import { useJob } from "@/hooks/useJob";
import AssTaskCard from "./AssTaskCard";
import { AssJob } from "@/types/job";

export default function TaskManage() {
    const [open, setOpen] = useState(false);
    const [isCreateQAOpen, setIsCreateQAOpen] = useState(false);
    const [isCreateNewLanguageOpen, setIsCreateNewLanguageOpen] = useState(false);

    const { getAllAssJobs } = useJob();
    const { data: assJobs, isLoading, isError, refetch } = getAllAssJobs;

    const handleOpen = async () => {
        setOpen(true);
        await refetch();
    }
    const handleClose = async () => {
        setOpen(false);
        await refetch();
    }

    const handleCreateAssTaskOpen = async () => {
        setIsCreateQAOpen(true);
        await refetch();
    };

    const handleCreateAssTaskClose = async () => {
        setIsCreateQAOpen(false);
        await refetch();
    };

    const handleCreateLanguageOpen = async () => {
        setIsCreateNewLanguageOpen(true);
        await refetch();
    };

    const handleCreateLanguageClose = async () => {
        setIsCreateNewLanguageOpen(false);
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
                width: '100%',
            }}
        >

            <CreateLanguageDialog open={isCreateNewLanguageOpen} onClose={handleCreateLanguageClose} />

            <CreateAssJobDialog open={isCreateQAOpen} onClose={handleCreateAssTaskClose} />


            {!isLoading && !isError && assJobs && (
                <Grid2 container spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
                    {assJobs.map((assJobs: AssJob) => (
                        <Grid2
                            key={assJobs.job_id}
                            sx={{
                                width: '96%',
                                marginLeft: '2%',
                                marginRight: '2%',
                                position: 'relative',
                            }}
                            component="div"
                        >
                            <Typography variant="h5" gutterBottom>
                                <AssTaskCard job={assJobs} />
                            </Typography>
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
                    tooltipTitle="Add-Assessment-Task"
                    tooltipOpen
                    onClick={handleCreateAssTaskOpen}
                />
                <SpeedDialAction
                    icon={<AddIcon />}
                    tooltipTitle="Add-New-Language"
                    tooltipOpen
                    onClick={handleCreateLanguageOpen}
                />
            </SpeedDial>
        </Box>
    );
}
