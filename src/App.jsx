import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { POSProvider } from "./context/POSContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/Layout/MainLayout";
import LoginPage from "./components/pages/LoginPage";
import HomePage from "./components/pages/HomePage";
import MenuManagementPage from "./components/pages/MenuManagementPage";
import OrdersPage from "./components/pages/OrdersPage";
import HistoryPage from "./components/pages/HistoryPage";
import BillsPage from "./components/pages/BillsPage";
import SettingsPage from "./components/pages/SettingsPage";
import HeldOrdersPage from "./components/pages/HeldOrdersPage";

// Protected Route Component (inline)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
        color: '#fff',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// App Content with auth check
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Login Route */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      
      {/* Protected Routes - EXACT same structure as original */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuManagementPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="held-orders" element={<HeldOrdersPage />} />
        <Route path="bills" element={<BillsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <POSProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </POSProvider>
    </ThemeProvider>
  );
}

export default App;