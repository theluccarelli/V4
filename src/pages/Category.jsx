import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const Category = () => {
    const { categoryName } = useParams();
    const { addToCart } = useCart();

    const filteredProducts = products.filter(p => p.category === categoryName);

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <section className="bg-secondary py-20 px-4">
                <div className="container-custom">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 mb-10">
                        <Link to="/" className="hover:text-accent">Início</Link>
                        <span>/</span>
                        <span className="text-accent font-bold">{categoryName}</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-6xl font-serif font-light text-text uppercase tracking-tighter mb-6">
                                {categoryName}
                            </h2>
                            <p className="text-text-light font-light text-sm leading-relaxed max-w-md">
                                Uma seleção que transcende tendências, focada na essência da coleção {categoryName?.toLowerCase()}.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-20 px-4">
                <div className="container-custom grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {filteredProducts.map(p => (
                        <div key={p.id} className="group cursor-pointer">
                            <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                                <img
                                    src={p.img}
                                    alt={p.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <button
                                    onClick={() => addToCart(p)}
                                    className="absolute bottom-0 left-0 right-0 bg-accent text-white py-4 text-[10px] font-bold uppercase tracking-widest translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black"
                                >
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-sm font-serif font-medium hover:text-accent transition-colors">{p.name}</h3>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{p.category}</p>
                                </div>
                                <p className="text-sm font-bold text-accent font-serif italic">R$ {p.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        Nenhum produto encontrado nesta categoria.
                    </div>
                )}
            </section>
        </div>
    );
};

export default Category;
