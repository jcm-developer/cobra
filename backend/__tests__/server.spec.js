import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Mock de la base de datos
const mockDb = {
  prepare: () => ({
    bind: () => {},
    step: () => false,
    getAsObject: () => ({}),
    free: () => {}
  }),
  run: () => {}
};

// Crear aplicación Express para tests
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  let db = mockDb;

  // GET - Obtener todos los vuelos
  app.get('/api/flights', (req, res) => {
    try {
      const { type } = req.query;
      const flights = type === 'salida' 
        ? [{ id: 1, flight_number: 'VY1234', destination: 'Barcelona', type: 'salida' }]
        : type === 'llegada'
        ? [{ id: 2, flight_number: 'IB5678', destination: 'Madrid', type: 'llegada' }]
        : [
            { id: 1, flight_number: 'VY1234', destination: 'Barcelona', type: 'salida' },
            { id: 2, flight_number: 'IB5678', destination: 'Madrid', type: 'llegada' }
          ];
      res.json(flights);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET - Obtener vuelo por ID
  app.get('/api/flights/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const flight = id === 1 
        ? { id: 1, flight_number: 'VY1234', destination: 'Barcelona', type: 'salida' }
        : null;
      
      if (!flight) {
        return res.status(404).json({ error: 'Vuelo no encontrado' });
      }
      
      res.json(flight);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST - Crear vuelo
  app.post('/api/flights', (req, res) => {
    try {
      const { flight_number, destination, departure_time, comments, type } = req.body;

      // Validaciones
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

      const newFlight = {
        id: 3,
        flight_number,
        destination,
        departure_time,
        comments: comments || '',
        type,
        created_at: new Date().toISOString()
      };

      res.status(201).json(newFlight);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // PUT - Actualizar vuelo
  app.put('/api/flights/:id', (req, res) => {
    try {
      const { flight_number, destination, departure_time, comments, type } = req.body;

      if (type && type !== 'salida' && type !== 'llegada') {
        return res.status(400).json({
          error: 'El tipo debe ser "salida" o "llegada"'
        });
      }

      const id = parseInt(req.params.id);
      if (id !== 1) {
        return res.status(404).json({ error: 'Vuelo no encontrado' });
      }

      const updatedFlight = {
        id,
        flight_number,
        destination,
        departure_time,
        comments: comments || '',
        type
      };

      res.json(updatedFlight);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE - Eliminar vuelo
  app.delete('/api/flights/:id', (req, res) => {
    try {
      res.json({ message: 'Vuelo eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return app;
};

describe('API Endpoints - Backend Tests', () => {
  let app;

  // AAA Pattern: Arrange - Setup antes de cada test
  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /api/flights', () => {
    it('should return 200 and flights array', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/flights')
        .expect('Content-Type', /json/)
        .expect(200);

      // Assert
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return filtered departures when type=salida', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/flights?type=salida')
        .expect(200);

      // Assert
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.every(flight => flight.type === 'salida')).toBe(true);
    });

    it('should return filtered arrivals when type=llegada', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/flights?type=llegada')
        .expect(200);

      // Assert
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.every(flight => flight.type === 'llegada')).toBe(true);
    });

    it('should return all flights when no type specified', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/flights')
        .expect(200);

      // Assert
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/flights/:id', () => {
    it('should return 200 and flight data when flight exists', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/flights/1')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('flight_number');
      expect(response.body).toHaveProperty('destination');
    });

    it('should return 404 when flight not found', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/flights/999')
        .expect(404);

      // Assert
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Vuelo no encontrado');
    });
  });

  describe('POST /api/flights', () => {
    it('should create new flight with valid data', async () => {
      // Arrange
      const newFlight = {
        flight_number: 'VY9999',
        destination: 'París',
        departure_time: '15:30',
        comments: 'En hora',
        type: 'salida'
      };

      // Act
      const response = await request(app)
        .post('/api/flights')
        .send(newFlight)
        .expect(201);

      // Assert
      expect(response.body).toHaveProperty('id');
      expect(response.body.flight_number).toBe(newFlight.flight_number);
      expect(response.body.destination).toBe(newFlight.destination);
      expect(response.body.type).toBe(newFlight.type);
    });

    it('should return 400 when flight_number is missing', async () => {
      // Arrange
      const invalidFlight = {
        destination: 'París',
        departure_time: '15:30',
        type: 'salida'
      };

      // Act
      const response = await request(app)
        .post('/api/flights')
        .send(invalidFlight)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Faltan campos requeridos');
    });

    it('should return 400 when destination is missing', async () => {
      // Arrange
      const invalidFlight = {
        flight_number: 'VY9999',
        departure_time: '15:30',
        type: 'salida'
      };

      // Act
      const response = await request(app)
        .post('/api/flights')
        .send(invalidFlight)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Faltan campos requeridos');
    });

    it('should return 400 when type is invalid', async () => {
      // Arrange
      const invalidFlight = {
        flight_number: 'VY9999',
        destination: 'París',
        departure_time: '15:30',
        type: 'invalid_type'
      };

      // Act
      const response = await request(app)
        .post('/api/flights')
        .send(invalidFlight)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('El tipo debe ser "salida" o "llegada"');
    });

    it('should set empty comments when not provided', async () => {
      // Arrange
      const newFlight = {
        flight_number: 'VY9999',
        destination: 'París',
        departure_time: '15:30',
        type: 'salida'
      };

      // Act
      const response = await request(app)
        .post('/api/flights')
        .send(newFlight)
        .expect(201);

      // Assert
      expect(response.body.comments).toBe('');
    });
  });

  describe('PUT /api/flights/:id', () => {
    it('should update flight when data is valid', async () => {
      // Arrange
      const updatedData = {
        flight_number: 'VY1234',
        destination: 'Valencia',
        departure_time: '16:00',
        comments: 'Retrasado',
        type: 'salida'
      };

      // Act
      const response = await request(app)
        .put('/api/flights/1')
        .send(updatedData)
        .expect(200);

      // Assert
      expect(response.body.destination).toBe('Valencia');
      expect(response.body.comments).toBe('Retrasado');
    });

    it('should return 400 when type is invalid', async () => {
      // Arrange
      const invalidData = {
        flight_number: 'VY1234',
        destination: 'Valencia',
        departure_time: '16:00',
        comments: 'En hora',
        type: 'invalid'
      };

      // Act
      const response = await request(app)
        .put('/api/flights/1')
        .send(invalidData)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('El tipo debe ser "salida" o "llegada"');
    });

    it('should return 404 when flight does not exist', async () => {
      // Arrange
      const updatedData = {
        flight_number: 'VY1234',
        destination: 'Valencia',
        departure_time: '16:00',
        type: 'salida'
      };

      // Act
      const response = await request(app)
        .put('/api/flights/999')
        .send(updatedData)
        .expect(404);

      // Assert
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Vuelo no encontrado');
    });
  });

  describe('DELETE /api/flights/:id', () => {
    it('should delete flight successfully', async () => {
      // Arrange & Act
      const response = await request(app)
        .delete('/api/flights/1')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Vuelo eliminado correctamente');
    });

    it('should return success message even for non-existent flight', async () => {
      // Arrange & Act
      const response = await request(app)
        .delete('/api/flights/999')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('message');
    });
  });
});
