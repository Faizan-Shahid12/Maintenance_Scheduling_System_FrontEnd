import React, { useEffect, useState } from "react"
import 
{
  Close,
  Save,
  Person,
  Email,
  Phone,
  LocationOn,
  Lock,
  Visibility,
  VisibilityOff,
  Male,
  Female,
  Edit,
  Add,
  Delete,
  CheckCircle,
  Warning,
} from "@mui/icons-material"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from "@mui/material"

import type { CreateTechnicianModel, Technician } from "../../Models/Technician/TechnicianModel"
import { CheckEmail } from "../../Redux/Slicers/LoginSlicer"
import { useDispatch } from "react-redux"
import { type MyDispatch } from "../../Redux/Store"

interface UserModalProps {
  open: boolean
  onClose: () => void
  mode: "create" | "edit" | "view" | "delete"
  user: Technician | null
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  onSubmitCreate: (user : CreateTechnicianModel) => void
  onSubmitEdit: (user: Technician, password? : string) => void
  onDelete?: (userId: string) => void
}

interface ValidationErrors {
  fullName?: string
  email?: string
  phoneNumber?: string
  password?: string
  address?: string
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  mode,
  user,
  showPassword,
  setShowPassword,
  onSubmitCreate,
  onSubmitEdit,
  onDelete,
}) => {
  const isViewMode = mode === "view"
  const isCreateMode = mode === "create"
  const isEditMode = mode === "edit"
  const isDeleteMode = mode === "delete"

  const [formData, setFormData] = useState<CreateTechnicianModel>({
  fullName: "",
  email: "",
  phoneNumber: "",
  gender: "Male",
  address: "",
  password: "",
})

const dispatch = useDispatch<MyDispatch>()

useEffect(() => {
  if ((isEditMode || isViewMode) && user) {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      address: user.address,
      password: "",
    });
  } else if (isCreateMode) {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: "Male",
      address: "",
      password: "",
    });
  }
  setErrors({})
}, [user, isEditMode, isViewMode, isCreateMode]);

const [errors, setErrors] = useState<ValidationErrors>({})

//  Added validation functions
const validateEmail = (email: string): string | undefined => {
  if (!email) return "Email is required"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailTrimmed = email.trim();
  if (!emailRegex.test(emailTrimmed)) return "Please enter a valid email address"
  return undefined
}

const validatePhone = (phone: string): string | undefined => {
  if (!phone) return "Phone number is required"
  const phoneRegex = /^\d{10,11}$/
  if (!phoneRegex.test(phone.replace(/\D/g, ''))) return "Phone number must be 10-11 digits"
  return undefined
}

const validatePassword = (password: string): string | undefined => {
  if (isCreateMode && !password) return "Password is required"
  if (password && password.length < 8) return "Password must be at least 8 characters"
  if (password && !/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter"
  if (password && !/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter"
  if (password && !/(?=.*\d)/.test(password)) return "Password must contain at least one number"
  if (password && !/(?=.*[!@#$%^&*])/.test(password)) return "Password must contain at least one special character"
  return undefined
}

const validateFullName = (name: string): string | undefined => {
  if (!name) return "Full name is required"
  if (name.length < 2) return "Full name must be at least 2 characters"
  return undefined
}

  const validateAddress = (address: string): string | undefined => {
    if (!address.trim()) return 'Address is required';
    return undefined;
  };

  const validateField = (field: keyof CreateTechnicianModel, value: string) => {
    let error: string | undefined;
    
    switch (field) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phoneNumber':
        error = validatePhone(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
    }

    setErrors(prev => {
      if (field === 'email' && !error && prev.email === 'This email is already taken.') {
        return prev; 
      }
      return {
        ...prev,
        [field]: error,
      };
    });
  };
  const getModalTitle = () => {
    switch (mode) {
      case "create": return "Create User"
      case "edit": return "Edit User"
      case "view": return "User Details"
      case "delete": return "Delete User"
      default: return "User"
    }
  }

  const handleInputChange = (field: keyof CreateTechnicianModel, value: string) => 
  {
    setFormData((prev) => ({ ...prev, [field]: value }))
    validateField(field, value);
  }
  
  const handleBlur = (field: keyof CreateTechnicianModel, value: string) => {
    if (field === 'email') {
      const formatError = validateEmail(value)
      if (formatError) {
        setErrors((prev) => ({ ...prev, email: formatError }))
      }
      // If format is valid, do not overwrite a potential async uniqueness error here
      return
    }
    validateField(field, value)
  }

  const handleDelete = () =>
  {
    if (user && onDelete) 
    {
      onDelete(user.id)
      onClose()
    }
  }

 const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

 useEffect(() => {
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }
  if (isEditMode && user && formData.email === user.email) {
    setErrors(prev => ({
      ...prev,
      email: undefined,
    }));
    return;
  }
  
  if (formData.email && !validateEmail(formData.email)) {
    debounceRef.current = setTimeout(async () => 
    {
      var result =  await dispatch(CheckEmail(formData.email))
      
      if (result.payload === true) 
      {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already taken.",
        }));
      } 
      else 
      {
        setErrors((prev) => ({
          ...prev,
          email: undefined,
        }));
      }

      
    }, 1000);
  }
}, [formData.email]);

 const onSubmit = () => 
 {
   const newErrors: ValidationErrors = {}
  
   newErrors.fullName = validateFullName(formData.fullName)
   newErrors.email = validateEmail(formData.email)
   newErrors.phoneNumber = validatePhone(formData.phoneNumber)
   newErrors.address = validateAddress(formData.address)
  
   if (isCreateMode) {
    newErrors.password = validatePassword(formData.password)
   } else if (isEditMode && formData.password) {
    newErrors.password = validatePassword(formData.password)
   }
  
   setErrors(prev => ({
    ...newErrors,
    email: prev.email === "This email is already taken." ? prev.email : newErrors.email,
  }))
  
   const hasErrors = Object.values(newErrors).some(error => error !== undefined) || !!errors.email
  
   if (hasErrors) {
    return
   }

   if (isCreateMode) 
    {
     if (formData.fullName && formData.email && formData.phoneNumber && formData.password)
     {
       onSubmitCreate(formData); 
       onClose();
     } else {
       alert("Please fill in all required fields.");
     }
   } else if (isEditMode && user) {
    const updatedUser: Technician = {
      ...user,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      address: formData.address,
    };


    onSubmitEdit(updatedUser,formData.password);
    onClose();
  }
};

  if (!open) return null

  const titleIcon = isViewMode ? <Person color="primary" /> : isEditMode ? <Edit color="primary" /> : isDeleteMode ? <Delete color="error" /> : <Add color="primary" />

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {titleIcon}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {getModalTitle()}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
            <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
          {isViewMode || isDeleteMode ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {!isDeleteMode ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ color: '#666' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.fullName}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: '#666' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.email}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: '#666' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.phoneNumber}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {formData.gender === 'Male' ? <Male sx={{ color: '#666' }} /> : <Female sx={{ color: '#666' }} />}
                  <Box>
                    <Typography variant="caption" color="text.secondary">Gender</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.gender}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOn sx={{ color: '#666', mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Address</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.address}</Typography>
                  </Box>
                </Box>
              </>
            ) : (
              <Typography>Are you sure you want to delete this user?</Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Full Name"
                    value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              onBlur={(e) => handleBlur('fullName', e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
              fullWidth
            />

            <TextField
              label="Email"
                    value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={(e) => handleBlur('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />

            <TextField
              label="Phone Number"
                    value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              onBlur={(e) => handleBlur('phoneNumber', e.target.value)}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                label="Gender"
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={isCreateMode ? 'Password' : 'New Password (optional)'}
              type={showPassword ? 'text' : 'password'}
                      value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={(e) => handleBlur('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                onBlur={(e) => handleBlur('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              multiline
              minRows={3}
              fullWidth
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="outlined">
            Close
        </Button>
          {!isViewMode && !isDeleteMode ? (
          <Button onClick={onSubmit} variant="contained" startIcon={isEditMode ? <Save /> : <Add />}>
            {isEditMode ? 'Save Changes' : 'Create User'}
          </Button>
        ) : (
          user && isDeleteMode ? (
            <Button onClick={handleDelete} color="error" variant="contained" startIcon={<Delete />}>
                Delete User
            </Button>
          ) : null
          )}
      </DialogActions>
    </Dialog>
  )
}

export default UserModal
