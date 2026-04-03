import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AuditLogs from "./pages/AuditLogs";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import RecordDetail from "./pages/RecordDetail";
import RecordsList from "./pages/RecordsList";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import UserDetail from "./pages/UserDetail";
import UserList from "./pages/UserList";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<LandingPage />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route element={<Unauthorized />} path="/unauthorized" />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route element={<Dashboard />} path="/dashboard" />

              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route element={<UserList />} path="/users" />
                <Route element={<UserDetail />} path="/users/new" />
                <Route element={<UserDetail />} path="/users/:userId" />
                <Route element={<AuditLogs />} path="/logs" />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["admin", "analyst", "user"]} />}>
                <Route element={<RecordsList />} path="/records" />
                <Route element={<RecordDetail />} path="/records/:recordId" />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
                <Route element={<RecordDetail />} path="/records/new" />
              </Route>
            </Route>
          </Route>

          <Route element={<NotFound />} path="*" />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

export default App;
