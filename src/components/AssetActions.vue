<template>
  <div class="row q-px-sm q-pt-sm q-pb-none">
    <div class="col-12 flex justify-between">
      <div class="text-h6">Acciones</div>
      <PrimaryButton v-if="isMobile" flat icon="add" class="q-mx-sm" @click="dialogNewAction = true" />
      <PrimaryButton v-else label="Agregar accion" icon="add" class="q-mx-sm" @click="dialogNewAction = true" />
    </div>
    <div class="col-12 q-mt-md">
      <q-table flat bordered :rows="rows" :columns="columns" :loading="loading" loading-label="Cargando" row-key="name"
        table-header-style="font-weight: 100;" class="q-pt-md" no-data-label="No se encontraron datos"
        rows-per-page-label="Cantidad de registros" :rows-per-page-options="[5, 10, 20, 30, 0]" style="height: 64vh;">
        <template v-slot:body-cell-status="props">
          <q-td>
            <q-icon name="circle" :color="defineStatusColor(props.row?.status)" />
            &nbsp;
            {{ props.row?.status }}
          </q-td>
        </template>
        <template v-slot:body-cell-attachments="props">
          <q-td v-if="props.row?.attachments && props.row?.attachments?.length > 0">
            <q-btn label="Ver" icon-right="navigate_next" color="dark" outline size="0.75rem"
              style="border-radius: 10px; text-transform: capitalize;" @click="openAttachmentDialog(props.row.id)" />
          </q-td>
          <q-td class="flex justify-center items-center" v-else>
            N/A
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td style="width: 23%;">
            <q-btn label="Editar" icon-right="edit" color="secondary" outline size="0.75rem" class="q-mx-xs"
              style="border-radius: 10px; text-transform: capitalize" @click="openEditDialog(props.row.id)" />
            <q-btn label="Borrar" icon-right="delete" color="red" outline size="0.75rem" class="q-mx-xs"
              style="border-radius: 10px; text-transform: capitalize" @click="openDeleteDialog(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>

  <q-dialog v-model="dialogNewAction" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="dialogNewAction = false" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-sm" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h5 text-weight-medium">Nueva Accion</div>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-lg">
          <q-title class="text-subtitle2 text-weight-regular">Completa los siguientes campos para agregar una nueva
            accion.</q-title>
        </div>
        <div>
          <q-input v-model="inputNewAction.name" clearable dense label="Nombre" class="q-mb-md" hint="requerido"
            :rules="[(val) => !!val || 'requerido']" />
          <q-input v-model="inputNewAction.description" clearable dense label="Descripción" class="q-mb-md"
            hint="requerido" :rules="[(val) => !!val || 'requerido']" />
          <q-select v-model="inputNewAction.status" :options="actionOptions" clearable dense label="Estado"
            class="q-mb-md" hint="requerido" :rules="[(val) => !!val || 'requerido']" />
          <q-file v-model="inputNewAction.attachments" dense label="Imagenes o Videos" use-chips multiple class="q-mb-md"
            accept=".jpg, image/*, .mp4, .mvk, video/*" hint="opcional" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Agregar" size="0.85rem" color="primary" dense outline padding="sm lg" @click="addAction"
          style="border-radius: 10px; text-transform: capitalize" />
        <q-btn label="Cancelar" size="0.85rem" flat dense outline @click="dialogNewAction = false" padding="sm lg"
          style="border-radius: 10px; text-transform: capitalize" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogDeleteAction" persistent>
    <q-card class="q-pa-md" style="width: 500px; max-width: 80vw;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round v-close-popup class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h6">Borrar {{ currentAction.name }}</div>
      </q-card-section>
      <q-card-section class="q-pt-md q-pb-sm flex justify-start">
        <div class="text-center text-subtitle1 text-weight-regular">¿Estas seguro de borrarlo?
        </div>
        <div class="text-subtitle2 text-weight-regular q-pt-sm">Ten en cuenta que una vez borrado no sera posible
          recuperarlo.</div>
        <div class="text-subtitle2 text-weight-regular q-pt-md">Escribe <span class="text-red text-weight-medium">delete
            {{ currentAction.name }}</span> a continuación para confirmar.</div>
        <div class="full-width q-pt-sm q-pb-md">
          <q-input v-model="inputConfirmDelete" outlined dense class="full-width" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Confirmar" size="0.85rem" color="red" dense padding="sm lg" outline
          style="border-radius: 10px; text-transform: capitalize;"
          :disabled="inputConfirmDelete !== `delete ${currentAction.name}`" @click="deleteAction(currentAction.id)" />
        <q-btn label="Cancelar" size="0.85rem" flat dense padding="sm lg"
          style="border-radius: 10px; text-transform: capitalize;" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogAttachmentsAction" persistent>
    <q-card class="q-pa-md" style="width: 600px; max-width: 80vw;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeAttachmentDialog()" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h6">{{ currentAction.name }}</div>
      </q-card-section>
      <q-card-section class="q-pt-lg q-pb-sm">
        <div class="q-pb-lg text-subtitle2 text-weight-regular">Images o videos adjuntados en la accion {{
          currentAction.name }}.</div>
        <div class="flex justify-center">
          <div class="flex justify-center items-center">
            <div v-if="defineFileType(currentAction.attachments[currentAttachment]) === 'image'">
              <q-img :src="attachmentsURL + '/uploads/attachments/' + currentAction.attachments[currentAttachment]"
                spinner-color="primary" style="width: 536px; max-width: 70vw;" />
            </div>
            <div v-else-if="defineFileType(currentAction.attachments[currentAttachment]) === 'video'">
              <q-video :src="attachmentsURL + '/uploads/attachments/' + currentAction.attachments[currentAttachment]"
                style="width: 536px; max-width: 70vw;" />
            </div>
            <div v-else>
              <div class="text-red full-width">Error al mostrar el contenido</div>
            </div>
            <div class="q-py-sm full-width text-center">{{ defineFileName(currentAction.attachments[currentAttachment]) }}
            </div>
          </div>
          <div class="full-width q-pt-sm flex justify-center items-center">
            <q-btn flat round size="0.95rem" icon="navigate_before"
              @click="currentAttachment = Number(currentAttachment) - 1"
              :disabled="!currentAction.attachments[currentAttachment - 1]" />
            <q-btn flat round size="0.95rem" icon="navigate_next"
              @click="currentAttachment = Number(currentAttachment) + 1"
              :disabled="!currentAction.attachments[currentAttachment + 1]" />
          </div>
          <div class="full-width text-center">{{ currentAttachment + 1 }} / {{ currentAction.attachments.length }}</div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogEditAction" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeEditDialog" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-sm" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h5 text-weight-medium">Editar {{ currentAction.name }}</div>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-lg">
          <q-title class="text-subtitle2 text-weight-regular">Modifica los el valor de los campos que necesites
            actualizar.</q-title>
        </div>
        <div>
          <q-input v-model="currentAction.name" clearable dense label="Nombre" class="q-mb-md" hint="requerido"
            :rules="[(val) => !!val || 'requerido']" />
          <q-input v-model="currentAction.description" clearable dense label="Descripción" class="q-mb-md"
            hint="requerido" :rules="[(val) => !!val || 'requerido']" />
          <q-select v-model="currentAction.status" :options="actionOptions" clearable dense label="Estado" class="q-mb-md"
            hint="requerido" :rules="[(val) => !!val || 'requerido']" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Guardar" size="0.85rem" color="secondary" dense outline padding="sm lg" @click="saveAction"
          style="border-radius: 10px; text-transform: capitalize" />
        <q-btn label="Cancelar" size="0.85rem" flat dense outline @click="closeEditDialog" padding="sm lg"
          style="border-radius: 10px; text-transform: capitalize" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from "vue"
import { useRoute } from 'vue-router'
import { api, serverURL } from "src/boot/axios"

import PrimaryButton from 'src/components/PrimaryButton.vue'

export default defineComponent({
  name: "AssetActions",
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
    PrimaryButton
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

    const attachmentsURL = ref(serverURL)

    const router = useRoute()

    const idAsset = ref(router.params.id)

    const records = ref(props.rows)

    records.value.forEach((row, index) => {
      row.index = index + 1
    })

    watch(() => props.rows, (newValue) => {
      records.value = newValue
      records.value.forEach((row, index) => {
        row.index = index + 1
      })
    })

    const dialogNewAction = ref(false)
    const inputNewAction = ref({})
    const actionOptions = ["Completado", "Sin completar", "En proceso", "Otro"]

    const dialogDeleteAction = ref(false)
    const inputConfirmDelete = ref(null)

    const currentAction = ref({})
    const dialogAttachmentsAction = ref()
    const currentAttachment = ref(0)

    const dialogEditAction = ref(false)

    return {
      isMobile,
      router,
      attachmentsURL,
      idAsset,
      records,
      dialogNewAction,
      inputNewAction,
      actionOptions,
      dialogDeleteAction,
      currentAction,
      inputConfirmDelete,
      currentAttachment,
      dialogAttachmentsAction,
      dialogEditAction,
      pagination: ref({
        rowsPerPage: 0
      })
    }
  },
  methods: {
    defineStatusColor(status) {
      if (status === 'Completado') return 'green'
      if (status === 'Otro' || status === 'En proceso') return 'orange'
      if (status === 'Sin completar') return 'red'
    },
    addAction() {
      const actionData = new FormData();

      Object.keys(this.inputNewAction).map((key) => {
        actionData.append(key, this.inputNewAction[key]);
      })

      if (this.inputNewAction?.attachments) {
        const assetImages = this.inputNewAction.attachments;
        assetImages.forEach((attachments, index) => {
          actionData.append("attachments", attachments);
        });
      }

      api
        .patch(`./assets/update/create/action/${this.idAsset}`, actionData)
        .then((res) => {
          const data = res.data
          if (data) {
            this.dialogNewAction = false
            this.inputNewAction = {}
            this.$emit("update-info")
            this.$q.notify({
              type: 'positive',
              message: 'Modificado correctamente.',
              timeout: 2000,
            })
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
    },
    openDeleteDialog(idAction) {
      this.dialogDeleteAction = true
      this.currentAction = this.records.find((action) => action.id === idAction)
    },
    closeDeleteDialog() {
      this.dialogDeleteAction = false
      this.currentAction = null
    },
    openAttachmentDialog(idAction) {
      this.dialogAttachmentsAction = true
      this.currentAction = this.records.find((action) => action.id === idAction)
    },
    closeAttachmentDialog() {
      this.dialogAttachmentsAction = false
      this.currentAction = null
    },
    deleteAction(idAction) {
      api
        .patch(`./assets/update/delete/action/${this.idAsset}`, { idAction })
        .then((res) => {
          const data = res.data
          if (data) {
            this.dialogDeleteAction = false
            this.inputConfirmDelete = null
            this.currentAction = null
            this.$emit("update-info")
            this.$q.notify({
              type: 'positive',
              message: 'Borrado correctamente.',
              timeout: 2000,
            })
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
    },
    defineFileName(fileName) {
      const formattedName = fileName.replace(/\.[^.]+$/, "");
      return formattedName
    },
    defineFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase()

      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff']
      const videoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'wmv']

      if (imageExtensions.includes(extension)) {
        return 'image'
      }
      if (videoExtensions.includes(extension)) {
        return 'video'
      }
      return 'error'
    },
    openEditDialog(idAction) {
      this.dialogEditAction = true
      this.currentAction = this.records.find((action) => action.id === idAction)
    },
    closeEditDialog() {
      this.dialogEditAction = false
      this.currentAction = null
    },
    saveAction() {
      api
        .patch(`./assets/update/update/action/${this.idAsset}`, this.currentAction)
        .then((res) => {
          const data = res.data
          if (data) {
            this.dialogEditAction = false
            this.currentAction = null
            this.$emit("update-info")
            this.$q.notify({
              type: 'positive',
              message: 'Guardado correctamente.',
              timeout: 2000,
            })
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
});
</script>
