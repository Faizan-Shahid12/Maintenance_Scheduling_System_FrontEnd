import type React from "react"
import { useEffect, useState } from "react"
import { Close, Save, Add, Visibility, Edit, Delete } from "@mui/icons-material"
import type { DisplayScheduleModel } from "../../Models/MainScheduleModels/MainScheduleModel"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material"

 type ScheduleModalProps = {
  show: boolean
  onClose: () => void
  schedule: DisplayScheduleModel | null
  onSubmitEdit?: (updatedSchedule: DisplayScheduleModel) => void
  onSubmitDelete?: (schedule: DisplayScheduleModel) => void
  view: "view" | "edit" | "delete"
}

 type ValidationErrors = {
  scheduleName?: string
  startDate?: string
  endDate?: string
  interval?: string
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  show,
  onClose,
  schedule,
  onSubmitEdit,
  onSubmitDelete,
  view,
}) => {
  const [scheduleName, setScheduleName] = useState("")
  const [scheduleType, setScheduleType] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [interval, setInterval] = useState("")

  const [errors, setErrors] = useState<ValidationErrors>({})

  const userRole = localStorage.getItem("Role")

  const parseDaysFromInterval = (interval: string) => {
    const match = interval.split(".")[0]
    return match + " Days"
  }

  const validateScheduleName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "Schedule name is required"
    }
    const specialCharRegex = /[^a-zA-Z0-9\s]/
    if (specialCharRegex.test(name)) {
      return "Schedule name cannot contain special characters except spaces"
    }
    return undefined
  }

  const validateStartDate = (date: string): string | undefined => {
    if (!date) return "Start date is required"
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(date)

    if(schedule != undefined) {
      if(view === "edit" && new Date (schedule.startDate) <= selectedDate) return undefined
    }

    if (selectedDate < today) return "Start date cannot be in the past"
    return undefined
  }

  const validateEndDate = (endDateValue: string, startDateValue: string): string | undefined => {
    if (!endDateValue) return undefined
    if (!startDateValue) return "Please set start date first"
    const startDateObj = new Date(startDateValue)
    const endDateObj = new Date(endDateValue)
    if (endDateObj < startDateObj) return "End date must be after start date"
    return undefined
  }

  const validateInterval = (intervalValue: string): string | undefined => {
    if (scheduleType !== "Custom") return undefined
    if (!intervalValue.trim()) return "Interval is required for custom schedule"
    const match = intervalValue.match(/(\d+)/)
    if (!match) return "Please enter a valid number"
    const numericValue = Number.parseInt(match[1], 10)
    if (numericValue > 99) return "Interval cannot exceed 99 days"
    return undefined
  }

  const handleScheduleNameChange = (value: string) => {
    setScheduleName(value)
    const error = validateScheduleName(value)
    setErrors((prev) => ({ ...prev, scheduleName: error }))
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    const startError = validateStartDate(value)
    const endError = validateEndDate(endDate, value)
    setErrors((prev) => ({ ...prev, startDate: startError, endDate: endError }))
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
    const error = validateEndDate(value, startDate)
    setErrors((prev) => ({ ...prev, endDate: error }))
  }

  const handleIntervalChange = (value: string) => {
    const match = value.match(/(\d+)/)
    if (match) {
      const numericValue = Number.parseInt(match[1], 10)
      if (numericValue > 1000) {
        value = value.replace(/\d+/, "99")
      }
    }
    setInterval(value)
    const error = validateInterval(value)
    setErrors((prev) => ({ ...prev, interval: error }))
  }

  const isFormValid = (): boolean => {
    const nameError = validateScheduleName(scheduleName)
    const startError = validateStartDate(startDate)
    const endError = validateEndDate(endDate, startDate)
    const intervalError = validateInterval(interval)
    return !nameError && !startError && !endError && !intervalError
  }

  useEffect(() => {
    if (schedule) {
      setScheduleName(schedule.scheduleName || "")
      setScheduleType(schedule.scheduleType || "")
      setIsActive(schedule.isActive ?? true)
      setStartDate(schedule.startDate || "")
      setEndDate(schedule.endDate || "")
      setInterval(parseDaysFromInterval(schedule.interval) || "")
    } else {
      setScheduleName("")
      setScheduleType("")
      setIsActive(true)
      setStartDate("")
      setEndDate("")
      setInterval("")
    }
    setErrors({})
  }, [schedule, show])

  const handleSubmit = () => {
    if (!isFormValid()) {
      setErrors({
        scheduleName: validateScheduleName(scheduleName),
        startDate: validateStartDate(startDate),
        endDate: validateEndDate(endDate, startDate),
        interval: validateInterval(interval),
      })
      return
    }

    if (view === "edit" && schedule && onSubmitEdit) {
      const updatedSchedule: DisplayScheduleModel = {
        ...schedule,
        scheduleName,
        scheduleType,
        isActive,
        startDate,
        endDate: endDate || undefined,
        interval: interval.match(/(\d+)/)?.[1] + ".00:00:00",
      }
      onSubmitEdit(updatedSchedule)
    }
    onClose()
  }

  const handleDelete = () => {
    if (schedule && onSubmitDelete) onSubmitDelete(schedule)
  }

  useEffect(() => {
    switch (scheduleType) {
      case "Daily": setInterval("1"); break
      case "Weekly": setInterval("7"); break
      case "Monthly": setInterval("30"); break
      case "Yearly": setInterval("365"); break
      case "Custom": if (view === "edit") setInterval(""); break
      default: setInterval("")
    }
    setErrors((prev) => ({ ...prev, interval: undefined }))
  }, [scheduleType, view])

  if (!show) return null

  return (
    <Dialog open={show} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {view === "view" ? <Visibility /> : view === "edit" ? <Edit /> : <Delete />}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {view === "view" ? "Schedule Details" : view === "edit" ? "Edit Schedule" : "Delete Schedule"}
          </Typography>
        </Box>
        <IconButton onClick={onClose}><Close /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {view === "view" || view === "delete" ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="textSecondary">Schedule Name</Typography>
              <Typography variant="body1" sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: 1, bgcolor: '#f9fafb' }}>{scheduleName}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">Schedule Type</Typography>
              <Typography variant="body1" sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: 1, bgcolor: '#f9fafb' }}>{scheduleType}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">Status</Typography>
              <Typography variant="body1" sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: 1, bgcolor: '#f9fafb' }}>{isActive ? 'Active' : 'Inactive'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">Start Date</Typography>
              <Typography variant="body1" sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: 1, bgcolor: '#f9fafb' }}>{startDate}</Typography>
            </Box>
            {endDate && (
              <Box>
                <Typography variant="caption" color="textSecondary">End Date</Typography>
                <Typography variant="body1" sx={{ p: 1.5, border: '1px solid #e5e7eb', borderRadius: 1, bgcolor: '#f9fafb' }}>{endDate}</Typography>
              </Box>
            )}
            <Box>
              <Typography variant="caption" color="textSecondary">Interval</Typography>
              <TextField value={parseDaysFromInterval(interval)} onChange={(e) => { if (scheduleType === 'Custom') setInterval(e.target.value) }} InputProps={{ readOnly: scheduleType !== 'Custom' }} fullWidth />
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Schedule Name" value={scheduleName} onChange={(e) => handleScheduleNameChange(e.target.value)} error={!!errors.scheduleName} helperText={errors.scheduleName} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Schedule Type</InputLabel>
              <Select label="Schedule Type" value={scheduleType} onChange={(e) => setScheduleType(e.target.value)}>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={isActive ? 'true' : 'false'} onChange={(e) => setIsActive(e.target.value === 'true')}>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Start Date" type="date" value={startDate} onChange={(e) => handleStartDateChange(e.target.value)} error={!!errors.startDate} helperText={errors.startDate} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField label="End Date (Optional)" type="date" value={endDate} onChange={(e) => handleEndDateChange(e.target.value)} error={!!errors.endDate} helperText={errors.endDate} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField label="Interval" placeholder="e.g., 3 days" value={parseDaysFromInterval(interval)} onChange={(e) => handleIntervalChange(e.target.value)} error={!!errors.interval} helperText={errors.interval} fullWidth />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit"><Close sx={{ fontSize: 16 }} /> Close</Button>
        {view === 'edit' ? (
          <Button onClick={handleSubmit} variant="contained" disabled={!isFormValid()}><Save sx={{ fontSize: 16 }} /> Save Changes</Button>
        ) : userRole?.includes('Admin') && view === 'delete' ? (
          <Button onClick={handleDelete} color="error" variant="contained"><Delete sx={{ fontSize: 16 }} /> Delete</Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
