<template>
  <q-page>
    <q-section class="q-px-md q-pt-lg flex">
      <div class="flex justify-center items-center">
        <PageTitle :label="'Bienvenido ' + userName" />
        <q-icon name="light_mode" size="36px" class="q-mx-sm" style="color: #ffbf3b;" />
      </div>
    </q-section>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useUserStore } from 'src/stores/user-store';

import PageTitle from 'src/components/PageTitle.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    PageTitle,
  },
  setup() {
    const userStore = useUserStore()
    const userName = ref(userStore.getUser.username)

    return {
      userName,
    }
  },
  methods: {

  }
});
</script>
