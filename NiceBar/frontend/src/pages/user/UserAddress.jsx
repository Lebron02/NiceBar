import React, { useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ChangeAddressForm = ({ onCancel, onSuccess }) => {
    const { user, updateAddress, loading } = useAuth();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        streetName: user?.address?.streetName || '',
        streetNumber: user?.address?.streetNumber || '',
        city: user?.address?.city || '',
        postalCode: user?.address?.postalCode || ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await updateAddress(formData);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Wystąpił błąd zapisu.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="streetName">Ulica</Label>
                    <Input name="streetName" value={formData.streetName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="streetNumber">Numer</Label>
                    <Input name="streetNumber" value={formData.streetNumber} onChange={handleChange} required />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="postalCode">Kod pocztowy</Label>
                    <Input name="postalCode" value={formData.postalCode} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">Miasto</Label>
                    <Input name="city" value={formData.city} onChange={handleChange} required />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading} className="w-full">{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}</Button>
                <Button type="button" variant="outline" onClick={onCancel} className="w-full">Anuluj</Button>
            </div>
        </form>
    );
};


const UserAddress = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
             <h2 className="text-2xl font-bold tracking-tight">Dane do zamówień</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Adres dostawy
                        {isEditing && <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}><ChevronLeft className="w-4 h-4 mr-1"/> Wróć</Button>}
                    </CardTitle>
                    <CardDescription>Zarządzaj domyślnym adresem dostawy.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <ChangeAddressForm 
                            onCancel={() => setIsEditing(false)} 
                            onSuccess={() => setIsEditing(false)} 
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border p-5 rounded-lg relative bg-slate-50/50">
                                <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Domyślny</div>
                                <h3 className="font-bold text-lg mb-1">{user.firstName} {user.lastName}</h3>
                                <div className="text-gray-600 space-y-1">
                                    {user.address ? (
                                        <>
                                            <p>{user.address.streetName} {user.address.streetNumber}</p>
                                            <p>{user.address.postalCode} {user.address.city}</p>
                                        </>
                                    ) : <p>Brak adresu</p>}
                                    <p className="text-sm text-gray-400 mt-2">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                {!isEditing && (
                    <CardFooter>
                        <Button onClick={() => setIsEditing(true)}>Edytuj dane adresowe</Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default UserAddress;