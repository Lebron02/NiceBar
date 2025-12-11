import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom'; // Używamy NavLink do aktywnego stanu
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { 
    LayoutDashboard, 
    Package, 
    MapPin, 
    Settings, 
    LogOut, 
    User as UserIcon 
} from 'lucide-react';

const UserLayout = () => {
    const { user, logout } = useAuth();

    if (!user) return <div className="text-center pt-10">Nie jesteś zalogowany!</div>;

    // Funkcja pomocnicza do styli linków
    const getLinkClass = ({ isActive }) => {
        const baseClass = "justify-start w-full flex items-center py-2 px-4 rounded-md transition-colors text-sm font-medium";
        return isActive 
            ? `${baseClass} bg-secondary text-secondary-foreground` 
            : `${baseClass} hover:bg-muted hover:text-accent-foreground transparent`;
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-8">
            <div className="flex flex-col md:flex-row gap-8">

                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-4 space-y-1">
                        <div className="px-4 py-2 mb-4 font-bold text-3xl">Moje konto</div>
                        <nav className="flex flex-col gap-1">
                            {/* end prop sprawia, że Pulpit świeci się tylko na głównym urlo, a nie na podstronach */}
                            <NavLink to="" end className={getLinkClass}>
                                <LayoutDashboard className="mr-2 h-4 w-4" /> Pulpit
                            </NavLink>
                            
                            <NavLink to="orders" className={getLinkClass}>
                                <Package className="mr-2 h-4 w-4" /> Zamówienia
                            </NavLink>
                            
                            <NavLink to="address" className={getLinkClass}>
                                <MapPin className="mr-2 h-4 w-4" /> Dane do zamówień
                            </NavLink>
                            
                            <NavLink to="settings" className={getLinkClass}>
                                <Settings className="mr-2 h-4 w-4" /> Ustawienia
                            </NavLink>
                            
                            {user.role === 'admin' && (
                                <Link to="/admin/dashboard" className="w-full">
                                    <Button variant="ghost" className="justify-start text-blue-600 w-full">
                                        <UserIcon className="mr-2 h-4 w-4" /> Panel Admina
                                    </Button>
                                </Link>
                            )}
                            
                            <div className="pt-4 mt-4 border-t">
                                <Button variant="ghost" className="justify-start text-red-600 w-full" onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" /> Wyloguj
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
    );
};

export default UserLayout;