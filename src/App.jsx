import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Acquisition from './pages/Acquisition';
import Meetings from './pages/Meetings';
import { AuthProvider } from './context/AuthContext';
import { LeadsProvider } from './context/LeadsContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <LeadsProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="acquisition" element={<Acquisition />} />
                <Route path="meetings" element={<Meetings />} />
              </Route>
            </Routes>
          </LeadsProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
