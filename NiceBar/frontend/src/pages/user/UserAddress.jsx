import React, { useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const inputClasses = "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500";
const labelClasses = "text-slate-300";

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
                    <Label htmlFor="streetName" className={labelClasses}>Ulica</Label>
                    <Input name="streetName" value={formData.streetName} onChange={handleChange} required className={inputClasses} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="streetNumber" className={labelClasses}>Numer</Label>
                    <Input name="streetNumber" value={formData.streetNumber} onChange={handleChange} required className={inputClasses} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="postalCode" className={labelClasses}>Kod pocztowy</Label>
                    <Input name="postalCode" value={formData.postalCode} onChange={handleChange} required className={inputClasses} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city" className={labelClasses}>Miasto</Label>
                    <Input name="city" value={formData.city} onChange={handleChange} required className={inputClasses} />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white">{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}</Button>
                <Button type="button" variant="outline" onClick={onCancel} className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Anuluj</Button>
            </div>
        </form>
    );
};


const UserAddress = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
             <h2 className="text-2xl font-bold tracking-tight text-white">Dane do zamówień</h2>
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-white">Adres dostawy</CardTitle>
                        {isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">
                                <ChevronLeft className="w-4 h-4 mr-1"/> Wróć
                            </Button>
                        )}
                    </div>
                    <CardDescription className="text-slate-400">Zarządzaj domyślnym adresem dostawy.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {isEditing ? (
                        <ChangeAddressForm 
                            onCancel={() => setIsEditing(false)} 
                            onSuccess={() => setIsEditing(false)} 
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-slate-700 p-6 rounded-lg relative bg-slate-950/50">
                                <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-500 text-xs px-2 py-1 rounded border border-emerald-500/20">Domyślny</div>
                                <h3 className="font-bold text-lg mb-2 text-white">{user.firstName} {user.lastName}</h3>
                                <div className="text-slate-400 space-y-1">
                                    {user.address ? (
                                        <>
                                            <p>{user.address.streetName} {user.address.streetNumber}</p>
                                            <p>{user.address.postalCode} {user.address.city}</p>
                                        </>
                                    ) : <p className="italic text-slate-600">Brak zapisanego adresu</p>}
                                    <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-slate-800">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                {!isEditing && (
                    <CardFooter className="pt-2">
                        <Button onClick={() => setIsEditing(true)} className="bg-white text-slate-950 hover:bg-slate-200 font-medium">Edytuj dane adresowe</Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default UserAddress;