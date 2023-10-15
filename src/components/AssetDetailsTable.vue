<template>
  <q-table flat bordered :rows="rows" :columns="columns" :loading="loading" loading-label="Cargando" row-key="name"
    table-header-style="font-weight: 100;" class="q-pt-md" no-data-label="No se encontraron datos"
    :style="{ height: isMobile ? '72.5vh' : '66vh' }">
    <template v-slot:body-cell-status="props">
      <q-td>
        <div v-if="props.row?.status">
          <q-icon name="circle" :color="defineStatusColor(props.row?.status)" />
          &nbsp;
          {{ props.row?.status }}
        </div>
        <div v-else>
          <q-icon name="circle" color="black" />
          &nbsp;
          Sin definir
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td>
        <q-btn label="Ver mas" icon-right="navigate_next" color="dark" outline size="0.75rem"
          style="border-radius: 10px; text-transform: capitalize;" @click="redirectToAsset(props.row._id)" />
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { defineComponent, ref, watch } from "vue"
import { useRoute } from 'vue-router'
import { useViewStore } from "src/stores/view-store"

export default defineComponent({
  name: "AssetDetailsTable",
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

    const viewStore = useViewStore()
    const viewConfig = ref(viewStore.getView)

    watch(() => viewStore.getView, (newValue) => {
      console.log(newValue)
      viewConfig.value = newValue
      setTableView()
    })

    function setTableView() {
      if (viewConfig.value.value) {
        console.log(viewConfig.value.value)
        const newColumn = { name: 'image', label: 'Imagen', field: 'image' }
      }
    }

    return {
      isMobile,
      route,
      viewStore,
      viewConfig,
      setTableView,
      pagination: ref({
        rowsPerPage: 0
      })
    }
  },
  methods: {
    redirectToAsset(idAsset) {
      this.$router.push({ path: `./inventario/${idAsset}` })
    },
    defineStatusColor(status) {
      if (status === 'Activo' || status === 'Con stock') return 'green'
      if (status === 'Inactivo' || status === 'Bajo stock') return 'orange'
      if (status === 'Roto' || status === 'Sin stock') return 'red'
    },
  }
});
</script>
