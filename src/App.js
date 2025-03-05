import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import PhoneLoginPage from "./components/Loginsetup/PhoneLoginPage";
import SignUp from "./components/Loginsetup/SignUp";
import HomeScreen from "./components/Loginsetup/HomeScreen";
import Profile from "./components/Profile/ProfilePage";
import ProjectPage from "./components/Projectscreen/projectpage";
import { AuthProvider } from './contexts/AuthContext';
import OAuthCallback from './components/OAuthCallback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/HomeScreen" element={<HomeScreen />} />
          <Route path="/phone-login" element={<PhoneLoginPage />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects" element={<ProjectPage isPopup={false} />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
