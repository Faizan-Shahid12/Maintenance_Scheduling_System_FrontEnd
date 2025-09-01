import { useEffect, useState } from "react";
import { Close, Save, Add, Visibility, Edit, Delete } from "@mui/icons-material";
import type { Task } from "../../Models/TaskModels/TaskModel";
import type { CreateTaskModel } from "../../Models/TaskModels/CreateTaskModel";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import type { TechnicianOptionModel } from "../../Models/Technician/TechnicianModel";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Chip } from "@mui/material";

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
  const handleFieldBlur = (fieldName: string, value: any) =>
  {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  useEffect(() => 
   {
    if (task) 
    {
      setTaskName(task.taskName || "");
      setEquipmentName(task.equipmentName || "");
      setPriority(task.priority || "Low");
      setStatus(task.status || "Pending");
      setDueDate(task.dueDate?.split("T")[0] || "");
      setAssignedTo(task.assignedTo || "");
    } 
    else
    {
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

useEffect(() => 
{
    if(technicianOptions)
    {
      if (task && technicianOptions.length > 0) 
      {
        const tech = technicianOptions.find(t => t.fullName === task.assignedTo);
        if (tech) 
        {
          setTechnicianId(tech.id);       
          setoldTechId(tech.id);          
          setSelectedTechnicianName(tech.fullName);
        }
      }
   }
}, [task, technicianOptions]);

//  Updated handleSubmit with validation
const handleSubmit = () => 
{
  const validationErrors = validateAllFields();
  setErrors(validationErrors);
  
  // Mark all fields as touched to show errors
  setTouched({
    taskName: true,
    equipId: true,
    dueDate: true
  });
  
  // Don't submit if there are validation errors
  if (Object.keys(validationErrors).length > 0) 
  {
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
  }  
  else if (view === "edit" && task && onSubmitEdit) 
  {
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

const handleDelete = () => 
{
  if(task && onSubmitDelete) onSubmitDelete(task);
};

if (!show) return null;

return (
  <Dialog open={show} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {view === "view" ? <Visibility /> : view === "edit" ? <Edit /> : view === "delete" ? <Delete /> : <Add />}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {view === "view" ? "Task Details" : view === "edit" ? "Edit Task" : view === "delete" ? "Delete Task" : "Create Task"}
        </Typography>
      </Box>
      <IconButton onClick={onClose}>
        <Close />
      </IconButton>
    </DialogTitle>

    <DialogContent dividers sx={{ pt: 2 }}>
      {view === "view" ? (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="textSecondary">Task Name</Typography>
            <Typography variant="body1" sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: 1, bgcolor: '#f9fafb' }}>{taskName}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Equipment</Typography>
            <Typography variant="body1" sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: 1, bgcolor: '#f9fafb' }}>{equipmentName}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Priority</Typography>
            <Chip label={priority} size="small" sx={{ alignSelf: 'start' }} />
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Status</Typography>
            <Chip label={status} size="small" sx={{ alignSelf: 'start' }} />
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Due Date</Typography>
            <Typography variant="body1" sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: 1, bgcolor: '#f9fafb' }}>{dueDate}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Assigned To</Typography>
            <Typography variant="body1" sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: 1, bgcolor: '#f9fafb' }}>{assignedTo || 'Unassigned'}</Typography>
          </Box>
        </Box>
      ) : view === "delete" ? (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Typography>Are you sure you want to delete this task?</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Task Name"
            value={taskName}
            onChange={(e) => {
              setTaskName(e.target.value);
              if (touched.taskName) setErrors(prev => ({ ...prev, taskName: validateField('taskName', e.target.value) }));
            }}
            onBlur={() => handleFieldBlur('taskName', taskName)}
            error={Boolean(touched.taskName && errors.taskName)}
            helperText={touched.taskName && errors.taskName}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Equipment</InputLabel>
            <Select
              label="Equipment"
              value={equipId === -1 ? "" : equipId}
              onChange={(e) => 
              {
                const selected = equipmentOptions?.find(eq => eq.equipmentId === Number(e.target.value));
                if (selected) 
                {
                  setEquipId(selected.equipmentId);
                  setEquipmentName(selected.name);
                } 
                else 
                {
                  setEquipId(-1);
                  setEquipmentName("");
                }

                if (touched.equipId) setErrors(prev => ({ ...prev, equipId: validateField('equipId', selected?.equipmentId || -1) }));
              }}
              onBlur={() => handleFieldBlur('equipId', equipId)}
              error={Boolean(touched.equipId && errors.equipId)}
            >
              <MenuItem value="">Select Equipment</MenuItem>
              {equipmentOptions?.map(eq => (
                <MenuItem
                  key={eq.equipmentId}
                  value={eq.equipmentId}
                  disabled={eq.isArchived && eq.equipmentId !== equipId}
                  style={eq.isArchived ? { color: "gray" } : {}}
                >
                  {eq.name} {eq.isArchived ? "(Archived)" : ""}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="error">{touched.equipId && errors.equipId}</Typography>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
              {['Low','Medium','High','Urgent'].map(p => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              {['Pending','OverDue','Completed'].map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (touched.dueDate) setErrors(prev => ({ ...prev, dueDate: validateField('dueDate', e.target.value) }));
            }}
            onBlur={() => handleFieldBlur('dueDate', dueDate)}
            error={Boolean(touched.dueDate && errors.dueDate)}
            helperText={touched.dueDate && errors.dueDate}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth>
            <InputLabel>Assigned To</InputLabel>
            <Select
              label="Assigned To"
              value={technicianId || ''}
              onChange={(e) => {
                setoldTechId(technicianId);
                const selected = technicianOptions?.find(tech => tech.id === e.target.value);
                setTechnicianId(selected?.id || "");
                setSelectedTechnicianName(selected?.fullName || "");
                setAssignedTo(selected?.fullName || "");
              }}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {technicianOptions?.map(tech => (
                <MenuItem key={tech.id} value={tech.id}>{tech.fullName} - {tech.email}</MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="textSecondary">Tasks can be left unassigned and assigned later</Typography>
          </FormControl>
        </Box>
      )}
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose} color="inherit" variant="outlined">
        <Close sx={{ fontSize: 16 }} /> Close
      </Button>

      {view !== "view" && view !== "delete" ? (
        <Button onClick={handleSubmit} variant="contained">
          {view === "edit" ? <Save sx={{ fontSize: 16 }} /> : <Add sx={{ fontSize: 16 }} />}
          {view === "edit" ? "Save Changes" : "Create"}
        </Button>
      ) : (
        userRole?.includes("Admin") && view === "delete" ? (
          <Button onClick={handleDelete} color="error" variant="contained">
            <Delete sx={{ fontSize: 16 }} /> Delete
          </Button>
        ) : null
      )}
    </DialogActions>
  </Dialog>
);
};
