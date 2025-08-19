"use client"

import {  Card, Paper, Avatar, Chip } from "@mui/material"
import { styled } from "@mui/material/styles"

// Styled Components for Task Management
export const TaskCard = styled(Card)<{ isOverdue?: boolean }>(({ theme, isOverdue }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: isOverdue ? "0 6px 20px rgba(244, 67, 54, 0.18)" : "0 6px 20px rgba(15,23,42,0.06)",
  border: isOverdue ? "2px solid #f44336" : "1px solid #e5e7eb",
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  position: "relative",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: isOverdue ? "0 10px 30px rgba(244, 67, 54, 0.24)" : "0 10px 30px rgba(15,23,42,0.08)",
  },
  "&::before": isOverdue ? {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "linear-gradient(90deg, #f44336 0%, #d32f2f 100%)",
    zIndex: 1,
  } : {},
}))

export const HeaderCard = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  color: "inherit",
  position: "relative",
  overflow: "hidden",
  marginBottom: theme.spacing(4),
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
}))

export const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  color: "inherit",
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
