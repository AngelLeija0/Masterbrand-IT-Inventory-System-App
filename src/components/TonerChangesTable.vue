<template>
    <q-table flat bordered :rows="rows" :columns="columns" :loading="loading" loading-label="Cargando" row-key="name"
      table-header-style="font-weight: 100;" class="q-pt-md" no-data-label="No se encontraron datos"
      rows-per-page-label="Cantidad de registros"
      :style="{ height: isMobile ? '68vh' : '63vh' }">
    </q-table>
  </template>
  
  <script>
  import { defineComponent, ref, watch } from "vue"
  import { useRoute } from 'vue-router'
  
  export default defineComponent({
    name: "TonerChangesTable",
    props: {
      rows: {
        type: Array,
      },
      columns: {
        type: Array,
      },
      loading: {
        type: Boolean,
      }
    },
    setup(props) {
      const isMobile = ref(isUsingMobile());
  
      function isUsingMobile() {
        const validation1 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const validation2 = window.innerWidth < 768
        const finalValidation = validation1 || validation2;
        return finalValidation;
      }
  
      window.addEventListener("resize", () => {
        isMobile.value = isUsingMobile()
      })
  
      const route = useRoute()
      const records = ref(props.rows)
  
      watch(() => props.rows, (newValue) => {
        records.value = newValue
        records.value.forEach((row, index) => {
          row.index = index + 1
        })
      })
  
      return {
        isMobile,
        route,
        pagination: ref({
          rowsPerPage: 0
        })
      }
    },
    methods: {

    }
  });
  </script>
  