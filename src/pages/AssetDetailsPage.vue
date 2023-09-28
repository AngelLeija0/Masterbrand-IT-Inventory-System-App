<template>
  <q-page>
    <q-section class="flex justify-between q-pa-md">
      <GoBackButton />
    </q-section>
    <q-section class="flex row q-px-md" style="height: 70vh;">
      <div class="col-3 bg-grey-2 flex" style="border-radius: 12px; flex-direction: column;">
        <div class="q-pa-md">
          <div class="flex justify-between">
            <div class="text-h6 q-pr-md">{{ assetInfo.category }} {{ assetInfo.model }}</div>
            <div v-if="assetInfo.status?.name == 'Active'"><q-icon name="circle" color="green"></q-icon> Activo</div>
            <div v-else-if="assetInfo.status?.name == 'Inactive'"><q-icon name="circle" color="orange"></q-icon> Inactivo
            </div>
            <div v-else-if="assetInfo.status?.name == 'Broken'"><q-icon name="circle" color="red"></q-icon> Roto</div>
            <div v-else><q-icon name="circle" color="black"></q-icon> Sin definir</div>
          </div>
          <div class="text-grey-14">#{{ assetInfo.serial_number }}</div>
        </div>
        <div class="q-py-lg">
          <SecondaryNavbarButton label="Detalles" :active="activeDetails" />
          <SecondaryNavbarButton label="Acciones" :active="activeActions" />
          <SecondaryNavbarButton label="Imagenes y Videos" :active="false" />
        </div>
        <div class="q-pa-md" style="margin-top: auto;">
          <q-btn label="Borrar" icon="delete" color="red" outline class="full-width" />
        </div>
      </div>
      <div class="col-9 q-px-lg" style="overflow-y: auto;">
        <TechnologyDetails v-if="detailsLoaded" :modelInfo="assetInfo" />
      </div>
    </q-section>
  </q-page>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { api } from "src/boot/axios"
import { useRoute } from 'vue-router'

import GoBackButton from 'src/components/GoBackButton.vue'
import SecondaryNavbarButton from 'src/components/SecondaryNavbarButton.vue'
import TechnologyDetails from 'src/components/TechnologyDetails.vue'

export default defineComponent({
  name: 'AssetDetailsPage',
  components: {
    GoBackButton,
    SecondaryNavbarButton,
    TechnologyDetails,
  },
  setup() {
    const router = useRoute()
    const idAsset = ref(router.params.id)

    const actualSection = ref("details")

    const activeDetails = ref(true)
    const activeActions = ref(false)

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
              detailsLoaded.value = true
              console.log(data)
            }
          })
          .catch((err) => {
            console.log(err)
          });
      } catch (error) {
        console.log(error)
      }
    }

    getAssetDetails(idAsset.value)

    return {
      router,
      idAsset,
      getAssetDetails,
      assetInfo,
      activeDetails,
      activeActions,
      detailsLoaded,
      actualSection,
    }
  },

})
</script>
