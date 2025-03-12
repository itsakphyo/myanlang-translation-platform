"use client";

import React, { createContext, useContext, useState } from 'react';

type DialogType =
    | 'issue-report'
    | 'payment-issue'
    | 'appeal-request'
    | null;

type DialogData = {
    taskId?: number;
    withdrawalId?: number;
    souce_language_id?: number;
    target_language_id?: number;
};

type DialogContextType = {
    isOpen: boolean;
    dialogType: DialogType;
    dialogData: DialogData;
    openDialog: (type: DialogType, data?: DialogData) => void;
    closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType>({} as DialogContextType);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogType, setDialogType] = useState<DialogType>(null);
    const [dialogData, setDialogData] = useState<DialogData>({});

    const openDialog = (type: DialogType, data?: DialogData) => {
        setDialogType(type);
        setDialogData(data || {});
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setDialogType(null);
        setDialogData({});
    };

    return (
        <DialogContext.Provider
            value={{ isOpen, dialogType, dialogData, openDialog, closeDialog }}
        >
            {children}
        </DialogContext.Provider>
    );
};

export const useDialog = () => useContext(DialogContext);