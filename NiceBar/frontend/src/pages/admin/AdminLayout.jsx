import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, ShieldAlert, Users, FolderTree, User as UserIcon  } from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useAuth();

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Brak dostępu</h2>
                <p className="text-center max-w-md mb-6">
                    Ta sekcja jest dostępna tylko dla administratorów. Jeśli uważasz, że to błąd, skontaktuj się z obsługą techniczną.
                </p>
                <Link to="/">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-900">
                        Wróć do sklepu
                    </Button>
                </Link>
            </div>
        );
    }

    const getLinkClass = ({ isActive }) => {
        const baseClass = "justify-start w-full flex items-center py-2 px-4 rounded-md transition-colors text-sm font-medium";
        return isActive 
            ? `${baseClass} bg-slate-800 text-white` 
            : `${baseClass} text-slate-400 hover:bg-slate-900 hover:text-white`;
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300">
            <div className="container mx-auto py-12 px-4 md:px-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* SIDEBAR */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="sticky top-24 space-y-4">
                            <div className="px-4 mb-2">
                                <h2 className="font-bold text-2xl text-white flex items-center gap-2">
                                    Administrator
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                            </div>
                            
                            <nav className="flex flex-col gap-1">
                                <NavLink to="/admin/dashboard" end className={getLinkClass}>
                                    <LayoutDashboard className="mr-3 h-4 w-4" /> Pulpit
                                </NavLink>
                                
                                <NavLink to="/admin/products" className={getLinkClass}>
                                    <Package className="mr-3 h-4 w-4" /> Produkty
                                </NavLink>
                                
                                <NavLink to="/admin/categories" className={getLinkClass}>
                                    <FolderTree className="mr-3 h-4 w-4" /> Kategorie
                                </NavLink>

                                <NavLink to="/admin/orders" className={getLinkClass}>
                                    <ShoppingCart className="mr-3 h-4 w-4" /> Zamówienia
                                </NavLink>

                                <NavLink to="/admin/users" className={getLinkClass}>
                                    <Users className="mr-3 h-4 w-4" /> Użytkownicy
                                </NavLink>

                                <Link to="/account" className="w-full mt-2">
                                        <Button variant="ghost" className="justify-start text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 w-full pl-4">
                                            <UserIcon className="mr-3 h-4 w-4" /> Panel użytkownika
                                        </Button>
                                    </Link>
                                
                                <Link to="/" className="w-full mt-2">
                                    <Button variant="ghost" className="justify-start text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 w-full pl-4">
                                        <Store className="mr-3 h-4 w-4" /> Sklep
                                    </Button>
                                </Link>
                                
                                <div className="pt-4 mt-4 border-t border-slate-800">
                                    <Button variant="ghost" className="justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full pl-4" onClick={logout}>
                                        <LogOut className="mr-3 h-4 w-4" /> Wyloguj
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 min-h-[500px]">
                        <Outlet /> 
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;