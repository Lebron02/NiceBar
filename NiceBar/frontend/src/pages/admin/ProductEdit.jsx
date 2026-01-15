import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ImagePlus, Loader2, Save } from "lucide-react";
import AiPostSuggester from "./../../components/AiPostSuggester"; 

const ProductEdit = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { api } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const [categories, setCategories] = useState([]); 
    const [availablePosts, setAvailablePosts] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        slug: '',
        images: [],
        brand: '',
        category: '',
        countInStock: 0,
        description: '',
        relatedPosts: [] 
    });

    const isEditMode = !!id; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, postsRes] = await Promise.all([
                    api.get('/products/categories'),
                    api.get('/posts')
                ]);

                setCategories(categoriesRes.data);
                setAvailablePosts(postsRes.data);

                if (isEditMode) {
                    const { data } = await api.get(`/products/${id}`);
                    
                    const categoryValue = data.category?.name || data.category || '';

                    const relatedPostsIds = data.relatedPosts 
                        ? data.relatedPosts.map(p => (typeof p === 'object' ? p._id : p))
                        : [];

                    setFormData({
                        ...data,
                        price: data.price,
                        category: categoryValue,
                        images: data.images || [],
                        relatedPosts: relatedPostsIds
                    });
                }
            } catch (error) {
                console.error("Błąd pobierania danych:", error);
            }
        };
        fetchData();
    }, [id, isEditMode, api]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePriceBlur = (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            setFormData(prev => ({ ...prev, price: val.toFixed(2) }));
        }
    };

    const handleRelatedPostsChange = (newSelectedIds) => {
        setFormData(prev => ({ ...prev, relatedPosts: newSelectedIds }));
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price)
            };
            if (isEditMode) {
                await api.put(`/products/${id}`, payload);
            } else {
                await api.post('/products', payload);
            }
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            alert("Błąd zapisu produktu");
        } finally {
            setLoading(false);
        }
    };

    const uploadFileHandler = async (e) => {
        const files = e.target.files; 
        if (!files || files.length === 0) return;

        const uploadData = new FormData();
        for (let i = 0; i < files.length; i++) {
            uploadData.append('images', files[i]);
        }

        setUploading(true);
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true, 
            };
            const { data: newImages } = await api.post('/upload', uploadData, config);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Błąd uploadu');
        }
    };

    const inputClasses = "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500";
    const labelClasses = "text-slate-300";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 py-12 flex justify-center px-2">
            <Card className="w-full max-w-3xl bg-slate-900 border-slate-800 h-fit">
                <CardHeader className="border-b border-slate-800 pb-2">
                    <CardTitle className="text-white text-2xl">{isEditMode ? 'Edytuj produkt' : 'Dodaj nowy produkt'}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label className={labelClasses}>Nazwa</Label>
                                <Input name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="Np. Zestaw barmański premium" />
                            </div>

                            <div className="grid gap-2">
                                <Label className={labelClasses}>Slug (URL)</Label>
                                <Input name="slug" value={formData.slug} onChange={handleChange} placeholder="Zostaw puste dla auto-generacji" className={inputClasses} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label className={labelClasses}>Cena (PLN)</Label>
                                    <Input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} onBlur={handlePriceBlur} required className={inputClasses} />
                                </div>
                                <div className="grid gap-2">
                                    <Label className={labelClasses}>Ilość w magazynie</Label>
                                    <Input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required className={inputClasses} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label className={labelClasses}>Kategoria</Label>
                                <Input 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    list="categories-list"
                                    placeholder="Wybierz lub wpisz nową"
                                    required 
                                    autoComplete="off"
                                    className={inputClasses}
                                />
                                <datalist id="categories-list">
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name} />
                                    ))}
                                </datalist>
                            </div>
                            

                            <div className="grid gap-2">
                                <Label className={labelClasses}>Marka</Label>
                                <Input name="brand" value={formData.brand} onChange={handleChange} required className={inputClasses} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className={labelClasses}>Opis</Label>
                            <Textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                className={`min-h-[150px] ${inputClasses}`}
                                required 
                            />
                        </div>

                        {/* Komponent AI - Sugestie Postów */}
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                            <AiPostSuggester 
                                productName={formData.name}
                                description={formData.description}
                                availablePosts={availablePosts}
                                selectedPosts={formData.relatedPosts}
                                onSelectionChange={handleRelatedPostsChange}
                            />
                        </div>

                        <div className="grid gap-3 pt-2">
                            <Label className={labelClasses}>Zdjęcia produktu</Label>
                            
                            <div className="flex items-center gap-4">
                                <label className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-center w-full h-12 px-4 transition bg-slate-800 border-2 border-slate-700 border-dashed rounded-md appearance-none hover:border-slate-500 focus:outline-none">
                                        <span className="flex items-center space-x-2">
                                            <ImagePlus className="w-5 h-5 text-slate-400" />
                                            <span className="font-medium text-slate-400">
                                                {uploading ? 'Wysyłanie...' : 'Dodaj zdjęcia'}
                                            </span>
                                        </span>
                                        <input type="file" name="file_upload" className="hidden" multiple onChange={uploadFileHandler} disabled={uploading} />
                                    </div>
                                </label>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mt-2">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative group border border-slate-700 rounded-lg overflow-hidden aspect-square bg-slate-950">
                                            <img 
                                                src={getImageUrl(img)} 
                                                alt="podgląd" 
                                                className="w-full h-full object-contain p-2"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                                <span className="flex items-center text-lg">
                                    <Save className="mr-2 h-5 w-5" /> {isEditMode ? 'Zaktualizuj produkt' : 'Utwórz produkt'}
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductEdit;