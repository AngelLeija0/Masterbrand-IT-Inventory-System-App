<template>
  <q-page class="flex flex-center">
    <div v-if="isMobile" class="bg-white" style="width: 110vh; border-radius: 15px; display: flex; padding: 50px 20px;">
      <div class="q-px-md" style="flex: 1;">
        <div class="text-center q-pb-lg">
          <img src="https://lirp.cdn-website.com/b7aebc32/dms3rep/multi/opt/MBCI_Logo-1920w.png" alt=""
            style="width: 60%;">
        </div>
        <div class="text-h5 text-weight-medium q-pl-md q-pt-sm q-pb-xs">Iniciar sesión</div>
        <div class="q-pt-lg">
          <span class="q-pl-md">Correo electrónico</span>
          <q-input v-model="inputInfo.email" type="email" rounded outlined dense>
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </div>
        <div class="q-pt-md">
          <span class="q-pl-md">Contraseña</span>
          <q-input v-model="inputInfo.password" type="password" rounded outlined dense>
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>
        </div>
        <div class="q-pt-lg">
          <q-btn label="Ingresar" color="dark" rounded class="full-width"
            style="text-transform: none; padding: 12px 0;" />
        </div>
      </div>
    </div>
    <div v-else class="bg-white q-px-xl"
      style="width: 110vh; border-radius: 15px; display: flex; padding-top: 80px; padding-bottom: 80px;">
      <div style="background: url('https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/x4g7syngwc8l4ucqzqn1');
      background-size: contain; background-repeat: no-repeat; width: 100%;"></div>
      <div class="q-px-xl" style="flex: 1;">
        <div class="text-h5 text-weight-medium q-pl-md q-py-xs">Iniciar sesión</div>
        <div class="q-pt-lg">
          <span class="q-pl-md">Correo electrónico</span>
          <q-input v-model="inputInfo.email" type="email" rounded outlined dense style="width: 400px;">
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </div>
        <div class="q-pt-md">
          <span class="q-pl-md">Contraseña</span>
          <q-input v-model="inputInfo.password" type="password" rounded outlined dense style="width: 400px;">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>
        </div>
        <div class="q-pt-lg">
          <q-btn label="Ingresar" color="dark" rounded class="full-width" style="text-transform: none; padding: 12px 0;"
            @click="submitLogin()" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { api } from "src/boot/axios"
import { useUserStore } from "../stores/user-store"
import { useRoute } from "vue-router"

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const isMobile = ref(isUsingMobile())

    function isUsingMobile() {
      const validation1 =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      const validation2 = window.innerWidth < 768
      const finalValidation = validation1 || validation2
      return finalValidation
    }

    window.addEventListener('resize', () => {
      isMobile.value = isUsingMobile()
    })

    const inputInfo = ref({})

    const userStore = useUserStore()
    const router = useRoute()

    return {
      isMobile,
      inputInfo,
      router,
      userStore,
    }
  },
  methods: {
    submitLogin() {
      this.$q.notify({
        spinner: true,
        message: 'Por favor, espera un momento',
        timeout: 1000,
      });

      const apiPromise = new Promise((resolve, reject) => {
        api.post("./administrators/login", this.inputInfo)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      });

      setTimeout(() => {
        apiPromise
          .then((res) => {
            const data = res.data
            if (data) {
              if (data.message === "Incorrect password") {
                this.$q.notify({
                  type: 'negative',
                  message: 'Correo o contraseña incorrecta.',
                  timeout: 2000,
                });
              } else {
                this.userStore.setUser(data)
                this.$router.push({ name: 'home-page' })
                this.$q.notify({
                  type: 'positive',
                  message: 'Ingresaste correctamente.',
                  timeout: 1500,
                })
              }
            } else {
              this.$q.notify({
                type: 'negative',
                message: 'Ha ocurrido un error.',
                timeout: 2000,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.$q.notify({
              type: 'negative',
              message: 'Ha ocurrido un error.',
              timeout: 2000,
            });
          });
      }, 2000); // Espera 2000 milisegundos para mostrar la notificación de "Por favor, espera un momento"
    }

  }
});
</script>
