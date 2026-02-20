import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from '../features/CartSidebar';
import AIModal from '../features/AIModal';
import AISearch from '../features/AISearch';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
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
