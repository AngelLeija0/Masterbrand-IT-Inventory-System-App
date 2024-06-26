<template>
  <q-table flat bordered :rows="rows" :columns="columns" :loading="loading" loading-label="Cargando" row-key="name"
    table-header-style="font-weight: 100;" class="q-pt-md" no-data-label="No se encontraron datos"
    rows-per-page-label="Cantidad de registros" :rows-per-page-options="[8, 10, 20, 30, 0]"
    :style="{ height: isMobile ? '68vh' : '63vh' }">
    <template v-slot:body-cell-properties="props">
      <q-td style="max-width: 700px; overflow-x: hidden;">
        {{ formatProperties(props.row?.properties) }}
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td style="width: 30%;">
        <q-btn v-if="section == 'administrators'" label="Cambiar contraseña" icon-right="lock_open" outline
          size="0.75rem" class="q-mx-xs" style="border-radius: 10px; text-transform: capitalize"
          @click="openModifyDialog(props.row._id)" />
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
      <q-card-section v-if="pageLabel === 'Categorias'">
        <q-input v-model="currentData.name" label="Nombre" @change="validateForm" :rules="inputRulesDictionary.name" />
        <div class="q-pt-lg q-pb-md">Propiedades</div>
        <div class="row flex justify-between">
          <div class="q-ma-sm col-md-5 col-11" v-for="(property, i) in checkBoxProperties" :key="i">
            <q-checkbox v-model="property.value" :label="property.label" dense />
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="pageLabel === 'Ubicaciones'">
        <q-input v-model="currentData.name" label="Nombre" />
      </q-card-section>
      <q-card-section v-if="pageLabel === 'Administradores'">
        <q-input clearable dense v-model="currentData.username" label="Nombre" class="q-mb-md" hint="requerido"
          :rules="inputRulesDictionary.username" @update:model-value="validateForm" />
        <q-input clearable dense v-model="currentData.email" label="Correo electronico" type="email" class="q-mb-md"
          hint="requerido" :rules="inputRulesDictionary.email" @update:model-value="validateForm" />
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

  <q-dialog v-model="dialogDelete" persistent>
    <q-card class="q-pa-md" style="width: 500px; max-width: 80vw">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeDeleteDialog(currentData._id)" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h6">Borrar {{ pageLabel }}</div>
      </q-card-section>
      <q-card-section class="q-pt-md q-pb-sm flex justify-start">
        <div class="text-center text-subtitle1 text-weight-regular">
          ¿Estas seguro de borrar este registro?
        </div>
        <div class="text-subtitle2 text-weight-regular q-pt-sm">
          Ten en cuenta que una vez borrado no sera posible recuperarlo.
        </div>
        <div class="text-subtitle2 text-weight-regular q-pt-md">
          Escribe
          <span class="text-red text-weight-medium">delete {{ currentData.name ? currentData.name : currentData.username
    ?
    currentData.username : 'Error' }}</span>
          a continuación para confirmar.
        </div>
        <div class="full-width q-pt-sm q-pb-md">
          <q-input v-model="inputConfirmDelete" outlined dense class="full-width" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Confirmar" size="0.85rem" color="red" dense padding="sm lg" outline
          style="border-radius: 10px; text-transform: capitalize"
          :disabled="inputConfirmDelete !== `delete ${currentData.name ? currentData.name : currentData.username ? currentData.username : 'Error'}`"
          @click="deleteRecord(currentData._id)" />
        <q-btn label="Cancelar" size="0.85rem" flat dense padding="sm lg"
          style="border-radius: 10px; text-transform: capitalize" @click="closeDeleteDialog(currentData._id)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useUserStore } from "../stores/user-store"

export default defineComponent({
  name: "DetailsTable",
  props: {
    label: {
      type: String,
    },
    section: {
      type: String,
    },
    rows: {
      type: Array,
    },
    columns: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },

  setup(props) {
    const isMobile = ref(isUsingMobile());

    function isUsingMobile() {
      const validation1 =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const validation2 = window.innerWidth < 768;
      const finalValidation = validation1 || validation2;
      return finalValidation;
    }

    window.addEventListener("resize", () => {
      isMobile.value = isUsingMobile();
    });

    const userStore = useUserStore()

    const $q = useQuasar()
    const route = useRoute()

    const pageLabel = ref(props.label)
    const nameSection = ref(props.section)

    const records = ref(props.rows)

    console.log(records.value)

    watch(
      () => props.rows,
      (newValue) => {
        records.value = newValue;
        records.value.forEach((row, index) => {
          row.index = index + 1;
        });
      }
    );

    const isCategory = ref(
      props?.columns[2]?.name === "properties" ? true : false
    );

    const dialogModify = ref(false);
    const dialogDelete = ref(false);
    const inputConfirmDelete = ref(null);
    const currentData = ref(null);

    const checkBoxProperties = ref([
      {
        label: "Descripción",
        key: "description",
        value: false,
      },
      {
        label: "Fabricante",
        key: "manufacturer",
        value: false,
      },
      {
        label: "Modelo",
        key: "model",
        value: false,
      },
      {
        label: "Numero serial",
        key: "serial_number",
        value: false,
      },
      {
        label: "Lugar de compra",
        key: "purchase_from",
        value: false,
      },
      {
        label: "Fecha de compra",
        key: "purchase_date",
        value: false,
      },
      {
        label: "Costo",
        key: "cost",
        value: false,
      },
      {
        label: "Garantia",
        key: "warranty_info",
        value: false,
      },
      {
        label: "Fecha de expiracion de garantia",
        key: "warranty_expiration_date",
        value: false,
      },
      {
        label: "Ubicacion",
        key: "location",
        value: false,
      },
      {
        label: "Ubicacion (informacion extra)",
        key: "location_extra_info",
        value: false,
      },
      {
        label: "Empleado",
        key: "current_employee",
        value: false,
      },
      {
        label: "S/O",
        key: "operating_system",
        value: false,
      },
      {
        label: "Direccion IP",
        key: "ip_address",
        value: false,
      },
      {
        label: "Memoria RAM",
        key: "ram",
        value: false,
      },
      {
        label: "Estado de red",
        key: "network_status",
        value: false,
      },
      {
        label: "Cantidad",
        key: "quantity",
        value: false,
      },
      {
        label: "Ultima cantidad de salida",
        key: "quantity_last_out",
        value: false,
      },
      {
        label: "Fecha de ultima cantidad de salida",
        key: "date_quantity_last_out",
        value: false,
      },
      {
        label: "Cantidad de ultimo restock",
        key: "quantity_last_restock",
        value: false,
      },
      {
        label: "Fecha de ultimo restock",
        key: "date_last_restock",
        value: false,
      },
    ])

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const inputRulesDictionary = ref({
      name: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
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
      userStore,
      $q,
      isMobile,
      route,
      nameSection,
      pageLabel,
      records,
      dialogModify,
      dialogDelete,
      currentData,
      checkBoxProperties,
      isCategory,
      inputConfirmDelete,
      inputRulesDictionary,
      pagination: ref({
        rowsPerPage: 0,
      }),
    };
  },
  methods: {
    formatProperties(properties) {
      let propertiesString = ""
      properties.map((property, index) => {
        if (index === (properties.length - 1)) {
          propertiesString += property.name
        }
        propertiesString += property.name + ", "
      })
      return propertiesString
    },
    redirectToAsset(idAsset) {
      this.$router.push({ path: `inventario/${idAsset}` });
    },
    openModifyDialog(id) {
      this.dialogModify = true;
      const recordInfo = this.records.find((record) => record._id === id)
      console.log(recordInfo)
      this.currentData = recordInfo
      if (this.isCategory) {
        if (recordInfo.properties) {
          const properties = recordInfo.properties;
          this.checkBoxProperties.map((checkBoxProperty, i) => {
            const found = properties.some(
              (property) => property.key === checkBoxProperty.key
            );
            this.checkBoxProperties[i].value = found;
          });
        }
      }
    },
    closeModifyDialog() {
      this.dialogModify = false;
      this.currentData = null;
      this.$emit("elementDeleted");
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
      const recordInfo = this.records.find((category) => category._id === id);
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
    }
  },
});
</script>
