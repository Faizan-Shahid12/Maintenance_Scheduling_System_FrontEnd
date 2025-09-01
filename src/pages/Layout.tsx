import type React from "react"
import { Outlet } from "react-router-dom"
import Menu from "../Components/Menu"
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material"

const LayoutMenu: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Menu />
      <Box sx={{ flex: 1, ml: "var(--sidebar-width, 280px)" }}>
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e5e7eb", bgcolor: "background.paper" }}>
          <Toolbar sx={{ minHeight: 64 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              MainSync
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default", p: { xs: 2, md: 3 } }}>
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <Outlet />
          </Container>
        </Box>
      </Box>

      {/* Remove desktop-app style margin hacks; handle responsiveness with MUI layout */}
      {/* ... existing code ... */}
    </div>
  )
}

export default LayoutMenu
