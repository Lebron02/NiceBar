import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Zakładam, że masz taki komponent

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 pt-20 pb-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4">Skontaktuj się z nami</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Masz pytania dotyczące zamówienia lub potrzebujesz porady barmańskiej? 
                        Jesteśmy tutaj, aby Ci pomóc.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <div className="space-y-8">
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <h3 className="text-xl font-semibold text-white mb-6">Dane kontaktowe</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-500/10 p-3 rounded-lg text-blue-500">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Email</p>
                                        <p className="text-slate-400">kontakt@nicebar.pl</p>
                                        <p className="text-sm text-slate-500 mt-1">Odpowiadamy w ciągu 24h</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-pink-500/10 p-3 rounded-lg text-pink-500">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Telefon</p>
                                        <p className="text-slate-400">+48 123 456 789</p>
                                        <p className="text-sm text-slate-500 mt-1">Pn-Pt: 9:00 - 17:00</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-500/10 p-3 rounded-lg text-purple-500">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Siedziba</p>
                                        <p className="text-slate-400">ul. Barmańska 12</p>
                                        <p className="text-slate-400">00-001 Warszawa</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Imię</label>
                                    <Input placeholder="Twoje imię" className="bg-slate-950 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Email</label>
                                    <Input type="email" placeholder="twoj@email.com" className="bg-slate-950 border-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Temat</label>
                                <Input placeholder="Czego dotyczy wiadomość?" className="bg-slate-950 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Wiadomość</label>
                                <textarea 
                                    className="flex min-h-[120px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Napisz nam jak możemy Ci pomóc..."
                                />
                            </div>
                            <Button className="w-full bg-white text-slate-950 hover:bg-slate-200">
                                Wyślij wiadomość <Send size={16} className="ml-2" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;