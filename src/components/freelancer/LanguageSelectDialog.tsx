import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';

export interface LanguagePair {
  source: string;
  target: string;
}

interface LanguageSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (pair: LanguagePair) => void;
}

const LanguageSelectDialog: React.FC<LanguageSelectDialogProps> = ({ 
  open, 
  onClose, 
  onConfirm 
}) => {
  const language_pairs: LanguagePair[] = [
    { source: 'english', target: 'burmese' },
    { source: 'english', target: 'chinese' },
    { source: 'english', target: 'french' },
    { source: 'english', target: 'german' },
    { source: 'english', target: 'hindi' },
    { source: 'english', target: 'italian' },
    { source: 'english', target: 'japanese' },
    { source: 'english', target: 'korean' },
    { source: 'english', target: 'portuguese' },
    { source: 'english', target: 'russian' },
    { source: 'english', target: 'spanish' },
    { source: 'english', target: 'thai' },
    { source: 'english', target: 'vietnamese' },
    // Add more pairs as needed
  ];

  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);

  // Use MUI's useTheme and useMediaQuery to detect screen size
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      // Remove fullScreen to keep the dialog responsive on mobile
      sx={{
        '& .MuiDialog-paper': {
          width: isMobile ? '90%' : 'auto',      // 90% width on mobile, auto on larger screens
          maxWidth: isMobile ? '90%' : '500px',    // 90% max width on mobile, 500px on larger screens
          margin: '16px auto',                    // Centered with margin on all screens
          borderRadius: '8px',                     // Consistent border radius
        },
      }}
    >
      <DialogTitle>Select Language Pair</DialogTitle>
      <DialogContent sx={{ pt: '20px !important' }}>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <Select
              value={selectedPairIndex}
              onChange={(e) => setSelectedPairIndex(Number(e.target.value))}
            >
              {language_pairs.map((pair, index) => (
                <MenuItem key={index} value={index}>
                  {`${pair.source.charAt(0).toUpperCase() + pair.source.slice(1)} → ${
                    pair.target.charAt(0).toUpperCase() + pair.target.slice(1)
                  }`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => {
              onConfirm(language_pairs[selectedPairIndex]);
              onClose();
            }}
          >
            Confirm Selection
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectDialog;
