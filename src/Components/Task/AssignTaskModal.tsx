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
      case 'urgent': return { bgcolor: '#ffebee', color: '#c62828' }
      case 'high': return { bgcolor: '#fff3e0', color: '#ef6c00' }
      case 'medium': return { bgcolor: '#e3f2fd', color: '#1976d2' }
      case 'low': return { bgcolor: '#e8f5e8', color: '#2e7d32' }
      default: return { bgcolor: '#eceff1', color: '#455a64' }
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
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAdd color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Assign Task to Technician</Typography>
        </Box>
        <IconButton onClick={handleCloseAssignModal} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {selectedTask && (
          <Paper sx={{ p: 2.5, mb: 2, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment fontSize="small" /> Task Details
            </Typography>
            <Box sx={{ display: 'grid', gap: 1.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>Name:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTask.taskName}</Typography>
              </Box>
              {selectedTask.equipmentName && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>Equipment:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTask.equipmentName}</Typography>
                </Box>
              )}
              {selectedTask.priority && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>Priority:</Typography>
                  <Chip label={selectedTask.priority} size="small" sx={{ ...getPriorityColor(selectedTask.priority), fontWeight: 700 }} />
                </Box>
              )}
              {selectedTask.dueDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>Due Date:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule sx={{ fontSize: 16, color: '#666' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(selectedTask.dueDate)}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, textAlign: 'center' }}>
          Select a technician to assign this task
        </Typography>

        <List sx={{ p: 0 }}>
          {TechOptions.map((tech) => (
            <ListItem key={tech.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleAssignTask(tech.id)}
                sx={{
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                  '&:hover': { bgcolor: '#f8fafc' },
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemAvatar sx={{ mr: 2 }}>
                  <TechnicianAvatar name={tech.fullName} specialization="" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {tech.fullName}
                      </Typography>
                      <Chip
                        label="Available"
                        size="small"
                        sx={{ bgcolor: '#e8f5e8', color: '#2e7d32', fontWeight: 700 }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <WorkOutline sx={{ fontSize: 16, color: '#666' }} />
                      <Typography variant="body2" color="textSecondary">
                        {tech.email}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ ml: 2 }}>
                  <Button variant="contained" size="small">
                    { selectedTask?.techEmail === tech.email ? 'Assigned' : 'Assign' }
                  </Button>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {TechOptions.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', border: '1px dashed #e0e0e0', borderRadius: 2 }}>
            <PersonAdd sx={{ fontSize: 48, color: '#bbb', mb: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#666', mb: 0.5 }}>
              No Technicians Available
            </Typography>
            <Typography variant="body2" color="textSecondary">
              There are no technicians available to assign this task to at the moment.
            </Typography>
          </Paper>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseAssignModal} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EnhancedAssignModal
