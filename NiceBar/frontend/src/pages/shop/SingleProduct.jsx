import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { useShop } from '../../services/ShopContext';
import { getImageUrl } from '../../services/config';
import { toast } from "sonner"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card"; 
import { FileText, ShoppingCart, PackageCheck, AlertCircle, Plus, Minus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const SingleProduct = () => {
  const { slug } = useParams();
  const { api } = useAuth();
  const { addToCart } = useShop();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stan dla wybranej ilości
  const [qty, setQty] = useState(1);

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

  // Funkcje obsługi licznika
  const increaseQty = () => {
    if (product && qty < product.countInStock) {
        setQty(prev => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
        setQty(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
      const success = addToCart(product, qty);
      
      if (success) {
        toast.success("Dodano do koszyka", {
            description: `${qty}x ${product.name} znajduje się w Twoim koszyku.`,
            action: {
                label: "Pokaż koszyk",
                onClick: () => navigate('/cart')
            }
        });
      }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Ładowanie produktu...</div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Produkt nie znaleziony.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12">
      <div className="container mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* Galeria */}
          <div className="w-full flex justify-center">
            {product.images && product.images.length > 0 ? (
              <Carousel className="w-full max-w-lg">
                <CarouselContent>
                  {product.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6">
                          <img
                            src={getImageUrl(img)}
                            alt={`${product.name} - zdjęcie ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {product.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2 bg-slate-800 border-slate-700 text-white hover:bg-slate-700" />
                    <CarouselNext className="right-2 bg-slate-800 border-slate-700 text-white hover:bg-slate-700" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="aspect-square w-full max-w-lg bg-slate-900 border border-slate-800 flex items-center justify-center rounded-2xl text-slate-600">
                Brak zdjęć produktu
              </div>
            )}
          </div>

          {/* Szczegóły produktu */}
          <div className="space-y-8">
            <div>
              <div className="mb-4">
                 {product.category && (
                  <span className="text-blue-400 text-sm font-semibold tracking-wide uppercase">
                    {product.category.name || product.category}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-slate-400">
                Marka: <span className="font-semibold text-white">{product.brand}</span>
              </p>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <div className="flex items-end gap-4 mb-6">
                <p className="text-4xl font-bold text-white">
                  {Number(product.price).toFixed(2)} <span className="text-xl text-slate-500 font-normal">PLN</span>
                </p>
              </div>

              <div className={`flex items-center gap-2 mb-8 ${product.countInStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {product.countInStock > 0 ? <PackageCheck size={20} /> : <AlertCircle size={20} />}
                <span className="font-medium">
                  {product.countInStock > 0 ? `Dostępne sztuki: ${product.countInStock}` : 'Produkt obecnie niedostępny'}
                </span>
              </div>

              {/* SEKCJA ZAKUPU: Ilość + Przycisk */}
              <div className="flex flex-col sm:flex-row gap-4">
                  {product.countInStock > 0 && (
                      <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 h-[3.5rem]">
                          <button 
                            onClick={decreaseQty}
                            disabled={qty <= 1}
                            className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                          >
                              <Minus size={18} />
                          </button>
                          <div className="w-12 h-full flex items-center justify-center font-bold text-lg text-white border-x border-slate-800">
                              {qty}
                          </div>
                          <button 
                            onClick={increaseQty}
                            disabled={qty >= product.countInStock}
                            className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                          >
                              <Plus size={18} />
                          </button>
                      </div>
                  )}

                  <Button
                    className="h-[3.5rem] text-lg bg-white text-slate-950 hover:bg-slate-200 font-bold"
                    disabled={product.countInStock === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.countInStock > 0 ? 'Dodaj do koszyka' : 'Wyprzedane'}
                  </Button>
              </div>
            </div>

            <div className="prose prose-invert prose-slate max-w-none pt-6 border-t border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-4">Opis produktu</h3>
              <p className="whitespace-pre-line leading-relaxed text-slate-400">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Powiązane posty */}
        {product.relatedPosts && product.relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-slate-800 pt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              Powiązane wpisy na blogu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {product.relatedPosts.map((post) => (
                <Card key={post._id} className="flex flex-col h-full bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors overflow-hidden group">
                  <Link to={`/blog/${post.slug}`} className="block h-48 overflow-hidden bg-slate-950 relative">
                    {post.images && post.images.length > 0 ? (
                      <img
                        src={getImageUrl(post.images[0])}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <FileText className="w-12 h-12" />
                      </div>
                    )}
                  </Link>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <Link to={`/blog/${post.slug}`}>
                      <CardTitle className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </CardTitle>
                    </Link>
                    <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                      {post.description}
                    </p>
                    <div className="mt-auto">
                      <Button variant="link" className="p-0 h-auto text-blue-400 hover:text-blue-300" asChild>
                        <Link to={`/blog/${post.slug}`}>Czytaj dalej &rarr;</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;