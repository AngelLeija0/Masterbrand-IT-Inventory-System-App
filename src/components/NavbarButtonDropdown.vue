<template>
  <q-btn-dropdown :label="label" :icon="icon" class="q-mx-xs q-px-lg" size="0.9rem" :style="{
    borderBottom: active ? '3px solid #1565c0' : '',
    textTransform: 'capitalize'
  }">
    <q-list>
      <q-item clickable v-close-popup @click="redirectToPage('cards-page')">
        <q-item-section>
          <q-item-label>Registro de tarjetas</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { capitalize, defineComponent } from "vue";
import { useRoute } from 'vue-router'

export default defineComponent({
  name: "NavbarButtonDropdown",
  setup() {
    const route = useRoute()

    return {
      route
    }
  },
  computed: {
    active() {
      return this.route.name === this.toPage || (this.route.name === 'asset-details-page' && this.toPage === 'assets-page' || this.route.name === 'cards-page');
    }
  },
  methods: {
    redirectToPage(page) {
      this.$router.push({ name: page })
    }
  },
  props: {
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
});
</script>
