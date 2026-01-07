import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config'; 
import { ShoppingBag } from 'lucide-react';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {api} = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get('/products');
                setProducts(response.data)
            } catch (err) {
                setError("Nie udało się pobrać produktów")
                console.error(err);
            } finally {
                setLoading(false);
            };
        }

        fetchProducts();

    }, [api]);

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Ładowanie produktów...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300">
            <div className="bg-slate-900/50 border-b border-slate-800 py-16 mb-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
                        Sklep Barmański
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Profesjonalne akcesoria i wyselekcjonowane produkty dla Twojego domowego baru.
                    </p>
                </div>
            </div>
            
            <div className="container mx-auto px-6 pb-20">
                {products.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Nie ma jeszcze żadnych produktów</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {products.map((product) => (
                            <Link to={`/products/${product.slug}`} key={product._id} className="group block h-full">
                                <div className='bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-900/10 hover:border-slate-700 transition-all duration-300 h-full flex flex-col'>
                                    
                                    <div className="w-full aspect-square overflow-hidden bg-slate-950 relative">
                                        <img 
                                            alt={product.title} 
                                            src={getImageUrl(product.images?.[0])}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="mb-2">
                                            <span className="text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">
                                                {product.category?.name || 'Akcesoria'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800">
                                            <p className="text-xl font-bold text-white">
                                                {Number(product.price).toFixed(2)} <span className="text-sm font-normal text-slate-500">PLN</span>
                                            </p>
                                            <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                                                Zobacz &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage;