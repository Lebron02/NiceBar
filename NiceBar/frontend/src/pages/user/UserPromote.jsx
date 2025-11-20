import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";

const PromoteToAdmin = () => {
    const [secretCode, setSecretCode] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    
    const { promoteToAdmin, loading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/profile');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        try {
            await promoteToAdmin(secretCode);
            
            setStatus({ type: 'success', message: 'Gratulacje! Zostałeś administratorem.' });
            
            setTimeout(() => {
                navigate('/account');
            }, 2000);

        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.response?.data?.message || 'Nieprawidłowy kod autoryzacyjny.' 
            });
        }
    };

    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Awans na Administratora</CardTitle>
                    <CardDescription className="text-center">
                        Wpisz tajny kod autoryzacyjny otrzymany od administratora systemu.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Tajny kod</Label>
                            <Input 
                                id="code" 
                                type="password" 
                                placeholder="••••••••"
                                value={secretCode}
                                onChange={(e) => setSecretCode(e.target.value)}
                                required
                            />
                        </div>

                        {status.message && (
                            <div className={`text-sm text-center p-2 rounded ${
                                status.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                            }`}>
                                {status.message}
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="mt-2 w-full">
                            {loading ? 'Weryfikacja...' : 'Zatwierdź'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="link" onClick={() => navigate('/account')}>
                        Anuluj
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PromoteToAdmin;