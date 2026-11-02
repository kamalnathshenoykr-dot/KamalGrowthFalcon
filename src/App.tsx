import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OverviewView } from './views/OverviewView';
import { CustomerAppView } from './views/CustomerAppView';
import { KitchenDashboardView } from './views/KitchenDashboardView';
import { RiderView } from './views/RiderView';
import { MarketingView } from './views/MarketingView';
import { PartnerFinanceView } from './views/PartnerFinanceView';
import { FlowMapView } from './views/FlowMapView';
import { RulesView } from './views/RulesView';
import { CelebrationModal } from './components/CelebrationModal';
import { ScenarioSimulatorModal } from './components/ScenarioSimulatorModal';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {currentView === 'overview' && <OverviewView />}
      {currentView === 'customer' && <CustomerAppView />}
      {currentView === 'kitchen' && <KitchenDashboardView />}
      {currentView === 'rider' && <RiderView />}
      {currentView === 'marketing' && <MarketingView />}
      {currentView === 'finance' && <PartnerFinanceView />}
      {currentView === 'flowmap' && <FlowMapView />}
      {currentView === 'rules' && <RulesView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#FFF8EE] text-[#3A2E25] flex flex-col font-sans selection:bg-orange-500 selection:text-white">
        <Navbar />
        <MainContent />
        <Footer />
        <CelebrationModal />
        <ScenarioSimulatorModal />
      </div>
    </AppProvider>
  );
}
