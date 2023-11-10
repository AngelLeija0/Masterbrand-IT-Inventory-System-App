<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card class="q-pa-md" style="width: 500px; max-width: 80vw;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round v-close-popup class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h6">Borrar {{ label }}</div>
      </q-card-section>
      <q-card-section class="q-pt-md q-pb-sm flex justify-start">
        <div class="text-center text-subtitle1 text-weight-regular">¿Estas seguro de borrarlo?
        </div>
        <div class="text-subtitle2 text-weight-regular q-pt-sm">Ten en cuenta que una vez borrado no sera posible
          recuperarlo.</div>
        <div class="text-subtitle2 text-weight-regular q-pt-md">Escribe <span class="text-red text-weight-medium">delete
            {{ label }}</span> a continuación para confirmar.</div>
        <div class="full-width q-pt-sm q-pb-md">
          <q-input v-model="inputConfirmDelete" outlined dense class="full-width" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Confirmar" size="0.85rem" color="red" dense padding="sm lg" outline
          style="border-radius: 10px; text-transform: capitalize;"
          :disabled="inputConfirmDelete !== `delete ${label}`" @click="handleDeleteButton()" />
        <q-btn label="Cancelar" size="0.85rem" flat dense padding="sm lg"
          style="border-radius: 10px; text-transform: capitalize;" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "DialogConfirmDelete",
  props: {
    label: {
      type: String,
    },
  },
  setup() {
    const dialogState = ref(false)
    const inputConfirmDelete = ref("")

    return {
      dialogState,
      inputConfirmDelete,
    }
  },
  methods: {
    openDialog() {
      this.dialogState = true
    },
    closeDialog() {
      this.inputConfirmDelete = "";
      this.dialogState = false;
    },
    handleDeleteButton() {
      this.$emit("deleteConfirm", true)
    }
  },
});
</script>
