# Backend - Sistema de Gestión de Vuelos

Backend API REST para el sistema de gestión de vuelos Cobra.

## 🚀 Instalación

```bash
cd backend
npm install
```

## ▶️ Ejecutar

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints API

### GET `/api/flights`
Obtener todos los vuelos o filtrar por tipo

**Query params:**
- `type` (opcional): `salida` o `llegada`

**Ejemplo:**
```bash
GET http://localhost:3000/api/flights?type=salida
```

### GET `/api/flights/:id`
Obtener un vuelo específico por ID

### POST `/api/flights`
Crear un nuevo registro de vuelo

**Body:**
```json
{
  "flight_number": "VY1234",
  "destination": "Barcelona",
  "departure_time": "14:30",
  "comments": "Embarque en puerta 5",
  "type": "salida"
}
```

### PUT `/api/flights/:id`
Actualizar un vuelo existente

### DELETE `/api/flights/:id`
Eliminar un vuelo

## 🗄️ Base de Datos

SQLite local (`flights.db`) con la siguiente estructura:

```sql
CREATE TABLE flights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flight_number VARCHAR(10) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  departure_time VARCHAR(10) NOT NULL,
  comments TEXT,
  type VARCHAR(10) CHECK(type IN ('salida', 'llegada')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🛠️ Tecnologías

- **Express** - Framework web
- **better-sqlite3** - Base de datos SQLite
- **CORS** - Permitir peticiones desde el frontend
