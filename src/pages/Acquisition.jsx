import { useLeads } from '../context/LeadsContext';
import { Mail, MessageCircle, Clock, AlertCircle, Calendar as CalendarIconLucide, Users as UsersIcon, Trophy, Medal, Loader2 } from 'lucide-react';

const Acquisition = () => {
    const { leads, sdrPerformance, loading } = useLeads();

    if (loading) {
        return (
            <div className="bg-secondary min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <p className="text-xs font-black uppercase tracking-[0.4em] text-text-muted">Sincronizando Dados da Unidade...</p>
            </div>
        );
    }

    // Sort performance for ranking
    const sortedRanking = [...(sdrPerformance || [])].sort((a, b) => b.meetings - a.meetings);

    // Filter for Daily Tasks (e.g., leads in stage > 2 days and NOT held meetings)
    const activeLeads = (leads || []).filter(l => l.status !== 'Perdido' && l.status !== 'Ganho' && l.status !== 'Realizada');
    const dailyTasks = activeLeads.filter(lead => (lead.days_in_stage || 0) >= 2);

    const handleEmail = (lead) => {
        const subject = `V4 Company - Proposta Comercial para ${lead.company_name || lead.company}`;
        const body = `Olá,\n\nSegue conforme conversamos a proposta da V4 Company.\n\nAtenciosamente,\nTime Scalcon.`;
        window.open(`mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    const handleWhatsApp = (lead) => {
        const text = `Olá, aqui é da V4 Company Scalcon. Tudo bem?`;
        window.open(`https://wa.me/${lead.phone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="bg-secondary min-h-[calc(100vh-80px)] py-10">
            <div className="container-custom">
                {/* Ranking Section */}
                <div className="mb-14 animate-fade-in">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-2">Performance Comercial</h2>
                            <h1 className="text-3xl font-black text-text tracking-tighter uppercase">Ranking Mensal <span className="text-slate-300">/ Fev</span></h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {sortedRanking.length > 0 ? sortedRanking.map((sdr, index) => {
                            const isTop3 = index < 3;
                            const tierColor = index === 0 ? 'text-amber-500 bg-amber-50' :
                                index === 1 ? 'text-slate-400 bg-slate-50' :
                                    index === 2 ? 'text-orange-400 bg-orange-50' :
                                        'text-slate-300 bg-slate-50';

                            return (
                                <div key={sdr.id} className={`card-premium group relative overflow-hidden transition-all duration-500 hover:-translate-y-1 ${index === 0 ? 'border-amber-200 ring-2 ring-amber-100/50' : ''}`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${tierColor} shadow-inner`}>
                                            {index + 1}º
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text text-sm leading-tight">{sdr.name}</h4>
                                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{sdr.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Reuniões</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-text leading-none">{sdr.meetings}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="md:col-span-4 card-premium text-center py-10 border-dashed opacity-50">
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Aguardando registros da unidade...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* KPI Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-slide-up">
                    <div className="card-premium flex items-center justify-between overflow-hidden relative">
                        <div className="relative z-10">
                            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-extrabold mb-1">Leads Ativos</p>
                            <h3 className="text-4xl font-extrabold text-text tracking-tighter">{activeLeads.length}</h3>
                        </div>
                        <UsersIcon className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 rotate-12" />
                    </div>

                    <div className="card-premium flex items-center justify-between overflow-hidden relative border-l-4 border-l-rose-500">
                        <div className="relative z-10">
                            <p className="text-[10px] text-rose-500 uppercase tracking-[0.2em] font-extrabold mb-1">FUPs Atrasados</p>
                            <h3 className="text-4xl font-extrabold text-rose-600 tracking-tighter">{dailyTasks.length}</h3>
                        </div>
                        <AlertCircle className="w-20 h-20 text-rose-50 absolute -right-4 -bottom-4 rotate-12" />
                    </div>

                    <div className="card-premium flex items-center justify-between overflow-hidden relative border-l-4 border-l-emerald-500">
                        <div className="relative z-10">
                            <p className="text-[10px] text-emerald-500 uppercase tracking-[0.2em] font-extrabold mb-1">Agendamentos</p>
                            <h3 className="text-4xl font-extrabold text-emerald-600 tracking-tighter">
                                {leads.filter(l => l.status === 'Agendada').length}
                            </h3>
                        </div>
                        <CalendarIconLucide className="w-20 h-20 text-emerald-50 absolute -right-4 -bottom-4 rotate-12" />
                    </div>
                </div>

                {/* Leads Table */}
                <div className="card-premium p-0 overflow-hidden animate-slide-up delay-200">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text mb-1">Funil de Aquisição</h2>
                            <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Base de dados Scalcon</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] text-text-muted uppercase tracking-[0.2em]">
                                    <th className="p-6 font-black border-b border-slate-100">Nome / Empresa</th>
                                    <th className="p-6 font-black border-b border-slate-100">Status</th>
                                    <th className="p-6 font-black border-b border-slate-100">Info</th>
                                    <th className="p-6 font-black border-b border-slate-100 text-center">Interação</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {leads.length > 0 ? leads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-all duration-300 border-b border-slate-50 last:border-0 group">
                                        <td className="p-6">
                                            <p className="font-bold text-text group-hover:text-accent transition-colors">{lead.name || 'Empresa Direta'}</p>
                                            <p className="text-[10px] text-text-muted font-semibold tracking-wider uppercase">{lead.company_name || lead.company}</p>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em]
                        ${lead.status === 'Novo' ? 'bg-blue-50 text-blue-600' :
                                                    lead.status === 'Realizada' ? 'bg-emerald-50 text-emerald-600' :
                                                        lead.status === 'No-Show' ? 'bg-rose-50 text-rose-600' :
                                                            'bg-slate-100 text-slate-500'}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            {lead.meeting_date ? (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-accent" />
                                                    <span className="text-xs font-bold text-accent">
                                                        {new Date(lead.meeting_date).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-text-muted font-bold uppercase">{lead.next_step || 'Aguardando'}</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleEmail(lead)}
                                                    className="w-10 h-10 border-2 border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-text hover:text-white hover:border-text transition-all duration-300"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleWhatsApp(lead)}
                                                    className="w-10 h-10 border-2 border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="p-20 text-center opacity-30">
                                            <UsersIcon className="w-10 h-10 mx-auto mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Nenhum dado encontrado.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Acquisition;
