<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Flight {
    id: number
    flight_number: string
    destination: string
    departure_time: string
    comments: 'En hora' | 'Retrasado' | 'Cancelado' | 'Con demora'
    type: 'salida' | 'llegada'
}

const currentDate = ref('')
const departures = ref<Flight[]>([])
const arrivals = ref<Flight[]>([])
const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const showEditModal = ref(false)
const editingFlight = ref<Flight | null>(null)
const newFlight = ref({
    flight_number: '',
    destination: '',
    departure_time: '',
    comments: 'En hora' as 'En hora' | 'Retrasado' | 'Cancelado' | 'Con demora',
    type: 'salida' as 'salida' | 'llegada'
})

const API_URL = 'http://localhost:3000/api/flights'

const cities = [
    'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Alicante',
    'Londres', 'París', 'Roma', 'Berlín', 'Ámsterdam', 'Bruselas', 'Lisboa',
    'Nueva York', 'Los Ángeles', 'Miami', 'Chicago', 'San Francisco',
    'Tokio', 'Pekín', 'Shanghái', 'Hong Kong', 'Seúl', 'Singapur',
    'Dubái', 'Estambul', 'El Cairo', 'Tel Aviv',
    'Buenos Aires', 'São Paulo', 'Ciudad de México', 'Lima', 'Bogotá',
    'Sídney', 'Melbourne', 'Auckland',
    'Toronto', 'Montreal', 'Vancouver',
    'Moscú', 'San Petersburgo',
    'Viena', 'Praga', 'Varsovia', 'Budapest',
    'Atenas', 'Estocolmo', 'Copenhague', 'Oslo', 'Helsinki',
    'Zúrich', 'Ginebra', 'Múnich', 'Fráncfort',
    'Dublín', 'Edimburgo', 'Mánchester'
].sort()

const filteredCities = ref<string[]>([])
const showCityDropdown = ref(false)
const citySearchTerm = ref('')

const filterCities = (searchTerm: string) => {
    citySearchTerm.value = searchTerm
    if (!searchTerm) {
        filteredCities.value = []
        showCityDropdown.value = false
        return
    }
    filteredCities.value = cities.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    showCityDropdown.value = filteredCities.value.length > 0
}

const selectCity = (city: string, isEdit: boolean = false) => {
    if (isEdit && editingFlight.value) {
        editingFlight.value.destination = city
    } else {
        newFlight.value.destination = city
    }
    showCityDropdown.value = false
    filteredCities.value = []
    citySearchTerm.value = ''
}

const updateDate = () => {
    const now = new Date()
    currentDate.value = now.toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

const fetchFlights = async () => {
    try {
        loading.value = true
        error.value = ''

        // Obtain departures
        const departuresRes = await fetch(`${API_URL}?type=salida`)
        if (!departuresRes.ok) throw new Error('Error al cargar salidas')
        departures.value = await departuresRes.json()

        // Obtain arrivals
        const arrivalsRes = await fetch(`${API_URL}?type=llegada`)
        if (!arrivalsRes.ok) throw new Error('Error al cargar llegadas')
        arrivals.value = await arrivalsRes.json()
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error desconocido'
        console.error('Error al cargar vuelos:', err)
    } finally {
        loading.value = false
    }
}

const openModal = () => {
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const resetForm = () => {
    newFlight.value = {
        flight_number: '',
        destination: '',
        departure_time: '',
        comments: 'En hora',
        type: 'salida'
    }
}

const createFlight = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFlight.value)
        })

        if (!response.ok) throw new Error('Error al crear vuelo')

        await fetchFlights()
        closeModal()
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error al crear vuelo'
        console.error('Error:', err)
    }
}

const openEditModal = (flight: Flight) => {
    editingFlight.value = { ...flight }
    showEditModal.value = true
}

const closeEditModal = () => {
    showEditModal.value = false
    editingFlight.value = null
}

const updateFlight = async () => {
    if (!editingFlight.value) return

    try {
        const response = await fetch(`${API_URL}/${editingFlight.value.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editingFlight.value)
        })

        if (!response.ok) throw new Error('Error al actualizar vuelo')

        await fetchFlights()
        closeEditModal()
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error al actualizar vuelo'
        console.error('Error:', err)
    }
}

const deleteFlight = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este vuelo?')) return

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })

        if (!response.ok) throw new Error('Error al eliminar vuelo')

        await fetchFlights()
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error al eliminar vuelo'
        console.error('Error:', err)
    }
}

let interval: number

onMounted(() => {
    updateDate()
    interval = setInterval(updateDate, 1000)
    fetchFlights()
})

onUnmounted(() => {
    clearInterval(interval)
})
</script>

<template>
    <div class="container">
        <div class="header">
            <img src="@/assets/logo.png" alt="Logo">
            <span>{{ currentDate }}</span>
        </div>
        <div class="boxes">
            <div class="box">
                <h1>Salidas</h1>
                <div class="box-header">
                    <span>Nº de Vuelo</span>
                    <span>Destino</span>
                    <span>Hora de Salida</span>
                    <span>Estado</span>
                </div>
                <div class="flights">
                    <div v-if="loading" class="loading">Cargando vuelos...</div>
                    <div v-else-if="error" class="error">{{ error }}</div>
                    <div v-else-if="departures.length === 0" class="empty">No hay salidas registradas</div>
                    <div v-else class="flight-item" v-for="flight in departures" :key="flight.id">
                        <span>{{ flight.flight_number }}</span>
                        <span>{{ flight.destination }}</span>
                        <span>{{ flight.departure_time }}</span>
                        <span>{{ flight.comments }}</span>
                        <div class="flight-actions">
                            <button class="btn-edit" @click="openEditModal(flight)">Editar vuelo</button>
                            <button class="btn-delete" @click="deleteFlight(flight.id)">Eliminar vuelo</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box">
                <h1>Llegadas</h1>
                <div class="box-header">
                    <span>Nº de Vuelo</span>
                    <span>Destino</span>
                    <span>Hora de Llegada</span>
                    <span>Estado</span>
                </div>
                <div class="flights">
                    <div v-if="loading" class="loading">Cargando vuelos...</div>
                    <div v-else-if="error" class="error">{{ error }}</div>
                    <div v-else-if="arrivals.length === 0" class="empty">No hay llegadas registradas</div>
                    <div v-else class="flight-item" v-for="flight in arrivals" :key="flight.id">
                        <span>{{ flight.flight_number }}</span>
                        <span>{{ flight.destination }}</span>
                        <span>{{ flight.departure_time }}</span>
                        <span>{{ flight.comments }}</span>
                        <div class="flight-actions">
                            <button class="btn-edit" @click="openEditModal(flight)">Editar vuelo</button>
                            <button class="btn-delete" @click="deleteFlight(flight.id)">Eliminar vuelo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="buttons">
            <div class="banner"></div>
            <button class="create" @click="openModal">Crear registro</button>
            <div class="banner"></div>
        </div>

        <!-- Create flight modal -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal" @click.stop>
                <h2>Crear Nuevo Registro de Vuelo</h2>
                <form @submit.prevent="createFlight">
                    <div class="form-group">
                        <label>Tipo:</label>
                        <select v-model="newFlight.type" required>
                            <option value="salida">Salida</option>
                            <option value="llegada">Llegada</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nº de Vuelo:</label>
                        <input v-model="newFlight.flight_number" type="text" required placeholder="ej: VY1234">
                    </div>
                    <div class="form-group city-autocomplete">
                        <label>Destino:</label>
                        <input v-model="newFlight.destination" @input="filterCities(newFlight.destination)"
                            @focus="filterCities(newFlight.destination)" type="text" required
                            placeholder="Escribe para buscar..." autocomplete="off">
                        <div v-if="showCityDropdown && !editingFlight" class="city-dropdown">
                            <div v-for="city in filteredCities" :key="city" class="city-option"
                                @click="selectCity(city, false)">
                                {{ city }}
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Hora de Salida:</label>
                        <input v-model="newFlight.departure_time" type="time" required>
                    </div>
                    <div class="form-group">
                        <label>Estado:</label>
                        <select v-model="newFlight.comments" required>
                            <option value="En hora">En hora</option>
                            <option value="Retrasado">Retrasado</option>
                            <option value="Cancelado">Cancelado</option>
                            <option value="Con demora">Con demora</option>
                        </select>
                    </div>
                    <div class="modal-buttons">
                        <button type="button" class="btn-cancel" @click="closeModal">Cancelar</button>
                        <button type="submit" class="btn-submit">Crear</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit flight modal -->
        <div v-if="showEditModal && editingFlight" class="modal-overlay" @click="closeEditModal">
            <div class="modal" @click.stop>
                <h2>Editar Registro de Vuelo</h2>
                <form @submit.prevent="updateFlight">
                    <div class="form-group">
                        <label>Tipo:</label>
                        <select v-model="editingFlight.type" required>
                            <option value="salida">Salida</option>
                            <option value="llegada">Llegada</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nº de Vuelo:</label>
                        <input v-model="editingFlight.flight_number" type="text" required placeholder="ej: VY1234">
                    </div>
                    <div class="form-group city-autocomplete">
                        <label>Destino:</label>
                        <input v-model="editingFlight.destination" @input="filterCities(editingFlight.destination)"
                            @focus="filterCities(editingFlight.destination)" type="text" required
                            placeholder="Escribe para buscar..." autocomplete="off">
                        <div v-if="showCityDropdown && editingFlight" class="city-dropdown">
                            <div v-for="city in filteredCities" :key="city" class="city-option"
                                @click="selectCity(city, true)">
                                {{ city }}
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Hora de Salida:</label>
                        <input v-model="editingFlight.departure_time" type="time" required>
                    </div>
                    <div class="form-group">
                        <label>Estado:</label>
                        <select v-model="editingFlight.comments" required>
                            <option value="En hora">En hora</option>
                            <option value="Retrasado">Retrasado</option>
                            <option value="Cancelado">Cancelado</option>
                            <option value="Con demora">Con demora</option>
                        </select>
                    </div>
                    <div class="modal-buttons">
                        <button type="button" class="btn-cancel" @click="closeEditModal">Cancelar</button>
                        <button type="submit" class="btn-submit">Actualizar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    max-width: 50%;
    margin: auto;
    gap: 2rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    width: 100%;
}

.header img {
    height: 60px;
}

.header span {
    font-size: 2rem;
    font-weight: bold;
}

.boxes {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 2rem;
}

.box {
    padding: 12px;
    border-radius: 12px;
    width: 100%;
}

.box h1 {
    background-color: #44444E;
    padding: 12px;
    border-radius: 12px;
    font-size: 1.5rem;
    text-align: center;
}

.box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
}

.box-header span {
    font-size: 0.9rem;
}

.flight-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 8px;
    background-color: #55555E;
    border-radius: 8px;
    transition: all 0.3s ease;
    overflow: hidden;
}

.flight-item span {
    flex: 1;
    text-align: center;
    font-size: 0.9rem;
    transition: opacity 0.3s ease;
}

.flight-item:hover span {
    opacity: 0;
}

.flight-actions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.flight-item:hover .flight-actions {
    opacity: 1;
    pointer-events: all;
}

.btn-edit {
    flex: 1;
    height: 100%;
    padding: 10px;
    background-color: #55555E;
    color: white;
    border: none;
    border-radius: 0;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.3s;
}

.btn-edit:hover {
    background-color: #697ac4;
}

.btn-delete {
    flex: 1;
    height: 100%;
    padding: 10px;
    background-color: #55555E;
    color: white;
    border: none;
    border-radius: 0;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.3s;
}

.btn-delete:hover {
    background-color: #d9534f;
}

.loading,
.error,
.empty {
    text-align: center;
    padding: 20px;
    font-size: 0.9rem;
}

.error {
    color: #ff6b6b;
}

.empty {
    color: #999;
}

.buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 12px;
    gap: 1rem;
}

.banner {
    flex: 1;
    height: 2px;
    background-color: #55555E;
}

.create {
    padding: 10px 20px;
    background-color: #55555E;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: 0.5s background-color ease;
}

.create:hover {
    background-color: whitesmoke;
    color: #55555E;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background-color: #2a2a2e;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.modal h2 {
    margin-bottom: 1.5rem;
    color: white;
}

.form-group {
    margin-bottom: 1rem;
}

.city-autocomplete {
    position: relative;
}

.city-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    background-color: #44444E;
    border: 1px solid #55555E;
    border-radius: 5px;
    margin-top: 4px;
    z-index: 1001;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.city-option {
    padding: 0.75rem;
    cursor: pointer;
    color: white;
    transition: background-color 0.2s;
}

.city-option:hover {
    background-color: #55555E;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #ccc;
    font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    background-color: #44444E;
    border: 1px solid #55555E;
    border-radius: 5px;
    color: white;
    font-size: 1rem;
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: whitesmoke;
}

.modal-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.btn-cancel,
.btn-submit {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
}

.btn-cancel {
    background-color: #55555E;
    color: white;
}

.btn-cancel:hover {
    background-color: #666;
}

.btn-submit {
    background-color: #697ac4;
    color: white;
}

.btn-submit:hover {
    background-color: #5b6ec4;
}

/* Mobile design */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
        margin-inline: 16px;
        max-width: 100%;
    }

    .boxes {
        flex-direction: column;
        gap: 1.5rem;
    }

    .box {
        width: 100%;
    }

    .box h1 {
        font-size: 1.5rem;
    }

    .box-header span {
        font-size: 0.8rem;
    }
}
</style>
