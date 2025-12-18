import React from 'react';
import { Wine, Award, Users } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 pt-20 pb-16">
            <div className="container mx-auto px-6">
            
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Pasja do sztuki barmańskiej</h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        NiceBar powstał z miłości do doskonałych koktajli i eleganckiego stylu życia. 
                        Wierzymy, że każdy może stać się mistrzem we własnym domu, mając odpowiednie narzędzia.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
                        <div className="bg-slate-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                            <Wine className="text-pink-500" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Jakość Premium</h3>
                        <p className="text-slate-400 text-sm">
                            Selekcjonujemy tylko najlepsze akcesoria wykonane z trwałych materiałów, które posłużą Ci latami.
                        </p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
                        <div className="bg-slate-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                            <Users className="text-blue-500" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Społeczność</h3>
                        <p className="text-slate-400 text-sm">
                            Nie tylko sprzedajemy sprzęt. Dzielimy się wiedzą, przepisami i inspirujemy tysiące domowych barmanów.
                        </p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
                        <div className="bg-slate-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                            <Award className="text-yellow-500" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Profesjonalizm</h3>
                        <p className="text-slate-400 text-sm">
                            Współpracujemy z najlepszymi barmanami w Polsce, aby dostarczać wiedzę na najwyższym poziomie.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-slate-900/50 rounded-3xl p-8 md:p-12 border border-slate-800">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">Nasza Historia</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Wszystko zaczęło się w 2018 roku w małym mieszkaniu w Warszawie. Brakowało nam miejsca, 
                            gdzie można kupić profesjonalny sprzęt barmański, który jednocześnie świetnie wygląda na domowym barku.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Dziś NiceBar to zespół 15 pasjonatów, tysiące zadowolonych klientów i setki autorskich przepisów. 
                            Dziękujemy, że jesteś z nami w tej podróży.
                        </p>
                    </div>
                    <div className="h-64 md:h-full bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                        <span className="text-slate-500 font-medium">Zdjęcie zespołu / biura</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;