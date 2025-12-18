import React from 'react';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 pt-20 pb-16">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-3xl font-bold text-white mb-2">Polityka Prywatności</h1>
                <p className="text-slate-500 mb-10">Ostatnia aktualizacja: 20 Październik 2023</p>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Postanowienia ogólne</h2>
                        <p className="text-slate-400">
                            Niniejsza polityka prywatności określa zasady przetwarzania i ochrony danych osobowych 
                            przekazanych przez Użytkowników w związku z korzystaniem z usług NiceBar. Administratorem 
                            danych osobowych jest NiceBar Sp. z o.o. z siedzibą w Warszawie.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. Jakie dane zbieramy?</h2>
                        <p className="text-slate-400 mb-2">W celu realizacji zamówień zbieramy następujące dane:</p>
                        <ul className="list-disc list-inside text-slate-400 space-y-1 ml-4">
                            <li>Imię i nazwisko</li>
                            <li>Adres zamieszkania / dostawy</li>
                            <li>Adres e-mail</li>
                            <li>Numer telefonu</li>
                            <li>Historia zamówień</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Pliki Cookies</h2>
                        <p className="text-slate-400">
                            Nasz sklep wykorzystuje pliki cookies w celu zapewnienia poprawnego działania serwisu, 
                            zapamiętania zawartości koszyka oraz w celach statystycznych. Możesz w każdej chwili 
                            zmienić ustawienia przeglądarki dotyczące cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Kontakt</h2>
                        <p className="text-slate-400">
                            W sprawach dotyczących ochrony danych osobowych prosimy o kontakt pod adresem: 
                            <a href="mailto:rodo@nicebar.pl" className="text-blue-500 hover:text-blue-400 ml-1">rodo@nicebar.pl</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;