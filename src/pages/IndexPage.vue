<template>
  <q-page>
    <q-section class="q-px-md q-pt-lg flex">
      <div class="flex justify-center items-center">
        <PageTitle :label="'Bienvenido ' + userName" />
        <q-icon name="light_mode" size="36px" class="q-mx-sm" style="color: #ffbf3b;" />
      </div>
    </q-section>
    <q-section class="q-pt-lg">
      <div class="row flex justify-between items-center" style="height: 78vh;" v-if="categories.length > 0">
        <div class="col-md-8 col-sm-8 col-12">

        </div>
        <div class="col-md-4 col-sm-4 col-12 flex justify-center items-center" style="overflow-y: auto;">
          <div v-for="(category, i) in categories" :key="i + 1" class="q-pa-md full-width">
              <q-card class="my-card full-width text-grey-9" :style="{ borderRadius: '15px', background: '#f5f5f5' }">
                <q-card-section>
                  <div class="text-h6" style="font-size: 16px;">{{ category.label }}</div>
                </q-card-section>
                <q-separator class="q-mx-sm" />
                <q-card-section class="row">
                  <div v-for="(report, i) in category.reports" :key="i + 1" class="flex q-pb-md col-6">
                    <div class="full-width text-center" style="font-size: 1.2rem;">{{ report.quantity }}</div>
                    <div class="full-width text-center" style="font-size: 0.75rem;">{{ report.label }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
        </div>
      </div>
    </q-section>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useUserStore } from 'src/stores/user-store';
import { api } from 'src/boot/axios';

import PageTitle from 'src/components/PageTitle.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    PageTitle,
  },
  setup() {
    const userStore = useUserStore()
    const userName = ref(userStore.getUser.username)

    const categories = ref([])

    getAllCategories()
    function getAllCategories() {
      try {
        api
          .get("./categories")
          .then((res) => {
            const data = res.data
            categories.value = data.map((element, i) => {
              getCategoryReport(element.name, i)
              return {
                label: element.name
              }
            })
          })
          .catch((err) => {
            console.log(err)
          });
      } catch (error) {
        console.log(error)
      }
    }

    function getCategoryReport(category, idx) {
      api
        .get(`./reports/category/${category}`)
        .then((res) => {
          const data = res.data
          categories.value[idx].reports = data
        })
        .catch((err) => {
          console.log(err)
        })
    }

    return {
      userName,
      categories,
    }
  },
  methods: {

  }
});
</script>
