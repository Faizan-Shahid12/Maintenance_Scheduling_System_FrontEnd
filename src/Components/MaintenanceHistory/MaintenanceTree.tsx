import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { MyDispatch, RootState } from "../../Redux/Store";
import type { EquipmentHistory } from "../../Models/EquipmentModels/EquipmentHistoryModel";
import { GetAllEquipment } from "../../Redux/Thunks/EquipmentThunk";
import { GetAllCount, GetHistoryByEquipmentId } from "../../Redux/Thunks/HistoryThunk";
import {addMaintenanceToEquipment,clearMaintenanceFromEquipment } from "../../Redux/Slicers/EquipmentSlicer";
import { addTaskToMaintenance, clearEquipmentHistory, clearTaskFromMaintenance } from "../../Redux/Slicers/HistorySlicer";
import type MaintenanceHistory from "../../Models/HistoryModels/HistoryModel";
import type { Task } from "../../Models/TaskModels/TaskModel";
import { addTaskLogsToTask, clearHistoryTask, clearTaskLogsFromTask } from "../../Redux/Slicers/TaskSlicer";
import { GetTaskByHistoryId } from "../../Redux/Thunks/TaskThunk";
import { DeleteTaskLog, GetAllTaskLogs } from "../../Redux/Thunks/TaskLogThunk";
import { addAttachmentToTaskLog, clearAttachmentFromTaskLog, clearLogofTask } from "../../Redux/Slicers/TaskLogSlicer";
import type { TaskLog } from "../../Models/TaskModels/TaskLogModel";
import { DeleteAttachment, DownloadAttachment, GetAllAttachment, UploadAttachment } from "../../Redux/Thunks/LogAttachmentThunk";
import type Attachment from "../../Models/TaskModels/AttachmentModel";

import {
  ExpandMore,
  ChevronRight,
  Build,
  Schedule,
  Assignment,
  Description,
  Person,
  AccessTime,
  Folder,
  GetApp,
  Engineering,
  Timeline,
  Edit,
  Delete,
  Add,
  Search,
  FilterList,
} from "@mui/icons-material"
import {
  Box,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  CircularProgress,
  Container,
  Paper,
  Avatar,
  Button,
  Collapse,
  Tooltip,
  ButtonGroup,
  Chip,
  Skeleton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"

// Import our custom components
import {
  GradientBox,
  StatsCard,
  EquipmentCard,
  MaintenanceCard,
  TaskCard,
  LogCard,
  GradientAvatar,
  CountChip,
  PriorityChip,
  StatusChip,
  FileIcon,
} from "../ui/maintenance-tree.-component"
import TaskLogsModal from "../Task/TaskLogModal";


export const MaintenanceTree = () => {
  const EquipmentList = useSelector(
    (state: RootState) => state.Equipment.EquipmentHistory
  );
  const MaintenanceHistory = useSelector(
    (state: RootState) => state.MaintenanceHistory.EquipHistory
  );
  const HistoryTask = useSelector(
    (state: RootState) => state.AppTask.HistoryTask
  )
  const TaskLogs = useSelector(
    (state: RootState) => state.TaskLog.HistoryLog
  )
  const LogAttachment = useSelector(
    (state: RootState) => state.LogAttachment.HistoryLogAttachment
  )
  const MaintenanceHistoryLoading = useSelector(
    (state: RootState) => state.MaintenanceHistory.loading
  );
  const EquipmentLoading = useSelector(
    (state: RootState) => state.Equipment.loading
  );
  const TaskLoading = useSelector(
    (state: RootState) => state.AppTask.loading
  );

  const Count = useSelector((state:RootState) => state.MaintenanceHistory.Count);

  const dispatch = useDispatch<MyDispatch>();
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentHistory | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceHistory | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskLog, setSelectedTaskLog] = useState<TaskLog | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false)

  const PageType = "History"

  const [expandedEquipment, setExpandedEquipment] = useState<number | null>(null)
  const [expandedMaintenance, setExpandedMaintenance] = useState<number | null>(null)
  const [expandedTask, setExpandedTask] = useState<number | null>(null)
  const [expandedLog, setExpandedLog] = useState<number | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  const [dateFilter, setDateFilter] = useState<string>("All")

  const handleEquipmentToggle = (equipment: EquipmentHistory) => {
    const isCurrentlyExpanded = expandedEquipment === equipment.equipmentId
    setExpandedEquipment(isCurrentlyExpanded ? null : equipment.equipmentId)
    setSelectedEquipment(isCurrentlyExpanded ? null : equipment)

    if (isCurrentlyExpanded) 
    {
      setExpandedMaintenance(null)
      setExpandedTask(null)
      setExpandedLog(null)
    }
  }

  const handleMaintenanceToggle = (maintenance: MaintenanceHistory) => {
    const isCurrentlyExpanded = expandedMaintenance === maintenance.historyId
    setExpandedMaintenance(isCurrentlyExpanded ? null : maintenance.historyId)
    setSelectedMaintenance(isCurrentlyExpanded ? null : maintenance)

    // Reset child expansions when collapsing parent
    if (isCurrentlyExpanded) {
      setExpandedTask(null)
      setExpandedLog(null)
    }
  }

  const handleTaskToggle = (task: Task) => {
    const isCurrentlyExpanded = expandedTask === task.taskId
    setExpandedTask(isCurrentlyExpanded ? null : task.taskId)
    setSelectedTask(isCurrentlyExpanded ? null : task)

    // Reset child expansions when collapsing parent
    if (isCurrentlyExpanded) {
      setExpandedLog(null)
    }
  }

  const handleLogToggle = (log: TaskLog) => {
    const isCurrentlyExpanded = expandedLog === log.logId
    setExpandedLog(isCurrentlyExpanded ? null : log.logId)
    setSelectedTaskLog(isCurrentlyExpanded ? null : log)
  }

  useEffect(() => {
    dispatch(GetAllEquipment());
    dispatch(GetAllCount());
  }, [dispatch]);

  useEffect(() => 
  {
    if (selectedEquipment !== null) {
      dispatch(clearEquipmentHistory());
      dispatch(GetHistoryByEquipmentId(selectedEquipment.equipmentId));
    }
  }, [selectedEquipment]);

  useEffect(() => {
    if (selectedEquipment !== null && MaintenanceHistory?.length > 0) {
      dispatch(
        addMaintenanceToEquipment({
          equipmentId: selectedEquipment.equipmentId,
          maintenance: MaintenanceHistory,
        })
      );
    } else if (selectedEquipment !== null && MaintenanceHistory?.length <= 0) {
      dispatch(
        clearMaintenanceFromEquipment({
          equipmentId: selectedEquipment.equipmentId,
        })
      );
    }
  }, [MaintenanceHistory, selectedEquipment]);
  
  useEffect(() =>
  {
    if (selectedMaintenance !== null) 
    {
      dispatch(clearHistoryTask());
      dispatch(GetTaskByHistoryId(selectedMaintenance.historyId));
    }
  }, [selectedMaintenance])

   useEffect(() => {
    if (selectedMaintenance !== null && HistoryTask?.length > 0) {
      dispatch(
        addTaskToMaintenance({
          historyId: selectedMaintenance.historyId,
          Tasks: HistoryTask,
        })
      );
    } else if (selectedMaintenance !== null && HistoryTask?.length <= 0) {
      dispatch(
        clearTaskFromMaintenance(selectedMaintenance.historyId)
      );
    }
  }, [HistoryTask, selectedMaintenance]);

  useEffect(() =>
  {
    if (selectedTask !== null) 
    {
      dispatch(clearLogofTask());
      dispatch(GetAllTaskLogs(selectedTask.taskId));
    }
  }, [selectedTask])

   useEffect(() => 
  {
    if (selectedTask !== null && HistoryTask?.length > 0) {
      dispatch(
        addTaskLogsToTask({
          taskId: selectedTask.taskId,
          TaskLogs: TaskLogs,
        })
      );
    } else if (selectedTask !== null && HistoryTask?.length <= 0) {
      dispatch(
        clearTaskLogsFromTask({taskId: selectedTask.taskId})
      );
    }
  }, [TaskLogs, selectedTask]);

  useEffect(() =>
  {
    if (selectedTaskLog !== null) 
    {
      dispatch(GetAllAttachment(selectedTaskLog.logId));
    }
  }, [selectedTaskLog])

  useEffect(() => 
  {
    if (selectedTaskLog !== null && HistoryTask?.length > 0) {
      dispatch(
        addAttachmentToTaskLog({
          LogId: selectedTaskLog.logId,
          attachs: LogAttachment,
        })
      );
    } else if (selectedTaskLog !== null && HistoryTask?.length <= 0) {
      dispatch(
        clearAttachmentFromTaskLog({LogId: selectedTaskLog.logId})
      );
    }
  }, [TaskLogs, selectedTaskLog]);


   const handleDownload = (attachmentId: number) => {
    dispatch(DownloadAttachment(attachmentId))
  }
  // Action handlers - Only for logs and attachments

  const handleAddLog = () => 
  {
    setShowLogsModal(true);
  }

  const handleEditLog = (logId: number) => 
  {
    setShowLogsModal(true);
  }

  const handleDeleteLog = (logId: number) => 
  {
    dispatch(DeleteTaskLog(logId))
  }

  const handleAddAttachment = (logId: number) => 
  {
    const input = document.createElement("input")
        input.type = "file"
        input.multiple = false
        input.accept = "*/*"
        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files
          if (files) {
            dispatch(UploadAttachment({ logId: logId, file: files[0] }))
          }
        }
        input.click()
  }

  const handleDeleteAttachment = (attachmentId: number) => 
  {
      dispatch(DeleteAttachment(attachmentId))
  }

  const handleCloseLogsModal = () => {
    setShowLogsModal(false)
  }

  // Filter functions
  const filteredEquipmentList = EquipmentList?.filter((equipment) => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    // Filter by maintenance dates
    if (dateFilter !== "All") {
      const hasMatchingDate = equipment.maintenances?.some(maintenance => {
        const startDate = new Date(maintenance.startDate)
        const endDate = new Date(maintenance.endDate)
        const now = new Date()
        
        switch (dateFilter) {
          case "This Week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return startDate >= weekAgo
          case "This Month":
            const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
            return startDate >= monthAgo
          case "Last 3 Months":
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
            return startDate >= threeMonthsAgo
          case "Ongoing":
            return endDate >= now
          default:
            return true
        }
      })
      if (!hasMatchingDate) return false
    }
    
    // Filter by task status or priority
    if (statusFilter !== "All" || priorityFilter !== "All") {
      const hasMatchingTasks = equipment.maintenances?.some(maintenance =>
        maintenance.tasks?.some(task => {
          const matchesStatus = statusFilter === "All" || task.status === statusFilter
          const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter
          return matchesStatus && matchesPriority
        })
      )
      if (!hasMatchingTasks) return false
    }
    
    return true
  })

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
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
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
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
                <Engineering sx={{ fontSize: 28, color: "#2563eb" }} />
              </Paper>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  Maintenance History
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Review historical maintenance, tasks, and logs
                </Typography>
                <Chip
                  label="Admin Dashboard"
                  size="small"
                  sx={{ mt: 1, bgcolor: "#eef2ff", color: "#2563eb", fontWeight: "bold" }}
                />
              </Box>
            </Box>

            {/* Statistics */}
            {EquipmentLoading ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 4 }).map((_, i) => (
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
                    <Build sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {EquipmentList?.length || 0}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Equipment
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#4caf50", width: 36, height: 36 }}>
                    <Schedule sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                     {Count[0]}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Maintenances
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#00bcd4", width: 36, height: 36 }}>
                    <Assignment sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {Count[1]}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Tasks
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
              <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
                <StatsCard>
                  <Avatar sx={{ bgcolor: "#ff9800", width: 36, height: 36 }}>
                    <Description sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                     {Count[2]}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Logs
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
            </Box>
            )}
          </Box>
        </Paper>

        {/* Filters (equipment only) */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <TextField
                fullWidth
                placeholder="Search equipment..."
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
            <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
              <Typography variant="body2" color="textSecondary">
                {filteredEquipmentList?.length || 0} of {EquipmentList?.length || 0} equipment
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Equipment Cards */}
        <Box>
          {EquipmentLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Paper key={i} sx={{ p: 2, mb: 2 }}>
                <Skeleton variant="text" width="20%" />
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, mt: 1 }} />
              </Paper>
            ))
          ) : (
          filteredEquipmentList?.map((equipment: EquipmentHistory, equipmentIndex: number) => (
            <EquipmentCard key={equipment.equipmentId}>
              <CardHeader
                sx={{
                  backgroundColor: expandedEquipment === equipment.equipmentId ? "#f3f4f6" : "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  py: 2,
                }}
                onClick={() => handleEquipmentToggle(equipment)}
                avatar={
                  <GradientAvatar bgcolor="linear-gradient(135deg, #2196f3 0%, #1976d2 100%)">
                    {equipmentIndex + 1}
                  </GradientAvatar>
                }
                title={
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1a1a1a" }}>
                    {equipment.name}
                  </Typography>
                }
                subheader={
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Build sx={{ color: "#2196f3", fontSize: 16 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "#666", textTransform: "uppercase", fontWeight: "bold" }}
                        >
                          Equipment ID
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                          {equipment.equipmentId}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                }
                action={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: expandedEquipment === equipment.equipmentId ? "#2196f3" : "#f5f5f5",
                        color: expandedEquipment === equipment.equipmentId ? "white" : "#666",
                        "&:hover": {
                          bgcolor: expandedEquipment === equipment.equipmentId ? "#1976d2" : "#e0e0e0",
                        },
                      }}
                    >
                      {expandedEquipment === equipment.equipmentId ? <ExpandMore /> : <ChevronRight />}
                    </IconButton>
                  </Box>
                }
              />
              <Collapse in={expandedEquipment === equipment.equipmentId}>
                <CardContent sx={{ backgroundColor: "#f8f9fa", p: 2 }}>
                  {MaintenanceHistoryLoading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {Array.from({ length: 2 }).map((_, i) => (
                        <Paper key={i} sx={{ p: 2 }}>
                          <Skeleton variant="text" width="30%" />
                          <Skeleton variant="rectangular" height={64} sx={{ borderRadius: 2, mt: 1 }} />
                        </Paper>
                      ))}
                    </Box>
                  ) : equipment.maintenances?.length > 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {equipment.maintenances.map((mh: MaintenanceHistory, maintenanceIndex: number) => (
                        <MaintenanceCard key={mh.historyId}>
                          <CardHeader
                            sx={{
                              backgroundColor: expandedMaintenance === mh.historyId ? "#f0f9f0" : "white",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              py: 1.5,
                            }}
                            onClick={() => handleMaintenanceToggle(mh)}
                            avatar={
                              <GradientAvatar bgcolor="linear-gradient(135deg, #4caf50 0%, #388e3c 100%)">
                                {maintenanceIndex + 1}
                              </GradientAvatar>
                            }
                            title={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Timeline sx={{ color: "#4caf50", fontSize: 18 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                  Maintenance Period
                                </Typography>
                              </Box>
                            }
                            subheader={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                  <Box sx={{ flex: "1 1 140px", minWidth: "140px" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                      <Schedule sx={{ color: "#4caf50", fontSize: 14 }} />
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#4caf50", textTransform: "uppercase", fontWeight: "bold" }}
                                        >
                                          Start Date
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: "medium", display: "block" }}>
                                          {mh.startDate}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box sx={{ flex: "1 1 140px", minWidth: "140px" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                      <Schedule sx={{ color: "#4caf50", fontSize: 14 }} />
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#4caf50", textTransform: "uppercase", fontWeight: "bold" }}
                                        >
                                          End Date
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: "medium", display: "block" }}>
                                          {mh.endDate}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box sx={{ flex: "1 1 140px", minWidth: "140px" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                      <Assignment sx={{ color: "#4caf50", fontSize: 14 }} />
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#4caf50", textTransform: "uppercase", fontWeight: "bold" }}
                                        >
                                          History ID
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: "medium", display: "block" }}>
                                          {mh.historyId}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            }
                            action={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <IconButton
                                  size="small"
                                  sx={{
                                    bgcolor: expandedMaintenance === mh.historyId ? "#4caf50" : "#f5f5f5",
                                    color: expandedMaintenance === mh.historyId ? "white" : "#666",
                                    "&:hover": {
                                      bgcolor: expandedMaintenance === mh.historyId ? "#388e3c" : "#e0e0e0",
                                    },
                                  }}
                                >
                                  {expandedMaintenance === mh.historyId ? <ExpandMore /> : <ChevronRight />}
                                </IconButton>
                              </Box>
                            }
                          />
                          <Collapse in={expandedMaintenance === mh.historyId}>
                            <CardContent sx={{ backgroundColor: "#f8f9fa", p: 2 }}>
                              {TaskLoading ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  {Array.from({ length: 2 }).map((_, i) => (
                                    <Paper key={i} sx={{ p: 2 }}>
                                      <Skeleton variant="text" width="30%" />
                                      <Skeleton variant="rectangular" height={64} sx={{ borderRadius: 2, mt: 1 }} />
                                    </Paper>
                                  ))}
                                </Box>
                              ) : mh.tasks?.length > 0 ? (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                  {mh.tasks.map((task: Task, taskIndex: number) => (
                                    <TaskCard key={task.taskId}>
                                      <CardHeader
                                        sx={{
                                          backgroundColor: expandedTask === task.taskId ? "#e3f2fd" : "white",
                                          cursor: "pointer",
                                          transition: "all 0.3s ease",
                                          py: 1.5,
                                        }}
                                        onClick={() => handleTaskToggle(task)}
                                        avatar={
                                          <GradientAvatar bgcolor="linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)">
                                            {taskIndex + 1}
                                          </GradientAvatar>
                                        }
                                        title={
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Assignment sx={{ color: "#00bcd4", fontSize: 18 }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                              {task.taskName}
                                            </Typography>
                                          </Box>
                                        }
                                        subheader={
                                          <Box sx={{ mt: 1 }}>
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                              <Box sx={{ flex: "1 1 100px", minWidth: "100px" }}>
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    color: "#00bcd4",
                                                    textTransform: "uppercase",
                                                    fontWeight: "bold",
                                                  }}
                                                >
                                                  Task ID
                                                </Typography>
                                                <Typography
                                                  variant="caption"
                                                  sx={{ fontWeight: "medium", display: "block" }}
                                                >
                                                  {task.taskId}
                                                </Typography>
                                              </Box>
                                              <Box sx={{ flex: "1 1 100px", minWidth: "100px" }}>
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    color: "#00bcd4",
                                                    textTransform: "uppercase",
                                                    fontWeight: "bold",
                                                    mb: 0.5,
                                                    display: "block",
                                                  }}
                                                >
                                                  Priority
                                                </Typography>
                                                <PriorityChip priority={task.priority} />
                                              </Box>
                                              <Box sx={{ flex: "1 1 100px", minWidth: "100px" }}>
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    color: "#00bcd4",
                                                    textTransform: "uppercase",
                                                    fontWeight: "bold",
                                                    mb: 0.5,
                                                    display: "block",
                                                  }}
                                                >
                                                  Status
                                                </Typography>
                                                <StatusChip status={task.status} />
                                              </Box>
                                              <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    color: "#00bcd4",
                                                    textTransform: "uppercase",
                                                    fontWeight: "bold",
                                                    mb: 0.5,
                                                    display: "block",
                                                  }}
                                                >
                                                  Assigned To
                                                </Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                  <Person sx={{ color: "#00bcd4", fontSize: 14 }} />
                                                  <Typography
                                                    variant="caption"
                                                    sx={{ fontWeight: "medium", display: "block" }}
                                                  >
                                                    {task.assignedTo}
                                                  </Typography>
                                                </Box>
                                              </Box>
                                            </Box>
                                          </Box>
                                        }
                                        action={
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <IconButton
                                              size="small"
                                              sx={{
                                                bgcolor: expandedTask === task.taskId ? "#00bcd4" : "#f5f5f5",
                                                color: expandedTask === task.taskId ? "white" : "#666",
                                                "&:hover": {
                                                  bgcolor: expandedTask === task.taskId ? "#0097a7" : "#e0e0e0",
                                                },
                                              }}
                                            >
                                              {expandedTask === task.taskId ? <ExpandMore /> : <ChevronRight />}
                                            </IconButton>
                                          </Box>
                                        }
                                      />
                                      <Collapse in={expandedTask === task.taskId}>
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 1, px: 2 }}>
                                          <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={() => handleAddLog()}
                                            sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}
                                          >
                                            Add Log
                                          </Button>
                                        </Box>
                                        <CardContent sx={{ backgroundColor: "#f8f9fa", p: 2 }}>
                                          {TaskLoading ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                              {Array.from({ length: 2 }).map((_, i) => (
                                                <Paper key={i} sx={{ p: 2 }}>
                                                  <Skeleton variant="text" width="30%" />
                                                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2, mt: 1 }} />
                                                </Paper>
                                              ))}
                                            </Box>
                                          ) : task.logs?.length > 0 ? (
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                              {task.logs.map((log: TaskLog, logIndex: number) => (
                                                <LogCard key={log.logId}>
                                                  <CardHeader
                                                    sx={{ cursor: "pointer", py: 1.5 }}
                                                    onClick={() => handleLogToggle(log)}
                                                    avatar={
                                                      <GradientAvatar bgcolor="linear-gradient(135deg, #ff9800 0%, #f57c00 100%)">
                                                        {logIndex + 1}
                                                      </GradientAvatar>
                                                    }
                                                    title={
                                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Description sx={{ color: "#ff9800", fontSize: 18 }} />
                                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                                          Log Entry #{log.logId}
                                                        </Typography>
                                                      </Box>
                                                    }
                                                    subheader={
                                                      <Box sx={{ mt: 1 }}>
                                                        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                                                          {log.note}
                                                        </Typography>
                                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                                          <Box sx={{ flex: "1 1 140px", minWidth: "140px" }}>
                                                            <Box
                                                              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                                            >
                                                              <Person sx={{ color: "#666", fontSize: 14 }} />
                                                              <Box>
                                                                <Typography variant="caption" sx={{ color: "#666" }}>
                                                                  Created by
                                                                </Typography>
                                                                <Typography
                                                                  variant="caption"
                                                                  sx={{ fontWeight: "medium", display: "block" }}
                                                                >
                                                                  {log.createdBy}
                                                                </Typography>
                                                              </Box>
                                                            </Box>
                                                          </Box>
                                                          <Box sx={{ flex: "1 1 140px", minWidth: "140px" }}>
                                                            <Box
                                                              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                                            >
                                                              <AccessTime sx={{ color: "#666", fontSize: 14 }} />
                                                              <Box>
                                                                <Typography variant="caption" sx={{ color: "#666" }}>
                                                                  Created at
                                                                </Typography>
                                                                <Typography
                                                                  variant="caption"
                                                                  sx={{ fontWeight: "medium", display: "block" }}
                                                                >
                                                                  {new Date(log.createdAt).toLocaleDateString()}
                                                                </Typography>
                                                              </Box>
                                                            </Box>
                                                          </Box>
                                                          
                                                        </Box>
                                                      </Box>
                                                    }
                                                    action={
                                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Button
                                                          size="small"
                                                          variant="outlined"
                                                          startIcon={<Add />}
                                                          onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleAddAttachment(log.logId)
                                                          }}
                                                          sx={{
                                                            fontSize: "0.75rem",
                                                            py: 0.5,
                                                            px: 1,
                                                            color: "#4caf50",
                                                            borderColor: "#4caf50",
                                                            "&:hover": {
                                                              borderColor: "#388e3c",
                                                              bgcolor: "#e8f5e8",
                                                            },
                                                          }}
                                                        >
                                                          Add Attachment
                                                        </Button>
                                                        <ButtonGroup size="small" sx={{ mr: 1 }}>
                                                          <Tooltip title="Edit Log">
                                                            <IconButton
                                                              size="small"
                                                              onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleEditLog(log.logId)
                                                              }}
                                                              sx={{
                                                                bgcolor: "#f5f5f5",
                                                                color: "#666",
                                                                "&:hover": { bgcolor: "#e0e0e0" },
                                                              }}
                                                            >
                                                              <Edit sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                          </Tooltip>
                                                          <Tooltip title="Delete Log">
                                                            <IconButton
                                                              size="small"
                                                              onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDeleteLog(log.logId)
                                                              }}
                                                              sx={{
                                                                bgcolor: "#f5f5f5",
                                                                color: "#f44336",
                                                                "&:hover": { bgcolor: "#ffebee" },
                                                              }}
                                                            >
                                                              <Delete sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                          </Tooltip>
                                                        </ButtonGroup>
                                                      </Box>
                                                    }
                                                  />
                                                  <Collapse in={expandedLog === log.logId}>
                                                    {log.attachments && log.attachments.length > 0 ? (
                                                      <CardContent sx={{ borderTop: "1px solid #e0e0e0", p: 2 }}>
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            flexDirection: 'column',
                                                            gap: 1,
                                                          }}
                                                        >
                                                          {log.attachments.map((attachment: Attachment, attachmentIndex: number) => (
                                                            <Paper
                                                              key={attachment.id}
                                                              sx={{
                                                                p: 1.5,
                                                                borderRadius: 1.5,
                                                                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                              }}
                                                            >
                                                              <Box
                                                                sx={{
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  gap: 1.5,
                                                                  flex: 1,
                                                                }}
                                                              >
                                                                <Avatar
                                                                  sx={{
                                                                    bgcolor: "#f5f5f5",
                                                                    color: "#666",
                                                                    width: 28,
                                                                    height: 28,
                                                                    fontSize: "0.75rem",
                                                                  }}
                                                                >
                                                                  {attachmentIndex + 1}
                                                                </Avatar>
                                                                <FileIcon contentType={attachment.contentType} />
                                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                  <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                      fontWeight: "bold",
                                                                      overflow: "hidden",
                                                                      textOverflow: "ellipsis",
                                                                      fontSize: "0.875rem",
                                                                    }}
                                                                    title={attachment.fileName}
                                                                  >
                                                                    {attachment.fileName}
                                                                  </Typography>
                                                                  <Typography variant="caption" sx={{ color: "#666" }}>
                                                                    {attachment.contentType}
                                                                  </Typography>
                                                                </Box>
                                                              </Box>
                                                              <Box sx={{ display: "flex", gap: 1 }}>
                                                                <Button
                                                                  variant="contained"
                                                                  size="small"
                                                                  color="error"
                                                                  startIcon={<Delete sx={{ fontSize: 14 }} />}
                                                                  onClick={() => handleDeleteAttachment(attachment.id)}
                                                                  sx={{
                                                                    fontSize: "0.75rem",
                                                                    py: 0.5,
                                                                    px: 1,
                                                                  }}
                                                                >
                                                                  Delete
                                                                </Button>
                                                                <Button
                                                                  variant="outlined"
                                                                  size="small"
                                                                  startIcon={<GetApp sx={{ fontSize: 16 }} />}
                                                                  onClick={() => handleDownload(attachment.id)}
                                                                  sx={{
                                                                    flexShrink: 0,
                                                                    fontSize: "0.75rem",
                                                                    py: 0.5,
                                                                    px: 1,
                                                                  }}
                                                                >
                                                                  Download
                                                                </Button>
                                                              </Box>
                                                            </Paper>
                                                          ))}
                                                        </Box>
                                                      </CardContent>
                                                    ) : (
                                                      <CardContent sx={{ p: 2 }}>
                                                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 1 }}>
                                                          No attachments found for this log entry
                                                        </Typography>
                                                      </CardContent>
                                                    )}
                                                  </Collapse>
                                                </LogCard>
                                              ))}
                                            </Box>
                                          ) : (
                                            <Box sx={{ textAlign: "center", py: 4 }}>
                                              <Description sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />
                                              <Typography variant="body1" sx={{ color: "#666" }}>
                                                No task logs available
                                              </Typography>
                                            </Box>
                                          )}
                                        </CardContent>
                                      </Collapse>
                                    </TaskCard>
                                  ))}
                                </Box>
                              ) : (
                                <Box sx={{ textAlign: "center", py: 4 }}>
                                  <Assignment sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />
                                  <Typography variant="body1" sx={{ color: "#666" }}>
                                    No tasks available
                                  </Typography>
                                </Box>
                              )}
                            </CardContent>
                          </Collapse>
                        </MaintenanceCard>
                      ))}
                    </Box>
                            ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Schedule sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />
              <Typography variant="body1" sx={{ color: "#666" }}>
                {searchTerm
                  ? "No equipment found matching the current filters"
                  : "No maintenance history available"}
              </Typography>
            </Box>
          )}
                </CardContent>
              </Collapse>
            </EquipmentCard>
          ))
          )}
        </Box>

        <TaskLogsModal
      open={showLogsModal}
      onClose={handleCloseLogsModal}
      task={selectedTask}
      PageType={PageType}
    />

      </Container>
    </Box>
  )
}


export default MaintenanceTree;
