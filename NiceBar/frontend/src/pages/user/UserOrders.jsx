import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config';
import { Loader2, ShoppingBag, Calendar, CreditCard } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const UserOrders = () => {
    const { api } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders'); 
                setOrders(data);
            } catch (err) {
                console.error("Błąd pobierania zamówień:", err);
                setError("Nie udało się pobrać historii zamówień.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [api]);

    const resolveStatus = (order) => {
        if (!order.isPaid) {
            return { label: "Oczekuje na płatność", color: "bg-yellow-500 hover:bg-yellow-600 text-white" };
        }
        switch (order.deliveryStatus) {
            case 'Pending Packaging': return { label: "W trakcie pakowania", color: "bg-blue-500 hover:bg-blue-600 text-white" };
            case 'Ready for Shipping': return { label: "Gotowe do wysyłki", color: "bg-indigo-500 hover:bg-indigo-600 text-white" };
            case 'In Transit': return { label: "W drodze", color: "bg-orange-500 hover:bg-orange-600 text-white" };
            case 'Delivered': return { label: "Dostarczono", color: "bg-green-600 hover:bg-green-700 text-white" };
            default: return { label: "W realizacji", color: "bg-gray-500 hover:bg-gray-600 text-white" };
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    if (orders.length === 0) {
        return (
            <Card className="text-center py-10 animate-in fade-in duration-500">
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Brak zamówień</h3>
                    <p className="text-gray-500">Nie złożyłeś jeszcze żadnego zamówienia.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Twoje zamówienia</h2>
            <div className="space-y-4">
                {orders.map((order) => {
                    const status = resolveStatus(order);
                    return (
                        <Card key={order._id} className="overflow-hidden">
                            <div className="bg-slate-50 p-4 border-b flex flex-wrap gap-4 justify-between items-center text-sm">
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> Data złożenia</p>
                                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 flex items-center gap-1"><CreditCard className="w-3 h-3"/> Suma</p>
                                        <p className="font-medium">{order.totalPrice.toFixed(2)} PLN</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-500 hidden sm:block">Nr: {order._id}</p>
                                    <Badge className={`${status.color} border-none`}>{status.label}</Badge>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-16 h-16 border rounded bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                {item.image ? (
                                                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover"/>
                                                ) : (
                                                    <ShoppingBag className="w-6 h-6 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm md:text-base">{item.name}</h4>
                                                <p className="text-sm text-gray-500">Ilość: {item.qty} szt.</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm">{(item.price * item.qty).toFixed(2)} zł</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            
                            {!order.isPaid && (
                                <CardFooter className="bg-slate-50/50 p-3 flex justify-end">
                                     <Button size="sm" variant="default" onClick={() => window.location.href=`/payment?orderId=${order._id}`}>
                                          Dokończ płatność
                                     </Button>
                                </CardFooter>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default UserOrders;