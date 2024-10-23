<template>
  <q-page class="q-page">
    <q-section class="column q-py-md" style="height: 100%;">
      <div class="flex q-px-md items-center">
        <PageTitle label="Archivos" />
      </div>
      <div class="q-mt-md files-table">
        <q-table flat bordered :rows="rows" :columns="columns" row-key="name" table-header-style="font-weight: 100;"
          class="q-pt-md" style="height: 100%;" no-data-label="No se encontraron datos"
          rows-per-page-label="Cantidad de registros" :rows-per-page-options="[8, 10, 20, 30, 0]">
          <template v-slot:body-cell-actions="props">
            <q-td class="flex justify-end" style="max-width: 215px;">
              <q-btn v-if="section == 'administrators'" label="Cambiar contraseña" icon-right="lock_open" outline
                size="0.75rem" class="q-mx-xs" style="border-radius: 10px; text-transform: capitalize" />
              <q-btn label="Descargar" icon-right="download" color="primary" outline size="0.75rem" padding="xs xl"
                style="border-radius: 10px; text-transform: capitalize" @click="downloadFile(props.row.filename)" />
            </q-td>
          </template>
        </q-table>
      </div>
    </q-section>
  </q-page>
</template>

<style scoped>
.q-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.files-table {
  flex: 1;
  overflow: auto;
  padding-bottom: 30px;
}
</style>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import PageTitle from 'src/components/PageTitle.vue';

export default defineComponent({
  name: 'FilesPage',
  components: {
    PageTitle,
  },
  setup() {
    const $q = useQuasar()
    const columns = ref([
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
        name: 'name', label: 'Nombre', field: 'name', align: 'left',
        sortable: true,
        sort: (a, b) => {
          return a.localeCompare(b)
        }
      },
      { name: 'type', label: 'Tipo', field: 'type', align: 'left' },
      { name: 'size', label: 'Tamaño', field: 'size', align: 'left' },
      { name: 'actions', label: '', align: 'right' }
    ])
    const rows = ref([
      {
        index: "1",
        name: "MasterODBC",
        filename: "WC Master ODBC Connections 2018.reg",
        type: "Registration Entries",
        size: "16 KB"
      },
      {
        index: "2",
        name: "SCM - Integrated Measurement System (IMS) Tool",
        filename: "SCM - Integrated Measurement System (IMS) Tool.xslb",
        type: "Microsoft Excel Binary Worksheet",
        size: "9,227 KB"
      },
      {
        index: "3",
        name: "TightVNC",
        filename: "tightvnc-2.0.4-setup.exe",
        type: "Application",
        size: "647 KB"
      },
      {
        index: "4",
        name: "Zebra Designer V2",
        filename: "ZebraDesigner_V2_2_3_4266.exe",
        type: "Application",
        size: "25,501 KB"
      },
      {
        index: "5",
        name: "Putty",
        filename: "putty.exe",
        type: "Application",
        size: "647 KB"
      }
    ])


    return {
      $q,
      columns,
      rows,
    }
  },
  methods: {
    downloadFile(filename) {
      api.get(`/uploads/files/${filename}`, { responseType: 'blob' })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
          this.$q.notify({
            type: 'positive',
            message: 'Descargado correctamente.',
            timeout: 2000,
          })
        })
        .catch((error) => {
          this.$q.notify({
            type: 'negative',
            message: 'Error al descargar el archivo.',
            timeout: 2000,
          })
        });
    }

  }
});
</script>