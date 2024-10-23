<template>
  <q-table flat bordered :rows="rows" :columns="columns" :loading="loading" loading-label="Cargando" row-key="name"
    table-header-style="font-weight: 100;" class="q-pt-md" no-data-label="No se encontraron datos" :rows-per-page-options="[8, 10, 20, 30, 0]"
    rows-per-page-label="Cantidad de registros" :style="{ height: isMobile ? '68vh' : '70vh' }">
    <template v-slot:body-cell-actions="props">
      <q-td style="min-width: 9rem">
        <!--
          <q-btn label="Editar" icon-right="edit" color="secondary" outline size="0.75rem" class="q-mx-xs"
          style="border-radius: 10px; text-transform: capitalize" @click="openModifyDialog(props.row)" />
        -->
        <q-btn label="Borrar" icon-right="delete" color="red" outline size="0.75rem"
          style="border-radius: 10px; text-transform: capitalize;" @click="openDeleteDialog(props.row)" />
      </q-td>
    </template>
  </q-table>

  <q-dialog v-model="dialogModify" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeModifyDialog(currentData._id)" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-sm flex items-end" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h5 text-weight-medium">{{ currentData.toner }}</div>
        <div class="text-white text-weight-medium q-px-md q-py-xs q-mx-sm text-capitalize"
          :style="{ backgroundColor: currentData.color.toLowerCase() == 'negro' ? '#252525' : defineTonerColor(currentData.color), borderRadius: '20px', fontSize: '0.65rem' }">
          {{ currentData.color }}</div>
      </q-card-section>
      <q-card-section>
        <q-input clearable dense v-model="currentData.toner" label="Toner" class="q-mb-md" hint="requerido"
          :rules="inputRulesDictionary.name" @update:model-value="validateForm" />
        <q-input clearable dense v-model="currentData.color" label="Color" class="q-mb-md" hint="requerido"
          :rules="inputRulesDictionary.name" @update:model-value="validateForm" />
        <q-input clearable dense v-model="currentData.printer" label="Impresora" class="q-mb-md" hint="requerido"
          :rules="inputRulesDictionary.name" @update:model-value="validateForm" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Guardar" size="0.85rem" color="secondary" dense padding="sm lg" outline
          style="border-radius: 10px; text-transform: capitalize" @click="saveRecord(currentData._id)"
          :disabled="!validateForm()" />
        <q-btn label="Cancelar" size="0.85rem" flat dense padding="sm lg"
          style="border-radius: 10px; text-transform: capitalize" @click="closeModifyDialog(currentData._id)" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <DialogConfirmDelete ref="dialogConfirmDeleteRef" :label="currentData.toner" @deleteConfirm="deleteRecord(currentData._id)" />
</template>

<script>
import { defineComponent, ref, watch } from "vue"
import { useRoute } from 'vue-router'
import { api, serverURL } from "src/boot/axios"
import DialogConfirmDelete from './DialogConfirmDelete.vue'

export default defineComponent({
  name: "TonerChangesTable",
  props: {
    rows: {
      type: Array,
    },
    columns: {
      type: Array,
    },
    loading: {
      type: Boolean,
    }
  },
  components: {
    DialogConfirmDelete
  },
  setup(props) {
    const isMobile = ref(isUsingMobile());

    function isUsingMobile() {
      const validation1 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const validation2 = window.innerWidth < 768;
      const finalValidation = validation1 || validation2;
      return finalValidation;
    }

    window.addEventListener("resize", () => {
      isMobile.value = isUsingMobile();
    })

    const route = useRoute();
    const records = ref(props.rows);

    watch(() => props.rows, (newValue) => {
      if (newValue.length == 0) return
      records.value = newValue;
      records.value.forEach((row, index) => {
        row.index = index + 1;
      })
    })

    const dialogModify = ref(false);
    const dialogDelete = ref(false);
    const inputConfirmDelete = ref(null);
    const currentData = ref({});

    const inputRulesDictionary = ref({
      name: [
        val => !!val || '* Requerido',
        val => val.length < 50 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      username: [
        val => !!val || '* Requerido',
        val => val.length < 50 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      email: [
        val => !!val || '* Requerido',
        val => val.length < 50 || 'Porfavor usa un maximo de 30 caracteres',
        val => emailRegex.test(val) || 'Ingresa un correo electrónico válido'
      ],
      password: [
        val => !!val || '* Requerido',
        val => val.length < 50 || 'Porfavor usa un maximo de 30 caracteres'
      ],
    })

    return {
      isMobile,
      route,
      dialogModify,
      dialogDelete,
      inputConfirmDelete,
      currentData,
      records,
      inputRulesDictionary,
      pagination: ref({
        rowsPerPage: 0
      })
    }
  },
  methods: {
    openModifyDialog(toner) {
      this.dialogModify = true;
      this.currentData = toner
    },
    closeModifyDialog() {
      this.dialogModify = false;
      this.currentData = null;
    },
    saveRecord(id) {
      const recordInfo = this.currentData
      if (this.isCategory) {
        const properties = this.checkBoxProperties
          .map((property) => {
            if (property.value == true) {
              return {
                name: property.label,
                key: property.key,
              };
            }
          })
          .filter((property) => property !== undefined);
        recordInfo.properties = properties;
      }
      recordInfo.updated_at = new Date();
      api
        .patch(`./${this.nameSection}/update/${recordInfo._id}`, recordInfo)
        .then((res) => {
          const data = res.data;
          if (data) {
            this.$q.notify({
              type: "positive",
              message: "Guardado correctamente.",
              timeout: 2000,
            });
            this.dialogModify = false;
            this.currentData = null;
            this.emitEventUpdateNotifications()
          } else {
            this.$q.notify({
              type: "negative",
              message: "Ha ocurrido un error.",
              timeout: 2000,
            });
          }
        })
        .catch((err) => {
          this.$q.notify({
            type: "negative",
            message: "Ha ocurrido un error.",
            timeout: 2000,
          });
        });
    },
    openDeleteDialog(toner) {
      this.$refs.dialogConfirmDeleteRef.openDialog();
      this.currentData = toner;

    },
    closeDeleteDialog(id) {
      this.dialogDelete = false;
      this.currentData = null;
    },
    deleteRecord(id) {
      api
        .post(`./toner-changes/delete/${id}`, {
          printerId: this.currentData.printer_id,
          tonerId: this.currentData.toner_id
        })
        .then((res) => {
          if (res.status === 200) {
            this.$q.notify({
              type: "warning",
              message: "Borrado correctamente.",
              timeout: 2000,
            });
            this.$refs.dialogConfirmDeleteRef.closeDialog();
            this.emitEventUpdateNotifications()
            this.currentData = {};
            this.$emit("reloadData")
          } else {
            this.$q.notify({
              type: "negative",
              message: "Ha ocurrido un error.",
              timeout: 2000,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            type: "negative",
            message: "Ha ocurrido un error.",
            timeout: 2000,
          });
        });
    },
    validateForm() {
      if (this.currentData) {
        const results = []
        Object.keys(this.currentData).map((key) => {
          if (this.inputRulesDictionary[key]) {
            const rules = this.inputRulesDictionary[key]
            for (const rule of rules) {
              const errorMessage = rule(this.currentData[key])
              if (errorMessage !== true) {
                results.push(false)
              } else {
                results.push(true)
              }
            }
          }
        })

        if (results.includes(false)) {
          return false
        }
        else {
          return true
        }
      } else {
        return false
      }
    },
    defineTonerColor(color) {
      if (color.toLowerCase() === "cyan") {
        return "#00acc1"
      }
      if (color.toLowerCase() === "magenta") {
        return "#e91e63"
      }
      if (color.toLowerCase() === "amarillo") {
        return "#fdd835"
      }
      return "#dcdcdc"
    },
    emitEventUpdateNotifications() {
      this.$emit("updateNotifications")
    },
  }
});
</script>