<template>
  <q-page>
    <q-section class="flex justify-between q-pa-md">
      <PageTitle label="Inventario" />
      <q-btn-group flat>
        <PrimaryButton label="Agregar Nuevo" icon="add" class="q-mx-sm" @click="activateDialogNewAsset" />
        <DialogNewAsset ref="dialogNewAssetRef" />
        <PrimaryButton flat icon="more_vert" class="q-mx-sm" />
      </q-btn-group>
    </q-section>
    <q-section>
      <FilterBar></FilterBar>
    </q-section>
    <q-section>
      <DetailsTable class="q-py-lg" :columns="assetColumns" :rows="assetRows"></DetailsTable>
    </q-section>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { api } from "src/boot/axios"
import { useDataApiStore } from "src/stores/data-api-store";

import PageTitle from 'src/components/PageTitle.vue'
import PrimaryButton from 'src/components/PrimaryButton.vue'
import FilterBar from 'src/components/FilterBar.vue'
import DetailsTable from 'src/components/DetailsTable.vue'
import DialogNewAsset from 'src/components/DialogNewAsset.vue'

export default defineComponent({
  name: 'AssetsPage',
  components: {
    PageTitle,
    PrimaryButton,
    FilterBar,
    DetailsTable,
    DialogNewAsset
  },
  setup() {
    const stateDialogNewAsset = ref(false)

    let assetIdx = 0;

    const assetColumns = [
      {
        name: 'number',
        label: 'No.',
        format: (x, index) => {
          if (index) assetIdx++
          return assetIdx
        },
      },
      { name: 'category', label: 'Categoria', field: 'category', align: 'left' },
      { name: 'description', label: 'Descripcion', field: 'description', align: 'left' },
      { name: 'manufacturer', label: 'Fabricante', field: 'manufacturer', align: 'left' },
      { name: 'model', label: 'Modelo', field: 'model', align: 'left' },
      { name: 'serial_number', label: 'Serial', field: 'serial_number', align: 'left' },
      { name: 'location', label: 'Ubicacion', field: 'location', align: 'left' },
      { name: 'location_extra_info', label: '', field: 'location_extra_info', align: 'left' },
      { name: 'current_employee', label: 'Empleado', field: 'current_employee', align: 'left' },
      {
        name: 'status', label: 'Estado', field: 'status', align: 'left'
      },
      { name: 'actions', label: '', align: 'left' }
    ]

    const assetRows = ref([])

    const dataApiStore = useDataApiStore()

    getAllAssets()

    function getAllAssets() {
      try {
        api
          .get("./assets")
          .then((res) => {
            const data = res.data
            if (data.length > 0) {
              dataApiStore.setDataApi(data)
              assetRows.value = dataApiStore.getDataApi
              console.log(dataApiStore.getDataApi)
            }
          })
          .catch((err) => {
            console.log(err)
          });
      } catch (error) {
        console.log(error)
      }
    }


    return {
      assetColumns,
      assetRows,
      stateDialogNewAsset,
      dataApiStore,
      getAllAssets
    }
  },
  methods: {
    activateDialogNewAsset() {
      this.$refs.dialogNewAssetRef.openDialog();
    },
  }
})
</script>
