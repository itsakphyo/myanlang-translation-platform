"use client";

import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Fade,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import backgroundimage from "@/assets/images/background.jpeg";

const footerLinks = [
  { title: "Terms and Conditions", href: "/terms-and-conditions" },
  { title: "Privacy Policy", href: "/privacy-policy" },
];

const socialLinks = [
  { icon: <FacebookIcon />, href: "https://facebook.com", name: "Facebook" },
  { icon: <YouTubeIcon />, href: "https://youtube.com", name: "YouTube" },
  { icon: <LinkedInIcon />, href: "https://linkedin.com", name: "LinkedIn" },
];

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMobileMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* AppBar */}
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper" }}>
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                component="img"
                src={logo || "/placeholder.svg"}
                alt="MyanLang logo"
                sx={{ height: isMobile ? 36 : 48 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  display: { xs: "none", sm: "block" },
                }}
              >
                MyanLang Platform
              </Typography>
            </Box>
            {isMobile ? (
              <IconButton onClick={handleMobileMenuToggle}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button onClick={() => navigate("/auth")} variant="text" sx={{ fontWeight: 500 }}>
                  Log In
                </Button>
                <Button onClick={() => navigate("/auth")} variant="contained" sx={{ fontWeight: 500 }}>
                  Sign Up
                </Button>
              </Stack>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Menu */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{ sx: { width: "100%", maxWidth: 280 } }}
        >
          <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List sx={{ py: 2 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/auth")} sx={{ py: 1.5, px: 3 }}>
                <ListItemText primary="Log In" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mt: 1, px: 2 }}>
              <Button fullWidth variant="contained" onClick={() => navigate("/auth")}>
                Sign Up
              </Button>
            </ListItem>
          </List>
        </Drawer>

        <Box
          sx={{
            flexGrow: 1,
            position: "relative",
            py: { xs: 3, md: 6 },
            backgroundImage: `url(${backgroundimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Container sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <Grid container justifyContent="center">
              <Grid item xs={12} md={10}>
                <Fade in timeout={1000}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: { xs: 2, md: 4 },
                      bgcolor: "rgba(255,255,255,0.85)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant={isMobile ? "h4" : "h3"}
                      sx={{ fontWeight: 500, mb: 6, color: "text.primary" }}
                    >
                      Preserving Myanmar's Linguistic Heritage
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: 800,
                        mx: "auto",
                        mb: 4,
                        color: "text.secondary",
                        lineHeight: 1.7,
                      }}
                    >
                      Join our mission to collect and preserve text data for underrepresented languages in Myanmar,
                      ensuring cultural diversity for future generations.
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Fade in timeout={1500}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      fontStyle: "italic",
                      color: "text.secondary",
                    }}
                  >
                    #NoLanguageLeftBehind
                  </Typography>
                </Fade>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            bgcolor: "background.paper",
            py: 4,
            mt: "auto",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Container>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} textAlign={{ xs: "center", sm: "left" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Legal
                </Typography>
                <Stack spacing={1}>
                  {footerLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      color="text.secondary"
                      underline="hover"
                    >
                      {link.title}
                    </Link>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} textAlign={{ xs: "center", sm: "right" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Follow Us
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent={{ xs: "center", sm: "flex-end" }}
                >
                  {socialLinks.map((link, index) => (
                    <IconButton
                      key={index}
                      href={link.href}
                      color="inherit"
                      sx={{ color: "text.secondary" }}
                    >
                      {link.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4 }} />
            <Typography variant="body2" align="center" color="text.secondary">
              © {new Date().getFullYear()} Myan Lang. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
