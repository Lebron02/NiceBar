import React, { useState, useEffect } from 'react';
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
import { Textarea } from "@/components/ui/textarea"

const AddPost = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    

    const { addPost } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            await addPost(title, description);
        } catch (err) {
            setError(err.response?.data?.message || 'Nie udało się zalogować. Spróbuj ponownie.');
        }
    };

    return (
        <div className='w-full h-screen justify-center flex items-center'>
            <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Stwórz post</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} id='add-post-form'>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                    <Label htmlFor="title">Tytuł</Label>
                    <Input
                        id="title"
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="description">Treść</Label>
                    </div>
                    <Textarea 
                        id="description" 
                        type="text" 
                        placeholder="Wpisz swój opis tutaj" 
                        onChange={(e) => setDescription(e.target.value)}
                        required 
                    />
                    </div>
                </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" form='add-post-form' className="w-full">
                Dodaj post
                </Button>
            </CardFooter>
            </Card>
        </div>
        
    )
}

export default AddPost;