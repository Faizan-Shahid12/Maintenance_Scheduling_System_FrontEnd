import React, { useEffect, useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Typography,
	Paper,
	Alert,
	Avatar,
	Tabs,
	Tab,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

import { useDispatch, useSelector } from "react-redux";
import { type MyDispatch, type RootState } from "../Redux/Store";
import { GetAllEquipment } from "../Redux/Thunks/EquipmentThunk";
import { DecodeBarCode, DownloadQRCodePDF } from "../Redux/Thunks/BarcodeThunk";
import { EquipmentModal } from "../Components/Equipment/EquipmentModal";
import type { Equipment } from "../Models/EquipmentModels/EquipmentModel";
import type { WorkShop } from "../Models/WorkShopModel/WorkShop";
import { GetWorkShopLocation } from "../Redux/Thunks/WorkShopThunk";
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
} from "../Components/ui/equipment-tree-component";

export const BarQrDecoderPage = () => {
	// State management
	const [decodedText, setDecodedText] = useState<string>("Not Found");
	const [errorText, setErrorText] = useState<string>("");
	const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
	const [isScannerActive, setIsScannerActive] = useState<boolean>(false);
	const [selectedEquipments, setSelectedEquipments] = useState<Equipment[]>([]);
	const [showEquipmentModal, setShowEquipmentModal] = useState<boolean>(false);
	const [scannedEquipment, setScannedEquipment] = useState<Equipment | null>(null);
	const [filterName, setFilterName] = useState("");
	const [filterType, setFilterType] = useState("");
	const [filterWorkshop, setFilterWorkshop] = useState("");
	const [activeMode, setActiveMode] = useState<"reading" | "generating">("reading");
	
	// Error handling states
	const [downloadError, setDownloadError] = useState<string>("");
	const [scannerError, setScannerError] = useState<string>("");
	const [isDownloading, setIsDownloading] = useState<boolean>(false);
	const [successMessage, setSuccessMessage] = useState<string>("");

	// Redux state
	const equipmentOptions = useSelector((state: RootState) => state.Equipment.equipmentList);
	const barCodeEquip = useSelector((state: RootState) => state.BarCode.Equipment);
	const barCodeReturnValue = useSelector((state: RootState) => state.BarCode.ReturnValue);
	const barCodeLoading = useSelector((state: RootState) => state.BarCode.loading);
	const barCodeError = useSelector((state: RootState) => state.BarCode.error);
	const workshops = useSelector((state: RootState) => state.WorkShop.WorkShopList);
	const dispatch = useDispatch<MyDispatch>();

	// ROI dimensions (percentage-based for responsive design)
	const boxW = 0.7; // 70% of view width
	const boxH = 0.4; // 40% of view height

	// Filtered equipment for display
	const filteredEquipment = equipmentOptions.filter((equipment) => {
		const matchWorkshop = !filterWorkshop || equipment.workShopName === filterWorkshop;
		const matchType = !filterType || equipment.type === filterType;
		const matchName = !filterName || equipment.name.toLowerCase().includes(filterName.toLowerCase());
		return matchWorkshop && matchType && matchName;
	});

	const equipmentTypes = Array.from(new Set(equipmentOptions.map((e) => e.type).filter(Boolean)));



	useEffect(() => {
		dispatch(GetAllEquipment());
		dispatch(GetWorkShopLocation());
	}, [dispatch]);

	// Scanner control functions
	const handleStartScanner = async () => {
		try {
			// Check for camera permissions
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			stream.getTracks().forEach(track => track.stop()); // Stop the test stream
			
			setIsScannerActive(true);
			setDecodedText("Scanner Active - Point camera at QR code");
			setErrorText("");
			setScannerError("");
		} catch (error) {
			const errorMessage = "Camera access denied. Please allow camera permissions and try again.";
			setScannerError(errorMessage);
			setErrorText(errorMessage);
			console.error("Camera permission error:", error);
		}
	};

	const handleStopScanner = () => {
		setIsScannerActive(false);
		setDecodedText("Scanner Stopped");
		setErrorText("");
	};

	// Scanner result handler
	const handleScanResult = (err: any, result: any) => {
		if (err) {
			const errorMessage = err.message || "Scanning error occurred";
			setScannerError(errorMessage);
			setErrorText(errorMessage);
			console.error("Scanner error:", err);
			return;
		}
		if (result) {
			setDecodedText(result.text || "");
			setScannerError(""); // Clear any previous scanner errors
			setErrorText("");
			dispatch(DecodeBarCode(result.text));
			
			// Check if equipment was found and automatically stop scanner
			// This prevents the Redux state from being cleared
			if (barCodeEquip) {
				setScannedEquipment(barCodeEquip);
				setShowEquipmentModal(true);
				// Automatically stop scanner to preserve Redux state
				setIsScannerActive(false);
				setDecodedText("Equipment found - Scanner stopped");
			}
		}
	};

	// Equipment selection handlers
	const handleEquipmentSelection = (event: any, newValue: Equipment[]) => {
		setSelectedEquipments(newValue);
	};

	// Equipment card click handler
	const handleEquipmentCardClick = (equipment: Equipment) => {
		const isSelected = selectedEquipments.some(eq => eq.equipmentId === equipment.equipmentId);
		if (isSelected) {
			// Remove from selection
			setSelectedEquipments(selectedEquipments.filter(eq => eq.equipmentId !== equipment.equipmentId));
		} else {
			// Add to selection
			setSelectedEquipments([...selectedEquipments, equipment]);
		}
	};



	// Download functionality with error handling
	const handleDownloadSelected = async () => {
		if (selectedEquipments.length === 0) {
			setDownloadError("Please select at least one equipment to download QR codes.");
			return;
		}

		setIsDownloading(true);
		setDownloadError("");

		try {
			// Extract equipment IDs
			const equipmentIds = selectedEquipments.map(eq => eq.equipmentId);
			
			
			// Call the Redux thunk to download PDF
			await dispatch(DownloadQRCodePDF(equipmentIds)).unwrap();

			// Success case
			
			const successMsg = `Successfully downloaded QR codes for ${selectedEquipments.length} equipment(s)`;
			setSuccessMessage(successMsg);
			setDecodedText(successMsg);
			
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during download.";
			setDownloadError(errorMessage);
			console.error("Download error:", error);
		} finally {
			setIsDownloading(false);
		}
	};

	// PDF download with error handling
	const handleDownloadAllPDF = async () => {
		if (equipmentOptions.length === 0) {
			setDownloadError("No equipment available to generate PDF.");
			return;
		}

		setIsDownloading(true);
		setDownloadError("");

		try {
			// Get all equipment IDs for the API call
			const allEquipmentIds = equipmentOptions.map(eq => eq.equipmentId);
			
			
			// Call the Redux thunk to download PDF for all equipment
			await dispatch(DownloadQRCodePDF(allEquipmentIds)).unwrap();

			// Success case
			
			const successMsg = `Successfully generated and downloaded PDF with ${equipmentOptions.length} equipment QR codes`;
			setSuccessMessage(successMsg);
			setDecodedText(successMsg);
			
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during PDF generation.";
			setDownloadError(errorMessage);
			console.error("PDF generation error:", error);
		} finally {
			setIsDownloading(false);
		}
	};

	// Equipment modal handlers
	const handleCloseEquipmentModal = () => {
		setShowEquipmentModal(false);
		setScannedEquipment(null);
	};

	const handleArchiveToggle = () => {
		// TODO: Implement archive toggle functionality
		
	};

	const handleOpenModal = (mode: "view", equipment?: Equipment) => {
		if (equipment) {
			setScannedEquipment(equipment);
			setShowEquipmentModal(true);
		}
	};

	// Menu handlers
	const handleMenuClose = () => {
		setMenuAnchorEl(null);
	};

	const handleModeChange = (mode: "reading" | "generating") => {
		setActiveMode(mode);
		setMenuAnchorEl(null);
		
		// Reset scanner when switching modes
		if (mode === "generating") {
			setIsScannerActive(false);
			setDecodedText("Scanner Stopped");
			setErrorText("");
			setScannerError("");
		}
	
			// Clear all errors and success messages when switching modes
	setDownloadError("");
	setSuccessMessage("");
	};

	const isMenuOpen = Boolean(menuAnchorEl);

	return (
		<MainContainer>
			{/* Enhanced Header Card */}
			<HeaderCard>
				<HeaderContent
					title={`📱 QR/Barcode Management - ${activeMode === "reading" ? "Reading Mode" : "Download Mode"}`}
					subtitle={activeMode === "reading" ? "Scan and decode QR codes to view equipment information" : "Download QR codes for selected equipment"}
					badge={activeMode === "reading" ? "Scanner Mode" : "Download Mode"}
					action={
						<IconButton aria-label="barcode menu" onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
							<MoreVertIcon />
						</IconButton>
					}
				/>
				
				{/* Statistics */}
				<StatsContainer>
					<StatCard
						icon={<QrCode2Icon sx={{ fontSize: 18 }} />}
						value={equipmentOptions.length}
						label="Total Equipment"
						color="#2196f3"
					/>
					<StatCard
						icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
						value={filteredEquipment.length}
						label="Filtered Equipment"
						color="#4caf50"
					/>
					<StatCard
						icon={<DownloadIcon sx={{ fontSize: 18 }} />}
						value={selectedEquipments.length}
						label="Selected for QR"
						color="#ff9800"
					/>
					<StatCard
						icon={<BuildingIcon sx={{ fontSize: 18 }} />}
						value={workshops.length}
						label="Workshops"
						color="#9c27b0"
					/>
				</StatsContainer>
			</HeaderCard>

			{/* Tab Navigation */}
			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs 
					value={activeMode} 
					onChange={(e, newValue) => handleModeChange(newValue)}
					aria-label="QR Code Management Tabs"
					sx={{
						'& .MuiTab-root': {
							minHeight: 48,
							fontWeight: 600,
							textTransform: 'none',
							fontSize: '1rem',
						},
						'& .Mui-selected': {
							color: '#1976d2',
						},
						'& .MuiTabs-indicator': {
							backgroundColor: '#1976d2',
							height: 3,
						}
					}}
				>
					<Tab 
						label={
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<QrCode2Icon fontSize="small" />
								Read QR Code
							</Box>
						} 
						value="reading" 
					/>
					<Tab 
						label={
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<DownloadIcon fontSize="small" />
								Download QR Codes
							</Box>
						} 
						value="generating" 
					/>
				</Tabs>
			</Box>

			{/* Filters - Only show in Generate mode */}
			{activeMode === "generating" && (
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
								options={workshops.map(w => w.name)}
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
							total={equipmentOptions.length}
							label="equipment"
						/>
					</FilterContainer>
				</FilterCard>
			)}

			{/* Main Content Grid */}
			{activeMode === "generating" ? (
				// Generating Mode - Full width for equipment selection and QR generation
				<Box>
					<SectionTitle>QR Code Download</SectionTitle>
					
					{/* Selected Equipment Summary */}
					{selectedEquipments.length > 0 && (
						<Card sx={{ mb: 3, border: '2px solid #1976d2', backgroundColor: '#f3f8ff' }}>
							<CardContent>
								<Stack spacing={2}>
									<Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<CheckCircleIcon color="primary" />
										Selected Equipment ({selectedEquipments.length})
									</Typography>
									<Stack direction="row" spacing={2} flexWrap="wrap">
										<Button 
											variant="contained" 
											startIcon={<DownloadIcon />}
											onClick={handleDownloadSelected}
											disabled={barCodeLoading || isDownloading}
											sx={{ 
												bgcolor: '#1976d2',
												'&:hover': { bgcolor: '#1565c0' },
												fontWeight: 600,
												px: 3,
												py: 1.5
											}}
										>
											{isDownloading ? "Downloading..." : "Download Selected QR Codes"}
										</Button>
										<Button 
											variant="outlined" 
											startIcon={<PictureAsPdfIcon />}
											onClick={handleDownloadAllPDF}
											disabled={barCodeLoading || isDownloading}
											sx={{ 
												borderColor: '#1976d2',
												color: '#1976d2',
												'&:hover': { 
													borderColor: '#1565c0',
													backgroundColor: '#f3f8ff'
												},
												fontWeight: 600,
												px: 3,
												py: 1.5
											}}
										>
											{isDownloading ? "Generating PDF..." : "Download All Equipment (PDF)"}
										</Button>
									</Stack>
									<Alert severity="info" sx={{ border: '1px solid #1976d2' }}>
										<strong>{selectedEquipments.length} equipment(s)</strong> selected for QR code download. 
										Click "Download Selected QR Codes" to generate QR codes for only the selected items, 
										or "Download All Equipment (PDF)" to generate a complete PDF with all equipment.
									</Alert>
								</Stack>
							</CardContent>
						</Card>
					)}

					{/* Download Options - Always Visible */}
					<Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
						<CardContent>
							<Stack spacing={2}>
								<Typography variant="h6" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<DownloadIcon color="primary" />
									Download Options
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Choose from the following download options:
								</Typography>
								<Stack direction="row" spacing={2} flexWrap="wrap">
									<Button 
										variant="contained" 
										startIcon={<DownloadIcon />}
										onClick={handleDownloadSelected}
										disabled={selectedEquipments.length === 0 || barCodeLoading || isDownloading}
										sx={{ 
											bgcolor: selectedEquipments.length === 0 ? '#ccc' : '#4caf50',
											'&:hover': { 
												bgcolor: selectedEquipments.length === 0 ? '#ccc' : '#45a049' 
											},
											fontWeight: 600,
											px: 3,
											py: 1.5
										}}
									>
										{isDownloading ? "Downloading..." : "Download Selected QR Codes"}
									</Button>
									<Button 
										variant="contained" 
										startIcon={<PictureAsPdfIcon />}
										onClick={handleDownloadAllPDF}
										disabled={barCodeLoading || isDownloading}
										sx={{ 
											bgcolor: '#ff9800',
											'&:hover': { bgcolor: '#f57c00' },
											fontWeight: 600,
											px: 3,
											py: 1.5
										}}
									>
										{isDownloading ? "Generating PDF..." : "Download All Equipment (PDF)"}
									</Button>
								</Stack>
								<Alert severity="info">
									<strong>Download Selected:</strong> Generates QR codes only for equipment you've selected below.<br/>
									<strong>Download All:</strong> Generates a complete PDF with QR codes for all equipment in the system.
								</Alert>
							</Stack>
						</CardContent>
					</Card>

					{/* Success Message Display */}
					{successMessage && (
						<Card sx={{ mb: 3, border: '1px solid #4caf50' }}>
							<CardContent>
								<Stack spacing={2}>
									<Typography variant="h6" color="success.main">
										✅ Success
									</Typography>
									<Alert severity="success" onClose={() => setSuccessMessage("")}>
										<Typography variant="body2">
											{successMessage}
										</Typography>
									</Alert>
								</Stack>
							</CardContent>
						</Card>
					)}

					{/* Error Display Section */}
					{(downloadError || barCodeError) && (
						<Card sx={{ mb: 3, border: '1px solid #f44336' }}>
							<CardContent>
								<Stack spacing={2}>
									<Typography variant="h6" color="error">
										⚠️ Error Occurred
									</Typography>
									{downloadError && (
										<Alert severity="error" onClose={() => setDownloadError("")}>
											<Typography variant="body2" fontWeight={500}>
												Download Error:
											</Typography>
											<Typography variant="body2">
												{downloadError}
											</Typography>
										</Alert>
									)}
									{barCodeError && (
										<Alert severity="error" onClose={() => {}}>
											<Typography variant="body2" fontWeight={500}>
												API Error:
											</Typography>
											<Typography variant="body2">
												{barCodeError}
											</Typography>
										</Alert>
									)}
									<Button 
										variant="outlined" 
										color="error"
										onClick={() => {
											setDownloadError("");
										}}
										sx={{ alignSelf: 'flex-start' }}
									>
										Dismiss All Errors
									</Button>
								</Stack>
							</CardContent>
						</Card>
					)}

					{/* Equipment List */}
					<SectionTitle>Select Equipment for QR Code Download</SectionTitle>
					{filteredEquipment.length === 0 ? (
						<EmptyState 
							message="No equipment found matching the current filters."
							icon={<SearchIcon sx={{ fontSize: 64, color: "#ccc" }} />}
						/>
					) : (
						<GridContainer>
							{filteredEquipment.map((equipment) => {
								const isSelected = selectedEquipments.some(eq => eq.equipmentId === equipment.equipmentId);
								return (
									<Box
										key={equipment.equipmentId}
										onClick={() => handleEquipmentCardClick(equipment)}
										sx={{
											cursor: 'pointer',
											transition: 'all 0.3s ease-in-out',
											border: isSelected ? '3px solid #1976d2' : '1px solid #e0e0e0',
											backgroundColor: isSelected ? '#f3f8ff' : 'white',
											borderRadius: 2,
											overflow: 'hidden',
											position: 'relative',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
												borderColor: isSelected ? '#1976d2' : '#1976d2',
												backgroundColor: isSelected ? '#e3f2fd' : '#fafafa'
											}
										}}
									>
										<EquipmentCard>
										<EquipmentCardContent sx={{ p: 2 }}>
											{/* Enhanced Selection Indicator */}
											{isSelected && (
												<Box sx={{ 
													position: 'absolute', 
													top: 12, 
													right: 12, 
													zIndex: 10,
													backgroundColor: '#1976d2',
													borderRadius: '50%',
													width: 32,
													height: 32,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: 'white',
													boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
													animation: 'pulse 2s infinite',
													'@keyframes pulse': {
														'0%': { transform: 'scale(1)' },
														'50%': { transform: 'scale(1.1)' },
														'100%': { transform: 'scale(1)' }
													}
												}}>
													<CheckCircleIcon sx={{ fontSize: 20 }} />
												</Box>
											)}

											{/* Header Section */}
											<Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between", mb: 1.5 }}>
												<Box sx={{ flex: 1 }}>
													<EquipmentCardTitle sx={{ 
														mb: 0.5, 
														lineHeight: 1.2,
														color: isSelected ? '#1976d2' : 'inherit',
														fontWeight: isSelected ? 700 : 600
													}}>{equipment.name}</EquipmentCardTitle>
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

											{/* Details Grid */}
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

											{/* Actions */}
											<Box sx={{ 
												display: "flex", 
												flexWrap: "wrap", 
												gap: 0.5,
												pt: 1.5,
												borderTop: '1px solid #e0e0e0'
											}}>
												<ActionButton
													variant="text"
													size="small"
													startIcon={<EyeIcon sx={{ fontSize: 14 }} />}
													onClick={(e) => {
														e.stopPropagation()
														handleOpenModal("view", equipment)
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
											</Box>
										</EquipmentCardContent>
									</EquipmentCard>
									</Box>
								);
							})}
						</GridContainer>
					)}
				</Box>
			) : (
				// Reading Mode - Full width scanner
				<Box>
					<SectionTitle>QR Code Scanner</SectionTitle>
					
					{/* Quick Access to Download Options */}
					<Card sx={{ mb: 3, border: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
						<CardContent>
							<Stack spacing={2}>
								<Typography variant="h6" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<DownloadIcon color="primary" />
									Quick Access - Download QR Codes
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Need to download QR codes? Switch to Download mode or use these quick options:
								</Typography>
								<Stack direction="row" spacing={2} flexWrap="wrap">
									<Button 
										variant="outlined" 
										startIcon={<DownloadIcon />}
										onClick={() => handleModeChange("generating")}
										sx={{ 
											borderColor: '#1976d2',
											color: '#1976d2',
											'&:hover': { 
												borderColor: '#1565c0',
												backgroundColor: '#f3f8ff'
											}
										}}
									>
										Switch to Download Mode
									</Button>
									<Button 
										variant="contained" 
										startIcon={<PictureAsPdfIcon />}
										onClick={handleDownloadAllPDF}
										disabled={barCodeLoading || isDownloading}
										sx={{ 
											bgcolor: '#ff9800',
											'&:hover': { bgcolor: '#f57c00' }
										}}
									>
										{isDownloading ? "Generating PDF..." : "Download All Equipment (PDF)"}
									</Button>
								</Stack>
							</Stack>
						</CardContent>
					</Card>
					
					<Card>
						<CardContent>
							<Stack spacing={3}>
								{/* Scanner Controls */}
								<Stack direction="row" spacing={2} justifyContent="center">
									<Button
										variant="contained"
										color="success"
										startIcon={<PlayArrowIcon />}
										onClick={handleStartScanner}
										disabled={isScannerActive}
									>
										Start Scanner
									</Button>
									<Button
										variant="contained"
										color="error"
										startIcon={<StopIcon />}
										onClick={handleStopScanner}
										disabled={!isScannerActive}
									>
										Stop Scanner
									</Button>
								</Stack>

								{/* Scanner Status */}
								<Paper sx={{ p: 2, bgcolor: isScannerActive ? '#e8f5e8' : '#f5f5f5' }}>
									<Typography variant="body2" textAlign="center">
										Status: {isScannerActive ? 'Active' : 'Inactive'}
									</Typography>
								</Paper>

								{/* Scanner Display */}
								{isScannerActive && (
									<Box 
										display="flex" 
										flexDirection="column" 
										alignItems="center" 
										gap={1}
										sx={{
											width: '100%',
											maxWidth: '100%',
											overflow: 'hidden'
										}}
									>
										<Box sx={{ 
											position: "relative", 
											width: '100%',
											maxWidth: '100%',
											aspectRatio: '4/3',
											overflow: 'hidden',
											borderRadius: 2,
											boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
											'& video': {
												width: '100%',
												height: '100%',
												objectFit: 'cover',
												borderRadius: 2
											},
											'& canvas': {
												width: '100%',
												height: '100%',
												objectFit: 'cover',
												borderRadius: 2
											}
										}}>
											<BarcodeScannerComponent
												width="100%"
												height="100%"
												onUpdate={handleScanResult}
											/>
											<Box
												sx={{
													position: "absolute",
													left: '15%',
													top: '30%',
													width: '70%',
													height: '40%',
													border: "3px solid #00e676",
													borderRadius: 1,
													boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)",
													pointerEvents: "none",
													zIndex: 10,
												}}
											/>
										</Box>
									</Box>
								)}

								{/* Scan Instructions */}
								{!isScannerActive && (
									<Paper sx={{ p: 2, bgcolor: '#fff3e0' }}>
										<Typography variant="body2" textAlign="center" color="#e65100">
											Click "Start Scanner" to begin scanning QR codes
										</Typography>
									</Paper>
								)}

								{/* Scan Results and Errors */}
								{(barCodeReturnValue || scannerError) && (
									<Paper sx={{ p: 2, bgcolor: '#ffebee' }}>
										<Stack spacing={1}>
											{barCodeReturnValue && (
												<Typography variant="body2" color="error">
													<strong>Barcode Error:</strong> {barCodeReturnValue}
												</Typography>
											)}
											{scannerError && (
												<Typography variant="body2" color="error">
													<strong>Scanner Error:</strong> {scannerError}
												</Typography>
											)}
											<Button 
												variant="text" 
												size="small" 
												color="error"
												onClick={() => {
													setScannerError("");
													setErrorText("");
												}}
												sx={{ alignSelf: 'flex-start', mt: 1 }}
											>
												Clear Errors
											</Button>
										</Stack>
									</Paper>
								)}
							</Stack>
						</CardContent>
					</Card>
				</Box>
			)}

			{/* Menu */}
			<Menu
				anchorEl={menuAnchorEl}
				open={isMenuOpen}
				onClose={handleMenuClose}
			>
				<MenuItem 
					onClick={() => handleModeChange("reading")}
					selected={activeMode === "reading"}
					sx={{
						...(activeMode === "reading" && {
							backgroundColor: '#e3f2fd',
							color: '#1976d2',
							'&:hover': {
								backgroundColor: '#bbdefb',
							}
						})
					}}
				>
					<QrCode2Icon fontSize="small" style={{ marginRight: 8 }} /> 
					Reading QR Mode
				</MenuItem>
				<MenuItem 
					onClick={() => handleModeChange("generating")}
					selected={activeMode === "generating"}
					sx={{
						...(activeMode === "generating" && {
							backgroundColor: '#e8f5e8',
							color: '#2e7d32',
							'&:hover': {
								backgroundColor: '#c8e6c9',
							}
						})
					}}
				>
					<QrCode2Icon fontSize="small" style={{ marginRight: 8 }} /> 
					Download QR Mode
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleMenuClose}>
					<DownloadIcon fontSize="small" style={{ marginRight: 8 }} /> 
					Export Settings
				</MenuItem>
			</Menu>

			{/* Equipment Modal */}
			<EquipmentModal
				show={showEquipmentModal}
				onClose={handleCloseEquipmentModal}
				equipment={scannedEquipment || undefined}
				onArchiveToggle={handleArchiveToggle}
				view="view"
				workshops={workshops}
			/>
		</MainContainer>
	);
};

export default BarQrDecoderPage;


