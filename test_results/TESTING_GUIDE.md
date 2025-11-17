# 🧪 Guía Universal de Testing - Frontend y Backend

Esta guía proporciona una metodología completa y agnóstica del framework para generar tests unitarios de alta calidad en cualquier entorno de desarrollo.

Se recomienda usar el modelo Claude Sonnet 4.5 (En mi experiencia es el mejor a nivel estructura y codificación).

---

## 🎯 Principios Fundamentales (Aplican a Todos los Frameworks)

### 1. **AAA Pattern (Arrange-Act-Assert)**
```
Arrange: Preparar el entorno y datos de prueba
Act: Ejecutar la acción a probar
Assert: Verificar que el resultado es el esperado
```

### 2. **FIRST Principles**
- **F**ast: Los tests deben ser rápidos
- **I**ndependent: Tests independientes entre sí
- **R**epeatable: Resultados consistentes en cualquier entorno
- **S**elf-validating: Pass/Fail sin intervención manual
- **T**imely: Escribir tests junto con el código

### 3. **Given-When-Then (BDD Style)**
```
Given: Estado inicial
When: Acción que se ejecuta
Then: Resultado esperado
```

---

## 📋 Estructura Universal del Test

### Patrón Básico (Agnóstico)

```javascript
// Aplicable a Jest, Vitest, Mocha, Jasmine, xUnit, pytest, etc.
describe('NombreDelComponenteOClase', () => {
  // Setup común - ejecuta antes de cada test
  beforeEach(() => {
    // Inicialización antes de cada test
    // Limpiar mocks, resetear estado, crear instancias, etc.
  })

  // Cleanup (opcional) - ejecuta después de cada test
  afterEach(() => {
    // Limpieza después de cada test
  })

  it('descripción clara de lo que se prueba', () => {
    // Arrange: Preparar datos y entorno
    const input = 'valor de prueba'
    
    // Act: Ejecutar la función/acción a probar
    const result = funcionAProbar(input)
    
    // Assert: Verificar que el resultado es el esperado
    expect(result).toBe(expectedValue)
  })
})
```

---

## 🎨 FRONTEND TESTING

### React (Jest + React Testing Library)

#### Imports Típicos
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ComponentName from './ComponentName'
```

#### Estructura Básica
```javascript
describe('ComponentName', () => {
  it('renders the main container', () => {
    render(<ComponentName />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('handles button click', async () => {
    render(<ComponentName />)
    const button = screen.getByRole('button', { name: /submit/i })
    
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument()
    })
  })

  it('fetches and displays data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: 'test' })
      })
    )

    render(<ComponentName />)
    
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument()
    })
  })
})
```

### Angular (Jasmine + Karma / Jest)

#### Imports Típicos
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentName } from './component-name.component'
```

#### Estructura Básica
```typescript
describe('ComponentName', () => {
  let component: ComponentName
  let fixture: ComponentFixture<ComponentName>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentName ],
      imports: [ HttpClientTestingModule ]
    }).compileComponents()

    fixture = TestBed.createComponent(ComponentName)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render title', () => {
    const compiled = fixture.nativeElement
    expect(compiled.querySelector('h1').textContent).toContain('Expected Title')
  })

  it('should handle click event', () => {
    spyOn(component, 'handleClick')
    const button = fixture.nativeElement.querySelector('button')
    
    button.click()
    fixture.detectChanges()
    
    expect(component.handleClick).toHaveBeenCalled()
  })
})
```

### Vue 3 (Vitest + Vue Test Utils)

#### Imports Típicos
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ComponentName from './ComponentName.vue'
```

#### Estructura Básica
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main container', () => {
    const wrapper = mount(ComponentName)
    expect(wrapper.find('.container').exists()).toBe(true)
  })

  it('handles button click', async () => {
    const wrapper = mount(ComponentName)
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.emitted()).toHaveProperty('submit')
  })

  it('displays data from API', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ data: 'test' })
      })
    )

    const wrapper = mount(ComponentName)
    await flushPromises()
    
    expect(wrapper.text()).toContain('test')
  })
})
```

---

## 🔧 BACKEND TESTING

### Node.js + Express (Jest/Mocha + Supertest)

#### Imports Típicos
```javascript
import request from 'supertest'
import app from '../app'
import { jest } from '@jest/globals'
```

#### Tests de API Endpoints
```javascript
describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/resource', () => {
    it('should return 200 and data array', async () => {
      const response = await request(app)
        .get('/api/resource')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(response.body).toBeInstanceOf(Array)
    })

    it('should return filtered data with query params', async () => {
      const response = await request(app)
        .get('/api/resource?type=specific')
        .expect(200)

      expect(response.body.every(item => item.type === 'specific')).toBe(true)
    })
  })

  describe('POST /api/resource', () => {
    it('should create new resource', async () => {
      const newResource = {
        name: 'Test',
        description: 'Test Description'
      }

      const response = await request(app)
        .post('/api/resource')
        .send(newResource)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.name).toBe(newResource.name)
    })

    it('should return 400 for invalid data', async () => {
      const invalidResource = { name: '' }

      await request(app)
        .post('/api/resource')
        .send(invalidResource)
        .expect(400)
    })
  })
})
```

#### Tests de Servicios/Lógica de Negocio
```javascript
import { ResourceService } from '../services/resource.service'
import { mockDatabase } from '../test-utils/mocks'

describe('ResourceService', () => {
  let service

  beforeEach(() => {
    service = new ResourceService(mockDatabase)
  })

  describe('getAll', () => {
    it('should return all resources', async () => {
      const resources = await service.getAll()
      expect(resources).toBeInstanceOf(Array)
    })
  })

  describe('create', () => {
    it('should create and return new resource', async () => {
      const data = { name: 'Test', value: 100 }
      const result = await service.create(data)
      
      expect(result).toHaveProperty('id')
      expect(result.name).toBe(data.name)
    })

    it('should throw error for duplicate entries', async () => {
      const data = { name: 'Existing' }
      await expect(service.create(data)).rejects.toThrow('Already exists')
    })
  })
})
```

### .NET (xUnit/NUnit)

#### Tests de Controllers
```csharp
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;

public class ResourceControllerTests
{
    private readonly Mock<IResourceService> _mockService;
    private readonly ResourceController _controller;

    public ResourceControllerTests()
    {
        _mockService = new Mock<IResourceService>();
        _controller = new ResourceController(_mockService.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult_WithListOfResources()
    {
        // Arrange
        var mockResources = new List<Resource>
        {
            new Resource { Id = 1, Name = "Test1" },
            new Resource { Id = 2, Name = "Test2" }
        };
        _mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(mockResources);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var resources = Assert.IsAssignableFrom<IEnumerable<Resource>>(okResult.Value);
        Assert.Equal(2, resources.Count());
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenModelInvalid()
    {
        // Arrange
        _controller.ModelState.AddModelError("Name", "Required");
        var newResource = new Resource();

        // Act
        var result = await _controller.Create(newResource);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }
}
```

#### Tests de Servicios
```csharp
using Xunit;
using Moq;

public class ResourceServiceTests
{
    private readonly Mock<IResourceRepository> _mockRepo;
    private readonly ResourceService _service;

    public ResourceServiceTests()
    {
        _mockRepo = new Mock<IResourceRepository>();
        _service = new ResourceService(_mockRepo.Object);
    }

    [Fact]
    public async Task CreateAsync_SavesResource_WhenValid()
    {
        // Arrange
        var resource = new Resource { Name = "Test" };
        _mockRepo.Setup(r => r.AddAsync(It.IsAny<Resource>()))
                 .ReturnsAsync(resource);

        // Act
        var result = await _service.CreateAsync(resource);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test", result.Name);
        _mockRepo.Verify(r => r.AddAsync(It.IsAny<Resource>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ThrowsException_WhenDuplicate()
    {
        // Arrange
        _mockRepo.Setup(r => r.ExistsAsync(It.IsAny<string>()))
                 .ReturnsAsync(true);

        // Act & Assert
        await Assert.ThrowsAsync<DuplicateException>(
            () => _service.CreateAsync(new Resource { Name = "Duplicate" })
        );
    }
}
```

### Python (pytest + FastAPI/Flask)

#### Tests de API
```python
import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

class TestResourceAPI:
    def test_get_all_resources_returns_200(self):
        response = client.get("/api/resources")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_resource_returns_201(self):
        new_resource = {
            "name": "Test",
            "description": "Test Description"
        }
        response = client.post("/api/resources", json=new_resource)
        
        assert response.status_code == 201
        assert response.json()["name"] == new_resource["name"]

    def test_create_resource_invalid_data_returns_400(self):
        invalid_data = {"name": ""}
        response = client.post("/api/resources", json=invalid_data)
        
        assert response.status_code == 400
```

#### Tests de Servicios
```python
import pytest
from unittest.mock import Mock, patch
from services.resource_service import ResourceService

class TestResourceService:
    @pytest.fixture
    def service(self):
        return ResourceService()

    @pytest.fixture
    def mock_db(self):
        return Mock()

    def test_get_all_returns_list(self, service, mock_db):
        # Arrange
        mock_db.query.return_value = [{"id": 1, "name": "Test"}]
        service.db = mock_db

        # Act
        result = service.get_all()

        # Assert
        assert isinstance(result, list)
        assert len(result) > 0

    def test_create_saves_to_database(self, service, mock_db):
        # Arrange
        data = {"name": "Test", "value": 100}
        service.db = mock_db

        # Act
        result = service.create(data)

        # Assert
        mock_db.add.assert_called_once()
        assert result["name"] == data["name"]
```

---

## 🎯 Patrones Universales de Testing

### 1. Test de Renderizado/Inicialización

**Frontend:**
```javascript
it('renders/mounts correctly', () => {
  // React
  const { container } = render(<Component />)
  
  // Angular
  expect(component).toBeTruthy()
  
  // Vue
  const wrapper = mount(Component)
  expect(wrapper.exists()).toBe(true)
})
```

**Backend:**
```javascript
it('initializes correctly', () => {
  const service = new MyService()
  expect(service).toBeDefined()
  expect(service.config).toHaveProperty('apiKey')
})
```

### 2. Test de Interacción/Llamadas

**Frontend:**
```javascript
it('handles user interaction', async () => {
  // Arrange: Renderizar componente
  render(<Component />)
  
  // Act: Simular acción
  fireEvent.click(screen.getByRole('button'))
  
  // Assert: Verificar resultado
  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument()
  })
})
```

**Backend:**
```javascript
it('handles API call', async () => {
  // Arrange
  const payload = { data: 'test' }
  
  // Act
  const response = await request(app)
    .post('/api/endpoint')
    .send(payload)
  
  // Assert
  expect(response.status).toBe(201)
  expect(response.body).toHaveProperty('id')
})
```

### 3. Test de Estados/Respuestas

**Frontend:**
```javascript
it('displays loading state', () => {
  render(<Component isLoading={true} />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})

it('displays error state', () => {
  render(<Component error="Error message" />)
  expect(screen.getByText(/error/i)).toBeInTheDocument()
})

it('displays success state', () => {
  render(<Component data={mockData} />)
  expect(screen.getByText(mockData.title)).toBeInTheDocument()
})
```

**Backend:**
```javascript
it('returns 200 for successful request', async () => {
  const response = await request(app).get('/api/resource')
  expect(response.status).toBe(200)
})

it('returns 404 when resource not found', async () => {
  const response = await request(app).get('/api/resource/999')
  expect(response.status).toBe(404)
})

it('returns 500 for server error', async () => {
  mockService.getAll.mockRejectedValue(new Error('DB Error'))
  const response = await request(app).get('/api/resource')
  expect(response.status).toBe(500)
})
```

### 4. Test de Validación

**Frontend:**
```javascript
it('shows validation error for empty input', async () => {
  render(<Form />)
  const input = screen.getByLabelText(/name/i)
  
  fireEvent.blur(input) // Sin escribir nada
  
  await waitFor(() => {
    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })
})
```

**Backend:**
```javascript
it('validates required fields', async () => {
  const response = await request(app)
    .post('/api/resource')
    .send({}) // Sin campos requeridos
    
  expect(response.status).toBe(400)
  expect(response.body.errors).toContainEqual(
    expect.objectContaining({ field: 'name', message: expect.any(String) })
  )
})
```

### 5. Test de Mocking API/Servicios

**Frontend:**
```javascript
it('fetches and displays data', async () => {
  // Mock
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: 'test' })
    })
  )

  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('test')).toBeInTheDocument()
  })
  
  expect(global.fetch).toHaveBeenCalledWith('/api/endpoint')
})
```

**Backend:**
```javascript
it('calls external service correctly', async () => {
  const mockExternalService = jest.fn().mockResolvedValue({ data: 'test' })
  service.externalService = mockExternalService
  
  await service.processData()
  
  expect(mockExternalService).toHaveBeenCalledWith(
    expect.objectContaining({ param: 'value' })
  )
})
```

### 6. Test de Error Handling

**Universal Pattern:**
```javascript
it('handles errors gracefully', async () => {
  // Arrange: Mock error
  mockFunction.mockRejectedValue(new Error('Network error'))
  
  // Act
  const result = await executeFunction()
  
  // Assert
  expect(result.error).toBeDefined()
  expect(result.error.message).toContain('Network error')
})
```

### 7. Test de Autorización/Autenticación

**Frontend:**
```javascript
it('redirects to login when not authenticated', () => {
  const { history } = renderWithRouter(<ProtectedRoute />)
  expect(history.location.pathname).toBe('/login')
})
```

**Backend:**
```javascript
it('returns 401 when no auth token', async () => {
  const response = await request(app)
    .get('/api/protected')
    
  expect(response.status).toBe(401)
})

it('returns 403 when insufficient permissions', async () => {
  const response = await request(app)
    .get('/api/admin')
    .set('Authorization', 'Bearer user-token')
    
  expect(response.status).toBe(403)
})
```

### 8. Test de Integración con Base de Datos

**Backend Pattern:**
```javascript
describe('Database Integration', () => {
  beforeEach(async () => {
    await database.clear()
    await database.seed(testData)
  })

  afterEach(async () => {
    await database.clear()
  })

  it('saves data to database', async () => {
    const data = { name: 'Test' }
    const result = await service.create(data)
    
    const saved = await database.findById(result.id)
    expect(saved.name).toBe(data.name)
  })

  it('updates existing record', async () => {
    const existing = await database.findFirst()
    const updated = await service.update(existing.id, { name: 'Updated' })
    
    expect(updated.name).toBe('Updated')
  })
})
```

---

## ✅ Checklist Universal de Testing

### Para Cualquier Componente/Función/Módulo

#### Básicos
- [ ] Se inicializa correctamente
- [ ] Renderiza/ejecuta sin errores
- [ ] Tiene valores por defecto apropiados

#### Funcionalidad
- [ ] Funcionalidad principal funciona
- [ ] Funcionalidad secundaria funciona
- [ ] Edge cases manejados

#### Estados
- [ ] Estado inicial correcto
- [ ] Estados intermedios correctos
- [ ] Estado final correcto
- [ ] Transiciones entre estados

#### Errores
- [ ] Errores capturados correctamente
- [ ] Mensajes de error apropiados
- [ ] Recuperación de errores funciona
- [ ] No hay memory leaks

#### Integración
- [ ] APIs/servicios llamados correctamente
- [ ] Parámetros correctos enviados
- [ ] Respuestas procesadas correctamente
- [ ] Errores de red manejados

#### Performance
- [ ] Operaciones asíncronas completan
- [ ] No hay operaciones bloqueantes
- [ ] Cleanup apropiado

---

## 🚫 Errores Comunes (Universales)

### 1. No usar await con operaciones asíncronas
```javascript
// ❌ MAL
it('test async', () => {
  asyncFunction()
  expect(result).toBe(expected)
})

// ✅ BIEN
it('test async', async () => {
  await asyncFunction()
  expect(result).toBe(expected)
})
```

### 2. Tests dependientes entre sí
```javascript
// ❌ MAL
let sharedState
it('test 1', () => {
  sharedState = 'value'
})
it('test 2', () => {
  expect(sharedState).toBe('value') // Depende de test 1
})

// ✅ BIEN
beforeEach(() => {
  sharedState = 'value'
})
it('test 1', () => { /* usa sharedState */ })
it('test 2', () => { /* usa sharedState */ })
```

### 3. No limpiar mocks/spies
```javascript
// ❌ MAL
it('test', () => {
  jest.spyOn(obj, 'method')
  // No limpia el spy
})

// ✅ BIEN
afterEach(() => {
  jest.restoreAllMocks()
})
```

### 4. Tests demasiado generales
```javascript
// ❌ MAL
it('works', () => {
  expect(component).toBeTruthy()
})

// ✅ BIEN
it('displays user name when data is loaded', () => {
  expect(screen.getByText('John Doe')).toBeInTheDocument()
})
```

### 5. No verificar llamadas a mocks
```javascript
// ❌ MAL
mockFunction()
// No verifica que se llamó

// ✅ BIEN
mockFunction()
expect(mockFunction).toHaveBeenCalledWith(expectedParams)
```

---

## 📊 Nomenclatura de Tests (Universal)

### Formato Recomendado

**Estructura:** `it('should [acción] when [condición]', () => {})`

**Ejemplos Frontend:**
```javascript
it('should render loading spinner when data is being fetched')
it('should display error message when API call fails')
it('should disable submit button when form is invalid')
it('should emit event when user clicks save button')
```

**Ejemplos Backend:**
```javascript
it('should return 200 when request is valid')
it('should create user when all required fields are provided')
it('should throw error when database connection fails')
it('should validate email format when creating user')
```

### Alternativa BDD Style

```javascript
describe('Given user is authenticated', () => {
  describe('When accessing protected resource', () => {
    it('Then should return resource data', () => {})
  })
  
  describe('When token is expired', () => {
    it('Then should return 401 unauthorized', () => {})
  })
})
```

---

## 🔧 Configuración de Testing por Framework

### Jest (JavaScript/TypeScript)
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom', // o 'node' para backend
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### Vitest (Vite)
```javascript
// vite.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // o 'node'
    setupFiles: './vitest.setup.ts'
  }
})
```

### xUnit (.NET)
```xml
<!-- Directory.Build.props -->
<PropertyGroup>
  <CollectCoverage>true</CollectCoverage>
  <CoverageThreshold>80</CoverageThreshold>
</PropertyGroup>
```

### pytest (Python)
```ini
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
```

---

## 💡 Mejores Prácticas Universales

### 1. **Independencia**
Cada test debe poder ejecutarse solo, sin depender de otros tests.

### 2. **Claridad**
El nombre del test debe describir exactamente qué se está probando.

### 3. **Rapidez**
Los tests unitarios deben ejecutarse en milisegundos, no segundos.

### 4. **Aislamiento**
Usar mocks/stubs para aislar la unidad bajo prueba.

### 5. **Cobertura**
Apuntar a 80%+ de cobertura, priorizando código crítico.

### 6. **Mantenibilidad**
Tests deben ser fáciles de entender y modificar.

### 7. **Reproducibilidad**
Mismo input = mismo output, siempre.

### 8. **Una Cosa a la Vez**
Cada test verifica una sola cosa específica.

### 9. **Cleanup**
Siempre limpiar estado después de cada test.

### 10. **Documentación**
El código de test sirve como documentación viva.

---

## 📈 Cobertura de Tests Objetivo

| Tipo de Código | Cobertura Mínima | Cobertura Ideal |
|----------------|------------------|-----------------|
| Lógica crítica de negocio | 90% | 100% |
| APIs/Controllers | 80% | 95% |
| Servicios/Helpers | 80% | 90% |
| Componentes UI | 70% | 85% |
| Utilities | 85% | 95% |
| Edge cases | 70% | 80% |

---

## 🎓 Resumen Ejecutivo

### Para cualquier proyecto (Frontend o Backend):

1. ✅ **Usa AAA Pattern**: Arrange-Act-Assert
2. ✅ **Tests independientes**: No compartas estado
3. ✅ **Nombres descriptivos**: "should do X when Y"
4. ✅ **Mock dependencias externas**: APIs, DB, servicios
5. ✅ **Verifica estados**: Loading, Success, Error
6. ✅ **Cleanup apropiado**: beforeEach/afterEach
7. ✅ **Operaciones asíncronas**: Siempre await
8. ✅ **Una cosa por test**: Foco específico
9. ✅ **Tests rápidos**: < 100ms por test unitario
10. ✅ **Cobertura 80%+**: Priorizar código crítico

---

## 📚 Ejemplo de Referencia (Vue 3)

Para ver un ejemplo completo y detallado de implementación en Vue 3, consulta:
- **Archivo:** `src/__tests__/Home.spec.ts`
- **Cobertura:** 18 tests cubriendo todas las funcionalidades
- **Incluye:** Mocking fetch API, tests de renderizado, interacción, estados, formularios, timers, y manejo de errores

---

**Framework agnóstico** | **Aplicable a React, Angular, Vue, Node.js, .NET, Python y más**  
**Última actualización:** 17 de Noviembre de 2025  
**Basado en:** Mejores prácticas de la industria y estándares internacionales

**Basado en:** Mejores prácticas de la industria y estándares internacionales
