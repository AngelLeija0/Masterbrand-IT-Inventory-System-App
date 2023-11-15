<template>
  <q-page>
    <q-section class="flex justify-between q-pa-md">
      <PageTitle label="Administradores" />
      <div v-if="isMobile">
        <q-btn-group flat>
          <PrimaryButton flat icon="add" class="q-mx-sm" @click="activateDialogNewAdministrator" />
          <DialogNewAdministrator ref="dialogNewAdministratorRef" @administratorAdded="getAllAdministrators()" />
          <PrimaryButton flat icon="more_vert" class="q-mx-sm" />
        </q-btn-group>
      </div>
      <div v-else>
        <q-btn-group flat>
          <PrimaryButton label="Agregar Nuevo" icon="add" class="q-mx-sm" @click="activateDialogNewAdministrator" />
          <DialogNewAdministrator ref="dialogNewAdministratorRef" @administratorAdded="getAllAdministrators()" />
          <PrimaryButton flat icon="more_vert" class="q-mx-sm" />
        </q-btn-group>
      </div>
    </q-section>
    <q-section>
      <FilterBar @getAllData="getAllAdministrators" @realodData="setAdministrators"></FilterBar>
    </q-section>
    <q-section>
      <DetailsTable section="administrators" label="Administradores" :columns="administratorColumns" :rows="administratorRows" :loading="loadingState"
        @elementDeleted="getAllAdministrators()"></DetailsTable>
    </q-section>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { date } from 'quasar'
import { api } from "src/boot/axios"
import { useDataApiStore } from "src/stores/data-api-store"

import PageTitle from 'src/components/PageTitle.vue'
import PrimaryButton from 'src/components/PrimaryButton.vue'
import FilterBar from 'src/components/FilterBar.vue'
import DetailsTable from 'src/components/DetailsTable.vue'
import DialogNewAdministrator from 'src/components/DialogNewAdministrator.vue'

export default defineComponent({
  name: 'AdminsPage',
  components: {
    PageTitle,
    PrimaryButton,
    FilterBar,
    DetailsTable,
    DialogNewAdministrator,
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

    const stateDialogNewAdministrator = ref(false)

    const administratorColumns = [
      {
        name: 'index',
        label: '#',
        field: 'index'
      },
      { name: 'username', label: 'Nombre', field: 'username', align: 'left' },
      { name: 'email', label: 'Correo electronico', field: 'email', align: 'left' },
      {
        name: 'created_at',
        label: 'Fecha de creación',
        field: 'created_at',
        format: (date) => {
          return formatDate(date)
        },
        sortable: true,
        sort: (a, b) => {
          return new Date(b) - new Date(a)
        },
        align: 'left'
      },
      {
        name: 'updated_at',
        label: 'Ultima fecha de modificación',
        field: 'updated_at',
        format: (date) => {
          if (date == null) {
            return 'Sin modificar'
          }
          return formatDate(date)
        },
        sortable: true,
        sort: (a, b) => {
          return new Date(b) - new Date(a)
        },
        align: 'left'
      },
      { name: 'actions', label: '', align: 'left' }
    ]

    const administratorRows = ref([])

    const dataApiStore = useDataApiStore()

    const loadingState = ref(false)

    getAllAdministrators()

    function getAllAdministrators() {
      loadingState.value = true
      try {
        api
          .get("./administrators")
          .then((res) => {
            const data = res.data
            if (data.length > 0) {
              setAdministrators(data)
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

    function setAdministrators(data = null) {
      if (data !== null) {
        dataApiStore.setDataApi(data)
      }
      administratorRows.value = dataApiStore.getDataApi
      loadingState.value = false
    }

    function formatDate(dateToFormat) {
      return date.formatDate(dateToFormat, 'DD/MMMM/YYYY - hh:mm', {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      })
    }

    return {
      isMobile,
      administratorColumns,
      administratorRows,
      loadingState,
      stateDialogNewAdministrator,
      dataApiStore,
      getAllAdministrators,
      formatDate,
      setAdministrators,
    }
  },
  methods: {
    activateDialogNewAdministrator() {
      this.$refs.dialogNewAdministratorRef.openDialog();
    },
  }
});
</script>
