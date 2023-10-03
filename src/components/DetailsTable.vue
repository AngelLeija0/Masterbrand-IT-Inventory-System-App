<template>
  <q-table flat bordered :rows="rows" :columns="columns" row-key="name" table-header-style="font-weight: 100;" class="q-pt-md"
    no-data-label="No se encontraron datos" style="height: 66vh; max-height: 66vh;">
    <template v-slot:body-cell-actions="props">
      <q-td>
        <q-btn label="Editar" icon-right="edit" color="secondary" outline size="0.75rem" class="q-mx-xs"
          style="border-radius: 10px; text-transform: capitalize;" @click="openModifyDialog(props.row._id)" />
        <q-btn label="Borrar" icon-right="delete" color="red" outline size="0.75rem" class="q-mx-xs"
          style="border-radius: 10px; text-transform: capitalize;" @click="openDeleteDialog(props.row._id)" />
      </q-td>
    </template>
  </q-table>

  <q-dialog v-model="dialogModify" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh;">
      <div v-if="pageLabel === 'Categorias'">
        <q-card-actions align="right" class="q-py-none">
          <q-btn icon="close" color="black" flat round @click="closeModifyDialog(currentData._id)" class="q-py-none" />
        </q-card-actions>
        <q-card-section class="q-pt-none q-pb-sm">
          <div class="text-h6">{{ pageLabel }}</div>
          <div>{{ currentData.name }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="currentData.name" label="Nombre" />
          <div class="q-pt-lg q-pb-md">Propiedades</div>
          <div class="row flex justify-between">
            <div class="q-ma-sm col-md-5 col-11" v-for="(property, i) in checkBoxProperties" :key="i">
              <q-checkbox v-model="property.value" :label="property.label" dense />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Guardar" size="0.85rem" color="secondary" dense padding="sm lg" outline
            style="border-radius: 10px; text-transform: capitalize;" @click="saveRecord(currentData._id)" />
          <q-btn label="Cancelar" size="0.85rem" flat dense padding="sm lg"
            style="border-radius: 10px; text-transform: capitalize;" @click="closeModifyDialog(currentData._id)" />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogDelete" persistent>
    <q-card class="q-pa-md" style="width: 500px; max-width: 80vw;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeDeleteDialog(currentData._id)" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
          <div class="text-h6">Borrar {{ pageLabel }}</div>
        </q-card-section>
      <q-card-section class="q-pt-md q-pb-sm flex justify-start">
        <div class="text-center text-subtitle1 text-weight-regular">¿Estas seguro de borrar este registro?
        </div>
        <div class="text-subtitle2 text-weight-regular q-pt-sm">Ten en cuenta que una vez borrado no sera posible
          recuperarlo.</div>
        <div class="text-subtitle2 text-weight-regular q-pt-md">Escribe <span class="text-red text-weight-medium">delete
            {{ currentData.name }}</span> a continuación para confirmar.</div>
        <div class="full-width q-pt-sm q-pb-md">
          <q-input v-model="inputConfirmDelete" outlined dense class="full-width" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Confirmar" size="0.85rem" color="red" dense padding="sm lg" outline
          style="border-radius: 10px; text-transform: capitalize;" :disabled="inputConfirmDelete !== `delete ${currentData.name}`" @click="deleteRecord(currentData._id)" />
        <q-btn label="Cancelar" size="0.85rem" flat dense padding="sm lg"
          style="border-radius: 10px; text-transform: capitalize;" @click="closeDeleteDialog(currentData._id)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from "vue"
import { useRoute } from 'vue-router'
import { api } from "src/boot/axios"
import { useQuasar } from 'quasar'

export default defineComponent({
  name: "DetailsTable",
  props: {
    label: {
      type: String
    },
    rows: {
      type: Array,
    },
    columns: {
      type: Array
    }
  },

  setup(props) {
    const $q = useQuasar()
    const route = useRoute()

    const pageLabel = ref(props.label)

    const records = ref(props.rows)

    watch(() => props.rows, (newValue) => {
      records.value = newValue
      records.value.forEach((row, index) => {
        row.index = index + 1
      })
    })

    const isCategory = ref(props?.columns[2]?.name === 'properties' ? true : false)

    const dialogModify = ref(false)
    const dialogDelete = ref(false)
    const inputConfirmDelete = ref(null)
    const currentData = ref(null)

    const checkBoxProperties = ref([
      {
        label: 'Descripcion',
        key: 'description',
        value: false
      },
      {
        label: 'Fabricante',
        key: 'manufacturer',
        value: false
      },
      {
        label: 'Modelo',
        key: 'model',
        value: false
      },
      {
        label: 'Serial',
        key: 'serial',
        value: false
      },
      {
        label: 'Lugar de compra',
        key: 'purchase_from',
        value: false
      },
      {
        label: 'Fecha de compra',
        key: 'purchase_date',
        value: false
      },
      {
        label: 'Costo',
        key: 'cost',
        value: false
      },
      {
        label: 'Garantia',
        key: 'warranty_info',
        value: false
      },
      {
        label: 'Fecha de expiracion de garantia',
        key: 'warranty_expiration_date',
        value: false
      },
      {
        label: 'Ubicacion',
        key: 'location',
        value: false
      },
      {
        label: 'Ubicacion (informacion extra)',
        key: 'location_extra_info',
        value: false
      },
      {
        label: 'Empleado',
        key: 'current_employee',
        value: false
      },
      {
        label: 'S/O',
        key: 'operating_system',
        value: false
      },
      {
        label: 'Direccion IP',
        key: 'ip_address',
        value: false
      },
      {
        label: 'Memoria RAM',
        key: 'ram',
        value: false
      },
      {
        label: 'Estado de red',
        key: 'network_status',
        value: false
      },
      {
        label: 'Cantidad',
        key: 'quantity',
        value: false
      },
      {
        label: 'Ultima cantidad de salida',
        key: 'quantity_last_out',
        value: false
      },
      {
        label: 'Fecha de ultima cantidad de salida',
        key: 'date_quantity_last_out',
        value: false
      },
      {
        label: 'Cantidad de ultimo restock',
        key: 'quantity_last_restock',
        value: false
      },
      {
        label: 'Fecha de ultimo restock',
        key: 'date_last_restock',
        value: false
      }
    ])

    return {
      route,
      pageLabel,
      records,
      dialogModify,
      dialogDelete,
      currentData,
      checkBoxProperties,
      isCategory,
      inputConfirmDelete,
      pagination: ref({
        rowsPerPage: 0
      })
    }
  },
  methods: {
    redirectToAsset(idAsset) {
      this.$router.push({ path: `inventario/${idAsset}` })
    },
    openModifyDialog(id) {
      if (this.isCategory) {
        this.dialogModify = true
        const recordInfo = this.records.find((category) => category._id === id)
        this.currentData = recordInfo
        if (recordInfo.properties) {
          const properties = recordInfo.properties
          this.checkBoxProperties.map((checkBoxProperty, i) => {
            const found = properties.some(property => property.key === checkBoxProperty.key)
            this.checkBoxProperties[i].value = found
          })
        }
      }
    },
    closeModifyDialog(id) {
      this.dialogModify = false
      this.currentData = null
    },
    saveRecord(id) {
      if (this.isCategory) {
        const recordInfo = this.records.find((category) => category._id === id)
        const properties = this.checkBoxProperties.map((property) => {
          if (property.value == true) {
            return {
              name: property.label,
              key: property.key
            }
          }
        }).filter((property) => property !== undefined)
        recordInfo.properties = properties
        recordInfo.updated_at = new Date()

        api
          .patch(`./categories/update/${recordInfo._id}`, recordInfo)
          .then((res) => {
            const data = res.data
            if (data) {
              this.$q.notify({
                type: 'positive',
                message: 'Guardado correctamente.',
                timeout: 2000,
              })
              this.dialogModify = false
              this.currentData = null
            } else {
              this.$q.notify({
                type: 'negative',
                message: 'Ha ocurrido un error.',
                timeout: 2000,
              })
            }
          })
          .catch((err) => {
            console.log(err)
            this.$q.notify({
              type: 'negative',
              message: 'Ha ocurrido un error.',
              timeout: 2000,
            })
          })
      }
    },
    openDeleteDialog(id) {
      console.log(id)
      this.dialogDelete = true
      const recordInfo = this.records.find((category) => category._id === id)
      this.currentData = recordInfo
    },
    closeDeleteDialog(id) {
      this.dialogDelete = false
      this.currentData = null
    },
    deleteRecord(id) {
      if (this.isCategory) {
        console.log(id)
        api
          .delete(`./categories/delete/${id}`)
          .then((res) => {
            console.log(res)
            console.log(res.data)
            if (res.status === 200) {
              this.$q.notify({
                type: 'warning',
                message: 'Borrado correctamente.',
                timeout: 2000,
              })
              this.dialogDelete = false
              this.currentData = null
              this.$emit("categoryDeleted")
            } else {
              this.$q.notify({
                type: 'negative',
                message: 'Ha ocurrido un error.',
                timeout: 2000,
              })
            }
          })
          .catch((err) => {
            console.log(err)
            this.$q.notify({
              type: 'negative',
              message: 'Ha ocurrido un error.',
              timeout: 2000,
            })
          })
      }
    }
  }
});
</script>
