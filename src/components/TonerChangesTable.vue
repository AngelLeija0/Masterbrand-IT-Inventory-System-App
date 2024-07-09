<template>
  <q-table flat bordered :rows="rows" :columns="columns" :loading="loading" loading-label="Cargando" row-key="name"
    table-header-style="font-weight: 100;" class="q-pt-md" no-data-label="No se encontraron datos"
    rows-per-page-label="Cantidad de registros" :style="{ height: isMobile ? '68vh' : '70vh' }">
    <template v-slot:body-cell-actions="props">
      <q-td style="width: 30%;">
        <q-btn label="Editar" icon-right="edit" color="secondary" outline size="0.75rem" class="q-mx-xs"
          style="border-radius: 10px; text-transform: capitalize" @click="openModifyDialog(props.row._id)" />
        <q-btn label="Borrar" icon-right="delete" color="red" outline size="0.75rem" class="q-mx-xs"
          style="border-radius: 10px; text-transform: capitalize" @click="openDeleteDialog(props.row._id)" />
      </q-td>
    </template>
  </q-table>
  <q-dialog v-model="dialogModify" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeModifyDialog(currentData._id)" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-sm" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h6">{{ pageLabel }}</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="currentData.name" label="Nombre" @change="validateForm" :rules="inputRulesDictionary.name" />
        <div class="q-pt-lg q-pb-md">Propiedades</div>
        <div class="row flex justify-between">
          <div class="q-ma-sm col-md-5 col-11" v-for="(property, i) in checkBoxProperties" :key="i">
            <q-checkbox v-model="property.value" :label="property.label" dense />
          </div>
        </div>
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
</template>

<script>
import { defineComponent, ref, watch } from "vue"
import { useRoute } from 'vue-router'

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

    watch(() => props.rows, (newValue) => {
      if (newValue.length == 0) return
      records.value = newValue
      records.value.forEach((row, index) => {
        row.index = index + 1
      })
    })

    const dialogModify = ref(false);
    const dialogDelete = ref(false);
    const inputConfirmDelete = ref(null);
    const currentData = ref(null);

    return {
      isMobile,
      route,
      dialogModify,
      dialogDelete,
      inputConfirmDelete,
      currentData,
      records,
      pagination: ref({
        rowsPerPage: 0
      })
    }
  },
  methods: {
    openModifyDialog(id) {
      this.dialogModify = true;
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
    openDeleteDialog(id) {
      this.inputConfirmDelete = null;
      this.dialogDelete = true;
      console.log(id)
      console.log(this.records)
      const recordInfo = this.records.find((tonerChange) => tonerChange._id === id);
      this.currentData = recordInfo;
    },
    closeDeleteDialog(id) {
      this.dialogDelete = false;
      this.currentData = null;
    },
    deleteRecord(id) {
      api
        .delete(`./${this.nameSection}/delete/${id}`)
        .then((res) => {
          if (res.status === 200) {
            this.$q.notify({
              type: "warning",
              message: "Borrado correctamente.",
              timeout: 2000,
            });
            this.dialogDelete = false;
            this.currentData = null;
            this.$emit("elementDeleted");
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
  }
});
</script>