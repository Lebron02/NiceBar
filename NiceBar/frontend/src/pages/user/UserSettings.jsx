import React, { useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const inputClasses = "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500";
const labelClasses = "text-slate-300";

const ChangePasswordForm = ({ onCancel, onSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const { changePassword, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) return setMessage({ type: 'error', text: 'Nowe hasła nie są identyczne!' });
        if (newPassword.length < 6) return setMessage({ type: 'error', text: 'Hasło musi mieć min. 6 znaków.' });

        try {
            await changePassword(currentPassword, newPassword);
            setMessage({ type: 'success', text: 'Hasło zostało zmienione!' });
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
            setTimeout(() => { if (onSuccess) onSuccess(); }, 1500);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Błąd zmiany hasła.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-2">
                <Label htmlFor="current" className={labelClasses}>Obecne hasło</Label>
                <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={inputClasses} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new" className={labelClasses}>Nowe hasło</Label>
                <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className={inputClasses} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm" className={labelClasses}>Powtórz nowe hasło</Label>
                <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClasses} />
            </div>
            {message.text && (
                <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{message.text}</p>
            )}
            <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white">Zmień hasło</Button>
                <Button type="button" variant="outline" onClick={onCancel} className="border-slate-700 text-slate-950 hover:bg-slate-800 hover:text-white">Anuluj</Button>
            </div>
        </form>
    );
};


const PromoteForm = ({ onCancel, onSuccess }) => {
    const [secretCode, setSecretCode] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const { promoteToAdmin, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        try {
            await promoteToAdmin(secretCode);
            setStatus({ type: 'success', message: 'Gratulacje! Zostałeś administratorem.' });
            setTimeout(() => { if (onSuccess) onSuccess(); }, 1500);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Błąd weryfikacji.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-2">
                <Label htmlFor="code" className={labelClasses}>Tajny kod administratora</Label>
                <Input id="code" type="password" placeholder="••••••••" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} required className={inputClasses} />
            </div>
            {status.message && (
                <div className={`text-sm p-2 rounded ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                    {status.message}
                </div>
            )}
            <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white">Zatwierdź</Button>
                <Button type="button" variant="outline" onClick={onCancel} className="border-slate-700 text-slate-950 hover:bg-slate-800 hover:text-white">Anuluj</Button>
            </div>
        </form>
    );
};

const UserSettings = () => {
    const { user } = useAuth();
    const [activeForm, setActiveForm] = useState(null); 

    const goBack = () => setActiveForm(null);

    const renderHeader = (title) => (
        <div className="flex items-center gap-2 mb-6 text-white">
            <Button variant="ghost" size="icon" onClick={goBack} className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">{title}</h3>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
             <h2 className="text-2xl font-bold tracking-tight text-white">Ustawienia</h2>
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                    <CardTitle className="text-white">Ustawienia konta</CardTitle>
                    <CardDescription className="text-slate-400">Bezpieczeństwo i uprawnienia.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {activeForm === null && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-6">
                                <div>
                                    <p className="font-medium text-white mb-1">Hasło</p>
                                    <p className="text-sm text-slate-500">Zadbaj o bezpieczeństwo swojego konta</p>
                                </div>
                                <Button variant="secondary" onClick={() => setActiveForm('password')} className="bg-slate-800 text-white hover:bg-slate-700">Zmień</Button>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                                <div>
                                    <p className="font-medium text-white mb-1">Uprawnienia</p>
                                    <p className="text-sm text-slate-500">Obecna rola: <Badge variant="outline" className="capitalize ml-1 border-slate-700 text-slate-300">{user.role}</Badge></p>
                                </div>
                                {user.role !== 'admin' && (
                                    <Button variant="outline" onClick={() => setActiveForm('admin')} className="border-slate-700 text-slate-950 hover:bg-slate-800 hover:text-white">Zostań adminem</Button>
                                )}
                            </div>
                        </div>
                    )}

                    {activeForm === 'password' && (
                        <div>
                            {renderHeader("Zmiana hasła")}
                            <ChangePasswordForm onCancel={goBack} onSuccess={goBack} />
                        </div>
                    )}

                    {activeForm === 'admin' && (
                        <div>
                            {renderHeader("Autoryzacja Administratora")}
                            <PromoteForm onCancel={goBack} onSuccess={goBack} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserSettings;