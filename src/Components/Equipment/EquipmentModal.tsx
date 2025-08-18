import { useEffect, useState } from "react";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import type { CreateEquipmentModel } from "../../Models/EquipmentModels/CreateEquipmentModel";
import { Close, Save, Add, Archive, Unarchive, Delete, Visibility, Edit, Business } from "@mui/icons-material"

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
    const lettersOnlyRegex = /^[a-zA-Z\s]*$/;
    return lettersOnlyRegex.test(value);
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

  const handleWorkShopNameChange = (value: string) => {
    setWorkShopName(value);
    const ws = workshops.find((w) => w.name === value);
    setWorkShopLocation(ws?.location || "");
  };

  useEffect(() => {
    if (equipment) {
      setName(equipment.name || "");
      setType(equipment.type || "");
      setLocation(equipment.location || "");
      setSerialNumber(equipment.serialNumber || "");
      setModel(equipment.model || "");
      setWorkShopName(equipment.workShopName || "");
      setWorkShopLocation(equipment.workShopLocation || "");
    } else {
      setName("");
      setType("");
      setLocation("");
      setSerialNumber("");
      setModel("");
      setWorkShopName("");
      setWorkShopLocation("");
    }
    //  Clear errors when modal opens/closes
    setErrors({
      name: "",
      type: "",
      location: "",
      serialNumber: "",
      model: "",
    });
  }, [equipment, show]);

  const handleWorkshopChange = (name: string) => {
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
    };

    if (view === "create" && onSubmitCreate) {
      const newEquipment: CreateEquipmentModel = {
        name,
        type,
        location,
        serialNumber,
        model,
        WorkShopId: selectedWorkshop?.workShopId ?? null,
      };

      onSubmitCreate(newEquipment);
    } else if (view === "edit" && equipment && onSubmitEdit) {
      onSubmitEdit({ ...equipment, ...commonFields }); 
    }

    onClose();
  };

  const handleArchiveClick = () => {
    onArchiveToggle();
    onClose();
  };

  //  Added helper function to get input styles with error state
  const getInputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "12px",
    border: `2px solid ${hasError ? "#dc3545" : "#e9ecef"}`,
    borderRadius: "8px",
    fontSize: "14px",
    transition: "border-color 0.2s",
    backgroundColor: hasError ? "#fff5f5" : "white",
  });

  if (!show) return null;

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
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
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
            {view === "view" ? (
              <Visibility style={{ fontSize: 24 }} />
            ) : view === "edit" ? (
              <Edit style={{ fontSize: 24 }} />
            ) : (
              <Add style={{ fontSize: 24 }} />
            )}
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
              {view === "view" ? "Equipment Details" : view === "edit" ? "Edit Equipment" : "Create Equipment"}
            </h2>
          </div>
          <button
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
            }}
            onClick={onClose}
          >
            <Close style={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "24px",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {view === "view" ? (
            // ... existing code ...
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>
                    EQUIPMENT NAME
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "medium" }}>{name}</div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>
                    EQUIPMENT TYPE
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "medium" }}>{type}</div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>
                    LOCATION
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "medium" }}>{location}</div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>
                    SERIAL NUMBER
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "medium" }}>{serialNumber}</div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>
                    MODEL
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "medium" }}>{model}</div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>
                    ARCHIVED STATUS
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        backgroundColor: equipment?.isArchived ? "#dc3545" : "#28a745",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {equipment?.isArchived ? "Archived" : "Active"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "8px",
                  border: "1px solid #bbdefb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <Business style={{ fontSize: 20, color: "#1976d2" }} />
                  <div style={{ fontSize: "14px", color: "#1976d2", fontWeight: "bold" }}>WORKSHOP INFORMATION</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#1976d2", fontWeight: "bold", marginBottom: "4px" }}>
                      WORKSHOP NAME
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "medium" }}>{workShopName || "N/A"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#1976d2", fontWeight: "bold", marginBottom: "4px" }}>
                      WORKSHOP LOCATION
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "medium" }}>{workShopLocation || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                    Equipment Name *
                  </label>
                  <input
                    type="text"
                    style={getInputStyle(!!errors.name)}
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onFocus={(e) => !errors.name && (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => !errors.name && (e.target.style.borderColor = "#e9ecef")}
                  />
                  {/*  Added error message display */}
                  {errors.name && (
                    <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                    Equipment Type *
                  </label>
                  <input
                    type="text"
                    style={getInputStyle(!!errors.type)}
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    onFocus={(e) => !errors.type && (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => !errors.type && (e.target.style.borderColor = "#e9ecef")}
                  />
                  {/*  Added error message display */}
                  {errors.type && (
                    <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.type}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    style={getInputStyle(!!errors.location)}
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onFocus={(e) => !errors.location && (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => !errors.location && (e.target.style.borderColor = "#e9ecef")}
                  />
                  {/*  Added error message display */}
                  {errors.location && (
                    <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.location}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    style={getInputStyle(!!errors.serialNumber)}
                    value={serialNumber}
                    onChange={(e) => handleSerialNumberChange(e.target.value)}
                    onFocus={(e) => !errors.serialNumber && (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => !errors.serialNumber && (e.target.style.borderColor = "#e9ecef")}
                  />
                  {/*  Added error message display */}
                  {errors.serialNumber && (
                    <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.serialNumber}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                    Model *
                  </label>
                  <input
                    type="text"
                    style={getInputStyle(!!errors.model)}
                    value={model}
                    onChange={(e) => handleModelChange(e.target.value)}
                    onFocus={(e) => !errors.model && (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => !errors.model && (e.target.style.borderColor = "#e9ecef")}
                  />
                  {/*  Added error message display */}
                  {errors.model && (
                    <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.model}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                    Workshop Name *
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #bbdefb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "white",
                      transition: "border-color 0.2s",
                    }}
                    value={workShopName}
                    onChange={(e) => handleWorkshopChange(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  >
                    <option value="">Select Workshop</option>
                    {workshops.map((w) => (
                      <option key={w.name} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                  Workshop Location
                </label>
                <input
                  type="text"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#f8f9fa",
                    color: "#6c757d",
                  }}
                  value={workShopLocation}
                  disabled
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* ... existing code ... */}
        <div
          style={{
            padding: "20px 24px",
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #e9ecef",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 0.2s",
            }}
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5a6268")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6c757d")}
          >
            <Close style={{ fontSize: 16 }} />
            Close
          </button>
          
          <div style={{ display: "flex", gap: "12px" }}>
            {view !== "view" ? (
              <>
              {/* Archive / Unarchive + Delete */}
                {view === "edit" && (
                  <>
                  
                    {equipment?.isArchived === false && (
                      <button
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "background-color 0.2s",
                        }}
                        onClick={handleDeleteClick}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c82333")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
                      >
                        <Delete style={{ fontSize: 16 }} />
                        Delete
                      </button>
                    )}
                    <button
                      style={{
                        padding: "10px 20px",
                        backgroundColor: equipment?.isArchived ? "#28a745" : "#ffc107",
                        color: equipment?.isArchived ? "white" : "black",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "background-color 0.2s",
                      }}
                      onClick={handleArchiveClick}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = equipment?.isArchived ? "#218838" : "#e0a800")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = equipment?.isArchived ? "#28a745" : "#ffc107")
                      }
                    >
                      {equipment?.isArchived ? (
                        <Unarchive style={{ fontSize: 16 }} />
                      ) : (
                        <Archive style={{ fontSize: 16 }} />
                      )}
                      {equipment?.isArchived ? "Unarchive" : "Archive"}
                    </button>

                  </>
                )}
                {/* Save / Create Button */}
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onClick={handleSubmit}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5a67d8")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#667eea")}
                >
                  {view === "edit" ? <Save style={{ fontSize: 16 }} /> : <Add style={{ fontSize: 16 }} />}
                  {view === "edit" ? "Save Changes" : "Create"}
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  )
};
