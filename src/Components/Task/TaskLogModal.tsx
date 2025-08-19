import type React from "react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Fab,
  TextField,
} from "@mui/material"
import {
  Close,
  Person,
  AccessTime,
  Description,
  GetApp,
  Folder,
  PictureAsPdf,
  Image,
  VideoFile,
  AudioFile,
  InsertDriveFile,
  ExpandMore,
  ExpandLess,
  AttachFile,
  Add,
  Edit,
  Delete,
  CloudUpload,
  Save,
  Cancel,
  Engineering,
} from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import type { MyDispatch, RootState } from "../../Redux/Store"
import { CreateTaskLog, DeleteTaskLog, GetAllTaskLogs, UpdateTaskLog } from "../../Redux/Thunks/TaskLogThunk"
import { DeleteAttachment, GetAllAttachment, UploadAttachment } from "../../Redux/Thunks/LogAttachmentThunk"
import type { TaskLog } from "../../Models/TaskModels/TaskLogModel"
import type Attachment from "../../Models/TaskModels/AttachmentModel"
import type { Task } from "../../Models/TaskModels/TaskModel"

interface TaskLogsModalProps {
  open: boolean
  onClose: () => void
  task: Task | null
  PageType: string;
  onDownloadAttachment?: (attachment: Attachment) => void
}

const FileIcon = ({ contentType }: { contentType?: string }) => {
  const type = contentType?.toLowerCase() ?? ""

  if (type.includes("pdf")) return <PictureAsPdf sx={{ color: "#f44336", fontSize: 20 }} />
  if (type.includes("image")) return <Image sx={{ color: "#4caf50", fontSize: 20 }} />
  if (type.includes("video")) return <VideoFile sx={{ color: "#2196f3", fontSize: 20 }} />
  if (type.includes("audio")) return <AudioFile sx={{ color: "#ff9800", fontSize: 20 }} />
  if (type.includes("word")) return <InsertDriveFile sx={{ color: "#1976d2", fontSize: 20 }} />

  return <InsertDriveFile sx={{ color: "#9e9e9e", fontSize: 20 }} />
}

const LogCard = ({
  log,
  onDownloadAttachment,
  PageType,
  isExpanded,
  onToggleExpand,
  attachments,
  onEditLog,
  onDeleteLog,
  onDeleteAttachment,
  onUploadAttachment,
}: {
  log: TaskLog
  onDownloadAttachment: (attachment: Attachment) => void
  PageType: string
  isExpanded: boolean
  onToggleExpand: () => void
  attachments: Attachment[]
  onEditLog?: (log: TaskLog) => void
  onDeleteLog?: (logId: number) => void
  onDeleteAttachment?: (attachmentId: number) => void
  onUploadAttachment?: (logId: number) => void
}) => {
  const userRole = localStorage.getItem("Role")

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: "1px solid #e3f2fd",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardHeader
        sx={{ cursor: "pointer" }}
        onClick={onToggleExpand}
        avatar={
          <Avatar
            sx={{
              bgcolor:
                userRole === "Admin"
                  ? "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)"
                  : "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
              width: 40,
              height: 40,
              boxShadow:
                userRole === "Admin" ? "0 4px 12px rgba(33, 150, 243, 0.3)" : "0 4px 12px rgba(255, 152, 0, 0.3)",
            }}
          >
            <Description sx={{ fontSize: 20 }} />
          </Avatar>
        }
        title={
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Log Entry #{log.logId}
              </Typography>
              <Chip
                label={userRole}
                size="small"
                color={userRole === "Admin" ? "primary" : "warning"}
                sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isExpanded && attachments.length > 0 && (
                <Chip
                  icon={<AttachFile />}
                  label={`${attachments.length} file${attachments.length !== 1 ? "s" : ""}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {/* Log Action Buttons - Available for both Admin and Technician */}
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Tooltip title="Edit Log">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditLog?.(log)
                    }}
                    sx={{
                      color: "#2196f3",
                      bgcolor: "rgba(33, 150, 243, 0.1)",
                      "&:hover": {
                        bgcolor: "rgba(33, 150, 243, 0.2)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Edit sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Log">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteLog?.(log.logId)
                    }}
                    sx={{
                      color: "#f44336",
                      bgcolor: "rgba(244, 67, 54, 0.1)",
                      "&:hover": {
                        bgcolor: "rgba(244, 67, 54, 0.2)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Delete sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        }
        subheader={
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Person sx={{ color: "#666", fontSize: 16 }} />
                <Typography variant="body2" color="textSecondary">
                  {log.createdBy}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTime sx={{ color: "#666", fontSize: 16 }} />
                <Typography variant="body2" color="textSecondary">
                  {new Date(log.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>
        }
        action={
          <IconButton onClick={onToggleExpand} size="small">
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
          {log.note}
        </Typography>

        {/* Attachments Section - Show when expanded */}
        { PageType === "Task" && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                borderRadius: 2,
                p: 2,
                border: "1px solid #e1bee7",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: "bold",
                    color: "#ff9800",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Folder sx={{ fontSize: 18 }} />
                  Attachments {attachments.length > 0 && `(${attachments.length})`}
                </Typography>
                {/* Upload button available for both roles */}
                <Tooltip title="Upload Attachment">
                  <IconButton
                    size="small"
                    onClick={() => onUploadAttachment?.(log.logId)}
                    sx={{
                      color: "#4caf50",
                      bgcolor: "rgba(76, 175, 80, 0.1)",
                      "&:hover": {
                        bgcolor: "rgba(76, 175, 80, 0.2)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              {attachments.length > 0 ? (
                <List dense sx={{ p: 0 }}>
                  {attachments.map((attachment) => (
                    <ListItem
                      key={attachment.id}
                      sx={{
                        bgcolor: "white",
                        borderRadius: 1,
                        mb: 1,
                        border: "1px solid #e0e0e0",
                        background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                        "&:hover": {
                          bgcolor: "#f5f5f5",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          transform: "translateX(4px)",
                        },
                        "&:last-child": {
                          mb: 0,
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <FileIcon contentType={attachment.contentType} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "medium",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={attachment.fileName}
                          >
                            {attachment.fileName}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Download">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => onDownloadAttachment(attachment)}
                              sx={{
                                color: "#2196f3",
                                bgcolor: "rgba(33, 150, 243, 0.1)",
                                "&:hover": {
                                  bgcolor: "rgba(33, 150, 243, 0.2)",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease-in-out",
                              }}
                            >
                              <GetApp sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          {/* Delete attachment button available for both roles */}
                          <Tooltip title="Delete Attachment">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => onDeleteAttachment?.(attachment.id)}
                              sx={{
                                color: "#f44336",
                                bgcolor: "rgba(244, 67, 54, 0.1)",
                                "&:hover": {
                                  bgcolor: "rgba(244, 67, 54, 0.2)",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease-in-out",
                              }}
                            >
                              <Delete sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
                  No attachments found for this log entry
                </Typography>
              )}
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  )
}

const TaskLogsModal: React.FC<TaskLogsModalProps> = ({ open, onClose, task, onDownloadAttachment, PageType }) => {
  const [loading, setLoading] = useState(false)
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null)
  const [showAddLogForm, setShowAddLogForm] = useState(false)
  const [showEditLogForm, setShowEditLogForm] = useState(false)
  const [editingLog, setEditingLog] = useState<TaskLog | null>(null)
  const [newLogNote, setNewLogNote] = useState("")
  const [editLogNote, setEditLogNote] = useState("")
  const [newLogNoteError, setNewLogNoteError] = useState(false)
  const [editLogNoteError, setEditLogNoteError] = useState(false)
  const userRole = localStorage.getItem("Role")

  const dispatch = useDispatch<MyDispatch>()
  const logs = useSelector((state: RootState) => state.TaskLog.Log)
  const logAttachments = useSelector((state: RootState) => state.LogAttachment.LogAttachments)

  useEffect(() => {
    if (open && task?.taskId) {
      setLoading(true)
      dispatch(GetAllTaskLogs(task.taskId)).finally(() => {
        setLoading(false)
        setExpandedLogId(null)
      })
    }
  }, [open, task?.taskId, dispatch])

  const toggleLogExpansion = (logId: number) => {
    if (expandedLogId === logId) {
      setExpandedLogId(null)
    } else {
      setExpandedLogId(logId)
      dispatch(GetAllAttachment(logId))
    }
  }

  const handleAddLog = () => {
    setShowAddLogForm(true)
    setNewLogNote("")
    setNewLogNoteError(false)
  }

  const handleSaveNewLog = () => {
    if (!newLogNote.trim()) {
      setNewLogNoteError(true)
      return
    }

    if (newLogNote.trim() && task?.taskId) {
      dispatch(CreateTaskLog({ taskId: task.taskId, note: newLogNote }))
      setShowAddLogForm(false)
      setNewLogNote("")
      setNewLogNoteError(false)
    }
  }

  const handleEditLog = (log: TaskLog) => {
    setEditingLog(log)
    setEditLogNote(log.note)
    setShowEditLogForm(true)
    setEditLogNoteError(false)
  }

  const handleSaveEditLog = () => {
    if (!editLogNote.trim()) {
      setEditLogNoteError(true)
      return
    }

    if (editLogNote.trim() && editingLog) {
      dispatch(UpdateTaskLog({ logId: editingLog.logId, note: editLogNote }))
      setShowEditLogForm(false)
      setEditingLog(null)
      setEditLogNote("")
      setEditLogNoteError(false)
    }
  }

  const handleDeleteLog = (logId: number) => {
    if (window.confirm("Are you sure you want to delete this log entry?")) {
      dispatch(DeleteTaskLog(logId))
    }
  }

  const handleDeleteAttachment = (attachmentId: number) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      dispatch(DeleteAttachment(attachmentId))
    }
  }

  const handleUploadAttachment = (logId: number) => {
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

  const handleCancelAddLog = () => {
    setShowAddLogForm(false)
    setNewLogNote("")
    setNewLogNoteError(false)
  }

  const handleCancelEditLog = () => {
    setShowEditLogForm(false)
    setEditingLog(null)
    setEditLogNote("")
    setEditLogNoteError(false)
  }

  const handleNewLogNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLogNote(e.target.value)
    if (newLogNoteError && e.target.value.trim()) {
      setNewLogNoteError(false)
    }
  }

  const handleEditLogNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditLogNote(e.target.value)
    if (editLogNoteError && e.target.value.trim()) {
      setEditLogNoteError(false)
    }
  }

  if (!task) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: "90vh" },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Description color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Task Logs: {task.taskName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.equipmentName} • Task ID: {task.taskId}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Add New Log Form - Available for both roles */}
        {showAddLogForm && (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Add sx={{ fontSize: 20 }} />
              Add New Log Entry ({userRole})
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Log Note"
              value={newLogNote}
              onChange={handleNewLogNoteChange}
              placeholder="Enter detailed log information..."
              sx={{ mb: 1 }}
              error={newLogNoteError}
            />
            {newLogNoteError && (
              <Typography
                variant="body2"
                sx={{
                  color: "#f44336",
                  mb: 2,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Log note cannot be empty. Please enter some text.
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 2, mt: newLogNoteError ? 0 : 1 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveNewLog}
                disabled={!newLogNote.trim()}
              >
                Save Log
              </Button>
              <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancelAddLog}>
                Cancel
              </Button>
            </Box>
          </Paper>
        )}

        {/* Edit Log Form - Available for both roles */}
        {showEditLogForm && editingLog && (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Edit sx={{ fontSize: 20 }} />
              Edit Log Entry #{editingLog.logId} ({userRole})
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Log Note"
              value={editLogNote}
              onChange={handleEditLogNoteChange}
              sx={{ mb: 1 }}
              error={editLogNoteError}
            />
            {editLogNoteError && (
              <Typography
                variant="body2"
                sx={{
                  color: "#f44336",
                  mb: 2,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Log note cannot be empty. Please enter some text.
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 2, mt: editLogNoteError ? 0 : 1 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveEditLog}
                disabled={!editLogNote.trim()}
              >
                Update Log
              </Button>
              <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancelEditLog}>
                Cancel
              </Button>
            </Box>
          </Paper>
        )}
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : logs && logs.length > 0 ? (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {logs.length} log entr{logs.length !== 1 ? "ies" : "y"} for this task
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddLog}
                size="small"
              >
                Add Log
              </Button>
            </Box>
            {logs.map((log) => (
              <LogCard
                key={log.logId}
                log={log}
                PageType={PageType}
                onDownloadAttachment={onDownloadAttachment ? onDownloadAttachment : (() => {})}
                isExpanded={expandedLogId === log.logId}
                onToggleExpand={() => toggleLogExpansion(log.logId)}
                attachments={expandedLogId === log.logId ? (Array.isArray(logAttachments) ? logAttachments : []) : []}
                onEditLog={handleEditLog}
                onDeleteLog={handleDeleteLog}
                onDeleteAttachment={handleDeleteAttachment}
                onUploadAttachment={handleUploadAttachment}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Description sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No logs found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This task doesn't have any log entries yet. Start by adding the first log entry.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddLog}
            >
              Add First Log
            </Button>
          </Box>
        )}

        {/* Add New Log FAB - Available for both roles */}
        {logs && logs.length > 0 && !showAddLogForm && !showEditLogForm && (
          <Fab color="primary" aria-label="add log" sx={{ position: "fixed", bottom: 100, right: 24 }} onClick={handleAddLog}>
            <Add />
          </Fab>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskLogsModal
