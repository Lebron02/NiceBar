import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { UserPlus } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        address: { 
            streetName: '',
            streetNumber: '',
            city: '',
            postalCode: ''
        }
    });
    const [error, setError] = useState('');
    
    const { register, loading } = useAuth(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            address: {
                ...prevData.address,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        if (formData.password !== formData.confirmPassword) {
            setError('Hasła nie są identyczne!');
            return;
        }
        if (formData.password.length < 6) {
             setError('Hasło musi mieć co najmniej 6 znaków.');
             return;
        }

        try {
            const { confirmPassword, ...dataToSend } = formData;
            await register(dataToSend); 
        } catch (err) {
            setError(err.response?.data?.message || 'Nie udało się zarejestrować. Spróbuj ponownie.');
        }
    };

    const inputClasses = "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500";
    const labelClasses = "text-slate-300";

    return (
        <div className='w-full min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950 text-slate-300'>
            <Card className="w-full max-w-lg bg-slate-900 border-slate-800 shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="bg-slate-950 p-3 rounded-full border border-slate-800">
                            <UserPlus className="text-pink-500" size={24} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center text-white font-bold">Stwórz konto</CardTitle>
                    <CardDescription className="text-center text-slate-400">
                        Dołącz do nas, aby zamawiać najlepsze artykuły barmańskie
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} id='registration-form'>
                    <div className="flex flex-col gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className={labelClasses}>Email</Label>
                            <Input
                                id="email"
                                name="email" 
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={formData.email} 
                                onChange={handleChange} 
                                className={inputClasses}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName" className={labelClasses}>Imię</Label>
                                <Input 
                                    id="firstName" 
                                    name="firstName" 
                                    type="text"
                                    required 
                                    value={formData.firstName} 
                                    onChange={handleChange} 
                                    className={inputClasses}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName" className={labelClasses}>Nazwisko</Label>
                                <Input 
                                    id="lastName" 
                                    name="lastName" 
                                    type="text"
                                    required 
                                    value={formData.lastName} 
                                    onChange={handleChange} 
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t border-slate-800">
                            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Adres dostawy</span>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2 col-span-2">
                                    <Label htmlFor="streetName" className={labelClasses}>Ulica</Label>
                                    <Input 
                                        id="streetName" 
                                        name="streetName" 
                                        type="text"
                                        required 
                                        value={formData.address.streetName} 
                                        onChange={handleAddressChange} 
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="streetNumber" className={labelClasses}>Nr domu</Label>
                                    <Input 
                                        id="streetNumber" 
                                        name="streetNumber" 
                                        type="text" 
                                        required 
                                        value={formData.address.streetNumber} 
                                        onChange={handleAddressChange} 
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="postalCode" className={labelClasses}>Kod pocztowy</Label>
                                    <Input 
                                        id="postalCode" 
                                        name="postalCode" 
                                        type="text"
                                        required 
                                        value={formData.address.postalCode} 
                                        onChange={handleAddressChange} 
                                        className={inputClasses}
                                    />
                                </div>  
                                <div className="grid gap-2 col-span-2">
                                    <Label htmlFor="city" className={labelClasses}>Miasto</Label>
                                    <Input 
                                        id="city" 
                                        name="city" 
                                        type="text"
                                        required 
                                        value={formData.address.city} 
                                        onChange={handleAddressChange}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t border-slate-800">
                            <div className="grid gap-2">
                                <Label htmlFor="password" className={labelClasses}>Hasło</Label>
                                <Input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    required 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    className={inputClasses}
                                />
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword" className={labelClasses}>Powtórz hasło</Label>
                                <Input 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    type="password" 
                                    required 
                                    value={formData.confirmPassword} 
                                    onChange={handleChange} 
                                    className={`${inputClasses} ${formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                />
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="text-xs text-red-500">Hasła nie pasują do siebie</p>
                                )}
                            </div>
                        </div>

                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 mt-2">
                    <Button 
                        type="submit" 
                        form="registration-form" 
                        className="w-full bg-white text-slate-950 hover:bg-slate-200 font-semibold" 
                        disabled={loading}
                    > 
                        {loading ? 'Rejestracja...' : 'Zarejestruj się'}
                    </Button>
                    
                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20 w-full">
                            {error}
                        </div>
                    )}

                    <div className="text-center text-sm text-slate-400 mt-2">
                        Masz już konto?{" "}
                        <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium hover:underline">
                            Zaloguj się
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;