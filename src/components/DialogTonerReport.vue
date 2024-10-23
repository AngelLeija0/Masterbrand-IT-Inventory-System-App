<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card class="q-pa-md" style="width: 90vw; max-width: 90vw; height: 85vh; max-height: 90vh; overflow-y: auto;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round v-close-popup @click="closeDialog" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h5 text-weight-medium">Reporte de Cambio de Toners</div>
      </q-card-section>
      <q-card-section class="q-my-sm column">
        <div v-for="(key, i) in Object.keys(top5Data)" :key="i">
          <h5 class="q-ma-none text-h6 font-weight-medium q-pb-md">Top 5 - {{ formatMonthAndYear(key) }}</h5>
          <div class="row" style="gap: 10px;">
            <div v-for="(location, i2) in top5Data[key]" :key="i2" class="q-px-xl q-py-lg bg-grey-2 column justify-center items-center" style="border-radius: 10px;">
              <span class="text-h6 font-weight-medium">{{ location[1] }}</span>
              <p class="text-subtitle2 q-ma-none font-weight-light">{{ location[0] }}</p>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import { api, serverURL } from "src/boot/axios";

export default defineComponent({
  name: "DialogTonerReport",
  setup() {
    const isMobile = ref(isUsingMobile());

    function isUsingMobile() {
      const validation1 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const validation2 = window.innerWidth < 768;
      const finalValidation = validation1 || validation2;
      return finalValidation;
    }

    window.addEventListener("resize", () => {
      isMobile.value = isUsingMobile();
    });

    const dialogState = ref(false);
    const top5Data = ref({})

    return {
      isMobile,
      dialogState,
      top5Data,
    };
  },
  methods: {
    async openDialog() {
      try {
        this.dialogState = true;

        const printersReq = await fetch(`${serverURL}/assets?category=Impresora`);
        const printersData = await printersReq.json();

        const locationsData = [...new Set(printersData.map((printer) => printer.location))];

        const tonerChangesReq = await fetch(`${serverURL}/toner-changes`);
        const tonerChangesData = await tonerChangesReq.json() || [];
        if (tonerChangesData.length == 0) return

        const finalTonerChanges = tonerChangesData.map((tonerChange) => {
          return {
            ...tonerChange, location: locationsData.find((location) => tonerChange.printer.includes(location))
          }
        })
        
        const tonerChangesByMonth = Object.groupBy(finalTonerChanges, ({ date }) => `${new Date(date).getMonth()}-${new Date(date).getFullYear()}`)
        const topDepartmentsByMonth = Object.entries(tonerChangesByMonth).reduce((acc, [month, changes]) => {
          const departmentCounts = changes.reduce((deptAcc, change) => {
            deptAcc[change.location] = (deptAcc[change.location] || 0) + 1;
            return deptAcc;
          }, {});

          const sortedDepartments = Object.entries(departmentCounts).sort((a, b) => b[1] - a[1]);
          acc[month] = sortedDepartments.slice(0, 5);
          return acc;
        }, {});

        this.top5Data = topDepartmentsByMonth;


      } catch (error) {
        console.error(error);
      }
    },
    closeDialog() {
      this.dialogState = false;
    },
    formatMonthAndYear(string) {
      const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
      const month = months[string.split("-")[0]]
      const year = string.split("-")[1]
      return `${month} ${year}`
    }
  },
});
</script>
