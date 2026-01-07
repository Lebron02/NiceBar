import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config';
import { FileText, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button"

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn, api } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
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

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Ładowanie postów...</div>;
    if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 pb-20">
            {/* Hero Header */}
            <div className="bg-slate-900/50 border-b border-slate-800 py-10 mb-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
                        Blog Barmański
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
                        Odkryj tajniki miksologii, unikalne przepisy i inspiracje ze świata koktajli.
                    </p>
                    
                    {isLoggedIn && (
                        <Link to='/blog/add-post'>
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                                <PlusCircle className="mr-2 h-4 w-4" /> Stwórz nowy wpis
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        
            <div className="container mx-auto px-6">
                {posts.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Nie ma jeszcze żadnych postów</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {posts.map((post) => (
                            <Link to={`/blog/${post.slug}`} key={post._id} className="group block h-full">
                                <div className='bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-900/10 hover:border-slate-700 transition-all duration-300 h-full flex flex-col'>
                                    <div className="relative w-full aspect-video overflow-hidden bg-slate-950">
                                        {post.images && post.images.length > 0 ? (
                                            <img 
                                                alt={post.title} 
                                                src={getImageUrl(post.images[0])} 
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                                                <FileText size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex justify-between items-center mb-3">
                                            <time dateTime={post.createdAt} className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </time>
                                            {post.category && (
                                                <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                                                    {post.category}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                                            {post.description}
                                        </p>
                                        
                                        <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                                            <span className="text-sm font-medium text-blue-500 group-hover:text-blue-400 flex items-center gap-1 transition-colors">
                                                Czytaj dalej &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Blog;