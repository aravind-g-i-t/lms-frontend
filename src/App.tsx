import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { SocketProvider } from './providers/SocketProvider';
import { VideoCallProvider } from './providers/VideoCallProvider';
import GlobalVideoCallModal from './components/global/GlobalVideoCallModal';
import IncomingCallModal from './components/global/IncomingCallModal';

function App() {
  const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <>
    <SocketProvider>
      <VideoCallProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <Router>
            <AppRoutes/>
          </Router>
        </GoogleOAuthProvider>
        <ToastContainer/>
        <GlobalVideoCallModal />
        <IncomingCallModal />

    </VideoCallProvider>
    </SocketProvider>
    </>
  )
}

export default App
