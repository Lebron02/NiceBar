import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const suggestProductsForPost = async (title, content, availableProducts) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const productsContext = availableProducts.map(p => `- ID: ${p._id}, Name: ${p.name}, Category: ${p.category}`).join("\n");

    const prompt = `
        Jesteś ekspertem barmańskim i asystentem sprzedaży.
        Analizujesz wpis na bloga: "${title}".
        Treść: "${content.substring(0, 1000)}...".
        Lista produktów:
        ${productsContext}
        Zadanie: Wybierz produkty ściśle powiązane z postem.
        Zwróć TYLKO JSON: { "suggestedProductIds": ["ID_1", "ID_2"] }. Bez markdown.
    `;

    return await generateJson(model, prompt, "suggestedProductIds");
};

export const suggestPostsForProduct = async (productName, description, availablePosts) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Przygotowanie listy postów dla AI 
    const postsContext = availablePosts.map(p => `- ID: ${p._id}, Tytuł: "${p.title}", Opis: "${p.description?.substring(0, 100)}..."`).join("\n");

    const prompt = `
        Jesteś asystentem content marketingu.
        Mamy produkt w sklepie:
        Nazwa: "${productName}"
        Opis: "${description}"

        Poniżej lista artykułów z naszego bloga:
        ${postsContext}

        Zadanie:
        Wybierz maksymalnie 3 artykuły, które są tematycznie najbardziej powiązane z tym produktem (np. przepisy z jego użyciem, recenzje, poradniki).

        Wymogi techniczne:
        1. Zwróć TYLKO poprawny obiekt JSON.
        2. Format: { "suggestedPostIds": ["ID_1", "ID_2"] }.
        3. Nie dodawaj żadnych markdownów (\`\`\`json), po prostu czysty tekst JSON.
    `;

    return await generateJson(model, prompt, "suggestedPostIds");
};

async function generateJson(model, prompt, keyName) {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanText);
        return parsed[keyName] || [];
    } catch (error) {
        console.error("Gemini Error:", error);
        return [];
    }
}