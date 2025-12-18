import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login/Login'; 
import Register from '../pages/Register/Register';

const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock('../services/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
        register: mockRegister,
        loading: false
    })
}));

describe('Autentykacja', () => {

    // TEST 1
    it('Login: wywołuje funkcję login z wpisanymi danymi', async () => {
        render(<MemoryRouter><Login /></MemoryRouter>);

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@test.pl' } });
        fireEvent.change(screen.getByLabelText(/Hasło/i), { target: { value: 'password123' } });

        const submitBtn = screen.getByRole('button', { name: /Zaloguj/i });
        fireEvent.click(submitBtn);

        // Sprawdzamy czy funkcja z AuthContext została wywołana z dobrymi danymi
        expect(mockLogin).toHaveBeenCalledWith('user@test.pl', 'password123', expect.anything());
    });

    // TEST 2
    it('Register: wyświetla błąd gdy hasła nie są identyczne', async () => {
        render(<MemoryRouter><Register /></MemoryRouter>);

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@test.pl' } });
        fireEvent.change(screen.getByLabelText(/^Hasło$/i), { target: { value: 'pass123' } }); // ^$ = dokładne dopasowanie
        fireEvent.change(screen.getByLabelText(/Powtórz hasło/i), { target: { value: 'passXYZ' } });

        const submitBtn = screen.getByRole('button', { name: /Zarejestruj/i });
        fireEvent.click(submitBtn);

        expect(screen.getByText(/Hasła nie pasują do siebie/i)).toBeInTheDocument();
    });
});