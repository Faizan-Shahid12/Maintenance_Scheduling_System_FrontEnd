"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { MyDispatch, RootState } from "../Redux/Store"
import { GetAllSortedByDates } from "../Redux/Thunks/ScheduleThunk"
import { GetAllOverDueTasks } from "../Redux/Thunks/TaskThunk"
import { GetAllTechnicians } from "../Redux/Thunks/TechnicianThunk"

import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  IconButton,
  Skeleton,
} from "@mui/material"
import {
  Schedule as ScheduleIcon,
  Warning,
  Assignment,
  Person,
  TrendingUp,
  Engineering,
  Dashboard as DashboardIcon,
  Visibility,
  PlayArrow,
  Pause,
} from "@mui/icons-material"
import { ScheduleModal } from "../Components/Schedule/ScheduleModal"
import { TaskModal } from "../Components/Task/TaskModal"
import type { DisplayScheduleModel } from "../Models/MainScheduleModels/MainScheduleModel"
import type { Task } from "../Models/TaskModels/TaskModel"

// Styled Components modernized for light theme
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
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
      },
    }}
  >
    {children}
  </Paper>
)

const DashboardCard = ({ children, title }: { children: React.ReactNode; title: string }) => (
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
      height: "100%",
    }}
  >
    <CardHeader
      title={
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1f2937" }}>
          {title}
        </Typography>
      }
      sx={{ pb: 1 }}
    />
    <CardContent sx={{ pt: 0 }}>{children}</CardContent>
  </Card>
)

const PriorityChip = ({ priority }: { priority: string }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
      case "urgent":
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

const StatusChip = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return { bgcolor: "#e8f5e8", color: "#2e7d32", icon: <PlayArrow /> }
      case "inactive":
        return { bgcolor: "#fff3cd", color: "#856404", icon: <Pause /> }
      case "overdue":
        return { bgcolor: "#ffebee", color: "#c62828", icon: <Warning /> }
      default:
        return { bgcolor: "#f3e5f5", color: "#7b1fa2", icon: <Assignment /> }
    }
  }

  const colorConfig = getStatusColor(status)
  return (
    <Chip
      label={status}
      size="small"
      icon={colorConfig.icon}
      sx={{
        bgcolor: colorConfig.bgcolor,
        color: colorConfig.color,
        fontWeight: "bold",
        fontSize: "0.7rem",
      }}
    />
  )
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "#4caf50"
    case "inactive":
      return "#9e9e9e"
    case "overdue":
      return "#f44336"
    default:
      return "#607d8b"
  }
}

export const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<MyDispatch>()
  const schedules = useSelector((state: RootState) => state.Schedule.ScheduleListWithTask)
  const technicians = useSelector((state: RootState) => state.Technicians.Technicians)
  const overdueTask = useSelector((state: RootState) => state.AppTask.MainTask || [])
  const loadingSchedules = useSelector((state: RootState) => state.Schedule.loading)
  const loadingTasks = useSelector((state: RootState) => state.AppTask.loading)

  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [modalView, setModalView] = useState<"view">("view")

  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [taskModalView, setTaskModalView] = useState<"view">("view")

  const overdueTasks = [...overdueTask].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  useEffect(() => {
    dispatch(GetAllSortedByDates())
    dispatch(GetAllOverDueTasks())
    dispatch(GetAllTechnicians())
  }, [dispatch])

  const upcomingSchedules = schedules
    .filter((schedule) => {
      const today = new Date()
      const startDate = new Date(schedule.startDate)

      // Only show active schedules that start in the future
      return schedule.isActive === true && startDate > today
    })
    .slice(0, 5)

  const technicianActivity = technicians.map((tech) => {
    let assignedTasks = tech.assignedTasks

    if (assignedTasks === undefined) {
      assignedTasks = []
    }

    const completedTasks = assignedTasks.filter((task) => task.status === "Completed")
    const pendingTasks = assignedTasks.filter((task) => task.status === "Pending")
    const techOverdueTasks = assignedTasks.filter((task) => task.status.toLowerCase() === "overdue")
    const completionRate = assignedTasks.length > 0 ? (completedTasks.length / assignedTasks.length) * 100 : 0

    return {
      ...tech,
      totalTasks: assignedTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      overdueTasks: techOverdueTasks.length,
      completionRate,
      performanceRating:
        completionRate >= 80 && techOverdueTasks.length === 0
          ? "excellent"
          : completionRate >= 60 && techOverdueTasks.length <= 2
            ? "good"
            : completionRate >= 40
              ? "average"
              : "needs-improvement",
    }
  })

  const handleViewSchedule = (schedule: DisplayScheduleModel) => {
    setSelectedSchedule(schedule)
    setModalView("view")
    setShowScheduleModal(true)
  }
  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setTaskModalView("view")
    setShowTaskModal(true)
  }

  const handleCloseModal = () => {
    setShowScheduleModal(false)
    setSelectedSchedule(null)
  }
  const handleCloseTaskModal = () => {
    setShowTaskModal(false)
    setSelectedTask(null)
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const allTasks = technicians.flatMap((tech) => tech.assignedTasks)
  const dashboardStats = {
    totalSchedules: schedules.length,
    activeSchedules: schedules.filter((s) => s.isActive).length,
    totalTasks: allTasks.length,
    overdueTasks: overdueTasks.length,
    completedTasks: allTasks.filter((t) => t?.status === "Completed").length,
    activeTechnicians: technicians.length,
  }

  // Enhanced progress color calculation based on completion rate and overdue task count
  const getProgressColor = (rate: number, overdueCount: number) => {
    if (rate >= 80 && overdueCount === 0) return "#4caf50" // Excellent - Green
    if (rate >= 60 && overdueCount <= 2) return "#2196f3" // Good - Blue
    if (rate >= 40) return "#ff9800" // Average - Orange
    return "#f44336" // Needs Improvement - Red
  }

  const renderUpcomingSchedules = () => (
    <List>
      {upcomingSchedules.map((schedule) => (
        <ListItem key={schedule.scheduleId}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: getStatusColor(schedule.isActive ? "Active" : "Inactive") }}>
              <ScheduleIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {schedule.scheduleName}
                </Typography>
                <StatusChip status={schedule.isActive ? "Active" : "Inactive"} />
              </Box>
            }
            secondary={
              <Box component="span" sx={{ display: "block" }}>
                <Typography variant="body2" component="span" sx={{ display: "block" }}>
                  Starts: {formatDate(schedule.startDate)} • {schedule.scheduleType}
                </Typography>
                <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <Typography variant="caption" component="span">
                    {getDaysUntil(schedule.startDate)} days to start
                  </Typography>
                </Box>
              </Box>
            }
          />
          <IconButton size="small" onClick={() => handleViewSchedule(schedule)}>
            <Visibility fontSize="small" />
          </IconButton>
        </ListItem>
      ))}
    </List>
  )

  const renderOverdueTasks = () => (
    <List>
      {overdueTasks.slice(0, 5).map((task) => (
        <ListItem key={task.taskId}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: "#f44336" }}>
              <Warning />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {task.taskName}
                </Typography>
                <PriorityChip priority={task.priority} />
              </Box>
            }
            secondary={
              <Box component="span" sx={{ display: "block" }}>
                <Typography variant="body2" component="span" sx={{ display: "block" }}>
                  Due: {formatDate(task.dueDate)} • {task.assignedTo || "Unassigned"}
                </Typography>
                <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <Typography variant="caption" component="span">
                    {Math.abs(getDaysUntil(task.dueDate))} days overdue
                  </Typography>
                </Box>
              </Box>
            }
          />
          <IconButton size="small" onClick={() => handleViewTask(task)}>
            <Visibility fontSize="small" />
          </IconButton>
        </ListItem>
      ))}
    </List>
  )

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
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
                  <DashboardIcon sx={{ fontSize: 28, color: "#2563eb" }} />
                </Paper>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    Admin Dashboard
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Monitor schedules, tasks, and technician performance
                  </Typography>
                  <Chip
                    label="Administrator"
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: "#eef2ff",
                      color: "#2563eb",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {(loadingSchedules || loadingTasks) ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box key={i} sx={{ flex: '1 1 180px', minWidth: '180px' }}>
                    <Skeleton variant="rectangular" height={72} sx={{ borderRadius: 2 }} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#2196f3", width: 36, height: 36 }}>
                    <ScheduleIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {dashboardStats.totalSchedules}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Total Schedules
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#4caf50", width: 36, height: 36 }}>
                    <PlayArrow sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {dashboardStats.activeSchedules}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Active Schedules
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#9c27b0", width: 36, height: 36 }}>
                    <Assignment sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {dashboardStats.totalTasks}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Total Tasks
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#f44336", width: 36, height: 36 }}>
                    <Warning sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {dashboardStats.overdueTasks}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Overdue Tasks
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#ff9800", width: 36, height: 36 }}>
                    <TrendingUp sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {dashboardStats.completedTasks}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Completed Tasks
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#607d8b", width: 36, height: 36 }}>
                    <Person sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {dashboardStats.activeTechnicians}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Technicians
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
            </Box>
            )}
          </Box>
        </HeaderCard>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          <Box sx={{ flex: "1 1 350px", minWidth: "350px" }}>
            <DashboardCard title="Upcoming Schedules">
              {loadingSchedules ? (
                <Box sx={{ p: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={56} sx={{ borderRadius: 2, mb: 1 }} />
                  ))}
                </Box>
              ) : upcomingSchedules.length > 0 ? (
                renderUpcomingSchedules()
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <ScheduleIcon sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    No upcoming schedules
                  </Typography>
                </Box>
              )}
            </DashboardCard>
          </Box>

          <Box sx={{ flex: "1 1 350px", minWidth: "350px" }}>
            <DashboardCard title="Overdue Tasks">
              {loadingTasks ? (
                <Box sx={{ p: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={56} sx={{ borderRadius: 2, mb: 1 }} />
                  ))}
                </Box>
              ) : overdueTasks.length > 0 ? (
                renderOverdueTasks()
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Assignment sx={{ fontSize: 48, color: "#4caf50", mb: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    No overdue tasks
                  </Typography>
                </Box>
              )}
            </DashboardCard>
          </Box>

          <Box sx={{ flex: "1 1 350px", minWidth: "350px" }}>
            <DashboardCard title="Technician Activity">
              {loadingTasks ? (
                <Box sx={{ p: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: 2, mb: 1 }} />
                  ))}
                </Box>
              ) : technicianActivity.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {technicianActivity.slice(0, 5).map((tech) => (
                    <ListItem key={tech.id} sx={{ px: 0, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: getProgressColor(tech.completionRate, tech.overdueTasks),
                            width: 40,
                            height: 40,
                          }}
                        >
                          <Engineering sx={{ fontSize: 20 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                            {tech.fullName}
                          </Typography>
                        }
                        secondary={
                          <Box component="span" sx={{ display: "block" }}>
                            <Box component="span" sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                              <Typography variant="caption" color="textSecondary" component="span">
                                {tech.completedTasks}/{tech.totalTasks} tasks • {tech.overdueTasks} overdue
                              </Typography>
                              <Typography variant="caption" color="textSecondary" component="span">
                                {tech.completionRate.toFixed(0)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={tech.completionRate}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: "#f0f0f0",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: getProgressColor(tech.completionRate, tech.overdueTasks),
                                },
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Person sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    No technician data
                  </Typography>
                </Box>
              )}
            </DashboardCard>
          </Box>
        </Box>

        <ScheduleModal
          show={showScheduleModal}
          onClose={handleCloseModal}
          schedule={selectedSchedule}
          view={modalView}
        />
        <TaskModal
          show={showTaskModal}
          onClose={handleCloseTaskModal}
          task={selectedTask}
          view={taskModalView}
        />
      </Container>
    </Box>
  )
}

export default AdminDashboard
