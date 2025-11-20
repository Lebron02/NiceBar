import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const ChangeAddress = () => {
    const { user, updateAddress, loading } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        streetName: '',
        streetNumber: '',
        city: '',
        postalCode: ''
    });

    useEffect(() => {
        if (user && user.address) {
            setFormData({
                streetName: user.address.streetName || '',
                streetNumber: user.address.streetNumber || '',
                city: user.address.city || '',
                postalCode: user.address.postalCode || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await updateAddress(formData);
            navigate('/account'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Wystąpił błąd zapisu.');
        }
    };

    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Zmień adres</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        
                        <div className="grid gap-2">
                            <Label htmlFor="streetName">Ulica</Label>
                            <Input name="streetName" value={formData.streetName} onChange={handleChange} required />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="streetNumber">Numer</Label>
                            <Input name="streetNumber" value={formData.streetNumber} onChange={handleChange} required />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="city">Miasto</Label>
                            <Input name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="postalCode">Kod pocztowy</Label>
                            <Input name="postalCode" value={formData.postalCode} onChange={handleChange} required />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <Button type="submit" disabled={loading} className="mt-2">
                            {loading ? 'Zapisywanie...' : 'Zapisz adres'}
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

export default ChangeAddress;