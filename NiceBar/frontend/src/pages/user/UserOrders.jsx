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
            return { label: "Oczekuje na płatność", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" };
        }
        switch (order.deliveryStatus) {
            case 'Pending Packaging': return { label: "W trakcie pakowania", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
            case 'Ready for Shipping': return { label: "Gotowe do wysyłki", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" };
            case 'In Transit': return { label: "W drodze", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" };
            case 'Delivered': return { label: "Dostarczono", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
            default: return { label: "W realizacji", color: "bg-slate-500/10 text-slate-500 border-slate-500/20" };
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    if (error) return <div className="text-red-500 text-center p-4 bg-slate-900 rounded border border-red-500/20">{error}</div>;

    if (orders.length === 0) {
        return (
            <Card className="text-center py-16 bg-slate-900 border-slate-800 animate-in fade-in duration-500">
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800">
                        <ShoppingBag className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Brak zamówień</h3>
                    <p className="text-slate-500">Nie złożyłeś jeszcze żadnego zamówienia.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold tracking-tight text-white">Twoje zamówienia</h2>
            <div className="space-y-4">
                {orders.map((order) => {
                    const status = resolveStatus(order);
                    return (
                        <Card key={order._id} className="overflow-hidden bg-slate-900 border-slate-800">
                            <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap gap-4 justify-between items-center text-sm">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-slate-500 flex items-center gap-1 mb-1"><Calendar className="w-3 h-3"/> Data złożenia</p>
                                        <p className="font-medium text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 flex items-center gap-1 mb-1"><CreditCard className="w-3 h-3"/> Suma</p>
                                        <p className="font-medium text-slate-300">{order.totalPrice.toFixed(2)} PLN</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-slate-600 text-xs hidden sm:block">Nr: {order._id}</p>
                                    <Badge className={`${status.color} border px-3 py-1 font-medium`}>{status.label}</Badge>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-16 h-16 border border-slate-800 rounded bg-slate-950 flex-shrink-0 flex items-center justify-center overflow-hidden p-1">
                                                {item.image ? (
                                                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-contain"/>
                                                ) : (
                                                    <ShoppingBag className="w-6 h-6 text-slate-700" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm md:text-base text-white">{item.name}</h4>
                                                <p className="text-sm text-slate-500">Ilość: {item.qty} szt.</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm text-slate-300">{(item.price * item.qty).toFixed(2)} zł</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            
                            {!order.isPaid && (
                                <CardFooter className="bg-slate-950/50 p-4 flex justify-end border-t border-slate-800">
                                     <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => window.location.href=`/payment?orderId=${order._id}`}>
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