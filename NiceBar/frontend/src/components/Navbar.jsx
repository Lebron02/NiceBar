import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();

    const navLinks = [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'Koszyk', url: '/cart' },
        { name: 'Konto', url: '/account' },
    ];

    const getLinkClass = ({ isActive }) => 
        isActive 
            ? 'text-white font-medium capitalize transition-colors' 
            : 'text-slate-400 font-medium capitalize hover:text-white transition-colors';

    return (
        <header className="sticky top-0 z-50 w-full bg-slate-950 border-b border-slate-800">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                
                <div className="text-4xl font-bold tracking-wider text-white">
                    <Link to={'/'}>Nicebar</Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((page, index) => (
                        <NavLink 
                            key={index} 
                            to={page.url} 
                            className={getLinkClass}
                        >
                            {page.name}
                        </NavLink>
                    ))}

                    <div className="ml-4">
                        {isLoggedIn ? (
                            <Button 
                                variant="outline" 
                                className="border-slate-700 text-slate-950 hover:bg-slate-800 hover:text-white"
                                onClick={logout}
                            >
                                Wyloguj się
                            </Button>
                        ) : (
                            <Link to='/login'>
                                <Button variant="secondary" className="w-full text-slate-950">
                                    Zaloguj się
                                </Button>
                            </Link>
                        )}
                    </div>
                </nav>

                {/* MOBILE HAMBURGER */}
                <div className="md:hidden">
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="text-slate-300 hover:text-white transition-colors focus:outline-none"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            {isOpen && (
                <div className="md:hidden bg-slate-950 border-t border-slate-800 absolute w-full left-0 shadow-xl">
                    <nav className="flex flex-col items-center py-8 space-y-6">
                        {navLinks.map((page, index) => (
                            <NavLink 
                                key={index} 
                                to={page.url} 
                                onClick={() => setIsOpen(false)} // Zamknij menu po kliknięciu
                                className={({ isActive }) => 
                                    isActive 
                                        ? 'text-lg text-white font-medium capitalize' 
                                        : 'text-lg text-slate-400 font-medium capitalize hover:text-white'
                                }
                            >
                                {page.name}
                            </NavLink>
                        ))}
                        
                        <div className="pt-4">
                            {isLoggedIn ? (
                                <Button 
                                    variant="outline"
                                    className="border-slate-700 text-slate-950 hover:bg-slate-800 w-full"
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                >
                                    Wyloguj się
                                </Button>
                            ) : (
                                <Link to='/login' onClick={() => setIsOpen(false)}>
                                    <Button className="bg-white text-slate-950 hover:bg-slate-200 w-full">
                                        Zaloguj się
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;