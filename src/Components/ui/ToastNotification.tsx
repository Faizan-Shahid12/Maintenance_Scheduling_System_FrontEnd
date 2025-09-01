import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';

export interface ToastProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

const getPositionConfig = (position: string): { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' | 'center' } => {
  switch (position) {
    case 'top-left':
      return { vertical: 'top', horizontal: 'left' };
    case 'top-right':
      return { vertical: 'top', horizontal: 'right' };
    case 'bottom-left':
      return { vertical: 'bottom', horizontal: 'left' };
    case 'bottom-right':
      return { vertical: 'bottom', horizontal: 'right' };
    case 'top-center':
      return { vertical: 'top', horizontal: 'center' };
    case 'bottom-center':
      return { vertical: 'bottom', horizontal: 'center' };
    default:
      return { vertical: 'bottom', horizontal: 'right' };
  }
};

const getSeverityIcon = (severity: AlertColor) => {
  switch (severity) {
    case 'success':
      return <CheckCircle />;
    case 'error':
      return <Error />;
    case 'warning':
      return <Warning />;
    case 'info':
      return <Info />;
    default:
      return <Info />;
  }
};

export const ToastNotification: React.FC<ToastProps> = ({
  open,
  message,
  severity,
  duration = 6000,
  onClose,
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const positionConfig = getPositionConfig(position);

  return (
    <Snackbar
      open={isVisible}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={positionConfig}
      sx={{
        '& .MuiSnackbar-root': {
          ...(position.includes('bottom') && { bottom: 24 }),
          ...(position.includes('top') && { top: 24 }),
          ...(position.includes('left') && { left: 24 }),
          ...(position.includes('right') && { right: 24 }),
          ...(position.includes('center') && { left: '50%', transform: 'translateX(-50%)' }),
        }
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        icon={getSeverityIcon(severity)}
        sx={{
          width: '100%',
          minWidth: '300px',
          maxWidth: '400px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderRadius: 2,
          '& .MuiAlert-icon': {
            fontSize: '1.25rem'
          },
          '& .MuiAlert-message': {
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.4
          },
          '& .MuiAlert-action': {
            padding: 0
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
