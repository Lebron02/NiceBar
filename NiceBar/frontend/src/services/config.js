export const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/800x400?text=Brak+zdjęcia";
    if (path.startsWith('http')) return path; 
    
    return `${SERVER_URL}${path}`;
};