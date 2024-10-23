<template>
    <article class="toner-card q-pa-xs q-mr-sm rounded-borders cursor-pointer"
        :style="{ backgroundColor: info.colorCode, height: '100%' }">
        <div class="flex justify-end" style="height: 25px;">
            <div v-if="nStock == 0">
                <q-btn round flat color="red" icon="error">
                    <q-tooltip class="bg-white text-black" style="font-size: .75rem">Sin stock</q-tooltip>
                </q-btn>
            </div>
            <div v-else-if="nStock < 4">
                <q-btn round flat color="orange-7" icon="warning">
                    <q-tooltip class="bg-white text-black" style="font-size: .75rem">Poco stock</q-tooltip>
                </q-btn>
            </div>
            <div v-else></div>
        </div>
        <q-card-section class="q-px-lg q-pt-md text-center non-selectable">
            <div class="text-h3 text-weight-medium q-pb-md">{{ info.stock }}</div>
            <div class="text-caption text-capitalize">{{ info.label }} ({{ info.color }})</div>
        </q-card-section>
    </article>
</template>

<style>
.toner-card:hover {
    opacity: 0.9;
}
</style>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'TonerCard',
    props: {
        label: {
            String
        },
        color: {
            String
        },
        colorCode: {
            String,
        },
        stock: {
            String
        }
    },
    setup(props) {
        const info = ref({
            label: props.label,
            color: props.color,
            colorCode: props.colorCode,
            stock: props.stock
        })
        const nStock = ref(Number(props.stock))

        return {
            info,
            nStock
        }
    },
    methods: {
        handleActionOption() {
            console.log("option clicked")
        },
    }
});
</script>
