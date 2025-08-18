"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Alert,
  type SelectChangeEvent,
} from "@mui/material"
import {
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Engineering as EngineeringIcon,
} from "@mui/icons-material"
import type { CreateScheduleTaskModel } from "../../Models/ScheduleTaskModels/ScheduleTaskModel"
import type { TechnicianOptionModel } from "../../Models/Technician/TechnicianModel"

interface CreateTaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (taskData: CreateScheduleTaskModel) => void
  StartDate: string
  equipmentName: string
  technicianOptions: TechnicianOptionModel[]
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onClose,
  onSubmit,
  StartDate,
  equipmentName,
  technicianOptions,
}) => {
  const [formData, setFormData] = useState({
    taskName: "",
    priority: "",
    interval: "",
    technicianId: "",
  })

  const addDaysToDate = (startDate: string, interval: string): string => {
    if (!startDate || !interval) return ""
    const match = interval.match(/(\d+)/)
    const days = match ? Number.parseInt(match[1], 10) : 0
    const date = new Date(startDate)
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (field: string, value: string) => 
  {
    let error = ""
    switch (field) {
      case "taskName":
        if (!value.trim()) error = "Task name is required"
        break
      case "priority":
        if (!value) error = "Priority is required"
        break
     case "interval":
        if (!value.trim()) 
        {
          error = "Maintenance interval is required";
        } 
        else if (!/^\d+$/i.test(value)) 
        {
          error = "Interval must be a number";
        } 
        else 
        {
          let num = parseInt(value, 10);
            
          if (num >= 1000) 
          {
            setFormData((prev) => ({ ...prev, interval: "99" }));
            num = 99;
            error = "";
          }

          if (num > 99) {

            error = "Interval cannot be greater than 99";
          } 
          else if (num <= 0) 
          {
            error = "Interval must be greater than 0";
          }
        }
        break;

    }
    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ""
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.taskName.trim()) newErrors.taskName = "Task name is required"
    if (!formData.priority) newErrors.priority = "Priority is required"
    if (!formData.interval.trim()) newErrors.interval = "Maintenance interval is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const selectedTechnician = technicianOptions.find((t) => t.id.toString() === formData.technicianId)
    const dueDate = addDaysToDate(StartDate, formData.interval)

    const taskData: CreateScheduleTaskModel = {
      taskName: formData.taskName.trim(),
      equipmentName,
      priority: formData.priority,
      dueDate,
      interval: formData.interval.match(/(\d+)/)?.[1] + ".00:00:00",
      technicianId: formData.technicianId || undefined,
      technicianName: selectedTechnician?.fullName || undefined,
    }

    onSubmit(taskData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      taskName: "",
      priority: "",
      interval: "",
      technicianId: "",
    })
    setErrors({})
    onClose()
  }

  const handleInputChange = (field: string, value: string) => 
  {
    setFormData((prev) => ({ ...prev, [field]: value }))
    validateField(field, value) 
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: { bg: "#dcfce7", color: "#166534" },
      Medium: { bg: "#fef3c7", color: "#92400e" },
      High: { bg: "#fed7d7", color: "#c53030" },
      Urgent: { bg: "#fce7f3", color: "#be185d" },
    }
    return colors[priority as keyof typeof colors] || colors.Medium
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -20, right: -20, opacity: 0.1 }}>
          <AssignmentIcon sx={{ fontSize: 120 }} />
        </Box>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 600,
            fontSize: "1.5rem",
            position: "relative",
            zIndex: 1,
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Paper
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AssignmentIcon sx={{ fontSize: 24 }} />
            </Paper>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Create New Task
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.875rem" }}>
                Add a maintenance task to the schedule
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Paper
          sx={{
            m: 3,
            mb: 2,
            p: 2,
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            border: "1px solid #e2e8f0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <EngineeringIcon sx={{ color: "#64748b", fontSize: 20 }} />
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                Target Equipment
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                {equipmentName}
              </Typography>
            </Box>
            <Box sx={{ ml: "auto" }}>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                Schedule Start
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                {new Date(StartDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ px: 3, pb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              fullWidth
              label="Task Name"
              required
              value={formData.taskName}
              onChange={(e) => handleInputChange("taskName", e.target.value)}
              error={!!errors.taskName}
              helperText={errors.taskName}
              placeholder="Enter descriptive task name"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "8px",
                },
              }}
            />

            <FormControl fullWidth required error={!!errors.priority} sx={{ mb: 3 }}>
              <InputLabel>Priority Level</InputLabel>
              <Select
                value={formData.priority}
                label="Priority Level"
                onChange={(e: SelectChangeEvent) => handleInputChange("priority", e.target.value)}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                }}
              >
                <MenuItem value="Low">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label="Low"
                      size="small"
                      sx={{
                        backgroundColor: getPriorityColor("Low").bg,
                        color: getPriorityColor("Low").color,
                        fontSize: "11px",
                        height: "20px",
                      }}
                    />
                    <Typography variant="body2">Low Priority</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Medium">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label="Medium"
                      size="small"
                      sx={{
                        backgroundColor: getPriorityColor("Medium").bg,
                        color: getPriorityColor("Medium").color,
                        fontSize: "11px",
                        height: "20px",
                      }}
                    />
                    <Typography variant="body2">Medium Priority</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="High">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label="High"
                      size="small"
                      sx={{
                        backgroundColor: getPriorityColor("High").bg,
                        color: getPriorityColor("High").color,
                        fontSize: "11px",
                        height: "20px",
                      }}
                    />
                    <Typography variant="body2">High Priority</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Urgent">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label="Urgent"
                      size="small"
                      sx={{
                        backgroundColor: getPriorityColor("Urgent").bg,
                        color: getPriorityColor("Urgent").color,
                        fontSize: "11px",
                        height: "20px",
                      }}
                    />
                    <Typography variant="body2">Urgent Priority</Typography>
                  </Box>
                </MenuItem>
              </Select>
              {errors.priority && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.priority}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Maintenance Interval"
              required
              value={formData.interval}
              onChange={(e) => handleInputChange("interval", e.target.value)}
              error={!!errors.interval}
              helperText={errors.interval || "e.g., 7 days, 2 weeks, 1 month"}
              placeholder="e.g., 7 days"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "8px",
                },
              }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Assigned Technician</InputLabel>
              <Select
                value={formData.technicianId}
                label="Assigned Technician"
                onChange={(e: SelectChangeEvent) => handleInputChange("technicianId", e.target.value)}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                }}
              >
                <MenuItem value="">
                  <Typography variant="body2" color="textSecondary">
                    No technician assigned
                  </Typography>
                </MenuItem>
                {technicianOptions.map((technician) => (
                  <MenuItem key={technician.id} value={technician.id.toString()}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, color: "#64748b" }} />
                      <Typography variant="body2">{technician.fullName}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.interval && StartDate && (
              <Alert
                severity="info"
                sx={{
                  backgroundColor: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  "& .MuiAlert-icon": { color: "#0284c7" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ScheduleIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    <strong>First due date:</strong> {addDaysToDate(StartDate, formData.interval) || "Invalid interval"}
                  </Typography>
                </Box>
              </Alert>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          backgroundColor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          gap: 1.5,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            minWidth: "100px",
            borderColor: "#d1d5db",
            color: "#6b7280",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f9fafb",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.taskName.trim() || !formData.priority || !formData.interval.trim()}
          sx={{
            minWidth: "120px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            },
            "&:disabled": {
              background: "#e5e7eb",
              color: "#9ca3af",
            },
          }}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  )
}
