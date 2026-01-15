import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config'; 
import AiProductSuggester from '../../components/AiProductSuggester'; 

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Loader2, ImagePlus } from "lucide-react";

const AddPost = () => {
    const [loading, setLoading] = useState(false); 
    const [uploading, setUploading] = useState(false);
    
    const [availableProducts, setAvailableProducts] = useState([]); 
    const [selectedProducts, setSelectedProducts] = useState([]); 
    
    const { api } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
            title: '',
            description: '',
            slug: '',
            images: [],
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setAvailableProducts(data);
            } catch (error) {
                console.error("Błąd pobierania produktów", error);
            }
        };
        fetchProducts();
    }, [api]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const postData = {
                ...formData,
                products: selectedProducts 
            };

            await api.post('/posts', postData);
            navigate('/blog');
        } catch (error) {
            console.error(error);
            alert("Błąd dodawania posta");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
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
        <div className='min-h-screen bg-slate-950 text-slate-300 flex justify-center py-12 px-4'>
            <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 shadow-xl h-fit">
            <CardHeader className="border-b border-slate-800 pb-6">
                <CardTitle className="text-2xl text-white">Stwórz nowy post</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} id='add-post-form'>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label className={labelClasses}>Tytuł</Label>
                        <Input name="title" value={formData.title} onChange={handleChange} required className={inputClasses} placeholder="Wpisz tytuł posta..." />
                    </div>
                    
                    <div className="grid gap-2">
                        <Label className={labelClasses}>Slug (URL)</Label>
                        <Input name="slug" value={formData.slug} onChange={handleChange} placeholder="Zostaw puste dla auto-generacji" className={inputClasses} />
                    </div>

                    <div className="grid gap-2">
                        <Label className={labelClasses}>Opis (Treść)</Label>
                        <Textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            className={`min-h-[100px] ${inputClasses}`}
                            placeholder="O czym chcesz napisać?"
                            required 
                        />
                    </div>
                    
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                        <AiProductSuggester 
                            title={formData.title}
                            description={formData.description}
                            availableProducts={availableProducts}
                            selectedProducts={selectedProducts}
                            onSelectionChange={setSelectedProducts}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className={labelClasses}>Zdjęcia</Label>
                        <div className="flex items-center gap-4">
                            <label className="flex-1 cursor-pointer">
                                <div className="flex items-center justify-center w-full h-12 px-4 transition bg-slate-800 border-2 border-slate-700 border-dashed rounded-md appearance-none hover:border-slate-500 focus:outline-none">
                                    <span className="flex items-center space-x-2">
                                        <ImagePlus className="w-5 h-5 text-slate-400" />
                                        <span className="font-medium text-slate-400">
                                            {uploading ? 'Wysyłanie...' : 'Wybierz zdjęcia'}
                                        </span>
                                    </span>
                                    <input type="file" name="file_upload" className="hidden" multiple onChange={uploadFileHandler} disabled={uploading} />
                                </div>
                            </label>
                        </div>

                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative group border border-slate-700 rounded-lg overflow-hidden aspect-square bg-slate-950">
                                        <img 
                                            src={getImageUrl(img)} 
                                            alt="podgląd" 
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2 pt-6 border-t border-slate-800">
                <Button type="submit" form='add-post-form' className="w-full bg-white text-slate-950 hover:bg-slate-200 font-bold py-6" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Opublikuj post'}
                </Button>
            </CardFooter>
            </Card>
        </div>
    )
}

export default AddPost;