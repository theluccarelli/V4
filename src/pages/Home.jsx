import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const categories = [
        { name: 'Growth', className: 'col-span-2 row-span-2', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop' },
        { name: 'Vendas', className: 'row-span-2', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop' },
        { name: 'Gestão', className: '', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Marketing', className: '', img: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=2076&auto=format&fit=crop' }
    ];
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[80vh] bg-stone-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 px-6 py-2 rounded-full mb-8 shadow-sm">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Portal Interno</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-serif font-light text-text mb-6 leading-tight uppercase tracking-tighter">
                            V4 Company.
                        </h2>

                        <p className="text-text-light mb-10 text-lg font-light max-w-xl mx-auto">
                            Plataforma exclusiva para colaboradores e gestores. Acompanhe métricas, processos e a evolução do negócio.
                        </p>

                        <button
                            //   onClick={() => window.dispatchEvent(new CustomEvent('openAIModal'))}
                            className="btn-primary"
                        >
                            Acessar Inteligência V4
                        </button>
                    </div>
                </div>

                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                        className="w-full h-full object-cover"
                        alt="Hero Background"
                    />
                </div>
            </section>

            {/* Bento Grid */}
            <section className="py-24 px-4 bg-white">
                <div className="container-custom">
                    <h3 className="text-3xl font-serif text-center mb-16 tracking-widest uppercase">Áreas de Negócio</h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
                        {categories.map((cat) => (
                            <div
                                key={cat.name}
                                onClick={() => navigate(`/category/${cat.name}`)}
                                className={`${cat.className} group relative overflow-hidden rounded-2xl cursor-pointer bg-gray-100`}
                            >
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors z-10" />

                                <div className="absolute bottom-6 left-6 z-20">
                                    <h3 className="text-white text-2xl font-serif font-light mb-2 tracking-tighter">
                                        {cat.name}
                                    </h3>
                                    <span className="text-white text-[10px] uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-all">
                                        Explorar
                                    </span>
                                </div>

                                <img
                                    src={cat.img}
                                    alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
