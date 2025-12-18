import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useShop } from '../../services/ShopContext';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config';
import CommentsSection from "./CommentSection";
import AiProductSuggester from '../../components/AiProductSuggester'; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Edit2, Trash2, Calendar, User, Package, Save, X, ImagePlus } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SinglePost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slugField, setSlugField] = useState('');
  const [image, setImage] = useState(''); 
  
  const [availableProducts, setAvailableProducts] = useState([]); 
  const [selectedProducts, setSelectedProducts] = useState([]); 

  const [uploading, setUploading] = useState(false);

  const { api, updatePost, user } = useAuth();
  const { addToCart } = useShop();
  const { slug } = useParams();
  const goBack = useNavigate();

  const fetchPostAndProducts = useCallback(async () => {
    try {
      setLoading(true);
      const [postRes, productsRes] = await Promise.all([
        api.get(`/posts/${slug}`),
        api.get('/products') 
      ]);

      const postData = postRes.data;
      setPost(postData);
      setAvailableProducts(productsRes.data);

      setTitle(postData.title);
      setDescription(postData.description);
      setSlugField(postData.slug);
      const currentImage = postData.images && postData.images.length > 0 ? postData.images[0] : '';
      setImage(currentImage);
      
      if (postData.products) {
        const productIds = postData.products.map(p => (typeof p === 'object' ? p._id : p));
        setSelectedProducts(productIds);
      }

    } catch (err) {
      setError("Nie udało się pobrać danych");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug, api]);

  useEffect(() => {
    fetchPostAndProducts();
  }, [fetchPostAndProducts]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('images', file); 
    
    setUploading(true);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      const uploadedPath = Array.isArray(data) ? data[0] : data;
      setImage(uploadedPath);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Błąd uploadu zdjęcia.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!post || !post._id) {
        setError("Błąd krytyczny: Brak ID posta.");
        return;
    }

    try {
      const updatedData = {
          title,
          description,
          slug: slugField,
          images: [image], 
          products: selectedProducts 
      };

      await updatePost(post._id, updatedData);

      setIsEditing(false);
      
      if (slugField !== slug) {
        goBack(`/blog/${slugField}`);
      } else {
        await fetchPostAndProducts();
      }
    } catch (err) {
      console.error("Błąd edycji:", err);
      setError(err.response?.data?.message || 'Nie udało się zaktualizować posta.');
    }
  };

  const deletePostHandler = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten post?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      goBack("/");
    } catch (err) {
      alert("Nie udało się usunąć posta");
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert("Dodano produkt do koszyka!");
  };

  const ProductCard = ({ product }) => (
    <Card className="flex flex-row lg:flex-col gap-4 bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors group overflow-hidden h-full">
        <Link to={`/product/${product.slug}`} className="shrink-0 w-24 h-24 lg:w-full lg:h-48 bg-slate-950 flex items-center justify-center p-2 lg:p-4">
            <img
                src={getImageUrl(product.image || product.images?.[0])}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110"
            />
        </Link>
        <div className="flex flex-col flex-grow p-3 lg:p-5 pt-0 lg:pt-0">
            <Link to={`/product/${product.slug}`}>
                <CardTitle className="text-sm lg:text-base text-white hover:text-blue-400 transition-colors mb-1 line-clamp-2">
                    {product.name}
                </CardTitle>
            </Link>
            <div className="text-base lg:text-lg font-bold text-blue-500 mb-3">
                {product.price?.toFixed(2)} zł
            </div>
            <Button
                size="sm"
                variant="secondary"
                className="w-full mt-auto flex items-center gap-2 bg-slate-800 text-white hover:bg-slate-700 text-xs lg:text-sm"
                onClick={() => handleAddToCart(product)}
            >
                <ShoppingCart className="w-3 h-3 lg:w-4 lg:h-4" />
                Dodaj
            </Button>
        </div>
    </Card>
  );

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Ładowanie...</div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500">{error}</div>;
  if (!post) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Post nie istnieje</div>;

  const inputClasses = "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500";
  const labelClasses = "text-slate-300";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {user && (
          <div className="mb-6 flex justify-end gap-3">
            <Button variant="outline" className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <><X className="w-4 h-4 mr-2" /> Anuluj edycję</> : <><Edit2 className="w-4 h-4 mr-2" /> Edytuj post</>}
            </Button>
            <Button variant="destructive" onClick={deletePostHandler}>
              <Trash2 className="w-4 h-4 mr-2" /> Usuń post
            </Button>
          </div>
        )}

        {!isEditing ? (
          <article className='bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl'>
            
            <div className="flex flex-col lg:flex-row border-b border-slate-800">
                
                {/* --- LEWA KOLUMNA (Zdjęcia + Treść) --- */}
                <div className="flex-1 lg:border-r border-slate-800 min-w-0"> {/* min-w-0 zapobiega rozpychaniu flexa przez karuzelę */}
                    
                    {/* Galeria Zdjęć Posta */}
                    <div className="w-full bg-slate-950 border-b border-slate-800 p-8 flex justify-center">
                        {post.images && post.images.length > 0 ? (
                            <Carousel className="w-full max-w-2xl">
                            <CarouselContent>
                                {post.images.map((img, index) => (
                                <CarouselItem key={index}>
                                    <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                                    <img
                                        src={getImageUrl(img)}
                                        alt={`${post.title} - zdjęcie ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                            {post.images.length > 1 && (
                                <>
                                <CarouselPrevious className="left-2 bg-slate-800 border-slate-700 text-white hover:bg-slate-700" />
                                <CarouselNext className="right-2 bg-slate-800 border-slate-700 text-white hover:bg-slate-700" />
                                </>
                            )}
                            </Carousel>
                        ) : (
                            <div className="aspect-video w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-600">
                            Brak zdjęć posta
                            </div>
                        )}
                    </div>

                    {/* Treść Posta */}
                    <div className="p-8 md:p-12">
                        <div className="flex flex-wrap gap-4 text-slate-500 text-sm mb-6 border-b border-slate-800 pb-6">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <time>{new Date(post.createdAt).toLocaleDateString()}</time>
                            </div>
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>{post.userId?.firstName} {post.userId?.lastName}</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white leading-tight">{post.title}</h1>

                        <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
                            {post.description}
                        </div>
                    </div>
                </div>

                {/* --- PRAWA KOLUMNA (Produkty) --- */}
                {post.products && post.products.length > 0 && (
                    <div className="w-full lg:w-96 bg-slate-950/50 p-6 lg:p-8 border-t lg:border-t-0 border-slate-800 flex flex-col">
                        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2 sticky top-0 bg-slate-950/50 py-2 z-10 backdrop-blur-sm">
                            <Package className="text-blue-500" /> Użyte produkty
                        </h3>
                        
                        {/* Logika wyświetlania: Karuzela (>2) lub Lista (<=2) */}
                        {post.products.length > 2 ? (
                            <div className="flex-1 flex items-center justify-center">
                                <Carousel className="w-full max-w-[280px] lg:max-w-full" opts={{ align: "start", loop: true }}>
                                    <CarouselContent>
                                        {post.products.map((product) => (
                                            <CarouselItem key={product._id} className="basis-full">
                                                <div className="p-1">
                                                    <ProductCard product={product} />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <div className="flex justify-center gap-2 mt-4">
                                        <CarouselPrevious className="static translate-y-0 bg-slate-800 border-slate-700 text-white hover:bg-slate-700" />
                                        <CarouselNext className="static translate-y-0 bg-slate-800 border-slate-700 text-white hover:bg-slate-700" />
                                    </div>
                                </Carousel>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {post.products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-slate-950 p-8 md:p-12">
                <div className="max-w-3xl">
                    <CommentsSection
                        postId={post._id}
                        comments={post.comments || []}
                        onCommentAdded={fetchPostAndProducts}
                    />
                </div>
            </div>
          </article>
        ) : (
          /* --- TRYB EDYCJI --- */
          <div className='w-full'>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Edytuj post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} id='edit-post-form' className="space-y-8">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className={labelClasses}>Tytuł</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClasses} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug" className={labelClasses}>Slug (URL)</Label>
                        <Input id="slug" value={slugField} onChange={(e) => setSlugField(e.target.value)} required className={inputClasses} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className={labelClasses}>Treść</Label>
                        <Textarea id="description" className={`min-h-[300px] ${inputClasses}`} value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-lg border border-slate-800">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Package className="text-blue-500" size={20}/> Powiązane produkty
                      </h3>
                      <AiProductSuggester 
                          title={title} 
                          description={description}
                          availableProducts={availableProducts}
                          selectedProducts={selectedProducts}
                          onSelectionChange={setSelectedProducts}
                      />
                  </div>

                  <div className="grid gap-2 bg-slate-950 p-6 rounded-lg border border-slate-800">
                    <Label className={labelClasses}>Zdjęcie główne</Label>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/uploads/..." className={inputClasses} />
                        </div>
                        <div className="flex-1">
                             <label className="cursor-pointer">
                                <div className="flex items-center justify-center w-full h-10 px-4 transition bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white text-slate-400 text-sm">
                                    {uploading ? <><span className="animate-spin mr-2">⏳</span> Wysyłanie...</> : <><ImagePlus className="w-4 h-4 mr-2"/> Zmień plik</>}
                                </div>
                                <input type="file" className="hidden" onChange={uploadFileHandler} disabled={uploading} />
                            </label>
                        </div>
                    </div>
                    {image && (
                        <div className="mt-2 w-32 h-20 bg-slate-900 rounded border border-slate-800 overflow-hidden">
                            <img src={getImageUrl(image)} alt="Podgląd" className="w-full h-full object-cover" />
                        </div>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t border-slate-800 pt-6">
                <Button type="submit" form='edit-post-form' className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 text-lg">
                  <Save className="w-5 h-5 mr-2" /> Zapisz zmiany
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default SinglePost;