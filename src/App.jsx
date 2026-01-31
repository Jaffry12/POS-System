import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { POSProvider } from "./context/POSContext";
import MainLayout from "./components/Layout/MainLayout";

import HomePage from "./components/pages/HomePage";
import MenuManagementPage from "./components/pages/MenuManagementPage";
import OrdersPage from "./components/pages/OrdersPage";
import HistoryPage from "./components/pages/HistoryPage";
import BillsPage from "./components/pages/BillsPage";
import SettingsPage from "./components/pages/SettingsPage";
import HeldOrdersPage from "./components/pages/HeldOrdersPage"; // ✅ NEW

function App() {
  return (
    <ThemeProvider>
      <POSProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="menu" element={<MenuManagementPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="held-orders" element={<HeldOrdersPage />} /> {/* ✅ NEW */}
              <Route path="bills" element={<BillsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </POSProvider>
    </ThemeProvider>
  );
}

export default App;