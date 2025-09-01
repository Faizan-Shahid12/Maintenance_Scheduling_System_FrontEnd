import React, { useEffect, useState } from "react";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import { Close, Save, Assignment, Category, Business } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, TextField, Autocomplete, Chip } from "@mui/material";
import { GoogleMapsLocationPicker } from "../ui/GoogleMapsLocationPicker";

 type AssignModalProps = {
  show: boolean;
  mode: "assignType" | "assignWorkshop";
  equipment: Equipment;
  workshops: WorkShop[];
  onClose: () => void;
  HandleType: (updatedEquipment: Equipment) => void;
  HandleWorkShop: (EquipId: number, Workshop: WorkShop) => void;
};

export const AssignModal: React.FC<AssignModalProps> = ({
  show,
  mode,
  equipment,
  workshops,
  onClose,
  HandleType,
  HandleWorkShop,
}) => {
  const [type, setType] = useState(equipment.type || "");
  const [workShopName, setWorkShopName] = useState(equipment.workShopName || "");
  const [workShopLocation, setWorkShopLocation] = useState(equipment.workShopLocation || "");
  const [workShopLatitude, setWorkShopLatitude] = useState<number | undefined>(equipment.workShopLatitude);
  const [workShopLongitude, setWorkShopLongitude] = useState<number | undefined>(equipment.workShopLongitude);
  const [typeError, setTypeError] = useState("");
  const [workshopError, setWorkshopError] = useState("");

  useEffect(() => {
    if (show) {
      setType(equipment.type || "");
      setWorkShopName(equipment.workShopName || "");
      setWorkShopLocation(equipment.workShopLocation || "");
      setWorkShopLatitude(equipment.workShopLatitude);
      setWorkShopLongitude(equipment.workShopLongitude);
      setTypeError("");
      setWorkshopError("");
    }
  }, [show, equipment]);

  // Removed the problematic useEffect that was overriding coordinates

  const validateType = (value: string) => {
    if (!value.trim()) {
      setTypeError("Equipment type is required");
      return false;
    }
    const alphabetSpaceRegex = /^[a-zA-Z\s]*$/;
    if (!alphabetSpaceRegex.test(value)) {
      setTypeError("Equipment type can only contain letters and spaces");
      return false;
    }
    setTypeError("");
    return true;
  };

  const handleWorkShopNameChange = (newValue: string | null) => {
    if (newValue) {
      setWorkShopName(newValue);
      const ws = workshops.find((w) => w.name === newValue);
      if (ws) {
        // If selecting an existing workshop, use its location and coordinates
        setWorkShopLocation(ws.location || "");
        setWorkShopLatitude(ws.latitude);
        setWorkShopLongitude(ws.longitude);

      }
      // If it's a new workshop name, keep the current location and coordinates
    } else {
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
    
    // Always suggest a workshop name based on the establishment name or location
    // This ensures the dropdown name matches the selected location
    if (establishmentName && establishmentName.trim()) {
      // Use establishment name if available (e.g., "McDonald's", "City Hall")
      setWorkShopName(establishmentName.trim());

    } else if (location) {
      // Fallback to first part of address if no establishment name
      const locationParts = location.split(',');
      const suggestedName = locationParts[0]?.trim() || 'New Workshop';
      setWorkShopName(suggestedName);

    }
  };

  const handleSubmit = () => {
    if (mode === "assignType") {
      const isValid = validateType(type);
      if (!isValid) return;
      
      let updated: Equipment = { ...equipment };
      updated.type = type;
      HandleType(updated);
      onClose();
    }

    if (mode === "assignWorkshop") 
    {
      // Validate workshop data
      if (!workShopName || workShopName === "N/A" || !workShopLocation || workShopLocation === "N/A") {
        setWorkshopError("Please select a valid workshop and location");
        return;
      }
      
      setWorkshopError(""); // Clear error if validation passes

      const selected = workshops.find((w) => w.name === workShopName);
      
      // Create WorkShop object with current state values (like EquipmentModal does)
      const tempWorkshop: WorkShop = {
        workShopId: selected?.workShopId ?? 0,
        name: workShopName,
        location: workShopLocation,
        latitude: workShopLatitude,
        longitude: workShopLongitude
      };
      

      
      HandleWorkShop(equipment.equipmentId, tempWorkshop);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <Dialog open={show} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {mode === "assignType" ? <Category /> : <Business />}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {mode === "assignType" ? "Assign Equipment Type" : "Assign Workshop"}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <Box sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Assignment sx={{ fontSize: 18, color: '#64748b' }} />
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 700 }}>EQUIPMENT INFORMATION</Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="textSecondary">ID</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{equipment.equipmentId}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">NAME</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{equipment.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">LOCATION</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{equipment.location}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">SERIAL NUMBER</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{equipment.serialNumber}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">MODEL</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{equipment.model}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">CURRENT TYPE</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{equipment.type}</Typography>
            </Box>
          </Box>
        </Box>

        {mode === "assignType" ? (
          <Box>
            <TextField
              label="New Equipment Type"
              fullWidth
              value={type}
              onChange={(e) => {
                const value = e.target.value;
                setType(value);
                validateType(value);
              }}
              error={!!typeError}
              helperText={typeError}
            />
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {/* Single Integrated Google Maps Component */}
            <Box sx={{ p: 2, bgcolor: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Business sx={{ fontSize: 18, color: '#1976d2' }} />
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 700 }}>WORKSHOP ASSIGNMENT</Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Autocomplete
                  options={workshops.map(w => w.name)}
                  value={workShopName}
                  onChange={(_, newValue) => handleWorkShopNameChange(newValue)}
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
                                  bgcolor: '#ffffff', 
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

                                 <GoogleMapsLocationPicker
                   value={workShopLocation}
                   onChange={handleWorkShopLocationChange}
                   placeholder="Search for workshop location or click on the map..."
                   label="Workshop Location"
                   error={!!workshopError}
                   helperText={
                     workshopError || 
                     (workShopName && !workshops.find(w => w.name === workShopName)
                       ? `Location for new workshop: ${workShopName}`
                       : "Select a location on the map or search for an address. The workshop name will be suggested based on the selected location.")
                   }
                 />
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          <Close sx={{ fontSize: 16 }} /> Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          <Save sx={{ fontSize: 16 }} /> Assign
        </Button>
      </DialogActions>
    </Dialog>
  )
};
