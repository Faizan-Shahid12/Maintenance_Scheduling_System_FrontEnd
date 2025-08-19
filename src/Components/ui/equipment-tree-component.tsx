"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Box,
  Container,
  Avatar,
  InputAdornment,
  type SxProps,
  type Theme
} from "@mui/material"
import {
  Add,
  Visibility,
  Edit,
  LocalOffer,
  Business,
  Clear,
  Search,
  CheckCircle,
  Archive,
  Category
} from "@mui/icons-material"

// Type definitions
interface EquipmentCardProps {
  children: React.ReactNode
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

interface EquipmentCardContentProps {
  children: React.ReactNode
  className?: string
  sx?: SxProps<Theme>
}

interface EquipmentCardTitleProps {
  children: React.ReactNode
  className?: string
  sx?: SxProps<Theme>
}

interface StatusBadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "outline" | "destructive"
  className?: string
  sx?: SxProps<Theme>
}

interface ActionButtonProps {
  children: React.ReactNode
  variant?: "text" | "outlined" | "contained"
  size?: "small" | "medium" | "large"
  onClick?: (e: React.MouseEvent) => void
  startIcon?: React.ReactNode
  sx?: SxProps<Theme>
  disabled?: boolean
}

interface SearchInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
}

interface FilterSelectProps {
  value: string
  onChange: (e: any) => void
  label: string
  options: string[]
  className?: string
}

interface FieldLabelProps {
  children: React.ReactNode
  className?: string
  sx?: SxProps<Theme>
}

interface FieldValueProps {
  children: React.ReactNode
  className?: string
  sx?: SxProps<Theme>
}

interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  color?: string
}

interface EmptyStateProps {
  message: string
  icon?: React.ReactNode
}

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}

interface GridContainerProps {
  children: React.ReactNode
  className?: string
}

interface MainContainerProps {
  children: React.ReactNode
}

interface HeaderContentProps {
  title: string
  subtitle: string
  badge?: string
  action?: React.ReactNode
}

interface StatsContainerProps {
  children: React.ReactNode
}

interface FilterContainerProps {
  children: React.ReactNode
}

interface FilterItemProps {
  children: React.ReactNode
  flex?: string
}

interface ResultsCountProps {
  current: number
  total: number
  label?: string
}

// Custom styled components using Material-UI
export const EquipmentCard: React.FC<EquipmentCardProps> = ({ children, isSelected = false, onClick, className = "" }) => (
  <Card 
    sx={{
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      border: '1px solid #e5e7eb',
      borderRadius: 2,
      boxShadow: '0 6px 20px rgba(15,23,42,0.06)',
      '&:hover': {
        boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
        transform: 'translateY(-2px)',
        borderColor: '#cbd5e1'
      },
      ...(isSelected && {
        border: '2px solid #2563eb',
        backgroundColor: '#eff6ff',
        boxShadow: '0 10px 30px rgba(37,99,235,0.18)'
      })
    }}
    onClick={onClick}
    className={className}
  >
    {children}
  </Card>
)

export const EquipmentCardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <CardHeader sx={{ pb: 1 }} className={className}>
    {children}
  </CardHeader>
)

export const EquipmentCardContent: React.FC<EquipmentCardContentProps> = ({ children, className = "", sx }) => (
  <CardContent sx={{ p: 3, '&:last-child': { pb: 3 }, ...sx }} className={className}>
    {children}
  </CardContent>
)

export const EquipmentCardTitle: React.FC<EquipmentCardTitleProps> = ({ children, className = "", sx }) => (
  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', fontSize: '1.1rem', ...sx }} className={className}>
    {children}
  </Typography>
)

export const StatusBadge: React.FC<StatusBadgeProps> = ({ children, variant = "default", className = "", sx }) => {
  const getColor = (variant: string) => {
    switch (variant) {
      case "secondary": return "primary"
      case "outline": return "default"
      case "destructive": return "error"
      default: return "default"
    }
  }
  
  return (
    <Chip 
      label={children} 
      color={getColor(variant) as any}
      size="small"
      sx={{ fontSize: '0.75rem', ...sx }}
      className={className}
    />
  )
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, variant = "outlined", size = "small", onClick, startIcon, sx, ...props }) => (
  <Button 
    variant={variant}
    size={size}
    onClick={onClick}
    startIcon={startIcon}
    sx={{
      minWidth: 'auto',
      textTransform: 'none',
      fontSize: '0.75rem',
      ...sx
    }}
    {...props}
  >
    {children}
  </Button>
)

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Search...", className = "" }) => (
  <TextField
    fullWidth
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Search />
        </InputAdornment>
      ),
    }}
    className={className}
  />
)

export const FilterSelect: React.FC<FilterSelectProps> = ({ value, onChange, label, options, className = "" }) => (
  <FormControl fullWidth className={className}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      label={label}
      onChange={onChange}
    >
      <MenuItem value="">All {label}s</MenuItem>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

export const FieldLabel: React.FC<FieldLabelProps> = ({ children, className = "", sx }) => (
  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'medium', ...sx }} className={className}>
    {children}
  </Typography>
)

export const FieldValue: React.FC<FieldValueProps> = ({ children, className = "", sx }) => (
  <Typography variant="body2" sx={{ fontWeight: 'medium', ...sx }} className={className}>
    {children}
  </Typography>
)

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color = "#2563eb" }) => (
  <Paper
    sx={{
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 2,
      p: 2,
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Avatar sx={{ bgcolor: color, width: 36, height: 36 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {label}
      </Typography>
    </Box>
  </Paper>
)

export const HeaderCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Paper
    sx={{
      backgroundColor: "#ffffff",
      borderRadius: 3,
      p: 4,
      mb: 3,
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
      border: "1px solid #e5e7eb",
      color: "inherit"
    }}
  >
    <Box sx={{ position: "absolute", top: -30, right: -30, opacity: 0.06 }}>
      <Business sx={{ fontSize: 120, color: "#2563eb" }} />
    </Box>
    <Box sx={{ position: "relative", zIndex: 1 }}>
      {children}
    </Box>
  </Paper>
)

export const FilterCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
      Filters
    </Typography>
    {children}
  </Paper>
)

export const EmptyState: React.FC<EmptyStateProps> = ({ message, icon }) => (
  <Paper sx={{ p: 6, textAlign: "center", mt: 3 }}>
    {icon && (
      <Box sx={{ mb: 2 }}>
        {icon}
      </Box>
    )}
    <Typography variant="h6" color="textSecondary" gutterBottom>
      No items found
    </Typography>
    <Typography variant="body2" color="textSecondary">
      {message}
    </Typography>
  </Paper>
)

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = "" }) => (
  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }} className={className}>
    {children}
  </Typography>
)

export const GridContainer: React.FC<GridContainerProps> = ({ children, className = "" }) => (
  <Box 
    sx={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 3,
      width: '100%'
    }} 
    className={className}
  >
    {children}
  </Box>
)

export const MainContainer: React.FC<MainContainerProps> = ({ children }) => (
  <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", py: 3 }}>
    <Container maxWidth="xl">
      {children}
    </Container>
  </Box>
)

export const HeaderContent: React.FC<HeaderContentProps> = ({ title, subtitle, badge, action }) => (
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
        <Business sx={{ fontSize: 28, color: "#2563eb" }} />
      </Paper>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{
              bgcolor: "#eef2ff",
              color: "#2563eb",
              fontWeight: "bold"
            }}
          />
        )}
      </Box>
    </Box>
    {action}
  </Box>
)

export const StatsContainer: React.FC<StatsContainerProps> = ({ children }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
    {React.Children.map(children, (child, index) => (
      <Box key={index} sx={{ flex: "1 1 180px", minWidth: "180px" }}>
        {child}
      </Box>
    ))}
  </Box>
)

export const FilterContainer: React.FC<FilterContainerProps> = ({ children }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
    {children}
  </Box>
)

export const FilterItem: React.FC<FilterItemProps> = ({ children, flex = "1 1 150px" }) => (
  <Box sx={{ flex, minWidth: "150px" }}>
    {children}
  </Box>
)

export const ResultsCount: React.FC<ResultsCountProps> = ({ current, total, label = "items" }) => (
  <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
    <Typography variant="body2" color="textSecondary">
      {current} of {total} {label}
    </Typography>
  </Box>
)

// Export Material-UI icons for easy access
export {
  Add as PlusIcon,
  Visibility as EyeIcon,
  Edit as EditIcon,
  LocalOffer as TagIcon,
  Business as BuildingIcon,
  Clear as XIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Archive as ArchiveIcon,
  Category as CategoryIcon
}
