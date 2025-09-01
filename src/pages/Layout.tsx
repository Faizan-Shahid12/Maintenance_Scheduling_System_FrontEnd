import type React from "react"
import { Outlet } from "react-router-dom"
import Menu from "../Components/Menu"
import { AppBar, Toolbar, Typography, Box, Container, useTheme, useMediaQuery } from "@mui/material"

const LayoutMenu: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Menu />
      <Box 
        sx={{ 
          flex: 1,
          // Only apply margin-left on desktop, mobile uses drawer overlay
          ml: isMobile ? 0 : "var(--sidebar-width, 280px)",
          transition: "margin-left 0.3s ease",
          width: isMobile ? "100%" : "auto",
          overflow: "hidden" // Prevent horizontal scroll
        }}
      >
        <AppBar 
          position="sticky" 
          color="inherit" 
          elevation={0} 
          sx={{ 
            borderBottom: "1px solid #e5e7eb", 
            bgcolor: "background.paper",
            // Adjust AppBar positioning for mobile
            ml: isMobile ? 0 : 0,
            width: isMobile ? "100%" : "auto"
          }}
        >
          <Toolbar sx={{ 
            minHeight: 64, 
            pl: isMobile ? 10 : 3, // Increased left padding on mobile to avoid menu button overlap
            pr: 3 
          }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              MainSync
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>
        </AppBar>

        <Box 
          component="main" 
          sx={{ 
            minHeight: "calc(100vh - 64px)", 
            bgcolor: "background.default", 
            p: { xs: 1, sm: 2, md: 3 },
            width: "100%",
            maxWidth: "100%",
            overflow: "auto"
          }}
        >
          <Container 
            maxWidth="xl" 
            sx={{ 
              py: 2,
              px: { xs: 1, sm: 2, md: 3 },
              maxWidth: "100% !important",
              width: "100%"
            }}
          >
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default LayoutMenu
