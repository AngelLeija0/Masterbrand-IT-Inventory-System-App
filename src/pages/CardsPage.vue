<template>
  <q-page>
    <q-section class="flex q-pa-md">
      <PageTitle label="Tarjetas" />
    </q-section>
    <q-section class="flex q-pa-md">
      <div class="flex">
        <div class="q-pb-lg full-width">
          Generador de excel de tarjeta para gafet.
        </div>
        <div class="flex" style="overflow: auto; max-height: 60vh">
          <div v-for="(cardBox, i) in boxesCards" :key="i + 1">
            <q-card dark bordered class="bg-grey-12 text-black q-ma-sm">
              <q-card-section>
                <div class="flex justify-between">
                  <div class="text-h6">Caja {{ i + 1 }}</div>
                  <q-btn
                    icon="close"
                    size="10px"
                    flat
                    round
                    :disable="i < 1"
                    @click="deleteBox(i)"
                  />
                </div>
                <div class="text-subtitle2">
                  Del
                  {{ !cardBox.first_number_box ? 0 : cardBox.first_number_box }}
                  al
                  {{ !cardBox.last_number_box ? 0 : cardBox.last_number_box }}
                </div>
              </q-card-section>
              <q-separator dark inset />
              <q-card-section>
                <div>No. tarjeta (En caja)</div>
                <q-input
                  v-model="cardBox.first_number_box"
                  label="Numero de inicio de caja"
                  dense
                  outlined
                  color="black"
                  class="q-py-xs"
                />
                <q-input
                  v-model="cardBox.last_number_box"
                  label="Numero final de caja"
                  dense
                  outlined
                  color="black"
                  class="q-py-xs"
                />
                <div class="flex items-center">
                  <div style="font-size: 12px">¿Hay algun salto?</div>
                  <q-btn
                    icon="add"
                    size="10px"
                    flat
                    round
                    @click="addJumpToBox(i)"
                  />
                </div>
                <div v-for="(jump, i2) in cardBox.jumps" :key="i2 + 1">
                  <q-input
                    v-model="cardBox.jumps[i2]"
                    :label="'Salto ' + (i2 + 1)"
                    dense
                    outlined
                    color="black"
                    class="q-py-xs"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click="deleteJump(i, i2)"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                </div>
                <div class="q-pt-sm">No. tarjeta (En checador)</div>
                <q-input
                  v-model="cardBox.first_number_card_box"
                  label="Numero de incio de caja"
                  dense
                  outlined
                  color="black"
                  class="q-py-xs"
                />
                <q-input
                  v-model="cardBox.last_number_card_box"
                  label="Numero final de caja"
                  dense
                  outlined
                  color="black"
                  class="q-py-xs"
                />
              </q-card-section>
            </q-card>
          </div>
          <div class="flex justify-center items-center">
            <div
              style="display: flex; flex-direction: column; align-items: center"
            >
              <q-btn icon="add" size="16px" round flat @click="addNewBox()">
                <q-tooltip class="bg-black">Agregar</q-tooltip></q-btn
              >
              <q-btn
                icon="download"
                size="16px"
                round
                flat
                @click="generateExcel()"
              >
                <q-tooltip class="bg-black">Descargar excel</q-tooltip>
              </q-btn>
              <q-btn
                icon="refresh"
                size="16px"
                round
                flat
                @click="dialogDelete = true"
              >
                <q-tooltip class="bg-black">Reiniciar</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-section>

    <q-dialog v-model="dialogDelete" persistent>
      <q-card class="q-pa-md" style="width: 500px; max-width: 80vw">
        <q-card-actions align="right" class="q-py-none">
          <q-btn
            icon="close"
            color="black"
            flat
            round
            @click="dialogDelete = false"
            class="q-py-none"
          />
        </q-card-actions>
        <q-card-section
          class="q-pt-none q-pb-md"
          style="border-bottom: 1px solid #e9e9e9"
        >
          <div class="text-h6">Reiniciar cajas</div>
        </q-card-section>
        <q-card-section class="q-pt-md q-pb-sm flex justify-start">
          <div class="text-center text-subtitle1 text-weight-regular q-pb-md">
            ¿Estas seguro de reiniciar todas las cajas?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Confirmar"
            size="0.85rem"
            color="red"
            dense
            padding="sm lg"
            outline
            style="border-radius: 10px; text-transform: capitalize"
            @click="deleteAllBoxes()"
          />
          <q-btn
            label="Cancelar"
            size="0.85rem"
            flat
            dense
            padding="sm lg"
            style="border-radius: 10px; text-transform: capitalize"
            @click="dialogDelete = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

import ExcelJS from "exceljs/dist/exceljs.min.js";

import PageTitle from "src/components/PageTitle.vue";

export default defineComponent({
  name: "CardsPage",
  components: {
    PageTitle,
  },
  setup() {
    const $q = useQuasar();

    const boxesCards = ref([
      {
        first_number_box: 0,
        last_number_box: 0,
        jumps: [],
        first_number_card_box: 0,
        last_number_card_box: 0,
      },
    ]);

    const dialogDelete = ref(false);

    return {
      $q,
      boxesCards,
      dialogDelete,
    };
  },
  methods: {
    addNewBox() {
      try {
        this.boxesCards.push({
          first_number_box: 0,
          last_number_box: 0,
          jumps: [],
          first_number_card_box: 0,
          last_number_card_box: 0,
        });

        this.$q.notify({
          type: "positive",
          message: "Caja agregada correctamente.",
          timeout: 1000,
        })
      } catch (error) {
        console.log(error)
        this.$q.notify({
          type: "negative",
          message: "Ha ocurrido un error al agregar la caja.",
          timeout: 2000,
        })
      }
    },
    deleteBox(idx) {
      try {
        this.boxesCards.splice(idx, 1)
        this.$q.notify({
          type: "warning",
          message: "Caja eliminada correctamente.",
          timeout: 1000,
        })
      } catch (error) {
        console.log(error)
        this.$q.notify({
          type: "negative",
          message: "Ha ocurrido un error al eliminar la caja.",
          timeout: 1000,
        })
      }
    },
    addJumpToBox(idx) {
      this.boxesCards[idx].jumps.push(0);
    },
    deleteJump(boxIdx, jumpIdx) {
      this.boxesCards[boxIdx].jumps.splice(jumpIdx, 1);
    },
    deleteAllBoxes() {
      try {
        this.dialogDelete = false;
        this.boxesCards = [
          {
            first_number_box: 0,
            last_number_box: 0,
            jumps: [],
            first_number_card_box: 0,
            last_number_card_box: 0,
          },
        ];
        this.$q.notify({
          type: "warning",
          message: "Reiniciado correctamente.",
          timeout: 2000,
        });
      } catch (error) {
        console.log(error);
        this.$q.notify({
          type: "negative",
          message: "Ha ocurrido un error.",
          timeout: 2000,
        });
      }
    },
    generateExcel() {
      try {
        const workbook = new ExcelJS.Workbook();

        this.boxesCards.map((boxCard, i) => {
          const worksheet = workbook.addWorksheet(
            `Caja ${boxCard.first_number_box} - ${boxCard.last_number_box}`
          );

          worksheet.mergeCells("A1:B1");

          worksheet.mergeCells("C1:D1");

          const titleStyle = {
            fill: {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF8497B0" },
            },
            alignment: {
              horizontal: "center",
              vertical: "middle",
            },
          };

          worksheet.getCell("A1").style = titleStyle;
          worksheet.getCell("C1").style = titleStyle;

          worksheet.getCell("A1").value = "En caja";
          worksheet.getCell("C1").value = "En checador";

          let scanerNumber = Number(boxCard.first_number_card_box);
          for (
            let i = boxCard.first_number_box;
            i <= boxCard.last_number_box;
            i++
          ) {
            const row = worksheet.addRow([i, "", scanerNumber]);

            const isJumped = boxCard.jumps.includes(i.toString());

            row.eachCell((cell) => {
              if (isJumped) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FF0000" },
                };
              } else if (i % 2 == 0) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "D6DCE4" },
                };
              }
              cell.alignment = { horizontal: "center" };
            });

            worksheet.mergeCells(`A${row.number}:B${row.number}`);
            worksheet.mergeCells(`C${row.number}:D${row.number}`);

            scanerNumber++;
          }
        });

        workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "tarjetas.xlsx";
          a.click();
          window.URL.revokeObjectURL(url);
        });

        this.$q.notify({
          type: "positive",
          message: "Excel generado correctamente.",
          timeout: 2000,
        });
      } catch (error) {
        console.log(error);
        this.$q.notify({
          type: "negative",
          message: "Ha ocurrido un error al generar el Excel.",
          timeout: 2000,
        });
      }
    },
  },
});
</script>
