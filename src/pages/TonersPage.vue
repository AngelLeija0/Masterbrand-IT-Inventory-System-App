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
            <div class="col-md-6 flex">
                <div v-for="(toner, i) in toners" :key="i+1">
                    <TonerCard :label="toner.label" :stock="toner.stock" />
                </div>
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

export default defineComponent({
    name: 'TonersPage',
    components: {
        PageTitle,
        TonerCard,
    },
    setup() {
        const dataApiStore = useDataApiStore()
        const toners = ref([])
        const loadingState = ref(false)

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
            loadingState
        }
    },
    methods: {
        handleActionOption() {
            console.log("option clicked")
        }
    }
});
</script>
  