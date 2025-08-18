import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Paper,
  Chip,
  IconButton,
} from "@mui/material"
import {
  PersonAdd,
  Close,
  Engineering,
  Star,
  WorkOutline,
  CheckCircle,
  Assignment,
  Schedule,
  Flag,
} from "@mui/icons-material"
import { TechnicianAvatar } from "../ui/task-management-components"
import type { Task } from "../../Models/TaskModels/TaskModel"
import type { TechnicianOptionModel } from "../../Models/Technician/TechnicianModel"

interface EnhancedAssignModalProps {
  showAssignModal: boolean
  handleCloseAssignModal: () => void
  selectedTask: Task | null
  TechOptions: TechnicianOptionModel[]
  handleAssignTask: (techId: string) => void
}

const EnhancedAssignModal: React.FC<EnhancedAssignModalProps> = ({
  showAssignModal,
  handleCloseAssignModal,
  selectedTask,
  TechOptions,
  handleAssignTask,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return { bgcolor: '#d32f2f', color: 'white' }
      case 'high': return { bgcolor: '#f57c00', color: 'white' }
      case 'medium': return { bgcolor: '#1976d2', color: 'white' }
      case 'low': return { bgcolor: '#388e3c', color: 'white' }
      default: return { bgcolor: '#757575', color: 'white' }
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Dialog 
      open={showAssignModal} 
      onClose={handleCloseAssignModal} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(145deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          color: "white",
          maxHeight: "90vh",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(145deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 50%, rgba(240, 147, 251, 0.95) 100%)",
            zIndex: 0,
          },
        },
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: "rgba(255,255,255,0.15)", 
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(20px)",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}>
        {/* Animated Background Elements */}
        <Box sx={{ 
          position: "absolute", 
          top: -30, 
          right: -30, 
          opacity: 0.1,
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
            "50%": { transform: "translateY(-20px) rotate(10deg)" },
          }
        }}>
          <Engineering sx={{ fontSize: 100 }} />
        </Box>
        
        <Box sx={{ 
          position: "absolute", 
          top: 20, 
          left: -20, 
          opacity: 0.08,
          animation: "pulse 4s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.1)" },
          }
        }}>
          <Star sx={{ fontSize: 60 }} />
        </Box>

        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Paper
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(56, 142, 60, 0.3) 100%)",
                  backdropFilter: "blur(15px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid rgba(76, 175, 80, 0.4)",
                  boxShadow: "0 8px 32px rgba(76, 175, 80, 0.3)",
                  animation: "glow 2s ease-in-out infinite alternate",
                  "@keyframes glow": {
                    "0%": { boxShadow: "0 8px 32px rgba(76, 175, 80, 0.3)" },
                    "100%": { boxShadow: "0 8px 32px rgba(76, 175, 80, 0.6)" },
                  }
                }}
              >
                <PersonAdd sx={{ color: "#4caf50", fontSize: 28 }} />
              </Paper>
              <Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: "bold", 
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  mb: 0.5
                }}>
                  Assign Task to Technician
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: "medium"
                }}>
                  Select the best technician for this task
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleCloseAssignModal}
              sx={{
                color: "white",
                bgcolor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.25)",
                  transform: "scale(1.1) rotate(90deg)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {selectedTask && (
            <Box sx={{ 
              p: 3, 
              bgcolor: "rgba(255,255,255,0.15)", 
              borderRadius: 3,
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,0.2)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "2px",
                background: "linear-gradient(90deg, #4caf50, #2196f3, #ff9800)",
              }
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                color: "white", 
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}>
                <Assignment sx={{ fontSize: 20 }} />
                Task Details
              </Typography>
              <Box sx={{ display: "grid", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" sx={{ 
                    color: "rgba(255,255,255,0.8)", 
                    fontWeight: "bold",
                    minWidth: "80px"
                  }}>
                    Name:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: "white", 
                    fontWeight: "medium",
                    flex: 1
                  }}>
                    {selectedTask.taskName}
                  </Typography>
                </Box>
                {selectedTask.equipmentName && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" sx={{ 
                      color: "rgba(255,255,255,0.8)", 
                      fontWeight: "bold",
                      minWidth: "80px"
                    }}>
                      Equipment:
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: "white", 
                      fontWeight: "medium",
                      flex: 1
                    }}>
                      {selectedTask.equipmentName}
                    </Typography>
                  </Box>
                )}
                {selectedTask.priority && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" sx={{ 
                      color: "rgba(255,255,255,0.8)", 
                      fontWeight: "bold",
                      minWidth: "80px"
                    }}>
                      Priority:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Flag sx={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }} />
                      <Chip
                        label={selectedTask.priority}
                        size="small"
                        sx={{
                          ...getPriorityColor(selectedTask.priority),
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                        }}
                      />
                    </Box>
                  </Box>
                )}
                {selectedTask.dueDate && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" sx={{ 
                      color: "rgba(255,255,255,0.8)", 
                      fontWeight: "bold",
                      minWidth: "80px"
                    }}>
                      Due Date:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Schedule sx={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }} />
                      <Typography variant="body2" sx={{ 
                        color: "white", 
                        fontWeight: "medium"
                      }}>
                        {formatDate(selectedTask.dueDate)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        p: 4, 
        position: "relative",
        zIndex: 1,
        background: "linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)"
      }}>
        <Typography variant="h6" sx={{ 
          mb: 3, 
          fontWeight: "bold",
          color: "#2c3e50",
          textAlign: "center",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #667eea, #764ba2)",
            borderRadius: "2px"
          }
        }}>
          Select a technician to assign this task to
        </Typography>

        <List sx={{ p: 0 }}>
          {TechOptions.map((tech, index) => (
            <ListItem
              key={tech.id}
              disablePadding
              sx={{ 
                mb: 2,
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                "@keyframes slideIn": {
                  "0%": { 
                    opacity: 0, 
                    transform: "translateX(-30px)" 
                  },
                  "100%": { 
                    opacity: 1, 
                    transform: "translateX(0)" 
                  },
                }
              }}
            >
              <ListItemButton
                onClick={() => handleAssignTask(tech.id)}
                sx={{
                  borderRadius: 3,
                  border: "2px solid transparent",
                  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    borderColor: "#4caf50",
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: "0 12px 40px rgba(76, 175, 80, 0.25)",
                    "&::before": {
                      opacity: 1,
                    },
                    "& .assign-indicator": {
                      opacity: 1,
                      transform: "scale(1)",
                    }
                  },
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  px: 3,
                  py: 2.5,
                }}
              >
                <ListItemAvatar sx={{ mr: 2 }}>
                  <Box sx={{ position: "relative" }}>
                    <TechnicianAvatar name={tech.fullName} specialization="" />
                    <Box 
                      className="assign-indicator"
                      sx={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        width: 20,
                        height: 20,
                        bgcolor: "#4caf50",
                        borderRadius: "50%",
                        border: "2px solid white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transform: "scale(0)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 2px 8px rgba(76, 175, 80, 0.4)"
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 12, color: "white" }} />
                    </Box>
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: "bold", 
                        color: "#2c3e50",
                        fontSize: "1.1rem"
                      }}>
                        {tech.fullName}
                      </Typography>
                      <Chip
                        label="Available"
                        size="small"
                        sx={{
                          background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                          color: "#2e7d32",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          border: "1px solid rgba(46, 125, 50, 0.2)",
                          boxShadow: "0 2px 8px rgba(46, 125, 50, 0.15)"
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ 
                        color: "#888", 
                        fontSize: "0.8rem",
                        fontWeight: "medium",
                        mb: 0.5
                      }}>
                        {tech.email}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <WorkOutline sx={{ fontSize: 16, color: "#666" }} />
                        <Typography variant="body2" sx={{ color: "#666", fontWeight: "medium" }}>
                          Ready for new assignments
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  ml: 2,
                  opacity: 0.7,
                  transition: "opacity 0.3s ease",
                  ".MuiListItemButton-root:hover &": {
                    opacity: 1,
                  }
                }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #45a049 0%, #388e3c 100%)",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <PersonAdd sx={{ mr: 0.5, fontSize: 16 }} />
                    { selectedTask?.techEmail === tech.email ? "Assigned" : "Assign"}
                  </Button>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {TechOptions.length === 0 && (
          <Paper sx={{ 
            p: 6, 
            textAlign: "center", 
            bgcolor: "transparent",
            background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)",
            borderRadius: 3,
            border: "2px dashed #e0e0e0",
            backdropFilter: "blur(10px)"
          }}>
            <Box sx={{ 
              animation: "bounce 2s infinite",
              "@keyframes bounce": {
                "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
                "40%": { transform: "translateY(-10px)" },
                "60%": { transform: "translateY(-5px)" },
              }
            }}>
              <PersonAdd sx={{ fontSize: 64, color: "#bbb", mb: 2 }} />
            </Box>
            <Typography variant="h5" sx={{ 
              color: "#666", 
              fontWeight: "bold",
              mb: 1
            }}>
              No Technicians Available
            </Typography>
            <Typography variant="body1" sx={{ 
              color: "#888",
              maxWidth: "300px",
              mx: "auto"
            }}>
              There are no technicians available to assign this task to at the moment.
            </Typography>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 4, 
        background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.2)",
        position: "relative",
        zIndex: 1,
      }}>
        <Button 
          onClick={handleCloseAssignModal} 
          variant="outlined"
          size="large"
          sx={{
            color: "white",
            borderColor: "rgba(255,255,255,0.4)",
            borderWidth: "2px",
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            backdropFilter: "blur(10px)",
            "&:hover": {
              borderColor: "white",
              bgcolor: "rgba(255,255,255,0.15)",
              transform: "scale(1.05)",
              boxShadow: "0 8px 25px rgba(255,255,255,0.2)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EnhancedAssignModal
