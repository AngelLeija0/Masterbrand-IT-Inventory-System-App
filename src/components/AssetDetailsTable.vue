<template>
  <q-table flat bordered :rows="rows" :columns="columns" :loading="loading" row-key="name" table-header-style="font-weight: 100;" class="q-pt-md"
    no-data-label="No se encontraron datos" style="height: 66vh; max-height: 66vh;">
    <template v-slot:body-cell-status="props">
      <q-td>
        <div v-if="props.row.status === 'Activo'" class=""><q-icon name="circle" color="green"></q-icon> Activo</div>
        <div v-else-if="props.row.status === 'Inactivo'" class=""><q-icon name="circle" color="orange"></q-icon> Inactivo</div>
        <div v-else-if="props.row.status === 'Roto'" class=""><q-icon name="circle" color="red"></q-icon> Roto</div>
        <div v-else class=""><q-icon name="circle" color="black"></q-icon> Sin definir</div>
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td>
        <q-btn
        label="Ver mas"
        icon-right="navigate_next"
        color="dark"
        outline
        size="0.75rem"
        style="border-radius: 10px; text-transform: capitalize;"
        @click="redirectToAsset(props.row._id)"
        />
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
      if(viewConfig.value.value) {
        console.log(viewConfig.value.value)
        const newColumn = { name: 'image', label: 'Imagen', field: 'image' }
      }
    }

    return {
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
    redirectToAsset (idAsset) {
      this.$router.push({ path: `inventario/${idAsset}` })
    }
  }
});
</script>
