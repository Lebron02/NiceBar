import React from 'react';
import { Truck, CreditCard, Package, Clock } from 'lucide-react';

const ShippingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 pt-20 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-3xl font-bold text-white mb-8">Dostawa i płatności</h1>

                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Truck className="text-blue-500" size={28} />
                        <h2 className="text-2xl font-semibold text-white">Metody dostawy</h2>
                    </div>
                    
                    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                        <div className="grid grid-cols-3 bg-slate-800/50 p-4 text-sm font-medium text-white border-b border-slate-800">
                            <div>Metoda</div>
                            <div>Czas dostawy</div>
                            <div className="text-right">Koszt</div>
                        </div>
                        <div className="divide-y divide-slate-800">
                            <div className="grid grid-cols-3 p-4 items-center hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Package size={18} className="text-slate-500" />
                                    <span className="font-medium text-white">Paczkomaty InPost</span>
                                </div>
                                <div className="text-sm">1-2 dni robocze</div>
                                <div className="text-right text-white font-medium">12.99 zł</div>
                            </div>
                            <div className="grid grid-cols-3 p-4 items-center hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Truck size={18} className="text-slate-500" />
                                    <span className="font-medium text-white">Kurier DPD</span>
                                </div>
                                <div className="text-sm">1-2 dni robocze</div>
                                <div className="text-right text-white font-medium">16.99 zł</div>
                            </div>
                            <div className="grid grid-cols-3 p-4 items-center hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Truck size={18} className="text-slate-500" />
                                    <span className="font-medium text-white">Kurier DPD Pobranie</span>
                                </div>
                                <div className="text-sm">1-2 dni robocze</div>
                                <div className="text-right text-white font-medium">21.99 zł</div>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-400 flex items-center gap-2">
                        <Clock size={16} /> Darmowa dostawa dla zamówień powyżej 299 zł.
                    </p>
                </div>

                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="text-pink-500" size={28} />
                        <h2 className="text-2xl font-semibold text-white">Metody płatności</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
                            <h3 className="text-white font-medium mb-2">Szybkie płatności online</h3>
                            <p className="text-sm text-slate-400">BLIK, szybkie przelewy, karty płatnicze. Obsługiwane przez PayU.</p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
                            <h3 className="text-white font-medium mb-2">Karta płatnicza</h3>
                            <p className="text-sm text-slate-400">Visa, Mastercard. Bezpieczne transakcje szyfrowane SSL.</p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
                            <h3 className="text-white font-medium mb-2">Płatność przy odbiorze</h3>
                            <p className="text-sm text-slate-400">Zapłać kurierowi gotówką lub kartą przy odbiorze paczki.</p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
                            <h3 className="text-white font-medium mb-2">Przelew tradycyjny</h3>
                            <p className="text-sm text-slate-400">Wysyłka następuje po zaksięgowaniu wpłaty na naszym koncie.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;