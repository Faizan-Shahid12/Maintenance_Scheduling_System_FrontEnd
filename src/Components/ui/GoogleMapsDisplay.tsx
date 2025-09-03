import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography, Paper, CircularProgress, Alert, Chip } from '@mui/material';
import { LocationOn, Business } from '@mui/icons-material';

interface MapDisplayProps {
  location: string;
  latitude?: number;
  longitude?: number;
  workshopName?: string;
  height?: string;
  showInfo?: boolean;
}

interface MapLocation {
  lat: number;
  lng: number;
  address: string;
}

const containerStyle = {
  width: '100%',
  height: '300px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const GOOGLE_MAPS_LIBRARIES = ['places'];

export const GoogleMapsDisplay: React.FC<MapDisplayProps> = ({
  location,
  latitude,
  longitude,
  workshopName,
  height = '300px',
  showInfo = true
}) => {
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = React.useState<google.maps.InfoWindow | null>(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = React.useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-maps-shared-loader',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
    libraries: GOOGLE_MAPS_LIBRARIES as any
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Create InfoWindow
    const infoWindow = new google.maps.InfoWindow();
    setInfoWindow(infoWindow);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onMarkerClick = useCallback(() => {
    if (infoWindow && map) {
      setIsInfoWindowOpen(true);
    }
  }, [infoWindow, map]);

  const hasValidCoordinates = latitude && longitude && !isNaN(latitude) && !isNaN(longitude);
  
  // If no valid coordinates, try to geocode the location string
  const [geocodedLocation, setGeocodedLocation] = useState<MapLocation | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

   useEffect(() => {
    if (!hasValidCoordinates && location && isLoaded) {
      setIsGeocoding(true);
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ address: location }, (results, status) => {
        setIsGeocoding(false);
        
        if (status === 'OK' && results && results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          const address = results[0].formatted_address;
          
          setGeocodedLocation({ lat, lng, address });
          
          // Move map to geocoded location
          if (map) {
            map.panTo({ lat, lng });
            map.setZoom(15);
          }
        }
      });
    }
  }, [location, hasValidCoordinates, isLoaded, map]);

  // Determine the center and zoom for the map
  const getMapCenter = () => {
    if (hasValidCoordinates) {
      return { lat: latitude!, lng: longitude! };
    } else if (geocodedLocation) {
      return { lat: geocodedLocation.lat, lng: geocodedLocation.lng };
    }
    return defaultCenter;
  };

  const getMapZoom = () => {
    if (hasValidCoordinates || geocodedLocation) {
      return 15;
    }
    return 10;
  };

  if (loadError) {
    return (
      <Alert severity="error">
        Error loading Google Maps: {loadError.message}
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        {showInfo && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business color="primary" />
            <Typography variant="h6" color="primary" fontWeight={600}>
              Workshop Location
            </Typography>
            {workshopName && (
              <Chip 
                label={workshopName} 
                size="small" 
                color="secondary" 
                variant="outlined"
              />
            )}
          </Box>
        )}
        
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            height, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            border: '2px dashed #ccc'
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              🗺️ Google Maps
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ px: 2 }}>
              {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 
                'Loading map...' : 
                'Please add your Google Maps API key to .env file to enable map display'
              }
            </Typography>
            {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
              <Alert severity="info" sx={{ mt: 2, maxWidth: 400 }}>
                <Typography variant="body2">
                  <strong>Setup Required:</strong><br/>
                  Add <code>VITE_GOOGLE_MAPS_API_KEY=your_api_key</code> to your .env file
                </Typography>
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      {showInfo && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business color="primary" />
          <Typography variant="h6" color="primary" fontWeight={600}>
            Workshop Location
          </Typography>
          {workshopName && (
            <Chip 
              label={workshopName} 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Map */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <GoogleMap
          mapContainerStyle={{ ...containerStyle, height }}
          center={getMapCenter()}
          zoom={getMapZoom()}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
            gestureHandling: 'cooperative'
          }}
        >
          {/* Location Marker */}
          {(hasValidCoordinates || geocodedLocation) && (
            <Marker
              position={hasValidCoordinates ? { lat: latitude!, lng: longitude! } : { lat: geocodedLocation!.lat, lng: geocodedLocation!.lng }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(32, 32)
              }}
              onClick={onMarkerClick}
            />
          )}

          {/* InfoWindow */}
          {infoWindow && (hasValidCoordinates || geocodedLocation) && (
            <InfoWindow
              position={hasValidCoordinates ? { lat: latitude!, lng: longitude! } : { lat: geocodedLocation!.lat, lng: geocodedLocation!.lng }}
              onCloseClick={() => setIsInfoWindowOpen(false)}
            >
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {workshopName || 'Workshop Location'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {location}
                </Typography>
                {(hasValidCoordinates || geocodedLocation) && (
                  <Typography variant="caption" color="text.secondary">
                    Coordinates: {hasValidCoordinates ? `${latitude!.toFixed(6)}, ${longitude!.toFixed(6)}` : `${geocodedLocation!.lat.toFixed(6)}, ${geocodedLocation!.lng.toFixed(6)}`}
                  </Typography>
                )}
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>
      </Paper>

      {/* Location Info */}
      {showInfo && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocationOn color="primary" />
            <Typography variant="subtitle2" color="primary" fontWeight={600}>
              Location Details
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {location || 'No location specified'}
          </Typography>
          
          {isGeocoding && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                Getting coordinates...
              </Typography>
            </Box>
          )}
          
          {(hasValidCoordinates || geocodedLocation) && (
            <Typography variant="caption" color="text.secondary">
              Coordinates: {hasValidCoordinates ? `${latitude!.toFixed(6)}, ${longitude!.toFixed(6)}` : `${geocodedLocation!.lat.toFixed(6)}, ${geocodedLocation!.lng.toFixed(6)}`}
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};
