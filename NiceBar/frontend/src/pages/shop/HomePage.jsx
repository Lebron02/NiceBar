import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config'; 

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
        return <div>Ładowanie produktów...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h1 className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance py-10">Sklep</h1>
            
        
            <div className="container mx-auto px-6 pb-10">
                {products.length === 0 ? (
                    <p>Nie ma jeszcze żadnych produktów</p>
                ) : (
                    <div className='grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 w-full'>
                        {products.map((product) => (
                            <Link to={`/products/${product.slug}`} key={product._id} className="group">
                                <div className='relative overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg h-full flex flex-col bg-white border'>
                                    <div className="relative w-full aspect-video overflow-hidden">
                                        <img 
                                            alt={product.title} 
                                            src={getImageUrl(product.images?.[0])}
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                            {product.category?.name || 'Brak kategorii'}
                                        </p>
                                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                            {product.price} PLN
                                        </p>
                                        <div className="flex-1"></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    )
                }
            </div>
        </div>
           
    )
}

export default HomePage;