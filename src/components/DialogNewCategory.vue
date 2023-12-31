<template>
  <q-dialog v-model="dialogState" persistent transparent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeDialog" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-sm" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h5 text-weight-medium">Nueva Categoria</div>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-lg">
          <q-title class="text-subtitle2 text-weight-regular">Completa los siguientes campos para crear una nueva
            categoria.</q-title>
          <div class="q-mb-lg q-pt-md">
            <div class="col-12 q-pt-sm text-weight-medium">Nombre</div>
            <q-input clearable dense v-model="inputInfo.name" class="q-mb-md" hint="requerido"
              :rules="inputRulesDictionary.name" />
            <div class="row flex justify-between">
              <div class="col-12 q-pt-sm text-weight-medium">Propiedades</div>
              <div class="col-12 text-subtitle2 text-weight-regular q-py-sm">Selecciona las propiedades que tendrá la
                categoria</div>
              <div class="q-ma-sm col-md-5 col-11" v-for="(property, i) in checkBoxProperties" :key="i">
                <q-checkbox v-model="property.value" :label="property.label" dense
                  :disable="property.key === 'description'" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Agregar" size="0.85rem" color="primary" dense padding="sm lg" outline
          style="border-radius: 10px; text-transform: capitalize;" @click="addCategory" :disable="!validateForm()" />
        <q-btn label="Cancelar" size="0.85rem" flat dense padding="sm lg" outline
          style="border-radius: 10px; text-transform: capitalize;" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue"
import { api } from "src/boot/axios"
import { useQuasar } from 'quasar'
import { useUserStore } from "../stores/user-store"

export default defineComponent({
  name: "DialogNewCategory",
  setup() {

    const userStore = useUserStore()

    const $q = useQuasar()
    const dialogState = ref(false)

    const inputInfo = ref({})

    const checkBoxProperties = ref([
      {
        label: 'Descripción',
        key: 'description',
        value: true
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
        label: 'Numero serial',
        key: 'serial_number',
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

    const inputRulesDictionary = ref({
      name: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
    })

    return {
      userStore,
      dialogState,
      inputInfo,
      checkBoxProperties,
      inputRulesDictionary,
    }
  },
  methods: {
    openDialog() {
      this.dialogState = true
    },
    closeDialog() {
      this.dialogState = false
      this.inputInfo = {}
    },
    addCategory() {
      const properties = this.checkBoxProperties.map((property) => {
        if (property.value == true) {
          return {
            name: property.label,
            key: property.key
          }
        }
      }).filter((property) => property !== undefined)
      this.inputInfo.properties = properties
      this.inputInfo.created_at = new Date()
      api
        .post(`./categories/create`, this.inputInfo)
        .then((res) => {
          const data = res.data
          if (data) {
            this.$q.notify({
              type: 'positive',
              message: 'Creado correctamente.',
              timeout: 2000,
            })
            this.dialogState = false
            this.$emit("categoryAdded")
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
      this.inputInfo = {}
    },
    validateForm() {
      const results = []

      if (Object.keys(this.inputInfo).length > 0) {
        Object.keys(this.inputInfo).map((key) => {
          const info = this.inputInfo[key]
          if (info) {
            const rules = this.inputRulesDictionary[key]
            for (const rule of rules) {
              const errorMessage = rule(info)
              if (errorMessage !== true) {
                results.push(false)
              } else {
                results.push(true)
              }
            }
          } else {
            return results.push(false)
          }
        })
      } else {
        return false
      }

      if (results.includes(false)) {
        return false
      } else {
        return true
      }
    }
  },
});
</script>
