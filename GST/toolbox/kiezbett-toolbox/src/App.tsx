import './App.css'
import Layout from './components/layout.component'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard.page';
import Settings from './pages/settings.page';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider } from './context/auth.context';
import LoginPage from './pages/login.page';
import ProtectedRoute from './context/protected-route.context';
import Orders from './pages/orders.page';
import PublicOrderPage from './pages/public-order.page';
import PublicOrdersPage from './pages/public-orders.page';
import { Toaster } from 'sonner';

function App() {

  return (
    <Router>
      <AuthProvider>
        <TooltipProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/public/order/:token" element={<PublicOrderPage />} />
              <Route path="/public/orders/:token" element={<PublicOrdersPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders/open" element={<Orders filter="Offen" />} />
                <Route path="/orders/paid" element={<Orders filter="Bezahlt" />} />
                <Route path="/orders/in-progress" element={<Orders filter="In Produktion" />} />
                <Route path="/orders/shipping" element={<Orders filter="Im Versand" />} />
                <Route path="/orders/completed" element={<Orders filter="Abgeschlossen" />} />

                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </Layout>
        </TooltipProvider>
      </AuthProvider>
      <Toaster />
    </Router>

  )
}

export default App
