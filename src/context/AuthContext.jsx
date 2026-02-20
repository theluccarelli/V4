import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Check storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('v4_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else if (location.pathname !== '/login') {
            navigate('/login');
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

    const login = (email, password) => {
        if (!email.endsWith('@v4company.com')) {
            return { success: false, message: 'Acesso restrito para e-mails @v4company.com' };
        }
        // Hardcoded password for "investor/manager" access as requested
        if (password !== 'v4scalcon2024') {
            return { success: false, message: 'Senha incorreta.' };
        }

        const userData = { email, name: email.split('@')[0], role: 'Investidor' };
        setUser(userData);
        localStorage.setItem('v4_user', JSON.stringify(userData));
        navigate('/');
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('v4_user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
