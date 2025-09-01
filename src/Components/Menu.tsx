import type React from "react"
import { NavLink } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Dashboard,
  Assignment,
  Build,
  History,
  People,
  Schedule,
  QrCode,
  Menu as MenuIcon,
  Logout,
  Engineering,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material"
import { useState, useEffect } from "react"

const SIDEBAR_WIDTH = 280
const SIDEBAR_COLLAPSED_WIDTH = 70

const NavigationSidebar: React.FC = () => {
  const role = localStorage.getItem("Role")
  const Name = localStorage.getItem("Name");
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"))

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auto-collapse on tablet screens for better space utilization
  useEffect(() => {
    if (isTablet && !isCollapsed) {
      setIsCollapsed(true)
    }
  }, [isTablet, isCollapsed])

  useEffect(() => {
    // Don't set sidebar width on mobile as it uses drawer overlay
    if (!isMobile) {
      const width = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH
      document.documentElement.style.setProperty("--sidebar-width", `${width}px`)
      document.body.setAttribute("data-sidebar-collapsed", isCollapsed.toString())
    } else {
      // Reset CSS variable on mobile
      document.documentElement.style.setProperty("--sidebar-width", "0px")
      document.body.setAttribute("data-sidebar-collapsed", "false")
    }
  }, [isCollapsed, isMobile])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/login"
  }

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  const navigationItems = [
    { path: "/Dashboard", label: "Dashboard", icon: <Dashboard />, roles: ["Admin"] },
    { path: "/Equipment", label: "Equipment Management", icon: <Build />, roles: ["Admin"] },
    { path: "/SchedulePage", label: "Schedule Management", icon: <Schedule />, roles: ["Admin"] },
    { path: "/TaskManagement", label: "Task Management", icon: <Assignment />, roles: ["Admin", "Technician"] },
    { path: "/MaintenanceHistory", label: "Maintenance History", icon: <History />, roles: ["Admin"] },
    { path: "/BarCodeScannerPage", label: "Bar Code Management", icon: <QrCode />, roles: ["Admin", "Technician"]},
    { path: "/UserManagement", label: "User Management", icon: <People />, roles: ["Admin"] },
  ]

  const filteredNavItems = navigationItems.filter((item) => item.roles.some((itemRole) => role?.includes(itemRole)))

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#ffffff",
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        width: mobile ? SIDEBAR_WIDTH : isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        transition: "width 0.3s ease",
        borderRight: "1px solid #e5e7eb",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Paper
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: theme.palette.primary.main,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: isCollapsed && !mobile ? 0 : 1.5,
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              }}
            >
              <Engineering sx={{ fontSize: 20 }} />
            </Paper>
            {(!isCollapsed || mobile) && (
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
                MainSync
              </Typography>
            )}
          </Box>

          {!mobile && (
            <IconButton
              onClick={handleToggle}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          )}
        </Box>

        {(!isCollapsed || mobile) && (
          <Chip
            label={`${role} Dashboard`}
            size="small"
            sx={{
              bgcolor: "#f1f5f9",
              color: theme.palette.text.secondary,
              fontWeight: 700,
              mt: 2,
            }}
          />
        )}
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ p: 1 }}>
          {filteredNavItems.map((item) => (
            <ListItem key={item.path} sx={{ p: 0, mb: 0.5 }}>
              <Button
                component={NavLink}
                to={item.path}
                startIcon={item.icon}
                onClick={() => mobile && setMobileOpen(false)}
                sx={{
                  color: theme.palette.text.primary,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 1.5,
                  py: 1.25,
                  width: "100%",
                  justifyContent: isCollapsed && !mobile ? "center" : "flex-start",
                  minWidth: 0,
                  textDecoration: "none",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#f1f5f9",
                    transform: "none",
                  },
                  "&.active": {
                    bgcolor: "#e8f0fe",
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    borderRight: "3px solid",
                    borderColor: theme.palette.primary.main,
                  },
                  transition: "background-color 0.2s ease",
                  "& .MuiButton-startIcon": {
                    mr: isCollapsed && !mobile ? 0 : 1,
                  },
                }}
              >
                {(!isCollapsed || mobile) && item.label}
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* User Profile & Logout */}
      <Box sx={{ p: 2, borderTop: "1px solid #e5e7eb" }}>
        {(!isCollapsed || mobile) && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                color: "white",
                fontWeight: "bold",
                fontSize: "0.9rem",
                mr: 1.5,
              }}
            >
              {role?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {Name}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Online
              </Typography>
            </Box>
          </Box>
        )}

        <Button
          fullWidth
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            color: theme.palette.text.primary,
            textTransform: "none",
            fontWeight: 600,
            py: 1.25,
            justifyContent: isCollapsed && !mobile ? "center" : "flex-start",
            "&:hover": { bgcolor: "#f1f5f9" },
            "& .MuiButton-startIcon": { mr: isCollapsed && !mobile ? 0 : 1 },
          }}
        >
          {(!isCollapsed || mobile) && "Logout"}
        </Button>
      </Box>
    </Box>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1200,
            height: "100vh",
            width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            transition: "width 0.3s ease",
            backgroundColor: "#ffffff",
          }}
          data-sidebar-collapsed={isCollapsed}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {/* Mobile Menu Button */}
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 1300,
              bgcolor: theme.palette.primary.main,
              color: "white",
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              width: 48,
              height: 48,
              border: "2px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              "&:hover": { 
                bgcolor: theme.palette.primary.dark,
                transform: "scale(1.05)",
                boxShadow: "0 6px 16px rgba(37,99,235,0.4)"
              },
              transition: "all 0.2s ease",
              '@media (max-width: 600px)': {
                top: 12,
                left: 12,
                width: 44,
                height: 44,
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ 
              keepMounted: true,
              // Prevent body scroll when drawer is open
              disableScrollLock: false
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: Math.min(SIDEBAR_WIDTH, window.innerWidth * 0.85),
                maxWidth: "85vw",
                boxSizing: "border-box",
                border: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
              },
              // Improve backdrop styling
              "& .MuiBackdrop-root": {
                backgroundColor: "rgba(0,0,0,0.5)"
              }
            }}
          >
            <SidebarContent mobile />
          </Drawer>
        </>
      )}
    </>
  )
}

export { NavigationSidebar as Menu }
export default NavigationSidebar
