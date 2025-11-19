import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


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
        <div className="mt-10 border-t pt-6">
            <h2 className="text-2xl font-bold mb-6">Komentarze ({comments.length})</h2>
            <div className="space-y-6 mb-10">
                {comments.length === 0 ? (
                    <p className="text-gray-500">Brak komentarzy. Bądź pierwszy!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                                {comment.author?.firstName?.[0]}
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold">
                                        {comment.author?.firstName} {comment.author?.lastName}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm">{comment.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isLoggedIn ? (
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Dodaj komentarz</h3>
                    <form onSubmit={handleAddComment}>
                        <Textarea
                            placeholder="Napisz coś miłego..."
                            className="mb-4"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? "Wysyłanie..." : "Opublikuj komentarz"}
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="bg-gray-100 p-6 rounded-lg text-center">
                    <p className="mb-4 text-gray-600">Musisz być zalogowany, aby komentować.</p>
                    <Link to="/login">
                        <Button variant="outline">Zaloguj się</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CommentsSection;