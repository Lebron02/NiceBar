import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { 
    LayoutDashboard, 
    Package, 
    MapPin, 
    Settings, 
    LogOut, 
    User as UserIcon,
    Heart,
    ChevronLeft,
    Loader2, 
    ShoppingBag, 
    Calendar, 
    CreditCard
} from 'lucide-react';

const ChangeAddressForm = ({ onCancel, onSuccess }) => {
    const { user, updateAddress, loading } = useAuth();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        streetName: user?.address?.streetName || '',
        streetNumber: user?.address?.streetNumber || '',
        city: user?.address?.city || '',
        postalCode: user?.address?.postalCode || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await updateAddress(formData);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Wystąpił błąd zapisu.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="streetName">Ulica</Label>
                    <Input name="streetName" value={formData.streetName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="streetNumber">Numer</Label>
                    <Input name="streetNumber" value={formData.streetNumber} onChange={handleChange} required />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="postalCode">Kod pocztowy</Label>
                    <Input name="postalCode" value={formData.postalCode} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">Miasto</Label>
                    <Input name="city" value={formData.city} onChange={handleChange} required />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="w-full">
                    Anuluj
                </Button>
            </div>
        </form>
    );
};

const ChangePasswordForm = ({ onCancel, onSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const { changePassword, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Nowe hasła nie są identyczne!' });
            return;
        }
        if (newPassword.length < 6) {
             setMessage({ type: 'error', text: 'Hasło musi mieć min. 6 znaków.' });
             return;
        }

        try {
            await changePassword(currentPassword, newPassword);
            setMessage({ type: 'success', text: 'Hasło zostało zmienione!' });
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');

            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1500);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Błąd zmiany hasła.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-2">
                <Label htmlFor="current">Obecne hasło</Label>
                <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new">Nowe hasło</Label>
                <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm">Powtórz nowe hasło</Label>
                <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            {message.text && (
                <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                    {message.text}
                </p>
            )}

            <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading}>Zmień hasło</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
            </div>
        </form>
    );
};

const PromoteForm = ({ onCancel, onSuccess }) => {
    const [secretCode, setSecretCode] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const { promoteToAdmin, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        try {
            await promoteToAdmin(secretCode);
            setStatus({ type: 'success', message: 'Gratulacje! Zostałeś administratorem.' });
            setTimeout(() => { if (onSuccess) onSuccess(); }, 1500);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Błąd weryfikacji.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-2">
                <Label htmlFor="code">Tajny kod administratora</Label>
                <Input id="code" type="password" placeholder="••••••••" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} required />
            </div>
            {status.message && (
                <div className={`text-sm p-2 rounded ${status.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {status.message}
                </div>
            )}
            <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading}>Zatwierdź</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
            </div>
        </form>
    );
};

const OrdersView = () => {
    const { api } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders'); 
                setOrders(data);
            } catch (err) {
                console.error("Błąd pobierania zamówień:", err);
                setError("Nie udało się pobrać historii zamówień.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [api]);

    const resolveStatus = (order) => {
        if (!order.isPaid) {
            return {
                label: "Oczekuje na płatność",
                color: "bg-yellow-500 hover:bg-yellow-600 text-white"
            };
        }

        switch (order.deliveryStatus) {
            case 'Pending Packaging':
                return { 
                    label: "W trakcie pakowania", 
                    color: "bg-blue-500 hover:bg-blue-600 text-white" 
                };
            case 'Ready for Shipping':
                return { 
                    label: "Gotowe do wysyłki", 
                    color: "bg-indigo-500 hover:bg-indigo-600 text-white" 
                };
            case 'In Transit':
                return { 
                    label: "W drodze", 
                    color: "bg-orange-500 hover:bg-orange-600 text-white" 
                };
            case 'Delivered':
                return { 
                    label: "Dostarczono", 
                    color: "bg-green-600 hover:bg-green-700 text-white" 
                };
            default:
                return { 
                    label: "W realizacji", 
                    color: "bg-gray-500 hover:bg-gray-600 text-white" 
                };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    if (orders.length === 0) {
        return (
            <Card className="text-center py-10">
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Brak zamówień</h3>
                    <p className="text-gray-500">Nie złożyłeś jeszcze żadnego zamówienia.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Twoje zamówienia</h2>
            
            <div className="space-y-4">
                {orders.map((order) => {
                    const status = resolveStatus(order);

                    return (
                        <Card key={order._id} className="overflow-hidden">
                            <div className="bg-slate-50 p-4 border-b flex flex-wrap gap-4 justify-between items-center text-sm">
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> Data złożenia</p>
                                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 flex items-center gap-1"><CreditCard className="w-3 h-3"/> Suma</p>
                                        <p className="font-medium">{order.totalPrice.toFixed(2)} PLN</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <p className="text-gray-500 hidden sm:block">Nr: {order._id}</p>
                                    <Badge className={`${status.color} border-none`}>
                                        {status.label}
                                    </Badge>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-16 h-16 border rounded bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                {item.image ? (
                                                    <img 
                                                        src={getImageUrl(item.image)} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ShoppingBag className="w-6 h-6 text-gray-300" />
                                                )}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm md:text-base">{item.name}</h4>
                                                <p className="text-sm text-gray-500">Ilość: {item.qty} szt.</p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-medium text-sm">{(item.price * item.qty).toFixed(2)} zł</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            
                            <CardFooter className="bg-slate-50/50 p-3 flex justify-end">
                                 {!order.isPaid && (
                                     <Button size="sm" variant="default" onClick={() => window.location.href=`/payment?orderId=${order._id}`}>
                                         Dokończ płatność
                                     </Button>
                                 )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

const User = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!user) return <div className="text-center pt-10">Nie jesteś zalogowany!</div>;

    const AddressView = () => {
        const [isEditing, setIsEditing] = useState(false);

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Dane do zamówień
                        {isEditing && <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}><ChevronLeft className="w-4 h-4 mr-1"/> Wróć</Button>}
                    </CardTitle>
                    <CardDescription>Zarządzaj adresem dostawy.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <ChangeAddressForm 
                            onCancel={() => setIsEditing(false)} 
                            onSuccess={() => setIsEditing(false)} 
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border p-5 rounded-lg relative bg-slate-50/50">
                                <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Domyślny</div>
                                <h3 className="font-bold text-lg mb-1">{user.firstName} {user.lastName}</h3>
                                <div className="text-gray-600 space-y-1">
                                    {user.address ? (
                                        <>
                                            <p>{user.address.streetName} {user.address.streetNumber}</p>
                                            <p>{user.address.postalCode} {user.address.city}</p>
                                        </>
                                    ) : <p>Brak adresu</p>}
                                    <p className="text-sm text-gray-400 mt-2">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                {!isEditing && (
                    <CardFooter>
                        <Button onClick={() => setIsEditing(true)}>Edytuj dane adresowe</Button>
                    </CardFooter>
                )}
            </Card>
        );
    };

    const SettingsView = () => {
        const [activeForm, setActiveForm] = useState(null); 

        const goBack = () => setActiveForm(null);

        const renderHeader = (title) => (
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="icon" onClick={goBack} className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
        );

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Ustawienia konta</CardTitle>
                    <CardDescription>Bezpieczeństwo i uprawnienia.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    
                    {activeForm === null && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center border-b pb-4">
                                <div>
                                    <p className="font-medium">Hasło</p>
                                    <p className="text-sm text-muted-foreground">Zadbaj o bezpieczeństwo swojego konta</p>
                                </div>
                                <Button variant="secondary" onClick={() => setActiveForm('password')}>Zmień</Button>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                                <div>
                                    <p className="font-medium">Uprawnienia</p>
                                    <p className="text-sm text-muted-foreground">Obecna rola: <Badge variant="outline" className="capitalize ml-1">{user.role}</Badge></p>
                                </div>
                                {user.role !== 'admin' && (
                                    <Button variant="outline" onClick={() => setActiveForm('admin')}>Zostań adminem</Button>
                                )}
                            </div>
                        </div>
                    )}

                    {activeForm === 'password' && (
                        <div>
                            {renderHeader("Zmiana hasła")}
                            <ChangePasswordForm onCancel={goBack} onSuccess={goBack} />
                        </div>
                    )}

                    {activeForm === 'admin' && (
                        <div>
                            {renderHeader("Autoryzacja Administratora")}
                            <PromoteForm onCancel={goBack} onSuccess={goBack} />
                        </div>
                    )}

                </CardContent>
            </Card>
        );
    };
    
    const DashboardView = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Cześć, {user.firstName}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Twoje dane</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-gray-500">Email: {user.email}</p>
                       <p className="text-gray-500">Dołączyłeś: {new Date(user.createdAt).toLocaleDateString()}</p>
                       <Button variant="link" className="px-0 mt-2" onClick={() => setActiveTab('address')}>Zarządzaj adresem</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto py-10 px-4 md:px-8">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-4 space-y-1">
                        <div className="px-4 py-2 mb-4 font-bold text-lg">Moje konto</div>
                        <nav className="flex flex-col gap-1">
                            <Button variant={activeTab === 'dashboard' ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab('dashboard')}>
                                <LayoutDashboard className="mr-2 h-4 w-4" /> Pulpit
                            </Button>
                            <Button variant={activeTab === 'orders' ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab('orders')}>
                                <Package className="mr-2 h-4 w-4" /> Zamówienia
                            </Button>
                            <Button variant={activeTab === 'address' ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab('address')}>
                                <MapPin className="mr-2 h-4 w-4" /> Dane do zamówień
                            </Button>
                            <Button variant={activeTab === 'settings' ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab('settings')}>
                                <Settings className="mr-2 h-4 w-4" /> Ustawienia
                            </Button>
                            
                            {user.role === 'admin' && (
                                <Link to="/admin/dashboard">
                                    <Button variant="ghost" className="justify-start text-blue-600">
                                        <UserIcon className="mr-2 h-4 w-4" /> Panel Admina
                                    </Button>
                                </Link>
                                
                            )}
                            
                            <div className="pt-4 mt-4 border-t">
                                <Button variant="ghost" className="justify-start text-red-600 w-full" onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" /> Wyloguj
                                </Button>
                            </div>
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 min-h-[500px]">
                    {activeTab === 'dashboard' && <DashboardView />}
                    {activeTab === 'address' && <AddressView />}
                    {activeTab === 'settings' && <SettingsView />}
                    {activeTab === 'orders' && <OrdersView />}
                </main>
            </div>
        </div>
    );
};

export default User;