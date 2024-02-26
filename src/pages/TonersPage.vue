<template>
    <q-page>
        <q-section class="flex justify-between q-pa-md">
            <PageTitle label="Toners" />
            <div>
                <q-btn-group flat>
                    <PrimaryButton label="Agregar Nuevo" icon="add" class="q-mx-sm" />
                    <MoreOptionsButton :options="[]" @optionClicked="handleActionOption" />
                </q-btn-group>
            </div>
        </q-section>
        <q-section class="flex row q-pa-md">
            <div class="col-12 col-md-6 row">
                <div v-for="(toner, i) in toners" :key="i + 1" class="col-12 col-sm-6 col-md-4 col-lg-3 q-mb-sm">
                    <TonerCard :label="toner.label" :stock="toner.stock" />
                </div>
            </div>
            <div class="col-12 col-md-6">
                <TonerChangesTable :columns="tonerColumns" :rows="tonerRows" :loading="loadingState">
                </TonerChangesTable>
            </div>
        </q-section>
    </q-page>
</template>
  
<script>
import { defineComponent, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useDataApiStore } from "src/stores/data-api-store"
import PageTitle from 'src/components/PageTitle.vue'
import TonerCard from 'src/components/TonerCard.vue'
import TonerChangesTable from 'src/components/TonerChangesTable.vue'

export default defineComponent({
    name: 'TonersPage',
    components: {
        PageTitle,
        TonerCard,
        TonerChangesTable,
    },
    setup() {
        const dataApiStore = useDataApiStore()
        const toners = ref([])
        const loadingState = ref(false)

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
            { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
        ])
        const tonerRows = ref([])

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
                const filteredData = data.map((toner) => {
                    return {
                        label: toner.name,
                        stock: Number(toner.incomingStock.quantity) - Number(toner.outgoingStock.quantity)
                    }
                })
                toners.value = filteredData
            }
            loadingState.value = false
        }

        return {
            toners,
            loadingState,
            tonerRows,
            tonerColumns
        }
    },
    methods: {
        handleActionOption() {
            console.log("option clicked")
        }
    }
});
</script>
  