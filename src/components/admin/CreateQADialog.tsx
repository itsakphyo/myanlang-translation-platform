import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    CircularProgress,
  } from "@mui/material";
  import { useState } from "react";
  import { useQA } from "@/hooks/useQA";
  import { QAMemberCreate } from "@/types/qaMember";
  
  interface CreateQAProps {
    open: boolean;
    onClose: () => void;
  }
  
  export default function QAMemberCreateDialog({ open, onClose }: CreateQAProps) {
    const { createQAMember } = useQA();
    const [qaMember, setQaMember] = useState<QAMemberCreate>({
      full_name: "",
      email: "",
      password: "",
    });
  
    const [errors, setErrors] = useState<{ full_name?: string; email?: string; password?: string }>({});
    const [apiError, setApiError] = useState<string | null>(null);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setQaMember((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error when user types
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      // Basic validation
      const newErrors: typeof errors = {};
      if (!qaMember.full_name) newErrors.full_name = "Full Name is required.";
      if (!qaMember.email) newErrors.email = "Email is required.";
      if (!qaMember.password) newErrors.password = "Password is required.";
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      setApiError(null);
  
      createQAMember.mutate(qaMember, {
        onSuccess: () => {
          onClose();
          setQaMember({ full_name: "", email: "", password: "" });
        },
        onError: (error: any) => {
          setApiError(error.response?.data?.message || "An error occurred.");
        },
      });
    };
  
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              overflow: "hidden",
            },
          },
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle
            sx={(theme) => ({
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              color: theme.palette.primary.contrastText,
              py: 2,
              px: 3,
            })}
          >
            Create QA Member
          </DialogTitle>
          <DialogContent sx={{ py: 3, px: 3 }}>
            {/* Full Name */}
            <TextField
              autoFocus
              required
              margin="dense"
              id="full_name"
              name="full_name"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={qaMember.full_name}
              onChange={handleChange}
              error={Boolean(errors.full_name)}
              helperText={errors.full_name}
            />
            {/* Email */}
            <TextField
              required
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={qaMember.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            {/* Password */}
            <TextField
              required
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="text"
              fullWidth
              variant="outlined"
              value={qaMember.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
            {/* API Error Message */}
            {apiError && (
              <Box sx={{ color: "error.main", mt: 2, fontSize: "0.875rem" }}>{apiError}</Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} variant="outlined" disabled={createQAMember.isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={createQAMember.isPending}>
              {createQAMember.isPending ? <CircularProgress size={24} color="inherit" /> : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    );
  }
  