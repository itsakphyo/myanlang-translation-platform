"use client"

import { useState, useEffect } from "react"
import { Button, Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Grid, Box } from "@mui/material"
import { Language as LanguageIcon } from "@mui/icons-material"
import { CustomFlags } from "./custom-flags"
import { useSystemLanguage } from "@/contexts/language-context"
import { SystemLanguageCode } from "@/types/systemLanguages"
import chinFlag from "@/assets/images/chin.svg";
import kachinFlag from "@/assets/images/kachin.svg";

interface SystemLanguage {
    code: string
    name: string
    flag: string | JSX.Element
}

const systemlanguages: SystemLanguage[] = [
    { code: "en", name: "English", flag: <CustomFlags.UK /> },
    { code: "my", name: "မြန်မာ", flag: <CustomFlags.Myanmar /> },
    { code: "cat", name: "Kachin", flag: <img src={kachinFlag} alt="Kachin Flag" style={{ width: "36px", height: "24px" }} /> },
    { code: "chin", name: "Chin", flag: <img src={chinFlag} alt="Chin Flag" style={{ width: "36px", height: "24px" }} /> },
]

export function SystemLanguageSelector(): JSX.Element {
    const [open, setOpen] = useState<boolean>(false)
    const { systemLanguage: currentSystemLanguage, setSystemLanguage } = useSystemLanguage()

    const handleSystemLanguageSelect = (languageCode: string): void => {
        const langCode = languageCode as SystemLanguageCode
        localStorage.setItem("selectedLanguage", langCode)
        setSystemLanguage(langCode)
        console.log("selectedLanguage:", langCode)
        setOpen(false)
    }

    // Update initial state to use context language
    const [selectedSystemLanguage, setSelectedSystemLanguage] = useState<SystemLanguageCode>(currentSystemLanguage)

    // Add useEffect to sync with context changes
    useEffect(() => {
        setSelectedSystemLanguage(currentSystemLanguage)
    }, [currentSystemLanguage])

    // Find the selected language for display
    const selectedSystemLang: SystemLanguage | undefined = selectedSystemLanguage
        ? systemlanguages.find((lang: SystemLanguage) => lang.code === selectedSystemLanguage)
        : undefined

    return (
        <>
            <Button
                variant={selectedSystemLang ? "contained" : "outlined"}
                onClick={() => setOpen(true)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: 8,
                    textTransform: 'none',
                    minWidth: 140,
                    transition: 'all 0.2s ease',
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    '&:hover': {
                        bgcolor: selectedSystemLang ? 'primary.dark' : 'action.hover',
                        boxShadow: 2,
                    },
                    borderColor: 'divider',
                    boxShadow: 1,
                    px: 2.5,
                    py: 1
                }}
            >
                {selectedSystemLang ? (
                    <>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            mr: 0.5,
                            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
                        }}>
                            {selectedSystemLang.flag}
                        </Box>
                        <Typography variant="body1" fontWeight="500">
                            {selectedSystemLang.name}
                        </Typography>
                    </>
                ) : (
                    <>
                        <LanguageIcon sx={{
                            fontSize: 20,
                            color: 'inherit'
                        }} />
                        <Typography variant="body1" fontWeight="500">
                            Change System Language
                        </Typography>
                    </>
                )}
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 2
                }}>
                    <Typography variant="h6" fontWeight="600">
                        Choose System Language
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 2 }}>
                    <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                        {systemlanguages.map((systemLanguage: SystemLanguage) => (
                            <Grid item xs={6} sm={4} key={systemLanguage.code}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        border: selectedSystemLanguage === systemLanguage.code ?
                                            '2px solid' : '1px solid',
                                        borderColor: selectedSystemLanguage === systemLanguage.code ?
                                            'primary.main' : 'divider',
                                        bgcolor: selectedSystemLanguage === systemLanguage.code ?
                                            'rgba(25, 118, 210, 0.1)' : 'background.paper',
                                        boxShadow: 'none',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 1,
                                        },
                                    }}
                                    onClick={() => handleSystemLanguageSelect(systemLanguage.code)}
                                >
                                    <CardContent sx={{
                                        p: 1.5,
                                        '&:last-child': { pb: 1.5 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5
                                    }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            bgcolor: 'background.default',
                                            overflow: 'hidden',
                                            boxShadow: 1
                                        }}>
                                            {systemLanguage.flag}
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            fontWeight={500}
                                            color={selectedSystemLanguage === systemLanguage.code ?
                                                'primary.main' : 'text.primary'}
                                        >
                                            {systemLanguage.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    )
}