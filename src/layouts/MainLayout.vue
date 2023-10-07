<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-10">
      <q-toolbar class="q-ma-sm q-ml-md">
        <img src="../assets/masterbrand-logo.webp" style="height: 30px;">
      </q-toolbar>
      <q-toolbar inset :style="{ justifyContent: isMobile ? 'end' : 'center', padding: 0 }">
        <div v-if="isMobile">
          <q-btn class="q-mx-xs" icon="menu" flat rounded @click="menuState = true" />
          <div v-if="menuState" class="menu-bar">
            <div class="menu-div">
              <div class="flex justify-end">
                <q-btn icon="close" size="14px" round @click="menuState = false" />
              </div>
              <q-list class="q-pa-sm">
                <NavbarButton label="Inicio" icon="home" toPage="home-page" />
              </q-list>
              <q-list class="q-pa-sm">
                <NavbarButton label="Inventario" icon="inventory" toPage="assets-page" />
              </q-list>
              <q-list class="q-pa-sm">
                <NavbarButton label="Categorias" icon="bookmark" toPage="categories-page" />
              </q-list>
              <q-list class="q-pa-sm">
                <NavbarButton label="Ubicaciones" icon="place" toPage="locations-page" />
              </q-list>
              <q-list class="q-pa-sm">
                <NavbarButtonDropdown label="Herramientas" icon="hardware" flat />
              </q-list>
            </div>
          </div>
        </div>
        <div v-else>
          <q-btn-group>
            <NavbarButton label="Inicio" toPage="home-page" />
            <NavbarButton label="Inventario" toPage="assets-page" />
            <NavbarButton label="Categorias" toPage="categories-page" />
            <NavbarButton label="Ubicaciones" toPage="locations-page" />
            <NavbarButtonDropdown label="Herramientas" />
          </q-btn-group>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-grey-10" style="height: 100vh;">
      <router-view class="bg-white q-ml-md q-mr-md q-mb-md" style="min-height: 83vh; border-radius: 15px;" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import NavbarButton from 'src/components/NavbarButton.vue'
import NavbarButtonDropdown from 'src/components/NavbarButtonDropdown.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    NavbarButton,
    NavbarButtonDropdown,
  },
  setup() {
    const isMobile = ref(isUsingMobile());

    const menuState = ref(false)

    const route = useRoute()

    function isUsingMobile() {
      const validation1 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const validation2 = window.innerWidth < 768
      const finalValidation = validation1 || validation2;
      return finalValidation;
    }

    window.addEventListener("resize", () => {
      isMobile.value = isUsingMobile()
    })

    watch(() => route.name, (newValue) => {
      menuState.value = false
    })

    return {
      isMobile,
      menuState,
    }
  }
})
</script>

<style>
body {
  overflow: hidden;
}

.q-dialog__backdrop {
  backdrop-filter: blur(1px);
}

.menu-bar {
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(1px);
  height: 100vh;
  width: 100vw;
}

.menu-div {
  height: 100vh;
  width: 65vw;
  background: #212121;
  backdrop-filter: blur(0px);
}
</style>
