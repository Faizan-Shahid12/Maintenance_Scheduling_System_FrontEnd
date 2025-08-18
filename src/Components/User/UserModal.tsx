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

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
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
          email: "",
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
  
   setErrors(newErrors)
  
   const hasErrors = Object.values(newErrors).some(error => error !== undefined)
  
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

const getInputStyle = (hasError: boolean, isValid: boolean) => ({
  width: "100%", 
  padding: "12px 16px", 
  borderRadius: "8px", 
  border: hasError ? "2px solid #dc3545" : isValid ? "2px solid #28a745" : "2px solid #e0e0e0",
  fontSize: "1rem",
  fontWeight: "500",
  transition: "border-color 0.2s ease",
  backgroundColor: hasError ? "#fff5f5" : isValid ? "#f8fff8" : "#f8f9fa"
})

  if (!open) return null

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
          maxWidth: "700px",
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
            background: isViewMode 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
            padding: "20px 24px",
            color: "white",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isViewMode ? <Person /> : isEditMode ? <Edit /> : <Add />}
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              {getModalTitle()}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              border: "none", 
              background: "rgba(255,255,255,0.2)", 
              color: "white",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          >
            <Close />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
          {isViewMode || isDeleteMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <Person style={{ color: "#666", fontSize: 20 }} />
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#666", fontWeight: "500" }}>Full Name</p>
                  <p style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#2c3e50" }}>{formData.fullName}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <Email style={{ color: "#666", fontSize: 20 }} />
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#666", fontWeight: "500" }}>Email Address</p>
                  <p style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#2c3e50" }}>{formData.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <Phone style={{ color: "#666", fontSize: 20 }} />
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#666", fontWeight: "500" }}>Phone Number</p>
                  <p style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#2c3e50" }}>{formData.phoneNumber}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                {formData.gender === "Male" ? <Male style={{ color: "#666", fontSize: 20 }} /> : <Female style={{ color: "#666", fontSize: 20 }} />}
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#666", fontWeight: "500" }}>Gender</p>
                  <p style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#2c3e50" }}>{formData.gender}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <LocationOn style={{ color: "#666", fontSize: 20, marginTop: "2px" }} />
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#666", fontWeight: "500" }}>Address</p>
                  <p style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#2c3e50", lineHeight: 1.4 }}>{formData.address}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Full Name */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50", fontSize: "0.875rem" }}>
                  <Person style={{ fontSize: 16, marginRight: "6px", verticalAlign: "middle" }} />
                  Full Name *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    onBlur={(e) => handleBlur("fullName", e.target.value)}
                    style={getInputStyle(!!errors.fullName, !errors.fullName && formData.fullName.length > 0)}
                    placeholder="Enter full name"
                  />
                  {/*  Added success/error icons */}
                  {formData.fullName && !errors.fullName && (
                    <CheckCircle style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#28a745", fontSize: 20 }} />
                  )}
                </div>
                {/*  Added error message display */}
                {errors.fullName && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", color: "#dc3545", fontSize: "0.875rem" }}>
                    <Warning style={{ fontSize: 16 }} />
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50", fontSize: "0.875rem" }}>
                  <Email style={{ fontSize: 16, marginRight: "6px", verticalAlign: "middle" }} />
                  Email Address *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                    style={getInputStyle(!!errors.email, !errors.email && formData.email.length > 0)}
                    placeholder="Enter email address"
                  />
                  {/*  Added success/error icons */}
                  {formData.email && !errors.email && (
                    <CheckCircle style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#28a745", fontSize: 20 }} />
                  )}
                </div>
                {/*  Added error message display */}
                {errors.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", color: "#dc3545", fontSize: "0.875rem" }}>
                    <Warning style={{ fontSize: 16 }} />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50", fontSize: "0.875rem" }}>
                  <Phone style={{ fontSize: 16, marginRight: "6px", verticalAlign: "middle" }} />
                  Phone Number *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    onBlur={(e) => handleBlur("phoneNumber", e.target.value)}
                    style={getInputStyle(!!errors.phoneNumber, !errors.phoneNumber && formData.phoneNumber.length > 0)}
                    placeholder="Enter phone number"
                  />
                  {/*  Added success/error icons */}
                  {formData.phoneNumber && !errors.phoneNumber && (
                    <CheckCircle style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#28a745", fontSize: 20 }} />
                  )}
                </div>
                {/*  Added error message display */}
                {errors.phoneNumber && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", color: "#dc3545", fontSize: "0.875rem" }}>
                    <Warning style={{ fontSize: 16 }} />
                    {errors.phoneNumber}
                  </div>
                )}
              </div>

              {/* Password Field - Only for Create and Edit modes */}
              {(isCreateMode || isEditMode) && (
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50", fontSize: "0.875rem" }}>
                    <Lock style={{ fontSize: 16, marginRight: "6px", verticalAlign: "middle" }} />
                    {isCreateMode ? "Password *" : "New Password (optional)"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onBlur={(e) => handleBlur("password", e.target.value)}
                      style={{
                        ...getInputStyle(!!errors.password, !errors.password && formData.password.length > 0),
                        paddingRight: "50px"
                      }}
                      placeholder={isCreateMode ? "Enter password" : "Enter new password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "none",
                        background: "transparent",
                        color: "#666",
                        cursor: "pointer",
                        padding: "4px"
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </button>
                    {/*  Added success icon for password */}
                    {formData.password && !errors.password && (
                      <CheckCircle style={{ position: "absolute", right: "50px", top: "50%", transform: "translateY(-50%)", color: "#28a745", fontSize: 20 }} />
                    )}
                  </div>
                  {/*  Added error message display */}
                  {errors.password && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", color: "#dc3545", fontSize: "0.875rem" }}>
                      <Warning style={{ fontSize: 16 }} />
                      {errors.password}
                    </div>
                  )}
                </div>
              )}

              {/* Gender Selection */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50", fontSize: "0.875rem" }}>
                  <Person style={{ fontSize: 16, marginRight: "6px", verticalAlign: "middle" }} />
                  Gender *
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    style={{ 
                      width: "100%", 
                      padding: "12px 40px 12px 16px", 
                      borderRadius: "8px", 
                      border: "2px solid #e0e0e0",
                      fontSize: "1rem",
                      fontWeight: "500",
                      transition: "border-color 0.2s ease",
                      backgroundColor: "#f8f9fa",
                      appearance: "none",
                      backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 4 5\"><path fill=\"%23666\" d=\"M2 0L0 2h4zm0 5L0 3h4z\"/></svg>')",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "12px",
                      cursor: "pointer"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#4caf50"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  >
                    <option value="Male">👨 Male</option>
                    <option value="Female">👩 Female</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: '20px' }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50", fontSize: "0.875rem" }}>Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                onBlur={(e) => handleBlur('address', e.target.value)}
                rows={3}
                style={{
                  ...getInputStyle(!!errors.address, !errors.address && formData.address.length > 0),
                  borderColor: errors.address ? '#ef4444' : (!errors.address && formData.address.trim() ? '#10b981' : '#d1d5db'),
                  resize: 'none'
                }}
              />
              {/*  Added success icon for password */}
            <div>
                {formData.address && !errors.address && (
                  <CheckCircle style={{ position: "absolute", right: "50px", top: "50%", transform: "translateY(-50%)", color: "#28a745", fontSize: 20 }} />
                )}
              </div>
              {/*  Added error message display */}
              {errors.address && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", color: "#dc3545", fontSize: "0.875rem" }}>
                  <Warning style={{ fontSize: 16 }} />
                  {errors.address}
                </div>
              )}
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
              padding: "12px 24px", 
              backgroundColor: "#6c757d", 
              color: "white", 
              border: "none",
              borderRadius: "8px", 
              fontWeight: "bold", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1rem",
              transition: "background-color 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#5a6268"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#6c757d"}
          >
            <Close style={{ fontSize: 18 }} />
            Close
          </button>
          
          {!isViewMode && !isDeleteMode ? (
            <button
              onClick={onSubmit}
              style={{
                padding: "12px 24px", 
                backgroundColor: "#4caf50", 
                color: "white", 
                border: "none",
                borderRadius: "8px", 
                fontWeight: "bold", 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "1rem",
                transition: "background-color 0.2s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4caf50"}
            >
              {isEditMode ? <Save style={{ fontSize: 18 }} /> : <Add style={{ fontSize: 18 }} />}
              {isEditMode ? "Save Changes" : "Create User"}
            </button>
          ) : (
            user && isDeleteMode && (
              <button
                onClick={handleDelete}
                style={{
                  padding: "12px 24px", 
                  backgroundColor: "#dc3545", 
                  color: "white", 
                  border: "none",
                  borderRadius: "8px", 
                  fontWeight: "bold", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "1rem",
                  transition: "background-color 0.2s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c82333"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#dc3545"}
              >
                <Delete style={{ fontSize: 18 }} />
                Delete User
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default UserModal
