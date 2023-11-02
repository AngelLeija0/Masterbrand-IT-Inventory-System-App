<template>
  <q-page>
    <q-section class="flex justify-between q-px-md q-py-sm">
      <GoBackButton />
      <MoreOptionsButton :options="assetMoreOptions" @optionClicked="handleOptionClick" />
    </q-section>
    <q-section v-if="Object.keys(assetInfo).length > 0 && detailsLoaded === true" class="flex row q-px-md"
      :style="{ height: '73vh', overflowY: isMobile ? 'auto' : '' }">
      <div class="col-12 col-sm-12 col-md-3 bg-grey-2 flex" style="border-radius: 12px; flex-direction: column;">
        <div class="q-pa-md">
          <div class="flex justify-between">
            <div class="text-h6 q-pr-md" v-if="assetInfo.model">{{ assetInfo.category }} {{ assetInfo.model }}</div>
            <div class="text-h6 q-pr-md" v-else>{{ assetInfo.category }} {{ assetInfo.description }}</div>
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
          <div class="text-grey-14" v-else>#General</div>
        </div>
        <div class="q-py-lg" :style="{ paddingTop: isMobile ? '5px' : '', paddingBottom: isMobile ? '10px' : '' }">
          <div v-for="(section, i) in pageSections" :key="i + 1">
            <div v-if="isMobile">
              <div v-if="expandSectionBar == true || section.state">
                <SecondaryNavbarButton class="full-width" borderPosition="left" :label="section.label"
                  :active="section.state" @click="goToSection(section.label)" />
              </div>
            </div>
            <div v-else>
              <SecondaryNavbarButton class="full-width" borderPosition="left" :label="section.label"
                :active="section.state" @click="goToSection(section.label)" />
            </div>
          </div>
          <div class="flex justify-end">
            <q-btn v-if="isMobile && expandSectionBar == true" icon="expand_less" flat size="14px" class="full-width"
              style="border-radius: 5px;" @click="expandSectionBar = false" />
            <q-btn v-else-if="isMobile && expandSectionBar == false" icon="expand_more" flat size="14px"
              class="full-width" style="border-radius: 5px;" @click="expandSectionBar = true" />
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-12 col-md-9 q-px-lg q-py-sm"
        :style="{ overflowY: !isMobile ? 'auto' : '', paddingLeft: isMobile ? '0' : '', paddingRight: isMobile ? '0' : '' }">
        <AssetInfo v-if="detailsLoaded === true && pageSections[0].state" :modelInfo="assetInfo"
          @update-info="getAssetDetails(idAsset)" />
        <AssetActions v-if="detailsLoaded === true && pageSections[1].state" :columns="assetActionsColumns" :rows="sortedActions"
          @update-info="getAssetDetails(idAsset)" />
        <AssetAttachments v-if="detailsLoaded === true && pageSections[2].state" :asset="assetInfo"
          @update-info="getAssetDetails(idAsset)" />
      </div>
    </q-section>
    <q-section v-else>
      <div v-if="detailsLoaded === false" class="flex justify-center items-center q-pa-xl q-ma-xl">
        <div class="full-width text-center">
          Cargando información del producto
        </div>
        <q-spinner-dots color="primary" size="32px" />
      </div>
      <div v-else-if="detailsLoaded == 'failed'" class="flex justify-center items-center q-pa-xl q-ma-xl">
        <q-icon name="error" color="red" size="128px" />
        <div class="full-width text-center q-py-lg text-h6">
          Error al cargar el producto
        </div>
        <div class="full-width text-center q-pb-md">
          Vuelve a seleccionar el producto en la seccion del inventario.
        </div>
        <q-btn label="Regresar al inventario" color="dark" style="text-transform: none; border-radius: 5px;"
          to="../inventario" />
      </div>
    </q-section>

    <DialogConfirmDelete ref="dialogConfirmDeleteRef" :label="assetInfo.model ? assetInfo.model : assetInfo.description"
      @deleteConfirm="deleteAsset" />

    <q-dialog v-model="stateQrDialog">
      <q-card class="q-pa-md" style="width: 500px; max-width: 80vw;">
        <q-card-actions align="right" class="q-py-none">
          <q-btn icon="close" color="black" flat round v-close-popup class="q-py-none" />
        </q-card-actions>
        <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
          <div class="text-h6" v-if="assetInfo.model">{{ assetInfo.category }} {{ assetInfo.model }}</div>
          <div class="text-h6" v-else>{{ assetInfo.category }} {{ assetInfo.description }}</div>
        </q-card-section>
        <q-card-actions class="q-pb-none q-mb-none" align="right">
          <q-btn flat round icon="print" color="primary" size="0.95rem" @click="printQr()">
            <q-tooltip class="bg-black" style="font-size: 0.75rem;">Imprimir</q-tooltip>
          </q-btn>
        </q-card-actions>
        <q-card-section class="flex justify-center items-center q-pt-none q-mt-none">
          <vue-qr :text="assetInfo._id" size="300"></vue-qr>
          <div class="text-grey-14 full-width text-center" style="font-size: 0.75rem;" v-if="assetInfo.serial_number">{{
            assetInfo.category }} {{ assetInfo.serial_number }}</div>
          <div class="text-grey-14 full-width text-center" style="font-size: 0.75rem;" v-else>{{ assetInfo.category }}&{{
            assetInfo.description
          }}</div>
          <q-img :src="imageServer + '/uploads/attachments/masterbrand-full-logo.jpg'" spinner-color="primary"
            style="width: 200px; opacity: 0.7;" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="contentToPrint">
      <q-card class="q-pa-md" style="width: 200px;">
        <q-card-section class="flex justify-center items-center">
          <vue-qr :text="assetInfo._id" size="150"></vue-qr>
          <div class="text-grey-14 full-width text-center" style="font-size: 6px;" v-if="assetInfo.serial_number">{{
            assetInfo.category
          }} {{ assetInfo.serial_number }}</div>
          <div class="text-grey-14 full-width text-center" style="font-size: 6px;" v-else>{{ assetInfo.category }}&{{
            assetInfo.description
          }}</div>
          <q-img :src="imageServer + '/uploads/attachments/masterbrand-full-logo.jpg'"
            style="width: 100px; opacity: 0.7;" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { api, serverURL } from "src/boot/axios"
import { useRoute } from 'vue-router'
import { useQuasar, date } from 'quasar'

import MoreOptionsButton from 'src/components/MoreOptionsButton.vue'
import GoBackButton from 'src/components/GoBackButton.vue'
import SecondaryNavbarButton from 'src/components/SecondaryNavbarButton.vue'
import DialogConfirmDelete from 'src/components/DialogConfirmDelete.vue'

import AssetInfo from 'src/components/AssetInfo.vue'
import AssetActions from 'src/components/AssetActions.vue'
import AssetAttachments from 'src/components/AssetAttachments.vue'

import vueQr from 'vue-qr/src/packages/vue-qr.vue'

export default defineComponent({
  name: 'AssetDetailsPage',
  components: {
    GoBackButton,
    SecondaryNavbarButton,
    AssetInfo,
    AssetActions,
    MoreOptionsButton,
    DialogConfirmDelete,
    vueQr,
    AssetAttachments,
  },
  setup() {

    const isMobile = ref(isUsingMobile());

    function isUsingMobile() {
      const validation1 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const validation2 = window.innerWidth < 1024
      const finalValidation = validation1 || validation2;
      return finalValidation;
    }

    window.addEventListener("resize", () => {
      isMobile.value = isUsingMobile()
    })

    const $q = useQuasar()
    const router = useRoute()

    if (!router.params.id) {
      console.log("a")
      router.push({ name: 'assets-page' })
    }

    const idAsset = ref(router.params.id)

    const actualSection = ref("details")

    const imageServer = ref(serverURL)

    const assetMoreOptions = ref([
      {
        label: "Ver codigo QR",
        icon: "qr_code",
        color: "black",
        value: "view-qr",
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
        label: "Archivos adjuntados",
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
              detailsLoaded.value = "failed"
            }
          })
          .catch((err) => {
            detailsLoaded.value = "failed"
            console.log(err)
          });
      } catch (error) {
        detailsLoaded.value = "failed"
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
      {
        name: 'date', label: 'Fecha', field: 'date', align: 'left',
        format: (date) => {
          return formatDate(date)
        }
      },
      { name: 'actions', label: '', align: 'left' },
    ]

    const sortedActions = ref()

    function sortActions(actions) {
      actions.sort((a, b) => new Date(b.date) - new Date(a.date))
      return actions
    }

    function formatDate(dateToFormat) {
      return date.formatDate(dateToFormat, 'DD/MMMM/YYYY - hh:mm', {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      })
    }

    const stateQrDialog = ref(false)
    const contentToPrint = ref(false)

    const expandSectionBar = ref(false)

    return {
      isMobile,
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
      stateQrDialog,
      contentToPrint,
      imageServer,
      expandSectionBar,
    }
  },
  methods: {
    handleOptionClick(option) {
      if (option === 'delete-asset') return this.deleteAsset()
      if (option === 'view-qr') {
        console.log("QR")
        this.openQrDialog()
      }
    },
    goToSection(toSection) {
      this.pageSections.map((section) => {
        if (section.label === toSection) {
          section.state = true
          if (this.expandSectionBar == true) {
            this.expandSectionBar = false
          }
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
    openQrDialog() {
      this.stateQrDialog = true
    },
    closeQrDialog() {
      this.stateQrDialog = false
    },
    printQr() {
      this.stateQrDialog = false
      this.contentToPrint = true
      setTimeout(() => {
        window.print()
        this.contentToPrint = false
      }, 500);
    }
  },
});
</script>
