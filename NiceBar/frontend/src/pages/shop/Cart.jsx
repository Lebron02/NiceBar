import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../services/ShopContext';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

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
            <div className="container mx-auto p-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Twój koszyk jest pusty</h2>
                <Link to="/shop">
                    <Button>Wróć do sklepu</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Koszyk Zakupowy</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div className="md:col-span-2">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Produkt</TableHead>
                                    <TableHead>Nazwa</TableHead>
                                    <TableHead>Cena</TableHead>
                                    <TableHead>Ilość</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.product._id}>
                                        <TableCell>
                                            <img 
                                                src={getImageUrl(item.product.images?.[0])} 
                                                alt={item.product.name} 
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Link to={`/products/${item.product.slug}`} className="hover:underline">
                                                {item.product.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{item.product.price} PLN</TableCell>
                                        <TableCell>
                                            <select 
                                                className="border rounded p-1"
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
                                                size="sm" 
                                                onClick={() => removeFromCart(item.product._id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="border rounded-lg p-6 bg-gray-50">
                        <h2 className="text-xl font-semibold mb-4">Podsumowanie</h2>
                        <div className="flex justify-between mb-2">
                            <span>Produkty ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                            <span>{cartTotal} PLN</span>
                        </div>
                        <div className="border-t my-4"></div>
                        <div className="flex justify-between font-bold text-lg mb-6">
                            <span>Suma:</span>
                            <span>{cartTotal} PLN</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={checkoutHandler}>
                            Przejdź do kasy
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;