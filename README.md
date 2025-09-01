# Maintenance Scheduling System Frontend

A React-based frontend application for managing maintenance schedules and equipment locations using Google Maps integration.

## 🚀 Features

- **Google Maps Integration**: Location picker with autocomplete suggestions
- **Equipment Management**: Create, edit, and view equipment with workshop locations
- **Modern UI**: Built with Material-UI (MUI) components
- **TypeScript**: Full type safety and better development experience
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Material-UI (MUI)** for UI components
- **Google Maps JavaScript API** for location services
- **Redux Toolkit** for state management

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Maintenance_Scheduling_System_FrontEnd
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## 🔑 Google Maps API Setup

To enable location features, you need a Google Maps API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security
6. Add the API key to your `.env` file

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── Components/          # Reusable UI components
│   └── ui/             # UI components including Google Maps
├── pages/              # Page components
├── Redux/              # State management
├── services/           # API services
├── Models/             # TypeScript interfaces
└── routes/             # Application routing
```

## 🗺️ Google Maps Components

- **GoogleMapsLocationPicker**: Interactive location picker with search and map
- **GoogleMapsDisplay**: Display-only map for viewing locations

## 🐛 Troubleshooting

### Google Maps Issues

1. **"Loader must not be called again with different options"**
   - ✅ Fixed: Components use shared loader configuration

2. **Autocomplete suggestions not working**
   - Ensure Google Maps API key is set in `.env`
   - Verify Places API is enabled in Google Cloud Console
   - Check browser console for errors

3. **Maps not loading**
   - Verify API key is correct
   - Check API restrictions in Google Cloud Console
   - Ensure required APIs are enabled

### Common Issues

- **TypeScript errors**: Run `npm run lint` to check for issues
- **Build errors**: Clear `node_modules` and reinstall dependencies

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues related to:
- **Google Maps**: Check the [Google Maps JavaScript API documentation](https://developers.google.com/maps/documentation/javascript)
- **React**: Refer to the [React documentation](https://react.dev/)
- **MUI**: Check the [Material-UI documentation](https://mui.com/)
