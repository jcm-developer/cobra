# Cobra - Sistema de Gestión de Vuelos ✈️

Sistema completo de información de vuelos en tiempo real con frontend Vue 3 y backend Node.js. Permite visualizar, crear, editar y eliminar registros de salidas y llegadas de vuelos con una interfaz moderna y responsiva.

## 📋 Características

### Frontend
- 🕒 Reloj en tiempo real con actualización automática
- ✈️ Visualización de salidas y llegadas de vuelos
- ➕ Crear nuevos registros de vuelos con modal interactivo
- ✏️ Editar vuelos existentes al hacer hover
- 🗑️ Eliminar vuelos con confirmación
- 🌍 Autocompletado de ciudades con 57 destinos principales
- 📊 Estados de vuelo: En hora, Retrasado, Cancelado, Con demora
- 📱 Diseño responsive (móvil y escritorio)
- 🎨 Interfaz moderna con tema oscuro y fuente Poppins
- ⚡ Desarrollado con Vite para rendimiento óptimo
- 🔧 TypeScript para type-safety

### Backend
- 🔌 API REST completa con Express
- � Base de datos SQLite local (sql.js)
- 🌐 CORS habilitado para comunicación frontend-backend
- 📡 Endpoints GET, POST, PUT, DELETE
- 🔍 Filtrado por tipo de vuelo (salida/llegada)

## �🛠️ Tecnologías

### Frontend
- **Vue 3** - Framework JavaScript progresivo con Composition API
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Build tool y dev server ultrarrápido
- **Vue Router** - Enrutamiento SPA
- **Pinia** - State management oficial de Vue
- **Vitest** - Framework de testing unitario

### Backend
- **Node.js** - Entorno de ejecución JavaScript
- **Express** - Framework web minimalista
- **sql.js** - Base de datos SQLite en JavaScript puro
- **CORS** - Middleware para habilitar cross-origin requests

## 📦 Instalación

### Frontend
```sh
npm install
```

### Backend
```sh
cd backend
npm install
```

## 🚀 Desarrollo

### 1. Iniciar el Backend
```sh
cd backend
npm start
```
El backend correrá en `http://localhost:3000`

### 2. Iniciar el Frontend
En otra terminal:
```sh
npm run dev
```
El frontend estará disponible en `http://localhost:5173`

## 🏗️ Compilación

Type-check, compilación y minificación para producción:

```sh
npm run build
```

## 👀 Vista Previa

Vista previa de la build de producción:

```sh
npm run preview
```

## 🧪 Testing

Ejecutar tests unitarios con Vitest:

```sh
npm run test:unit
```

## 📁 Estructura del Proyecto

```
cobra/
├── backend/
│   ├── server.js       # Servidor Express con API REST
│   ├── database.js     # Configuración de SQLite
│   ├── package.json    # Dependencias del backend
│   └── flights.db      # Base de datos (se crea automáticamente)
├── src/
│   ├── assets/         # Recursos estáticos (imágenes, logos)
│   ├── router/         # Configuración de rutas
│   │   └── index.ts    # Rutas de la aplicación
│   ├── stores/         # Stores de Pinia
│   │   └── counter.ts  # Store de ejemplo
│   ├── views/          # Componentes de vistas
│   │   └── Home.vue    # Vista principal con gestión de vuelos
│   ├── __tests__/      # Tests unitarios
│   │   └── App.spec.ts
│   ├── App.vue         # Componente raíz con estilos globales
│   └── main.ts         # Punto de entrada de la aplicación
├── public/             # Archivos públicos estáticos
├── index.html          # HTML principal
└── README.md           # Este archivo
```

## 🔌 API Endpoints

### GET `/api/flights`
Obtener todos los vuelos o filtrar por tipo
- Query params: `type=salida` o `type=llegada`
- Ejemplo: `GET http://localhost:3000/api/flights?type=salida`

### GET `/api/flights/:id`
Obtener un vuelo específico por ID

### POST `/api/flights`
Crear un nuevo vuelo
```json
{
  "flight_number": "VY1234",
  "destination": "Barcelona",
  "departure_time": "14:30",
  "comments": "En hora",
  "type": "salida"
}
```

### PUT `/api/flights/:id`
Actualizar un vuelo existente

### DELETE `/api/flights/:id`
Eliminar un vuelo

## 🎨 Configuración Recomendada del IDE

- [VS Code](https://code.visualstudio.com/)
- [Vue Official Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 🌐 Extensiones de Navegador

### Chromium (Chrome, Edge, Brave):
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

### Firefox:
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## ⚙️ Requisitos del Sistema

- Node.js: `^20.19.0` o `>=22.12.0`
- npm o equivalente
- Navegador moderno con soporte ES6+

## 📝 Scripts Disponibles

### Frontend
| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot-reload |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa de build de producción |
| `npm run test:unit` | Ejecuta tests unitarios |
| `npm run type-check` | Verificación de tipos TypeScript |

### Backend
| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia el servidor backend en puerto 3000 |
| `npm run dev` | Inicia con modo watch (reinicio automático) |

## 🎯 Funcionalidades Principales

### Gestión de Vuelos
- **Crear**: Modal con formulario completo, autocompletado de ciudades
- **Visualizar**: Dos columnas separadas para salidas y llegadas
- **Editar**: Hover sobre un vuelo muestra botones de acción
- **Eliminar**: Confirmación antes de borrar con diálogo nativo

### Autocompletado de Destinos
57 ciudades principales del mundo con búsqueda en tiempo real:
- España: Madrid, Barcelona, Valencia, Sevilla...
- Europa: Londres, París, Roma, Berlín, Ámsterdam...
- América: Nueva York, Los Ángeles, Miami, Toronto...
- Asia: Tokio, Singapur, Hong Kong, Dubái...
- Oceanía: Sídney, Melbourne, Auckland...

### Estados de Vuelo
- ✅ En hora
- ⏰ Retrasado
- ❌ Cancelado
- 🕐 Con demora

## 🎨 Diseño

- **Tema oscuro** (#37353E, #44444E, #55555E)
- **Fuente**: Poppins (Google Fonts) con todos los pesos
- **Colores de acción**:
  - Verde (#5cb85c) para editar
  - Rojo (#d9534f) para eliminar
  - Gris (#55555E) para neutral
- **Animaciones suaves** con transiciones CSS

## 📄 Licencia

Proyecto privado

## 🔗 Referencias

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vite.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Express Documentation](https://expressjs.com/)
- [sql.js Documentation](https://sql.js.org/)

