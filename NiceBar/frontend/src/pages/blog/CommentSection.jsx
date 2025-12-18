import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from 'lucide-react';

const CommentsSection = ({ postId, comments, onCommentAdded }) => {
    const { isLoggedIn, api, user } = useAuth();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            await api.post(`/posts/${postId}/comments`, { text });
            setText("");
            if (onCommentAdded) onCommentAdded();
        } catch (error) {
            console.error("Błąd dodawania komentarza", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                <MessageSquare className="text-pink-500" /> Komentarze ({comments.length})
            </h2>
            
            <div className="space-y-6 mb-12">
                {comments.length === 0 ? (
                    <p className="text-slate-500 italic">Brak komentarzy. Bądź pierwszy!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
                                {comment.author?.firstName?.[0]}
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-semibold text-white">
                                        {comment.author?.firstName} {comment.author?.lastName}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">{comment.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isLoggedIn ? (
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-semibold mb-4 text-white">Dodaj komentarz</h3>
                    <form onSubmit={handleAddComment}>
                        <Textarea
                            placeholder="Podziel się swoją opinią..."
                            className="mb-4 bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px] focus-visible:ring-blue-500"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button type="submit" disabled={loading} className="bg-white text-slate-950 hover:bg-slate-200 font-medium">
                            {loading ? "Wysyłanie..." : "Opublikuj komentarz"}
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 text-center">
                    <p className="mb-4 text-slate-400">Musisz być zalogowany, aby dodawać komentarze.</p>
                    <Link to="/login">
                        <Button variant="outline" className="border-slate-700 text-slate-950 hover:bg-slate-800">Zaloguj się</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CommentsSection;