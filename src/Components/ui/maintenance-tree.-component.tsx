"use client"

import { Box, Card, Paper, Avatar, Chip } from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  PictureAsPdf,
  Image,
  VideoFile,
  AudioFile,
  InsertDriveFile,
} from "@mui/icons-material"

// Styled Components
export const GradientBox = styled(Box)(({ theme }) => ({
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

export const EquipmentCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  border: "none",
  overflow: "hidden",
  marginBottom: theme.spacing(3),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
}))

export const MaintenanceCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  border: "none",
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid #4caf50`,
}))

export const TaskCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  border: "none",
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid #00bcd4`,
}))

export const LogCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  border: "none",
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid #ff9800`,
}))

export const GradientAvatar = styled(Avatar)<{ bgcolor: string }>(({ bgcolor }) => ({
  background: bgcolor,
  width: 60,
  height: 60,
  fontSize: "1.5rem",
  fontWeight: "bold",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}))

export const CountChip = styled(Chip)<{ bgcolor: string }>(({ theme, bgcolor }) => ({
  background: bgcolor,
  color: "white",
  fontWeight: "bold",
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5, 1),
  "& .MuiChip-icon": {
    color: "white",
  },
}))

export const PriorityChip = ({ priority }: { priority: string }) => {
  const getColor = () => {
    switch (priority) {
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
        "& .MuiChip-icon": {
          color: "white",
        },
      }}
      size="small"
    />
  )
}

export const FileIcon = ({ contentType }: { contentType?: string }) => {
  if (contentType?.includes("pdf")) return <PictureAsPdf sx={{ color: "#f44336", fontSize: 24 }} />
  if (contentType?.includes("image")) return <Image sx={{ color: "#4caf50", fontSize: 24 }} />
  if (contentType?.includes("video")) return <VideoFile sx={{ color: "#2196f3", fontSize: 24 }} />
  if (contentType?.includes("audio")) return <AudioFile sx={{ color: "#ff9800", fontSize: 24 }} />
  return <InsertDriveFile sx={{ color: "#9e9e9e", fontSize: 24 }} />
}