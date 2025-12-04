import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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

        try {
            await register(formData); 
        } catch (err) {
            setError(err.response?.data?.message || 'Nie udało się zarejestrować. Spróbuj ponownie.');
        }
    };

    return (
        <div className='w-full h-screen justify-center flex items-center'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Stwórz konto</CardTitle>
                    <CardDescription>
                    Wpisz wymagane dane by stworzyć konto
                    </CardDescription>
                    <CardAction>
                    <Link to="/login"><Button variant="link">Zaloguj się</Button></Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} id='registration-form'>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email" 
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="firstName">Imię</Label>
                        <Input 
                            id="firstName" 
                            name="firstName" 
                            type="text"
                            required 
                            value={formData.firstName} 
                            onChange={handleChange} 
                        />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="lastName">Nazwisko</Label>
                        <Input 
                            id="lastName" 
                            name="lastName"
                            type="text"
                            required 
                            value={formData.lastName} 
                            onChange={handleChange} 
                        />
                        </div>

                        <div className="grid gap-2">
                        <Label htmlFor="streetName">Ulica</Label>
                        <Input 
                            id="streetName" 
                            name="streetName" 
                            type="text"
                            required 
                            value={formData.address.streetName} 
                            onChange={handleAddressChange} 
                        />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="streetNumber">Numer ulicy</Label>
                        <Input 
                            id="streetNumber" 
                            name="streetNumber" 
                            type="text" 
                            required 
                            value={formData.address.streetNumber} 
                            onChange={handleAddressChange} 
                        />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="city">Miasto</Label>
                        <Input 
                            id="city" 
                            name="city" 
                            type="text"
                            required 
                            value={formData.address.city} 
                            onChange={handleAddressChange}
                        />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="postalCode">Kod pocztowy</Label>
                        <Input 
                            id="postalCode" 
                            name="postalCode" 
                            type="text"
                            required 
                            value={formData.address.postalCode} 
                            onChange={handleAddressChange} 
                        />
                        </div>  

                        <div className="grid gap-2">
                        <Label htmlFor="password">Hasło</Label>
                        <Input 
                            id="password" 
                            name="password" 
                            type="password" 
                            required 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" form="registration-form" className="w-full" disabled={loading}> {loading ? 'Rejestracja...' : 'Zarejestruj się'}
                    </Button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;