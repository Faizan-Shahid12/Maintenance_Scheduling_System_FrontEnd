"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { MyDispatch, RootState } from "../Redux/Store"
import { ActivateSchedule, CreateNewSchedule, DeactivateSchedule, DeleteSchedule, EditSchedule, GetAllSchedules } from "../Redux/Thunks/ScheduleThunk"
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
  Delete,
  Search,
  Schedule,
  CalendarToday,
  Task,
  PlayArrow,
  Pause,
  Visibility,
  AccessTime,
  ArrowBack,
  AddTask,
  RemoveCircle,
  Event,
  ListAlt,
  PowerSettingsNew,
  Engineering,
} from "@mui/icons-material"
import type { CreateScheduleModel, DisplayScheduleModel } from "../Models/MainScheduleModels/MainScheduleModel"
import { ScheduleModal } from "../Components/Schedule/ScheduleModal"
import { AddScheduleModal } from "../Components/Schedule/AssignScheduleModal"
import { GetAllEquipment } from "../Redux/Thunks/EquipmentThunk"
import { GetAllTechOptions } from "../Redux/Thunks/TechnicianThunk"
import { GetAllTask } from "../Redux/Thunks/TaskThunk"
import { ScheduleTaskView } from "../Components/Schedule/ScheduleTaskView"

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
    }}
  >
    {children}
  </Paper>
)

const ScheduleCard = ({ children, isOverdue = false }: { children: React.ReactNode; isOverdue?: boolean }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: "0 8px 32px rgba(15,23,42,0.06)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      border: isOverdue ? "2px solid #f44336" : "1px solid #e5e7eb",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 16px 48px rgba(15,23,42,0.08)",
        borderColor: isOverdue ? "#f44336" : "#cbd5e1",
      },
    }}
  >
    {children}
  </Card>
)

const ScheduleAvatar = ({ name, type }: { name: string; type: string }) => {
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (scheduleType: string) => {
    switch (scheduleType.toLowerCase()) {
      case "daily":
        return "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)"
      case "weekly":
        return "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)"
      case "monthly":
        return "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
      default:
        return "linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)"
    }
  }

  return (
    <Avatar
      sx={{
        width: 56,
        height: 56,
        background: getAvatarColor(type),
        fontSize: "1.2rem",
        fontWeight: "bold",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {getInitials(name)}
    </Avatar>
  )
}

const PriorityChip = ({ priority }: { priority: string }) => 
{
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

const StatusChip = ({ status }: { status: string }) => 
{
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return { bgcolor: "#e8f5e8", color: "#2e7d32", icon: <PlayArrow /> }
      case "inactive":
        return { bgcolor: "#fff3cd", color: "#856404", icon: <Pause /> }
      case "completed":
        return { bgcolor: "#e8f5e8", color: "#2e7d32", icon: <PlayArrow /> }
      default:
        return { bgcolor: "#f3e5f5", color: "#7b1fa2", icon: <Pause /> }
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

export const SchedulePage = () => {
  const dispatch = useDispatch<MyDispatch>()
  const ScheduleList = useSelector((state: RootState) => state.Schedule.ScheduleListWithTask)
  const equipmentOptions = useSelector((state: RootState) => state.Equipment.equipmentList)
  const technicianOptions = useSelector((state: RootState) => state.Technicians.TechOptions)

  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<"edit" | "view" | "delete">("view")
  const [selectedSchedule1, setSelectedSchedule1] = useState<DisplayScheduleModel | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("All")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [selectedSchedule, setSelectedSchedule] = useState<DisplayScheduleModel | null>(null)

  const userRole = localStorage.getItem("Role")

  useEffect(() => {
    dispatch(GetAllSchedules())
    dispatch(GetAllEquipment())
    dispatch(GetAllTechOptions())
    dispatch(GetAllTask())
  }, [dispatch])

  const filteredSchedules = ScheduleList.filter((schedule) => {
    const matchesSearch = schedule.scheduleName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "All" || schedule.scheduleType === typeFilter
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && schedule.isActive) ||
      (statusFilter === "Inactive" && !schedule.isActive)
    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    total: ScheduleList.length,
    active: ScheduleList.filter((s) => s.isActive).length,
    inactive: ScheduleList.filter((s) => !s.isActive).length,
    tasks: ScheduleList.reduce((acc, schedule) => acc + schedule.scheduleTasks.length, 0),
  }

  // Schedule Operations
  const CreateScheduleModal = (schedule: CreateScheduleModel) => {
    dispatch(CreateNewSchedule(schedule))
    setShowAddModal(false)
  }

  const UpdateSchedule = (schedule: DisplayScheduleModel) => {
    dispatch(EditSchedule(schedule))
    setShowModal(false)
  }

  const HandleDeleteSchedule = (schedule: DisplayScheduleModel) => {
    dispatch(DeleteSchedule(schedule.scheduleId))
    setShowModal(false)
  }

  const toggleScheduleStatus = (schedule: DisplayScheduleModel) => {
    if(schedule.isActive === false)
    dispatch(ActivateSchedule(schedule.scheduleId))
    else
    dispatch(DeactivateSchedule(schedule.scheduleId))
  }

  const handleAddClick = () => {
    setSelectedSchedule1(null)
    setShowAddModal(true)
  }

  const handleEditClick = (schedule: DisplayScheduleModel) => {
    setSelectedSchedule1(schedule)
    setViewMode("edit")
    setShowModal(true)
  }

  const handleViewClick = (schedule: DisplayScheduleModel) => {
    setSelectedSchedule1(schedule)
    setViewMode("view")
    setShowModal(true)
  }

  const handleDeleteClick = (schedule: DisplayScheduleModel) => {
    setSelectedSchedule1(schedule)
    setViewMode("delete")
    setShowModal(true)
  }

  const handleScheduleSelect = (schedule: DisplayScheduleModel) => {
    setSelectedSchedule(schedule)
  }

  const handleBackToSchedules = () => {
    setSelectedSchedule(null)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date set"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
   
  const parseDaysFromInterval = (interval : string) =>
  {
    const match = interval.split(".")[0];
    return match + " Days"
  }

if (selectedSchedule) {
  return (
    <ScheduleTaskView
      schedule={selectedSchedule}
      onBackToSchedules={handleBackToSchedules}
      technicianOptions={technicianOptions}
      equipmentName={selectedSchedule.equipmentName}
    />
  )
}

  const renderScheduleActionButtons = (schedule: DisplayScheduleModel) => {
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
          startIcon={<Visibility sx={{ fontSize: 14 }} />}
          onClick={(e) => {
            e.stopPropagation()
            handleViewClick(schedule)
          }}
          sx={{
            fontSize: "0.7rem",
            minWidth: "auto",
            px: 1,
            py: 0.5,
            color: "#2563eb",
            "&:hover": {
              bgcolor: "#eff6ff",
              color: "#1d4ed8",
            },
          }}
        >
          View
        </Button>
        <Button
          variant="text"
          size="small"
          startIcon={<Edit sx={{ fontSize: 14 }} />}
          onClick={(e) => {
            e.stopPropagation()
            handleEditClick(schedule)
          }}
          sx={{
            fontSize: "0.7rem",
            minWidth: "auto",
            px: 1,
            py: 0.5,
            color: "#2563eb",
            "&:hover": {
              bgcolor: "#eff6ff",
              color: "#1d4ed8",
            },
          }}
        >
          Edit
        </Button>
        <Button
          variant="text"
          size="small"
          startIcon={<PowerSettingsNew sx={{ fontSize: 14 }} />}
          onClick={(e) => {
            e.stopPropagation()
            toggleScheduleStatus(schedule)
          }}
          sx={{
            fontSize: "0.7rem",
            minWidth: "auto",
            px: 1,
            py: 0.5,
            color: schedule.isActive ? "#f59e0b" : "#22c55e",
            "&:hover": {
              bgcolor: schedule.isActive ? "#fff7ed" : "#ecfdf5",
            },
          }}
        >
          {schedule.isActive ? "Deactivate" : "Activate"}
        </Button>
        <Button
          variant="text"
          size="small"
          startIcon={<Delete sx={{ fontSize: 14 }} />}
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteClick(schedule)
          }}
          sx={{
            fontSize: "0.7rem",
            minWidth: "auto",
            px: 1,
            py: 0.5,
            color: "#ef4444",
            "&:hover": {
              bgcolor: "#fef2f2",
              color: "#dc2626",
            },
          }}
        >
          Delete
        </Button>
      </Box>
    )
  }

  // Main Schedule List View
  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
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
                  <Schedule sx={{ fontSize: 28, color: "#2563eb" }} />
                </Paper>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    Schedule Management
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {userRole?.includes("Admin")
                      ? "Manage and track maintenance schedules"
                      : "View your assigned schedules"}
                  </Typography>
                  <Chip
                    label={`${userRole} Dashboard`}
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
              {userRole?.includes("Admin") && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddClick}
                >
                  Create Schedule
                </Button>
              )}
            </Box>

            {/* Statistics */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#2196f3", width: 36, height: 36 }}>
                    <Schedule sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {stats.total}
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
                      {stats.active}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Active
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#ff9800", width: 36, height: 36 }}>
                    <Pause sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {stats.inactive}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Inactive
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#9c27b0", width: 36, height: 36 }}>
                    <Task sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {stats.tasks}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Total Tasks
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
                placeholder="Search schedules..."
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
                <InputLabel>Type</InputLabel>
                <Select value={typeFilter} label="Type" onChange={(e) => setTypeFilter(e.target.value)}>
                  <MenuItem value="All">All Types</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: "1 1 150px", minWidth: "150px" }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
              <Typography variant="body2" color="textSecondary">
                {filteredSchedules.length} of {ScheduleList.length} schedules
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Schedule Cards */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {filteredSchedules.sort((a,b) => b.scheduleId-a.scheduleId).map((schedule) => (
            <Box
              key={schedule.scheduleId}
              sx={{
                flex: "1 1 350px",
                minWidth: "350px",
                maxWidth: "400px",
              }}
            >
              <ScheduleCard>
                <CardHeader
                  avatar={<ScheduleAvatar name={schedule.scheduleName} type={schedule.scheduleType} />}
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                        {schedule.scheduleName}
                      </Typography>
                    </Box>
                  }
                  subheader={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        {schedule.scheduleType}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                        <StatusChip status={schedule.isActive ? "Active" : "Inactive"} />
                      </Box>
                    </Box>
                  }
                />
                <CardContent sx={{ pt: 0, cursor: "pointer" }}>
                  {/* Schedule Details */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, mt: 2, mb: 2 }}>
                    {/* Left Side - Date Information */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                        <CalendarToday sx={{ color: "#666", fontSize: 16 }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Start Date
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {formatDate(schedule.startDate)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Event sx={{ color: "#666", fontSize: 16 }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            End Date
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {schedule.endDate ? formatDate(schedule.endDate) : "Ongoing"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Right Side - Task and Interval Information */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                        <ListAlt sx={{ color: "#666", fontSize: 16 }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Total Tasks
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {schedule.scheduleTasks.length}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTime sx={{ color: "#666", fontSize: 16 }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Interval
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {parseDaysFromInterval(schedule.interval)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ListAlt />}
                    onClick={() => handleScheduleSelect(schedule)}
                    sx={{ mb: 1, width: "100%" }}
                  >
                    View Tasks
                  </Button>
                  {renderScheduleActionButtons(schedule)}
                </CardContent>
              </ScheduleCard>
            </Box>
          ))}
        </Box>

        {/* Empty State */}
        {filteredSchedules.length === 0 && (
          <Paper sx={{ p: 6, textAlign: "center", mt: 3 }}>
            <Schedule sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No schedules found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              {searchTerm || typeFilter !== "All" || statusFilter !== "All"
                ? "Try adjusting your filters or search terms"
                : userRole?.includes("Admin")
                  ? "Create your first schedule to get started"
                  : "No schedules available"}
            </Typography>
            {userRole?.includes("Admin") && (
              <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
                Create Schedule
              </Button>
            )}
          </Paper>
        )}

        {/* Floating Action Button - Admin only */}
        {userRole?.includes("Admin") && (
          <Fab
            color="primary"
            aria-label="add schedule"
            sx={{ position: "fixed", bottom: 24, right: 24 }}
            onClick={handleAddClick}
          >
            <Add />
          </Fab>
        )}
      </Container>

      <ScheduleModal
        show={showModal}
        onClose={() => setShowModal(false)}
        schedule={selectedSchedule1}
        onSubmitEdit={UpdateSchedule}
        onSubmitDelete={HandleDeleteSchedule}
        view={viewMode}
      />

      <AddScheduleModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={CreateScheduleModal}
        equipmentOptions={equipmentOptions}
        technicianOptions={technicianOptions}
      />
    </Box>
  )
}

export default SchedulePage
