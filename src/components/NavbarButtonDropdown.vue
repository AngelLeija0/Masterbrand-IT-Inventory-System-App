<template>
  <q-btn-dropdown :label="label" :icon="icon" :class="'q-mx-xs q-px-lg ' + (isMobile ? 'full-width' : '')" align="left" size="0.9rem" :style="{
    borderBottom: !isMobile && active ? '3px solid #1565c0' : '',
    color: isMobile && active ? '#1565c0' : '#e0e0e0',
    textTransform: 'capitalize',
    borderRadius: '7px 7px 2px 2px',
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
import { capitalize, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "NavbarButtonDropdown",
  setup() {
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

    const route = useRoute();

    return {
      route,
      isMobile,
    };
  },
  computed: {
    active() {
      return (
        this.route.name === this.toPage ||
        (this.route.name === "asset-details-page" &&
          this.toPage === "assets-page") ||
        this.route.name === "cards-page"
      );
    },
  },
  methods: {
    redirectToPage(page) {
      this.$router.push({ name: page });
    },
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
