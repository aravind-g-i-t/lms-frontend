import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { SocketProvider } from './providers/SocketProvider';
import IncomingCallModal from './components/global/IncomingCallModal';
import DirectCall from './components/global/DirectCall';
import { DirectCallProvider } from './providers/DirectCallProvider';
import LiveSessionCall from './components/global/LIveSessionCall';
import { LiveSessionProvider } from './providers/LiveSessionProvider';

function App() {
  const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <>
    <SocketProvider>
      <DirectCallProvider>
        <LiveSessionProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <Router>
            <AppRoutes/>
          </Router>
        </GoogleOAuthProvider>
        <ToastContainer/>
        <DirectCall />
        <LiveSessionCall />
        <IncomingCallModal />
      </LiveSessionProvider>
    </DirectCallProvider>
    </SocketProvider>
    </>
  )
}

export default App
