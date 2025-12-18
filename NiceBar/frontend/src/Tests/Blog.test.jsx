import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SinglePost from '../pages/blog/SinglePost'; 
import * as AuthContextModule from '../services/AuthContext';

vi.mock('../services/AuthContext', () => ({
    useAuth: vi.fn(), 
    __esModule: true,
}));

const mockAddToCart = vi.fn();
vi.mock('../services/ShopContext', () => ({
    useShop: () => ({ addToCart: mockAddToCart })
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useParams: () => ({ slug: 'test-post' }) };
});

describe('Moduł Bloga', () => {
    const mockPostData = {
        _id: '1',
        title: 'Jak zrobić Mojito?',
        description: 'Przepis na drinka...',
        createdAt: new Date().toISOString(),
        products: [], 
        comments: []
    };

    // TEST 1
    it('wyświetla tytuł i treść posta', async () => {
        const apiMock = { get: vi.fn().mockResolvedValue({ data: mockPostData }) };
        vi.mocked(AuthContextModule.useAuth).mockReturnValue({ api: apiMock, user: null });

        render(<MemoryRouter><SinglePost /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('Jak zrobić Mojito?')).toBeInTheDocument();
            expect(screen.getByText('Przepis na drinka...')).toBeInTheDocument();
        });
    });

    // TEST 2
    it('nie wyświetla sekcji produktów, gdy lista jest pusta', async () => {
        const apiMock = { get: vi.fn().mockResolvedValue({ data: mockPostData }) }; 
        vi.mocked(AuthContextModule.useAuth).mockReturnValue({ api: apiMock, user: null });

        render(<MemoryRouter><SinglePost /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.queryByText(/Produkty z tego wpisu/i)).not.toBeInTheDocument();
        });
    });

    // TEST 3
    it('renderuje sekcję komentarzy', async () => {
        const apiMock = { get: vi.fn().mockResolvedValue({ data: mockPostData }) };
        vi.mocked(AuthContextModule.useAuth).mockReturnValue({ api: apiMock, user: null });

        render(<MemoryRouter><SinglePost /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Komentarze/i })).toBeInTheDocument();
        });
    });

    // TEST 4
    it('pozwala zalogowanemu użytkownikowi dodać komentarz', async () => {
        const mockPostData = {
            _id: '1',
            title: 'Test Post',
            description: 'Opis',
            comments: [] 
        };
        
        const postApiMock = vi.fn().mockResolvedValue({ data: {} });
        const apiMock = { 
            get: vi.fn().mockResolvedValue({ data: mockPostData }),
            post: postApiMock 
        };
        
        vi.mocked(AuthContextModule.useAuth).mockReturnValue({ 
            api: apiMock, 
            user: { firstName: 'Jan', role: 'user' }, 
            isLoggedIn: true 
        });

        render(<MemoryRouter><SinglePost /></MemoryRouter>);

        await waitFor(() => screen.getByText('Test Post'));

        const textarea = screen.getByPlaceholderText(/Podziel się swoją opinią/i);
        
        fireEvent.change(textarea, { target: { value: 'Świetny wpis!' } });
        
        const submitButton = screen.getByText(/Opublikuj komentarz/i);
        fireEvent.click(submitButton);

        // 4. Sprawdź czy API zostało wywołane
        await waitFor(() => {
            expect(postApiMock).toHaveBeenCalledWith(
                expect.stringContaining('/posts/1/comments'), 
                { text: 'Świetny wpis!' }
            );
        });
    });

    // TEST 5
    it('wyświetla produkty powiązane z postem i umożliwia dodanie do koszyka', async () => {
        const mockPostWithProducts = {
            _id: '2',
            title: 'Drink z rumem',
            description: 'Przepis...',
            products: [
                { _id: 'prod1', name: 'Rum Premium', price: 120, slug: 'rum-premium', images: [] }
            ],
            comments: []
        };

        const apiMock = { get: vi.fn().mockResolvedValue({ data: mockPostWithProducts }) };
        
        vi.mocked(AuthContextModule.useAuth).mockReturnValue({ api: apiMock, user: null });

        render(<MemoryRouter><SinglePost /></MemoryRouter>);

        await waitFor(() => screen.getByText('Rum Premium'));

        expect(screen.getByText(/120/)).toBeInTheDocument();

        const addButtons = screen.getAllByText(/Dodaj/i); 
        const productAddButton = addButtons.find(btn => btn.closest('.bg-slate-950'));
        
        fireEvent.click(productAddButton || addButtons[0]);

        expect(mockAddToCart).toHaveBeenCalled();
    });
});