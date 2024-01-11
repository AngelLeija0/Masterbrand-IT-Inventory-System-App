<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeDialog" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-sm" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h5 text-weight-medium">Nuevo Producto</div>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-lg">
          <q-title class="text-subtitle2 text-weight-regular">Completa los siguientes campos. En caso de que no aplique
            puede
            dejar el campo en blanco.</q-title>
        </div>
        <div class="q-pa-md bg-grey-12 rounded-borders">
          <div class="q-pb-xs">Selecciona una categoria para comenzar</div>
          <q-select clearable dense v-model="inputInfo.category" :options="categoriesOptions" label="Categoria"
            class="q-mb-md" />
        </div>
        <div class="q-pa-md" v-if="inputInfo.category">
          <q-file dense v-model="inputInfo.images" label="Imagenes" use-chips multiple class="q-mb-md"
            accept=".jpg, image/*" hint="opcional" />
          <div v-for="(property, i) in propertiesOptions" :key="i">
            <div v-if="property.key.includes('date')">
              <q-input clearable dense v-model="inputInfo[property.key]" :label="property.name" type="date"
                :locale="{ format: 'dd/MM/yyyy', language: 'es' }" class="q-mb-md" hint="requerido"
                :rules="inputRulesDictionary[property.key]" @change="validateForm()" />
            </div>
            <div v-else-if="property.key === 'location'">
              <q-select clearable dense v-model="inputInfo[property.key]" :label="property.name" class="q-mb-md"
                :options="locationOptions" hint="requerido" :rules="inputRulesDictionary[property.key]"
                @change="validateForm()" />
            </div>
            <div v-else-if="property.key === 'network_status'">
              <q-select clearable dense v-model="inputInfo[property.key]" :label="property.name" class="q-mb-md"
                :options="['En red', 'En local']" hint="requerido" :rules="inputRulesDictionary[property.key]"
                @change="validateForm()" />
            </div>
            <div v-else>
              <q-input clearable dense v-model="inputInfo[property.key]" :label="property.name" class="q-mb-md"
                hint="requerido"
                :rules="inputRulesDictionary[property.key] ? inputRulesDictionary[property.key] : inputGeneralRules"
                @change="validateForm()" />
            </div>
          </div>
          <q-select clearable dense v-model="inputInfo.status.name" :options="statusOptions" label="Estado"
            class="q-mb-md" hint="requerido" :rules="inputRulesDictionary.name" />
          <q-input clearable dense v-model="inputInfo.status.description" label="Descripción del estado" class="q-mb-md"
            hint="requerido" :rules="inputRulesDictionary.description" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Agregar" size="0.85rem" color="primary" dense outline padding="sm lg" @click="addAsset"
          style="border-radius: 10px; text-transform: capitalize" :disable="!validateForm()" />
        <q-btn label="Cancelar" size="0.85rem" flat dense outline @click="closeDialog" padding="sm lg"
          style="border-radius: 10px; text-transform: capitalize" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

export default defineComponent({
  name: "DialogNewAsset",
  setup() {

    const inputRulesDictionary = ref({
      name: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      description: [
        val => !!val || '* Requerido',
        val => val.length < 80 || 'Porfavor usa un maximo de 80 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      manufacturer: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      model: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      serial_number: [
        val => !!val || '* Requerido',
        val => val.length < 20 || 'Porfavor usa un maximo de 20 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      purchase_from: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 20 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      purchase_date: [
        val => !!val || '* Requerido',
        val => val.length < 20 || 'Porfavor usa un maximo de 20 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      cost: [
        val => !!val || '* Requerido',
        val => val.length < 20 || 'Porfavor usa un maximo de 20 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;'<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      warranty_info: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      warranty_expiration_date: [
        val => !!val || '* Requerido',
        val => val.length < 20 || 'Porfavor usa un maximo de 20 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      current_employee: [
        val => !!val || '* Requerido',
        val => val.length < 50 || 'Porfavor usa un maximo de 50 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      operating_system: [
        val => !!val || '* Requerido',
        val => val.length < 20 || 'Porfavor usa un maximo de 20 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      ram: [
        val => !!val || '* Requerido',
        val => val.length < 20 || 'Porfavor usa un maximo de 20 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      status: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      category: [
        val => !!val || '* Requerido',
        val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ],
      ip_address: [
        val => val.length < 30 || 'Porfavor usa un maximo de 20 caracteres',
        val => !/[!@#$%^&*()_+={}|:\;',<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
      ]
    });

    const inputGeneralRules = ref([
      val => !!val || '* Requerido',
      val => val.length < 30 || 'Porfavor usa un maximo de 30 caracteres',
      val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val) || 'No se permiten caracteres especiales'
    ])

    const $q = useQuasar();
    const dialogState = ref(false)

    const inputInfo = ref({
      status: {},
    })
    const categoriesInfo = ref([])
    const categoriesOptions = ref([])
    const propertiesOptions = ref([])
    const statusOptions = ref([
      "Activo",
      "Inactivo",
      "Roto",
      "Con stock",
      "Bajo stock",
      "Sin stock",
    ])

    watch(
      () => inputInfo.value.category,
      (newValue) => {
        if (newValue != null && newValue != undefined && newValue != {}) {
          const category = categoriesInfo.value.filter(
            (category) => category.name === newValue
          );
          propertiesOptions.value = category[0]?.properties;
        }
      }
    );

    function getAllCategories() {
      api
        .get("./categories")
        .then((res) => {
          const data = res.data;
          if (data.length > 0) {
            categoriesInfo.value = data;
            categoriesOptions.value = data.map((category) => {
              return category.name;
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const locationOptions = ref()

    function getAllLocations() {
      api
        .get("./locations")
        .then((res) => {
          const data = res.data;
          if (data.length > 0) {
            const formattedOptions = data.map((value) => {
              return value.name
            })
            locationOptions.value = formattedOptions
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return {
      $q,
      dialogState,
      categoriesOptions,
      propertiesOptions,
      statusOptions,
      inputInfo,
      getAllCategories,
      inputRulesDictionary,
      locationOptions,
      getAllLocations,
      inputGeneralRules,
    };
  },
  methods: {
    openDialog() {
      this.dialogState = true
      this.getAllCategories()
      this.getAllLocations()
    },
    closeDialog() {
      this.inputInfo = {
        status: {}
      }
      this.dialogState = false;
    },
    addAsset() {
      const assetData = new FormData();

      Object.keys(this.inputInfo).map((key) => {
        if (key !== "images" && key !== "status") {
          assetData.append(key, this.inputInfo[key]);
        }
      });

      assetData.append("statusName", this.inputInfo.status.name);
      assetData.append("statusDescription", this.inputInfo.status.description);

      if (this.inputInfo?.images) {
        const assetImages = this.inputInfo.images;
        assetImages.forEach((image, index) => {
          assetData.append("images", image);
        });
      }

      api
        .post("./assets/create", assetData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data) {
            this.dialogState = false;
            this.inputInfo = {
              status: {}
            }
            this.$emit("reloadData");
            this.$q.notify({
              type: "positive",
              message: "Agregado correctamente.",
              timeout: 2000,
            });
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
      if (this.propertiesOptions.length == 0) {
        return false
      }

      const results = []
      if (this.inputInfo.status?.name && this.inputInfo.status?.description) {
        const rules = this.inputRulesDictionary.name

        for (const rule of rules) {
          const nameErrorMessage = rule(this.inputInfo.status.name)
          const descriptionErrorMessage = rule(this.inputInfo.status.description)

          if (nameErrorMessage !== true && descriptionErrorMessage !== true) {
            results.push(false)
          } else {
            results.push(true)
          }
        }
      } else {
        return false
      }

      Object.keys(this.propertiesOptions).map((property) => {
        const rules = this.inputRulesDictionary[this.propertiesOptions?.[property]?.key] ? this.inputRulesDictionary[this.propertiesOptions?.[property]?.key] : this.inputGeneralRules

        if (this.inputInfo[this.propertiesOptions?.[property]?.key] === undefined) {
          return results.push(false)
        }

        for (const rule of rules) {
          const errorMessage = rule(this.inputInfo[this.propertiesOptions?.[property]?.key])
          if (errorMessage !== true) {
            results.push(false)
          } else {
            results.push(true)
          }
        }
      })

      if (results.includes(false)) {
        return false
      }
      else {
        return true
      }
    }
  },
});
</script>
