# Google Maps API Integration Setup

This document provides setup instructions for integrating Google Maps API into the Maintenance Scheduling System Frontend.

## 🚀 Features Implemented

- **Location Picker**: Interactive map with autocomplete search and click-to-select functionality
- **Map Display**: Shows workshop locations on maps with markers and info windows
- **Autocomplete**: Google Places API integration for location search
- **Geocoding**: Automatic conversion between addresses and coordinates
- **Fallback Display**: Graceful handling when API key is not configured

## 🔑 API Key Setup

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Environment Configuration

Create a `.env` file in your project root:

```bash
# .env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Important**: Use `VITE_` prefix for Vite projects (not `REACT_APP_`)

## 📦 Dependencies

The following packages are already installed:

```bash
npm install @react-google-maps/api @types/google.maps
```

## 🗺️ Components

### GoogleMapsLocationPicker
- **Purpose**: Interactive location selection with search and map
- **Usage**: For creating/editing equipment workshop locations
- **Features**: 
  - Autocomplete search
  - Click-to-select on map
  - Current location detection
  - Coordinate extraction

### GoogleMapsDisplay
- **Purpose**: Display workshop locations on maps
- **Usage**: For viewing equipment workshop locations
- **Features**:
  - Location markers
  - Info windows
  - Automatic geocoding
  - Responsive design

## 🔧 Technical Implementation

### Shared Loader Configuration
Both components use the same shared loader configuration to prevent conflicts:
```typescript
// Static libraries array to prevent LoadScript reloading
const GOOGLE_MAPS_LIBRARIES = ['places'];

const sharedLoaderConfig = {
  id: 'google-maps-shared-loader',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
  libraries: GOOGLE_MAPS_LIBRARIES
};
```

### Fallback Display
When no API key is provided, components show helpful setup instructions instead of errors.

### Environment Variable Access
Uses Vite's `import.meta.env` syntax:
```typescript
googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'
```

## 📱 Usage Examples

### In EquipmentModal.tsx
```typescript
// For editing/creating equipment
<GoogleMapsLocationPicker
  value={workShopLocation}
  onChange={handleWorkShopLocationChange}
  label="Workshop Location"
  placeholder="Search for workshop location..."
/>

// For viewing equipment
<GoogleMapsDisplay
  location={workShopLocation}
  latitude={workShopLatitude}
  longitude={workShopLongitude}
  workshopName={workShopName}
  height="300px"
/>
```

## 🛡️ Security Notes

- **API Key Restrictions**: Always restrict your API key to specific domains
- **HTTPS Only**: Google Maps API requires HTTPS in production
- **Rate Limiting**: Be aware of API usage limits and costs

## 🚨 Troubleshooting

### Common Issues

1. **"Loader must not be called again with different options"**
   - ✅ **Fixed**: Both components now use the same shared loader configuration

2. **"process is not defined"**
   - ✅ **Fixed**: Using `import.meta.env` instead of `process.env`

3. **Google Maps Places Autocomplete Deprecation Warning**
   - ✅ **Addressed**: The warning about `google.maps.places.Autocomplete` being deprecated is informational
   - The component continues to work and will be supported until at least March 2026
   - The warning appears because Google recommends using `PlaceAutocompleteElement` for new implementations
   - Current implementation is stable and functional

4. **LoadScript has been reloaded unintentionally**
   - ✅ **Fixed**: Libraries array is now defined as a static constant outside components
   - This prevents unnecessary reloading of the Google Maps script

5. **Maps not loading**
   - Check API key is correct
   - Verify APIs are enabled in Google Cloud Console
   - Check browser console for errors

6. **Autocomplete not working**
   - Ensure Places API is enabled
   - Check API key restrictions
   - Verify `.env` file contains `VITE_GOOGLE_MAPS_API_KEY`

### Debug Mode

Enable debug logging by checking browser console for:
- API loading status
- Geocoding results
- Map initialization

## 📋 Model Updates

The following models have been updated to support coordinates:

- `WorkShop` - Added `latitude` and `longitude` fields
- `Equipment` - Added `workShopLatitude` and `workShopLongitude` fields
- `CreateEquipmentModel` - Added workshop location fields

## 🎯 Next Steps

1. ✅ **Install Dependencies** - Already completed
2. ✅ **Update Models** - Already completed
3. ✅ **Create Components** - Already completed
4. ✅ **Fix Loader Conflicts** - Already completed
5. 🔑 **Add API Key** - Create `.env` file with your API key
6. 🧪 **Test Integration** - Try creating/editing equipment with locations

## 💡 Tips

- Start with a small API key quota and increase as needed
- Use the fallback displays to test UI before adding API key
- Monitor API usage in Google Cloud Console
- Consider implementing caching for frequently accessed locations

---

**Status**: ✅ Ready for API key configuration and testing
