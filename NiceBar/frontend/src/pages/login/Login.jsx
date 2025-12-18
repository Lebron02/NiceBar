import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { LogIn } from 'lucide-react';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login, loading } = useAuth(); 
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            await login(email, password, redirectPath);
        } catch (err) {
            setError(err.response?.data?.message || 'Nie udało się zalogować. Spróbuj ponownie.');
        }
    };

    return (
        <div className='flex min-h-screen w-full items-center justify-center px-4 bg-slate-950 text-slate-300 py-12'>
            <Card className="w-full max-w-sm bg-slate-900 border-slate-800 shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="bg-slate-950 p-3 rounded-full border border-slate-800">
                            <LogIn className="text-blue-500" size={24} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center text-white font-bold">Witaj ponownie</CardTitle>
                    <CardDescription className="text-center text-slate-400">
                        Wpisz swoje dane, aby się zalogować
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} id="login-form">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-300">Hasło</Label>
                                    <Link to="/forgot-password" className="text-sm font-medium text-blue-500 hover:text-blue-400">
                                        Zapomniałeś hasła?
                                    </Link>
                                </div>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-slate-950 border-slate-700 text-white focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button 
                        type="submit" 
                        form="login-form" 
                        className="w-full bg-white text-slate-950 hover:bg-slate-200 font-semibold" 
                        disabled={loading}
                    > 
                        {loading ? 'Logowanie...' : 'Zaloguj się'}
                    </Button>
                    
                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20 w-full">
                            {error}
                        </div>
                    )}

                    <div className="text-center text-sm text-slate-400 mt-2">
                        Nie masz jeszcze konta?{" "}
                        <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium hover:underline">
                            Zarejestruj się
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;