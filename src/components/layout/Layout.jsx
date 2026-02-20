import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from '../features/CartSidebar';
import AIModal from '../features/AIModal';
import AISearch from '../features/AISearch';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
            <Header />

            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />

            {/* Overlays */}
            <CartSidebar />
            <AIModal />
            <AISearch />
        </div>
    );
};

export default Layout;
