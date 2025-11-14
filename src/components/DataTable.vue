<script setup lang="ts">
    import { AllCommunityModule, ModuleRegistry, themeBalham, colorSchemeDark } from 'ag-grid-community';
    import { AgGridVue } from "ag-grid-vue3";

    const props = defineProps<{
        columnDefs : any,
        rowData : any[]
    }>();

    ModuleRegistry.registerModules([AllCommunityModule]);
   
    const defaultColDef = {
        sortable: true,
        filter: true,
        resizable: true,
        width: 150
    };

    const theme = themeBalham.withPart(colorSchemeDark);
</script>

<template>
    <ag-grid-vue
        :rowData="props.rowData"
        :columnDefs="props.columnDefs"
        :defaultColDef="defaultColDef"
        style="height: 500px"
        :theme="theme"
    >
    </ag-grid-vue>
</template>