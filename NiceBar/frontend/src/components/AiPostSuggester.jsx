import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2, Check, FileText } from "lucide-react";

const AiPostSuggester = ({ 
    productName, 
    description, 
    availablePosts, 
    selectedPosts, 
    onSelectionChange 
}) => {
    const { api } = useAuth();
    const [aiLoading, setAiLoading] = useState(false);

    const handleAiSuggest = async () => {
        if (!productName && !description) {
            alert("Uzupełnij nazwę i opis produktu, aby AI mogło dopasować posty.");
            return;
        }

        setAiLoading(true);
        try {
            // Zakładamy endpoint, który na podstawie produktu zwraca ID postów
            const { data } = await api.post("/products/suggest-posts", { 
                name: productName, 
                description: description 
            });
            
            // Zakładamy, że backend zwraca tablicę ID: { suggestedPostIds: [...] }
            const suggestedIds = data.suggestedPostIds || [];
            
            // Łączenie obecnych z nowymi (bez duplikatów)
            const newSelection = [...new Set([...selectedPosts, ...suggestedIds])];
            onSelectionChange(newSelection);
            
        } catch (error) {
            console.error("Błąd AI:", error);
            alert("AI nie mogło wygenerować sugestii powiązań.");
        } finally {
            setAiLoading(false);
        }
    };

    const togglePost = (postId) => {
        if (selectedPosts.includes(postId)) {
            onSelectionChange(selectedPosts.filter(id => id !== postId));
        } else {
            onSelectionChange([...selectedPosts, postId]);
        }
    };

    return (
        <div className="border p-4 rounded-md bg-slate-50 space-y-3">
            <div className="flex justify-between items-center">
                <div>
                    <Label className="text-lg">Powiązane Posty (Blog)</Label>
                    <p className="text-sm text-gray-500">Wybierz artykuły powiązane z tym produktem.</p>
                </div>
                
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAiSuggest}
                    disabled={aiLoading}
                    className="border-blue-500 text-blue-700 hover:bg-blue-50"
                >
                    {aiLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    {aiLoading ? "Analizowanie..." : "Dobierz (AI)"}
                </Button>
            </div>

            <div className="h-48 overflow-y-auto border rounded bg-white p-2 grid grid-cols-1 gap-2">
                {availablePosts.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Brak postów na blogu.</p>
                ) : (
                    availablePosts.map(post => {
                        const isSelected = selectedPosts.includes(post._id);
                        
                        return (
                            <div 
                                key={post._id} 
                                onClick={() => togglePost(post._id)}
                                className={`p-2 rounded flex items-center justify-between cursor-pointer border transition-colors ${
                                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="text-gray-400 w-5 h-5" />
                                    <div className="flex flex-col">
                                        <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {post.description ? post.description.substring(0, 60) + "..." : "Brak opisu"}
                                        </p>
                                    </div>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                        );
                    })
                )}
            </div>
            <div className="text-right text-sm text-gray-500">
                Wybrano: {selectedPosts.length}
            </div>
        </div>
    );
};

export default AiPostSuggester;