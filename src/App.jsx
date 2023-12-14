import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";

import { useEffect } from "react";
import { gapi } from "gapi-script";
export const url = import.meta.env.VITE_BACKEND_URL;
export const clientId = import.meta.env.VITE_CLIENT_ID;
console.log(clientId);
function App() {
  useEffect(() => {
    function start() {
      gapi.auth2.init({
        client_id: clientId,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
