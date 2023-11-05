<template>
  <q-dialog v-model="dialogState" persistent transparent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeDialog" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-sm" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h5 text-weight-medium">Nueva Ubicación</div>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-lg">
          <q-title class="text-subtitle2 text-weight-regular">Completa los siguientes campos para crear una nueva
            ubicación.</q-title>
          <div class="q-mb-lg q-pt-md">
            <div class="col-12 q-pt-sm text-weight-medium">Nombre</div>
            <q-input clearable dense v-model="inputInfo.name" class="q-mb-md" hint="requerido"
              :rules="inputRulesDictionary.name" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Agregar" size="0.85rem" color="primary" dense padding="sm lg" outline
          style="border-radius: 10px; text-transform: capitalize;" @click="addLocation" :disable="!validateForm()" />
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

export default defineComponent({
  name: "DialogNewLocation",
  setup() {
    const $q = useQuasar()
    const dialogState = ref(false)

    const inputInfo = ref({})

    const inputRulesDictionary = ref({
      name: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
    })

    return {
      dialogState,
      inputInfo,
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
    addLocation() {
      this.inputInfo.created_at = new Date()
      api
        .post("./locations/create", this.inputInfo)
        .then((res) => {
          const data = res.data
          if (data) {
            this.$q.notify({
              type: 'positive',
              message: 'Creado correctamente.',
              timeout: 2000,
            })
            this.dialogState = false
            this.$emit("locationAdded")
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
