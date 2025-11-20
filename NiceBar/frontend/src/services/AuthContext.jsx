import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const API_URL = "http://localhost:5000/api"; 

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [authloading, setAuthLoading] = useState(true); 
    const [user, setUser] = useState(null); 
    const navigate = useNavigate();

    useEffect( () => {
        const verifyAuth = async () =>{
            try {
                const res = await api.get(`/auth/status`);
                setIsLoggedIn(true)
                setUser(res.data.user);
            } catch {
                setIsLoggedIn(false);
            } finally {
                setAuthLoading(false);
            }
        }
        verifyAuth();
    }, []);
        
    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await api.post(`/auth/login`, { email, password });
            setIsLoggedIn(true);
            setUser(res.data.user)
            navigate('/'); 
        } catch (error) {
            console.error("Błąd logowania:", error.response?.data?.message);
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            await api.post(`/auth/register`, userData);
            navigate('/login'); 
        } catch (error) {
            console.error("Błąd rejestracji:", error.response?.data?.message);
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    const addPost = async (title, description) => {
        setLoading(true);
        try {
            await api.post(`/posts/`, {title, description});
            navigate('/'); 
        } catch (error) {
            console.error("Błąd dodawania posta:", error.response?.data?.message);
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    const updatePost = async (title, description, id) => {
        setLoading(true)
            try {
                const response = await api.put(`/posts/${id}`, {title, description});
                console.log(response);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            };
    };

    const changePassword = async (currentPassword, newPassword) => {
        setLoading(true);
        try {
            await api.put('/auth/change-password', { currentPassword, newPassword });
            return { success: true };
        } catch (error) {
            console.error("Błąd zmiany hasła:", error.response?.data?.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateAddress = async (addressData) => {
        setLoading(true);
        try {
            const res = await api.put('/auth/update-address', addressData);
            
            setUser(res.data.user);
            
        } catch (error) {
            console.error("Błąd zmiany adresu:", error.response?.data?.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const promoteToAdmin = async (secretCode) => {
        setLoading(true);
        try {
            const res = await api.put('/auth/promote', { secretCode });
            setUser(res.data.user);
            return { success: true };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await api.post(`/auth/logout`);
        setIsLoggedIn(false);
        setUser(null);
        navigate('/login'); 
    };

    const value = {
        isLoggedIn,
        loading,
        login,
        register,
        addPost,
        updatePost,
        logout,
        changePassword,
        updateAddress,
        promoteToAdmin,
        api, 
        user,
    };

    if(authloading){
        return <div>Ładowanie aplikacji...</div>
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth musi być używany wewnątrz AuthProvider');
    }
    return context;
};