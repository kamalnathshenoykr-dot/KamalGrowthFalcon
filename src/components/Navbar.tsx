import React from 'react';
import { useApp, ViewTab } from '../context/AppContext';
import {
  Flame,
  LayoutDashboard,
  ShoppingBag,
  ChefHat,
  Bike,
  TrendingUp,
  Landmark,
  Zap,
  Radio,
  Bell,
  Activity,
  Download,
  GitCommit,
  Settings,
} from 'lucide-react';
import { STOCK_OUT_ALERTS } from '../data/mockData';
import { NotificationPanel } from './NotificationPanel';
import { LiveActivityDrawer } from './LiveActivityDrawer';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    demoMode,
    setDemoMode,
    cart,
    orders,
    sosActive,
    liveToast,
    dismissToast,
    notificationsOpen,
    setNotificationsOpen,
    systemActivityOpen,
    setSystemActivityOpen,
  } = useApp();

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activePreparingCount = orders.filter((o) => o.status === 'Preparing' || o.status === 'Placed').length;

  const sosCount = sosActive ? 1 : 0;
  const lateOrdersCount = orders.filter(
    (o) => (o.status === 'Preparing' || o.status === 'Placed') && o.elapsedMinutes > o.targetPrepMinutes
  ).length;
  const totalAlertCount = sosCount + lateOrdersCount + STOCK_OUT_ALERTS.length;

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'customer',
      label: 'Customer',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: cartTotalCount > 0 ? cartTotalCount : undefined,
      badgeColor: 'bg-orange-500 text-white',
    },
    {
      id: 'kitchen',
      label: 'Kitchen',
      icon: <ChefHat className="w-4 h-4" />,
      badge: activePreparingCount > 0 ? `${activePreparingCount}` : undefined,
      badgeColor: 'bg-emerald-500 text-white animate-pulse',
    },
    {
      id: 'rider',
      label: 'Rider',
      icon: <Bike className="w-4 h-4" />,
      badge: 'Fleet',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <Landmark className="w-4 h-4" />,
      badge: 'Bank',
      badgeColor: 'bg-indigo-600 text-indigo-100',
    },
    {
      id: 'flowmap',
      label: 'Flow Map',
      icon: <GitCommit className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-[#3A2E25] border-b border-orange-200/80 shadow-xs">
      {/* Toast Notification Bar */}
      {liveToast && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white text-xs sm:text-sm font-medium py-1.5 px-4 flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 animate-spin text-amber-100" />
            <span>{liveToast}</span>
          </div>
          <button
            onClick={dismissToast}
            className="hover:bg-white/20 px-2 py-0.5 rounded text-xs transition"
          >
            Dismiss ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Pitch */}
          <div
            onClick={() => setCurrentView('overview')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-[#3A2E25] group-hover:text-orange-600 transition-colors">
                  GROWTH <span className="text-[#FF5722]">FALCON</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                  Bengaluru
                </span>
              </div>
              <p className="text-[11px] text-[#7A6A5C] font-medium hidden sm:block">
                Tech Kitchens • Data-Led Growth • Embedded FinTech
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-orange-50/70 p-1 rounded-xl border border-orange-100">
            {tabs.map((tab) => {
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-bold'
                      : 'text-[#7A6A5C] hover:text-[#3A2E25] hover:bg-white/80'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        tab.badgeColor || 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Live activity toggle button */}
            <button
              onClick={() => setSystemActivityOpen((p) => !p)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-orange-200 text-[#7A6A5C] hover:text-orange-600 hover:bg-orange-50 transition"
              title="Open live cross-view activity monitor"
            >
              <Activity className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">Live activity</span>
            </button>

            {/* Central Notification Bell */}
            <button
              onClick={() => setNotificationsOpen((p) => !p)}
              className="relative p-2 rounded-xl bg-white border border-orange-200 text-[#7A6A5C] hover:text-orange-600 hover:bg-orange-50 transition"
              title="Central operational alerts & warnings"
            >
              <Bell className="w-4 h-4 text-[#7A6A5C]" />
              {totalAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {totalAlertCount}
                </span>
              )}
            </button>

            {/* Demo Mode Button */}
            <button
              onClick={() => setDemoMode((prev) => !prev)}
              title="Burst mock orders to test cross-dashboard sync"
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                demoMode
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs animate-pulse'
                  : 'bg-white text-[#7A6A5C] border-orange-200 hover:bg-orange-50'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${demoMode ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Demo:</span>
              <span>{demoMode ? 'BURST' : 'OFF'}</span>
            </button>

            {/* Download Standalone HTML Button */}
            <a
              href="/api/download-html"
              download="growth-falcon-app.html"
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
              title="Download standalone single-file HTML version"
            >
              <Download className="w-3.5 h-3.5" />
              <span>HTML</span>
            </a>

            {/* Rules & Operational Thresholds Gear Icon */}
            <button
              onClick={() => setCurrentView('rules')}
              title="Platform Rules & Operational Thresholds"
              className={`p-2 rounded-xl transition-all border ${
                currentView === 'rules'
                  ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                  : 'bg-white border-orange-200 text-[#7A6A5C] hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile / Medium Tab Navigation (horizontal scrolling bar) */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-1 border-t border-orange-100 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-xs font-bold'
                    : 'text-[#7A6A5C] hover:text-[#3A2E25] bg-orange-50/70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1 bg-black/20 text-white rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Slide-over Panels */}
      <NotificationPanel />
      <LiveActivityDrawer />
    </header>
  );
};
