import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import { callGemini } from '../../services/gemini';

const AIModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        text: "Bem-vindo à curadoria Classym. Em que posso ajudar no seu estilo hoje?",
        isUser: false
    }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('openAIModal', handleOpen);
        // Also listen for a custom event we dispatched in Home.jsx (commented out there, but good to have)
        return () => window.removeEventListener('openAIModal', handleOpen);
    }, []);

    // Dirty hack to expose open function to global scope for now if needed, 
    // but better to use Context or Event. For now, let's just use the event listener 
    // and ensuring buttons dispatch it.
    // Actually, let's make a global trigger for simplicity in this migration phase
    useEffect(() => {
        window.openAIStylist = () => setIsOpen(true);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const q = input.trim();
        setMessages(prev => [...prev, { text: q, isUser: true }]);
        setInput("");
        setLoading(true);

        const response = await callGemini(q, "Você é um assistente inteligente da V4 Company (Assessoria de Marketing). Ajude os colaboradores com dúvidas sobre processos, marketing e vendas. Seja formal e direto.");

        setMessages(prev => [...prev, { text: response, isUser: false }]);
        setLoading(false);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-xl w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/50 shadow-2xl">
                {/* Header */}
                <div className="p-6 bg-accent text-white flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-xl -translate-x-10 -translate-y-10"></div>
                    <div className="flex items-center gap-3 z-10">
                        <Sparkles className="w-6 h-6 text-white" />
                        <div>
                            <h3 className="font-bold text-lg uppercase tracking-widest">IA V4 Company</h3>
                            <p className="text-[10px] text-white/80 uppercase tracking-tighter">Assistente Inteligente</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform z-10 text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50 min-h-[300px]">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 rounded-lg max-w-[85%] text-sm font-light leading-relaxed shadow-sm ${msg.isUser ? 'bg-accent text-white' : 'bg-white border border-gray-100 text-gray-700'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-center gap-2 text-accent">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs font-bold uppercase tracking-widest">Digitando...</span>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-grow px-4 py-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                            placeholder="Descreva sua ocasião ou estilo..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="bg-accent text-white p-3 rounded-md hover:bg-accent-hover transition-colors">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIModal;
