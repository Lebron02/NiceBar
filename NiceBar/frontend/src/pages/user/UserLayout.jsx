import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { 
    LayoutDashboard, 
    ShoppingCart,
    MapPin, 
    Settings, 
    LogOut, 
    User as UserIcon 
} from 'lucide-react';

const UserLayout = () => {
    const { user, logout } = useAuth();

    if (!user) return <div className="text-center pt-10 text-slate-300 bg-slate-950 min-h-screen">Nie jesteś zalogowany!</div>;

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

                    <aside className="w-full md:w-64 shrink-0">
                        <div className="sticky top-24 space-y-4">
                            <div className="px-4 mb-2">
                                <h2 className="font-bold text-2xl text-white">Moje konto</h2>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            
                            <nav className="flex flex-col gap-1">
                                <NavLink to="" end className={getLinkClass}>
                                    <LayoutDashboard className="mr-3 h-4 w-4" /> Pulpit
                                </NavLink>
                                
                                <NavLink to="orders" className={getLinkClass}>
                                    <ShoppingCart className="mr-3 h-4 w-4" /> Zamówienia
                                </NavLink>
                                
                                <NavLink to="address" className={getLinkClass}>
                                    <MapPin className="mr-3 h-4 w-4" /> Dane do zamówień
                                </NavLink>
                                
                                <NavLink to="settings" className={getLinkClass}>
                                    <Settings className="mr-3 h-4 w-4" /> Ustawienia
                                </NavLink>
                                
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="w-full mt-2">
                                        <Button variant="ghost" className="justify-start text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 w-full pl-4">
                                            <UserIcon className="mr-3 h-4 w-4" /> Panel Administratora
                                        </Button>
                                    </Link>
                                )}
                                
                                <div className="pt-4 mt-4 border-t border-slate-800">
                                    <Button variant="ghost" className="justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full pl-4" onClick={logout}>
                                        <LogOut className="mr-3 h-4 w-4" /> Wyloguj
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    <main className="flex-1 min-h-[500px]">
                        <Outlet /> 
                    </main>
                </div>
            </div>
        </div>
    );
};

export default UserLayout;