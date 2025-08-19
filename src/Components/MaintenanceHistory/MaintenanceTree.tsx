import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { MyDispatch, RootState } from "../../Redux/Store";
import type { EquipmentHistory } from "../../Models/EquipmentModels/EquipmentHistoryModel";
import { GetAllEquipment } from "../../Redux/Thunks/EquipmentThunk";
import { GetHistoryByEquipmentId } from "../../Redux/Thunks/HistoryThunk";
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
  Chip
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

  const dispatch = useDispatch<MyDispatch>();
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentHistory | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceHistory | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskLog, setSelectedTaskLog] = useState<TaskLog | null>(null);
  const [selectedLogAttach, setSelectedLogAttach] = useState<Attachment | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false)

  const PageType = "History"

  const [expandedEquipment, setExpandedEquipment] = useState<number | null>(null)
  const [expandedMaintenance, setExpandedMaintenance] = useState<number | null>(null)
  const [expandedTask, setExpandedTask] = useState<number | null>(null)
  const [expandedLog, setExpandedLog] = useState<number | null>(null)

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
  
  useEffect(()=>
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

  useEffect(()=>
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

  useEffect(()=>
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
  // Action handlers
  
  const handleEditMaintenance = (maintenanceId: number) => {
    console.log("Edit Maintenance", maintenanceId)
  }

  const handleDeleteMaintenance = (maintenanceId: number) => {
    console.log("Delete Maintenance", maintenanceId)
  }

  const handleEditTask = (taskId: number) => {
    console.log("Edit Task", taskId)
  }

  const handleDeleteTask = (taskId: number) => {
    console.log("Delete Task", taskId)
  }

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
                      {EquipmentList?.reduce((acc, eq) => acc + (eq.maintenances?.length || 0), 0) || 0}
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
                      {EquipmentList?.reduce(
                        (acc, eq) =>
                          acc + (eq.maintenances?.reduce((acc2, m) => acc2 + (m.tasks?.length || 0), 0) || 0),
                        0,
                      ) || 0}
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
                      {EquipmentList?.reduce(
                        (acc, eq) =>
                          acc +
                          (eq.maintenances?.reduce(
                            (acc2, m) => acc2 + (m.tasks?.reduce((acc3, t) => acc3 + (t.logs?.length || 0), 0) || 0),
                            0,
                          ) || 0),
                        0,
                      ) || 0}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Logs
                    </Typography>
                  </Box>
                </StatsCard>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Equipment Cards */}
        <Box>
          {EquipmentList?.map((equipment, equipmentIndex) => (
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
                    <CountChip
                      bgcolor="linear-gradient(135deg, #2196f3 0%, #1976d2 100%)"
                      icon={<Schedule />}
                      label={`${equipment.maintenances?.length || 0} Maintenance${
                        (equipment.maintenances?.length || 0) !== 1 ? "s" : ""
                      }`}
                    />
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
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                      <CircularProgress size={48} sx={{ mb: 2 }} />
                      <Typography variant="body1" sx={{ color: "#666" }}>
                        Loading maintenance history...
                      </Typography>
                    </Box>
                  ) : equipment.maintenances?.length > 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {equipment.maintenances.map((mh, maintenanceIndex) => (
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
                                <CountChip
                                  bgcolor="linear-gradient(135deg, #4caf50 0%, #388e3c 100%)"
                                  icon={<Assignment />}
                                  label={`${mh.tasks?.length || 0} Task${(mh.tasks?.length || 0) !== 1 ? "s" : ""}`}
                                />
                                <ButtonGroup size="small" sx={{ mr: 1 }}>
                                  <Tooltip title="Edit Maintenance">
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleEditMaintenance(mh.historyId)
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
                                  <Tooltip title="Delete Maintenance">
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteMaintenance(mh.historyId)
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
                              {mh.tasks?.length > 0 ? (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                  {mh.tasks.map((task, taskIndex) => (
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
                                            <CountChip
                                              bgcolor="linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)"
                                              icon={<Description />}
                                              label={`${task.logs?.length || 0} Log${(task.logs?.length || 0) !== 1 ? "s" : ""}`}
                                            />
                                            <ButtonGroup size="small" sx={{ mr: 1 }}>
                                              <Tooltip title="Edit Task">
                                                <IconButton
                                                  size="small"
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEditTask(task.taskId)
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
                                              <Tooltip title="Delete Task">
                                                <IconButton
                                                  size="small"
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteTask(task.taskId)
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
                                          {task.logs?.length > 0 ? (
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                              {task.logs.map((log, logIndex) => (
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
                                                          <Box sx={{ flex: "1 1 140px", minWidth: "140px" }}>
                                                            <CountChip
                                                              bgcolor="linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
                                                              icon={<Folder />}
                                                              label={`${log.attachments?.length || 0} File${
                                                                (log.attachments?.length || 0) !== 1 ? "s" : ""
                                                              }`}
                                                            />
                                                          </Box>
                                                        </Box>
                                                      </Box>
                                                    }
                                                    action={
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
                                                    }
                                                  />
                                                  <Collapse in={expandedLog === log.logId}>
                                                    {log.attachments && log.attachments.length > 0 && (
                                                      <CardContent sx={{ borderTop: "1px solid #e0e0e0", p: 2 }}>
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            mb: 2,
                                                          }}
                                                        >
                                                          <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                              fontWeight: "bold",
                                                              display: "flex",
                                                              alignItems: "center",
                                                              gap: 1,
                                                            }}
                                                          >
                                                            <Folder sx={{ color: "#ff9800", fontSize: 18 }} />
                                                            Attachments
                                                          </Typography>
                                                          <Button
                                                            size="small"
                                                            variant="contained"
                                                            startIcon={<Add />}
                                                            onClick={() => handleAddAttachment(log.logId)}
                                                            sx={{
                                                              bgcolor: "#9c27b0",
                                                              "&:hover": { bgcolor: "#7b1fa2" },
                                                            }}
                                                          >
                                                            Add Attachment
                                                          </Button>
                                                        </Box>
                                                        <Box
                                                          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                                                        >
                                                          {log.attachments.map((attachment, attachmentIndex) => (
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
                        No maintenance history available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Collapse>
            </EquipmentCard>
          ))}
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
