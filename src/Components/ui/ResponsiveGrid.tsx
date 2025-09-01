import React from 'react'
import { Box, BoxProps } from '@mui/material'

interface ResponsiveGridProps extends BoxProps {
  children: React.ReactNode
  minItemWidth?: number
  gap?: number | string
}

/**
 * ResponsiveGrid component that provides consistent responsive card layouts
 * across the application with proper breakpoints and spacing
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  minItemWidth = 350,
  gap = 3,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap,
        '@media (max-width: 768px)': {
          gap: typeof gap === 'number' ? Math.max(1, gap - 1) : gap,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

interface ResponsiveGridItemProps extends BoxProps {
  children: React.ReactNode
  minWidth?: number
  maxWidth?: number
}

/**
 * ResponsiveGridItem component for individual cards within the grid
 * Provides consistent responsive behavior for card layouts
 */
export const ResponsiveGridItem: React.FC<ResponsiveGridItemProps> = ({
  children,
  minWidth = 350,
  maxWidth = 400,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        flex: `1 1 ${minWidth}px`,
        minWidth: {
          xs: '100%',
          sm: `${Math.max(300, minWidth - 50)}px`,
          md: `${minWidth}px`,
        },
        maxWidth: {
          xs: '100%',
          sm: 'none',
          md: `${maxWidth}px`,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

export default ResponsiveGrid
