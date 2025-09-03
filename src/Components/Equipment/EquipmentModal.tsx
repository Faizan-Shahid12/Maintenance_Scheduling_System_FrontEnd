import { useEffect, useState } from "react";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import type { CreateEquipmentModel } from "../../Models/EquipmentModels/CreateEquipmentModel";
import { Close, Save, Add, Archive, Unarchive, Delete, Visibility, Edit, Business } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Divider, Autocomplete } from "@mui/material";

import { GoogleMapsLocationPicker } from "../ui/GoogleMapsLocationPicker";
import { GoogleMapsDisplay } from "../ui/GoogleMapsDisplay";

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
  const [workShopLatitude, setWorkShopLatitude] = useState<number | undefined>(undefined);
  const [workShopLongitude, setWorkShopLongitude] = useState<number | undefined>(undefined);

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
  const lettersNumbersSpacesRegex = /^[a-zA-Z0-9\s]*$/;
    return lettersNumbersSpacesRegex.test(value);
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

  const handleWorkShopNameChange = (value: string | null) => {
    if (value) 
      {
        setWorkShopName(value);
        const ws = workshops.find((w) => w.name === value);
        if (ws) 
        {
          setWorkShopLocation(ws.location || "");
          setWorkShopLatitude(ws.latitude);
          setWorkShopLongitude(ws.longitude);
        }
    } 
    else 
    {
          setWorkShopName("");
          setWorkShopLocation("");
          setWorkShopLatitude(undefined);
          setWorkShopLongitude(undefined);
    }
  };

  const handleWorkShopLocationChange = (location: string, lat?: number, lng?: number, establishmentName?: string, fullAddress?: string) => {
    setWorkShopLocation(location);
    setWorkShopLatitude(lat);
    setWorkShopLongitude(lng);
    
    if (establishmentName && establishmentName.trim()) 
    {
      setWorkShopName(establishmentName.trim());

    } else if (location) 
    {
      const locationParts = location.split(',');
      const suggestedName = locationParts[0]?.trim() || 'New Workshop';
      setWorkShopName(suggestedName);

    }
  };

  useEffect(() => 
    {
      if (equipment)
      {
        setName(equipment.name || "");
        setType(equipment.type || "");
        setLocation(equipment.location || "");
        setSerialNumber(equipment.serialNumber || "");
        setModel(equipment.model || "");
        setWorkShopName(equipment.workShopName || "");
        setWorkShopLocation(equipment.workShopLocation || "");
        setWorkShopLatitude(equipment.workShopLatitude);
        setWorkShopLongitude(equipment.workShopLongitude);
      } 
      else 
      {
        setName("");
        setType("");
        setLocation("");
        setSerialNumber("");
        setModel("");
        setWorkShopName("");
        setWorkShopLocation("");
        setWorkShopLatitude(undefined);
        setWorkShopLongitude(undefined);
      }
      //  Clear errors when modal opens/closes
      setErrors({
        name: "",
        type: "",
        location: "",
        serialNumber: "",
        model: "",
      });
  }, [equipment, show, view]);

  const handleWorkshopChange = (name: string | null) => 
  {
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
      workShopLatitude,
      workShopLongitude,
    };

    if (view === "create" && onSubmitCreate) 
    {
      const tempWorkshop : WorkShop = {
         workShopId: selectedWorkshop?.workShopId ?? 0,
         name: workShopName,
         location: workShopLocation,
         latitude: workShopLatitude,
         longitude: workShopLongitude
      }
      const newEquipment: CreateEquipmentModel = {
        name,
        type,
        location,
        serialNumber,
        model,
        WorkShop: tempWorkshop
      };

      onSubmitCreate(newEquipment);
    } 
    else if (view === "edit" && equipment && onSubmitEdit) 
    {
      onSubmitEdit({ ...equipment, ...commonFields }); 
    }

    onClose();
  };

  const handleClose = () => {
    // Reset form when closing modal
    if (view === "create") {
      setName("");
      setType("");
      setLocation("");
      setSerialNumber("");
      setModel("");
      setWorkShopName("");
      setWorkShopLocation("");
      setWorkShopLatitude(undefined);
      setWorkShopLongitude(undefined);
      setErrors({
        name: "",
        type: "",
        location: "",
        serialNumber: "",
        model: "",
      });
    }
    onClose();
  };

  const handleArchiveClick = () => {
    onArchiveToggle();
    onClose();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {view === "view" ? <Visibility /> : view === "edit" ? <Edit /> : <Add />}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {view === "view" ? "Equipment Details" : view === "edit" ? "Edit Equipment" : "Create Equipment"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
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
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 700 }}>WORKSHOP NAME</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{workShopName || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 700 }}>WORKSHOP LOCATION</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{workShopLocation || 'N/A'}</Typography>
                </Box>
              </Box>
              
              {/* Show coordinates if available */}
              {(workShopLatitude !== undefined && workShopLongitude !== undefined) && (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 700 }}>LATITUDE</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{workShopLatitude.toFixed(6)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 700 }}>LONGITUDE</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{workShopLongitude.toFixed(6)}</Typography>
                  </Box>
                </Box>
              )}
              
              {/* Google Maps Display */}
              {workShopLocation && (
                <GoogleMapsDisplay
                  location={workShopLocation}
                  latitude={workShopLatitude}
                  longitude={workShopLongitude}
                  workshopName={workShopName}
                  height="250px"
                  showInfo={false}
                />
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Equipment Name" value={name} onChange={(e) => handleNameChange(e.target.value)} error={!!errors.name} helperText={errors.name} fullWidth />
            <TextField label="Equipment Type" value={type} onChange={(e) => handleTypeChange(e.target.value)} error={!!errors.type} helperText={errors.type} fullWidth />
            <TextField label="Location" value={location} onChange={(e) => handleLocationChange(e.target.value)} error={!!errors.location} helperText={errors.location} fullWidth />
            <TextField label="Serial Number" value={serialNumber} onChange={(e) => handleSerialNumberChange(e.target.value)} error={!!errors.serialNumber} helperText={errors.serialNumber} fullWidth />
            <TextField label="Model" value={model} onChange={(e) => handleModelChange(e.target.value)} error={!!errors.model} helperText={errors.model} fullWidth />

            <Autocomplete
              options={workshops.map(w => w.name)}
              value={workShopName}
              onChange={(_, newValue) => handleWorkshopChange(newValue)}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Workshop Name"
                  placeholder="Type to search existing workshops or enter a new name"
                  helperText={
                    workShopLocation && !workshops.find(w => w.name === workShopName)
                      ? "Workshop name suggested from map location"
                      : "Select from existing workshops or type a new workshop name"
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {params.InputProps.endAdornment}
                        {workShopLocation && !workshops.find(w => w.name === workShopName) && (
                          <Chip
                            label="Map Suggested"
                            size="small"
                            sx={{ 
                              bgcolor: '#e3f2fd', 
                              color: '#1976d2',
                              fontSize: '0.7rem',
                              height: '20px'
                            }}
                          />
                        )}
                      </Box>
                    )
                  }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <Box component="li" key={key} {...otherProps}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business sx={{ fontSize: 16, color: '#1976d2' }} />
                      <Typography>{option}</Typography>
                    </Box>
                  </Box>
                );
              }}
              noOptionsText="No existing workshops found. You can type a new workshop name."
              clearOnBlur={false}
              selectOnFocus
                         />
              {/* Google Maps Location Picker */}
              <GoogleMapsLocationPicker
                value={workShopLocation}
                onChange={handleWorkShopLocationChange}
                placeholder="Search for workshop location..."
                label="Workshop Location"
                error={false}
                helperText={
                  workShopName && !workshops.find(w => w.name === workShopName)
                    ? `Location for new workshop: ${workShopName}`
                    : "Select a location on the map or search for an address. The workshop name will be suggested based on the selected location."
                }
              />
           </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
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
