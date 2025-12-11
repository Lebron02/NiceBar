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
import { X, Loader2 } from "lucide-react";



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

    return (
        <div className='w-full justify-center flex py-10'>
            <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Stwórz post</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} id='add-post-form'>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label>Tytuł</Label>
                        <Input name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label>Opis (Treść)</Label>
                        <Textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            className="min-h-[150px]"
                            required 
                        />
                    </div>
                    
                    <div className="grid gap-2">
                        <Label>Slug (URL)</Label>
                        <Input name="slug" value={formData.slug} onChange={handleChange} placeholder="Zostaw puste dla auto-generacji" />
                    </div>
                    
                    <AiProductSuggester 
                        title={formData.title}
                        description={formData.description}
                        availableProducts={availableProducts}
                        selectedProducts={selectedProducts}
                        onSelectionChange={setSelectedProducts}
                    />

                        <div className="grid gap-2">
                            <Label>Zdjęcia</Label>
                            <Input 
                                type="file" 
                                multiple 
                                onChange={uploadFileHandler}
                                disabled={uploading} 
                            />
                            {uploading && <p className="text-sm text-gray-500">Wysyłanie...</p>}

                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative group border rounded overflow-hidden aspect-square">
                                        <img 
                                            src={getImageUrl(img)} 
                                            alt="podgląd" 
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" form='add-post-form' className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Dodaj post'}
                </Button>
            </CardFooter>
            </Card>
        </div>
    )
}

export default AddPost;