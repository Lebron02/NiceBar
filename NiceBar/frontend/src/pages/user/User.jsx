import React, { useState } from 'react';
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
    console.log(user)

    if(!user){
        return <div><p>Nie jesteś zalogowany!</p></div>
    }

    return (
        <div>
            <h1 className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance py-10">Cześć {user.firstName}!</h1>
            <div className='w-full h-1/2 justify-center flex items-center'>
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className='font-bold text-center text-3xl'>Dane użytkownika:</CardTitle>
                    </CardHeader>
                    <CardContent >
                        <div className='flex mt-5'>
                            <div className='mr-10'> 
                                <p><b>Imię i nazwisko:</b></p>
                                <p><b>Email:</b></p>
                                <p><b>Data założenia:</b></p>
                                <p><b>Rola:</b></p>
                            </div>
                            <div> 
                                <p>{user.firstName} {user.lastName}</p>
                                <p>{user.email}</p>
                                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                                <p>{user.role}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button className="w-full">Zmień hasło</Button>
                        <Button className="w-full">Zmień adres</Button>
                        <Button className="w-full">Zostań adminem</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>

    );
};

export default User;