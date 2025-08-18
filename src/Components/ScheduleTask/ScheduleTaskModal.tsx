import type React from "react"
import { useState, useEffect } from "react"
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
  Avatar,
  type SelectChangeEvent,
  OutlinedInput,
} from "@mui/material"
import {
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Engineering as EngineeringIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material"
import type { CreateScheduleTaskModel, ScheduleTaskModel } from "../../Models/ScheduleTaskModels/ScheduleTaskModel"
import type { TechnicianOptionModel } from "../../Models/Technician/TechnicianModel"

type ModalMode = "create" | "edit" | "delete" | "assign"

interface ScheduleTaskModalProps {
  open: boolean
  onClose: () => void
  mode: ModalMode
  task?: ScheduleTaskModel | null
  onSubmit: (taskData: CreateScheduleTaskModel) => void
  onEdit?: (taskData: ScheduleTaskModel, AssignData : {taskId: number, TechId: string}) => void
  onDelete?: (taskId: number) => void
  onAssign?: (taskId: number, technicianId: string) => void
  StartDate?: string
  equipmentName?: string
  technicianOptions: TechnicianOptionModel[]
}

export const ScheduleTaskModal: React.FC<ScheduleTaskModalProps> = ({
  open,
  onClose,
  mode,
  task,
  onSubmit,
  onEdit,
  onDelete,
  onAssign,
  StartDate = "",
  equipmentName = "",
  technicianOptions,
}) => {
  const [formData, setFormData] = useState({
    taskName: "",
    priority: "",
    interval: "",
    technicianId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [validFields, setValidFields] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (mode === "edit" && task) {
      setFormData({
        taskName: task.taskName || "",
        priority: task.priority || "",
        interval: task.interval ? task.interval.split(".")[0] + " days" : "",
        technicianId: technicianOptions.find(t => t.email === task.techEmail)?.id || "",
      })
    } else if (mode === "assign" && task) {
      setFormData({
        taskName: task.taskName || "",
        priority: task.priority || "",
        interval: task.interval ? task.interval.split(".")[0] + " days" : "",
        technicianId: technicianOptions.find(t => t.email === task.techEmail)?.id || "",
      })
    } else {
      setFormData({
        taskName: "",
        priority: "",
        interval: "",
        technicianId: "",
      })
    }
    //  Reset validation states when modal opens/mode changes
    setErrors({})
    setValidFields({})
  }, [mode, task])

  const addDaysToDate = (startDate: string, interval: string): string => {
    if (!startDate || !interval) return ""
    const match = interval.match(/(\d+)/)
    const days = match ? Number.parseInt(match[1], 10) : 0
    const date = new Date(startDate)
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  const validateField = (field: string, value: string): { isValid: boolean; error: string } => {
    switch (field) {
      case "taskName":
        if (!value.trim()) {
          return { isValid: false, error: "Task name is required" }
        }
        if (value.trim().length < 3) {
          return { isValid: false, error: "Task name must be at least 3 characters" }
        }
        if (value.trim().length > 100) {
          return { isValid: false, error: "Task name must be less than 100 characters" }
        }
        if (!/^[a-zA-Z0-9\s\-_.,()]+$/.test(value.trim())) {
          return { isValid: false, error: "Task name contains invalid characters" }
        }
        return { isValid: true, error: "" }

      case "priority":
        if (!value) {
          return { isValid: false, error: "Priority is required" }
        }
        return { isValid: true, error: "" }

      case "interval":
        if (!value.trim()) {
          return { isValid: false, error: "Maintenance interval is required" }
        }
        
        const intervalMatch = value.match(/^(\d+)$/);
        if (!intervalMatch) {
          return { isValid: false, error: "Invalid Interval" }
        }

        const number = parseInt(intervalMatch[1], 10)
        
        let totalDays = number 

        if(totalDays > 1000)
          {
            setFormData(prev => ({
                  ...prev,
                  interval: "99"
              }));

              totalDays = 99;
          }


        if (totalDays > 99) 
        {
          return { isValid: false, error: "Interval cannot exceed 99 days" }
        }
        if (totalDays < 1) {
          return { isValid: false, error: "Interval must be at least 1 day" }
        }


        return { isValid: true, error: "" }

      default:
        return { isValid: true, error: "" }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (mode !== "delete" && mode !== "assign") {
      if (!formData.taskName.trim()) {
        newErrors.taskName = "Task name is required"
      }
      if (!formData.priority) {
        newErrors.priority = "Priority is required"
      }
      if (!formData.interval.trim()) {
        newErrors.interval = "Maintenance interval is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const techName = technicianOptions.find((t) => t.id.toString() === formData.technicianId)?.fullName;

    if (mode === "create") 
    {
      const taskData: CreateScheduleTaskModel = {
        taskName: formData.taskName,
        equipmentName: equipmentName || "",
        priority: formData.priority,
        dueDate: addDaysToDate(StartDate || "", formData.interval),
        interval: formData.interval.match(/(\d+)/)?.[1] + ".00:00:00",
        technicianId: formData.technicianId || null,
        technicianName: techName === "" ? "N/A" : techName,
      }
      onSubmit(taskData)
    } 
    else if (mode === "edit" && task && onEdit) 
    {
      const updatedTask: ScheduleTaskModel = {
        scheduleTaskId: task.scheduleTaskId,
        taskName: formData.taskName,
        equipmentName: task.equipmentName,
        priority: formData.priority,
        dueDate: addDaysToDate(StartDate || "", formData.interval),
        interval: formData.interval.match(/(\d+)/)?.[1] + ".00:00:00",
        assignedTo: techName === "" ? "N/A" : techName,
      }
      onEdit(updatedTask,{taskId: task.scheduleTaskId, TechId: formData.technicianId});
    } 
    else if (mode === "delete" && task && onDelete) 
    {
      onDelete(task.scheduleTaskId) 
    } 
    else if (mode === "assign" && task && onAssign) 
    {
      onAssign(task.scheduleTaskId, formData.technicianId) 
    }

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
    setValidFields({})
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    const validation = validateField(field, value)
    
    if (validation.error) {
      setErrors((prev) => ({ ...prev, [field]: validation.error }))
      setValidFields((prev) => ({ ...prev, [field]: false }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }))
      setValidFields((prev) => ({ ...prev, [field]: true }))
    }
  }

  const handleFieldBlur = (field: string, value: string) => {
    const validation = validateField(field, value)
    
    if (validation.error) {
      setErrors((prev) => ({ ...prev, [field]: validation.error }))
      setValidFields((prev) => ({ ...prev, [field]: false }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }))
      setValidFields((prev) => ({ ...prev, [field]: true }))
    }
  }

  //  Helper function to get field styling based on validation state
  const getFieldStyling = (field: string) => {
    const hasError = !!errors[field]
    const isValid = validFields[field] && !hasError
    
    return {
      "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        borderRadius: "8px",
        ...(hasError && {
          "& fieldset": {
            borderColor: "#ef4444",
            borderWidth: "2px",
          },
          "&:hover fieldset": {
            borderColor: "#ef4444",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#ef4444",
          },
        }),
        ...(isValid && {
          "& fieldset": {
            borderColor: "#10b981",
            borderWidth: "2px",
          },
          "&:hover fieldset": {
            borderColor: "#10b981",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#10b981",
          },
        }),
      },
      ...(hasError && {
        "& .MuiFormLabel-root": {
          color: "#ef4444",
        },
        "& .MuiFormLabel-root.Mui-focused": {
          color: "#ef4444",
        },
      }),
      ...(isValid && {
        "& .MuiFormLabel-root": {
          color: "#10b981",
        },
        "& .MuiFormLabel-root.Mui-focused": {
          color: "#10b981",
        },
      }),
    }
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

  const getModalConfig = () => {
    switch (mode) {
      case "create":
        return {
          title: "Create New Task",
          subtitle: "Add a maintenance task to the schedule",
          icon: <AddIcon sx={{ fontSize: 24 }} />,
          submitText: "Create Task",
          submitColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }
      case "edit":
        return {
          title: "Edit Task",
          subtitle: "Update task information",
          icon: <EditIcon sx={{ fontSize: 24 }} />,
          submitText: "Update Task",
          submitColor: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        }
      case "delete":
        return {
          title: "Delete Task",
          subtitle: "This action cannot be undone",
          icon: <DeleteIcon sx={{ fontSize: 24 }} />,
          submitText: "Delete Task",
          submitColor: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        }
      case "assign":
        return {
          title: "Assign Technician",
          subtitle: "Assign or reassign technician to task",
          icon: <PersonAddIcon sx={{ fontSize: 24 }} />,
          submitText: "Assign Technician",
          submitColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        }
      default:
        return {
          title: "Task Management",
          subtitle: "",
          icon: <AssignmentIcon sx={{ fontSize: 24 }} />,
          submitText: "Submit",
          submitColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }
    }
  }

  const modalConfig = getModalConfig()

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
          background: modalConfig.submitColor,
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
              {modalConfig.icon}
            </Paper>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {modalConfig.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.875rem" }}>
                {modalConfig.subtitle}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {(mode === "edit" || mode === "delete" || mode === "assign") && task && (
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
                  Current Task
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  {task.taskName}
                </Typography>
              </Box>
              <Box sx={{ ml: "auto" }}>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                  Current Assignment
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  {task.assignedTo || "Unassigned"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {mode === "create" && (
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
                  {StartDate ? new Date(StartDate).toLocaleDateString() : "Not set"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {mode === "delete" && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Are you sure you want to delete this task? This action cannot be undone and will remove the task from
                the schedule permanently.
              </Typography>
            </Alert>
          </Box>
        )}

        {(mode === "create" || mode === "edit") && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="Task Name"
                  required
                  value={formData.taskName}
                  onChange={(e) => handleInputChange("taskName", e.target.value)}
                  onBlur={(e) => handleFieldBlur("taskName", e.target.value)}
                  error={!!errors.taskName}
                  placeholder="Enter descriptive task name"
                  sx={{
                    mb: 1,
                    ...getFieldStyling("taskName"),
                  }}
                  InputProps={{
                    endAdornment: validFields.taskName && !errors.taskName ? (
                      <CheckCircleIcon sx={{ color: "#10b981", fontSize: 20 }} />
                    ) : errors.taskName ? (
                      <WarningIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                    ) : null,
                  }}
                />
                {/*  Added error message display */}
                {errors.taskName && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 0.5 }}>
                    <WarningIcon sx={{ color: "#ef4444", fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: "#ef4444", fontSize: "0.75rem" }}>
                      {errors.taskName}
                    </Typography>
                  </Box>
                )}
                {!errors.taskName && formData.taskName && (
                  <Box sx={{ mb: 2 }} />
                )}
              </Box>

              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth required error={!!errors.priority} sx={{ mb: 1 }}>
                  <InputLabel>Priority Level</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority Level"
                    onChange={(e: SelectChangeEvent) => handleInputChange("priority", e.target.value)}
                    onBlur={(e) => handleFieldBlur("priority", e.target.value as string)}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      ...(errors.priority && {
                        "& fieldset": {
                          borderColor: "#ef4444",
                          borderWidth: "2px",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ef4444",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ef4444",
                        },
                      }),
                      ...(validFields.priority && !errors.priority && {
                        "& fieldset": {
                          borderColor: "#10b981",
                          borderWidth: "2px",
                        },
                        "&:hover fieldset": {
                          borderColor: "#10b981",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#10b981",
                        },
                      }),
                    }}
                    endAdornment={
                      errors.priority ? (
                        <WarningIcon sx={{ color: "#ef4444", fontSize: 20, mr: 1 }} />
                      ) : null
                    }
                  >
                    {["Low", "Medium", "High", "Urgent"].map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip
                            label={priority}
                            size="small"
                            sx={{
                              backgroundColor: getPriorityColor(priority).bg,
                              fontSize: "11px",
                              height: "20px",
                            }}
                          />
                          <Typography variant="body2">{priority} Priority</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/*  Added error message display */}
                {errors.priority && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 0.5 }}>
                    <WarningIcon sx={{ color: "#ef4444", fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: "#ef4444", fontSize: "0.75rem" }}>
                      {errors.priority}
                    </Typography>
                  </Box>
                )}
                {!errors.priority && formData.priority && (
                  <Box sx={{ mb: 2 }} />
                )}
              </Box>

              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="Maintenance Interval"
                  required
                  value={formData.interval}
                  onChange={(e) => handleInputChange("interval", e.target.value)}
                  onBlur={(e) => handleFieldBlur("interval", e.target.value)}
                  error={!!errors.interval}
                  placeholder="e.g., 7 days"
                  sx={{
                    mb: 1,
                    ...getFieldStyling("interval"),
                  }}
                  InputProps={{
                    endAdornment: validFields.interval && !errors.interval ? (
                      <CheckCircleIcon sx={{ color: "#10b981", fontSize: 20 }} />
                    ) : errors.interval ? (
                      <WarningIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                    ) : null,
                  }}
                />
                {/*  Added error message display */}
                {errors.interval && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 0.5 }}>
                    <WarningIcon sx={{ color: "#ef4444", fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: "#ef4444", fontSize: "0.75rem" }}>
                      {errors.interval}
                    </Typography>
                  </Box>
                )}
                {!errors.interval && validFields.interval && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 0.5 }}>
                    <CheckCircleIcon sx={{ color: "#10b981", fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: "#10b981", fontSize: "0.75rem" }}>
                      Valid interval format (max 99 days)
                    </Typography>
                  </Box>
                )}
                {!errors.interval && !validFields.interval && formData.interval && (
                  <Box sx={{ mb: 2 }} />
                )}
              </Box>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="assigned-tech-label" shrink>Assigned Technician</InputLabel>
                <Select
                  labelId="assigned-tech-label"
                  value={formData.technicianId}
                  label="Assigned Technician"
                  input={<OutlinedInput label="Assigned Technician" />}
                  onChange={(e: SelectChangeEvent) => handleInputChange("technicianId", e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                  }}
                  displayEmpty
                >
                  <MenuItem value="">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">Unassigned</Typography>
                      </Box>
                    </MenuItem>
                  
                  {technicianOptions.map((technician) => (
                    <MenuItem key={technician.id} value={technician.id.toString()}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">{technician.fullName} - {technician.email}</Typography>
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
                      <strong>First due date:</strong>{" "}
                      {addDaysToDate(StartDate, formData.interval) || "Invalid interval"}
                    </Typography>
                  </Box>
                </Alert>
              )}
            </Box>
          </Box>
        )}

        {mode === "assign" && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Box sx={{ position: "relative" }}>
              <FormControl fullWidth required error={!!errors.technicianId}>
                <InputLabel shrink>Select Technician</InputLabel>
                <Select
                  value={formData.technicianId}
                  label="Select Technician"
                  onChange={(e: SelectChangeEvent) => handleInputChange("technicianId", e.target.value)}
                  onBlur={(e) => handleFieldBlur("technicianId", e.target.value as string)}
                  displayEmpty
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    ...(errors.technicianId && {
                      "& fieldset": {
                        borderColor: "#ef4444",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ef4444",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ef4444",
                      },
                    }),
                    ...(validFields.technicianId && !errors.technicianId && {
                      "& fieldset": {
                        borderColor: "#10b981",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#10b981",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#10b981",
                      },
                    }),
                  }}
                  endAdornment={
                    validFields.technicianId && !errors.technicianId ? (
                      <CheckCircleIcon sx={{ color: "#10b981", fontSize: 20, mr: 1 }} />
                    ) : errors.technicianId ? (
                      <WarningIcon sx={{ color: "#ef4444", fontSize: 20, mr: 1 }} />
                    ) : null
                  }
                >
                <MenuItem value={""}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: "0.7rem" }}></Avatar>
                    <Typography variant="body2"> Unassigned</Typography>
                  </Box>
                </MenuItem>

                  {technicianOptions.map((technician) => (
                    <MenuItem key={technician.id} value={technician.id.toString()}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: "0.7rem" }}>
                          {technician.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </Avatar>
                        <Typography variant="body2">{technician.fullName} - {technician.email}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/*  Added error message display */}
              {errors.technicianId && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <WarningIcon sx={{ color: "#ef4444", fontSize: 16 }} />
                  <Typography variant="caption" sx={{ color: "#ef4444", fontSize: "0.75rem" }}>
                    {errors.technicianId}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
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
          disabled={
            mode === "delete"
                ? false
                : !formData.taskName.trim() || !formData.priority || !formData.interval.trim()
          }
          sx={{
            minWidth: "120px",
            background: modalConfig.submitColor,
            "&:hover": {
              opacity: 0.9,
            },
            "&:disabled": {
              background: "#e5e7eb",
              color: "#9ca3af",
            },
          }}
        >
          {modalConfig.submitText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
