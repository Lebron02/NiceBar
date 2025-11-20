import React from 'react';
import { Link } from 'react-router-dom';
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

const User = () => {
    const { user } = useAuth();

    if(!user){
        return <div><p className='justify-self-center pt-5'>Nie jesteś zalogowany!</p></div>
    }

    const userDate = user.createdAt 
        ? new Date(user.createdAt).toLocaleDateString() : 'Brak daty';

    const renderAddress = () => {
        if (!user.address) return "Brak danych adresowych";
        return `${user.address.streetName} ${user.address.streetNumber}, ${user.address.postalCode} ${user.address.city}`;
    };

    return (
        <div>
            <h1 className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance py-10">Cześć {user.firstName}!</h1>
            <div className='w-full h-1/2 justify-center flex items-center'>
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className='font-bold text-center text-3xl'>Dane użytkownika:</CardTitle>
                    </CardHeader>
                    <CardContent >
                        <h2 className='font-bold text-center text-2xl m-0'>Dane użytkownika:</h2>
                        <div className='flex mt-5 justify-center'> 
                            
                            <div className='mr-10 text-right space-y-2'> 
                                <p><b>Imię i nazwisko:</b></p>
                                <p><b>Email:</b></p>
                                <p><b>Data założenia:</b></p>
                                <p><b>Rola:</b></p>
                                <p><b>Adres:</b></p>
                            </div>
                            
                            <div className='text-left space-y-2'> 
                                <p>{user.firstName} {user.lastName}</p>
                                <p>{user.email}</p>
                                <p>{userDate}</p>
                                <p>{user.role}</p>
                                <p>{renderAddress()}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 items-center justify-center w-full">
                        <Link to="/change-password" className="flex-1">
                            <Button className="w-full">Zmień hasło</Button>
                        </Link>
                        <Link to="/change-address" className="flex-1">
                            <Button className="w-full">Zmień adres</Button>
                        </Link>
                        <Link to="/user-promote" className="flex-1">
                            <Button className="w-full">Zostań adminem</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>

    );
};

export default User;