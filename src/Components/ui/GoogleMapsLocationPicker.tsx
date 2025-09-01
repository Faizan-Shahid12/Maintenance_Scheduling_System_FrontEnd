import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, TextField, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { LocationOn, MyLocation } from '@mui/icons-material';

interface LocationPickerProps {
  value: string;
  onChange: (location: string, lat?: number, lng?: number, establishmentName?: string, fullAddress?: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
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

// Static libraries array to prevent LoadScript reloading
const GOOGLE_MAPS_LIBRARIES = ['places'];

// Shared loader configuration to prevent conflicts
const sharedLoaderConfig = {
  id: 'google-maps-shared-loader',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
  libraries: GOOGLE_MAPS_LIBRARIES as any
};

export const GoogleMapsLocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  placeholder = "Search for a location...",
  label = "Location",
  disabled = false,
  error = false,
  helperText
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);

  const autocompleteRef = useRef<HTMLInputElement>(null);

  // Use shared loader configuration
  const { isLoaded, loadError } = useJsApiLoader(sharedLoaderConfig);

  // Debug logging
  React.useEffect(() => {
    // API Key and load status check
  }, [isLoaded, loadError]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // Create InfoWindow
    const infoWindow = new google.maps.InfoWindow();
    setInfoWindow(infoWindow);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);



  const handleInputChange = useCallback((inputValue: string) => {
    if (!isLoaded || !window.google || inputValue.length < 3) {
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }

    // Use Google Places AutocompleteService to get suggestions
    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({
      input: inputValue,
      types: ['establishment'],
      componentRestrictions: { country: ['us', 'ca'] }
    }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  }, [isLoaded]);

  const handleSuggestionClick = useCallback((prediction: google.maps.places.AutocompletePrediction) => {
    if (!isLoaded || !window.google) return;
    
    // Use Places Service to get full place details
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({
      placeId: prediction.place_id,
      fields: ['formatted_address', 'geometry', 'name', 'types', 'place_id']
    }, (place, status) =>
    {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        // Get establishment name from place.name, fallback to structured description
        let establishmentName = place.name;
        if (!establishmentName) {
          // Try to extract from structured description
          const descriptionParts = prediction.description.split(',');
          // Look for parts that don't look like addresses (no numbers, longer text)
          establishmentName = descriptionParts.find(part => 
            part.trim().length > 3 && !/\d/.test(part.trim())
          )?.trim() || descriptionParts[0].trim();
        }
        const fullAddress = place.formatted_address || prediction.description || 'Selected Location';
        
        const location: MapLocation = { lat, lng, address: fullAddress };
        setSelectedLocation(location);
        onChange(fullAddress, lat, lng, establishmentName, fullAddress);
        
        // Move map to selected location
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
        
        setShowSuggestions(false);
        setSuggestions([]);
        setErrorMessage('');
      }
    });
  }, [isLoaded, map, onChange]);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng && map) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
  
      setIsLoading(true);
  
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const address = results[0].formatted_address;
          const placeId = results[0].place_id; // 🔹 capture place ID
  
          if (placeId) {
            // Use PlacesService to get full details
            const service = new google.maps.places.PlacesService(map);
            service.getDetails(
              {
                placeId,
                fields: ['name', 'formatted_address', 'geometry', 'place_id'],
              },
              (place, placeStatus) => {
                setIsLoading(false);
  
                if (placeStatus === google.maps.places.PlacesServiceStatus.OK && place) {
                  const establishmentName = place.name || address;
                  const fullAddress = place.formatted_address || address;
  
                  const location: MapLocation = { lat, lng, address: fullAddress };
                  setSelectedLocation(location);
  
                  onChange(fullAddress, lat, lng, establishmentName, fullAddress);
  
                  setErrorMessage('');
  
                  if (infoWindow) {
                    infoWindow.setContent(`
                      <div style="padding: 8px; font-family: Arial, sans-serif;">
                        <div style="font-weight: bold; color: #1976d2; margin-bottom: 4px;">📍 ${establishmentName}</div>
                        <div style="color: #333; font-size: 14px;">${fullAddress}</div>
                        <div style="color: #666; font-size: 12px; margin-top: 4px;">
                          Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}
                        </div>
                      </div>
                    `);
                    infoWindow.setPosition({ lat, lng });
                    infoWindow.open(map);
                  }
                } else {
                  setErrorMessage('Could not retrieve place details');
                }
              }
            );
          } else {
            setIsLoading(false);
            setErrorMessage('No place ID found for this location');
          }
        } else {
          setIsLoading(false);
          setErrorMessage('Could not get address for this location');
        }
      });
    }
  }, [map, infoWindow, onChange]);
  

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation && map) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          

          
          // Reverse geocode to get address
          const geocoder = new google.maps.Geocoder();
          
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            setIsLoading(false);
            if (status === 'OK' && results && results[0]) {
              const address = results[0].formatted_address;
              const location: MapLocation = { lat, lng, address };
              
              setSelectedLocation(location);
              onChange(address, lat, lng, address, address);
              
              // Move map to current location
              if (map) {
                map.panTo({ lat, lng });
                map.setZoom(15);
              }
              
              setErrorMessage('');
            } else {
              setIsLoading(false);
              setErrorMessage('Could not get address for current location');
            }
          });
        },
        (error) => {
          setIsLoading(false);

          setErrorMessage('Could not get current location: ' + error.message);
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by this browser or map not loaded');
    }
  }, [map, onChange]);

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
        <Box sx={{ mb: 2 }}>
          <TextField
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            error={error}
            helperText={helperText}
            fullWidth
          />
        </Box>
        
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            height: 300, 
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
                'Please add your Google Maps API key to .env file to enable location picker'
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
      {/* Search Input */}
      <Box sx={{ mb: 2, position: 'relative' }}>
        <TextField
          ref={autocompleteRef}
          label={label}
          value={value}
                       onChange={(e) => {
               const newValue = e.target.value;
               onChange(newValue, undefined, undefined, newValue, newValue);
               // Trigger suggestions as user types
               handleInputChange(newValue);
             }}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          helperText={helperText}
          fullWidth
          InputProps={{
            endAdornment: (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isLoading && <CircularProgress size={20} />}
                <MyLocation 
                  onClick={getCurrentLocation}
                  sx={{ 
                    cursor: 'pointer', 
                    color: 'primary.main',
                    '&:hover': { color: 'primary.dark' }
                  }}
                />
              </Box>
            )
          }}
        />
         
         {/* Suggestions List */}
         {showSuggestions && suggestions.length > 0 && (
           <Paper 
             elevation={3} 
             sx={{ 
               position: 'absolute',
               top: '100%',
               left: 0,
               right: 0,
               maxHeight: 200, 
               overflow: 'auto', 
               zIndex: 9999,
               mt: 0.5,
               border: '1px solid',
               borderColor: 'divider',
               backgroundColor: 'background.paper'
             }}
           >
             <List dense>
               {suggestions.map((prediction, index) => (
                 <ListItem key={index} disablePadding>
                   <ListItemButton onClick={() => handleSuggestionClick(prediction)}>
                     <ListItemText 
                       primary={prediction.description}
                       primaryTypographyProps={{ fontSize: '0.9rem' }}
                     />
                   </ListItemButton>
                 </ListItem>
               ))}
             </List>
           </Paper>
         )}
      </Box>

      {/* Map */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : defaultCenter}
          zoom={selectedLocation ? 15 : 10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onMapClick}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          {/* Selected Location Marker */}
          {selectedLocation && (
            <Marker
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(40, 40)
              }}
              animation={google.maps.Animation.DROP}
              title={selectedLocation.address}
            />
          )}
        </GoogleMap>
      </Paper>

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
};
