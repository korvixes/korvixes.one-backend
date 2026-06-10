import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { TwinsPage } from './pages/twins/TwinsPage'
import { SimulationsPage } from './pages/SimulationsPage'
import { MonitoringPage } from './pages/MonitoringPage'
import { AIPage } from './pages/AIPage'
import { InfraPage } from './pages/InfraPage'
import { UsersPage } from './pages/UsersPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SecurityPage } from './pages/SecurityPage'
import { PreferencesPage } from './pages/PreferencesPage'
import { DigitalTwinsPage } from './pages/DigitalTwinsPage'
import { TwinDetailPage } from './pages/TwinDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="twins" element={<TwinsPage />} />
            <Route path="twins/*" element={<TwinsPage />} />
            <Route path="simulations" element={<SimulationsPage />} />
            <Route path="simulations/*" element={<SimulationsPage />} />
            <Route path="ai/*" element={<AIPage />} />
            <Route path="infra/*" element={<InfraPage />} />
            <Route path="monitoring/*" element={<MonitoringPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/*" element={<ReportsPage />} />
            <Route path="settings/*" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="preferences" element={<PreferencesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="digital-twins" element={<DigitalTwinsPage />} />
            <Route path="digital-twins/:id" element={<TwinDetailPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
