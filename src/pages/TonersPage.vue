<template>
    <q-page>
        <q-section class="flex justify-between q-pa-md">
            <PageTitle label="Toners" />
            <div>
                <q-btn-group flat>
                    <PrimaryButton label="Agregar Nuevo Toner" icon="add" class="q-mx-sm" @click="openNewTonerDialog" />
                    <PrimaryButton label="Agregar Nuevo Cambio de Toner" icon="add" class="q-mx-sm"
                        @click="openNewTonerChangeDialog" />
                    <MoreOptionsButton :options="moreOptions" @optionClicked="handleActionOption" />
                </q-btn-group>
            </div>
        </q-section>
        <q-section class="flex row q-pa-md">
            <div class="col-12 col-md-5 row">
                <div v-for="(toner, i) in toners" :key="i + 1" class="col-sm-12 col-md-6 col-lg-4 q-mb-sm">
                    <TonerCard :label="toner.name" :stock="toner.stock" @click="openTonerDialog(toner)" />
                </div>
            </div>
            <div class="col-12 col-md-7">
                <TonerChangesTable :columns="tonerColumns" :rows="tonerRows" :loading="loadingState">
                </TonerChangesTable>
            </div>
        </q-section>

        <q-dialog v-model="dialogStateNewToner">
            <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh">
                <q-card-actions align="right" class="q-py-none">
                    <q-btn icon="close" color="black" flat round @click="closeNewTonerDialog" class="q-py-none" />
                </q-card-actions>
                <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
                    <div class="text-h6">Nuevo Toner</div>
                </q-card-section>
                <q-card-section>
                    <div class="q-mb-lg">
                        <q-title class="text-subtitle2 text-weight-regular">Completa los siguientes campos para agregar
                            un nuevo toner.
                        </q-title>
                    </div>
                    <div>
                        <q-input clearable dense label="Nombre" class="q-mb-md" hint="requerido" />
                        <q-input clearable dense label="Stock" class="q-mb-md" hint="requerido" />
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="Agregar" size="0.85rem" color="primary" dense outline padding="sm lg"
                        @click="addAsset" style="border-radius: 10px; text-transform: capitalize" />
                    <q-btn label="Cancelar" size="0.85rem" flat dense outline @click="closeNewTonerDialog"
                        padding="sm lg" style="border-radius: 10px; text-transform: capitalize" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dialogStateNewTonerChange" persistent>
            <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh">
                <q-card-actions align="right" class="q-py-none">
                    <q-btn icon="close" color="black" flat round @click="closeNewTonerChangeDialog" class="q-py-none" />
                </q-card-actions>
                <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
                    <div class="text-h6">Nuevo Cambio de Toner</div>
                </q-card-section>
                <q-card-section>
                    <div class="q-mb-lg">
                        <q-title class="text-subtitle2 text-weight-regular">Completa los siguientes campos para agregar
                            un cambio de toner.
                        </q-title>
                    </div>
                    <div>
                        <q-select clearable dense :options="tonerOptions" label="Toner" class="q-mb-md"
                            hint="requerido" />
                        <q-select clearable dense :options="printerOptions" label="Impresora" class="q-mb-md"
                            hint="requerido" />
                        <q-input clearable dense label="Comentarios" class="q-mb-md" hint="opcional" />
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="Agregar" size="0.85rem" color="primary" dense outline padding="sm lg"
                        @click="addAsset" style="border-radius: 10px; text-transform: capitalize" />
                    <q-btn label="Cancelar" size="0.85rem" flat dense outline @click="closeNewTonerChangeDialog"
                        padding="sm lg" style="border-radius: 10px; text-transform: capitalize" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dialogState" persistent>
            <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh">
                <q-card-actions align="right" class="q-py-none">
                    <q-btn icon="close" color="black" flat round @click="closeTonerDialog" class="q-py-none" />
                </q-card-actions>
                <q-card-section class="q-pt-none q-pb-sm" style="border-bottom: 1px solid #e9e9e9">
                    <div class="text-h5 text-weight-medium">{{ currentToner.name }}</div>
                </q-card-section>
                <q-card-section class="q-mb-lg">
                    <div class="q-pb-md">
                        <h5 class="text-subtitle1 q-ma-none text-weight-regular">Reporte</h5>
                    </div>
                    <div>
                        <div class="flex justify-between items-center q-py-sm"
                            style="border-bottom: 1px solid rgb(239, 239, 239); width: 100%;">
                            <div class="q-pr-md text-grey-14" :style="{ width: isMobile ? '100%' : '30%' }">En stock
                            </div>
                            <div :style="{ width: isMobile ? '70%' : '50%', fontWeight: 500 }">{{ currentToner.stock
                                }}
                            </div>
                        </div>
                        <div class="flex justify-between items-center q-py-sm"
                            style="border-bottom: 1px solid rgb(239, 239, 239); width: 100%;">
                            <div class="q-pr-md text-grey-14" :style="{ width: isMobile ? '100%' : '30%' }">Ultima
                                entrada
                                de stock
                            </div>
                            <div :style="{ width: isMobile ? '70%' : '50%', fontWeight: 500 }">
                                <p class="q-my-none">
                                    Cantidad: {{ currentToner.incomingStock.quantity }}
                                </p>
                                <p class="q-my-none">
                                    Fecha: {{ formatDate(currentToner.incomingStock.date) }}
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center q-py-sm"
                            style="border-bottom: 1px solid rgb(239, 239, 239); width: 100%;">
                            <div class="q-pr-md text-grey-14" :style="{ width: isMobile ? '100%' : '30%' }">Ultima
                                salida de
                                stock
                            </div>
                            <div :style="{ width: isMobile ? '70%' : '50%', fontWeight: 500 }">
                                <p class="q-my-none">
                                    Cantidad: {{ currentToner.outgoingStock.quantity }}
                                </p>
                                <p class="q-my-none">
                                    Fecha: {{ formatDate(currentToner.outgoingStock.date) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="Modificar stock" size="0.85rem" color="primary" dense outline padding="sm lg"
                        @click="openTonerStockDialog" style="border-radius: 10px; text-transform: capitalize" />
                    <q-btn label="Cancelar" size="0.85rem" flat dense outline @click="closeTonerDialog" padding="sm lg"
                        style="border-radius: 10px; text-transform: capitalize" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dialogStateTonerStock">
            <q-card class="q-pa-md" style="width: 400px; max-width: 80vw; max-height: 80vh">
                <q-card-actions align="right" class="q-py-none">
                    <q-btn icon="close" color="black" flat round @click="closeTonerStockDialog" class="q-py-none" />
                </q-card-actions>
                <q-card-section class="q-mb-lg">
                    <div class="">
                        <p class="text-subtitle1 q-ma-none text-weight-medium q-pl-sm q-pb-sm"></p>
                    </div>
                    <div class="q-pb-sm">
                        <q-input v-model="tonerInput.stock" filled hide-bottom-space label="Cantidad"
                            input-style="font-weight: 500;" />
                    </div>
                    <div class="q-pb-md">
                        <q-select filled v-model="tonerInput.type" :options="['Entrada', 'Salida', 'Correcion']"
                            label="Tipo" input-style="font-weight: 500;" hide-bottom-space />
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="Modificar" size="0.85rem" color="primary" dense outline padding="sm lg"
                        @click="modifyTonerStock" style="border-radius: 10px; text-transform: capitalize" />
                    <q-btn label="Cancelar" size="0.85rem" flat dense outline @click="closeTonerStockDialog"
                        padding="sm lg" style="border-radius: 10px; text-transform: capitalize" />
                </q-card-actions>
            </q-card>
        </q-dialog>


    </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from "quasar";
import { api } from 'src/boot/axios'
import { useDataApiStore } from "src/stores/data-api-store"
import { date } from 'quasar'

import PageTitle from 'src/components/PageTitle.vue'
import TonerCard from 'src/components/TonerCard.vue'
import TonerChangesTable from 'src/components/TonerChangesTable.vue'
import PrimaryButton from 'src/components/PrimaryButton.vue';
import MoreOptionsButton from 'src/components/MoreOptionsButton.vue';

export default defineComponent({
    name: 'TonersPage',
    components: {
        PageTitle,
        TonerCard,
        TonerChangesTable,
        PrimaryButton,
        MoreOptionsButton
    },
    setup() {
        const $q = useQuasar();

        const dataApiStore = useDataApiStore()
        const toners = ref([])
        const loadingState = ref(false)

        const moreOptions = ref([
            {
                label: "Consulta existencias",
                icon: "find_in_page",
                color: "",
                value: "get-report"
            }
        ])

        const colors = {
            black: "Negro"
        }

        const tonerColumns = ref([
            {
                name: 'index',
                label: '#',
                field: 'index',
                sortable: true,
                sort: (a, b) => {
                    if (a < b) {
                        return a
                    }
                    return b
                }
            },
            { name: 'toner', label: 'Toner', field: 'toner', align: 'left' },
            { name: 'color', label: 'Color', field: 'color', align: 'left', format: (val) => colors[val] },
            { name: 'printer', label: 'Impresora', field: 'printer', align: 'left' },
            { name: 'coments', label: 'Comentarios', field: 'coments', align: 'left' },
            { name: 'created_at', label: 'Fecha', field: 'created_at', align: 'left' },
        ])
        const tonerRows = ref([])
        getAllTonerChanges()
        function getAllTonerChanges() {
            try {
                api.get("./toner-changes").then((res) => {
                    const data = res.data
                    tonerRows.value = data
                }).catch((err) => {
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }

        getAllToners()
        function getAllToners() {
            try {
                api
                    .get("./toners")
                    .then((res) => {
                        const data = res.data
                        if (data.length > 0) {
                            setToners(data)
                        }
                        else if (data.length == 0) {
                            dataApiStore.clearDataApi()
                            loadingState.value = false
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            } catch (error) {
                console.log(error)
            }
        }

        function setToners(data = null) {
            if (data !== null) {
                dataApiStore.setDataApi(data)
                toners.value = data
            }
            loadingState.value = false
        }

        const dialogState = ref(false)
        const currentToner = ref({})

        const dialogStateTonerStock = ref(false)
        const tonerInput = ref({})
        const printers = ref([])

        const dialogStateNewToner = ref(false)
        const dialogStateNewTonerChange = ref(false)
        const tonerOptions = ref([])
        const printerOptions = ref([])

        return {
            $q,
            toners,
            getAllToners,
            getAllTonerChanges,
            loadingState,
            tonerRows,
            tonerColumns,
            dialogState,
            currentToner,
            dialogStateTonerStock,
            tonerInput,
            printers,
            moreOptions,
            dialogStateNewToner,
            dialogStateNewTonerChange,
        }
    },
    methods: {
        openTonerDialog(toner) {
            this.dialogState = true
            this.currentToner = toner
        },
        closeTonerDialog() {
            this.dialogState = false
            this.currentToner = {}
        },
        formatDate(dateToFormat) {
            return date.formatDate(dateToFormat, 'DD/MMMM/YYYY - HH:mm', {
                months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            })
        },
        openTonerStockDialog() {
            this.dialogStateTonerStock = true
        },
        closeTonerStockDialog() {
            this.dialogStateTonerStock = false
            this.tonerInput = {}
        },
        modifyTonerStock() {
            const typeTransaction = this.tonerInput.type
            if (typeTransaction == "Entrada") {
                this.currentToner.stock = Number(this.currentToner.stock) + Number(this.tonerInput.stock)
                this.currentToner.incomingStock.quantity = this.tonerInput.stock
                this.currentToner.incomingStock.date = new Date()
                console.log(this.currentToner)
            }
            else if (typeTransaction == "Salida") {
                this.currentToner.stock = Number(this.currentToner.stock) - Number(this.tonerInput.stock)
                this.currentToner.outgoingStock.quantity = this.tonerInput.stock
                this.currentToner.outgoingStock.date = new Date()
            }
            else if (typeTransaction == "Correccion") {
                this.currentToner.stock = this.tonerInput.stock
            }
            try {
                api
                    .patch(`./toners/update/${this.currentToner._id}`, this.currentToner)
                    .then((res) => {
                        const data = res.data
                        console.log(data)
                        if (data) {
                            this.toners = []
                            this.closeTonerDialog()
                            this.closeTonerStockDialog()
                            this.getAllToners()
                            this.getAllTonerChanges()
                            this.$q.notify({
                                type: "positive",
                                message: "Agregado correctamente.",
                                timeout: 2000,
                            })
                        }
                    })
                    .catch((err) => {
                        this.$q.notify({
                            type: "negative",
                            message: "Ha ocurrido un error.",
                            timeout: 2000,
                        })
                    });
            } catch (error) {
                console.log(error)
            }
        },
        openNewTonerDialog() {
            this.dialogStateNewToner = true
        },
        closeNewTonerDialog() {
            this.dialogStateNewToner = false
        },
        openNewTonerChangeDialog() {
            this.dialogStateNewTonerChange = true
        },
        closeNewTonerChangeDialog() {
            this.dialogStateNewTonerChange = false
        },
        getTonerAndPrinterOptions() {
            this.getAllToners()
            console.log(toners)
            
            api
                    .get("./toners")
                    .then((res) => {
                        const data = res.data
                        if (data.length > 0) {
                            setToners(data)
                        }
                        else if (data.length == 0) {
                            dataApiStore.clearDataApi()
                            loadingState.value = false
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    });
        }
    }
});
</script>
