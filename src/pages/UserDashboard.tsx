"use client"

import type React from "react"
import { useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider"
import { useDemoRouter } from "@toolpad/core/internal"
import { useNavigate } from "react-router-dom"
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Fade,
  Tooltip,
} from "@mui/material"

// Icons
import LogoutIcon from "@mui/icons-material/Logout"
import PaymentIcon from "@mui/icons-material/Payment"
import TravelExploreIcon from "@mui/icons-material/TravelExplore"
import HomeIcon from "@mui/icons-material/Home"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import theme from "@/theme"

// Components
import UserProfile from "@/components/freelancer/UserProfile"
import FreelancerPayment from "@/components/freelancer/FreelancerPayment"

export default function UserDashboard({ window }: { window?: () => Window }) {
  const router = useDemoRouter("/dashboard")
  const currentSegment = router.pathname.split("/").pop() || "job-dashboard"
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width:600px)")

  // State for menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    navigate("/auth", { state: { logout: true } })
    handleMenuClose()
  }

  // Replace the handleNavigate function with this implementation:
  const handleNavigate = (segment: string) => {
    // This just updates the current segment without actual navigation
    router.navigate(`/dashboard/${segment}`)
  }

  // Navigation items
  const navigationItems = [
    {
      segment: "job-dashboard",
      title: "Dashboard",
      icon: <HomeIcon />,
    },
    {
      segment: "request-payment",
      title: "Withdrawal History",
      icon: <PaymentIcon />,
    },
  ]

  // For AppProvider compatibility
  const logoutAction = (
    <div onClick={handleLogout} style={{ display: "flex", alignItems: "center", cursor: "pointer", width: "100%" }}>
      <span style={{ marginLeft: 8 }}>Logout</span>
    </div>
  )

  const navigation: Navigation = [
    {
      kind: "page",
      segment: "request-payment",
      title: "Withdrawal History",
      icon: <PaymentIcon />,
    },
    {
      kind: "page",
      icon: <LogoutIcon />,
      action: logoutAction,
    },
  ]

  // Replace the renderContent function with this implementation to ensure it works exactly as before:
  const renderContent = () => {
    switch (currentSegment) {
      case "request-payment":
        return <FreelancerPayment />
      default:
        return <UserProfile />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <AppProvider
        navigation={navigation}
        router={router}
        theme={theme}
        window={window ? window() : undefined}
        sx={{ zIndex: 1301 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          {/* Top AppBar */}
          <AppBar position="sticky" color="default" elevation={0}>
            <Toolbar>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h6" component="div" sx={{ display: { xs: "none", sm: "block" } }}>
                  Welcome Back, {localStorage.getItem("userName")}
                </Typography>
              </Box>

              {/* top navigation buttoms */}
              {!isMobile && (
                <Box
                  sx={{
                    display: "flex",
                    mx: "auto",
                    gap: 2,
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  {navigationItems.map((item) => (
                    <Button
                      key={item.segment}
                      color={currentSegment === item.segment ? "primary" : "inherit"}
                      startIcon={item.icon}
                      onClick={() => handleNavigate(item.segment)}
                      sx={{
                        px: 3,
                        py: 1.5,
                        position: "relative",
                        fontWeight: 600,
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(23, 170, 36, 0.08)",
                        },
                        "&::after":
                          currentSegment === item.segment
                            ? {
                                content: '""',
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                height: "3px",
                                bgcolor: "primary.main",
                                borderRadius: "3px 3px 0 0",
                              }
                            : {},
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </Box>
              )}

              <Box sx={{ display: "flex", ml: "auto", gap: 1 }}>
                <Tooltip title="Explore Tasks">
                  <Button
                    variant="contained"
                    startIcon={<TravelExploreIcon />}
                    onClick={() => navigate("/explore-task")}
                    sx={{
                      borderRadius: "8px",
                      background: "linear-gradient(45deg, #17aa24 30%, #36c463 90%)",
                      color: "white",
                      boxShadow: "0 3px 5px 2px rgba(93, 247, 144, 0.3)",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        background: "linear-gradient(45deg, #21f380 30%, #74e78d 90%)",
                        transform: "scale(1.03)",
                      },
                      display: { xs: "none", sm: "flex" },
                    }}
                  >
                    Explore Tasks
                  </Button>
                </Tooltip>

                <IconButton
                  onClick={handleMenuClick}
                  color="inherit"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Menu */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                handleNavigate("job-dashboard")
                handleMenuClose()
              }}
            >
              <HomeIcon sx={{ mr: 1 }} /> Dashboard
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleNavigate("request-payment")
                handleMenuClose()
              }}
            >
              <PaymentIcon sx={{ mr: 1 }} /> Withdrawal History
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>

          {/* Update the main content section to ensure components render properly: */}
          <Container
            maxWidth="lg"
            sx={{
              flex: 1,
              py: 3,
              px: { xs: 1, sm: 3 },
              mb: isMobile ? 7 : 0,
            }}
          >
            <Fade in={true} timeout={300}>
              <Box>{renderContent()}</Box>
            </Fade>
          </Container>

          {/* Bottom Navigation for Mobile */}
          {isMobile && (
            <Paper
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                borderRadius: "12px 12px 0 0",
                overflow: "hidden",
                boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
              }}
              elevation={3}
            >
              <BottomNavigation
                showLabels
                value={navigationItems.findIndex((item) => item.segment === currentSegment)}
                onChange={(_, newValue) => {
                  handleNavigate(navigationItems[newValue].segment)
                }}
              >
                {navigationItems.map((item) => (
                  <BottomNavigationAction key={item.segment} label={item.title} icon={item.icon} />
                ))}
              </BottomNavigation>
            </Paper>
          )}
        </Box>
      </AppProvider>
    </ThemeProvider>
  )
}

