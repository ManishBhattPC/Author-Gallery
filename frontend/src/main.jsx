
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import App from "./App.jsx";
import {GoogleOAuthProvider} from '@react-oauth/google'

import { AuthProvider } from "./AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="import.meta.env.VITE_GOOGLE_CLIENT_ID">
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
);