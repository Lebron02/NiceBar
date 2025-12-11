import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
        <div className='flex min-h-screen w-full items-center justify-center px-4'>
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Zaloguj się</CardTitle>
                <CardDescription>
                Wpisz wymagane dane by się zalogować
                </CardDescription>
                <CardAction>
                <Link to="/register"><Button variant="link">Zarejestruj się</Button></Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} id="login-form">
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    
                    />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Hasło</Label>
                    </div>
                    <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" form="login-form" className="w-full" disabled={loading}  > {loading ? 'Logowanie...' : 'Zaloguj'}
                </Button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </CardFooter>
        </Card>
    </div>
    );
};

export default Login;