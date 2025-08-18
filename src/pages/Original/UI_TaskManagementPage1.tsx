// "use client"

// import React, { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { type MyDispatch, type RootState } from "../Redux/Store"
// import type { Task } from "../Models/TaskModels/TaskModel"
// import type { TaskLog } from "../Models/TaskModels/TaskLogModel"
// import type Attachment from "../Models/TaskModels/AttachmentModel"
// import { AddMainTask, GetAllTask, UpdateMainTask } from "../Redux/Thunks/TaskThunk"
// import { TaskModal } from "../Components/Task/TaskModal"
// import { GetAllEquipment } from "../Redux/Thunks/EquipmentThunk"
// import { GetAllTechOptions } from "../Redux/Thunks/TechnicianThunk"
// import type { CreateTaskModel } from "../Models/TaskModels/CreateTaskModel"
// import {
//   Box,
//   Container,
//   Typography,
//   Grid,
//   CardContent,
//   CardHeader,
//   Button,
//   IconButton,
//   Tooltip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
//   InputAdornment,
//   Fab,
//   Chip,
//   Avatar,
//   Paper,
//   ButtonGroup,
// } from "@mui/material"
// import {
//   Add,
//   Edit,
//   Delete,
//   Search,
//   FilterList,
//   Assignment,
//   Person,
//   Schedule,
//   Build,
//   Warning,
//   CheckCircle,
//   PlayCircle,
//   PauseCircle,
//   Engineering,
//   Description,
// } from "@mui/icons-material"
// import {
//   TaskCard,
//   HeaderCard,
//   StatsCard,
//   PriorityChip,
//   StatusChip,
//   TechnicianAvatar,
// } from "../Components/ui/task-management-components"
// import { DownloadAttachment } from "../Redux/Thunks/LogAttachmentThunk"
// import TaskLogsModal from "../Components/Task/TaskLogModal"

// export const TaskManagementPage = () => {
//   const TaskList = useSelector((state: RootState) => state.AppTask.MainTask)
//   const TechOptions = useSelector((state: RootState) => state.Technicians.TechOptions)
//   const EquipmentList = useSelector((state: RootState) => state.Equipment.equipmentList)

//   const [selectedTask, setSelectedTask] = useState<Task | null>(null)
//   const [showModal, setShowModal] = useState(false)
//   const [view, setView] = useState<"create" | "edit" | "view">("view")
//   const [showLogsModal, setShowLogsModal] = useState(false)

//   // UI state for filtering and search
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>("All")
//   const [priorityFilter, setPriorityFilter] = useState<string>("All")
//   const [assigneeFilter, setAssigneeFilter] = useState<string>("All")

//   const dispatch = useDispatch<MyDispatch>()

//   useEffect(() => {
//     dispatch(GetAllEquipment())
//     dispatch(GetAllTechOptions())
//     dispatch(GetAllTask())
//   }, [dispatch])

//   const handleSelectedTask = (task: Task) => {
//     setSelectedTask(task)
//     setView("edit")
//     setShowModal(true)
//   }

//   const handleCreateClick = () => {
//     setSelectedTask(null)
//     setView("create")
//     setShowModal(true)
//   }

//   const handleDeleteClick = (task: Task) =>
//   {
//     setSelectedTask(task)
//     setView("view")
//     setShowModal(true)
//   }

//   const handleCloseModal = () => {
//     setShowModal(false)
//     setSelectedTask(null)
//   }

//   const handleSubmitCreate = (newTaskData: CreateTaskModel) => {
//     if (newTaskData !== null) {
//       dispatch(AddMainTask(newTaskData))
//     }
//     setShowModal(false)
//   }

//   const handleSubmitEdit = (updatedTaskData: Task, oldTechId: string, newTechId: string) => {
    
//     if(updatedTaskData !== null) 
//     {
//         dispatch(UpdateMainTask({task: updatedTaskData, OldTechId: oldTechId, NewTechId: newTechId }))
//     }

//     setShowModal(false)
//   }

//   // Calculate if task is overdue
//   const isTaskOverdue = (task: Task) => {
//     if (!task.dueDate) return false
//     const today = new Date()
//     const dueDate = new Date(task.dueDate)
//     return task.status !== "Completed" && dueDate < today
//   }

//   // Filter and search tasks
//   const filteredTasks = TaskList.filter((task) => {
//     const matchesSearch = task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
    
//     const matchesStatus = statusFilter === "All" || task.status === statusFilter
//     const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter
//     const matchesAssignee = assigneeFilter === "All" || task.assignedTo === assigneeFilter

//     return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
//   })

//   // Calculate statistics
//   const stats = {
//     total: TaskList.length,
//     completed: TaskList.filter(t => t.status === "Completed").length,
//     overdue: TaskList.filter(t => isTaskOverdue(t)).length,
//     pending: TaskList.filter(t => t.status === "Pending").length,
//   }

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "No due date"
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     })
//   }
  

//   const getDaysUntilDue = (dueDate?: string) => {
//     if (!dueDate) return null
//     const today = new Date()
//     const due = new Date(dueDate)
//     const diffTime = due.getTime() - today.getTime()
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     return diffDays
//   }

//   const handleViewLogs = (task: Task) => {
//     setSelectedTask(task)
//     setShowLogsModal(true)
//   }

//   const handleCloseLogsModal = () => {
//     setShowLogsModal(false)
//     setSelectedTask(null)
//   }

//   const handleDownloadAttachment = (attachmentId: Attachment) =>
//     {
//         dispatch(DownloadAttachment(attachmentId.id))
//     }

//   return (
//     <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 3 }}>
//       <Container maxWidth="xl">
//         {/* Header */}
//         <HeaderCard>
//           <Box sx={{ position: "absolute", top: -30, right: -30, opacity: 0.08 }}>
//             <Engineering sx={{ fontSize: 120 }} />
//           </Box>
//           <Box sx={{ position: "relative", zIndex: 1 }}>
//             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Paper
//                   sx={{
//                     width: 56,
//                     height: 56,
//                     borderRadius: 2,
//                     background: "rgba(255,255,255,0.2)",
//                     backdropFilter: "blur(10px)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     mr: 2,
//                     boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <Assignment sx={{ fontSize: 28, color: "white" }} />
//                 </Paper>
//                 <Box>
//                   <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5, color: "white" }}>
//                     Task Management
//                   </Typography>
//                   <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)" }}>
//                     Manage and track maintenance tasks
//                   </Typography>
//                 </Box>
//               </Box>
//               <Button
//                 variant="contained"
//                 startIcon={<Add />}
//                 onClick={handleCreateClick}
//                 sx={{
//                   bgcolor: "rgba(255,255,255,0.2)",
//                   backdropFilter: "blur(10px)",
//                   border: "1px solid rgba(255,255,255,0.3)",
//                   color: "white",
//                   "&:hover": {
//                     bgcolor: "rgba(255,255,255,0.3)",
//                   },
//                 }}
//               >
//                 Create Task
//               </Button>
//             </Box>

//             {/* Statistics */}
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//               <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
//                 <StatsCard elevation={0}>
//                   <Avatar sx={{ bgcolor: "#2196f3", width: 36, height: 36 }}>
//                     <Assignment sx={{ fontSize: 18 }} />
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
//                       {stats.total}
//                     </Typography>
//                     <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
//                       Total Tasks
//                     </Typography>
//                   </Box>
//                 </StatsCard>
//               </Box>
//               <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
//                 <StatsCard elevation={0}>
//                   <Avatar sx={{ bgcolor: "#4caf50", width: 36, height: 36 }}>
//                     <CheckCircle sx={{ fontSize: 18 }} />
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
//                       {stats.completed}
//                     </Typography>
//                     <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
//                       Completed
//                     </Typography>
//                   </Box>
//                 </StatsCard>
//               </Box>
//               <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
//                 <StatsCard elevation={0}>
//                   <Avatar sx={{ bgcolor: "#f44336", width: 36, height: 36 }}>
//                     <Warning sx={{ fontSize: 18 }} />
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
//                       {stats.overdue}
//                     </Typography>
//                     <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
//                       Overdue
//                     </Typography>
//                   </Box>
//                 </StatsCard>
//               </Box>
//               <Box sx={{ flex: "1 1 180px", minWidth: "180px" }}>
//                 <StatsCard elevation={0}>
//                   <Avatar sx={{ bgcolor: "#9e9e9e", width: 36, height: 36 }}>
//                     <PauseCircle sx={{ fontSize: 18 }} />
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
//                       {stats.pending}
//                     </Typography>
//                     <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
//                       Pending
//                     </Typography>
//                   </Box>
//                 </StatsCard>
//               </Box>
//             </Box>
//           </Box>
//         </HeaderCard>

//         {/* Filters */}
//         <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
//             <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
//               <TextField
//                 fullWidth
//                 placeholder="Search tasks..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Search />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Box>
//             <Box sx={{ flex: "1 1 150px", minWidth: "150px" }}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   value={statusFilter}
//                   label="Status"
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                 >
//                   <MenuItem value="All">All Status</MenuItem>
//                   <MenuItem value="Pending">Pending</MenuItem>
//                   <MenuItem value="InProgress">In Progress</MenuItem>
//                   <MenuItem value="Completed">Completed</MenuItem>
//                   <MenuItem value="OverDue">Overdue</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//             <Box sx={{ flex: "1 1 150px", minWidth: "150px" }}>
//               <FormControl fullWidth>
//                 <InputLabel>Priority</InputLabel>
//                 <Select
//                   value={priorityFilter}
//                   label="Priority"
//                   onChange={(e) => setPriorityFilter(e.target.value)}
//                 >
//                   <MenuItem value="All">All Priority</MenuItem>
//                   <MenuItem value="High">High</MenuItem>
//                   <MenuItem value="Medium">Medium</MenuItem>
//                   <MenuItem value="Low">Low</MenuItem>
//                   <MenuItem value="Urgent">Urgent</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//             <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
//               <FormControl fullWidth>
//                 <InputLabel>Assignee</InputLabel>
//                 <Select
//                   value={assigneeFilter}
//                   label="Assignee"
//                   onChange={(e) => setAssigneeFilter(e.target.value)}
//                 >
//                   <MenuItem value="All">All Assignees</MenuItem>
//                   {TechOptions.map((tech) => (
//                     <MenuItem key={tech.id} value={tech.fullName}>
//                       {tech.fullName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>
//             <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
//               <Typography variant="body2" color="textSecondary">
//                 {filteredTasks.length} of {TaskList.length} tasks
//               </Typography>
//             </Box>
//           </Box>
//         </Paper>

//         {/* Task Cards */}
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
//           {filteredTasks.map((task, index) => {
//             const isOverdue = task.status === "OverDue"
//             const daysUntilDue = getDaysUntilDue(task.dueDate)
//             const assignedTechName = task.assignedTo || "Unassigned"
                        
//             return (
//               <Box key={task.taskId || index} sx={{ flex: "1 1 350px", minWidth: "350px", maxWidth: "400px" }}>
//                 <TaskCard isOverdue={isOverdue}>
//                   <CardHeader
//                     avatar={<TechnicianAvatar name={assignedTechName} specialization="" />}
//                     title={
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
//                           {task.taskName}
//                         </Typography>
//                         {isOverdue && <Warning sx={{ color: "#f44336", fontSize: 18 }} />}
//                       </Box>
//                     }
//                     subheader={
//                       <Box sx={{ mt: 1 }}>
//                         <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
//                           {task.equipmentName}
//                         </Typography>
//                         <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                           <PriorityChip priority={task.priority || "Medium"} />
//                           <StatusChip status={isOverdue ? "Overdue" : (task.status || "Pending")} />
//                         </Box>
//                       </Box>
//                     }
//                     action={
//                       <ButtonGroup size="small">
//                         <Tooltip title="View Logs">
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               handleViewLogs(task)
//                             }}
//                             sx={{
//                               bgcolor: "#f5f5f5",
//                               color: "#ff9800",
//                               "&:hover": { bgcolor: "#fff3e0" },
//                             }}
//                           >
//                             <Description sx={{ fontSize: 16 }} />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Edit Task">
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               handleSelectedTask(task)
//                             }}
//                             sx={{
//                               bgcolor: "#f5f5f5",
//                               color: "#666",
//                               "&:hover": { bgcolor: "#e0e0e0" },
//                             }}
//                           >
//                             <Edit sx={{ fontSize: 16 }} />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Delete Task">
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               handleDeleteClick
//                             }}
//                             sx={{
//                               bgcolor: "#f5f5f5",
//                               color: "#f44336",
//                               "&:hover": { bgcolor: "#ffebee" },
//                             }}
//                           >
//                             <Delete sx={{ fontSize: 16 }} />
//                           </IconButton>
//                         </Tooltip>
//                       </ButtonGroup>
//                     }
//                   />
//                   <CardContent 
//                     sx={{ pt: 0, cursor: "pointer" }}
//                     onClick={() => handleSelectedTask(task)}
//                   >
//                     {/* Task Details */}
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                         <Schedule sx={{ color: "#666", fontSize: 16 }} />
//                         <Box>
//                           <Typography variant="caption" color="textSecondary">
//                             Due Date
//                           </Typography>
//                           <Typography variant="body2" sx={{ fontWeight: "medium" }}>
//                             {formatDate(task.dueDate)}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                         <Person sx={{ color: "#666", fontSize: 16 }} />
//                         <Box>
//                           <Typography variant="caption" color="textSecondary">
//                             Assigned To
//                           </Typography>
//                           <Typography variant="body2" sx={{ fontWeight: "medium" }}>
//                             {assignedTechName}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </Box>

//                     {/* Due Date Warning */}
//                     {!isOverdue && daysUntilDue !== null && daysUntilDue <= 3 && daysUntilDue > 0 && task.status !== "Completed" && (
//                       <Chip
//                         label={`Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`}
//                         color="warning"
//                         size="small"
//                         sx={{ mt: 2 }}
//                       />
//                     )}
//                   </CardContent>
//                 </TaskCard>
//               </Box>
//             )
//           })}
//         </Box>

//         {/* Empty State */}
//         {filteredTasks.length === 0 && (
//           <Paper sx={{ p: 6, textAlign: "center", mt: 3 }}>
//             <Assignment sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
//             <Typography variant="h6" color="textSecondary" gutterBottom>
//               No tasks found
//             </Typography>
//             <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
//               {searchTerm || statusFilter !== "All" || priorityFilter !== "All" || assigneeFilter !== "All"
//                 ? "Try adjusting your filters or search terms"
//                 : "Create your first task to get started"}
//             </Typography>
//             <Button variant="contained" startIcon={<Add />} onClick={handleCreateClick}>
//               Create Task
//             </Button>
//           </Paper>
//         )}

//         {/* Floating Action Button */}
//         <Fab
//           color="primary"
//           aria-label="add task"
//           sx={{ position: "fixed", bottom: 24, right: 24 }}
//           onClick={handleCreateClick}
//         >
//           <Add />
//         </Fab>

//         {/* Task Modal */}
//         {showModal && (
//           <TaskModal
//             show={showModal}
//             onClose={handleCloseModal}
//             view={view}
//             task={selectedTask}
//             onSubmitCreate={handleSubmitCreate}
//             onSubmitEdit={handleSubmitEdit}
//             equipmentOptions={EquipmentList}
//             technicianOptions={TechOptions}
//           />
//         )}
//         {/* Task Logs Modal */}
//         {showLogsModal && (
//           <TaskLogsModal
//             open={showLogsModal}
//             onClose={handleCloseLogsModal}
//             task={selectedTask}
//             onDownloadAttachment={handleDownloadAttachment}
//           />
//         )}
//       </Container>
//     </Box>
//   )
// }

// export default TaskManagementPage
