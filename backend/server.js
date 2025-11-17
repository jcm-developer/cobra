import express from 'express';
import cors from 'cors';
import { initDatabase, saveDatabase } from './database.js';

const app = express();
const PORT = 3000;

let db;

// Init database
initDatabase().then(database => {
    db = database;
    console.log('📊 Base de datos SQLite inicializada');
});

// Middleware
app.use(cors());
app.use(express.json());

// GET - Get all flights
app.get('/api/flights', (req, res) => {
    try {
        const { type } = req.query;
        let query = 'SELECT * FROM flights';
        const params = [];

        if (type) {
            query += ' WHERE type = ? ORDER BY created_at DESC';
            params.push(type);
        } else {
            query += ' ORDER BY created_at DESC';
        }

        const stmt = db.prepare(query);
        stmt.bind(params);

        const flights = [];
        while (stmt.step()) {
            flights.push(stmt.getAsObject());
        }
        stmt.free();

        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Get a flight by ID
app.get('/api/flights/:id', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM flights WHERE id = ?');
        stmt.bind([req.params.id]);

        let flight = null;
        if (stmt.step()) {
            flight = stmt.getAsObject();
        }
        stmt.free();

        if (!flight) {
            return res.status(404).json({ error: 'Vuelo no encontrado' });
        }

        res.json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Create new flight
app.post('/api/flights', (req, res) => {
    try {
        const { flight_number, destination, departure_time, comments, type } = req.body;

        if (!flight_number || !destination || !departure_time || !type) {
            return res.status(400).json({
                error: 'Faltan campos requeridos: flight_number, destination, departure_time, type'
            });
        }

        if (type !== 'salida' && type !== 'llegada') {
            return res.status(400).json({
                error: 'El tipo debe ser "salida" o "llegada"'
            });
        }

        db.run(
            'INSERT INTO flights (flight_number, destination, departure_time, comments, type) VALUES (?, ?, ?, ?, ?)',
            [flight_number, destination, departure_time, comments || '', type]
        );

        saveDatabase();

        const stmt = db.prepare('SELECT * FROM flights ORDER BY id DESC LIMIT 1');
        stmt.step();
        const newFlight = stmt.getAsObject();
        stmt.free();

        res.status(201).json(newFlight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Update flight
app.put('/api/flights/:id', (req, res) => {
    try {
        const { flight_number, destination, departure_time, comments, type } = req.body;

        if (type && type !== 'salida' && type !== 'llegada') {
            return res.status(400).json({
                error: 'El tipo debe ser "salida" o "llegada"'
            });
        }

        db.run(
            'UPDATE flights SET flight_number = ?, destination = ?, departure_time = ?, comments = ?, type = ? WHERE id = ?',
            [flight_number, destination, departure_time, comments || '', type, req.params.id]
        );

        saveDatabase();

        const stmt = db.prepare('SELECT * FROM flights WHERE id = ?');
        stmt.bind([req.params.id]);

        let updatedFlight = null;
        if (stmt.step()) {
            updatedFlight = stmt.getAsObject();
        }
        stmt.free();

        if (!updatedFlight) {
            return res.status(404).json({ error: 'Vuelo no encontrado' });
        }

        res.json(updatedFlight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Delete flight
app.delete('/api/flights/:id', (req, res) => {
    try {
        db.run('DELETE FROM flights WHERE id = ?', [req.params.id]);
        saveDatabase();

        res.json({ message: 'Vuelo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
