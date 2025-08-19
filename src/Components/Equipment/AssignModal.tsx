import React, { useEffect, useState } from "react";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import { Close, Save, Assignment, Category, Business } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

 type AssignModalProps = {
  show: boolean;
  mode: "assignType" | "assignWorkshop";
  equipment: Equipment;
  workshops: WorkShop[];
  onClose: () => void;
  HandleType: (updatedEquipment: Equipment) => void;
  HandleWorkShop: (EquipId: number, WorkShopId: number) => void;
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
  const [typeError, setTypeError] = useState("");

  useEffect(() => {
    if (show) {
      setType(equipment.type || "");
      setWorkShopName(equipment.workShopName || "");
      setWorkShopLocation(equipment.workShopLocation || "");
      setTypeError("");
    }
  }, [show, equipment]);

  useEffect(() => {
    if (mode === "assignWorkshop") {
      const ws = workshops.find((w) => w.name === workShopName);
      setWorkShopLocation(ws?.location || "");
    }
  }, [workShopName, workshops, mode]);

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

  const handleSubmit = () => {
    if (mode === "assignType") {
      const isValid = validateType(type);
      if (!isValid) return;
    }

    let updated: Equipment = { ...equipment };

    if (mode === "assignWorkshop") {
      const selected = workshops.find((w) => w.name === workShopName);
      updated.workShopName = workShopName;
      updated.workShopLocation = selected?.location || "";
      HandleWorkShop(updated.equipmentId, selected?.workShopId || 0);
      return;
    }

    if (mode === "assignType") {
      updated.type = type;
    }
    HandleType(updated);
    onClose();
  };

  if (!show) return null;

  return (
    <Dialog open={show} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
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
            <FormControl fullWidth>
              <InputLabel>New Workshop</InputLabel>
              <Select label="New Workshop" value={workShopName} onChange={(e) => setWorkShopName(e.target.value)}>
                <MenuItem value=""><em>None</em></MenuItem>
                {workshops.map((w) => (
                  <MenuItem key={w.workShopId} value={w.name}>{w.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Workshop Location" value={workShopLocation} disabled fullWidth />
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
