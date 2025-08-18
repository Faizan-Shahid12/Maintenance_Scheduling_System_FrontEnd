// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { MyDispatch, RootState } from "../../Redux/Store";
// import type { EquipmentHistory } from "../../Models/EquipmentModels/EquipmentHistoryModel";
// import { GetAllEquipment } from "../../Redux/Thunks/EquipmentThunk";
// import { GetHistoryByEquipmentId } from "../../Redux/Thunks/HistoryThunk";
// import {addMaintenanceToEquipment,clearMaintenanceFromEquipment } from "../../Redux/Slicers/EquipmentSlicer";
// import { addTaskToMaintenance, clearEquipmentHistory, clearTaskFromMaintenance } from "../../Redux/Slicers/HistorySlicer";
// import type MaintenanceHistory from "../../Models/HistoryModels/HistoryModel";
// import type { Task } from "../../Models/TaskModels/TaskModel";
// import { addTaskLogsToTask, clearHistoryTask, clearTaskLogsFromTask } from "../../Redux/Slicers/TaskSlicer";
// import { GetTaskByHistoryId } from "../../Redux/Thunks/TaskThunk";
// import { GetAllTaskLogs } from "../../Redux/Thunks/TaskLogThunk";
// import { addAttachmentToTaskLog, clearAttachmentFromTaskLog, clearLogofTask } from "../../Redux/Slicers/TaskLogSlicer";
// import type { TaskLog } from "../../Models/TaskModels/TaskLogModel";
// import { DownloadAttachment, GetAllAttachment } from "../../Redux/Thunks/LogAttachmentThunk";
// import type Attachment from "../../Models/TaskModels/AttachmentModel";

// export const MaintenanceTree = () => {
//   const EquipmentList = useSelector(
//     (state: RootState) => state.Equipment.EquipmentHistory
//   );
//   const MaintenanceHistory = useSelector(
//     (state: RootState) => state.MaintenanceHistory.EquipHistory
//   );
//   const HistoryTask = useSelector(
//     (state: RootState) => state.AppTask.HistoryTask
//   )
//   const TaskLogs = useSelector(
//     (state: RootState) => state.TaskLog.HistoryLog
//   )
//   const LogAttachment = useSelector(
//     (state: RootState) => state.LogAttachment.HistoryLogAttachment
//   )
//   const MaintenanceHistoryLoading = useSelector(
//     (state: RootState) => state.MaintenanceHistory.loading
//   );

//   const dispatch = useDispatch<MyDispatch>();
//   const [selectedEquipment, setSelectedEquipment] = useState<EquipmentHistory | null>(null);
//   const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceHistory | null>(null);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [selectedTaskLog, setSelectedTaskLog] = useState<TaskLog | null>(null);
//   const [selectedLogAttach, setSelectedLogAttach] = useState<Attachment | null>(null);


//   useEffect(() => {
//     dispatch(GetAllEquipment());
//   }, [dispatch]);

//   const handlemaintenance = (equipment: EquipmentHistory) => {
//     setSelectedEquipment(equipment);
//   };

//   useEffect(() => 
//   {
//     if (selectedEquipment !== null) {
//       dispatch(clearEquipmentHistory());
//       dispatch(GetHistoryByEquipmentId(selectedEquipment.equipmentId));
//     }
//   }, [selectedEquipment]);

//   useEffect(() => {
//     if (selectedEquipment !== null && MaintenanceHistory?.length > 0) {
//       dispatch(
//         addMaintenanceToEquipment({
//           equipmentId: selectedEquipment.equipmentId,
//           maintenance: MaintenanceHistory,
//         })
//       );
//     } else if (selectedEquipment !== null && MaintenanceHistory?.length <= 0) {
//       dispatch(
//         clearMaintenanceFromEquipment({
//           equipmentId: selectedEquipment.equipmentId,
//         })
//       );
//     }
//   }, [MaintenanceHistory, selectedEquipment]);

//   const HandleTask = (history: MaintenanceHistory) => {
//     setSelectedMaintenance(history);
//   };
  
//   useEffect(()=>
//   {
//     if (selectedMaintenance !== null) 
//     {
//       dispatch(clearHistoryTask());
//       dispatch(GetTaskByHistoryId(selectedMaintenance.historyId));
//     }
//   }, [selectedMaintenance])

//    useEffect(() => {
//     if (selectedMaintenance !== null && HistoryTask?.length > 0) {
//       dispatch(
//         addTaskToMaintenance({
//           historyId: selectedMaintenance.historyId,
//           Tasks: HistoryTask,
//         })
//       );
//     } else if (selectedMaintenance !== null && HistoryTask?.length <= 0) {
//       dispatch(
//         clearTaskFromMaintenance(selectedMaintenance.historyId)
//       );
//     }
//   }, [HistoryTask, selectedMaintenance]);

//   const HandleTaskLog = (task : Task) =>
//   {
//     setSelectedTask(task);
//   }

//   useEffect(()=>
//   {
//     if (selectedTask !== null) 
//     {
//       dispatch(clearLogofTask());
//       dispatch(GetAllTaskLogs(selectedTask.taskId));
//     }
//   }, [selectedTask])

//    useEffect(() => 
//   {
//     console.log("selectedTask From Func", TaskLogs)
//     if (selectedTask !== null && HistoryTask?.length > 0) {
//       dispatch(
//         addTaskLogsToTask({
//           taskId: selectedTask.taskId,
//           TaskLogs: TaskLogs,
//         })
//       );
//     } else if (selectedTask !== null && HistoryTask?.length <= 0) {
//       dispatch(
//         clearTaskLogsFromTask({taskId: selectedTask.taskId})
//       );
//     }
//   }, [TaskLogs, selectedTask]);

//   const HandleLogAttach = (log : TaskLog) =>
//   {
//     setSelectedTaskLog(log);
//   }
//   useEffect(()=>
//   {
//     if (selectedTaskLog !== null) 
//     {
//       // dispatch clear function
//       dispatch(GetAllAttachment(selectedTaskLog.logId));
//     }
//   }, [selectedTask])

//   useEffect(() => 
//   {
//     console.log("selectedTask From Func", TaskLogs)
//     if (selectedTaskLog !== null && HistoryTask?.length > 0) {
//       dispatch(
//         addAttachmentToTaskLog({
//           LogId: selectedTaskLog.logId,
//           attachs: LogAttachment,
//         })
//       );
//     } else if (selectedTaskLog !== null && HistoryTask?.length <= 0) {
//       dispatch(
//         clearAttachmentFromTaskLog({LogId: selectedTaskLog.logId})
//       );
//     }
//   }, [TaskLogs, selectedTaskLog]);


//   return (
//     <div>
//       <h1>Maintenance Tree</h1>

//       {EquipmentList?.map((equipment) => (
//         <div
//           key={equipment.equipmentId}
//           style={{
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//             padding: "10px",
//             marginBottom: "10px",
//           }}
//         >
//           {/* Equipment */}
//           <div
//             style={{ cursor: "pointer", fontWeight: "bold" }}
//             onClick={() => handlemaintenance(equipment)}
//           >
//             {equipment.name} (ID: {equipment.equipmentId})
//           </div>

//           {/* Maintenance History */}
//           {selectedEquipment?.equipmentId === equipment.equipmentId && (
//             <div style={{ marginLeft: "20px", marginTop: "10px" }}>
//               {MaintenanceHistoryLoading ? (
//                 <p>Loading maintenance history...</p>
//               ) : equipment.maintenances?.length > 0 ? (
//                 equipment.maintenances.map((mh) => (
//                   <div
//                     key={mh.historyId}
//                     style={{
//                       borderLeft: "3px solid #007bff",
//                       paddingLeft: "10px",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <div style={{ fontWeight: "500", marginBottom: "5px" }} onClick={() => HandleTask(mh)}>
//                       🛠️ History ID: {mh.historyId}
//                     </div>
//                     <div>
//                       📅 <strong>Start:</strong> {mh.startDate}
//                     </div>
//                     <div>
//                       📅 <strong>End:</strong> {mh.endDate}
//                     </div>

//                     {/* Tasks */}
//                     {selectedMaintenance?.historyId === mh.historyId && (
//                       <div style={{ marginLeft: "20px", marginTop: "10px" }}>
//                         <strong>📋 Tasks:</strong>
//                         {mh.tasks?.length > 0 ? (
//                           mh.tasks.map((task) => (
//                             <div
//                               key={task.taskId}
//                               style={{
//                                 border: "1px solid #aaa",
//                                 borderRadius: "4px",
//                                 padding: "5px 10px",
//                                 margin: "5px 0",
//                               }}
//                               onClick={() => {
//                                 HandleTaskLog(task);
//                               }}
//                             >
//                               <div><strong>Task ID:</strong> {task.taskId}</div>
//                               <div><strong>Title:</strong> {task.taskName}</div>
//                               <div><strong>Status:</strong> {task.status}</div>
//                               <div><strong>Priority:</strong> {task.priority}</div>

//                               {/* Task Logs */}
//                               {selectedTask?.taskId === task.taskId && (
//                                 <div style={{ marginLeft: "20px", marginTop: "10px" }}>
//                                   <strong>📝 Task Logs:</strong>
//                                   {task.logs?.length > 0 ? (
//                                     task.logs.map((log) => (
//                                       <div
//                                         key={log.logId}
//                                         style={{
//                                           border: "1px dashed #666",
//                                           borderRadius: "4px",
//                                           padding: "5px 10px",
//                                           margin: "5px 0",
//                                           backgroundColor: "#f9f9f9",
//                                         }}
//                                         onClick={() => HandleLogAttach(log)}
//                                       >
//                                         <div><strong>Log ID:</strong> {log.logId}</div>
//                                         <div><strong>Note:</strong> {log.note}</div>
//                                         <div><strong>Created At:</strong> {log.createdAt}</div>
//                                         <div><strong>Created By:</strong> {log.createdBy}</div>

//                                         {/* Attachments */}
//                                         {log.attachments && log.attachments.length > 0 ? (
//                                           <div style={{ marginTop: "10px", marginLeft: "20px" }}>
//                                             <strong>📎 Attachments:</strong>
//                                             {log.attachments.map((attachment) => (
//                                               <div
//                                                 key={attachment.id}
//                                                 style={{
//                                                   border: "1px solid #ccc",
//                                                   padding: "8px",
//                                                   borderRadius: "5px",
//                                                   marginBottom: "6px",
//                                                   backgroundColor: "#f9f9f9",
//                                                 }}
//                                               >
//                                                 <div><strong>File Name:</strong> {attachment.fileName}</div>
//                                                 <div><strong>Content Type:</strong> {attachment.contentType}</div>
//                                                 <div>
//                                                   <button
//                                                     onClick={() => dispatch(DownloadAttachment(attachment.id))}
//                                                     style={{ marginTop: "5px" }}
//                                                   >
//                                                     ⬇ Download
//                                                   </button>
//                                                 </div>
//                                               </div>
//                                             ))}
//                                           </div>
//                                         ) : (
//                                           <p style={{ fontStyle: "italic", color: "#666", marginLeft: "20px" }}>No attachments.</p>
//                                         )}


//                                       </div>
//                                     ))
//                                   ) : (
//                                     <p style={{ fontStyle: "italic", color: "#666" }}>No task logs available.</p>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           ))
//                         ) : (
//                           <p style={{ fontStyle: "italic", color: "#666" }}>No tasks available.</p>
//                         )}
//                       </div>
//                     )}
                  
//                   </div>
//                 ))
//               ) : (
//                 <p>No maintenance history available.</p>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MaintenanceTree;
