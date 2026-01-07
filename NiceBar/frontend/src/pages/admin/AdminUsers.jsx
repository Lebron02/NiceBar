import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Search, Trash2, Shield, User, MapPin, Calendar, DollarSign, ShoppingBag } from 'lucide-react';

const AdminUsers = () => {
    const { api } = useAuth();
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Pobieranie danych
    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, ordersRes] = await Promise.all([
                api.get('/users'), 
                api.get('/orders')
            ]);
            setUsers(usersRes.data);
            setOrders(ordersRes.data);
        } catch (error) {
            console.error("Błąd pobierania danych:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Usuwanie użytkownika
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Czy na pewno chcesz usunąć tego użytkownika? Ta operacja jest nieodwracalna.")) {
            try {
                await api.delete(`/users/${userId}`); 
                alert("Użytkownik usunięty");
                fetchData();
            } catch (error) {
                alert("Nie udało się usunąć użytkownika");
            }
        }
    };

    // Helper: Obliczanie statystyk dla konkretnego usera
    const getUserStats = (userId) => {
        const userOrders = orders.filter(order => order.user?._id === userId || order.user === userId);
        const totalSpent = userOrders.reduce((acc, curr) => acc + (curr.isPaid ? curr.totalPrice : 0), 0);
        return {
            orderCount: userOrders.length,
            totalSpent: totalSpent.toFixed(2),
            lastOrder: userOrders.length > 0 ? new Date(userOrders[0].createdAt).toLocaleDateString() : 'Brak'
        };
    };

    // Filtrowanie
    const filteredUsers = (users || []).filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800 pb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="text-white text-2xl">Użytkownicy</CardTitle>
                        <CardDescription className="text-slate-400">Lista zarejestrowanych klientów i ich statystyki.</CardDescription>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Szukaj po emailu lub nazwisku..." 
                            className="pl-8 bg-slate-950 border-slate-700 text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="rounded-md border border-slate-800 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-950">
                            <TableRow className="border-slate-800 hover:bg-slate-950">
                                <TableHead className="text-slate-400">Użytkownik</TableHead>
                                <TableHead className="text-slate-400">Rola</TableHead>
                                <TableHead className="text-slate-400">Rejestracja</TableHead>
                                <TableHead className="text-slate-400 text-center">Zamówienia</TableHead>
                                <TableHead className="text-slate-400 text-right">Łączna kwota</TableHead>
                                <TableHead className="text-right text-slate-400">Akcje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => {
                                const stats = getUserStats(user._id);
                                return (
                                    <TableRow key={user._id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback className="bg-slate-700 text-slate-300">
                                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-slate-200">{user.firstName} {user.lastName}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {user.role === 'admin' || user.isAdmin ? (
                                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20">
                                                    <Shield className="w-3 h-3 mr-1" /> Admin
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-slate-800 text-slate-400">Klient</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-center text-slate-300">
                                            {stats.orderCount}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-emerald-400">
                                            {stats.totalSpent} zł
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {/* MODAL SZCZEGÓŁÓW */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                                                            Szczegóły
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-slate-900 border-slate-800 text-slate-300 sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-white flex items-center gap-2">
                                                                <User className="w-5 h-5" /> {user.firstName} {user.lastName}
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                ID: {user._id}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                                                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><ShoppingBag size={12}/> Liczba zamówień</div>
                                                                    <div className="text-xl font-bold text-white">{stats.orderCount}</div>
                                                                </div>
                                                                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                                                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><DollarSign size={12}/> Wydano</div>
                                                                    <div className="text-xl font-bold text-emerald-400">{stats.totalSpent} zł</div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div className="flex items-start gap-3 p-3 bg-slate-950/50 rounded border border-slate-800/50">
                                                                    <MapPin className="w-4 h-4 text-slate-500 mt-1" />
                                                                    <div>
                                                                        <div className="text-xs text-slate-500 uppercase font-semibold">Adres</div>
                                                                        <div className="text-sm">
                                                                            {user.address ? (
                                                                                <>
                                                                                    {user.address.streetName} {user.address.streetNumber}<br/>
                                                                                    {user.address.postalCode} {user.address.city}
                                                                                </>
                                                                            ) : <span className="text-slate-600 italic">Brak danych adresowych</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded border border-slate-800/50">
                                                                    <Calendar className="w-4 h-4 text-slate-500" />
                                                                    <div>
                                                                        <div className="text-xs text-slate-500 uppercase font-semibold">Ostatnie zamówienie</div>
                                                                        <div className="text-sm">{stats.lastOrder}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminUsers;