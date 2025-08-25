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
          else if (num < 0) 
          {
            error = "Interval must be positive";
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Create Task
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="caption" color="textSecondary">Equipment</Typography>
            <Typography variant="body2">{equipmentName}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Schedule Start</Typography>
            <Typography variant="body2">{new Date(StartDate).toLocaleDateString()}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gap: 2 }}>
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
              helperText={errors.interval || "Number of days (1-99)"}
              placeholder="e.g., 7"
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

      <DialogActions>
        <Button onClick={handleClose} color="inherit" variant="outlined">
          <CloseIcon sx={{ fontSize: 16 }} /> Close
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.taskName.trim() || !formData.priority || !formData.interval.trim()}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  )
}
