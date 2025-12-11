import React, { useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
                <Label htmlFor="current">Obecne hasło</Label>
                <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new">Nowe hasło</Label>
                <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm">Powtórz nowe hasło</Label>
                <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            {message.text && (
                <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{message.text}</p>
            )}
            <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading}>Zmień hasło</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
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
                <Label htmlFor="code">Tajny kod administratora</Label>
                <Input id="code" type="password" placeholder="••••••••" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} required />
            </div>
            {status.message && (
                <div className={`text-sm p-2 rounded ${status.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {status.message}
                </div>
            )}
            <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading}>Zatwierdź</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
            </div>
        </form>
    );
};

const UserSettings = () => {
    const { user } = useAuth();
    const [activeForm, setActiveForm] = useState(null); 

    const goBack = () => setActiveForm(null);

    const renderHeader = (title) => (
        <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" onClick={goBack} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">{title}</h3>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
             <h2 className="text-2xl font-bold tracking-tight">Ustawienia</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Ustawienia konta</CardTitle>
                    <CardDescription>Bezpieczeństwo i uprawnienia.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {activeForm === null && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center border-b pb-4">
                                <div>
                                    <p className="font-medium">Hasło</p>
                                    <p className="text-sm text-muted-foreground">Zadbaj o bezpieczeństwo swojego konta</p>
                                </div>
                                <Button variant="secondary" onClick={() => setActiveForm('password')}>Zmień</Button>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                                <div>
                                    <p className="font-medium">Uprawnienia</p>
                                    <p className="text-sm text-muted-foreground">Obecna rola: <Badge variant="outline" className="capitalize ml-1">{user.role}</Badge></p>
                                </div>
                                {user.role !== 'admin' && (
                                    <Button variant="outline" onClick={() => setActiveForm('admin')}>Zostań adminem</Button>
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