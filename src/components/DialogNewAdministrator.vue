<template>
  <q-dialog v-model="dialogState" persistent transparent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeDialog" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-sm" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h5 text-weight-medium">Nuevo Administrador</div>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-lg">
          <q-title class="text-subtitle2 text-weight-regular">Completa los siguientes campos para crear un nuevo
            administrador.</q-title>
          <div class="q-mb-lg q-pt-md">
            <q-input clearable dense v-model="inputInfo.username" label="Nombre" class="q-mb-md" hint="requerido"
              :rules="inputRulesDictionary.username" />
            <q-input clearable dense v-model="inputInfo.email" label="Correo electronico" type="email" class="q-mb-md" hint="requerido"
              :rules="inputRulesDictionary.email" />
            <q-input clearable dense v-model="inputInfo.password" label="Contraseña" type="password" class="q-mb-md" hint="requerido"
              :rules="inputRulesDictionary.password" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Agregar" size="0.85rem" color="primary" dense padding="sm lg" outline
          style="border-radius: 10px; text-transform: capitalize;" @click="addAdministrator" :disable="!validateForm()" />
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
  name: "DialogNewAdministrator",
  setup() {
    const $q = useQuasar()
    const dialogState = ref(false)

    const inputInfo = ref({})

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const inputRulesDictionary = ref({
      username: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      email: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => emailRegex.test(val) || 'Ingresa un correo electrónico válido'
      ],
      password: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres'
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
    addAdministrator() {
      this.inputInfo.created_at = new Date()
      api
        .post("./administrators/create", this.inputInfo)
        .then((res) => {
          const data = res.data
          if (data) {
            this.$q.notify({
              type: 'positive',
              message: 'Creado correctamente.',
              timeout: 2000,
            })
            this.dialogState = false
            this.$emit("administratorAdded")
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

      if (Object.keys(this.inputInfo).length > 0 && Object.keys(this.inputInfo).length == Object.keys(this.inputRulesDictionary).length) {
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
