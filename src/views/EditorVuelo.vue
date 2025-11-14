<script setup lang="ts">
    import { createFlight } from '@/backendConn';
import type { Flight } from '@/interfaces/Flight';
    import { ref } from 'vue';
    import type { Ref } from 'vue';

    var vuelo : Ref<Flight> = ref({
        id: 0,
        flightNumber: "",
        flightType: 0,
        city: "",
        scheduledTime: "",
        flightStatus: ""
    });

    var cargando : Ref<boolean> = ref(false);

    async function guardarCambios() {
        try{
            await createFlight(vuelo.value);
            alert("Vuelo creado");
            vuelo.value = {
                id: 0,
                flightNumber: "",
                flightType: 0,
                city: "",
                scheduledTime: "",
                flightStatus: ""
            };
        } catch(error){
            console.log("Error: "+error);
            alert("Error: "+error);
        }
    }
</script>

<template>
  <div class="container mt-4">
    <h3>Editar Vuelo</h3>
    <div id="form">
      <div class="row g-3">
        <!-- <div class="col-md-2">
          <label class="form-label">ID</label>
          <input type="text" class="form-control" v-model="vuelo.id" disabled />
        </div> -->

        <div class="col-md-2">
          <label class="form-label">Número de Vuelo</label>
          <input type="text" class="form-control" v-model="vuelo.flightNumber" maxlength="20" required />
        </div>

        <div class="col-md-2">
          <label class="form-label">Tipo de Vuelo</label>
          <select class="form-select" v-model="vuelo.flightType" required>
            <option value="1">Comercial</option>
            <option value="2">Privado</option>
            <option value="3">Carga</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Ciudad</label>
          <input type="text" class="form-control" v-model="vuelo.city" maxlength="100" required />
        </div>

        <div class="col-md-2">
          <label class="form-label">Hora Programada</label>
          <input type="datetime-local" class="form-control" v-model="vuelo.scheduledTime" required />
        </div>

        <div class="col-md-2">
          <label class="form-label">Estado del Vuelo</label>
          <input type="text" class="form-control" v-model="vuelo.flightStatus" maxlength="200" />
        </div>
      </div>

      <div class="mt-3">
        <button type="button" class="btn btn-primary" :disabled="cargando" @click="guardarCambios()" >
          {{ cargando ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>