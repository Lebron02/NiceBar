import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { useShop } from '../../services/ShopContext';
import { getImageUrl } from '../../services/config';
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SingleProduct = () => {
    const { slug } = useParams();
    const { api } = useAuth();
    const { addToCart } = useShop();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/products/${slug}`);
            setProduct(response.data);
        } catch (err) {
            console.error("Błąd pobierania produktu:", err);
            setError("Nie udało się pobrać produktu (lub nie istnieje).");
        } finally {
            setLoading(false);
        }
    }, [slug, api]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    if (loading) return <div className="p-10 text-center">Ładowanie produktu...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!product) return <div className="p-10 text-center">Produkt nie znaleziony.</div>;

    return (
        <div className="container mx-auto p-6 mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                <div className="w-full flex justify-center">
                    {product.images && product.images.length > 0 ? (
                        <Carousel className="w-full max-w-lg">
                            <CarouselContent>
                                {product.images.map((img, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-white shadow-sm">
                                                <img 
                                                    src={getImageUrl(img)} 
                                                    alt={`${product.name} - zdjęcie ${index + 1}`} 
                                                    className="w-full h-full object-contain p-2" 
                                                />
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            
                            {product.images.length > 1 && (
                                <>
                                    <CarouselPrevious className="left-2" />
                                    <CarouselNext className="right-2" />
                                </>
                            )}
                        </Carousel>
                    ) : (
                        <div className="aspect-square w-full max-w-lg bg-gray-100 flex items-center justify-center rounded-xl text-gray-400">
                            Brak zdjęć produktu
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            {product.name}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Marka: <span className="font-semibold text-gray-700">{product.brand}</span>
                        </p>
                        {product.category && (
                            <p className="text-sm text-gray-500">
                                Kategoria: <span className="font-semibold text-gray-700">{product.category.name || product.category}</span>
                            </p>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-3xl font-bold text-blue-600">
                            {product.price} PLN
                        </p>
                        
                        <div className={`mt-2 text-sm font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.countInStock > 0 ? 'Produkt dostępny' : 'Produkt niedostępny'}
                        </div>
                    </div>

                    <div className="prose prose-sm text-gray-500">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Opis produktu</h3>
                        <p className="whitespace-pre-line leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <Button 
                            className="w-full md:w-auto px-8 py-6 text-lg" 
                            disabled={product.countInStock === 0}
                            onClick={() => {
                                addToCart(product, 1); 
                                alert("Dodano produkt do koszyka!"); 
                            }}
                        >
                            {product.countInStock > 0 ? 'Dodaj do koszyka' : 'Wyprzedane'}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SingleProduct;