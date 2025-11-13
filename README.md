# Cobra - Sistema de Gestión de Vuelos ✈️

Sistema de información de vuelos en tiempo real desarrollado con Vue 3, TypeScript y Vite. Permite visualizar salidas y llegadas de vuelos con una interfaz moderna y responsiva.

## 📋 Características

- 🕒 Reloj en tiempo real con actualización automática
- ✈️ Visualización de salidas y llegadas de vuelos
- 📱 Diseño responsive (móvil y escritorio)
- 🎨 Interfaz moderna con tema oscuro
- ⚡ Desarrollado con Vite para rendimiento óptimo
- 🔧 TypeScript para type-safety

## 🛠️ Tecnologías

- **Vue 3** - Framework JavaScript progresivo
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Build tool y dev server rápido
- **Vue Router** - Enrutamiento SPA
- **Pinia** - State management
- **Vitest** - Framework de testing

## 📦 Instalación

```sh
npm install
```

## 🚀 Desarrollo

Ejecutar el servidor de desarrollo con hot-reload:

```sh
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

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
├── src/
│   ├── assets/         # Recursos estáticos (imágenes, logos)
│   ├── router/         # Configuración de rutas
│   ├── stores/         # Stores de Pinia
│   ├── views/          # Componentes de vistas
│   │   └── Home.vue    # Vista principal con salidas/llegadas
│   ├── __tests__/      # Tests unitarios
│   ├── App.vue         # Componente raíz
│   └── main.ts         # Punto de entrada
├── public/             # Archivos públicos
└── index.html          # HTML principal
```

## 🎨 Configuración Recomendada del IDE

- [VS Code](https://code.visualstudio.com/)
- [Vue Official Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 🌐 Configuración del Navegador

### Chromium (Chrome, Edge, Brave):
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

### Firefox:
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## ⚙️ Requisitos del Sistema

- Node.js: `^20.19.0` o `>=22.12.0`
- npm o equivalente

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa de build |
| `npm run test:unit` | Ejecuta tests unitarios |
| `npm run type-check` | Verificación de tipos TypeScript |

## 📄 Licencia

Proyecto privado

## 🔗 Referencias

- [Documentación de Vite](https://vite.dev/config/)
- [Documentación de Vue 3](https://vuejs.org/)
- [Documentación de TypeScript](https://www.typescriptlang.org/)

