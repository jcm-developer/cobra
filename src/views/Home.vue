<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentDate = ref('')

const updateDate = () => {
    const now = new Date()
    currentDate.value = now.toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

let interval: number

onMounted(() => {
    updateDate()
    interval = setInterval(updateDate, 1000)
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
                    <span>Comentarios</span>
                </div>
                <div class="flights"></div>
            </div>
            <div class="box">
                <h1>Llegadas</h1>
                <div class="box-header">
                    <span>Nº de Vuelo</span>
                    <span>Destino</span>
                    <span>Hora de Salida</span>
                    <span>Comentarios</span>
                </div>
                <div class="flights"></div>
            </div>
        </div>
        <div class="buttons">
            <div class="banner"></div>
            <button class="create">Crear registro</button>
            <div class="banner"></div>
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
