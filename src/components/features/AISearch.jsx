import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { callGemini } from '../../services/gemini';
import { products } from '../../data/products'; // Assuming we need to search these
import { useCart } from '../../context/CartContext';

const AISearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const { addToCart } = useCart();

    // Global trigger
    useEffect(() => {
        window.openAISearch = () => setIsOpen(true);
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);

        const prompt = `Buscar: "${query}" no catálogo: ${JSON.stringify(products)}. Retorne apenas IDs em array JSON [id1, id2] sem markdown.`;
        const resText = await callGemini(prompt, "Você é um motor de busca inteligente.");

        try {
            // Clean up potentially markdown wrapped response
            const jsonStr = resText.replace(/```json/g, '').replace(/```/g, '').trim();
            const ids = JSON.parse(jsonStr);
            const found = products.filter(p => ids.includes(p.id));
            setResults(found);
        } catch (e) {
            console.error(e);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] bg-accent/95 flex items-center justify-center p-6 text-white animate-fade-in">
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-white/60 hover:text-white transition-all">
                <X className="w-8 h-8" />
            </button>

            <div className="max-w-2xl w-full text-center">
                <h2 className="text-4xl font-serif font-light mb-4 uppercase tracking-[0.2em]">Busca Inteligente ✨</h2>
                <p className="text-white/70 text-xs uppercase tracking-[0.3em] mb-12">O futuro da curadoria de moda</p>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="O que você deseja vestir hoje?"
                        className="w-full bg-transparent border-b-2 border-white/30 text-2xl py-4 focus:outline-none focus:border-white transition-all text-center font-light placeholder:text-white/20"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="mt-8 bg-white text-accent px-10 py-4 font-bold uppercase text-sm tracking-widest hover:scale-105 transition-all rounded-full shadow-lg"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Descobrir Peças"}
                    </button>
                </div>

                <div className="mt-12 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto custom-scrollbar">
                    {results.map(p => (
                        <div key={p.id} className="bg-white/10 p-4 flex gap-4 items-center rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                            <img src={p.img} alt={p.name} className="w-16 h-16 object-cover rounded" />
                            <div>
                                <h4 className="font-bold text-xs uppercase">{p.name}</h4>
                                <button
                                    onClick={() => { addToCart(p); setIsOpen(false); }}
                                    className="mt-2 text-[10px] font-bold underline hover:text-white/80"
                                >
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                        </div>
                    ))}
                    {!loading && results.length === 0 && query && (
                        <p className="col-span-2 text-center text-white/50 text-xs uppercase tracking-widest mt-4">
                            Tente buscar por "vestido", "bege", "esporte"...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AISearch;
