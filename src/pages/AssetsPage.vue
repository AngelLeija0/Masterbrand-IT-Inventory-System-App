<template>
  <q-page class="q-page">
    <q-section class="flex justify-between q-pa-md">
      <PageTitle label="Inventario" />
      <div v-if="isMobile">
        <q-btn-group flat>
          <PrimaryButton flat icon="add" toolTip="Agregar producto" @click="activateDialogNewAsset" />
          <DialogNewAsset ref="dialogNewAssetRef"
            @reloadData="() => { getAllAssets(); emitEventUpdateNotifications() }" />
          <MoreOptionsButton :options="assetOptions" @optionClicked="handleActionOption" />
          <DialogReport ref="dialogReport" />
        </q-btn-group>
      </div>
      <div v-else>
        <q-btn-group flat>
          <PrimaryButton label="Agregar Nuevo" icon="add" class="q-mx-sm" @click="activateDialogNewAsset" />
          <DialogNewAsset ref="dialogNewAssetRef"
            @reloadData="() => { getAllAssets(); emitEventUpdateNotifications() }" />
          <MoreOptionsButton :options="assetOptions" @optionClicked="handleActionOption" />
          <DialogReport ref="dialogReport" />
        </q-btn-group>
      </div>
    </q-section>
    <q-section>
      <FilterBar @getAllData="getAllAssets" @reloadData="setAssets" @updateView="getView"></FilterBar>
    </q-section>
    <q-section class="asset-details-table" style="padding-bottom: 20px;">
      <AssetDetailsTable :columns="assetColumns" :rows="assetRows" :loading="loadingState"
        :rowsPerPage="tableRowsPerPage" @reloadData="() => { setAssets(); emitEventUpdateNotifications(); }">
      </AssetDetailsTable>
    </q-section>
  </q-page>
</template>

<style scoped>
.q-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.q-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.asset-details-table {
  flex: 1;
  overflow: auto;
  padding-bottom: 10px;
}
</style>

<script>
import { defineComponent, ref, watch } from 'vue'
import { api } from "src/boot/axios"
import { useDataApiStore } from "src/stores/data-api-store"
import { useViewStore } from 'src/stores/view-store'
import { date, exportFile } from 'quasar'

import PageTitle from 'src/components/PageTitle.vue'
import PrimaryButton from 'src/components/PrimaryButton.vue'
import FilterBar from 'src/components/FilterBar.vue'
import AssetDetailsTable from 'src/components/AssetDetailsTable.vue'
import DialogNewAsset from 'src/components/DialogNewAsset.vue'
import MoreOptionsButton from 'src/components/MoreOptionsButton.vue'
import DialogReport from 'src/components/DialogReport.vue'

function wrapCsvValue (val, formatFn, row) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val
  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)
  formatted = formatted.split('"').join('""')
  return `"${formatted}"`
}

export default defineComponent({
  name: 'AssetsPage',
  components: {
    PageTitle,
    PrimaryButton,
    FilterBar,
    AssetDetailsTable,
    DialogNewAsset,
    MoreOptionsButton,
    DialogReport,
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

    const assetColumns = ref([])

    const assetRows = ref([])

    const loadingState = ref(false)

    const tableRowsPerPage = ref([8, 10, 15, 20, 0])

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
            else if (data.length == 0) {
              dataApiStore.clearDataApi()
              loadingState.value = false
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

    function formatDate(dateToFormat) {
      return date.formatDate(dateToFormat, 'DD/MMMM/YYYY - HH:mm', {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      })
    }

    const viewStore = useViewStore()

    const detailsColumns = ref([
      {
        name: 'index',
        label: '#',
        field: 'index',
        sortable: true,
        sort: (a, b) => {
          if (a < b) {
            return a
          }
          return b
        }
      },
      {
        name: 'category', label: 'Categoria', field: 'category', align: 'left',
        sortable: true,
        sort: (a, b) => {
          return a.localeCompare(b)
        }
      },
      { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
      { name: 'model', label: 'Modelo', field: 'model', align: 'left', format: (value) => value ? value : 'N/A' },
      { name: 'serial_number', label: 'Serial', field: 'serial_number', align: 'left', format: (value) => value ? value : 'N/A' },
      {
        name: 'location',
        label: 'Ubicación',
        field: 'location',
        align: 'left',
        sortable: true,
        sort: (a, b) => {
          if (a.startsWith("Celda")) {
            return -1
          }
          return a.localeCompare(b)
        }
      },
      { name: 'current_employee', label: 'Empleado', field: 'current_employee', align: 'left', format: (value) => value ? value : 'N/A' },
      { name: 'status', label: 'Estado', field: 'status', align: 'left' },
      {
        name: 'created_at', label: 'Fecha de creación', field: 'created_at', align: 'left',
        format: (date) => formatDate(date),
        sortable: true,
        sort: (a, b) => new Date(b) - new Date(a)
      },
      { name: 'actions', label: '', align: 'left' }
    ])

    const contentColumns = ref([
      {
        name: 'index',
        label: '#',
        field: 'index'
      },
      { name: 'image', label: 'Imagen', field: 'image', align: 'center' },
      { name: 'category', label: 'Categoria', field: 'category', align: 'left' },
      { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
      {
        name: 'manufacturer', label: 'Fabricante', field: 'manufacturer', align: 'left', format: (value) => {
          if (value) {
            return value
          }
          return "N/A"
        }
      },
      {
        name: 'model', label: 'Modelo', field: 'model', align: 'left', format: (value) => {
          if (value) {
            return value
          }
          return "N/A"
        }
      },
      {
        name: 'serial_number', label: 'Serial', field: 'serial_number', align: 'left', format: (value) => {
          if (value) {
            return value
          }
          return "N/A"
        }
      },
      {
        name: 'status', label: 'Estado', field: 'status', align: 'left'
      },
      {
        name: 'created_at', label: 'Creado el', field: 'created_at', align: 'left',
        format: (date) => {
          return formatDate(date)
        },
        sortable: true,
        sort: (a, b) => {
          return new Date(b) - new Date(a)
        }
      },
      { name: 'actions', label: '', align: 'left' }
    ])

    if (!viewStore.getView) {
      assetColumns.value = detailsColumns.value
    } else {
      const viewConfig = viewStore.getView
      if (viewConfig?.content == true) {
        assetColumns.value = contentColumns.value
      }
      if (viewConfig?.details == true) {
        assetColumns.value = detailsColumns.value
      }
    }

    const assetOptions = ref([
      {
        label: "Consulta existencias",
        icon: "find_in_page",
        color: "",
        value: "get-report"
      },
      {
        label: "Descargar Excel",
        icon: "download",
        color: "",
        value: "get-excel"
      }
    ])
    const dialogReport = ref(false)

    return {
      isMobile,
      assetColumns,
      assetRows,
      loadingState,
      stateDialogNewAsset,
      dataApiStore,
      getAllAssets,
      setAssets,
      detailsColumns,
      contentColumns,
      viewStore,
      tableRowsPerPage,
      assetOptions,
      dialogReport,
    }
  },
  methods: {
    activateDialogNewAsset() {
      this.$refs.dialogNewAssetRef.openDialog();
    },
    getView() {
      const view = this.viewStore.getView
      
      if (view.content == true) {
        this.tableRowsPerPage = [3, 5, 10, 15, 20, 0]
        return this.assetColumns = this.contentColumns
      }
      if (view.details == true) {
        this.tableRowsPerPage = [5, 10, 15, 20, 0]
        return this.assetColumns = this.detailsColumns
      }
    },
    handleActionOption(option) {
      if (option == "get-report") return this.activateDialogReport()
      if (option == "get-excel") return this.downloadExcel()
    },
    activateDialogReport() {
      this.$refs.dialogReport.openDialog()
    },
    emitEventUpdateNotifications() {
      this.$emit("updateNotifications")
    },
    downloadExcel() {
      const columns = this.detailsColumns
      const rows = this.assetRows

      const content = [columns.map(col => wrapCsvValue(col.label))].concat(
        rows.map(row => columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )).join(','))
      ).join('\r\n')
      
      const status = exportFile(
        'inventario.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        $q.notify({
          message: 'Navegador rechazo la descarga...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }
  }
});
</script>
