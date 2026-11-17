import React from 'react';
import { AurexProvider, useAurex } from './context/AurexContext';
import { FinanceCalculatorModal } from './components/FinanceCalculatorModal';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { VehicleCompareModal } from './components/VehicleCompareModal';
import { AboutPage } from './pages/AboutPage';
import { AdminConsolePage } from './pages/AdminConsolePage';
import { AuthPage } from './pages/AuthPage';
import { BrandsPage } from './pages/BrandsPage';
import { ContactPage } from './pages/ContactPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { NewCarsPage } from './pages/NewCarsPage';
import { UsedCarsPage } from './pages/UsedCarsPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';

const AurexShell: React.FC = () => {
  const { route } = useAurex();

  const isStandaloneShell =
    route === 'auth' || route === 'customer-portal' || route === 'admin-portal';

  const renderPage = () => {
    switch (route) {
      case 'home':
        return <HomePage />;
      case 'inventory':
        return <InventoryPage />;
      case 'new-cars':
        return <NewCarsPage />;
      case 'used-cars':
        return <UsedCarsPage />;
      case 'brands':
        return <BrandsPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'vehicle-detail':
        return <VehicleDetailPage />;
      case 'auth':
        return <AuthPage />;
      case 'customer-portal':
        return <CustomerPortalPage />;
      case 'admin-portal':
        return <AdminConsolePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      {!isStandaloneShell && <Navbar />}
      <main className="flex-1">{renderPage()}</main>
      {!isStandaloneShell && <Footer />}
      <FinanceCalculatorModal />
      <VehicleCompareModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AurexProvider>
      <AurexShell />
    </AurexProvider>
  );
}
