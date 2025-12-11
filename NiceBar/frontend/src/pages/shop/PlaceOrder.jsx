import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../services/ShopContext';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PlaceOrder = () => {
    const { cartItems, cartTotal, placeOrder } = useShop();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState({
        address: user?.address?.streetName ? `${user.address.streetName} ${user.address.streetNumber}` : '',
        city: user?.address?.city || '',
        postalCode: user?.address?.postalCode || '',
        country: 'Polska' 
    });

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const newOrder = await placeOrder(address, "Card"); 
            
            navigate('/payment', { state: { orderId: newOrder._id } });
        } catch (error) {
            console.error(error);
            alert("Nie udało się złożyć zamówienia. Sprawdź dane.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/shop');
        return null;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Podsumowanie zamówienia</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <Card>
                        <CardHeader><CardTitle>Adres dostawy</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Ulica i numer</Label>
                                <Input name="address" value={address.address} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Miasto</Label>
                                <Input name="city" value={address.city} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Kod pocztowy</Label>
                                <Input name="postalCode" value={address.postalCode} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Kraj</Label>
                                <Input name="country" value={address.country} onChange={handleChange} required />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader><CardTitle>Twoje produkty</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.product._id} className="flex justify-between items-center border-b pb-2">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={getImageUrl(item.product.images?.[0])} 
                                                alt={item.product.name} 
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-gray-500">Ilość: {item.qty}</p>
                                            </div>
                                        </div>
                                        <p>{item.qty * item.product.price} PLN</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>Do zapłaty:</span>
                                <span>{cartTotal} PLN</span>
                            </div>

                            <Button className="w-full text-lg py-6" onClick={handlePlaceOrder} disabled={loading}>
                                {loading ? 'Przetwarzanie...' : 'Złóż zamówienie i zapłać'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;