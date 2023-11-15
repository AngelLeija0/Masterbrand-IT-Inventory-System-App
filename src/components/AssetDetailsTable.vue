<template>
  <q-table flat bordered :rows="rows" :columns="columns" :loading="loading" loading-label="Cargando" row-key="name"
    table-header-style="font-weight: 100;" class="q-pt-md" no-data-label="No se encontraron datos"
    rows-per-page-label="Cantidad de registros" :rows-per-page-options="rowsPerPage"
    :style="{ height: isMobile ? '58vh' : '63vh' }">
    <template v-slot:body-cell-image="props">
      <q-td style="width: 15%;" class="text-center">
        <q-img v-if="props.row?.image" class="q-pa-md q-ma-sm"
          :src="imageServer + '/uploads/attachments/' + props.row?.image" spinner-color="primary"
          style="max-width: 260px; height: 100px;"
          @error="() => props.row.image = null"
          />
        <q-icon v-else name="image" size="90px" class="q-pa-md q-ma-sm" style="max-width: 260;" />
      </q-td>
    </template>
    <template v-slot:body-cell-location="props">
      <q-td>
        <div v-if="props.row.location">
          {{ props.row.location_extra_info ? `${props.row.location} - ${props.row.location_extra_info}` :
            props.row.location }}
        </div>
        <div v-else> N/A </div>
      </q-td>
    </template>
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
      <q-td style="width: 10%;">
        <q-btn label="Ver mas" icon-right="navigate_next" color="dark" outline size="0.75rem"
          style="border-radius: 10px; text-transform: capitalize; width: 120px;" @click="redirectToAsset(props.row._id)" />
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { defineComponent, ref, watch } from "vue"
import { useRoute } from 'vue-router'
import { serverURL } from "src/boot/axios";

export default defineComponent({
  name: "AssetDetailsTable",
  props: {
    rows: {
      type: Array,
    },
    columns: {
      type: Array,
    },
    rowsPerPage: {
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

    const imageServer = ref(serverURL)

    watch(() => props.rows, (newValue) => {
      records.value = newValue
      records.value.forEach((row, index) => {
        row.index = index + 1
      })
    })

    return {
      isMobile,
      route,
      imageServer,
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
