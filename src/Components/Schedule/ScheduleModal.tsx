import type React from "react"
import { useEffect, useState } from "react"
import { Close, Save, Add, Visibility, Edit, Delete } from "@mui/icons-material"
import type { DisplayScheduleModel } from "../../Models/MainScheduleModels/MainScheduleModel"

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
    // Allow only letters, numbers, and spaces
    const specialCharRegex = /[^a-zA-Z0-9\s]/
    if (specialCharRegex.test(name)) {
      return "Schedule name cannot contain special characters except spaces"
    }
    return undefined
  }

  const validateStartDate = (date: string): string | undefined => {
    if (!date) {
      return "Start date is required"
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(date)

    if(schedule != undefined)
    {

      if(view === "edit" && new Date (schedule.startDate) <= selectedDate)
      {
        return undefined;
      }
    }

    if (selectedDate < today) {
      return "Start date cannot be in the past"
    }
    return undefined
  }

  const validateEndDate = (endDateValue: string, startDateValue: string): string | undefined => {
    if (!endDateValue) {
      return undefined // End date is optional
    }
    if (!startDateValue) {
      return "Please set start date first"
    }

    const startDateObj = new Date(startDateValue)
    const endDateObj = new Date(endDateValue)

    if (endDateObj < startDateObj) {
      return "End date must be after start date"
    }
    return undefined
  }

  const validateInterval = (intervalValue: string): string | undefined => {
    if (scheduleType !== "Custom") {
      return undefined // Auto-generated intervals don't need validation
    }

    if (!intervalValue.trim()) {
      return "Interval is required for custom schedule"
    }

    // Extract number from interval string
    const match = intervalValue.match(/(\d+)/)
    if (!match) {
      return "Please enter a valid number"
    }

    const numericValue = Number.parseInt(match[1], 10)
    if (numericValue > 99) {
      return "Interval cannot exceed 99 days"
    }

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
    setErrors((prev) => ({
      ...prev,
      startDate: startError,
      endDate: endError,
    }))
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
      // Trigger validation for all fields
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
    if (schedule && onSubmitDelete) {
      onSubmitDelete(schedule)
    }
  }

  useEffect(() => {
    switch (scheduleType) {
      case "Daily":
        setInterval("1")
        break
      case "Weekly":
        setInterval("7")
        break
      case "Monthly":
        setInterval("30")
        break
      case "Yearly":
        setInterval("365")
        break
      case "Custom":
        if (view === "edit") {
          setInterval("")
        }
        break
      default:
        setInterval("")
    }
    setErrors((prev) => ({ ...prev, interval: undefined }))
  }, [scheduleType, view])

  const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => {
    if (!error) return null
    return (
      <div
        style={{
          color: "#dc3545",
          fontSize: "12px",
          marginTop: "4px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span>⚠</span>
        {error}
      </div>
    )
  }

  if (!show) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "600px",
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
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "20px 24px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {view === "view" ? <Visibility /> : view === "edit" ? <Edit /> : <Add />}
            <h2 style={{ margin: 0 }}>
              {view === "view" ? "Schedule Details" : view === "edit" ? "Edit Schedule" : "Delete Schedule"}
            </h2>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", color: "white" }}>
            <Close />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
          {view === "view" || view === "delete" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Schedule Name
                </label>
                <div
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#111827",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {scheduleName}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Schedule Type
                </label>
                <div
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#111827",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {scheduleType}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Status
                </label>
                <div
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#111827",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isActive ? "Active" : "Inactive"}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Start Date
                </label>
                <div
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#111827",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {startDate}
                </div>
              </div>

              {endDate && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    End Date
                  </label>
                  <div
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      color: "#111827",
                      minHeight: "44px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {endDate}
                  </div>
                </div>
              )}

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Interval
                </label>
                <input
                  type="text"
                  value={parseDaysFromInterval(interval)}
                  onChange={(e) => {
                    if (scheduleType === "Custom") 
                    {
                      setInterval(e.target.value)
                    }
                  }}
                  readOnly={true}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    outline: "none",
                    backgroundColor: scheduleType === "Custom" ? "white" : "#f9fafb",
                    color: scheduleType === "Custom" ? "#111827" : "#6b7280",
                  }}
                  placeholder={
                    scheduleType === "Custom"
                      ? "Enter custom interval (e.g., 15 days)"
                      : "Auto-generated based on schedule type"
                  }
                />
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Schedule Name
                </label>
                <input
                  type="text"
                  value={scheduleName}
                  onChange={(e) => handleScheduleNameChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${errors.scheduleName ? "#dc3545" : "#d1d5db"}`,
                    borderRadius: "8px",
                    outline: "none",
                  }}
                  placeholder="Enter schedule name"
                />
                <ErrorMessage error={errors.scheduleName} />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Schedule Type
                </label>
                <select
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                >
                  <option value="">Select Schedule Type</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Status
                </label>
                <select
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${errors.startDate ? "#dc3545" : "#d1d5db"}`,
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
                <ErrorMessage error={errors.startDate} />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${errors.endDate ? "#dc3545" : "#d1d5db"}`,
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
                <ErrorMessage error={errors.endDate} />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Interval
                </label>
                <input
                  type="text"
                  value={parseDaysFromInterval(interval)}
                  onChange={(e) => handleIntervalChange(e.target.value)}
                  readOnly={scheduleType === "Custom" ? false : true}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${errors.interval ? "#dc3545" : "#d1d5db"}`,
                    borderRadius: "8px",
                    backgroundColor: scheduleType === "Custom" ? "white" : "#f9fafb",
                    outline: "none",
                  }}
                  placeholder="e.g., 3 days"
                />
                <ErrorMessage error={errors.interval} />
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
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            <Close style={{ fontSize: 16 }} /> Close
          </button>

          {view === "edit" ? (
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              style={{
                padding: "10px 20px",
                backgroundColor: isFormValid() ? "#667eea" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: isFormValid() ? "pointer" : "not-allowed",
                opacity: isFormValid() ? 1 : 0.6,
              }}
            >
              {view === "edit" ? <Save style={{ fontSize: 16 }} /> : <Add style={{ fontSize: 16 }} />}
              {view === "edit" ? "Save Changes" : ""}
            </button>
          ) : userRole?.includes("Admin") && view === "delete" ? (
            <button
              onClick={handleDelete}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              <Delete style={{ fontSize: 16 }} /> Delete
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}
