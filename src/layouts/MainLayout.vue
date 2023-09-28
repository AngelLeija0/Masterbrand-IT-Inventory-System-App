<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-10">
      <q-toolbar class="q-ma-sm q-ml-md">
        <img src="../assets/masterbrand-logo.webp" style="height: 30px;">
      </q-toolbar>

      <q-toolbar inset class="justify-center">
        <q-btn-group>
          <NavbarButton
          label="Inicio"
          toPage="home-page"
          />
          <NavbarButton
          label="Inventario"
          toPage="assets-page"
          />
          <NavbarButton
          label="Ubicaciones"
          toPage="locations-page"
          />
          <NavbarButton
          label="Categorias"
          toPage="categories-page"
          />
        </q-btn-group>
      </q-toolbar>

    </q-header>
    <q-page-container class="bg-grey-10" style="height: 100vh;">
      <router-view class="bg-white q-ml-md q-mr-md q-mb-md" style="min-height: 83vh; border-radius: 15px;" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import NavbarButton from 'src/components/NavbarButton.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    NavbarButton
  },
})
</script>

<style>
body {
  overflow: hidden;
}
</style>
