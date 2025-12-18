import React from 'react';
import { RefreshCcw, AlertCircle, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ReturnsPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 pt-20 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-3xl font-bold text-white mb-8">Zwroty i reklamacje</h1>

                <div className="grid gap-8">
                    <section className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <RefreshCcw className="text-green-500" size={24} />
                            <h2 className="text-xl font-semibold text-white">Odstąpienie od umowy (Zwrot)</h2>
                        </div>
                        <div className="space-y-4 text-slate-400 leading-relaxed">
                            <p>
                                Masz prawo odstąpić od umowy w terminie <strong className="text-white">14 dni</strong> od otrzymania przesyłki bez podawania przyczyny. 
                                Aby skorzystać z tego prawa, wykonaj następujące kroki:
                            </p>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>Wypełnij formularz zwrotu (dostępny do pobrania poniżej).</li>
                                <li>Zapakuj zwracany towar bezpiecznie (najlepiej w oryginalne opakowanie).</li>
                                <li>Dołącz formularz zwrotu do paczki.</li>
                                <li>Odeślij paczkę na nasz adres: <span className="text-white">NiceBar Zwroty, ul. Barmańska 12, 00-001 Warszawa</span>.</li>
                            </ol>
                            <div className="pt-4">
                                <Button variant="outline" className="border-slate-700 text-slate-950 hover:bg-slate-800 hover:text-white">
                                    <Download size={16} className="mr-2" /> Pobierz formularz zwrotu (PDF)
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="text-red-500" size={24} />
                            <h2 className="text-xl font-semibold text-white">Reklamacje</h2>
                        </div>
                        <div className="space-y-4 text-slate-400 leading-relaxed">
                            <p>
                                Wszystkie produkty w naszym sklepie objęte są 2-letnią rękojmią. Jeśli produkt posiada wadę, 
                                możesz złożyć reklamację.
                            </p>
                            <p>
                                Prosimy o przesłanie zgłoszenia na adres e-mail: <strong className="text-white">reklamacje@nicebar.pl</strong>, 
                                dołączając zdjęcia wady oraz numer zamówienia. Skontaktujemy się z Tobą w ciągu 14 dni z decyzją 
                                dotyczącą rozpatrzenia reklamacji.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReturnsPage;