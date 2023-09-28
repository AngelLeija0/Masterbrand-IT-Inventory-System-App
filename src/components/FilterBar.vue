<template>
  <div class="bg-grey-2 flex justify-between q-pa-sm">
    <div class="flex">
      <q-input dense outlined label="Buscador" style="width: 25vw;">
        <template v-slot:append>
          <q-icon name="search" color="black" />
        </template>
      </q-input>
      <q-btn class="q-mx-sm" flat size="14px" icon="qr_code_scanner"/>
    </div>
    <q-btn-group flat>
      <q-btn-dropdown size="14px" label="Filtros" :text-color="isFiltering ? 'primary' : ''" :icon="isFiltering ? 'filter_alt' : 'filter_list'" flat rounded style="text-transform: capitalize;" content-style="height: 400px;">
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Filtros</div>
            <q-input class="q-pb-md" dense borderless label="Buscar filtros">
              <template v-slot:append>
                <q-icon name="search" color="black" />
              </template>
            </q-input>
            <div class="q-pb-xs">Caracteristicas</div>
            <q-checkbox v-model="checkBoxCategory" @click="updateFiltering" size="xs" label="Categoria" />
            <q-checkbox v-model="checkBoxCategory" size="xs" label="Descripcion" />
            <q-checkbox v-model="checkBoxCategory" size="xs" label="Fabricante" />
            <q-checkbox v-model="checkBoxCategory" size="xs" label="Modelo" />
            <q-checkbox v-model="checkBoxCategory" size="xs" label="Numero serial" />
            <q-checkbox v-model="checkBoxCategory" size="xs" label="Lugar de compra" />
            <q-checkbox v-model="checkBoxCategory" size="xs" label="Fecha de compra" />
            <q-checkbox v-model="checkBoxCategory" size="xs" label="Costo" />
            <q-checkbox v-model="checkBoxCategory" size="xs" label="IP address" />
            <q-checkbox v-model="checkBoxLocation" size="xs" label="Ubicacion" />

            <div class="q-pt-md q-pb-xs">Estado</div>
            <q-checkbox v-model="checkBoxLocation" size="xs" label="Activo" />
            <q-checkbox v-model="checkBoxLocation" size="xs" label="Inactivo" />
            <q-checkbox v-model="checkBoxLocation" size="xs" label="Roto" />
          </div>
        </div>
      </q-btn-dropdown>
      <q-btn-dropdown size="14px" label="Vista" icon="tune" flat rounded style="text-transform: capitalize">
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Vista</div>
            <div class="flex">
              <div class="full-width q-pb-sm">Detalles</div>
              <q-checkbox v-model="checkBoxViewDetails" size="xs"/>
              <q-icon name="density_small" size="50px"/>
            </div>
            <div class="flex q-pt-md">
              <div class="full-width">Contenido</div>
              <q-checkbox v-model="checkBoxViewContent" size="xs"/>
              <q-icon name="view_list" size="50px"/>
            </div>
          </div>
        </div>
      </q-btn-dropdown>
    </q-btn-group>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "FilterBar",
  setup() {

    const isFiltering = ref(false)

    const checkBoxCategory = ref(false)
    const checkBoxLocation = ref(false)

    return {
      isFiltering,
      checkBoxCategory,
      checkBoxLocation
    }
  },
  methods: {
    updateFiltering () {
      if (this.checkBoxCategory || this.checkBoxCategory) {
        this.isFiltering = true
      } else {
        this.isFiltering = false
      }
    }
  }
});
</script>
