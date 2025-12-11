import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-auto">
            <div className="container mx-auto px-6 pt-8 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white tracking-wider">NiceBar</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Najlepsze akcesoria barmańskie i inspirujące przepisy. 
                            Tworzymy pasję do smaku i elegancji w każdym drinku.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-pink-500 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-sky-500 transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Sklep</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-white transition-colors">Strona główna</Link></li>
                            <li><Link to="/products" className="hover:text-white transition-colors">Wszystkie produkty</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Blog barmański</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">O nas</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Pomoc</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/contact" className="hover:text-white transition-colors">Kontakt</Link></li>
                            <li><Link to="/shipping" className="hover:text-white transition-colors">Dostawa i płatności</Link></li>
                            <li><Link to="/returns" className="hover:text-white transition-colors">Zwroty i reklamacje</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Polityka prywatności</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Newsletter</h4>
                        <p className="text-sm text-slate-400 mb-4">
                            Zapisz się, aby otrzymywać nowości i unikalne przepisy.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Input 
                                type="email" 
                                placeholder="Twój e-mail" 
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-600"
                            />
                            <Button variant="secondary" className="w-full">
                                Zapisz się
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {currentYear} NiceBar. Wszelkie prawa zastrzeżone.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <div className="flex items-center gap-2">
                            <Mail size={14} /> kontakt@nicebar.pl
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={14} /> +48 123 456 789
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;