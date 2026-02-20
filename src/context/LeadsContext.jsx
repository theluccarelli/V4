import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const LeadsContext = createContext();

export const useLeads = () => useContext(LeadsContext);

export const LeadsProvider = ({ children }) => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Busca inicial de dados
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            console.log('Iniciando busca detalhada em "leads"...');

            try {
                console.log('DEBUG: Conectando ao Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
                const { data, error, status, statusText } = await supabase
                    .from('leads')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('ERRO DETALHADO NO SELECT:', {
                        message: error.message,
                        details: error.details,
                        hint: error.hint,
                        code: error.code,
                        status,
                        statusText
                    });

                    let msg = `Erro no Select: ${error.message}`;
                    if (error.message === 'Failed to fetch') {
                        msg = 'ERRO DE CONEXÃO (Failed to fetch): O navegador não conseguiu alcançar o Supabase. Verifique Ad-blockers, Firewall ou VPN.';
                    }
                    alert(msg);
                } else {
                    console.log('Dados buscados com sucesso. Total:', data?.length);
                    setLeads(data || []);
                }
            } catch (err) {
                console.error('CATCH DETALHADO NO FETCH:', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
                alert(`Erro Crítico de Rede: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (supabase) {
            fetchData();
        }
    }, []);

    // Função de inserção estritamente alinhada com o pedido do usuário
    const addMeeting = async (meetingData) => {
        console.log('Iniciando insert na tabela "leads"...');
        try {
            const entry = {
                company_name: String(meetingData.company_name),
                cnpj: String(meetingData.cnpj),
                meeting_date: meetingData.meeting_date, // Formato esperado pelo Postgres (YYYY-MM-DD)
                status: String(meetingData.status || 'Agendada')
            };

            console.log('Objeto enviado ao Supabase:', entry);

            const { data, error, status, statusText } = await supabase
                .from('leads')
                .insert([entry])
                .select();

            if (error) {
                console.error('ERRO DETALHADO NO INSERT:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code,
                    status,
                    statusText
                });
                alert(`Erro ao Salvar: ${error.message}`);
                return false;
            }

            if (data && data[0]) {
                console.log('Registro inserido com sucesso:', data[0]);
                setLeads(prev => [data[0], ...prev]);
                return true;
            }
            return false;
        } catch (err) {
            console.error('CATCH DETALHADO NO INSERT:', {
                name: err.name,
                message: err.message,
                stack: err.stack
            });
            alert(`Falha de Conexão no Envio: ${err.message}`);
            return false;
        }
    };

    const updateLeadStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('leads')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
            return true;
        } catch (err) {
            console.error('Erro no update status:', err);
            return false;
        }
    };

    const toggleMeetingHeld = (id) => {
        const item = leads.find(l => l.id === id);
        if (!item) return;
        const nextStatus = item.status === 'Realizada' ? 'Agendada' : 'Realizada';
        return updateLeadStatus(id, nextStatus);
    };

    const toggleMeetingNoShow = (id) => {
        const item = leads.find(l => l.id === id);
        if (!item) return;
        const nextStatus = item.status === 'No-Show' ? 'Agendada' : 'No-Show';
        return updateLeadStatus(id, nextStatus);
    };

    const deleteMeeting = async (id) => {
        try {
            const { error } = await supabase.from('leads').delete().eq('id', id);
            if (error) throw error;
            setLeads(prev => prev.filter(l => l.id !== id));
            return true;
        } catch (err) {
            console.error('Erro ao deletar:', err);
            return false;
        }
    };

    return (
        <LeadsContext.Provider value={{
            leads,
            addMeeting,
            updateLeadStatus,
            toggleMeetingHeld,
            toggleMeetingNoShow,
            deleteMeeting,
            meetings: leads.filter(l => l.meeting_date),
            loading
        }}>
            {children}
        </LeadsContext.Provider>
    );
};
