"use client";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  useTheme,
  Stack,
  Chip,
  useMediaQuery,
} from "@mui/material";
import {
  Email as EmailIcon,
  Person as PersonIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalanceWallet as WalletIcon,
  PendingActions as PendingActionsIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { useCurrentUser } from "@/hooks/useAuth";
import { SystemLanguageSelector } from "../language-selector";
import { useSystemLanguage } from "@/contexts/language-context";
import { translations } from "@/contexts/translation";

const UserProfile = () => {
  const { data: user } = useCurrentUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { systemLanguage } = useSystemLanguage();

  // Show a loading state until the user data is available
  if (!user) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Loading user information...
        </Typography>
      </Box>
    );
  }

  // Generate avatar from user's name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Info items for personal details
  const personalInfo = [
    { icon: <EmailIcon />, label: `${translations[systemLanguage].email}`, value: user.email },
    { icon: <PersonIcon />, label: `${translations[systemLanguage].y_o_b}`, value: user.age },
    { icon: <BadgeIcon />, label: `${translations[systemLanguage].user_id}`, value: user.freelancer_id },
  ];

  // Financial stats cards
  const financialStats = [
    {
      icon: <MonetizationOnIcon fontSize="large" />,
      label: `${translations[systemLanguage].total_earning}`,
      value: `${user.total_earnings} ${translations[systemLanguage].currency}`,
      color: "#4caf50",
    },
    {
      icon: <WalletIcon fontSize="large" />,
      label: `${translations[systemLanguage].total_withdraw}`,
      value: `${user.total_withdrawn} ${translations[systemLanguage].currency}`,
      color: "#4caf50",
    },
    {
      icon: <WalletIcon fontSize="large" />,
      label: `${translations[systemLanguage].current_balance}`,
      value: `${user.current_balance} ${translations[systemLanguage].currency}`,
      color: "#2196f3",
    },
    {
      icon: <PendingActionsIcon fontSize="large" />,
      label: `${translations[systemLanguage].pending_withdraw}`,
      value: `${user.pending_withdrawal} ${translations[systemLanguage].currency}`,
      color: "#ff9800",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        height: "auto",
        backgroundColor: theme.palette.background.default,
        pb: 4,
      }}
    >
      {/* Header with curved bottom */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)",
          borderRadius: "0 0 30px 30px",
          padding: { xs: 3, md: 5 },
          mb: { xs: 3, md: 5 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" } }}>
              <Avatar
                sx={{
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  bgcolor: theme.palette.primary.dark,
                  border: "4px solid white",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  fontSize: { xs: 36, md: 42 },
                }}
              >
                {getInitials(user.full_name)}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={10}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "column", md: "row" },
                  alignItems: { xs: "center", sm: "center" },
                  justifyContent: { xs: "center", sm: "space-between" },
                }}
              >
                <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "#FFFFFF",
                      textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
                      mb: 1,
                    }}
                  >
                    {user.full_name}
                  </Typography>

                  <Chip
                    label={`Freelancer`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontWeight: 500,
                      "& .MuiChip-label": { px: 2 },
                    }}
                  />
                </Box>

                {/* Language selector positioned beside name */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", mt: { xs: isMobile ? 3 : 0, md: 0 } }}>
                  <SystemLanguageSelector />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Personal Information Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}>
                  {translations[systemLanguage].personal_info}
                </Typography>

                <Stack spacing={3}>
                  {personalInfo.map((item, index) => (
                    <Box key={index}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={2}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText,
                              borderRadius: "50%",
                              width: 40,
                              height: 40,
                            }}
                          >
                            {item.icon}
                          </Box>
                        </Grid>
                        <Grid item xs={10}>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {item.value}
                          </Typography>
                        </Grid>
                      </Grid>
                      {index < personalInfo.length - 1 && <Divider sx={{ mt: 3 }} />}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Financial Information */}
          <Grid item xs={12} md={8}>
            <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}>
                  {translations[systemLanguage].finicial_info}
                </Typography>

                <Grid container spacing={3}>
                  {financialStats.map((stat, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          height: "100%",
                          borderLeft: `4px solid ${stat.color}`,
                          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Box sx={{ color: stat.color, mr: 1 }}>{stat.icon}</Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            {stat.label}
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserProfile;

