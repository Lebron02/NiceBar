import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' }); 
    
    const { changePassword, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Nowe hasła nie są identyczne!' });
            return;
        }
        if (newPassword.length < 6) {
             setMessage({ type: 'error', text: 'Hasło musi mieć min. 6 znaków.' });
             return;
        }

        try {
            await changePassword(currentPassword, newPassword);
            setMessage({ type: 'success', text: 'Hasło zostało zmienione!' });

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            setTimeout(() => navigate('/account'), 2000);

        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Wystąpił błąd zmiany hasła.' 
            });
        }
    };

    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Zmiana hasła</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current">Obecne hasło</Label>
                            <Input 
                                id="current" 
                                type="password" 
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new">Nowe hasło</Label>
                            <Input 
                                id="new" 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm">Powtórz nowe hasło</Label>
                            <Input 
                                id="confirm" 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {message.text && (
                            <p className={`text-sm text-center ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {message.text}
                            </p>
                        )}

                        <Button type="submit" disabled={loading} className="mt-2">
                            {loading ? 'Zmienianie...' : 'Zmień hasło'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="link" onClick={() => navigate('/account')}>
                        Anuluj / Wróć do profilu
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ChangePassword;