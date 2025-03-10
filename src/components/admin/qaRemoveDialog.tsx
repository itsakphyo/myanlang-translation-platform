import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography, Box } from '@mui/material';
import { QAMember } from '@/types/qaMember';
import { useQA } from '@/hooks/useQA';

interface DeleteDialogProps {
    open: boolean;
    qa_member: QAMember;
    onClose: () => void;
}

export default function RemoveQADialog({ open, onClose, qa_member }: DeleteDialogProps) {

    const { removeQAMember } = useQA();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        removeQAMember.mutate(qa_member.qa_member_id);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: { padding: 3, borderRadius: 2 },
                },
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Confirm Removal
                </DialogTitle>
                <DialogContent>
                    <Box mb={2}>
                        <Typography variant="body1" color="text.primary">
                            Remove QA Member {qa_member.full_name} from the system?
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                    >
                        Remove QA Member
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}