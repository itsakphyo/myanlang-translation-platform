import { Backdrop, Box, SpeedDial, SpeedDialAction, SpeedDialIcon, Modal, Typography } from "@mui/material";
import Grid2 from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import QAMemberCreateDialog from "./CreateQADialog";
import { useQA } from "@/hooks/useQA";
import { QAMember as QAMemberType } from "@/types/qaMember";


import QACard from "./qaCard";

export default function QADashboard() {
  const [open, setOpen] = useState(false);
  const [isCreateQAOpen, setIsCreateQAOpen] = useState(false);

  const { getAllQAMembers } = useQA();
  const { data: qa_members, isLoading, isError, refetch } = getAllQAMembers;

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
    await refetch();
  };

  const handleCreateQAClose = async () => {
    setIsCreateQAOpen(false);
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
      {/* {isLoading && <Box>Loading jobs...</Box>}
      {isError && <Box>Error loading jobs.</Box>} */}

      {/* <Modal open={isCreateJobOpen} onClose={handleCreateJobClose} sx={{ zIndex: 1300 }}>
        <CreateJobDialog open={isCreateJobOpen} onClose={handleCreateJobClose} />
      </Modal> */}

        <QAMemberCreateDialog open={isCreateQAOpen} onClose={handleCreateQAClose} />    

      {!isLoading && !isError && qa_members && (
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
                <QACard member={qa_member} />
              </Typography>
            </Grid2>
          ))}
          <Box sx={{ height: 100 }} />
        </Grid2>
      )}

      <Backdrop open={open} onClick={handleClose} sx={{ zIndex: 1500  }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1500  }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add-QA"
          tooltipOpen
          onClick={handleCreateQAOpen}
        />
      </SpeedDial>
    </Box>
  );
}
