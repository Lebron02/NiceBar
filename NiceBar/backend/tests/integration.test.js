import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await User.deleteMany({ email: /test/i }); 
    await Product.deleteMany({ name: /Testowy/i });
    await mongoose.connection.close();
});

describe('API Integration Tests', () => {
    
    let adminCookie; 
    let userCookie;
    let productId;

    const testUser = {
        firstName: 'Jan',
        lastName: 'Testowy',
        email: 'user_test_unique_v3@example.com', 
        password: 'password123',
        address: { streetName: 'Ulica', streetNumber: '1', city: 'Miasto', postalCode: '00-000' }
    };

    const testAdmin = {
        firstName: 'Admin',
        lastName: 'Testowy',
        email: 'admin_test_unique_v3@example.com',
        password: 'password123',
        isAdmin: true 
    };

    // ---------------------------------------------------------
    // TESTY AUTORYZACJI
    // ---------------------------------------------------------

    // TEST 1: Rejestracja
    it('POST /api/auth/register - powinien zarejestrować nowego użytkownika', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        
        expect([200, 201]).toContain(res.statusCode);
    });

    // TEST 2: Logowanie Admina
    it('POST /api/auth/login - Admin loguje się i otrzymuje ciasteczko', async () => {
        await request(app).post('/api/auth/register').send(testAdmin);
        await User.updateOne({ email: testAdmin.email }, { isAdmin: true, role: 'admin' });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testAdmin.email,
                password: testAdmin.password
            });

        expect(res.statusCode).toBe(200);
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        adminCookie = cookies; 
    });

    // Test 3: Logowanie Użytkownika
    it('POST /api/auth/login - User loguje się i otrzymuje ciasteczko', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toBe(200);
        userCookie = res.headers['set-cookie'];
    });

    // TEST 4: Logowanie błędne
    it('POST /api/auth/login - powinien odrzucić błędne hasło', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email, 
                password: 'wrongpassword'
            });
        expect([400, 401]).toContain(res.statusCode);
    });

    // ---------------------------------------------------------
    // TESTY PRODUKTÓW 
    // ---------------------------------------------------------

    // TEST 5
    it('GET /api/products - powinien zwrócić listę produktów', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    // TEST 6
    it('GET /api/products/categories - powinien zwrócić kategorie', async () => {
        const res = await request(app).get('/api/products/categories');
        expect(res.statusCode).toBe(200);
    });

    // TEST 7
    it('POST /api/products - Admin powinien móc utworzyć produkt', async () => {
        const newProduct = {
            name: 'Testowy Produkt',
            price: 100,
            brand: 'TestBrand',
            category: 'TestCategory',
            countInStock: 10,
            description: 'Opis testowy'
        };

        const res = await request(app)
            .post('/api/products')
            .set('Cookie', adminCookie)
            .send(newProduct);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        productId = res.body._id;
    });

    // TEST 8
    it('POST /api/products - Gość nie powinien móc utworzyć produktu', async () => {
        const res = await request(app).post('/api/products').send({ name: 'Haker' });
        expect(res.statusCode).toBe(401); 
    });

    // TEST 9
    it('GET /api/products/:id - powinien pobrać szczegóły produktu', async () => {
        if (!productId) return; 
        const res = await request(app).get(`/api/products/${productId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Testowy Produkt');
    });

    // TEST 10 
    it('PUT /api/products/:id - Admin powinien zaktualizować produkt', async () => {
        if (!productId) return;
        const res = await request(app)
            .put(`/api/products/${productId}`)
            .set('Cookie', adminCookie)
            .send({ price: 200, name: 'Zaktualizowany Produkt' });
        expect(res.statusCode).toBe(200);
        expect(res.body.price).toBe(200);
    });

    // TEST 11
    it('POST /api/products - Admin nie powinien móc utworzyć produktu z ujemną ceną', async () => {
        const invalidProduct = {
            name: 'Błędny Produkt',
            price: -50, // Cena nie może być ujemna
            brand: 'Test',
            category: 'Test',
            countInStock: 5,
            description: 'Opis'
        };

        const res = await request(app)
            .post('/api/products')
            .set('Cookie', adminCookie)
            .send(invalidProduct);

        // Oczekujemy błędu walidacji 400 (Bad Request)
        expect([400, 500]).toContain(res.statusCode); 
    });

    // TEST 12
    it('DELETE /api/products/:id - Zwykły użytkownik NIE może usunąć produktu', async () => {
        if (!productId) return;
        const res = await request(app)
            .delete(`/api/products/${productId}`)
            .set('Cookie', userCookie); // Używamy ciasteczka usera

        // Oczekujemy 401 (Unauthorized) lub 403 (Forbidden)
        expect([401, 403]).toContain(res.statusCode);
    });

    
    // ---------------------------------------------------------
    // CZYSZCZENIE
    // ---------------------------------------------------------

    // TEST 13
    it('DELETE /api/products/:id - Admin powinien usunąć produkt', async () => {
        if (!productId) return;
        const res = await request(app)
            .delete(`/api/products/${productId}`)
            .set('Cookie', adminCookie);
        expect(res.statusCode).toBe(200);
        
        // Sprawdzenie poprawności usunięcia 
        const check = await Product.findById(productId);
        expect(check).toBeNull();
    });
});