import type React from "react"
import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  IconButton,
  Paper,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
  type SelectChangeEvent,
  FormHelperText,
} from "@mui/material"
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material"
import type { CreateScheduleTaskModel } from "../../Models/ScheduleTaskModels/ScheduleTaskModel"
import type { CreateScheduleModel } from "../../Models/MainScheduleModels/MainScheduleModel"
import type { TechnicianOptionModel } from "../../Models/Technician/TechnicianModel"
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel"
import type { Task } from "../../Models/TaskModels/TaskModel"
import { CreateTaskModal } from "../ScheduleTask/AssignScheduleTaskModal"
import { useDispatch, useSelector } from "react-redux"
import type { MyDispatch, RootState } from "../../Redux/Store"
import { GetTaskByEquipId } from "../../Redux/Thunks/TaskThunk"

export type TaskSelectionMode = "create" | "select"

export interface AddScheduleModalProps {
  show: boolean
  onClose: () => void
  onSubmit: (scheduleData: CreateScheduleModel) => void
  equipmentOptions: Equipment[]
  technicianOptions: TechnicianOptionModel[]
}
interface FormErrors {
  scheduleName?: string
  scheduleType?: string
  equipment?: string
  interval?: string
  startDate?: string
  endDate?: string
  scheduleTasks?: string
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  show,
  onClose,
  onSubmit,
  equipmentOptions,
  technicianOptions,
}) => {
  // Schedule form state
  const [scheduleName, setScheduleName] = useState("")
  const [scheduleType, setScheduleType] = useState("")
  const [activeScheduleOption, setActiveScheduleOption] = useState("active")
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [endDate, setEndDate] = useState<string>("")
  const [interval, setInterval] = useState("")
  const [equipmentName, setEquipmentName] = useState<string>("")
  const [equipId, setEquipId] = useState<number>(-1)

  // Task management state
  const [selectedTasks, setSelectedTasks] = useState<CreateScheduleTaskModel[]>([])
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskSelectionMode, setTaskSelectionMode] = useState<TaskSelectionMode>("create")
  const [showIntervalInput, setShowIntervalInput] = useState(false)
  const [selectedTaskForInterval, setSelectedTaskForInterval] = useState<CreateScheduleTaskModel | null>(null)
  const [intervalValue, setIntervalValue] = useState("")
  const [taskFilter, setTaskFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("All")

  const existingTasks = useSelector((state: RootState) => state.AppTask.EquipmentTask)
  const dispatch = useDispatch<MyDispatch>()

  useEffect(() => {
    if (equipId !== -1) {
      dispatch(GetTaskByEquipId(equipId))
    }
  }, [equipId, dispatch])

  const resetForm = () => {
    setScheduleName("")
    setScheduleType("")
    setActiveScheduleOption("active")
    setStartDate(new Date().toISOString().split("T")[0])
    setEndDate("")
    setInterval("")
    setEquipmentName("")
    setEquipId(-1)
    setSelectedTasks([])
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // Auto-set interval based on schedule type
  useEffect(() => {
    switch (scheduleType) {
      case "Daily":
        setInterval("1 day")
        setErrors((prev) => ({ ...prev, interval: "" }))
        break
      case "Weekly":
        setInterval("7 days")
        setErrors((prev) => ({ ...prev, interval: "" }))
        break
      case "Monthly":
        setInterval("30 days")
        setErrors((prev) => ({ ...prev, interval: "" }))
        break
      case "Yearly":
        setInterval("365 days")
        setErrors((prev) => ({ ...prev, interval: "" }))
        break
      case "Custom":
        setInterval("")
        break
      default:
        setInterval("")
    }
  }, [scheduleType])

  // Update task due dates when start date changes
  useEffect(() => {
    if (!selectedTasks.length) return
    setSelectedTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.interval) {
          return {
            ...task,
            dueDate: addDaysToDate(startDate, task.interval),
          }
        }
        return task
      }),
    )
  }, [startDate])

  const [errors, setErrors] = useState<FormErrors>({})

  const validateField = (field: string, value: any) => {
    let message = ""

    const today = new Date()
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null

    switch (field) {
      case "scheduleName":
        if (!value) message = "Schedule Name is required."
        break
      case "scheduleType":
        if (!value) message = "Type of Schedule is required."
        break
      case "equipment":
        if (value === "" || value === -1 || value == null) message = "Equipment is required."
        break
      case "interval":
        if (!value) message = "Interval is required."
        break
      case "startDate":
        if (new Date(value) < new Date(today.toDateString())) {
          message = "Start date cannot be in the past."
        }
        break
      case "endDate":
        if (value && new Date(value) < start) {
          message = "End date cannot be before start date."
        }
        break
      case "scheduleTasks":
        if (!selectedTasks || selectedTasks.length < 1) {
          message = "At least one task is required."
        }
        break
    }

    setErrors((prev) => ({ ...prev, [field]: message }))
    return message === ""
  }

  const validateAll = () => {
    return (
      validateField("scheduleName", scheduleName) &&
      validateField("scheduleType", scheduleType) &&
      validateField("equipment", equipId) &&
      validateField("interval", interval) &&
      validateField("startDate", startDate) &&
      validateField("endDate", endDate) &&
      validateField("scheduleTasks", selectedTasks)
    )
  }

  const handleSubmit = () => {
    if (!validateAll()) return

    const scheduleData: CreateScheduleModel = {
      scheduleName,
      scheduleType,
      isActive: activeScheduleOption === "active",
      startDate,
      interval: interval.match(/(\d+)/)?.[1] + ".00:00:00",
      scheduleTasks: selectedTasks,
      equipId: equipId,
    }

    if (endDate !== "") {
      scheduleData.endDate = endDate
    }

    onSubmit(scheduleData)
    resetForm();
  }

  const handleAddNewTask = () => {
    setShowTaskModal(true)
  }

  const handleDeleteTask = (index: number) => {
    setSelectedTasks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSelectExistingTask = (task: Task) => {
    if (!selectedTasks.find((t) => t.taskName === task.taskName)) {
      let techid : string | null = technicianOptions.filter((t) => t.fullName === task.assignedTo)[0]?.id

      if (techid === "") {
        techid = null;
      }

      const taskAsCreateTask: CreateScheduleTaskModel = {
        taskName: task.taskName,
        equipmentName: task.equipmentName,
        priority: task.priority,
        dueDate: "",
        interval: "1.00:00:00",
        technicianId: techid,
        technicianName: task.assignedTo,
      }
      setSelectedTaskForInterval(taskAsCreateTask)
      setIntervalValue("")
      setShowIntervalInput(true)
    }
  }

  const handleIntervalSubmit = () => {
    if (selectedTaskForInterval && intervalValue.trim()) {
      const taskWithInterval: CreateScheduleTaskModel = {
        ...selectedTaskForInterval,
        interval: intervalValue,
        dueDate: addDaysToDate(startDate, intervalValue),
      }
      setSelectedTasks((prev) => [...prev, taskWithInterval])
      setShowIntervalInput(false)
      setSelectedTaskForInterval(null)
      setIntervalValue("")
    }
  }

  const handleIntervalCancel = () => {
    setShowIntervalInput(false)
    setSelectedTaskForInterval(null)
    setIntervalValue("")
  }

  const handleTaskModalSubmit = (taskData: CreateScheduleTaskModel) => {
    setSelectedTasks((prev) => [...prev, taskData])
    setShowTaskModal(false)
  }

  // Helper functions
  const parseInvertalFromDays = (interval: string) => {
    const match = interval.match(/(\d+)/)?.[1]
    return match ? Number.parseInt(match, 10) : 0
  }

  function addDaysToDate(startDate: Date | string, interval: string): string {
    const date = typeof startDate === "string" ? new Date(startDate) : startDate
    const days = parseInvertalFromDays(interval)
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  const filteredExistingTasks =
    existingTasks?.filter((task) => {
      const matchesName = task.taskName.toLowerCase().includes(taskFilter.toLowerCase())
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter
      return matchesName && matchesPriority
    }) || []

  const uniquePriorities = Array.from(new Set(existingTasks?.map((task) => task.priority) || []))

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      Low: { bgcolor: "#dcfce7", color: "#166534" },
      Medium: { bgcolor: "#fef3c7", color: "#92400e" },
      High: { bgcolor: "#fed7d7", color: "#c53030" },
      Urgent: { bgcolor: "#e2e8f0", color: "#2d3748" },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig["Medium"]

    return (
      <Chip
        label={priority}
        size="small"
        sx={{
          backgroundColor: config.bgcolor,
          color: config.color,
          fontSize: "12px",
          fontWeight: 500,
          height: "20px",
        }}
      />
    )
  }

  if (!show) return null

  return (
    <>
      <Dialog
        open={show}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Create New Schedule</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          {/* Schedule Information Section */}
          <Card sx={{ mb: 3, border: '1px solid #e5e7eb' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 600, color: "#374151" }}>
                Schedule Information
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label="Schedule Name"
                  required
                  value={scheduleName}
                  onChange={(e) => {
                    setScheduleName(e.target.value);
                    validateField("scheduleName", e.target.value);
                  }}
                  error={!!errors.scheduleName}
                  helperText={errors.scheduleName}
                />

                <FormControl fullWidth required error={!!errors.scheduleType}>
                  <InputLabel>Schedule Type</InputLabel>
                  <Select
                    value={scheduleType}
                    label="Schedule Type"
                    onChange={(e: SelectChangeEvent) => {
                      setScheduleType(e.target.value);
                      validateField("scheduleType", e.target.value);
                    }}
                  >
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Yearly">Yearly</MenuItem>
                    <MenuItem value="Custom">Custom</MenuItem>
                  </Select>
                  <FormHelperText>{errors.scheduleType}</FormHelperText>
                </FormControl>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <FormControl fullWidth required error={!!errors.equipment}>
                  <InputLabel>Equipment</InputLabel>
                  <Select
                    value={equipId === -1 ? "" : String(equipId)}
                    label="Equipment"
                    onChange={(e: SelectChangeEvent) => {
                      const selectedId = Number(e.target.value)
                      setEquipId(selectedId)
                      const equipment = equipmentOptions.find((eq) => eq.equipmentId === selectedId)
                      if (equipment) setEquipmentName(equipment.name)
                      validateField("equipment", selectedId)
                      setSelectedTasks([])
                    }}
                  >
                    {equipmentOptions.map((equipment) => (
                      <MenuItem key={equipment.equipmentId} value={String(equipment.equipmentId)}>
                        {equipment.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.equipment}</FormHelperText>
                </FormControl>

                <TextField
                  fullWidth
                  label="Interval"
                  required
                  placeholder="e.g., 7 days"
                  value={interval}
                  onChange={(e) => {
                    if (scheduleType === "Custom") {
                      setInterval(e.target.value);
                      validateField("interval", e.target.value);
                    }
                  }}
                  disabled={scheduleType !== "Custom"}
                  error={!!errors.interval}
                  helperText={errors.interval}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    validateField("startDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                />

                <TextField
                  fullWidth
                  label="End Date (Optional)"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    validateField("endDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                  Status
                </Typography>
                <RadioGroup row value={activeScheduleOption} onChange={(e) => setActiveScheduleOption(e.target.value)}>
                  <FormControlLabel value="active" control={<Radio />} label="Active" />
                  <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                </RadioGroup>
              </Box>
            </CardContent>
          </Card>

          {/* Task Management Section */}
          {errors.scheduleTasks && (
            <Typography variant="caption" color="error" sx={{ mb: 1 }}>
              {errors.scheduleTasks}
            </Typography>
          )}
          <Card sx={{ border: '1px solid #e5e7eb' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151' }}>
                  Schedule Tasks ({selectedTasks.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddNewTask}
                  >
                    New Task
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setTaskSelectionMode(taskSelectionMode === 'create' ? 'select' : 'create')}
                  >
                    {taskSelectionMode === 'create' ? 'Select Existing' : 'Create New'}
                  </Button>
                </Box>
              </Box>

              {/* Existing Tasks Selection */}
              {taskSelectionMode === 'select' && (
                <Box sx={{ mb: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500 }}>
                    Available Tasks
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search tasks..."
                      value={taskFilter}
                      onChange={(e) => setTaskFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={priorityFilter}
                        label="Priority"
                        onChange={(e: SelectChangeEvent) => setPriorityFilter(e.target.value)}
                      >
                        <MenuItem value="All">All Priorities</MenuItem>
                        {uniquePriorities.map((priority) => (
                          <MenuItem key={priority} value={priority}>
                            {priority}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: '#f9fafb',
                    }}
                  >
                    {filteredExistingTasks.length === 0 ? (
                      <Box sx={{ p: 3, textAlign: 'center', color: '#6b7280' }}>
                        {taskFilter || priorityFilter !== 'All'
                          ? 'No tasks match your filters'
                          : 'No tasks available for this equipment'}
                      </Box>
                    ) : (
                      filteredExistingTasks.map((task) => {
                        const isAlreadySelected = selectedTasks.find((t) => t.taskName === task.taskName)
                        return (
                          <Box
                            key={task.taskId}
                            sx={{
                              p: 2,
                              borderBottom: '1px solid #e5e7eb',
                              cursor: isAlreadySelected ? 'not-allowed' : 'pointer',
                              backgroundColor: isAlreadySelected ? '#f3f4f6' : 'white',
                              '&:hover': {
                                backgroundColor: isAlreadySelected ? '#f3f4f6' : '#f0f9ff',
                              },
                              '&:last-child': { borderBottom: 'none' },
                              opacity: isAlreadySelected ? 0.6 : 1,
                            }}
                            onClick={() => !isAlreadySelected && handleSelectExistingTask(task)}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {task.taskName}
                                </Typography>
                                {isAlreadySelected && (
                                  <Chip
                                    label="Added"
                                    size="small"
                                    sx={{
                                      height: '18px',
                                      fontSize: '10px',
                                      backgroundColor: '#dcfce7',
                                      color: '#166534',
                                    }}
                                  />
                                )}
                              </Box>
                              {getPriorityBadge(task.priority)}
                            </Box>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              {task.equipmentName} • {task.assignedTo}
                            </Typography>
                          </Box>
                        )
                      })
                    )}
                  </Box>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              )}

              {/* Selected Tasks */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500 }}>
                  Selected Tasks
                </Typography>

                {selectedTasks.length === 0 ? (
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      backgroundColor: '#f8f9fa',
                      border: '2px dashed #d1d5db',
                      borderRadius: '12px',
                    }}
                  >
                    <AssignmentIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                      No tasks selected
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                      Use "New Task" or "Select Existing" to add tasks to this schedule
                    </Typography>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {selectedTasks.map((task, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 2,
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                              {task.taskName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              {getPriorityBadge(task.priority)}
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                {task.equipmentName}
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              Interval: {task.interval} • {task.technicianName || 'Unassigned'}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteTask(index)}
                            sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button variant="outlined" onClick={handleClose} sx={{ minWidth: '100px' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<SaveIcon />}
            disabled={!scheduleName || !scheduleType || !startDate || !interval}
            sx={{ minWidth: '120px' }}
          >
            Save Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleTaskModalSubmit}
        StartDate={startDate}
        equipmentName={equipmentName}
        technicianOptions={technicianOptions}
      />

      {/* Interval Assignment Dialog */}
      <Dialog
        open={showIntervalInput}
        onClose={handleIntervalCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#1f2937' }}>Set Task Interval</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ mb: 2, color: '#6b7280' }}>
              Set the interval for "{selectedTaskForInterval?.taskName}"
            </Typography>
            <TextField
              fullWidth
              label="Interval (days)"
              type="number"
              inputProps={{ min: 1, max: 99 }}
              placeholder="e.g., 2"
              value={intervalValue}
              onChange={(e) => {
                let value = e.target.value;

                if (value === "") {
                  setIntervalValue("");
                  return;
                }

                let num = parseInt(value, 10);

                if (isNaN(num)) {
                  setIntervalValue("");
                  return;
                }

                if (num >= 1000) {
                  num = 99;
                }

                setIntervalValue(num.toString());
              }}
              autoFocus
              error={
                intervalValue !== "" &&
                (parseInt(intervalValue, 10) < 1 || parseInt(intervalValue, 10) > 99)
              }
              helperText={
                intervalValue !== "" &&
                (parseInt(intervalValue, 10) < 1 || parseInt(intervalValue, 10) > 99)
                  ? "Interval must be between 1 and 99."
                  : ""
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={handleIntervalCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleIntervalSubmit}
            variant="contained"
            disabled={!intervalValue.trim()}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
