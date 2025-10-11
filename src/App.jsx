import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import CreateShipmentWizard from "./pages/CreateShipmentWizard";
import TrackingPage from "./pages/TrackingPage";
import AdminPanel from "./pages/AdminPanel";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import ServicesPage from "./pages/ServicesPage";
import { useAppContext } from "./hooks/useAppContext";


const Protected = ({ children, roles }) => {
const { user, loading } = useAppContext();
if (loading) return <div className="p-8">Loading…</div>;
if (!user) return <Navigate to="/login" replace />;
if (roles && roles.length && !roles.includes(user?.role || "user")) {
return <Navigate to="/" replace />;
}
return children;
};


export default function App() {
return (
<div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
<Header />
<main className="flex-1">
<Routes>
<Route path="/" element={<HomePage />} />
<Route path="/create" element={<CreateShipmentWizard />} />
<Route path="/track" element={<TrackingPage />} />
<Route
path="/admin"
element={
<Protected roles={["admin"]}>
<AdminPanel />
</Protected>
}
/>
<Route
path="/profile"
element={
<Protected>
<ProfilePage />
</Protected>
}
/>
<Route path="/services" element={<ServicesPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
</main>
<Footer />
</div>
);
}