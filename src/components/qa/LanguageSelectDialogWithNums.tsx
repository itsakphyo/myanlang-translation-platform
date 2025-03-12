"use client";

import React, { useState, useEffect } from 'react';
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
    Box,
    Typography,
    useTheme,
} from '@mui/material';
import { LanguagePair } from '@/types/language';
import { useTask } from '@/hooks/useTask';

interface LanguageSelectDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (pair: LanguagePair) => void;
    countsData: any;
}

const LanguageSelectDialogWithNums: React.FC<LanguageSelectDialogProps> = ({
    open,
    onClose,
    onConfirm,
    countsData,
}) => {
    // State for the selected language pair index
    const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
    const theme = useTheme();
    // Define responsive breakpoints: fullScreen for desktop, responsive on mobile.
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Get language pairs and counts from your custom hook
    const { getAllLanguagePairs } = useTask();
    const language_pairs: LanguagePair[] = getAllLanguagePairs.data ?? [];

    // Reset selection whenever the language pair list updates.
    useEffect(() => {
        if (language_pairs.length > 0) {
            setSelectedPairIndex(0);
        }
    }, [language_pairs]);

    const getCountForPair = (pair: LanguagePair, type: 'task' | 'assessmenttask'): number => {
        if (!countsData) return 0;
    
        const findCount = (source_id: number, target_id: number) => 
            countsData[type].task_by_language_pair.find(
                (item: { sourcelanguage_id: number; targetlanguage_id: number; count: number }) =>
                    item.sourcelanguage_id === source_id && item.targetlanguage_id === target_id
            );
    
        let countEntry = findCount(pair.source_id, pair.target_id);
        
        if (!countEntry) {
            countEntry = findCount(pair.target_id, pair.source_id);
        }
    
        return countEntry ? countEntry.count : 0;
    };
    

    // Filter language pairs to only include those with counts
    const filteredLanguagePairs = language_pairs.filter(pair => {
        const taskCount = getCountForPair(pair, 'task');
        const assessmentCount = getCountForPair(pair, 'assessmenttask');
        return taskCount > 0 || assessmentCount > 0;
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDialog-paper': {
                    width: isSmallScreen ? '90%' : '500px',
                    maxWidth: isSmallScreen ? '90%' : '500px',
                    margin: '16px auto',
                    borderRadius: '8px',
                },
            }}
        >
            <DialogTitle>
                <Typography variant="h5" fontWeight="bold">
                    Select Language Pair
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Stack spacing={4}>
                    <FormControl fullWidth>
                        <Select
                            value={selectedPairIndex}
                            onChange={(e) => setSelectedPairIndex(Number(e.target.value))}
                            sx={{
                                borderRadius: 1,
                                backgroundColor: 'background.paper',
                                '.MuiSelect-select': {
                                    padding: theme.spacing(1.5),
                                },
                            }}
                        >
                            {filteredLanguagePairs.map((pair, index) => {
                                const taskCount = getCountForPair(pair, 'task');
                                const assessmentCount = getCountForPair(pair, 'assessmenttask');
                                return (
                                    <MenuItem key={index} value={index}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                width: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ flex: 1 }}>
                                                {pair.source.charAt(0).toUpperCase() + pair.source.slice(1)} →{' '}
                                                {pair.target.charAt(0).toUpperCase() + pair.target.slice(1)}
                                            </Typography>
                                            <Box sx={{ textAlign: 'right', ml: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Tasks: {taskCount}
                                                </Typography>
                                                <br />
                                                <Typography variant="caption" color="text.secondary">
                                                    Assessments: {assessmentCount}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => {
                            onConfirm(filteredLanguagePairs[selectedPairIndex]);
                            onClose();
                        }}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                        }}
                    >
                        Confirm Selection
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default LanguageSelectDialogWithNums;
