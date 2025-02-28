import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import EmailLoginPage from "./components/Loginsetup/EmailLoginPage";
import SignUp from "./components/Loginsetup/SignUp";
import HomeScreen from "./components/Loginsetup/HomeScreen";
<<<<<<< HEAD
import Profile from "./components/Profile/ProfilePage";
import ProjectPage from "./components/Projectscreen/projectpage";
=======
>>>>>>> 039e131b3820b13067b03547123a73ac3b90f334

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
      <Route path="/" element={<Login />} />
=======
        <Route path="/" element={<Login />} />
>>>>>>> 039e131b3820b13067b03547123a73ac3b90f334
        <Route path="/HomeScreen" element={<HomeScreen />} />
        <Route path="/email-login" element={<EmailLoginPage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
<<<<<<< HEAD
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<ProjectPage isPopup={false} />} />
=======
>>>>>>> 039e131b3820b13067b03547123a73ac3b90f334
      </Routes>
    </Router>
  );
}

export default App;
