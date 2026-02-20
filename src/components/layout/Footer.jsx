const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-20 mt-auto">
            <div className="container-custom flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold tracking-tighter text-text uppercase mb-2">
                    V4 <span className="text-accent">Company</span>
                </h2>
                <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em] mb-8 italic">
                    O Cientista do Marketing.
                </p>
                <div className="flex space-x-8 text-xs uppercase tracking-widest text-gray-500 font-light mb-12">
                    <button>Sobre Nós</button>
                    <button>Carreiras</button>
                    <button>Portal do Colaborador</button>
                    <button>Suporte</button>
                </div>
                <p className="text-gray-300 text-[10px] uppercase tracking-widest">
                    © 2024 Todos os Direitos Reservados
                </p>
            </div>
        </footer>
    );
};

export default Footer;
