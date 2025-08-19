import AppRoutes from './routes/route'
import { Provider } from 'react-redux'
import store from './Redux/Store'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const theme = createTheme({
	typography: {
		fontFamily: '"Manrope", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif'
	},
	palette: {
		mode: 'light',
		primary: { main: '#2563eb' },
		secondary: { main: '#10b981' },
		background: { default: '#f5f7fb', paper: '#ffffff' },
		text: { primary: '#0f172a', secondary: '#475569' }
	},
	shape: { borderRadius: 12 },
	components: {
		MuiPaper: {
			styleOverrides: { root: { borderRadius: 12 } }
		},
		MuiCard: {
			styleOverrides: { root: { borderRadius: 14, boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)' } }
		},
		MuiButton: {
			styleOverrides: {
				root: { textTransform: 'none', fontWeight: 600, borderRadius: 10 },
				contained: { boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)' }
			}
		},
		MuiChip: {
			styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } }
		},
		MuiListItem: { styleOverrides: { root: { borderRadius: 8 } } },
		MuiAppBar: { styleOverrides: { root: { boxShadow: '0 2px 12px rgba(15, 23, 42, 0.06)' } } },
		MuiDrawer: { styleOverrides: { paper: { border: 'none' } } }
	}
})

function App() {

	return (
		<>
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<AppRoutes />
				</ThemeProvider>
			</Provider>
		</>
	)
}

export default App
