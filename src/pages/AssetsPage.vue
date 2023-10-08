<template>
  <q-page>
    <q-section class="flex justify-between q-pa-md">
      <PageTitle label="Inventario" />
      <div v-if="isMobile">
        <q-btn-group flat>
          <PrimaryButton flat icon="add" @click="activateDialogNewAsset" toolTip="Agregar producto" />
          <DialogNewAsset ref="dialogNewAssetRef" />
          <PrimaryButton flat icon="more_vert" toolTip="Mas opciones" />
        </q-btn-group>
      </div>
      <div v-else>
        <q-btn-group flat>
          <PrimaryButton label="Agregar Nuevo" icon="add" class="q-mx-sm" @click="activateDialogNewAsset" />
          <DialogNewAsset ref="dialogNewAssetRef" />
          <PrimaryButton flat icon="more_vert" class="q-mx-sm" toolTip="Mas opciones" />
        </q-btn-group>
      </div>
    </q-section>
    <q-section>
      <FilterBar @getAllData="getAllAssets" @realodData="setAssets"></FilterBar>
    </q-section>
    <q-section>
      <AssetDetailsTable :columns="assetColumns" :rows="assetRows" :loading="loadingState" @reloadData="setAssets">
      </AssetDetailsTable>
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
import AssetDetailsTable from 'src/components/AssetDetailsTable.vue'
import DialogNewAsset from 'src/components/DialogNewAsset.vue'

export default defineComponent({
  name: 'AssetsPage',
  components: {
    PageTitle,
    PrimaryButton,
    FilterBar,
    AssetDetailsTable,
    DialogNewAsset,
  },
  setup() {
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

    const stateDialogNewAsset = ref(false)

    const assetColumns = [
      {
        name: 'index',
        label: '#',
        field: 'index'
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

    const loadingState = ref(false)

    const dataApiStore = useDataApiStore()

    getAllAssets()

    function getAllAssets() {
      loadingState.value = true
      try {
        api
          .get("./assets")
          .then((res) => {
            const data = res.data
            if (data.length > 0) {
              setAssets(data)
            }
          })
          .catch((err) => {
            console.log(err)
          });
      } catch (error) {
        console.log(error)
      }
    }

    function setAssets(data = null) {
      if (data !== null) {
        dataApiStore.setDataApi(data)
      }
      assetRows.value = dataApiStore.getDataApi
      loadingState.value = false
    }

    return {
      isMobile,
      assetColumns,
      assetRows,
      loadingState,
      stateDialogNewAsset,
      dataApiStore,
      getAllAssets,
      setAssets,
    }
  },
  methods: {
    activateDialogNewAsset() {
      this.$refs.dialogNewAssetRef.openDialog();
    },
  }
})
</script>
