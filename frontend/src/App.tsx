import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Roles from "./pages/Roles";
import Clients from "./pages/Clients";
import Revenue from "./pages/Revenue";
import TimeEntries from "./pages/TimeEntries";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/time-entries" element={<TimeEntries />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}