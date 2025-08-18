"use client"

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

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const width = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`)
    document.body.setAttribute("data-sidebar-collapsed", isCollapsed.toString())
  }, [isCollapsed])

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
    { path: "/UserManagement", label: "User Management", icon: <People />, roles: ["Admin"] },
  ]

  const filteredNavItems = navigationItems.filter((item) => item.roles.some((itemRole) => role?.includes(itemRole)))

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(145deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        width: mobile ? SIDEBAR_WIDTH : isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        transition: "width 0.3s ease",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Paper
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: isCollapsed && !mobile ? 0 : 1.5,
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              <Engineering sx={{ fontSize: 20, color: "white" }} />
            </Paper>
            {(!isCollapsed || mobile) && (
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                MainSync
              </Typography>
            )}
          </Box>

          {!mobile && (
            <IconButton
              onClick={handleToggle}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
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
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: "bold",
              mt: 2,
            }}
          />
        )}
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ p: 0 }}>
          {filteredNavItems.map((item) => (
            <ListItem key={item.path} sx={{ p: 0, mb: 0.5 }}>
              <Button
                component={NavLink}
                to={item.path}
                startIcon={item.icon}
                onClick={() => mobile && setMobileOpen(false)}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontWeight: 500,
                  px: 2,
                  py: 1.5,
                  width: "100%",
                  justifyContent: isCollapsed && !mobile ? "center" : "flex-start",
                  minWidth: 0,
                  textDecoration: "none",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    transform: "translateX(4px)",
                  },
                  "&.active": {
                    bgcolor: "rgba(33, 150, 243, 0.8)",
                    color: "white",
                    fontWeight: 600,
                    borderRight: "3px solid #2196f3",
                  },
                  transition: "all 0.2s ease",
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
      <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        {(!isCollapsed || mobile) && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.9rem",
                mr: 1.5,
              }}
            >
              {role?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {Name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
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
            color: "white",
            textTransform: "none",
            fontWeight: 500,
            py: 1.5,
            justifyContent: isCollapsed && !mobile ? "center" : "flex-start",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
            "& .MuiButton-startIcon": {
              mr: isCollapsed && !mobile ? 0 : 1,
            },
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
              bgcolor: "rgba(102, 126, 234, 0.9)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(102, 126, 234, 1)",
              },
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
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: SIDEBAR_WIDTH,
                boxSizing: "border-box",
                border: "none",
              },
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
