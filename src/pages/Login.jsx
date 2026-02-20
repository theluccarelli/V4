import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const result = login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
            <div className="card-premium max-w-md w-full p-10 animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/5 rounded-3xl mb-6 animate-slide-up">
                        <Lock className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="text-4xl font-black text-text uppercase tracking-tighter mb-2 animate-slide-up delay-100">
                        V4 <span className="text-accent underline decoration-rose-200 decoration-4 underline-offset-8">Scalcon</span>
                    </h2>
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em] mt-6 animate-slide-up delay-200">Plataforma de Acesso Restrito</p>
                </div>

                {error && (
                    <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-bold mb-8 text-center border border-rose-100 animate-slide-up">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up delay-300">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">Email Corporativo</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu.nome@v4company.com"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all duration-300 font-medium text-text placeholder:text-slate-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">Senha de Acesso</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all duration-300 font-medium text-text placeholder:text-slate-300"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary py-4 text-[11px] tracking-[0.2em] shadow-2xl shadow-accent/20">
                        Autenticar Acesso
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-50 text-center animate-slide-up delay-300">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                        Sistema exclusivo para colaboradores <br />da unidade Scalcon • V4 Company.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
