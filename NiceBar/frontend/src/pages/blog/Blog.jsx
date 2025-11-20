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

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();

    const {api} = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get('/posts');
                setPosts(response.data)
            } catch (err) {
                setError("Nie udało się pobrać postów")
                console.error(err);
            } finally {
                setLoading(false);
            };
        }

        fetchPosts();

    }, [api]);

    if (loading) {
        return <div>Ładowanie postów...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h1 className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance py-10">Blog</h1>
            <div className=''>
                {
                    isLoggedIn ? (
                    <div className='pl-7'><Link to='/add-post'><Button>Stwórz nowy post</Button></Link></div>
                    ) : (
                    <p className='justify-self-center'>Zaloguj się by mieć możliwość dodawania postów</p>
                    )
                }
            </div>
        
            <div className="w-screen p-6 flex justify-center">
                {posts.length === 0 ? (
                    <p>Nie ma jeszcze żadnych postów</p>
                ) : (
                    <div className='grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 w-full'>
                        {
                            posts.map((post) => (
                                <Link to={`/posts/${post._id}`} key={post._id}>
                                    <div className='relative overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg h-full flex flex-col'>
                                        <img alt="" src="https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&amp;fit=crop&amp;q=80&amp;w=1160" className="absolute inset-0 h-full w-full object-cover"/>
                                        <div className="relative bg-linear-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64 flex flex-1 flex-col " >
                                            <div className="p-4 sm:p-6 bg-white flex-1 flex flex-col">
                                                <time dateTime={post.createdAt} className="block text-xs text-gray-500">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </time>
                                                <h3 className="mt-0.5 text-lg text-gray-900">{post.title}</h3>
                                                <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">{post.description}</p>
                                                <div className="flex-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                    )
                }
            </div>
        </div>
           
    )
}

export default Blog;