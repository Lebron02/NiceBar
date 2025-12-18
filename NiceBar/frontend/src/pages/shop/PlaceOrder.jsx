import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../services/ShopContext';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';

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

    const inputClasses = "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500";
    const labelClasses = "text-slate-300";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 py-12">
            <div className="container mx-auto px-6 max-w-5xl">
                <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
                    Finalizacja zamówienia
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white text-xl">Adres dostawy</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="grid gap-2">
                                    <Label className={labelClasses}>Ulica i numer</Label>
                                    <Input name="address" value={address.address} onChange={handleChange} required className={inputClasses} />
                                </div>
                                <div className="grid gap-2">
                                    <Label className={labelClasses}>Miasto</Label>
                                    <Input name="city" value={address.city} onChange={handleChange} required className={inputClasses} />
                                </div>
                                <div className="grid gap-2">
                                    <Label className={labelClasses}>Kod pocztowy</Label>
                                    <Input name="postalCode" value={address.postalCode} onChange={handleChange} required className={inputClasses} />
                                </div>
                                <div className="grid gap-2">
                                    <Label className={labelClasses}>Kraj</Label>
                                    <Input name="country" value={address.country} onChange={handleChange} required className={inputClasses} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="bg-slate-900 border-slate-800 sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-white text-xl">Twoje produkty</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.product._id} className="flex justify-between items-center border-b border-slate-800 pb-4 last:border-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-950 rounded border border-slate-800 p-1">
                                                    <img 
                                                        src={getImageUrl(item.product.images?.[0])} 
                                                        alt={item.product.name} 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white text-sm">{item.product.name}</p>
                                                    <p className="text-xs text-slate-500">Ilość: {item.qty}</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-300 text-sm font-medium">{item.qty * item.product.price} PLN</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-slate-800 pt-6">
                                    <div className="flex justify-between text-xl font-bold text-white mb-8">
                                        <span>Do zapłaty:</span>
                                        <span>{cartTotal} PLN</span>
                                    </div>

                                    <Button 
                                        className="w-full text-lg py-6 bg-white text-slate-950 hover:bg-slate-300 font-bold" 
                                        onClick={handlePlaceOrder} 
                                        disabled={loading}
                                    >
                                        {loading ? 'Przetwarzanie...' : (
                                            <span className="flex items-center ">
                                                Złóż zamówienie i zapłać <CheckCircle className="ml-2 h-5 w-5" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;