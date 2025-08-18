// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { type MyDispatch, type RootState } from "../Redux/Store";
// import type { Task } from "../Models/TaskModels/TaskModel";
// import type { TaskLog } from "../Models/TaskModels/TaskLogModel";
// import type Attachment from "../Models/TaskModels/AttachmentModel";
// import { AddMainTask, GetAllTask } from "../Redux/Thunks/TaskThunk";
// import { TaskModal } from "../Components/Task/TaskModal";
// import { GetAllEquipment } from "../Redux/Thunks/EquipmentThunk";
// import { GetAllTechOptions } from "../Redux/Thunks/TechnicianThunk";
// import type { CreateTaskModel } from "../Models/TaskModels/CreateTaskModel";


// export const TaskManagementPage = () => {
//   const TaskList = useSelector((state: RootState) => state.AppTask.MainTask);
//   const TaskLogs = useSelector((state: RootState) => state.TaskLog.Log);
//   const Attachment = useSelector((state: RootState) => state.LogAttachment.LogAttachments);
//   const TechOptions = useSelector((state: RootState) => state.Technicians.TechOptions);
//   const EquipmentList = useSelector((state: RootState) => state.Equipment.equipmentList)

//   const [selectedTask, setSelectedTask] = useState<Task>();
//   const [selectedLog, setSelectedLog] = useState<TaskLog>();
//   const [selectedAttachment, setSelectedAttachment] = useState<Attachment>();

//   const [showModal, setShowModal] = useState(false);
//   const [view, setView] = useState<"create" | "edit">("create");

//   const dispatch = useDispatch<MyDispatch>();

//   useEffect(() => 
//   {
//     dispatch(GetAllEquipment());
//     dispatch(GetAllTechOptions());
//     dispatch(GetAllTask());
//   }, [dispatch]);

//   const handleSelectedTask = (task: Task) => {
//     setSelectedTask(task);
//     setView("edit");
//     setShowModal(true);
//   };

//   const handleCreateClick = () => {
//     setSelectedTask(undefined);
//     setView("create");
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedTask(undefined);
//   };

//   const handleSubmitCreate = (newTaskData: CreateTaskModel) => 
//   {
    
//     if(newTaskData !== null)
//     {
//         dispatch(AddMainTask(newTaskData));
//     }

//     setShowModal(false);
//   };

//   const handleSubmitEdit = (updatedTaskData: Task) => {
//     console.log("Edit Task: ", updatedTaskData);
//     // dispatch(EditTaskThunk(updatedTaskData)) — if implemented
//     setShowModal(false);
//   };

//   return (
//     <div className="task-management-page">
//       <h1>Task Management</h1>

//       <button onClick={handleCreateClick}>Create New Task</button>

//       {TaskList.map((task, index) => (
//         <div key={index} onClick={() => handleSelectedTask(task)}>
//           <h2>{task.taskName}</h2>
//           <p>Assigned to: {task.assignedTo}</p>
//           <p>Priority: {task.priority}</p>
//           <p>Status: {task.status}</p>
//         </div>
//       ))}

//       {showModal && (
//         <TaskModal
//           show={showModal}
//           onClose={handleCloseModal}
//           view={view}
//           task={selectedTask}
//           onSubmitCreate={handleSubmitCreate}
//           onSubmitEdit={handleSubmitEdit}
//           equipmentOptions={EquipmentList}
//           technicianOptions={TechOptions}
          
//         />
//       )}
//     </div>
//   );
// };

// export default TaskManagementPage;
