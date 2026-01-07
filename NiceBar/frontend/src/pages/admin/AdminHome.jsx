import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, FolderTree } from 'lucide-react';

const AdminHome = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Witaj w panelu administratora</h1>
            <div className="grid gap-4 md:grid-cols-3">
                
                <Link to="/admin/products">
                    <Card className="bg-slate-900 border-slate-800 hover:bg-slate-950">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                Produkty
                            </CardTitle>
                            <Package className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">Zarządzaj produktami</div>
                            <p className="text-xs text-slate-500">
                                Edytuj, dodawaj i usuwaj asortyment
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/admin/orders">
                    <Card className="bg-slate-900 border-slate-800 hover:bg-slate-950">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                Zamówienia
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">Status zamówień</div>
                            <p className="text-xs text-slate-500">
                                Zmieniaj statusy dostaw
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/admin/users">
                    <Card className="bg-slate-900 border-slate-800 hover:bg-slate-950">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                Klienci
                            </CardTitle>
                            <Users className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">Baza klientów</div>
                            <p className="text-xs text-slate-500">
                                Podgląd użytkowników
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/admin/categories">
                    <Card className="bg-slate-900 border-slate-800 hover:bg-slate-950">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                Kategorie
                            </CardTitle>
                                <FolderTree className="h-4 w-4 text-red-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">Zarządzaj kategoriami</div>
                            <p className="text-xs text-slate-500">
                                Edytuj, dodawaj i usuwaj kategoiami produktów
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default AdminHome;