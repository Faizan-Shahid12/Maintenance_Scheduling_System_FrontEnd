// "use client"

// import React, { useEffect, useState } from "react"
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CardHeader,
//   Avatar,
//   Paper,
//   Chip,
//   IconButton,
//   Tooltip,
//   Divider,
//   Collapse,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   ListItemSecondaryAction,
//   CircularProgress,
// } from "@mui/material"
// import {
//   Close,
//   Person,
//   AccessTime,
//   Description,
//   GetApp,
//   Folder,
//   PictureAsPdf,
//   Image,
//   VideoFile,
//   AudioFile,
//   InsertDriveFile,
//   ExpandMore,
//   ExpandLess,
//   AttachFile,
// } from "@mui/icons-material"
// import { useDispatch, useSelector } from "react-redux"
// import { type MyDispatch, type RootState } from "../../Redux/Store"
// import { GetAllTaskLogs } from "../../Redux/Thunks/TaskLogThunk"
// import type { TaskLog } from "../../Models/TaskModels/TaskLogModel"
// import type Attachment from "../../Models/TaskModels/AttachmentModel"
// import type { Task } from "../../Models/TaskModels/TaskModel"
// import { GetAllAttachment } from "../../Redux/Thunks/LogAttachmentThunk"

// interface TaskLogsModalProps {
//   open: boolean
//   onClose: () => void
//   task: Task | null
//   onDownloadAttachment: (attachment: Attachment) => void
// }

// const FileIcon = ({ contentType }: { contentType: string }) => {
//   if (contentType.includes("pdf")) return <PictureAsPdf sx={{ color: "#f44336", fontSize: 20 }} />
//   if (contentType.includes("image")) return <Image sx={{ color: "#4caf50", fontSize: 20 }} />
//   if (contentType.includes("video")) return <VideoFile sx={{ color: "#2196f3", fontSize: 20 }} />
//   if (contentType.includes("audio")) return <AudioFile sx={{ color: "#ff9800", fontSize: 20 }} />
//   if (contentType.includes("word")) return <InsertDriveFile sx={{ color: "#1976d2", fontSize: 20 }} />
//   return <InsertDriveFile sx={{ color: "#9e9e9e", fontSize: 20 }} />
// }

// const LogCard = ({ 
//   log, 
//   onDownloadAttachment,
//   isExpanded,
//   onToggleExpand,
//   attachments
// }: { 
//   log: TaskLog
//   onDownloadAttachment: (attachment: Attachment) => void
//   isExpanded: boolean
//   onToggleExpand: () => void
//   attachments: Attachment[]
// }) => {
//   return (
//     <Card sx={{ 
//       mb: 2, 
//       borderRadius: 2, 
//       boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//       background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
//       border: "1px solid #e3f2fd",
//       transition: "all 0.3s ease",
//       "&:hover": {
//         transform: "translateY(-2px)",
//         boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
//       }
//     }}>
//       <CardHeader
//         sx={{ cursor: "pointer" }}
//         onClick={onToggleExpand}
//         avatar={
//           <Avatar sx={{ 
//             bgcolor: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)", 
//             width: 40, 
//             height: 40,
//             boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)"
//           }}>
//             <Description sx={{ fontSize: 20 }} />
//           </Avatar>
//         }
//         title={
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//               Log Entry #{log.logId}
//             </Typography>
//             {isExpanded && attachments.length > 0 && (
//               <Chip
//                 icon={<AttachFile />}
//                 label={`${attachments.length} file${attachments.length !== 1 ? 's' : ''}`}
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//               />
//             )}
//           </Box>
//         }
//         subheader={
//           <Box sx={{ mt: 1 }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                 <Person sx={{ color: "#666", fontSize: 16 }} />
//                 <Typography variant="body2" color="textSecondary">
//                   {log.createdBy}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                 <AccessTime sx={{ color: "#666", fontSize: 16 }} />
//                 <Typography variant="body2" color="textSecondary">
//                   {new Date(log.createdAt).toLocaleDateString('en-US', {
//                     month: 'short',
//                     day: 'numeric',
//                     year: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit'
//                   })}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         }
//         action={
//           <IconButton onClick={onToggleExpand} size="small">
//             {isExpanded ? <ExpandLess /> : <ExpandMore />}
//           </IconButton>
//         }
//       />
//       <CardContent sx={{ pt: 0 }}>
//         <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
//           {log.note}
//         </Typography>
        
//         {/* Attachments Section - Show when expanded */}
//         <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//           <Divider sx={{ mb: 2 }} />
//           <Box sx={{ 
//             background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)", 
//             borderRadius: 2, 
//             p: 2,
//             border: "1px solid #e1bee7"
//           }}>
//             <Typography 
//               variant="subtitle2" 
//               sx={{ 
//                 mb: 2, 
//                 fontWeight: "bold", 
//                 color: "#ff9800",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1
//               }}
//             >
//               <Folder sx={{ fontSize: 18 }} />
//               Attachments {attachments.length > 0 && `(${attachments.length})`}
//             </Typography>
            
//             {attachments.length > 0 ? (
//               <List dense sx={{ p: 0 }}>
//                 {attachments.map((attachment, index) => (
//                   <ListItem
//                     key={attachment.id}
//                     sx={{
//                       bgcolor: "white",
//                       borderRadius: 1,
//                       mb: 1,
//                       border: "1px solid #e0e0e0",
//                       background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
//                       "&:hover": {
//                         bgcolor: "#f5f5f5",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                         transform: "translateX(4px)",
//                       },
//                       "&:last-child": {
//                         mb: 0,
//                       },
//                       transition: "all 0.2s ease",
//                     }}
//                   >
//                     <ListItemIcon sx={{ minWidth: 40 }}>
//                       <FileIcon contentType={attachment.contentType} />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             fontWeight: "medium",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                           }}
//                           title={attachment.fileName}
//                         >
//                           {attachment.fileName}
//                         </Typography>
//                       }
//                     />
//                     <ListItemSecondaryAction>
//                       <Tooltip title="Download">
//                         <IconButton
//                           edge="end"
//                           size="small"
//                           onClick={() => onDownloadAttachment(attachment)}
//                           sx={{
//                             color: "#2196f3",
//                             "&:hover": { 
//                               bgcolor: "#e3f2fd",
//                               transform: "scale(1.1)",
//                             },
//                             transition: "all 0.2s ease-in-out",
//                           }}
//                         >
//                           <GetApp sx={{ fontSize: 18 }} />
//                         </IconButton>
//                       </Tooltip>
//                     </ListItemSecondaryAction>
//                   </ListItem>
//                 ))}
//               </List>
//             ) : (
//               <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
//                 No attachments found for this log entry
//               </Typography>
//             )}
//           </Box>
//         </Collapse>
//       </CardContent>
//     </Card>
//   )
// }

// const TaskLogsModal: React.FC<TaskLogsModalProps> = ({
//   open,
//   onClose,
//   task,
//   onDownloadAttachment,
// }) => {
//   const [loading, setLoading] = useState(false)
//   const [expandedLogId, setExpandedLogId] = useState<number | null>(null)
  
//   const dispatch = useDispatch<MyDispatch>()
//   const logs = useSelector((state: RootState) => state.TaskLog.Log)
//   const logAttachments = useSelector((state: RootState) => state.LogAttachment.LogAttachments)

//   useEffect(() => {
//     if (open && task?.taskId) {
//       setLoading(true)
//       dispatch(GetAllTaskLogs(task.taskId)).finally(() => {
//         setLoading(false)
//         setExpandedLogId(null) // collapse all on open
//       })
//     }
//   }, [open, task?.taskId, dispatch])

//   const toggleLogExpansion = (logId: number) => {
//     if (expandedLogId === logId) {
//       setExpandedLogId(null)
//     } else {
//       setExpandedLogId(logId)
//        dispatch(GetAllAttachment(logId))
//     }
//   }

//   if (!task) return null

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           maxHeight: "90vh",
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           color: "white",
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           pb: 2,
//           borderBottom: "1px solid rgba(255,255,255,0.2)",
//           bgcolor: "rgba(255,255,255,0.1)",
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         <Box>
//           <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
//             Task Logs: {task.taskName}
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             {task.equipmentName} • Task ID: {task.taskId}
//           </Typography>
//         </Box>
//         <IconButton 
//           onClick={onClose} 
//           size="small"
//           sx={{
//             color: "white",
//             bgcolor: "rgba(255,255,255,0.1)",
//             "&:hover": {
//               bgcolor: "rgba(255,255,255,0.2)",
//               transform: "scale(1.1)",
//             },
//             transition: "all 0.2s ease",
//           }}
//         >
//           <Close />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 3, bgcolor: "#f8f9fa" }}>
//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
//             <CircularProgress />
//           </Box>
//         ) : logs && logs.length > 0 ? (
//           <Box>
//             <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
//               Showing {logs.length} log entr{logs.length !== 1 ? 'ies' : 'y'} for this task
//             </Typography>
//             {logs.map((log) => (
//               <LogCard
//                 key={log.logId}
//                 log={log}
//                 onDownloadAttachment={onDownloadAttachment}
//                 isExpanded={expandedLogId === log.logId}
//                 onToggleExpand={() => toggleLogExpansion(log.logId)}
//                 attachments={expandedLogId === log.logId ? (Array.isArray(logAttachments) ? logAttachments : []) : []}
//               />
//             ))}
//           </Box>
//         ) : (
//           <Box sx={{ textAlign: "center", py: 6 }}>
//             <Description sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
//             <Typography variant="h6" color="textSecondary" gutterBottom>
//               No logs found
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               This task doesn't have any log entries yet.
//             </Typography>
//           </Box>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ 
//         p: 3, 
//         pt: 0, 
//         bgcolor: "rgba(255,255,255,0.1)",
//         backdropFilter: "blur(10px)",
//         borderTop: "1px solid rgba(255,255,255,0.2)"
//       }}>
//         <Button 
//           onClick={onClose} 
//           variant="outlined" 
//           size="large"
//           sx={{
//             color: "white",
//             borderColor: "rgba(255,255,255,0.3)",
//             "&:hover": {
//               borderColor: "white",
//               bgcolor: "rgba(255,255,255,0.1)",
//             },
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default TaskLogsModal
