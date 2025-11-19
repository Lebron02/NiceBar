import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

import CommentsSection from "./CommentSection";

const SinglePost = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const {api, updatePost} = useAuth();
    const {id} = useParams();

    const goBack = useNavigate()


    const fetchPost = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/posts/${id}`);
            setPost(response.data)
            setTitle(response.data.title)
            setDescription(response.data.description)
        } catch (err) {
            setError("Nie udało się pobrać posta")
            console.error(err);
        } finally {
            setLoading(false);
        };
    }, [id, api]);


    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    
    if (loading) {
        return <div>Ładowanie postów...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            await updatePost(title, description, id);
            await fetchPost();
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Nie udało się zaktualizować posta. Spróbuj ponownie.');
        }
    };

    const deletePost = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.delete(`/posts/${id}`);
            console.log(response);
            goBack("/");
        } catch (err) {
            setError("Nie udało się usunąć posta")
            console.error(err);
        } finally {
            setLoading(false);
        };
    }

    return (
        <div className="w-auto p-6 flex justify-center">
            { !post ? (
                <p>Nie załadowano posta</p>
            ) : (
            <div className=''>
                <Button className='bg-blue-500 mr-1' onClick={setIsEditing}>Edytuj post</Button>
                <Button className='bg-red-400 mb-3' onClick={deletePost}>Usuń post</Button>
                <div className='relative overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg w-[80vw]'>
                    <img alt="" src="https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&amp;fit=crop&amp;q=80&amp;w=1160" className="absolute inset-0 h-full w-full object-cover"/>
                    <div className="relative bg-linear-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
                    <div className="p-4 sm:p-6 bg-white">

                    <time dateTime={post.createdAt} className="block text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </time>
                    <h3 className="lg:text-4xl font-bold mb-6">{post.title}</h3>
                    <p className="mt-2 line-clamp-15 lg:text-2xl sm:text-0.7 text-gray-500">{post.description}</p>
                    </div>
                    <div className="sm:p-6 bg-white">
                        <CommentsSection 
                            postId={post._id}
                            comments={post.comments || []}
                            onCommentAdded={fetchPost}
                        />
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className='w-full mt-5 justify-center flex items-center'>
                    <Card className="w-full max-w">
                    <CardHeader>
                        <CardTitle>Edytuj post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} id='edit-post-form'>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2 w-100">
                            <Label htmlFor="title">Tytuł</Label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            </div>
                            <div className="grid gap-2 h-40">
                            <div className="flex items-center">
                                <Label htmlFor="description">Treść</Label>
                            </div>
                            <Textarea 
                                id="description" 
                                type="text" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required 
                            />
                            </div>
                        </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" form='edit-post-form' className="w-50">
                        Edytuj post
                        </Button>
                    </CardFooter>
                    </Card>
                </div>
            )}
            </div>
            )}
        </div>
    )
}
export default SinglePost;