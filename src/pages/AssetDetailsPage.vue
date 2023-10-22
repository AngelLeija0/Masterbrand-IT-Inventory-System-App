<template>
  <q-page>
    <q-section class="flex justify-between q-px-md q-py-sm">
      <GoBackButton />
      <MoreOptionsButton :options="assetMoreOptions" @optionClicked="handleOptionClick" />
    </q-section>
    <q-section v-if="Object.keys(assetInfo).length > 0" class="flex row q-px-md" style="height: 75vh;">
      <div class="col-12 col-sm-12 col-md-3 bg-grey-2 flex" style="border-radius: 12px; flex-direction: column;">
        <div class="q-pa-md">
          <div class="flex justify-between">
            <div class="text-h6 q-pr-md">{{ assetInfo.category }} {{ assetInfo.model }}</div>
            <div v-if="assetInfo.status?.name">
              <q-icon name="circle" :color="defineStatusColor(assetInfo.status?.name)" />
              &nbsp;
              {{ assetInfo.status.name }}
            </div>
            <div v-else>
              <q-icon name="circle" color="black" />
              &nbsp;
              Sin definir
            </div>
          </div>
          <div class="text-grey-14" v-if="assetInfo.serial_number">#{{ assetInfo.serial_number }}</div>
        </div>
        <div class="q-py-lg">
          <div v-for="(section, i) in pageSections" :key="i + 1">
            <SecondaryNavbarButton :label="section.label" :active="section.state" @click="goToSection(section.label)" />
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-12 col-md-9 q-px-lg q-py-sm" style="overflow-y: auto;">
        <AssetInfo v-if="detailsLoaded && pageSections[0].state" :modelInfo="assetInfo"
          @update-info="getAssetDetails(idAsset)" />
        <AssetActions v-if="detailsLoaded && pageSections[1].state" :columns="assetActionsColumns" :rows="sortedActions"
          @update-info="getAssetDetails(idAsset)" />
      </div>
    </q-section>

    <DialogConfirmDelete ref="dialogConfirmDeleteRef" :label="assetInfo.model ? assetInfo.model : assetInfo.description"
      @deleteConfirm="deleteAsset" />
  </q-page>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { api } from "src/boot/axios"
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

import MoreOptionsButton from 'src/components/MoreOptionsButton.vue'
import GoBackButton from 'src/components/GoBackButton.vue'
import SecondaryNavbarButton from 'src/components/SecondaryNavbarButton.vue'
import DialogConfirmDelete from 'src/components/DialogConfirmDelete.vue'

import AssetInfo from 'src/components/AssetInfo.vue'
import AssetActions from 'src/components/AssetActions.vue'

export default defineComponent({
  name: 'AssetDetailsPage',
  components: {
    GoBackButton,
    SecondaryNavbarButton,
    AssetInfo,
    AssetActions,
    MoreOptionsButton,
    DialogConfirmDelete,
  },
  setup() {
    const $q = useQuasar()
    const router = useRoute()

    if (!router.params.id) {
      console.log("a")
      router.push({ name: 'assets-page' })
    }

    const idAsset = ref(router.params.id)

    const actualSection = ref("details")

    const assetMoreOptions = ref([
      {
        label: "Agregar accion",
        icon: "add",
        color: "black",
        value: "add-action",
      },
      {
        label: "Borrar",
        icon: "delete",
        color: "red",
        value: "delete-asset"
      }
    ])

    const dialogConfirmDeleteState = ref(false)

    const pageSections = ref([
      {
        label: "Detalles",
        state: true
      },
      {
        label: "Acciones",
        state: false
      },
      {
        label: "Imagenes y videos",
        state: false
      }
    ])

    const assetInfo = ref({})

    const detailsLoaded = ref(false)

    watch(idAsset, (newValue, oldValue) => {
      getAssetDetails(newValue)
    })

    function getAssetDetails(id) {
      try {
        api
          .get(`./assets/${id}`)
          .then((res) => {
            const data = res.data
            if (data) {
              assetInfo.value = data
              sortedActions.value = sortActions(data.actions)
              detailsLoaded.value = true
            } else {
              router.push({ name: 'assets-page' })
            }
          })
          .catch((err) => {
            router.push({ name: 'assets-page' })
            console.log(err)
          });
      } catch (error) {
        router.push({ name: 'assets-page' })
        console.log(error)
      }
    }

    getAssetDetails(idAsset.value)

    const assetActionsColumns = [
      {
        name: 'index',
        label: '#',
        field: 'index'
      },
      { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
      { name: 'description', label: 'Descripcion', field: 'description', align: 'left' },
      { name: 'status', label: 'Estado', field: 'status', align: 'left' },
      { name: 'attachments', label: 'Imagenes y videos', field: 'attachments', align: 'left' },
      { name: 'date', label: 'Fecha', field: 'date', align: 'left' },
      { name: 'actions', label: '', align: 'left' },
    ]

    const sortedActions = ref()

    function sortActions(actions) {
      actions.sort((a, b) => new Date(b.date) - new Date(a.date))
      return actions
    }

    return {
      $q,
      router,
      idAsset,
      getAssetDetails,
      assetInfo,
      detailsLoaded,
      actualSection,
      assetMoreOptions,
      dialogConfirmDeleteState,
      pageSections,
      assetActionsColumns,
      sortedActions,
    }
  },
  methods: {
    handleOptionClick(option) {
      if (option === 'delete-asset') return this.deleteAsset()
    },
    goToSection(toSection) {
      this.pageSections.map((section) => {
        if (section.label === toSection) {
          section.state = true
        } else {
          section.state = false
        }
      })
    },
    deleteAsset(confirm = false) {
      if (confirm === false) {
        return this.$refs.dialogConfirmDeleteRef.openDialog();
      }
      api
        .delete(`./assets/delete/${this.idAsset}`)
        .then((res) => {
          if (res.status === 200) {
            this.$q.notify({
              type: 'warning',
              message: 'Borrado correctamente.',
              timeout: 2500,
            })
            this.$router.push({ name: 'assets-page' })
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'Ha ocurrido un error.',
              timeout: 2000,
            })
          }
        })
        .catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Ha ocurrido un error. ${err.message}`,
            timeout: 2000,
          })
        })
    },
    defineStatusColor(status) {
      if (status === 'Activo' || status === 'Con stock') return 'green'
      if (status === 'Inactivo' || status === 'Bajo stock') return 'orange'
      if (status === 'Roto' || status === 'Sin stock') return 'red'
    },
  },
});
</script>
