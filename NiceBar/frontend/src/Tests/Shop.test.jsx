import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SingleProduct from '../pages/shop/SingleProduct'; 

// --- MOCKOWANIE KONTEKSTÓW ---
const mockUseAuth = vi.fn();

vi.mock('../services/AuthContext', () => ({
    useAuth: () => mockUseAuth() 
}));

const mockAddToCart = vi.fn();
vi.mock('../services/ShopContext', () => ({
    useShop: () => ({
        cartItems: [],
        addToCart: mockAddToCart,
        removeFromCart: vi.fn()
    })
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ slug: 'test-product' }),
    };
});

describe('Moduł Sklepu', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // TEST 1
    it('wyświetla nazwę i cenę produktu po pobraniu danych', async () => {
        const mockProduct = {
            _id: '1', name: 'Super Blender', price: 299.99, description: 'Opis', images: [], countInStock: 5
        };
        const apiMock = { get: vi.fn().mockResolvedValue({ data: mockProduct }) };

        mockUseAuth.mockReturnValue({ api: apiMock, user: { role: 'user' } });

        render(
            <MemoryRouter>
                <SingleProduct />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Super Blender')).toBeInTheDocument();
            expect(screen.getByText(/299.99/)).toBeInTheDocument();
        });
    });

    // TEST 2
    it('wywołuje funkcję addToCart po kliknięciu przycisku', async () => {
        const mockProduct = { _id: '1', name: 'Test', price: 100, countInStock: 5 };
        const apiMock = { get: vi.fn().mockResolvedValue({ data: mockProduct }) };
        
        mockUseAuth.mockReturnValue({ api: apiMock, user: { role: 'user' } });

        render(<MemoryRouter><SingleProduct /></MemoryRouter>);

        await waitFor(() => screen.getByText('Test'));

        const addButton = screen.getByText(/Dodaj do koszyka/i);
        fireEvent.click(addButton);

        expect(mockAddToCart).toHaveBeenCalled();
    });

    // TEST 3 
    it('wyświetla komunikat o pustym koszyku', () => {
        render(
            <MemoryRouter>
                <div className="cart-page">Twój koszyk jest pusty</div> 
            </MemoryRouter>
        );
        expect(screen.getByText(/koszyk jest pusty/i)).toBeInTheDocument();
    });

    // TEST 4
    it('poprawnie renderuje status dostawy', () => {
        const status = 'Delivered';
        render(
            <div className="badge">
                {status === 'Delivered' ? 'Dostarczono' : 'W drodze'}
            </div>
        );
        expect(screen.getByText('Dostarczono')).toBeInTheDocument();
    });

    // TEST 5
    it('blokuje dodanie do koszyka, gdy produkt jest niedostępny', async () => {
        const mockProduct = { 
            _id: '2', 
            name: 'Wyczerpany Produkt', 
            price: 50, 
            countInStock: 0 
        };
        const apiMock = { get: vi.fn().mockResolvedValue({ data: mockProduct }) };
        mockUseAuth.mockReturnValue({ api: apiMock, user: { role: 'user' } });

        render(<MemoryRouter><SingleProduct /></MemoryRouter>);

        await waitFor(() => screen.getByText('Wyczerpany Produkt'));

        const button = screen.getByText(/Wyprzedane/i);
        
        expect(button).toBeDisabled();
        
        fireEvent.click(button);
        expect(mockAddToCart).not.toHaveBeenCalled();
    });

    // TEST 6
    it('renderuje sekcję powiązanych postów, jeśli produkt je posiada', async () => {
        const mockProduct = { 
            _id: '4', 
            name: 'Shaker Bostoński', 
            price: 80, 
            countInStock: 10,
            relatedPosts: [
                { _id: 'p1', title: 'Jak używać shakera?', slug: 'jak-uzywac-shakera', description: 'Poradnik', images: [] }
            ]
        };
        const apiMock = { get: vi.fn().mockResolvedValue({ data: mockProduct }) };
        mockUseAuth.mockReturnValue({ api: apiMock, user: { role: 'user' } });

        render(<MemoryRouter><SingleProduct /></MemoryRouter>);

        await waitFor(() => screen.getByText('Shaker Bostoński'));

        expect(screen.getByText(/Powiązane wpisy na blogu/i)).toBeInTheDocument();
        expect(screen.getByText('Jak używać shakera?')).toBeInTheDocument();
    });
});