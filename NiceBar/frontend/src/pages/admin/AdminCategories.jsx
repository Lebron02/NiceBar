import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Edit, Plus, FolderTree } from 'lucide-react';

const AdminCategories = () => {
    const { api } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Stany dla Modala (Dialog)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ name: '' });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error("Błąd pobierania kategorii", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    // Obsługa otwierania modala
    const openCreateDialog = () => {
        setIsEditing(false);
        setFormData({ name: '' });
        setIsDialogOpen(true);
    };

    const openEditDialog = (category) => {
        setIsEditing(true);
        setCurrentId(category._id);
        setFormData({ name: category.name });
        setIsDialogOpen(true);
    };

    // Wysyłanie formularza (Dodawanie lub Edycja)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/categories/${currentId}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            setIsDialogOpen(false);
            fetchCategories(); // Odśwież listę
        } catch (error) {
            alert(error.response?.data?.message || "Wystąpił błąd");
        }
    };

    // Usuwanie
    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno usunąć tę kategorię? Produkty w tej kategorii mogą stracić przypisanie.")) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                alert("Nie udało się usunąć kategorii");
            }
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <>
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <CardTitle className="text-white text-2xl">Kategorie</CardTitle>
                        <CardDescription className="text-slate-400">Zarządzaj strukturą kategorii w sklepie.</CardDescription>
                    </div>
                    <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                        <Plus className="mr-2 h-4 w-4" /> Dodaj Kategorię
                    </Button>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="rounded-md border border-slate-800 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-950">
                                <TableRow className="border-slate-800 hover:bg-slate-950">
                                    <TableHead className="text-slate-400">Nazwa</TableHead>
                                    <TableHead className="text-slate-400">Slug (URL)</TableHead>
                                    <TableHead className="text-slate-400">Utworzono</TableHead>
                                    <TableHead className="text-right text-slate-400">Akcje</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-slate-500 py-8">Brak kategorii</TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map((cat) => (
                                        <TableRow key={cat._id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                                            <TableCell className="font-medium text-slate-200">{cat.name}</TableCell>
                                            <TableCell className="text-slate-400 text-sm font-mono">{cat.slug}</TableCell>
                                            <TableCell className="text-slate-400 text-sm">
                                                {new Date(cat.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" onClick={() => openEditDialog(cat)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(cat._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* MODAL DODAWANIA / EDYCJI */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-300">
                    <DialogHeader>
                        <DialogTitle className="text-white">{isEditing ? 'Edytuj kategorię' : 'Dodaj nową kategorię'}</DialogTitle>
                        <DialogDescription>
                            Wpisz nazwę kategorii. Slug zostanie wygenerowany automatycznie.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-200">Nazwa kategorii</Label>
                            <Input 
                                id="name" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="bg-slate-950 border-slate-700 text-white"
                                placeholder="np. Akcesoria"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700 text-slate-950 hover:bg-slate-800">
                                Anuluj
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white">
                                {isEditing ? 'Zapisz zmiany' : 'Utwórz'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AdminCategories;