import AppRoutes from './routes/route'
import { Provider } from 'react-redux'
import store from './Redux/Store'

function App() {

  return (
    <>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </>
  )
}

export default App
