import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import EmailLoginPage from "./components/Loginsetup/EmailLoginPage";
import SignUp from "./components/Loginsetup/SignUp";
import HomeScreen from "./components/Loginsetup/HomeScreen";
<<<<<<< HEAD
=======
import Profile from "./components/Profile/ProfilePage";
import ProjectPage from "./components/Projectscreen/projectpage";


>>>>>>> ae9acd937da4c4f9ba476c881a5d7083c9a3122a
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/HomeScreen" element={<HomeScreen />} />
        <Route path="/email-login" element={<EmailLoginPage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<ProjectPage isPopup={false} />} />
      </Routes>
    </Router>
  );
}

export default App;
