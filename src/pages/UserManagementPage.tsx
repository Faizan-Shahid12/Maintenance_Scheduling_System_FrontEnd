"use client"
import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Fab,
  ButtonGroup,
  Skeleton,
} from "@mui/material"
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  Phone,
  LocationOn,
  People,
  Male,
  Female,
  AdminPanelSettings,
  Visibility,
} from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import { type MyDispatch, type RootState } from "../Redux/Store"
import type { CreateTechnicianModel, Technician } from "../Models/Technician/TechnicianModel"
import { ChangePassword, CreateNewTechnician, DeleteTechnician, GetAllTechniciansWithoutTask, UpdateTechnician } from "../Redux/Thunks/TechnicianThunk"
import UserModal from "../Components/User/UserModal"

// Styled components
const HeaderCard = ({ children }: { children: React.ReactNode }) => (
  <Paper
    sx={{
      backgroundColor: "#ffffff",
      color: "inherit",
      p: 3,
      mb: 3,
      borderRadius: 2,
      position: "relative",
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
    }}
  >
    {children}
  </Paper>
)

const StatsCard = ({ children }: { children: React.ReactNode }) => (
  <Paper
    sx={{
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 2,
      p: 2,
      display: "flex",
      alignItems: "center",
      gap: 2,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
      },
    }}
  >
    {children}
  </Paper>
)

const UserCard = ({ children}: { children: React.ReactNode;}) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: "0 8px 32px rgba(15,23,42,0.06)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      border: "1px solid #e5e7eb",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 16px 48px rgba(15,23,42,0.08)",
        borderColor: "#cbd5e1",
      },
    }}
  >
    {children}
  </Card>
)

const UserAvatar = ({ name, gender }: { name: string; gender: string }) => {
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (gender: string) => {
    return gender.toLowerCase() === 'female' 
      ? 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)'
      : 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)'
  }

  return (
    <Avatar 
      sx={{ 
        width: 56, 
        height: 56,
        background: getAvatarColor(gender),
        fontSize: '1.2rem',
        fontWeight: 'bold',
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
      }}
    >
      {getInitials(name)}
    </Avatar>
  )
}

export const UserManagementPage = () => 
{
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState<string>("All")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | "delete">("view")
  const [selectedUser, setSelectedUser] = useState<Technician | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const users = useSelector((state:RootState) => state.Technicians.TechniciansWithoutTask)
  const loading = useSelector((state:RootState) => state.Technicians.loading)
  const dispatch = useDispatch<MyDispatch>();

  useEffect( () =>
    {
      dispatch(GetAllTechniciansWithoutTask())
    },[dispatch])

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGender = genderFilter === "All" || user.gender === genderFilter
    
    return matchesSearch && matchesGender
  })

  // Calculate statistics
  const stats = {
    total: users.length,
    male: users.filter(u => u.gender === "Male").length,
    female: users.filter(u => u.gender === "Female").length,
  }

  // Handle delete
const handleDeleteUser = (userId: string) => 
{
    if(userId !== null && userId !== undefined && userId !== "")
    {
        dispatch(DeleteTechnician(userId));
    }
}

const handleCreateUser = (user : CreateTechnicianModel) =>
{
    if (user != null && user != undefined)
    {
        dispatch(CreateNewTechnician(user));
    }
}

const handleEditUser = (user : Technician, password1?:string) =>
{
    if (user != null && user != undefined)
    {
        dispatch(UpdateTechnician(user));

        if(password1 !== null && password1 !== "" && password1 !== undefined)
        {
            dispatch(ChangePassword({TechId: user.id, password: password1}));
        }
    }
}

  // Modal handlers
const handleCreateClick = () => 
{
  setModalMode("create")
  setSelectedUser(null)
  setShowPassword(false)
  setShowModal(true)
}

const handleEditClick = (user: Technician) =>
{
    setModalMode("edit")
    setSelectedUser(user)
    setShowPassword(false)
    setShowModal(true)
}

const handleViewClick = (user: Technician) => 
{
    setModalMode("view")
    setSelectedUser(user)
    setShowPassword(false)
    setShowModal(true)
}

const handleDeleteClick = (user: Technician) =>
{
    setModalMode("delete")
    setSelectedUser(user)
    setShowPassword(false)
    setShowModal(true)

}

const handleCloseModal = () => 
{
    setShowModal(false)
    setSelectedUser(null)
    setShowPassword(false)
    
}

   const renderActionButtons = (user: Technician) => {
    return (
      <Box sx={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 0.5,
        pt: 2,
        borderTop: '1px solid #e0e0e0'
      }}>
        <Button
          variant="text"
          size="small"
          startIcon={<Visibility sx={{ fontSize: 14 }} />}
          onClick={(e) => {
            e.stopPropagation()
            handleViewClick(user)
          }}
          sx={{ 
            fontSize: '0.7rem',
            minWidth: 'auto',
            px: 1,
            py: 0.5,
            color: '#2563eb',
            '&:hover': { 
              bgcolor: '#eff6ff',
              color: '#1d4ed8'
            }
          }}
        >
          View
        </Button>

        <Button
          variant="text"
          size="small"
          startIcon={<Edit sx={{ fontSize: 14 }} />}
          onClick={(e) => {
            e.stopPropagation()
            handleEditClick(user)
          }}
          sx={{ 
            fontSize: '0.7rem',
            minWidth: 'auto',
            px: 1,
            py: 0.5,
            color: '#2563eb',
            '&:hover': { 
              bgcolor: '#eff6ff',
              color: '#1d4ed8'
            }
          }}
        >
          Edit
        </Button>

        <Button
          variant="text"
          size="small"
          startIcon={<Delete sx={{ fontSize: 14 }} />}
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteClick(user)
          }}
          sx={{ 
            fontSize: '0.7rem',
            minWidth: 'auto',
            px: 1,
            py: 0.5,
            color: '#ef4444',
            '&:hover': { 
              bgcolor: '#fef2f2',
              color: '#dc2626'
            }
          }}
        >
          Delete
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <HeaderCard>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Paper
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: "#e0e7ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    boxShadow: "none",
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 28, color: "#2563eb" }} />
                </Paper>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    User Management
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Manage system users and their permissions
                  </Typography>
                  <Chip
                    label="Admin Dashboard"
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: "#eef2ff",
                      color: "#2563eb",
                      fontWeight: "bold"
                    }}
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateClick}
              >
                Add User
              </Button>
            </Box>

            {/* Statistics */}
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 2,
                '@media (max-width: 768px)': {
                  gap: 1
                }
              }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Box key={i} sx={{ 
                    flex: '1 1 180px', 
                    minWidth: { xs: '100%', sm: '150px', md: '180px' }
                  }}>
                    <Skeleton variant="rectangular" height={72} sx={{ borderRadius: 2 }} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                '@media (max-width: 768px)': {
                  gap: 1
                }
              }}>
                <Box sx={{ 
                  flex: "1 1 180px", 
                  minWidth: { xs: '100%', sm: '150px', md: '180px' }
                }}>
                  <StatsCard>
                    <Avatar sx={{ bgcolor: "#2196f3", width: 36, height: 36 }}>
                      <People sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {stats.total}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Total Users
                      </Typography>
                    </Box>
                  </StatsCard>
                </Box>
                <Box sx={{ 
                  flex: "1 1 180px", 
                  minWidth: { xs: '100%', sm: '150px', md: '180px' }
                }}>
                  <StatsCard>
                    <Avatar sx={{ bgcolor: "#2196f3", width: 36, height: 36 }}>
                      <Male sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {stats.male}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Male
                      </Typography>
                    </Box>
                  </StatsCard>
                </Box>
                <Box sx={{ 
                  flex: "1 1 180px", 
                  minWidth: { xs: '100%', sm: '150px', md: '180px' }
                }}>
                  <StatsCard>
                    <Avatar sx={{ bgcolor: "#e91e63", width: 36, height: 36 }}>
                      <Female sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {stats.female}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Female
                      </Typography>
                    </Box>
                  </StatsCard>
                </Box>
              </Box>
            )}
          </Box>
        </HeaderCard>

                {/* Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ flex: "1 1 150px", minWidth: "150px" }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={genderFilter}
                  label="Gender"
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <MenuItem value="All">All Genders</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
              <Typography variant="body2" color="textSecondary">
                {filteredUsers.length} of {users.length} users
              </Typography>
            </Box>
          </Box>
        </Paper>

                 {/* User Cards */}
         <Box sx={{ 
           display: "flex",
           flexWrap: "wrap",
           gap: 3,
           '@media (max-width: 768px)': {
             gap: 2
           }
         }}>
           {loading ? (
             Array.from({ length: 6 }).map((_, i) => (
               <Box key={i} sx={{ 
                 flex: '1 1 350px', 
                 minWidth: { xs: '100%', sm: '300px', md: '350px' }, 
                 maxWidth: { xs: '100%', sm: 'none', md: '400px' }
               }}>
                 <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
               </Box>
             ))
           ) : (
             filteredUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((user) => (
               <Box 
                 key={user.id}
                 sx={{
                   flex: "1 1 350px",
                   minWidth: { xs: '100%', sm: '300px', md: '350px' },
                   maxWidth: { xs: '100%', sm: 'none', md: '400px' }
                 }}
               >
                <UserCard>
                  <CardHeader
                    avatar={<UserAvatar name={user.fullName} gender={user.gender} />}
                    title={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                          {user.fullName}
                        </Typography>
                      </Box>
                    }
                    subheader={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                          {user.email}
                        </Typography>
                        <Chip
                          label={user.gender}
                          size="small"
                          icon={user.gender === "Male" ? <Male /> : <Female />}
                          sx={{
                            bgcolor: user.gender === "Male" ? "#e3f2fd" : "#fce4ec",
                            color: user.gender === "Male" ? "#1976d2" : "#c2185b",
                            fontWeight: "bold",
                            fontSize: "0.7rem"
                          }}
                        />
                      </Box>
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Phone sx={{ color: "#666", fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                          {user.phoneNumber}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <LocationOn sx={{ color: "#666", fontSize: 16, mt: 0.2 }} />
                        <Typography variant="body2" sx={{ fontWeight: "medium", lineHeight: 1.4 }}>
                          {user.address}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    {renderActionButtons(user)}
                  </CardContent>
                </UserCard>
              </Box>
            ))
          )}
        </Box>

        {/* Empty State */}
        {filteredUsers.length === 0 && !loading && (
          <Paper sx={{ p: 6, textAlign: "center", mt: 3 }}>
            <People sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No users found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              {searchTerm || genderFilter !== "All"
                ? "Try adjusting your filters or search terms"
                : "Create your first user to get started"}
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleCreateClick()}>
              Add User
            </Button>
          </Paper>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add user"
          sx={{ position: "fixed", bottom: 24, right: 24 }}
          onClick={() => handleCreateClick()}
        >
          <Add />
        </Fab>

        {/* User Modal */}
        <UserModal
        open={showModal}
        onClose={handleCloseModal}
        mode={modalMode}
        user={selectedUser}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmitCreate={handleCreateUser}
        onSubmitEdit={handleEditUser}
        onDelete={handleDeleteUser}
        />
      </Container>
    </Box>
  )
}
export default UserManagementPage

