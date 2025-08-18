import { useEffect, useState } from "react";
import { Close, Save, Add, Visibility, Edit, Delete } from "@mui/icons-material";
import type { Task } from "../../Models/TaskModels/TaskModel";
import type { CreateTaskModel } from "../../Models/TaskModels/CreateTaskModel";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import type { TechnicianOptionModel } from "../../Models/Technician/TechnicianModel";

type TaskModalProps = {
  show: boolean;
  onClose: () => void;
  task: Task | null;
  onSubmitCreate?: (task: CreateTaskModel) => void;
  onSubmitEdit?: (updatedTaskData: Task, oldTechId: string, newTechId: string) => void;
  onSubmitDelete?: (task: Task) => void;
  view: "view" | "edit" | "create" | "delete" ;
  equipmentOptions?: Equipment[];
  technicianOptions?: TechnicianOptionModel[];
};

//  Added validation error types
type ValidationErrors = {
  taskName?: string;
  equipId?: string;
  dueDate?: string;
};

export const TaskModal: React.FC<TaskModalProps> = ({
  show,
  onClose,
  task,
  onSubmitCreate,
  onSubmitEdit,
  onSubmitDelete,
  view,
  equipmentOptions,
  technicianOptions,
}) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Low");
  const [status, setStatus] = useState<"Pending" | "OverDue" | "Completed">("Pending");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [equipId, setEquipId] = useState<number>(-1);
  const [equipmentName, setEquipmentName] = useState("");
  const [technicianId, setTechnicianId] = useState<string | null>(null);
  const [oldTechId,setoldTechId] = useState<string | null>(null);
  const [selectedTechnicianName, setSelectedTechnicianName] = useState("");
  
  //  Added validation state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
 
  const userRole = localStorage.getItem("Role")

  //  Added validation function
  const validateField = (fieldName: string, value: any): string | undefined => {
    switch (fieldName) {
      case 'taskName':
        if (!value || value.trim().length === 0) {
          return 'Task name is required';
        }
        if (value.trim().length < 3) {
          return 'Task name must be at least 3 characters';
        }
        if (value.trim().length > 100) {
          return 'Task name must be less than 100 characters';
        }
        break;
      case 'equipId':
        if (view === 'create' || view === 'edit') {
          if (!value || value === -1) {
            return 'Equipment selection is required';
          }
        }
        break;
      case 'dueDate':
        if (!value || value.trim().length === 0) {
          return 'Due date is required';
        }
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today && task?.status !== "Completed" ) {
          return 'Due date cannot be in the past';
        }
        break;
    }
    return undefined;
  };

  //  Added validation for all fields
  const validateAllFields = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    
    const taskNameError = validateField('taskName', taskName);
    if (taskNameError) newErrors.taskName = taskNameError;
    
    const equipIdError = validateField('equipId', equipId);
    if (equipIdError) newErrors.equipId = equipIdError;
    
    const dueDateError = validateField('dueDate', dueDate);
    if (dueDateError) newErrors.dueDate = dueDateError;
    
    return newErrors;
  };

  //  Added field blur handler
  const handleFieldBlur = (fieldName: string, value: any) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  useEffect(() => 
   {
    if (task) {
      setTaskName(task.taskName || "");
      setEquipmentName(task.equipmentName || "");
      setPriority(task.priority || "Low");
      setStatus(task.status || "Pending");
      setDueDate(task.dueDate?.split("T")[0] || "");
      setAssignedTo(task.assignedTo || "");
    } else {
      setTaskName("");
      setEquipmentName("");
      setPriority("Low");
      setStatus("Pending");
      setDueDate("");
      setAssignedTo("");
    }
    setErrors({});
    setTouched({});
  }, [task, show]);

useEffect(() => {
  if (task?.equipmentName && (!equipId || equipId === -1) && equipmentOptions?.length) {
    const match = equipmentOptions.find(
      eq => eq.name?.toLowerCase() === task.equipmentName?.toLowerCase()
    );
    if (match) {
      setEquipId(match.equipmentId); 
      setEquipmentName(match.name);
    }
  }
}, [task?.equipmentName, equipmentOptions]);



  useEffect(() => {

    if(technicianOptions)
    {
      if (task && technicianOptions.length > 0) {
        const tech = technicianOptions.find(t => t.fullName === task.assignedTo);
        if (tech) {
          setTechnicianId(tech.id);       
          setoldTechId(tech.id);          
          setSelectedTechnicianName(tech.fullName);
        }
      }
   }
}, [task, technicianOptions]);

//  Updated handleSubmit with validation
const handleSubmit = () => {
  const validationErrors = validateAllFields();
  setErrors(validationErrors);
  
  // Mark all fields as touched to show errors
  setTouched({
    taskName: true,
    equipId: true,
    dueDate: true
  });
  
  // Don't submit if there are validation errors
  if (Object.keys(validationErrors).length > 0) {
    return;
  }

  if (view === "create" && onSubmitCreate) {
    const newTask: CreateTaskModel = {
      equipId,
      technicianId: technicianId || null,
      taskName,
      equipmentName,
      priority,
      status,
      dueDate,
    };
    onSubmitCreate(newTask);
  }  else if (view === "edit" && task && onSubmitEdit) {
      const updatedTask: Task = {
        ...task,
        taskName,
        equipmentName,
        priority,
        status,
        dueDate,
        assignedTo: selectedTechnicianName || "",
      };

      onSubmitEdit(updatedTask, oldTechId || "", technicianId || "");
    }
  onClose();
};

//  Added input style helper function
const getInputStyle = (fieldName: string, baseStyle: React.CSSProperties) => {
  const hasError = touched[fieldName] && errors[fieldName as keyof ValidationErrors];
  return {
    ...baseStyle,
    border: hasError ? "2px solid #ef4444" : "1px solid #d1d5db",
    backgroundColor: hasError ? "#fef2f2" : "white",
  };
};

const handleDelete = () =>
{

  if(task && onSubmitDelete)
  onSubmitDelete(task);
}

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "20px 24px",
            color: "white",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {view === "view" ? <Visibility /> : view === "edit" ? <Edit /> : <Add />}
            <h2 style={{ margin: 0 }}>
              {view === "view" ? "Task Details" : view === "edit" ? "Edit Task" : "Create Task"}
            </h2>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", color: "white" }}>
            <Close />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
          {view === "view" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Task Name
                </label>
                <div style={{ 
                  width: "100%", 
                  padding: "12px", 
                  backgroundColor: "#f9fafb", 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "8px", 
                  color: "#111827",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center"
                }}>
                  {taskName}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Equipment
                </label>
                <div style={{ 
                  width: "100%", 
                  padding: "12px", 
                  backgroundColor: "#f9fafb", 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "8px", 
                  color: "#111827",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center"
                }}>
                  {equipmentName}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Priority
                </label>
                <div style={{ 
                  width: "100%", 
                  padding: "12px", 
                  backgroundColor: "#f9fafb", 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "8px", 
                  color: "#111827",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center"
                }}>
                    {priority}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Status
                </label>
                <div style={{ 
                  width: "100%", 
                  padding: "12px", 
                  backgroundColor: "#f9fafb", 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "8px", 
                  color: "#111827",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center"
                }}>
                    {status}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Due Date
                </label>
                <div style={{ 
                  width: "100%", 
                  padding: "12px", 
                  backgroundColor: "#f9fafb", 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "8px", 
                  color: "#111827",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center"
                }}>
                  {dueDate}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Assigned To
                </label>
                <div style={{ 
                  width: "100%", 
                  padding: "12px", 
                  backgroundColor: "#f9fafb", 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "8px", 
                  color: "#111827",
                  minHeight: "44px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}>
                  {/*  Show technician name and email in view mode */}
                  {assignedTo ? (
                    <>
                      <div>{assignedTo}</div>
                      {technicianOptions?.find(tech => tech.email === task?.techEmail)?.email && (
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                          {technicianOptions.find(tech => tech.email === task?.techEmail)?.email}
                        </div>
                      )}
                    </>
                  ) : (
                    "Unassigned"
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Task Name *
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => {
                    setTaskName(e.target.value);
                    if (touched.taskName) {
                      const error = validateField('taskName', e.target.value);
                      setErrors(prev => ({ ...prev, taskName: error }));
                    }
                  }}
                  onBlur={() => handleFieldBlur('taskName', taskName)}
                  style={getInputStyle('taskName', { 
                    width: "100%", 
                    padding: "10px", 
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none"
                  })}
                  placeholder="Enter task name"
                />
                {touched.taskName && errors.taskName && (
                  <div style={{ 
                    color: "#ef4444", 
                    fontSize: "12px", 
                    marginTop: "4px",
                    fontWeight: "500"
                  }}>
                    {errors.taskName}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Equipment *
                </label>
                <select
                value={equipId ?? ""}
                onChange={(e) => {
                   const selected = equipmentOptions?.find(eq => eq.equipmentId === Number(e.target.value));
                    if (selected) {
                    setEquipId(selected.equipmentId);
                    setEquipmentName(selected.name);
                    } else {
                    setEquipId(-1);
                    setEquipmentName("");
                    }
                    
                    if (touched.equipId) {
                      const error = validateField('equipId', selected?.equipmentId || -1);
                      setErrors(prev => ({ ...prev, equipId: error }));
                    }
                }}
                onBlur={() => handleFieldBlur('equipId', equipId)}
                style={getInputStyle('equipId', { 
                  width: "100%", 
                  padding: "10px", 
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none"
                })}
                >
                <option value="">Select Equipment</option>
                {equipmentOptions?.map(eq => (
                    <option key={eq.equipmentId} value={eq.equipmentId}>{eq.name}</option>
                ))}
                </select>
                {touched.equipId && errors.equipId && (
                  <div style={{ 
                    color: "#ef4444", 
                    fontSize: "12px", 
                    marginTop: "4px",
                    fontWeight: "500"
                  }}>
                    {errors.equipId}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    outline: "none"
                  }}
                >
                  {["Low", "Medium", "High", "Urgent"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    outline: "none"
                  }}
                >
                  {["Pending", "OverDue", "Completed"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Due Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    if (touched.dueDate) {
                      const error = validateField('dueDate', e.target.value);
                      setErrors(prev => ({ ...prev, dueDate: error }));
                    }
                  }}
                  onBlur={() => handleFieldBlur('dueDate', dueDate)}
                  style={getInputStyle('dueDate', { 
                    width: "100%", 
                    padding: "10px", 
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none"
                  })}
                />
                {touched.dueDate && errors.dueDate && (
                  <div style={{ 
                    color: "#ef4444", 
                    fontSize: "12px", 
                    marginTop: "4px",
                    fontWeight: "500"
                  }}>
                    {errors.dueDate}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Assigned To
                </label>
                <select
                    value={technicianId ?? ""}
                    onChange={(e) =>
                    {
                        setoldTechId(technicianId);

                        const selected =  technicianOptions?.find(tech => tech.id === e.target.value);
                        setTechnicianId(selected?.id || "");
                        setSelectedTechnicianName(selected?.fullName || "");
                        setAssignedTo(selected?.fullName || "");
                    }}
                    style={{ 
                      width: "100%", 
                      padding: "10px", 
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      outline: "none"
                    }}
                    >
                    <option value="">Unassigned</option>
                    {technicianOptions?.map(tech => (
                        <option key={tech.id} value={tech.id}>
                          {tech.fullName} - {tech.email}
                        </option>
                    ))
                    }
                    </select>
                <div style={{ 
                  color: "#6b7280", 
                  fontSize: "12px", 
                  marginTop: "4px"
                }}>
                  Tasks can be left unassigned and assigned later
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px 24px",
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #e9ecef",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none",
              borderRadius: "6px", fontWeight: "bold", cursor: "pointer",
            }}
          >
            <Close style={{ fontSize: 16 }} /> Close
          </button>

          {view !== "view" && view !== "delete" ? (
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 20px", backgroundColor: "#667eea", color: "white", border: "none",
                borderRadius: "6px", fontWeight: "bold", cursor: "pointer",
              }}
            >
              {view === "edit" ? <Save style={{ fontSize: 16 }} /> : <Add style={{ fontSize: 16 }} />}
              {view === "edit" ? "Save Changes" : "Create"}
            </button>
          ) : (

            userRole?.includes("Admin")  && view === "delete"?
            <button
              onClick={handleDelete}
              style={{
                padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none",
                borderRadius: "6px", fontWeight: "bold", cursor: "pointer",
              }}
            >
              <Delete style={{ fontSize: 16 }} /> Delete
            </button>
            :
            <></>
            
          )}

        </div>
      </div>
    </div>
  );
};
