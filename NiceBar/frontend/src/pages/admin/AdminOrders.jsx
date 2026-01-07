import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Check, Truck, Box, Package } from 'lucide-react';

const AdminOrders = () => {
    const { api } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusMap = {
        'Pending Packaging': { label: 'Do spakowania', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Box },
        'Ready for Shipping': { label: 'Oczekuje na kuriera', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Package },
        'In Transit': { label: 'W drodze', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Truck },
        'Delivered': { label: 'Dostarczono', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: Check },
    };

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/deliver`, { status: newStatus });
            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
            ));
        } catch (error) {
            alert("Nie udało się zmienić statusu");
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-white text-2xl">Wszystkie zamówienia</CardTitle>
                <CardDescription className="text-slate-400">Przeglądaj i zmieniaj statusy dostaw.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="rounded-md border border-slate-800 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-950">
                            <TableRow className="border-slate-800 hover:bg-slate-950">
                                <TableHead className="text-slate-400">ID / Klient</TableHead>
                                <TableHead className="text-slate-400">Data</TableHead>
                                <TableHead className="text-slate-400">Kwota</TableHead>
                                <TableHead className="text-slate-400">Płatność</TableHead>
                                <TableHead className="text-slate-400">Status Dostawy</TableHead>
                                <TableHead className="text-right text-slate-400">Szczegóły</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <TableCell>
                                        <div className="font-bold text-xs font-mono text-slate-300">{order._id}</div>
                                        <div className="text-xs text-slate-500">
                                            {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Gość'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium text-slate-200">{order.totalPrice.toFixed(2)} zł</TableCell>
                                    <TableCell>
                                        {order.isPaid ? (
                                            <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">Opłacone</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-red-500 border-red-500/30 bg-red-500/10">Brak wpłaty</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Select 
                                            defaultValue={order.deliveryStatus} 
                                            onValueChange={(val) => handleStatusChange(order._id, val)}
                                        >
                                            <SelectTrigger className="w-[180px] bg-slate-950 border-slate-700 text-slate-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                                {Object.keys(statusMap).map((statusKey) => (
                                                    <SelectItem key={statusKey} value={statusKey} className="focus:bg-slate-800 focus:text-white">
                                                        <div className="flex items-center gap-2">
                                                            {statusMap[statusKey].label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">Podgląd</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-300">
                                                <DialogHeader>
                                                    <DialogTitle className="text-white">Szczegóły zamówienia {order._id}</DialogTitle>
                                                    <DialogDescription className="text-slate-400">
                                                        Przegląd produktów, statusu płatności i danych adresowych klienta.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-6 py-4">
                                                    <div className="grid grid-cols-2 gap-6 bg-slate-950 p-4 rounded-lg border border-slate-800">
                                                        <div>
                                                            <h3 className="font-semibold mb-2 text-white text-sm uppercase tracking-wide">Klient</h3>
                                                            <p className="text-sm">{order.user?.firstName} {order.user?.lastName}</p>
                                                            <p className="text-sm text-slate-500">{order.user?.email}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold mb-2 text-white text-sm uppercase tracking-wide">Adres dostawy</h3>
                                                            <p className="text-sm">{order.shippingAddress.address}</p>
                                                            <p className="text-sm">{order.shippingAddress.postalCode} {order.shippingAddress.city}</p> 
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-slate-800 pt-4">
                                                        <h3 className="font-semibold mb-4 text-white text-sm uppercase tracking-wide">Produkty</h3>
                                                        {order.orderItems.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between text-sm py-2 border-b border-slate-800 last:border-0 hover:bg-slate-800/30 px-2 rounded">
                                                                <span className="text-slate-300">{item.name} <span className="text-slate-500">x {item.qty}</span></span>
                                                                <span className="font-medium text-white">{(item.price * item.qty).toFixed(2)} zł</span>
                                                            </div>
                                                        ))}
                                                        <div className="flex justify-between text-lg py-2 border-slate-800 hover:bg-slate-800/30 px-2 rounded">
                                                            <span className="text-slate-300">Suma: </span>
                                                            <span className="font-medium text-white">{order.totalPrice.toFixed(2)} zł</span>
                                                        </div>   
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
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

export default AdminOrders;