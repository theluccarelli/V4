import { Link, useLocation } from 'react-router-dom';
import { LogOut, Sun, Moon, Calendar, LayoutGrid, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();

    const isActive = (path) => location.pathname === path
        ? 'text-accent border-b-2 border-accent'
        : `${isDark ? 'text-slate-400 hover:text-accent hover:bg-slate-700' : 'text-slate-500 hover:text-accent hover:bg-slate-50'} rounded-xl px-4`;

    return (
        <header className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-all duration-300 ${isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-100'}`}>
            <div className="container-custom h-20 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-accent flex items-center justify-center rounded text-white font-bold text-lg">V4</div>
                    <div className="flex flex-col">
                        <h1 className={`text-lg font-bold leading-none tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Scalcon
                        </h1>
                        <span className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Plataforma Interna</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-8">
                    <Link to="/" className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest py-7 transition-all ${isActive('/')}`}>
                        <LayoutGrid className="w-4 h-4" />
                        Geral
                    </Link>
                    <Link to="/acquisition" className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest py-7 transition-all ${isActive('/acquisition')}`}>
                        <Users className="w-4 h-4" />
                        Aquisição
                    </Link>
                    <Link to="/meetings" className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest py-7 transition-all ${isActive('/meetings')}`}>
                        <Calendar className="w-4 h-4" />
                        Reuniões
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{user?.name}</p>
                        <p className={`text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{user?.role}</p>
                    </div>
                    <div className={`h-8 w-px mx-2 ${isDark ? 'bg-slate-600' : 'bg-gray-200'}`}></div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-yellow-400' : 'hover:bg-gray-100 text-slate-500'}`}
                        title={isDark ? 'Modo Claro' : 'Modo Escuro'}
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={logout}
                        className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400' : 'hover:bg-gray-50 text-gray-400 hover:text-red-500'}`}
                        title="Sair"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
