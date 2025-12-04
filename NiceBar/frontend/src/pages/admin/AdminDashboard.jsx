import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

import { LayoutDashboard, Package, ShoppingCart, LogOut, Loader2, Check, Truck, Box } from 'lucide-react';

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
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Produkty</CardTitle>
                    <CardDescription>Zarządzaj asortymentem sklepu</CardDescription>
                </div>
                <Link to="/admin/product/create">
                    <Button>+ Dodaj Produkt</Button>
                </Link>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nazwa</TableHead>
                            <TableHead>Cena</TableHead>
                            <TableHead>Kategoria</TableHead>
                            <TableHead className="text-right">Akcje</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell className="font-mono text-xs">{product._id.substring(20, 24)}...</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price} PLN</TableCell>
                                <TableCell>{product.category?.name || '-'}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Link to={`/admin/product/${product._id}/edit`}>
                                        <Button variant="outline" size="sm">Edytuj</Button>
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => deleteHandler(product._id)}>Usuń</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const AdminOrders = () => {
    const { api } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusMap = {
        'Pending Packaging': { label: 'Do spakowania', color: 'bg-yellow-500', icon: Box },
        'Ready for Shipping': { label: 'Oczekuje na kuriera', color: 'bg-blue-500', icon: Package },
        'In Transit': { label: 'W drodze', color: 'bg-purple-500', icon: Truck },
        'Delivered': { label: 'Dostarczono', color: 'bg-green-600', icon: Check },
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

    if (loading) return <Loader2 className="animate-spin" />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Wszystkie Zamówienia</CardTitle>
                <CardDescription>Przeglądaj i zmieniaj statusy dostaw.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID / Klient</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Kwota</TableHead>
                            <TableHead>Płatność</TableHead>
                            <TableHead>Status Dostawy</TableHead>
                            <TableHead className="text-right">Szczegóły</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>
                                    <div className="font-bold text-xs font-mono">{order._id}</div>
                                    <div className="text-xs text-gray-500">
                                        {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Gość'}
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{order.totalPrice.toFixed(2)} zł</TableCell>
                                <TableCell>
                                    {order.isPaid ? (
                                        <Badge variant="outline" className="text-green-600 border-green-600">Opłacone</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-red-600 border-red-600">Brak wpłaty</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Select 
                                        defaultValue={order.deliveryStatus} 
                                        onValueChange={(val) => handleStatusChange(order._id, val)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(statusMap).map((statusKey) => (
                                                <SelectItem key={statusKey} value={statusKey}>
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
                                            <Button variant="ghost" size="sm">Podgląd</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Szczegóły zamówienia {order._id}</DialogTitle>
                                                <DialogDescription>
                                                    Przegląd produktów, statusu płatności i danych adresowych klienta.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Klient</h3>
                                                        <p className="text-sm">{order.user?.firstName} {order.user?.lastName}</p>
                                                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Adres dostawy</h3>
                                                        
                                                        <p className="text-sm">{order.shippingAddress.address}</p>
                                                        <p className="text-sm">{order.shippingAddress.postalCode} {order.shippingAddress.city}</p> 
                                                    </div>
                                                </div>
                                                <div className="border-t pt-4">
                                                    <h3 className="font-semibold mb-2">Produkty</h3>
                                                    {order.orderItems.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm py-1">
                                                            <span>{item.name} x {item.qty}</span>
                                                            <span>{(item.price * item.qty).toFixed(2)} zł</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const { logout } = useAuth();

    return (
        <div className="container mx-auto py-10 px-4 md:px-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* SIDEBAR */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-4 space-y-1">
                        <div className="px-4 py-2 mb-4 font-bold text-lg text-primary">Panel Administratora</div>
                        <nav className="flex flex-col gap-1">
                            <Button 
                                variant={activeTab === 'products' ? "secondary" : "ghost"} 
                                className="justify-start" 
                                onClick={() => setActiveTab('products')}
                            >
                                <Package className="mr-2 h-4 w-4" /> Produkty
                            </Button>
                            <Button 
                                variant={activeTab === 'orders' ? "secondary" : "ghost"} 
                                className="justify-start" 
                                onClick={() => setActiveTab('orders')}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" /> Zamówienia
                            </Button>
                            
                            <div className="pt-4 mt-4 border-t">
                                <Link to="/profile">
                                    <Button variant="ghost" className="justify-start w-full">
                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Wróć do sklepu
                                    </Button>
                                </Link>
                                <Button variant="ghost" className="justify-start text-red-600 w-full" onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" /> Wyloguj
                                </Button>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 min-h-[500px]">
                    {activeTab === 'products' && <AdminProducts />}
                    {activeTab === 'orders' && <AdminOrders />}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;