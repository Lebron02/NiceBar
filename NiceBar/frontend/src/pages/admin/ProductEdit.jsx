import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

const ProductEdit = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { api } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    //const [categories, setCategories] = useState([]); 

    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        slug: '',
        images: [],
        brand: '',
        category: '',
        countInStock: 0,
        description: '',
    });

    const isEditMode = !!id; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Pobieranie listy kategorii, do zaimplementowania w przyszłości
                // const catRes = await api.get('/products/categories');
                // setCategories(catRes.data);

                if (isEditMode) {
                    const { data } = await api.get(`/products/${id}`);
                    const preparedData = {
                        ...data,
                        category: data.category?.name || '',
                        images: data.images || []
                    };
                    setFormData(preparedData);
                }
            } catch (error) {
                console.error("Błąd pobierania danych", error);
            }
        };
        fetchData();
    }, [id, isEditMode, api]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            if (isEditMode) {
                await api.put(`/products/${id}`, formData);
            } else {
                await api.post('/products', formData);
            }
            navigate('/admin/dashboard');
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

    return (
        <div className="flex justify-center p-6">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>{isEditMode ? 'Edytuj Produkt' : 'Dodaj Produkt'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <div className="grid gap-2">
                            <Label>Nazwa</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="grid gap-2">
                            <Label>Slug (URL)</Label>
                            <Input name="slug" value={formData.slug} onChange={handleChange} placeholder="Zostaw puste dla auto-generacji" />
                        </div>

                        <div className="grid gap-2">
                            <Label>Cena</Label>
                            <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </div>

                        {/* --- SEKCJA ZDJĘĆ --- */}
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

                        <div className="grid gap-2">
                            <Label>Marka</Label>
                            <Input name="brand" value={formData.brand} onChange={handleChange} required />
                        </div>

                        {/* Kategoria z podpowiedziami */}
                        <div className="grid gap-2">
                            <Label>Kategoria</Label>
                            <Input 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange} 
                                list="categories-list"
                                placeholder="Wybierz lub wpisz nową"
                                required 
                            />
                            {/* <datalist id="categories-list">
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name} />
                                ))}
                            </datalist> */}
                        </div>

                        <div className="grid gap-2">
                            <Label>Ilość w magazynie</Label>
                            <Input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required />
                        </div>

                        <div className="grid gap-2">
                            <Label>Opis</Label>
                            <Textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                className="min-h-[150px]"
                                required 
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Zapisywanie...' : (isEditMode ? 'Zaktualizuj' : 'Utwórz')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductEdit;