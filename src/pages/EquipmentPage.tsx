import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { MyDispatch, RootState } from "../Redux/Store";
import type { WorkShop } from "../Models/WorkShopModel/WorkShop";
import type { Equipment } from "../Models/EquipmentModels/EquipmentModel";
import {
  ArchiveEquipment,
  AssignEquipmentToWorkShop,
  AssignEquipmentType,
  CreateNewEquipment,
  DeleteEquipment,
  EditEquipment,
  GetAllEquipment,
  GetArchivedEquipment,
  UnArchiveEquipment,
} from "../Redux/Thunks/EquipmentThunk";
import { EquipmentModal } from "../Components/Equipment/EquipmentModal";
import type { CreateEquipmentModel } from "../Models/EquipmentModels/CreateEquipmentModel";
import { GetWorkShopLocation } from "../Redux/Thunks/WorkShopThunk";
import { AssignModal } from "../Components/Equipment/AssignModal";
import {
  EquipmentCard,
  EquipmentCardContent,
  EquipmentCardTitle,
  StatusBadge,
  ActionButton,
  SearchInput,
  FilterSelect,
  FieldLabel,
  FieldValue,
  StatCard,
  HeaderCard,
  FilterCard,
  EmptyState,
  SectionTitle,
  GridContainer,
  MainContainer,
  HeaderContent,
  StatsContainer,
  FilterContainer,
  FilterItem,
  ResultsCount,
  PlusIcon,
  EyeIcon,
  EditIcon,
  TagIcon,
  BuildingIcon,
  SearchIcon,
  CheckCircleIcon,
  ArchiveIcon,
  CategoryIcon
} from "../Components/ui/equipment-tree-component"
import { Box, Divider, Button } from "@mui/material"
import { Skeleton, CircularProgress } from "@mui/material"



export const EquipmentPage: React.FC = () => {
  const dispatch = useDispatch<MyDispatch>();
  const equipmentData = useSelector((state: RootState) => state.Equipment.equipmentList);
  const archivedEquipment = useSelector((state: RootState) => state.Equipment.archivedEquipment);
  const WorkShops = useSelector((state:RootState) => state.WorkShop.WorkShopList);
  const loading = useSelector((state: RootState) => state.Equipment.loading);

  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<"create" | "edit" | "view">("view");
  
  const [selectedEquipmentTable, setSelectedEquipmentTable] = useState<Equipment | null>(null);
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignMode, setAssignMode] = useState<"assignType" | "assignWorkshop">("assignType");

  const [filterWorkshop, setFilterWorkshop] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    dispatch(GetAllEquipment());
    dispatch(GetArchivedEquipment());
    dispatch(GetWorkShopLocation());
  }, [dispatch]);

  const ArchiveOrUnarchive = () => {
    if (selectedEquipmentTable) {
      if (!selectedEquipmentTable.isArchived) {
        dispatch(ArchiveEquipment(selectedEquipmentTable));
      } else {
        dispatch(UnArchiveEquipment(selectedEquipmentTable));
      }
      setSelectedEquipmentTable(null);
    }
  };

  const DeleteEquipment1 = () => {
    if (selectedEquipmentTable) {
      dispatch(DeleteEquipment(selectedEquipmentTable));
      setSelectedEquipmentTable(null);
    }
  };

  const CreateEquipment = (newEquipment: CreateEquipmentModel) => {
    dispatch(CreateNewEquipment(newEquipment));
    setSelectedEquipmentTable(null);
    setShowModal(false); // Close the modal after creating
  };

  const updatedEquipment = (updatedData: Equipment) => {
    if (selectedEquipmentTable) {
      const updatedEquipment: Equipment = {
        ...selectedEquipmentTable,
        ...updatedData,
      };
      dispatch(EditEquipment(updatedEquipment));

      let WorkShopId = WorkShops.find((w) => w.name === updatedEquipment.workShopName)?.workShopId || null;

      const TempWorkShop: WorkShop = {
        workShopId: WorkShopId ? WorkShopId : 0,
        name: updatedEquipment.workShopName,
        location: updatedEquipment.workShopLocation,
        latitude: updatedEquipment.workShopLatitude,
        longitude: updatedEquipment.workShopLongitude
      }

      dispatch(AssignEquipmentToWorkShop({equipmentId: updatedEquipment.equipmentId, workShop: TempWorkShop}));
      setSelectedEquipmentTable(null);
    }
  };

  const AssignWorkShop = (EquipId: number, WorkShop: WorkShop) => {
    if (selectedEquipmentTable) 
       {
        const TempWorkShop: WorkShop = {
          workShopId: WorkShop.workShopId ? WorkShop.workShopId : 0,
          name: WorkShop.name,
          location: WorkShop.location,
          latitude: WorkShop.latitude,
          longitude: WorkShop.longitude
        }
  
        dispatch(AssignEquipmentToWorkShop({ equipmentId: EquipId, workShop: TempWorkShop }));
        setSelectedEquipmentTable(null);
       }  
    };

  const AssignType = (updatedEquipment: Equipment) => {
    if (selectedEquipmentTable) {
        const updatedEquipment1: Equipment = {
            ...selectedEquipmentTable,
            type: updatedEquipment.type,
        };
        dispatch(AssignEquipmentType({equipmentId: updatedEquipment.equipmentId, type: updatedEquipment1.type}));
        setSelectedEquipmentTable(null);
        }
    };

const handleAssignWorkshop = (equipment?: Equipment) => {
    if (equipment) 
    {
      setSelectedEquipmentTable(equipment);
    }
    setAssignMode("assignWorkshop");
    setShowAssignModal(true);
  };

  const handleAssignType = (equipment?: Equipment) => {
    if (equipment) 
    {
      setSelectedEquipmentTable(equipment);
    }
    setAssignMode("assignType");
    setShowAssignModal(true);
  };

  const handleOpenModal = (mode: "create" | "edit" | "view", equipment?: Equipment) => {
    if (mode === "create") 
    {
      setSelectedEquipmentTable(null);
      setViewMode("create");
      setShowModal(true);
    } 
    else 
    {
      if (equipment) 
      {
        setSelectedEquipmentTable(equipment);
      }
      if (selectedEquipmentTable || equipment) 
      {
        setViewMode(mode);
        setShowModal(true);
      }
    }
  };

  const filteredEquipment = equipmentData.filter((equipment) => {
    const matchWorkshop = !filterWorkshop || equipment.workShopName === filterWorkshop;
    const matchType = !filterType || equipment.type === filterType;
    const matchName = !filterName || equipment.name.toLowerCase().includes(filterName.toLowerCase());
    const notArchived = equipment.isArchived === false;
  return matchWorkshop && matchType && matchName && notArchived;
  });

  const equipmentTypes = Array.from(new Set(equipmentData.map((e) => e.type).filter(Boolean)));

const EquipmentCardComponent: React.FC<{ equipment: Equipment; isArchived?: boolean }> = ({ equipment, isArchived = false }) => {

     const isSelected = equipment.equipmentId === selectedEquipmentTable?.equipmentId

    return (
      <EquipmentCard 
        isSelected={isSelected}
        onClick={() => setSelectedEquipmentTable(equipment)}
      >
        <EquipmentCardContent sx={{ p: 3 }}>
          {/* Header Section - Task Style */}
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <EquipmentCardTitle sx={{ mb: 0.5, lineHeight: 1.2 }}>{equipment.name}</EquipmentCardTitle>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <StatusBadge variant="secondary" sx={{ fontSize: '0.7rem' }}>
                  #{equipment.equipmentId}
                </StatusBadge>
                <StatusBadge variant="outline" sx={{ fontSize: '0.7rem' }}>
                  {equipment.type}
                </StatusBadge>
                {equipment.isArchived && (
                  <StatusBadge variant="destructive" sx={{ fontSize: '0.7rem' }}>
                    Archived
                  </StatusBadge>
                )}
              </Box>
            </Box>
          </Box>

          {/* Details Grid - Task Style */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
              <Box>
                <FieldLabel sx={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Location
                </FieldLabel>
                <FieldValue sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                  {equipment.location}
                </FieldValue>
              </Box>
              <Box>
                <FieldLabel sx={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Model
                </FieldLabel>
                <FieldValue sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                  {equipment.model}
                </FieldValue>
              </Box>
            </Box>
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
              <Box>
                <FieldLabel sx={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Serial Number
                </FieldLabel>
                <FieldValue sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                  {equipment.serialNumber}
                </FieldValue>
              </Box>
              <Box>
                <FieldLabel sx={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Workshop
                </FieldLabel>
                <FieldValue sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                  {equipment.workShopName || "Unassigned"}
                </FieldValue>
              </Box>
            </Box>

            {equipment.workShopLocation && (
              <Box sx={{ mb: 1.5 }}>
                <FieldLabel sx={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Workshop Location
                </FieldLabel>
                <FieldValue sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                  {equipment.workShopLocation}
                </FieldValue>
              </Box>
            )}
          </Box>

          {/* Actions Section - Task Style */}
          <Box sx={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: 0.5,
            pt: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            
            <ActionButton
              variant="text"
              size="small"
              startIcon={<EyeIcon sx={{ fontSize: 14 }} />}
              onClick={(e) => {
                e.stopPropagation()
                handleOpenModal("view",equipment)
              }}
              sx={{ 
                fontSize: '0.7rem',
                minWidth: 'auto',
                px: 1,
                py: 0.5,
                color: '#4a90e2',
                '&:hover': { 
                  bgcolor: '#f0f7ff',
                  color: '#2c5aa0'
                }
              }}
            >
              View
            </ActionButton>
            {isArchived && (
              <ActionButton
                variant="text"
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  if (!equipment.isArchived) {
                  dispatch(ArchiveEquipment(equipment));
                } else {
                  dispatch(UnArchiveEquipment(equipment));
                }
                }}
                sx={{ 
                  fontSize: '0.7rem',
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5,
                  color: '#4caf50',
                  '&:hover': { 
                    bgcolor: '#f1f8e9',
                    color: '#2e7d32'
                  }
                }}
              >
                UnArchive
              </ActionButton>
            )}

            {!isArchived && (
              <>
                <ActionButton
                  variant="text"
                  size="small"
                  startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenModal("edit",equipment)
                  }}
                  sx={{ 
                    fontSize: '0.7rem',
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    color: '#4a90e2',
                  '&:hover': { 
                    bgcolor: '#f0f7ff',
                    color: '#2c5aa0'
                  }
                  }}
                >
                  Edit
                </ActionButton>

                <ActionButton
                  variant="text"
                  size="small"
                  startIcon={<TagIcon sx={{ fontSize: 14 }} />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAssignType(equipment)
                  }}
                  sx={{ 
                    fontSize: '0.7rem',
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    color: '#4a90e2',
                  '&:hover': { 
                    bgcolor: '#f0f7ff',
                    color: '#2c5aa0'
                  }
                  }}
                >
                  Assign Type
                </ActionButton>

                <ActionButton
                  variant="text"
                  size="small"
                  startIcon={<BuildingIcon sx={{ fontSize: 14 }} />}
                  onClick={(e) => {
                    e.stopPropagation()                
                    handleAssignWorkshop(equipment)
                  }}
                  sx={{ 
                    fontSize: '0.7rem',
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    color: '#4a90e2',
                  '&:hover': { 
                    bgcolor: '#f0f7ff',
                    color: '#2c5aa0'
                  }
                  }}
                >
                  Assign Workshop
                </ActionButton>
              </>
            )}
          </Box>
        </EquipmentCardContent>
      </EquipmentCard>
    )
  }



  return (
    <MainContainer>
      {/* Enhanced Header Card */}
      <HeaderCard>
        <HeaderContent
          title="🏭 Equipment Management"
          subtitle="Manage your equipment inventory, assignments, and maintenance schedules"
          badge="Admin Dashboard"
          action={
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => handleOpenModal("create")}
            >
              Add New Equipment
            </Button>
          }
        />
        
        {/* Statistics */}
        <StatsContainer>
          <StatCard
            icon={<BuildingIcon sx={{ fontSize: 18 }} />}
            value={equipmentData.length}
            label="Total Equipment"
            color="#2196f3"
          />
          <StatCard
            icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
            value={filteredEquipment.length}
            label="Active Equipment"
            color="#4caf50"
          />
          <StatCard
            icon={<ArchiveIcon sx={{ fontSize: 18 }} />}
            value={archivedEquipment.length}
            label="Archived"
            color="#9e9e9e"
          />
          <StatCard
            icon={<CategoryIcon sx={{ fontSize: 18 }} />}
            value={equipmentTypes.length}
            label="Equipment Types"
            color="#ff9800"
          />
        </StatsContainer>
      </HeaderCard>

      {/* Filters */}
      <FilterCard>
        <FilterContainer>
          <FilterItem flex="1 1 250px">
            <SearchInput
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Search equipment..."
            />
          </FilterItem>
          <FilterItem>
            <FilterSelect
              value={filterWorkshop}
              onChange={(e) => setFilterWorkshop(e.target.value)}
              label="Workshop"
              options={WorkShops.map(w => w.name)}
            />
          </FilterItem>
          <FilterItem>
            <FilterSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Type"
              options={equipmentTypes}
            />
          </FilterItem>
          <ResultsCount
            current={filteredEquipment.length}
            total={equipmentData.length}
            label="equipment"
          />
        </FilterContainer>
      </FilterCard>

      {/* Active Equipment Section */}
      <Box sx={{ mb: 3 }}>
        <SectionTitle>Active Equipment</SectionTitle>

        {loading ? (
          <GridContainer>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" sx={{ mt: 1, width: '60%' }} />
                <Skeleton variant="text" sx={{ width: '40%' }} />
              </Box>
            ))}
          </GridContainer>
        ) : (
          <GridContainer>
            {filteredEquipment.sort((a, b) => b.equipmentId - a.equipmentId).map((equipment) => (
              <EquipmentCardComponent key={equipment.equipmentId} equipment={equipment} />
            ))}
          </GridContainer>
        )}

        {filteredEquipment.length === 0 && !loading && (
          <EmptyState 
            message="No equipment found matching the current filters."
            icon={<SearchIcon sx={{ fontSize: 64, color: "#ccc" }} />}
          />
        )}
      </Box>

      {/* Archived Equipment Section */}
      <Box>
        <SectionTitle>Archived Equipment</SectionTitle>
        
        {loading ? (
          <GridContainer>
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" sx={{ mt: 1, width: '50%' }} />
              </Box>
            ))}
          </GridContainer>
        ) : (
          <GridContainer>
            {archivedEquipment.map((equipment) => (
              <EquipmentCardComponent key={equipment.equipmentId} equipment={equipment} isArchived={true} />
            ))}
          </GridContainer>
        )}

        {archivedEquipment.length === 0 && !loading && (
          <EmptyState 
            message="No archived equipment found."
            icon={<ArchiveIcon sx={{ fontSize: 64, color: "#ccc" }} />}
          />
        )}
      </Box>

      {/* MODALS */}
       <EquipmentModal
        show={showModal}
        onClose={() => setShowModal(false)}
         equipment={selectedEquipmentTable!}
         onArchiveToggle={ArchiveOrUnarchive}
         handleDeleteClick={DeleteEquipment1}
         onSubmitCreate={CreateEquipment}
         onSubmitEdit={updatedEquipment}
         view={viewMode}
         workshops={WorkShops}
       />

       {selectedEquipmentTable && (
         <AssignModal
             show={showAssignModal}
             onClose={() => setShowAssignModal(false)}
             equipment={selectedEquipmentTable}
             mode={assignMode}
             workshops={WorkShops}
             HandleType={AssignType}
             HandleWorkShop={AssignWorkShop}
         />
         )}
    </MainContainer>
  )
}

export default EquipmentPage


