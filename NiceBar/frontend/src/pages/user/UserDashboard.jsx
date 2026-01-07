import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Calendar, MapPin } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Cześć, {user.firstName}!</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3 border-b border-slate-800">
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" /> Twoje dane
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 space-y-4">
                       <div className="flex items-center gap-3 text-slate-300">
                            <Mail className="w-3 h-3"/><span className="text-slate-500 flex items-center gap-1">Twój adres e-mail: </span> 
                            {user.email}
                       </div>
                       <div className="flex items-center gap-3 text-slate-300">
                            <Calendar className="w-3 h-3"/><span className="text-slate-500 flex items-center gap-1">Data utworzenia konta:</span> 
                            {new Date(user.createdAt).toLocaleDateString()}
                       </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3 border-b border-slate-800">
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-pink-500" /> Adres dostawy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {user.address ? (
                            <div className="text-slate-300 mb-4">
                                <p>{user.address.streetName} {user.address.streetNumber}</p>
                                <p>{user.address.postalCode} {user.address.city}</p>
                            </div>
                        ) : (
                            <p className="text-slate-500 mb-4">Nie ustawiono adresu domyślnego.</p>
                        )}
                        <Link to="address">
                           <Button variant="outline" className="border-slate-700 text-slate-950 hover:bg-slate-800 hover:text-white">Zarządzaj adresem</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserDashboard;