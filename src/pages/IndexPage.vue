<template>
  <q-page>
    <q-section class="q-px-md q-pt-lg flex">
      <div class="flex justify-center items-center">
        <PageTitle :label="'Bienvenido ' + userName" />
        <q-icon name="light_mode" size="36px" class="q-mx-sm" style="color: #ffbf3b;" />
      </div>
    </q-section>
    <div id="flame-container"></div>
    <div id="welcome-message"></div>
  </q-page>
</template>

<style>
#flame-container {
  position: fixed;
  bottom: -200px;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('assets/Flames.gif') no-repeat center center;
  background-size: cover;
  display: none;
}

#welcome-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-wrap: nowrap;
  font-size: 4em;
  font-weight: bold;
  display: none;
}
</style>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import PageTitle from 'src/components/PageTitle.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    PageTitle,
  },
  setup() {
    const userStore = useUserStore()
    const userName = ref(userStore.getUser.username)

    onMounted(() => {
      if (String(userName.value).toLowerCase() == "darkflamemaster") {
        const welcomeMessageShowed = window.localStorage.getItem("welcome-message");
        if (welcomeMessageShowed) return

        const flamesContainer = document.getElementById('flame-container');
        const welcomeMessage = document.getElementById('welcome-message');

        flamesContainer.style.display = 'block';
        welcomeMessage.style.display = 'block';
        welcomeMessage.innerText = 'Bienvenido DarkFlameMaster';

        setTimeout(() => {
          flamesContainer.style.display = 'none';
          welcomeMessage.style.display = 'none';
        }, 4000);
      }
    })

    return {
      userName,
    }
  },
});
</script>
