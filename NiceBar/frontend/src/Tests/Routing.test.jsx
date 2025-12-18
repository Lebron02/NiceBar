import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';

const MockHome = () => <h1>Sklep</h1>;

describe('Routing System', () => {

    // TEST 1: Przekierowanie 404 -> Home
    it('przekierowuje na stronę główną po wejściu na nieistniejący adres', async () => {
        render(
            <MemoryRouter initialEntries={['/adres-ktory-nie-istnieje-123']}>
                <Routes>
                    <Route path="/" element={<MockHome />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </MemoryRouter>
        );

        // 2. Sprawdzamy czy widzimy treść strony głównej
        // Jeśli przekierowanie działa, powinniśmy widzieć "Sklep"
        await waitFor(() => {
            expect(screen.getByText(/Sklep/i)).toBeInTheDocument();
        });
    });
});