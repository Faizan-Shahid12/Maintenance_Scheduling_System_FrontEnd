import { useEffect, useState } from "react";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import type { CreateEquipmentModel } from "../../Models/EquipmentModels/CreateEquipmentModel";
import { Close, Save, Add, Archive, Unarchive, Delete, Visibility, Edit, Business } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";

 type EquipmentModalProps = {
  show: boolean;
  onClose: () => void;
  equipment?: Equipment;
  onArchiveToggle: () => void;
  handleDeleteClick?: () => void;
  onSubmitCreate?: (equipment: CreateEquipmentModel) => void;
  onSubmitEdit?: (equipment: Equipment) => void;
    view: "view" | "edit" | "create";
  workshops: WorkShop[];
};

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  show,
  onClose,
  equipment,
  onArchiveToggle,
  handleDeleteClick,
  onSubmitCreate,
  onSubmitEdit,
  view,
  workshops,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [workShopName, setWorkShopName] = useState("");
  const [workShopLocation, setWorkShopLocation] = useState("");

  //  Added validation error states
  const [errors, setErrors] = useState({
    name: "",
    type: "",
    location: "",
    serialNumber: "",
    model: "",
  });

  //  Added validation functions
  const validateLettersOnly = (value: string) => {
    const lettersOnlyRegex = /^[a-zA-Z\s]*$/;
    return lettersOnlyRegex.test(value);
  };

  const validateRequired = (value: string) => {
    return value.trim().length > 0;
  };

  const validateField = (fieldName: string, value: string) => {
    let error = "";
    
    if (!validateRequired(value)) {
      error = "This field is required";
    } else if ((fieldName === "name" || fieldName === "type") && !validateLettersOnly(value)) {
      error = "Only letters and spaces are allowed";
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return error === "";
  };

  //  Added real-time validation handlers
  const handleNameChange = (value: string) => {
    setName(value);
    validateField("name", value);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    validateField("type", value);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    validateField("location", value);
  };

  const handleSerialNumberChange = (value: string) => {
    setSerialNumber(value);
    validateField("serialNumber", value);
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    validateField("model", value);
  };

  const handleWorkShopNameChange = (value: string) => {
    setWorkShopName(value);
    const ws = workshops.find((w) => w.name === value);
    setWorkShopLocation(ws?.location || "");
  };

  useEffect(() => {
    if (equipment) {
      setName(equipment.name || "");
      setType(equipment.type || "");
      setLocation(equipment.location || "");
      setSerialNumber(equipment.serialNumber || "");
      setModel(equipment.model || "");
      setWorkShopName(equipment.workShopName || "");
      setWorkShopLocation(equipment.workShopLocation || "");
    } else {
      setName("");
      setType("");
      setLocation("");
      setSerialNumber("");
      setModel("");
      setWorkShopName("");
      setWorkShopLocation("");
    }
    //  Clear errors when modal opens/closes
    setErrors({
      name: "",
      type: "",
      location: "",
      serialNumber: "",
      model: "",
    });
  }, [equipment, show]);

  const handleWorkshopChange = (name: string) => {
    handleWorkShopNameChange(name);
  };

  //  Updated handleSubmit to validate all fields before submission
  const handleSubmit = () => {
    const isNameValid = validateField("name", name);
    const isTypeValid = validateField("type", type);
    const isLocationValid = validateField("location", location);
    const isSerialNumberValid = validateField("serialNumber", serialNumber);
    const isModelValid = validateField("model", model);

    if (!isNameValid || !isTypeValid || !isLocationValid || !isSerialNumberValid || !isModelValid) {
      return;
    }

    const selectedWorkshop = workshops.find((w) => w.name === workShopName);
    const commonFields = {
      name,
      type,
      location,
      serialNumber,
      model,
      workShopName,
      workShopLocation,
      workShopId: selectedWorkshop?.workShopId ?? null,
    };

    if (view === "create" && onSubmitCreate) {
      const newEquipment: CreateEquipmentModel = {
        name,
        type,
        location,
        serialNumber,
        model,
        WorkShopId: selectedWorkshop?.workShopId ?? null,
      };

      onSubmitCreate(newEquipment);
    } else if (view === "edit" && equipment && onSubmitEdit) {
      onSubmitEdit({ ...equipment, ...commonFields }); 
    }

    onClose();
  };

  const handleArchiveClick = () => {
    onArchiveToggle();
    onClose();
  };

  return (
    <Dialog open={show} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {view === "view" ? <Visibility /> : view === "edit" ? <Edit /> : <Add />}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {view === "view" ? "Equipment Details" : view === "edit" ? "Edit Equipment" : "Create Equipment"}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {view === "view" ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: 1 }}>
              <Typography variant="caption" color="textSecondary">EQUIPMENT NAME</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{name}</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: 1 }}>
              <Typography variant="caption" color="textSecondary">EQUIPMENT TYPE</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{type}</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: 1 }}>
              <Typography variant="caption" color="textSecondary">LOCATION</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{location}</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: 1 }}>
              <Typography variant="caption" color="textSecondary">SERIAL NUMBER</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{serialNumber}</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: 1 }}>
              <Typography variant="caption" color="textSecondary">MODEL</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{model}</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Business sx={{ fontSize: 18, color: '#1976d2' }} />
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 700 }}>WORKSHOP INFORMATION</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 700 }}>WORKSHOP NAME</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{workShopName || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 700 }}>WORKSHOP LOCATION</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{workShopLocation || 'N/A'}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Equipment Name" value={name} onChange={(e) => handleNameChange(e.target.value)} error={!!errors.name} helperText={errors.name} fullWidth />
            <TextField label="Equipment Type" value={type} onChange={(e) => handleTypeChange(e.target.value)} error={!!errors.type} helperText={errors.type} fullWidth />
            <TextField label="Location" value={location} onChange={(e) => handleLocationChange(e.target.value)} error={!!errors.location} helperText={errors.location} fullWidth />
            <TextField label="Serial Number" value={serialNumber} onChange={(e) => handleSerialNumberChange(e.target.value)} error={!!errors.serialNumber} helperText={errors.serialNumber} fullWidth />
            <TextField label="Model" value={model} onChange={(e) => handleModelChange(e.target.value)} error={!!errors.model} helperText={errors.model} fullWidth />

            <FormControl fullWidth>
              <InputLabel>Workshop Name</InputLabel>
              <Select label="Workshop Name" value={workShopName} onChange={(e) => handleWorkshopChange(e.target.value)}>
                <MenuItem value=""><em>None</em></MenuItem>
                {workshops.map((w) => (
                  <MenuItem key={w.name} value={w.name}>{w.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Workshop Location" value={workShopLocation} disabled fullWidth />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          <Close sx={{ fontSize: 16 }} /> Close
        </Button>

        {view !== "view" && (
          <>
            {view === "edit" && (
              <>
                {equipment?.isArchived === false && (
                  <Button onClick={handleDeleteClick} color="error" variant="contained">
                    <Delete sx={{ fontSize: 16 }} /> Delete
                  </Button>
                )}
                <Button onClick={handleArchiveClick} variant="contained" sx={{ bgcolor: equipment?.isArchived ? '#22c55e' : '#f59e0b', '&:hover': { opacity: 0.9 } }}>
                  {equipment?.isArchived ? <Unarchive sx={{ fontSize: 16 }} /> : <Archive sx={{ fontSize: 16 }} />}
                  {equipment?.isArchived ? 'Unarchive' : 'Archive'}
                </Button>
              </>
            )}

            <Button onClick={handleSubmit} variant="contained">
              {view === "edit" ? <Save sx={{ fontSize: 16 }} /> : <Add sx={{ fontSize: 16 }} />}
              {view === "edit" ? "Save Changes" : "Create"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
};
