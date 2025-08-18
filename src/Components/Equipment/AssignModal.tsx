import React, { useEffect, useState } from "react";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import { Close, Save, Assignment, Category,Business } from "@mui/icons-material"

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

  useEffect(() => 
  {
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

  const handleSubmit = () => 
  {

      if (mode === "assignType") 
      {
        const isValid = validateType(type);
        if (!isValid)
        {
          return;
        }
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
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div
          style={{
            background:
              mode === "assignType"
                ? "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
                : "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
            padding: "20px 24px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {mode === "assignType" ? <Category style={{ fontSize: 24 }} /> : <Business style={{ fontSize: 24 }} />}
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
              {mode === "assignType" ? "Assign Equipment Type" : "Assign Workshop"}
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
          {/* Equipment Information */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <Assignment style={{ fontSize: 20, color: "#6c757d" }} />
              <div style={{ fontSize: "14px", color: "#6c757d", fontWeight: "bold" }}>EQUIPMENT INFORMATION</div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>ID</div>
                <div style={{ fontSize: "16px", fontWeight: "medium" }}>{equipment.equipmentId}</div>
              </div>

              <div>
                <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>NAME</div>
                <div style={{ fontSize: "16px", fontWeight: "medium" }}>{equipment.name}</div>
              </div>

              <div>
                <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>
                  LOCATION
                </div>
                <div style={{ fontSize: "16px", fontWeight: "medium" }}>{equipment.location}</div>
              </div>

              <div>
                <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>
                  SERIAL NUMBER
                </div>
                <div style={{ fontSize: "16px", fontWeight: "medium" }}>{equipment.serialNumber}</div>
              </div>

              <div>
                <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>MODEL</div>
                <div style={{ fontSize: "16px", fontWeight: "medium" }}>{equipment.model}</div>
              </div>

              <div>
                <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "bold", marginBottom: "4px" }}>
                  CURRENT TYPE
                </div>
                <div style={{ fontSize: "16px", fontWeight: "medium" }}>{equipment.type}</div>
              </div>
            </div>
          </div>

          {/* Assignment Section */}
          <div
            style={{
              padding: "20px",
              backgroundColor: mode === "assignType" ? "#fff3e0" : "#e3f2fd",
              borderRadius: "8px",
              border: mode === "assignType" ? "1px solid #ffcc02" : "1px solid #bbdefb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              {mode === "assignType" ? (
                <Category style={{ fontSize: 20, color: "#f57c00" }} />
              ) : (
                <Business style={{ fontSize: 20, color: "#1976d2" }} />
              )}
              <div
                style={{
                  fontSize: "14px",
                  color: mode === "assignType" ? "#f57c00" : "#1976d2",
                  fontWeight: "bold",
                }}
              >
                {mode === "assignType" ? "ASSIGN NEW TYPE" : "ASSIGN NEW WORKSHOP"}
              </div>
            </div>

            {mode === "assignType" && (
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                New Equipment Type
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `2px solid ${typeError ? "#f44336" : "#ffcc02"}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "border-color 0.2s",
                  backgroundColor: "white",
                }}
                value={type}
                onChange={(e) => {
                      const value = e.target.value;
                      setType(value);
                      validateType(value);
                    }}
                onFocus={(e) => (e.target.style.borderColor = typeError ? "#f44336" : "#f57c00")}
                onBlur={(e) => (e.target.style.borderColor = typeError ? "#f44336" : "#ffcc02")}
                placeholder="Enter new equipment type"
              />
              {typeError && (
                <div style={{
                  color: "#f44336",
                  fontSize: "12px",
                  marginTop: "4px",
                  fontWeight: "500"
                }}>
                  {typeError}
                </div>
              )}
            </div>
          )}

            {mode === "assignWorkshop" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                    New Workshop
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
                    onChange={(e) => setWorkShopName(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = "#1976d2")}
                    onBlur={(e) => (e.target.style.borderColor = "#bbdefb")}
                  >
                    <option value="">Select Workshop</option>
                    {workshops.map((w) => (
                      <option key={w.workShopId} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
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
                    placeholder="Location will be auto-filled"
                  />
                </div>
              </div>
            )}
          </div>
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
            Cancel
          </button>

          <button
            style={{
              padding: "10px 20px",
              backgroundColor: mode === "assignType" ? "#ff9800" : "#2196f3",
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = mode === "assignType" ? "#f57c00" : "#1976d2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = mode === "assignType" ? "#ff9800" : "#2196f3")
            }
          >
            <Save style={{ fontSize: 16 }} />
            Assign
          </button>

        </div>
      </div>
    </div>
  )
};
