import { X, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartSidebar = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, cartTotal } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={toggleCart}
            />

            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold uppercase tracking-widest text-text">Seu Carrinho</h3>
                    <button onClick={toggleCart} className="p-2 hover:bg-gray-50 rounded-full">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-20 text-gray-300 font-light italic">
                            Seu carrinho está vazio.
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-bold uppercase text-text">{item.name}</h4>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">Qtd: {item.quantity}</p>
                                        <p className="text-sm font-bold text-accent">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">Total</span>
                        <span className="text-xl font-bold text-accent">R$ {cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="w-full btn-primary">
                        Finalizar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
