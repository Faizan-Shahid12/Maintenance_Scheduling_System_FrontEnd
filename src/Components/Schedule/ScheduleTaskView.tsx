import type React from "react"
import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Fab,
} from "@mui/material"
import {
  Add,
  Edit,
  Search,
  CalendarToday,
  Task,
  AddTask,
  RemoveCircle,
  AccessTime,
  Person,
  FilterList,
  Home,
  ChevronRight,
  PersonAdd,
} from "@mui/icons-material"
import type { DisplayScheduleModel } from "../../Models/MainScheduleModels/MainScheduleModel"
import type { TechnicianOptionModel } from "../../Models/Technician/TechnicianModel"
import { ScheduleTaskModal } from "../ScheduleTask/ScheduleTaskModal"
import { useDispatch, useSelector } from "react-redux"
import { type MyDispatch, type RootState } from "../../Redux/Store"
import { AddScheduleTask, AssignTechnicianToScheduleTask, DeleteScheduleTask, EditScheduleTask } from "../../Redux/Thunks/ScheduleThunk"
import type { CreateScheduleTaskModel } from "../../Models/ScheduleTaskModels/ScheduleTaskModel"
import { useToast } from "../../hooks/useToast"
import { ToastNotification } from "../ui/ToastNotification"

const HeaderCard = ({ children }: { children: React.ReactNode }) => (
  <Paper
    sx={{
      backgroundColor: "#ffffff",
      color: "inherit",
      p: 3,
      mb: 3,
      borderRadius: 2,
      position: "relative",
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
    }}
  >
    {children}
  </Paper>
)

const StatsCard = ({ children }: { children: React.ReactNode }) => (
  <Paper
    elevation={0}
    sx={{
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 2,
      p: 2,
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    {children}
  </Paper>
)

const TaskCard = ({ children }: { children: React.ReactNode }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "1px solid #e5e7eb",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
        borderColor: "#cbd5e1",
      },
    }}
  >
    {children}
  </Card>
)

const TaskAvatar = ({ name }: { name: string }) => {
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Avatar
      sx={{
        width: 56,
        height: 56,
        background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
        fontSize: "1.2rem",
        fontWeight: "bold",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {getInitials(name)}
    </Avatar>
  )
}

const PriorityChip = ({ priority }: { priority: string }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
      case "critical":
        return { bgcolor: "#ffebee", color: "#c62828" }
      case "medium":
        return { bgcolor: "#fff3e0", color: "#ef6c00" }
      case "low":
        return { bgcolor: "#e8f5e8", color: "#2e7d32" }
      default:
        return { bgcolor: "#f3e5f5", color: "#7b1fa2" }
    }
  }

  return (
    <Chip
      label={priority}
      size="small"
      sx={{
        ...getPriorityColor(priority),
        fontWeight: "bold",
        fontSize: "0.7rem",
      }}
    />
  )
}

interface ScheduleTaskViewProps {
  schedule: DisplayScheduleModel
  onBackToSchedules: () => void
  technicianOptions: TechnicianOptionModel[]
  equipmentName: string
}

export const ScheduleTaskView: React.FC<ScheduleTaskViewProps> = ({
  schedule,
  onBackToSchedules,
  technicianOptions,
  equipmentName,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  const [technicianFilter, setTechnicianFilter] = useState<string>("All")

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | "assign">("create")
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const userRole = localStorage.getItem("Role")
  const dispatch = useDispatch<MyDispatch>()
  
  // Toast notification hook
  const { toast, showSuccess, showError, showWarning, showInfo, hideToast } = useToast()

  let scheduleTask = useSelector((state: RootState) => state.Schedule.ScheduleListWithTask.find(s => s.scheduleId === schedule.scheduleId)?.scheduleTasks)

  // Filter tasks based on search and filters
  const filteredTasks = scheduleTask?.filter((task) => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter
    const matchesTechnician = technicianFilter === "All" || task.assignedTo === technicianFilter
    return matchesSearch && matchesPriority && matchesTechnician
  })

  const taskStats = {
    total: scheduleTask?.length,
    high: scheduleTask?.filter((t) => t.priority === "High").length,
    medium: scheduleTask?.filter((t) => t.priority === "Medium").length,
    low: scheduleTask?.filter((t) => t.priority === "Low").length,
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const parseDaysFromInterval = (interval: string) => {
    const match = interval.split(".")[0]
    return match + " Days"
  }

  const handleAddTask = () => {
    setSelectedTask(null)
    setModalMode("create")
    setModalOpen(true)
  }

  const handleEditTask = (task: any) => {
    setSelectedTask(task)
    setModalMode("edit")
    setModalOpen(true)
  }

  const handleDeleteTask = (task: any) => {
    setSelectedTask(task)
    setModalMode("delete")
    setModalOpen(true)
  }

  const handleAssignTask = (task: any) => {
    setSelectedTask(task)
    setModalMode("assign")
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedTask(null)
  }

  const handleTaskSubmit = (taskData: CreateScheduleTaskModel) => 
  {
    dispatch(AddScheduleTask({ScheduleId: schedule.scheduleId,Task: taskData})).then(() => {
      showSuccess(`Task "${taskData.taskName}" created successfully`)
    }).catch((error) => {
      showError(`Failed to create task: ${error.message || 'Unknown error'}`)
    })
  }

  const handleTaskEdit = async (taskData: any, AssignData : {taskId: number, TechId: string}) => {
    try {
    await dispatch(
      EditScheduleTask({ ScheduleId: schedule.scheduleId, ScheduleTask1: taskData })
    ).unwrap();

    dispatch(AssignTechnicianToScheduleTask({ScheduleId: schedule.scheduleId, ScheduleTaskId: AssignData.taskId, TechId: AssignData.TechId}));
    showSuccess(`Task "${taskData.taskName}" updated successfully`)
  } catch (error : any) {
    console.error("Edit failed:", error);
    showError(`Failed to update task: ${error.message || 'Unknown error'}`)
  }
  }

  const handleTaskDelete = (taskId: number) => 
  {
    const task = scheduleTask?.find(t => t.scheduleTaskId === taskId)
    dispatch(DeleteScheduleTask({ScheduleId: schedule.scheduleId,TaskId: taskId})).then(() => {
      showSuccess(`Task "${task?.taskName || 'Unknown'}" deleted successfully`)
    }).catch((error) => {
      showError(`Failed to delete task: ${error.message || 'Unknown error'}`)
    })
  }

  const handleTaskAssign = (taskId: number, technicianId: string) => 
  {
    const task = scheduleTask?.find(t => t.scheduleTaskId === taskId)
    const technician = technicianOptions.find(t => t.id === technicianId)
    dispatch(AssignTechnicianToScheduleTask({ScheduleId: schedule.scheduleId, ScheduleTaskId: taskId, TechId: technicianId})).then(() => {
      showSuccess(`Task "${task?.taskName || 'Unknown'}" assigned to ${technician?.fullName || 'technician'} successfully`)
    }).catch((error) => {
      showError(`Failed to assign task: ${error.message || 'Unknown error'}`)
    })
  }

  const renderTaskActionButtons = (task: any) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          pt: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button
          variant="text"
          size="small"
          startIcon={<Edit sx={{ fontSize: 14 }} />}
          onClick={(e) => {
            e.stopPropagation()
            handleEditTask(task)
          }}
          sx={{
            fontSize: "0.7rem",
            minWidth: "auto",
            px: 1,
            py: 0.5,
            color: "#4a90e2",
            "&:hover": {
              bgcolor: "#f0f7ff",
              color: "#2c5aa0",
            },
          }}
        >
          Edit
        </Button>
        <Button
          variant="text"
          size="small"
          startIcon={<PersonAdd sx={{ fontSize: 14 }} />}
          onClick={(e) => {
            e.stopPropagation()
            handleAssignTask(task)
          }}
          sx={{
            fontSize: "0.7rem",
            minWidth: "auto",
            px: 1,
            py: 0.5,
            color: "#10b981",
            "&:hover": {
              bgcolor: "#f0fdf4",
              color: "#059669",
            },
          }}
        >
          Assign
        </Button>
        <Button
          variant="text"
          size="small"
          startIcon={<RemoveCircle sx={{ fontSize: 14 }} />}
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteTask(task)
          }}
          sx={{
            fontSize: "0.7rem",
            minWidth: "auto",
            px: 1,
            py: 0.5,
            color: "#f44336",
            "&:hover": {
              bgcolor: "#ffebee",
              color: "#d32f2f",
            },
          }}
        >
          Remove
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 2 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                startIcon={<Home />}
                onClick={onBackToSchedules}
                sx={{
                  color: "#4a90e2",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "#f0f7ff",
                  },
                }}
              >
                Schedule Management
              </Button>
              <ChevronRight sx={{ color: "#9ca3af", fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                }}
              >
                {schedule.scheduleName} Tasks
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Header */}
        <HeaderCard>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Paper
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: "#e0e7ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    boxShadow: "none",
                  }}
                >
                  <Task sx={{ fontSize: 28, color: "#2563eb" }} />
                </Paper>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {schedule.scheduleName} Tasks
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Manage tasks for {schedule.scheduleType} schedule
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Chip
                      label={schedule.isActive ? "Active Schedule" : "Inactive Schedule"}
                      size="small"
                      sx={{
                        bgcolor: "#eef2ff",
                        color: "#2563eb",
                        fontWeight: "bold",
                      }}
                    />
                    <Chip
                      label={`${schedule.scheduleType} Interval`}
                      size="small"
                      sx={{
                        bgcolor: "#eef2ff",
                        color: "#2563eb",
                        fontWeight: "bold",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              {userRole?.includes("Admin") && (
                <Button
                  variant="contained"
                  startIcon={<AddTask />}
                  onClick={handleAddTask}
                >
                  Add Task
                </Button>
              )}
            </Box>

            {/* Task Statistics */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#2196f3", width: 36, height: 36 }}>
                    <Task sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {taskStats.total}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Tasks
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#f44336", width: 36, height: 36 }}>
                    <FilterList sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {taskStats.high}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      High Priority
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#ff9800", width: 36, height: 36 }}>
                    <FilterList sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {taskStats.medium}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Medium Priority
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#4caf50", width: 36, height: 36 }}>
                    <FilterList sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {taskStats.low}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Low Priority
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
            </Box>
          </Box>
        </HeaderCard>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <TextField
                fullWidth
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ flex: "1 1 150px", minWidth: "150px" }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select value={priorityFilter} label="Priority" onChange={(e) => setPriorityFilter(e.target.value)}>
                  <MenuItem value="All">All Priorities</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
              <FormControl fullWidth>
                <InputLabel>Technician</InputLabel>
                <Select
                  value={technicianFilter}
                  label="Technician"
                  onChange={(e) => setTechnicianFilter(e.target.value)}
                >
                  <MenuItem value="All">All Technicians</MenuItem>
                  {technicianOptions.map((tech) => (
                    <MenuItem key={tech.id} value={tech.fullName}>
                      {tech.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
              <Typography variant="body2" color="text.secondary">
                {filteredTasks?.length} of {scheduleTask?.length} tasks
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Task Cards */}
        <Box sx={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: 3,
          '@media (max-width: 768px)': {
            gap: 2
          }
        }}>
          {(filteredTasks?.length ?? 0) > 0 ? (
            filteredTasks?.sort((a,b) => b.scheduleTaskId - a.scheduleTaskId).map((task) => (
              <Box key={task.scheduleTaskId} sx={{ 
                flex: "1 1 350px", 
                minWidth: { xs: '100%', sm: '300px', md: '350px' }, 
                maxWidth: { xs: '100%', sm: 'none', md: '400px' }
              }}>
                <TaskCard>
                  <CardHeader
                    avatar={<TaskAvatar name={task.taskName} />}
                    title={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                          {task.taskName}
                        </Typography>
                      </Box>
                    }
                    subheader={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {task.equipmentName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                          <PriorityChip priority={task.priority} />
                          <Chip
                            label={parseDaysFromInterval(task.interval)}
                            size="small"
                            icon={<AccessTime />}
                            sx={{ fontSize: "0.7rem" }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                                                              {/* Task Details */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mt: 2, mb: 2, gap: 3 }}>
                       <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                         <CalendarToday sx={{ color: "#666", fontSize: 16 }} />
                         <Box>
                           <Typography variant="caption" color="text.secondary">
                             Due Date
                           </Typography>
                           <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                             {formatDate(task.dueDate)}
                           </Typography>
                         </Box>
                       </Box>
                       <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flex: "1 1 auto" }}>
                          <Person sx={{ color: "#666", fontSize: 16 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Assigned To
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                              {task.assignedTo || "Unassigned"}
                            </Typography>
                                                         <Typography
                               variant="caption"
                               color="text.secondary"
                               sx={{
                                 display: "block",
                                 fontSize: "0.75rem",
                                 lineHeight: 1.2,
                                 mt: 0.25
                               }}
                             >
                               {task.techEmail || "No email"}
                             </Typography>
                          </Box>
                        </Box>
                     </Box>
                    {userRole?.includes("Admin") && renderTaskActionButtons(task)}
                  </CardContent>
                </TaskCard>
              </Box>
            ))
          ) : (
            <Paper sx={{ p: 6, textAlign: "center", mt: 3, width: "100%" }}>
              <Task sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tasks found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || priorityFilter !== "All" || technicianFilter !== "All"
                  ? "Try adjusting your filters or search terms"
                  : "This schedule doesn't have any tasks yet. Add your first task to get started."}
              </Typography>
              {userRole?.includes("Admin") && (
                <Button variant="contained" startIcon={<AddTask />} onClick={handleAddTask}>
                  Add Task
                </Button>
              )}
            </Paper>
          )}
        </Box>

        {/* Floating Action Button - Admin only */}
        {userRole?.includes("Admin") && (
          <Fab
            color="primary"
            aria-label="add task"
            sx={{ position: "fixed", bottom: 24, right: 24 }}
            onClick={handleAddTask}
          >
            <Add />
          </Fab>
        )}

        <ScheduleTaskModal
          open={modalOpen}
          onClose={handleModalClose}
          mode={modalMode}
          task={selectedTask}
          onSubmit={handleTaskSubmit}
          onEdit={handleTaskEdit}
          onDelete={handleTaskDelete}
          onAssign={handleTaskAssign}
          StartDate={schedule.startDate}
          equipmentName={equipmentName}
          technicianOptions={technicianOptions}
        />

        {/* Toast Notifications */}
        <ToastNotification
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          duration={toast.duration}
          onClose={hideToast}
          position="bottom-right"
        />
      </Container>
    </Box>
  )
}
