"use client"

import {  Card, Paper, Avatar, Chip } from "@mui/material"
import { styled } from "@mui/material/styles"

// Styled Components for Task Management
export const TaskCard = styled(Card)<{ isOverdue?: boolean }>(({ theme, isOverdue }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: isOverdue ? "0 8px 32px rgba(244, 67, 54, 0.2)" : "0 8px 32px rgba(0,0,0,0.1)",
  border: isOverdue ? "2px solid #f44336" : "none",
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  position: "relative",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: isOverdue ? "0 12px 40px rgba(244, 67, 54, 0.3)" : "0 12px 40px rgba(0,0,0,0.15)",
  },
  "&::before": isOverdue ? {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: "linear-gradient(90deg, #f44336 0%, #d32f2f 100%)",
    zIndex: 1,
  } : {},
}))

export const HeaderCard = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  color: "white",
  position: "relative",
  overflow: "hidden",
  marginBottom: theme.spacing(4),
  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
}))

export const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}))

export const PriorityChip = ({ priority }: { priority: string }) => {
  const getColor = () => {
    switch (priority) {
      case "Urgent":
        return "#d32f2f"
      case "High":
        return "#f44336"
      case "Medium":
        return "#ff9800"
      case "Low":
        return "#4caf50"
      default:
        return "#9e9e9e"
    }
  }

  return (
    <Chip
      label={priority}
      sx={{
        backgroundColor: getColor(),
        color: "white",
        fontWeight: "bold",
        borderRadius: 3,
        fontSize: "0.75rem",
      }}
      size="small"
    />
  )
}

export const StatusChip = ({ status }: { status: string }) => {
  const getColor = () => {
    switch (status) {
      case "Completed":
        return "#4caf50"
      case "InProgress":
        return "#2196f3"
      case "Pending":
        return "#9e9e9e"
      case "OverDue":
      case "Overdue":
        return "#f44336"
      default:
        return "#9e9e9e"
    }
  }

  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: getColor(),
        color: "white",
        fontWeight: "bold",
        borderRadius: 3,
        fontSize: "0.75rem",
        "& .MuiChip-icon": {
          color: "white",
        },
      }}
      size="small"
    />
  )
}

export const TechnicianAvatar = ({ name, specialization }: { name: string; specialization: string }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getAvatarColor = (name: string) => {
    const colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"]
    const index = name.length % colors.length
    return colors[index]
  }

  return (
    <Avatar
      sx={{
        bgcolor: getAvatarColor(name),
        width: 40,
        height: 40,
        fontSize: "0.875rem",
        fontWeight: "bold",
      }}
      title={`${name} - ${specialization}`}
    >
      {getInitials(name)}
    </Avatar>
  )
}
