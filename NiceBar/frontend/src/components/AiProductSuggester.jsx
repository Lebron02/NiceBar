import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext'; 
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2, Check } from "lucide-react";

const AiProductSuggester = ({ 
    title, 
    description, 
    availableProducts, 
    selectedProducts, 
    onSelectionChange 
}) => {
    const { api } = useAuth();
    const [aiLoading, setAiLoading] = useState(false);

    const handleAiSuggest = async () => {
        if (!title || !description) {
            alert("Uzupełnij tytuł i treść posta, aby AI mogło przeanalizować kontekst.");
            return;
        }

        setAiLoading(true);
        try {
            const { data } = await api.post("/posts/suggest-products", { 
                title, 
                content: description 
            });
            
            const suggestedIds = data.suggestedProductIds || [];
            const newSelection = [...new Set([...selectedProducts, ...suggestedIds])];
            onSelectionChange(newSelection);
            
        } catch (error) {
            console.error("Błąd AI:", error);
            alert("AI nie mogło wygenerować sugestii.");
        } finally {
            setAiLoading(false);
        }
    };

    const toggleProduct = (productId) => {
        if (selectedProducts.includes(productId)) {
            onSelectionChange(selectedProducts.filter(id => id !== productId));
        } else {
            onSelectionChange([...selectedProducts, productId]);
        }
    };

    return (
        <div className="border p-4 rounded-md bg-slate-50 space-y-3">
            <div className="flex justify-between items-center">
                <div>
                    <Label className="text-lg">Powiązane produkty</Label>
                    <p className="text-sm text-gray-500">Wybierz produkty wspomniane w poście.</p>
                </div>
                
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAiSuggest}
                    disabled={aiLoading || !description}
                    className="border-purple-500 text-purple-700 hover:bg-purple-50"
                >
                    {aiLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    {aiLoading ? "Analizowanie..." : "Zasugeruj (AI)"}
                </Button>
            </div>

            <div className="h-48 overflow-y-auto border rounded bg-white p-2 grid grid-cols-1 gap-2">
                {availableProducts.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Brak produktów w magazynie.</p>
                ) : (
                    availableProducts.map(product => {
                        const isSelected = selectedProducts.includes(product._id);
                        
                        const categoryName = typeof product.category === 'object' && product.category !== null 
                            ? product.category.name 
                            : product.category;

                        return (
                            <div 
                                key={product._id} 
                                onClick={() => toggleProduct(product._id)}
                                className={`p-2 rounded flex items-center justify-between cursor-pointer border transition-colors ${
                                    isSelected ? 'border-green-500 bg-green-50' : 'border-transparent hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <p className="font-medium text-sm">{product.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {categoryName || 'Brak kategorii'} | {product.brand}
                                        </p>
                                    </div>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-green-600" />}
                            </div>
                        );
                    })
                )}
            </div>
            <div className="text-right text-sm text-gray-500">
                Wybrano: {selectedProducts.length}
            </div>
        </div>
    );
};

export default AiProductSuggester;