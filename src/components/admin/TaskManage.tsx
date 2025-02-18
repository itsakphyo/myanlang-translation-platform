import { Backdrop, Box, SpeedDial, SpeedDialAction, SpeedDialIcon, Modal, Typography } from "@mui/material";
import Grid2 from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import QAMemberCreateDialog from "./CreateQADialog";
import { useQA } from "@/hooks/useQA";
import { QAMember as QAMemberType } from "@/types/qaMember";
import CreateAssJobDialog from "./CreateAssJobDialog";
import CreateLanguageDialog from "./CreateLanguageDialog";

import JQACard from "./qaCard";

export default function TaskManage() {
    const [open, setOpen] = useState(false);
    const [isCreateQAOpen, setIsCreateQAOpen] = useState(false);
    const [isCreateNewLanguageOpen, setIsCreateNewLanguageOpen] = useState(false);

    // const { getAllQAMembers } = useQA();
    // const { data: qa_members, isLoading, isError, refetch } = getAllQAMembers;

    const handleOpen = async () => {
        setOpen(true);
        // await refetch();
    }
    const handleClose = async () => {
        setOpen(false);
        // await refetch();
    }

    const handleCreateQAOpen = async () => {
        setIsCreateQAOpen(true);
        // await refetch();
    };

    const handleCreateQAClose = async () => {
        setIsCreateQAOpen(false);
        // await refetch();
    };

    const handleCreateLanguageOpen = async () => {
        setIsCreateNewLanguageOpen(true);
        // await refetch();
    };

    const handleCreateLanguageClose = async () => {
        setIsCreateNewLanguageOpen(false);
        // await refetch();
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
                zIndex: 1300,
                width: '100%',
            }}
        >
            {/* {isLoading && <Box>Loading jobs...</Box>}
      {isError && <Box>Error loading jobs.</Box>} */}

            <Modal open={isCreateNewLanguageOpen} onClose={handleCreateLanguageClose} sx={{ zIndex: 1300 }}>
                <CreateLanguageDialog open={isCreateNewLanguageOpen} onClose={handleCreateLanguageClose} />
            </Modal>

            <Modal open={isCreateQAOpen} onClose={handleCreateQAClose} sx={{ zIndex: 1300 }}>
                <CreateAssJobDialog open={isCreateQAOpen} onClose={handleCreateQAClose} />
            </Modal>


            {/* {!isLoading && !isError && qa_members && (
        <Grid2 container spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
          {qa_members.map((qa_member: QAMemberType) => (
            <Grid2
              key={qa_member.qa_member_id}
              sx={{
                width: '96%',
                marginLeft: '2%',
                marginRight: '2%',
                position: 'relative',
              }}
              component="div"
            >
              <Typography variant="h5" gutterBottom>
                <JQACard member={qa_member} />
              </Typography>
            </Grid2>
          ))}
        </Grid2>
      )} */}

            <Backdrop open={open} onClick={handleClose} sx={{ zIndex: 1300 }} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1300 }}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                <SpeedDialAction
                    icon={<AddIcon />}
                    tooltipTitle="Add-Assessment-Task"
                    tooltipOpen
                    onClick={handleCreateQAOpen}
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
