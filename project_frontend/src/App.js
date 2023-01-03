import React, { useEffect } from "react";
import Login from "./components/Login";
import Home from "./container/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { fetchUser } from "./utils/fetchUser";

const App = () => {
  // redirect user to login if user is not logged in

  const navigate = useNavigate();
  useEffect(() => {
    const user = fetchUser();

    if (!user) {
      navigate("/login");
    }
  });

  return (
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_PUBLIC_GOOGLE_API_TOKEN}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default App;
