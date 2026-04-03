import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center p-6">
        <h1 className="text-gradient">RBAC-FInProcessor</h1>
      </div>
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
