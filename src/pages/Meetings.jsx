import { useState } from 'react';
import { useLeads } from '../context/LeadsContext';
import { Calendar, Building2, FileText, CheckCircle2, Trash2, UserX, Loader2, Plus } from 'lucide-react';

const Meetings = () => {
    const { meetings, addMeeting, toggleMeetingHeld, toggleMeetingNoShow, deleteMeeting, loading } = useLeads();
    const [formData, setFormData] = useState({ company_name: '', cnpj: '', meeting_date: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Tentando cadastrar reunião:', formData);

        if (!formData.company_name || !formData.cnpj || !formData.meeting_date) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            setSubmitting(true);
            const success = await addMeeting(formData);
            if (success) {
                setFormData({ company_name: '', cnpj: '', meeting_date: '' });
                alert('Reunião agendada com sucesso!');
            }
        } catch (err) {
            console.error('Erro no componente Meetings:', err);
            alert('Falha na comunicação com o banco.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-secondary min-h-[calc(100vh-80px)] py-10">
            <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Add Meeting Form */}
                <div className="lg:col-span-1">
                    <div className="card-premium sticky top-24">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text">Agendar Reunião</h2>
                                <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Registro da Unidade</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Empresa</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        className="w-full bg-slate-50 p-4 pl-12 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all"
                                        placeholder="Nome da Empresa"
                                        required
                                        value={formData.company_name}
                                        onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">CNPJ</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        className="w-full bg-slate-50 p-4 pl-12 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all font-mono"
                                        placeholder="00.000.000/0000-00"
                                        required
                                        value={formData.cnpj}
                                        onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Data da Reunião</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 p-4 pl-12 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all"
                                        required
                                        value={formData.meeting_date}
                                        onChange={e => setFormData({ ...formData, meeting_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full btn-primary py-4 mt-4 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                {submitting ? 'Salvando...' : 'Confirmar Agendamento'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Meetings Feed */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-2">Linha do Tempo</h2>
                            <h1 className="text-3xl font-black text-text tracking-tighter uppercase">Gestão de Reuniões</h1>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-text-muted italic">
                            {(meetings || []).length} Registradas
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4">
                                <Loader2 className="w-10 h-10 animate-spin" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Sincronizando Reuniões...</p>
                            </div>
                        ) : (meetings || []).length > 0 ? (
                            meetings.map((meeting) => (
                                <div key={meeting.id} className={`card-premium border-l-4 transition-all duration-300 group ${meeting.status === 'Realizada' ? 'border-l-emerald-500' : meeting.status === 'No-Show' ? 'border-l-red-500' : 'border-l-accent'}`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${meeting.status === 'Realizada' ? 'bg-emerald-50 text-emerald-500' : meeting.status === 'No-Show' ? 'bg-red-50 text-red-500' : 'bg-accent/5 text-accent'}`}>
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-text group-hover:text-accent transition-colors">{meeting.company_name}</h3>
                                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${meeting.status === 'Realizada' ? 'bg-emerald-500 text-white' : meeting.status === 'No-Show' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        {meeting.status}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">CNPJ: {meeting.cnpj} • Data: {meeting.meeting_date ? new Date(meeting.meeting_date).toLocaleDateString('pt-BR') : 'Sem data'}</p>
                                                <p className="text-[9px] text-accent font-black uppercase tracking-widest mt-1">SDR: {meeting.sdr_name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleMeetingHeld(meeting.id)}
                                                className={`flex-1 md:flex-none px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${meeting.status === 'Realizada' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'}`}
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                {meeting.status === 'Realizada' ? 'Realizada' : 'Marcar Realizada'}
                                            </button>

                                            <button
                                                onClick={() => toggleMeetingNoShow(meeting.id)}
                                                className={`px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${meeting.status === 'No-Show' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-red-500 hover:text-red-500'}`}
                                            >
                                                <UserX className="w-3.5 h-3.5" />
                                                {meeting.status === 'No-Show' ? 'No-Show' : 'Marcar No-Show'}
                                            </button>

                                            <button
                                                onClick={() => deleteMeeting(meeting.id)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card-premium border-dashed py-20 text-center opacity-40">
                                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Nenhuma reunião registrada pela unidade.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Meetings;
