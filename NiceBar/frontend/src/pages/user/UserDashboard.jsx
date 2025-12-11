import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold tracking-tight">Cześć, {user.firstName}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Twoje dane</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-gray-500">Email: {user.email}</p>
                       <p className="text-gray-500">Dołączyłeś: {new Date(user.createdAt).toLocaleDateString()}</p>
                       <Link to="address">
                           <Button variant="link" className="px-0 mt-2">Zarządzaj adresem</Button>
                       </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserDashboard;