import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../context/LeadsContext';
import { supabase } from '../lib/supabase';
import { Send, MessageSquare, UserPlus, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const { addLead, meetings, loading: leadsLoading } = useLeads();

    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', company: '' });

    // Initial Load
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Posts
                const { data: postsData, error: postsError } = await supabase
                    .from('posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!postsError) setPosts(postsData || []);

                // Fetch Notes
                if (user) {
                    const { data: notesData, error: notesError } = await supabase
                        .from('notes')
                        .select('content')
                        .eq('user_name', user.name)
                        .single();

                    if (!notesError && notesData) setNotes(notesData.content);
                }
            } catch (err) {
                console.error('Erro no Dashboard load:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Save Notes debounced
    useEffect(() => {
        if (!user) return;

        const saveNotes = async () => {
            setIsSaving(true);
            await supabase
                .from('notes')
                .upsert({ user_name: user.name, content: notes }, { onConflict: 'user_name' });
            setIsSaving(false);
        };

        const timer = setTimeout(saveNotes, 1000);
        return () => clearTimeout(timer);
    }, [notes, user]);

    const handlePost = async () => {
        if (!newPost.trim() || !user) return;

        const post = {
            author: user.name,
            role: user.role || 'SDR',
            content: newPost,
            likes: 0
        };

        const { data, error } = await supabase
            .from('posts')
            .insert([post])
            .select();

        if (error) {
            console.error('Error posting:', error);
            return;
        }

        setPosts([data[0], ...posts]);
        setNewPost('');
    };

    const handleSubmitLead = async (e) => {
        e.preventDefault();
        const success = await addLead(newLead);
        if (success) setNewLead({ name: '', company: '' });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading || leadsLoading) {
        return (
            <div className="bg-secondary min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <p className="text-xs font-black uppercase tracking-[0.4em] text-text-muted">Sincronizando Feed...</p>
            </div>
        );
    }

    return (
        <div className="bg-secondary min-h-[calc(100vh-80px)] py-10">
            <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* News Feed Section (2/3) */}
                <div className="lg:col-span-2 space-y-8 animate-fade-in">
                    <div className="card-premium p-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-black text-xl">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 space-y-4">
                                <textarea
                                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all border border-slate-100 placeholder:text-slate-300"
                                    placeholder="O que está acontecendo na unidade hoje?"
                                    rows="3"
                                    value={newPost}
                                    onChange={e => setNewPost(e.target.value)}
                                />
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={handlePost}
                                        className="btn-primary ml-auto px-8 py-2.5 flex items-center gap-2 group text-[10px] uppercase font-black"
                                    >
                                        Publicar Insight <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div key={post.id} className="card-premium border-l-4 border-l-accent animate-slide-up">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400">
                                            {post.author?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text text-sm">{post.author}</h4>
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{post.role || 'Membro'}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300">
                                        {formatTime(post.created_at)}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                    {post.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Column (1/3) */}
                <div className="space-y-8 animate-slide-up delay-200">

                    {/* Lead Recommendation Widget */}
                    <div className="card-premium">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <UserPlus className="w-4 h-4 text-accent" />
                            </div>
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text">Indicar Lead</h2>
                        </div>
                        <form onSubmit={handleSubmitLead} className="space-y-4">
                            <input
                                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs focus:ring-2 focus:ring-accent/10 transition-all"
                                placeholder="Nome do Lead"
                                required
                                value={newLead.name}
                                onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                            />
                            <input
                                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs focus:ring-2 focus:ring-accent/10 transition-all"
                                placeholder="Empresa"
                                required
                                value={newLead.company}
                                onChange={e => setNewLead({ ...newLead, company: e.target.value })}
                            />
                            <button type="submit" className="w-full btn-primary py-3 text-[10px] uppercase tracking-widest font-black">
                                Adicionar à Base
                            </button>
                        </form>
                    </div>

                    {/* Upcoming Meetings Widget */}
                    <div className="card-premium">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Calendar className="w-4 h-4 text-emerald-500" />
                                </div>
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text">Próximas Reuniões</h2>
                            </div>
                            <Link to="/meetings" className="text-[9px] font-black text-accent uppercase tracking-widest hover:underline">Ver todas</Link>
                        </div>
                        <div className="space-y-4">
                            {meetings && meetings.filter(m => m.status === 'Agendada').slice(0, 3).length > 0 ? (
                                meetings.filter(m => m.status === 'Agendada').slice(0, 3).map(meeting => (
                                    <div key={meeting.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 group">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-xs text-text truncate pr-2 group-hover:text-accent transition-colors">
                                                {meeting.company_name || meeting.company}
                                            </h4>
                                            <span className="text-[8px] font-black text-accent uppercase">
                                                {meeting.meeting_date ? new Date(meeting.meeting_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'S/D'}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-text-muted font-black uppercase truncate italic">SDR: {meeting.sdr_name}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="py-6 text-center opacity-40 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted">Vazio</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Anotações Section */}
                    <div className="card-premium group">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text">Anotações</h2>
                            <Loader2 className={`w-3 h-3 text-accent animate-spin transition-opacity ${isSaving ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <textarea
                            className="w-full bg-transparent text-sm text-slate-600 focus:outline-none min-h-[250px] resize-none font-medium leading-relaxed"
                            placeholder="Notas privadas..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
