<template>
    <q-page>
        <q-section class="flex justify-between q-pa-md">
            <PageTitle label="Toners" />
            <div>
                <q-btn-group flat>
                    <PrimaryButton label="Agregar Nuevo Toner" icon="add" class="q-mx-sm" @click="openNewTonerDialog" />
                    <PrimaryButton label="Agregar Cambio de Toner" icon="add" class="q-mx-sm"
                        @click="openNewTonerChangeDialog" />
                    <MoreOptionsButton :options="moreOptions" @optionClicked="handleActionOption" />
                </q-btn-group>
            </div>
        </q-section>
        <q-section class="flex row q-px-md q-pt-md">
            <div class="col-12 col-md-5 row" style="height: 70vh; overflow-y: auto;">
                <div v-for="(toner, i) in toners" :key="i + 1" class="col-12 col-sm-6 col-md-6 col-lg-4 q-mb-sm">
                    <TonerCard :label="toner.name" :color="toner.color" :colorCode="defineTonerColor(toner.color)"
                        :stock="toner.stock" @click="openTonerDialog(toner)" />
                </div>
            </div>
            <div class="col-12 col-md-7">
                <TonerChangesTable :columns="tonerColumns" :rows="tonerRows" :loading="loadingState" @reloadData="()=>{}">
                </TonerChangesTable>
            </div>
        </q-section>

        <q-dialog v-model="dialogStateNewToner" persistent>
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
                        <q-input v-model="tonerInput.name" clearable dense label="Nombre" class="q-mb-md"
                            hint="requerido" />
                        <q-select v-model="tonerInput.color" clearable dense label="Color"
                            :options="['Negro', 'Amarillo', 'Cyan', 'Magenta']" class="q-mb-md" hint="requerido" />
                        <q-input v-model="tonerInput.stock" clearable dense label="Stock" class="q-mb-md"
                            hint="requerido" />
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="Agregar" size="0.85rem" color="primary" dense outline padding="sm lg"
                        style="border-radius: 10px; text-transform: capitalize" @click="addToner" />
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
                        <q-select v-model="tonerChangeInput.toner" clearable dense :options="tonerOptions" emit-value
                            map-options label="Toner" class="q-mb-md" hint="requerido">
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        No se encontraron resultados
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                        <q-select v-model="tonerChangeInput.printer" clearable dense :options="printerOptions"
                            emit-value map-options label="Impresora" class="q-mb-md" hint="requerido">
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        No se encontraron resultados
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                        <q-input v-model="tonerChangeInput.comments" clearable dense label="Comentarios" class="q-mb-md"
                            hint="opcional" />
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="Agregar" size="0.85rem" color="primary" dense outline padding="sm lg"
                        @click="addTonerChange" style="border-radius: 10px; text-transform: capitalize" />
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
                <q-card-section class="q-pt-none q-pb-sm flex items-end" style="border-bottom: 1px solid #e9e9e9">
                    <div class="text-h5 text-weight-medium">{{ currentToner.name }}</div>
                    <div class="text-subtitle2 text-weight-medium q-px-sm text-capitalize"
                        :style="{ color: defineTonerColor(currentToner.color) }">({{ currentToner.color }})</div>
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
                    <q-btn label="Borrar" size="0.85rem" color="red" dense outline padding="sm lg"
                        @click="dialogDelete = true" style="border-radius: 10px; text-transform: capitalize" />
                    <q-btn label="Cancelar" size="0.85rem" flat dense outline @click="closeTonerDialog" padding="sm lg"
                        style="border-radius: 10px; text-transform: capitalize" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <DialogConfirmDelete v-model="dialogDelete" :label="currentToner.name" @deleteConfirm="deleteToner" />

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
                        <q-select filled v-model="tonerInput.type" :options="['Entrada', 'Salida', 'Correcion']"
                            label="Tipo de moviemiento" input-style="font-weight: 500;" hide-bottom-space />
                    </div>
                    <div class="q-pb-md">
                        <q-input v-model="tonerInput.stock" filled hide-bottom-space label="Cantidad"
                            input-style="font-weight: 500;" />
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
import DialogConfirmDelete from 'src/components/DialogConfirmDelete.vue';

export default defineComponent({
    name: 'TonersPage',
    components: {
        PageTitle,
        TonerCard,
        TonerChangesTable,
        PrimaryButton,
        MoreOptionsButton,
        DialogConfirmDelete,
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
            { name: 'color', label: 'Color', field: 'color', align: 'left', format: (val) => val.charAt(0).toUpperCase() + val.slice(1) },
            { name: 'printer', label: 'Impresora', field: 'printer', align: 'left' },
            { name: 'comments', label: 'Comentarios', field: 'comments', align: 'left' },
            { name: 'date', label: 'Fecha', field: 'date', align: 'left', format: (val) => formatDate(val) },
            { name: 'actions', label: '', align: 'left' }
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
                toners.value = []
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

        const dialogDelete = ref(false)

        const dialogStateTonerStock = ref(false)
        const tonerInput = ref({})
        const printers = ref([])

        const dialogStateNewToner = ref(false)
        const dialogStateNewTonerChange = ref(false)
        const tonerOptions = ref([])
        const printerOptions = ref([])
        const tonerChangeInput = ref({})

        function formatDate(dateToFormat) {
            return date.formatDate(dateToFormat, 'DD/MMMM/YYYY - HH:mm', {
                months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            })
        }

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
            tonerOptions,
            printerOptions,
            tonerChangeInput,
            formatDate,
            dialogDelete,
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
            this.tonerInput = {}
        },
        defineTonerColor(color) {
            if (color.toLowerCase() === "cyan") {
                return "#00acc1"
            }
            if (color.toLowerCase() === "magenta") {
                return "#e91e63"
            }
            if (color.toLowerCase() === "amarillo") {
                return "#fdd835"
            }
            return "#757575"
        },
        openTonerStockDialog() {
            this.dialogStateTonerStock = true
        },
        closeTonerStockDialog() {
            this.dialogStateTonerStock = false
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
            this.tonerInput = {}
        },
        openNewTonerChangeDialog() {
            this.getTonerAndPrinterOptions()
            this.dialogStateNewTonerChange = true
        },
        closeNewTonerChangeDialog() {
            this.dialogStateNewTonerChange = false
            this.tonerChangeInput = {}
        },
        getTonerAndPrinterOptions() {
            const mapToners = this.toners.map((toner) => {
                return {
                    label: `${toner.name} (${toner.color})`,
                    value: toner
                }
            })
            this.tonerOptions = mapToners
            api
                .get("./assets?category=Impresora")
                .then((res) => {
                    const data = res.data
                    if (data) {
                        const dataFiltered = data.filter(objeto => !(objeto.model.includes("Zebra")));
                        const mapPrinters = dataFiltered.map((printer) => {
                            return {
                                label: `${printer.model} ${printer.location}`,
                                value: printer
                            }
                        })
                        this.printerOptions = mapPrinters
                    }
                })
                .catch((err) => {
                    console.log(err)
                });
        },
        addTonerChange() {
            try {
                const tonerChangeData = {
                    toner: {
                        id: this.tonerChangeInput.toner._id,
                        name: this.tonerChangeInput.toner.name,
                        color: this.tonerChangeInput.toner.color
                    },
                    printer: {
                        id: this.tonerChangeInput.printer._id,
                        name: `${this.tonerChangeInput.printer.model} ${this.tonerChangeInput.printer.location}`
                    },
                    comments: this.tonerChangeInput.comments,
                    created_at: new Date(),
                    updated_at: new Date()
                }
                api
                    .post(`./toner-changes/create`, tonerChangeData)
                    .then((res) => {
                        const data = res.data
                        if (data.success) {
                            this.getAllToners()
                            this.getAllTonerChanges()
                            this.closeNewTonerChangeDialog()
                            this.tonerChangeInput = {}
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
        addToner() {
            try {
                const tonerData = {
                    name: this.tonerInput.name,
                    color: this.tonerInput.color,
                    incomingStock: {
                        quantity: this.tonerInput.stock,
                        date: new Date()
                    },
                    outgoingStock: {
                        quantity: "0",
                        date: new Date(),
                    },
                    stock: Number(this.tonerInput.stock),
                    created_at: new Date(),
                    updated_at: new Date()
                }
                api
                    .post(`./toners/create`, tonerData)
                    .then((res) => {
                        const data = res.data
                        if (data.success) {
                            this.getAllToners()
                            this.closeNewTonerDialog()
                            this.tonerInput = {}
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
        deleteToner() {
            try {
                api
                    .delete(`./toners/delete/${this.currentToner._id}`)
                    .then((res) => {
                        console.log(res.data)
                        if (res.status === 200) {
                            this.$q.notify({
                                type: "warning",
                                message: "Borrado correctamente.",
                                timeout: 2000,
                            });
                            this.getAllToners()
                            this.closeTonerDialog()
                            this.dialogDelete = false;
                        } else {
                            this.$q.notify({
                                type: "negative",
                                message: "Ha ocurrido un error.",
                                timeout: 2000,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$q.notify({
                            type: "negative",
                            message: "Ha ocurrido un error.",
                            timeout: 2000,
                        });
                    });
            } catch (error) {
                console.log(error)
            }
        }
    }
});
</script>
