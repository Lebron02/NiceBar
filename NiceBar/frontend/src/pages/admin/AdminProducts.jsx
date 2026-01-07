import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const { api } = useAuth();

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error("Błąd pobierania produktów", error);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Usunąć produkt?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts(); 
            } catch (error) {
                alert("Błąd usuwania");
            }
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
                <div>
                    <CardTitle className="text-white text-2xl">Produkty</CardTitle>
                    <CardDescription className="text-slate-400">Zarządzaj asortymentem sklepu</CardDescription>
                </div>
                <Link to="/admin/product/create">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/20">
                        + Dodaj Produkt
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="rounded-md border border-slate-800 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-950">
                            <TableRow className="border-slate-800 hover:bg-slate-950">
                                <TableHead className="text-slate-400">ID</TableHead>
                                <TableHead className="text-slate-400">Nazwa</TableHead>
                                <TableHead className="text-slate-400">Cena</TableHead>
                                <TableHead className="text-slate-400">Ilość</TableHead>
                                <TableHead className="text-slate-400">Kategoria</TableHead>
                                <TableHead className="text-right pr-15 text-slate-400">Akcje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <TableCell className="text-xs font-mono text-slate-500">{product._id}</TableCell>
                                    <TableCell className={`font-medium ${product.countInStock < 5 ? 'text-red-500 font-bold' : 'text-slate-300'}`}>{product.name}</TableCell>
                                    <TableCell className="text-slate-300">{product.price.toFixed(2)} PLN</TableCell>
                                    
                                    {/* Warunkowe wyświetlanie ostrzeżenia o niskim stanie */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm ${product.countInStock < 5 ? 'text-red-500 font-bold' : 'text-slate-300'}`}>
                                                {product.countInStock}
                                            </span>
                                            {product.countInStock < 5 && (
                                                <Badge variant="outline" className="text-red-500 border-red-500/20 bg-red-500/10 flex items-center gap-1 px-2 py-0.5 h-auto">
                                                    <AlertTriangle size={12} /> 
                                                    <span className="text-[10px] uppercase tracking-wide">Niski stan</span>
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700">
                                            {product.category?.name || '-'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link to={`/admin/product/${product._id}/edit`}>
                                            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/20">Edytuj</Button>
                                        </Link>
                                        <Button variant="destructive" size="sm" onClick={() => deleteHandler(product._id)} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">Usuń</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminProducts;