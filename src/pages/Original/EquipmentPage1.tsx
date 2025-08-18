// import React, { useEffect, useState } from "react";
// import { Table } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import type { MyDispatch, RootState } from "../../Redux/Store";
// import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
// import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
// import {
//   ArchiveEquipment,
//   AssignEquipmentToWorkShop,
//   AssignEquipmentType,
//   CreateNewEquipment,
//   DeleteEquipment,
//   EditEquipment,
//   GetAllEquipment,
//   GetArchivedEquipment,
//   UnArchiveEquipment,
// } from "../../Redux/Thunks/EquipmentThunk";
// import { EquipmentModal } from "../../Components/Equipment/EquipmentModal";
// import type { CreateEquipmentModel } from "../../Models/EquipmentModels/CreateEquipmentModel";
// import { GetWorkShopLocation } from "../../Redux/Thunks/WorkShopThunk";
// import { AssignModal } from "../../Components/Equipment/AssignModal";

// export const EquipmentPage: React.FC = () => {
//   const dispatch = useDispatch<MyDispatch>();
//   const equipmentData = useSelector((state: RootState) => state.Equipment.equipmentList);
//   const archivedEquipment = useSelector((state: RootState) => state.Equipment.archivedEquipment);

//   const [workshops, setWorkshops] = useState<WorkShop[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [viewMode, setViewMode] = useState<"create" | "edit" | "view">("view");
  
//   const [selectedEquipmentTable, setSelectedEquipmentTable] = useState<Equipment | null>(null);
  
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [assignMode, setAssignMode] = useState<"assignType" | "assignWorkshop">("assignType");

//   const [filterWorkshop, setFilterWorkshop] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const [filterName, setFilterName] = useState("");

//   useEffect(() => {
//     dispatch(GetAllEquipment());
//     dispatch(GetArchivedEquipment());
//     dispatch(GetWorkShopLocation())
//       .unwrap()
//       .then((result) => setWorkshops(result));
//   }, [dispatch]);

//   const ArchiveOrUnarchive = () => {
//     if (selectedEquipmentTable) {
//       if (!selectedEquipmentTable.isArchived) {
//         dispatch(ArchiveEquipment(selectedEquipmentTable));
//       } else {
//         dispatch(UnArchiveEquipment(selectedEquipmentTable));
//       }
//       setSelectedEquipmentTable(null);
//     }
//   };

//   const DeleteEquipment1 = () => {
//     if (selectedEquipmentTable) {
//       dispatch(DeleteEquipment(selectedEquipmentTable));
//       setSelectedEquipmentTable(null);
//     }
//   };

//   const CreateEquipment = (newEquipment: CreateEquipmentModel) => {
//     dispatch(CreateNewEquipment(newEquipment));
//     setSelectedEquipmentTable(null);
//   };

//   const updatedEquipment = (updatedData: Equipment) => {
//     if (selectedEquipmentTable) {
//       const updatedEquipment: Equipment = {
//         ...selectedEquipmentTable,
//         ...updatedData,
//       };
//       dispatch(EditEquipment(updatedEquipment));

//       let WorkShopId = workshops.find((w) => w.name === updatedEquipment.workShopName)?.workShopId || null;

//       dispatch(AssignEquipmentToWorkShop({equipmentId: updatedEquipment.equipmentId, workShopId: WorkShopId || 0}));
//       setSelectedEquipmentTable(null);
//     }
//   };

//   const AssignWorkShop = (EquipId: number, WorkShopId: number) => {
//     if (selectedEquipmentTable) 
//         {
//         dispatch(AssignEquipmentToWorkShop({ equipmentId: EquipId, workShopId: WorkShopId }));
//         setSelectedEquipmentTable(null);
//         }  
//     };

//   const AssignType = (updatedEquipment: Equipment) => {
//     if (selectedEquipmentTable) {
//         const updatedEquipment1: Equipment = {
//             ...selectedEquipmentTable,
//             type: updatedEquipment.type,
//         };
//         dispatch(AssignEquipmentType({equipmentId: updatedEquipment.equipmentId, type: updatedEquipment1.type}));
//         setSelectedEquipmentTable(null);
//         }
//     };

//   const handleAssignWorkshop = () =>
//     {
//         if (selectedEquipmentTable)
//         {
//             setAssignMode("assignWorkshop");
//             setShowAssignModal(true);
//         } else {
//             alert("Please select equipment first.");
//         }
//     };

//     const handleAssignType = () => 
//     {
//         if (selectedEquipmentTable) 
//         {
//             setAssignMode("assignType");
//             setShowAssignModal(true);
//         } else {
//             alert("Please select equipment first.");
//     }
//     };


//   const handleOpenModal = (mode: "create" | "edit" | "view") => {
//     if (mode === "create") {
//       setSelectedEquipmentTable(null);
//       setViewMode("create");
//       setShowModal(true);
//     } else {
//       if (selectedEquipmentTable) {
//         setViewMode(mode);
//         setShowModal(true);
//       } else {
//         alert("Please select equipment first.");
//       }
//     }
//   };

//   const filteredEquipment = equipmentData.filter((equipment) => {
//     const matchWorkshop = !filterWorkshop || equipment.workShopName === filterWorkshop;
//     const matchType = !filterType || equipment.type === filterType;
//     const matchName = !filterName || equipment.name.toLowerCase().includes(filterName.toLowerCase());
//     const notArchived = equipment.isArchived === false;
//   return matchWorkshop && matchType && matchName && notArchived;
//   });

//   const equipmentTypes = Array.from(new Set(equipmentData.map((e) => e.type).filter(Boolean)));

//   return (
//     <div className="equipment-page p-3">
//       <div className="mb-4 d-flex flex-wrap gap-3 align-items-end">
//         <div className="flex-grow-1">
//           <label className="form-label">Filter by Workshop</label>
//           <select
//             className="form-control"
//             value={filterWorkshop}
//             onChange={(e) => setFilterWorkshop(e.target.value)}
//           >
//             <option value="">All Workshops</option>
//             {workshops.map((w) => (
//               <option key={w.name} value={w.name}>
//                 {w.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex-grow-1">
//           <label className="form-label">Filter by Type</label>
//           <select
//             className="form-control"
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//           >
//             <option value="">All Types</option>
//             {equipmentTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex-grow-1">
//           <label className="form-label">Filter by Name</label>
//           <input
//             className="form-control"
//             type="text"
//             value={filterName}
//             onChange={(e) => setFilterName(e.target.value)}
//             placeholder="Enter equipment name"
//           />
//         </div>

//         <div>
//           <button
//             className="btn btn-outline-secondary"
//             onClick={() => {
//               setFilterWorkshop("");
//               setFilterType("");
//               setFilterName("");
//             }}
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Equipment Table */}
//       <Table striped bordered hover responsive>
//         <thead className="table-dark">
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Type</th>
//             <th>Location</th>
//             <th>Serial Number</th>
//             <th>Model</th>
//             <th>Archived</th>
//             <th>Workshop Name</th>
//             <th>Workshop Location</th>
//             <th>Actions</th> 
//           </tr>
//         </thead>
//         <tbody>
//           {filteredEquipment.map((equipment) => (
//             <tr
//               key={equipment.equipmentId}
//               onClick={() => setSelectedEquipmentTable(equipment)}
//               style={{
//                 backgroundColor:
//                   equipment.equipmentId === selectedEquipmentTable?.equipmentId
//                     ? "#007bff"
//                     : "",
//                 color:
//                   equipment.equipmentId === selectedEquipmentTable?.equipmentId
//                     ? "white"
//                     : "",
//                 cursor: "pointer",
//               }}
//             >
//               <td>{equipment.equipmentId}</td>
//               <td>{equipment.name}</td>
//               <td>{equipment.type}</td>
//               <td>{equipment.location}</td>
//               <td>{equipment.serialNumber}</td>
//               <td>{equipment.model}</td>
//               <td>{equipment.isArchived ? "Yes" : "No"}</td>
//               <td>{equipment.workShopName || "N/A"}</td>
//               <td>{equipment.workShopLocation || "N/A"}</td>

//               <td>
//                     <div className="btn-group" role="group">
//                     <button
//                         className="btn btn-sm btn-info"
//                         onClick={() => {
//                         setSelectedEquipmentTable(equipment);
//                         handleOpenModal("view");
//                         }}
//                     >
//                         View
//                     </button>
//                     <button
//                         className="btn btn-sm btn-warning"
//                         onClick={() => {
//                         setSelectedEquipmentTable(equipment);
//                         handleOpenModal("edit");
//                         }}
//                     >
//                         Edit
//                     </button>
//                     <button
//                         className="btn btn-sm btn-outline-dark"
//                         onClick={() => {
//                         setSelectedEquipmentTable(equipment);
//                         handleAssignType();
//                         }}
//                     >
//                         Type
//                     </button>
//                     <button
//                         className="btn btn-sm btn-outline-dark"
//                         onClick={() => {
//                         setSelectedEquipmentTable(equipment);
//                         handleAssignWorkshop();
//                         }}
//                     >
//                         Workshop
//                     </button>
//                     </div>
//                 </td>

//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <div className="d-flex flex-wrap gap-3 mt-3">
//         <button className="btn btn-primary" onClick={() => handleOpenModal("create")}>
//           Add New Equipment
//         </button>
//       </div>

//         <h4 className="mt-5">Archived Equipment</h4>
//         <Table striped bordered hover responsive>
//         <thead className="table-secondary">
//             <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Type</th>
//             <th>Location</th>
//             <th>Serial Number</th>
//             <th>Model</th>
//             <th>Archived</th> {/* Added for consistency */}
//             <th>Workshop Name</th>
//             <th>Workshop Location</th>
//             <th>Actions</th>
//             </tr>
//         </thead>
//         <tbody>
//             {archivedEquipment.map((equipment) => (
//             <tr
//                 key={equipment.equipmentId}
//                 onClick={() => setSelectedEquipmentTable(equipment)}
//                 style={{
//                 backgroundColor:
//                     equipment.equipmentId === selectedEquipmentTable?.equipmentId
//                     ? "#007bff"
//                     : "",
//                 color:
//                     equipment.equipmentId === selectedEquipmentTable?.equipmentId
//                     ? "white"
//                     : "",
//                 cursor: "pointer",
//                 }}
//             >
//                 <td>{equipment.equipmentId}</td>
//                 <td>{equipment.name}</td>
//                 <td>{equipment.type}</td>
//                 <td>{equipment.location}</td>
//                 <td>{equipment.serialNumber}</td>
//                 <td>{equipment.model}</td>
//                 <td>{equipment.isArchived ? "Yes" : "No"}</td>
//                 <td>{equipment.workShopName || "N/A"}</td>
//                 <td>{equipment.workShopLocation || "N/A"}</td>
//                 <td>
//                 <div className="btn-group" role="group">
//                     <button
//                     className="btn btn-sm btn-info"
//                     onClick={() => {
//                         setSelectedEquipmentTable(equipment);
//                         handleOpenModal("view");
//                     }}
//                     >
//                     View
//                     </button>
//                 </div>
//                 </td>
//             </tr>
//             ))}
//         </tbody>
//         </Table>



//       <EquipmentModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         equipment={selectedEquipmentTable!}
//         onArchiveToggle={ArchiveOrUnarchive}
//         handleDeleteClick={DeleteEquipment1}
//         onSubmitCreate={CreateEquipment}
//         onSubmitEdit={updatedEquipment}
//         view={viewMode}
//         workshops={workshops}
//       />

//       {selectedEquipmentTable && (
//         <AssignModal
//             show={showAssignModal}
//             onClose={() => setShowAssignModal(false)}
//             equipment={selectedEquipmentTable}
//             mode={assignMode}
//             workshops={workshops}
//             HandleType={AssignType}
//             HandleWorkShop={AssignWorkShop}
//         />
//         )}

//     </div>
//   );
// };
