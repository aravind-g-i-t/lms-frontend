import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';

function App() {
  const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <>
    <GoogleOAuthProvider clientId={clientId}>

    <Router>
      <AppRoutes/>
    </Router>
    </GoogleOAuthProvider>
    <ToastContainer/>
    </>
  )
}

export default App
