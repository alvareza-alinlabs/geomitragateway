import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import LandingPage from "./pages/Landing";
import AppointmentPage from "./pages/AppointmentPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardMain from "./pages/Dashboard/DashboardMain";
import MapPage from "./pages/Dashboard/MapPage";
import DatabasePage from "./pages/Dashboard/Client/DatabasePage";
import SalesPage from "./pages/Dashboard/Client/SalesPage";
import ClientDetailPage from "./pages/Dashboard/Client/ClientDetailPage";
import ProductDetailPage from "./pages/Dashboard/Product/ProductDetailPage";
import ProductsPage from "./pages/Dashboard/Product/ProductsPage";
import TransactionDetailPage from "./pages/Dashboard/Transaction/TransactionDetailPage";
import SchedulePage from "./pages/Dashboard/Schedule/SchedulePage";
import ScheduleDetailPage from "./pages/Dashboard/Schedule/ScheduleDetailPage";
import BroadcastPage from "./pages/Dashboard/Broadcast/BroadcastPage";
import AddBroadcastForm from "./pages/Dashboard/Forms/AddBroadcastForm";
import BroadcastDetailPage from "./pages/Dashboard/Broadcast/BroadcastDetailPage";
import SettingsPage from "./pages/Dashboard/SettingsPage";
import AccessPage from "./pages/Dashboard/AccessPage";
import AddUserForm from "./pages/Dashboard/Forms/AddUserForm";
import LandingConfigPage from "./pages/Dashboard/LandingConfigPage";
import TransactionsPage from "./pages/Dashboard/Transaction/TransactionsPage";
import PublicProductsPage from "./pages/Landing/PublicProductsPage";
import PublicProductDetailPage from "./pages/Landing/PublicProductDetailPage";
import InvoicePage from "./pages/Invoice";
import AddPartnerForm from "./pages/Dashboard/Forms/AddPartnerForm";
import AddSalesForm from "./pages/Dashboard/Forms/AddSalesForm";
import AddTransactionForm from "./pages/Dashboard/Forms/AddTransactionForm";
import AddScheduleForm from "./pages/Dashboard/Forms/AddScheduleForm";
import AddProductForm from "./pages/Dashboard/Forms/AddProductForm";
import TargetingPage from "./pages/Dashboard/Targeting/TargetingPage";
import TargetingDetailPage from "./pages/Dashboard/Targeting/TargetingDetailPage";
import AddTargetingForm from "./pages/Dashboard/Forms/AddTargetingForm";
import InfoPage from "./pages/Info/InfoPage";

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const path = location.pathname;
    if (path.startsWith('/dashboard')) {
      document.title = 'Dashboard';
    } else if (path === '/info') {
      document.title = 'Informasi Sistem';
    } else if (path === '/invoice') {
      document.title = 'AlinLabs Invoice';
    } else if (path.startsWith('/katalog')) {
      document.title = 'Katalog';
    } else if (path.startsWith('/appointment')) {
      document.title = 'Konsultasi';
    } else if (path === '/login') {
      document.title = 'Otentikasi';
    } else if (path === '/') {
      document.title = 'Beranda';
    } else {
      document.title = 'Geo Mitra Gateway';
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore react-router type missing key */}
      <Routes location={location} key={location.pathname.startsWith('/dashboard') ? 'dashboard' : location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/appointment=now" element={<AppointmentPage />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/invoice/:tab" element={<InvoicePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/katalog" element={<PublicProductsPage />} />
        <Route path="/katalog/:id" element={<PublicProductDetailPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardMain />} />
          <Route path="map" element={<MapPage />} />
          <Route path="partners" element={<DatabasePage />} />
          <Route path="partners/add" element={<AddPartnerForm />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="sales/add" element={<AddSalesForm />} />
          <Route path="client/:id" element={<ClientDetailPage />} />
          <Route path="product/add" element={<AddProductForm />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="transactions/add" element={<AddTransactionForm />} />
          <Route path="transactions/edit/:id" element={<AddTransactionForm />} />
          <Route path="transaction/:id" element={<TransactionDetailPage />} />
          <Route path="targeting" element={<TargetingPage />} />
          <Route path="targeting/add" element={<AddTargetingForm />} />
          <Route path="targeting/edit/:id" element={<AddTargetingForm />} />
          <Route path="targeting/detail/:id" element={<TargetingDetailPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="schedule/detail/:id" element={<ScheduleDetailPage />} />
          <Route path="schedule/add" element={<AddScheduleForm />} />
          <Route path="broadcast" element={<BroadcastPage />} />
          <Route path="broadcast/add" element={<AddBroadcastForm />} />
          <Route path="broadcast/edit/:id" element={<AddBroadcastForm />} />
          <Route path="broadcast/:id" element={<BroadcastDetailPage />} />
          <Route path="landing-config" element={<LandingConfigPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="access" element={<AccessPage />} />
          <Route path="access/add" element={<AddUserForm />} />
          <Route path="access/edit" element={<AddUserForm />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
