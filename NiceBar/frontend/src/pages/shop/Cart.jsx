import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../services/ShopContext';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, ArrowLeft, CreditCard } from "lucide-react";

const CartPage = () => {
    const { cartItems, removeFromCart, addToCart, cartTotal } = useShop();
    const { isLoggedIn } = useAuth();

    const navigate = useNavigate();

    const checkoutHandler = () => {
        if (isLoggedIn) {
            navigate('/place-order'); 
        } else {
            navigate('/login?redirect=/place-order'); 
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col items-center justify-center p-6">
                <h2 className="text-3xl font-bold text-white mb-4">Twój koszyk jest pusty</h2>
                <p className="text-slate-400 mb-8">Wygląda na to, że nie dodałeś jeszcze żadnych produktów.</p>
                <Link to="/">
                    <Button className="bg-white text-slate-950 hover:bg-slate-200 font-semibold px-8 py-6">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do sklepu
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 py-12">
            <div className="container mx-auto px-6">
                <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">Twój koszyk</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-950">
                                    <TableRow className="border-slate-800 hover:bg-slate-950">
                                        <TableHead className="w-[120px] text-slate-400">Produkt</TableHead>
                                        <TableHead className="text-slate-400">Nazwa</TableHead>
                                        <TableHead className="text-slate-400">Cena</TableHead>
                                        <TableHead className="text-slate-400">Ilość</TableHead>
                                        <TableHead className="text-slate-400"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.product._id} className="border-slate-800 hover:bg-slate-800/50">
                                            <TableCell>
                                                <div className="w-20 h-20 bg-slate-950 rounded-lg p-2 border border-slate-800">
                                                    <img 
                                                        src={getImageUrl(item.product.images?.[0])} 
                                                        alt={item.product.name} 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`/products/${item.product.slug}`} className="font-medium text-white hover:text-blue-400 transition-colors">
                                                    {item.product.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-slate-300 font-medium">{item.product.price} PLN</TableCell>
                                            <TableCell>
                                                <select 
                                                    className="bg-slate-950 border border-slate-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={item.qty}
                                                    onChange={(e) => addToCart(item.product, Number(e.target.value) - item.qty)}
                                                >
                                                    {[...Array(item.product.countInStock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="hover:bg-red-500/10 hover:text-red-500 text-slate-500"
                                                    onClick={() => removeFromCart(item.product._id)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="border border-slate-800 rounded-xl p-8 bg-slate-900 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6">Podsumowanie</h2>
                            <div className="flex justify-between mb-3 text-slate-400">
                                <span>Produkty ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                                <span>{cartTotal} PLN</span>
                            </div>
                            <div className="flex justify-between mb-6 text-slate-400">
                                <span>Dostawa:</span>
                                <span>0.00 PLN</span>
                            </div>
                            <div className="border-t border-slate-800 my-6"></div>
                            <div className="flex justify-between items-end font-bold text-white mb-8">
                                <span className="text-lg">Do zapłaty:</span>
                                <span className="text-2xl">{cartTotal} <span className="text-sm font-normal text-slate-500">PLN</span></span>
                            </div>
                            <Button 
                                className="w-full bg-white text-slate-950 hover:bg-slate-200 font-bold py-6 text-lg" 
                                onClick={checkoutHandler}
                            >
                                <CreditCard className="mr-2 h-5 w-5" /> Przejdź do kasy
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;