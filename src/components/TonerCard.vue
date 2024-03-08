<template>
    <article class="toner-card q-pa-md q-mr-sm rounded-borders cursor-pointer" :style="{ backgroundColor: defineTonerColor(info.label), height: '100%' }">
        <q-card-section class="q-px-xl q-pt-lg text-center non-selectable">
            <div class="text-h3 text-weight-medium q-pb-sm">{{ info.stock }}</div>
            <div class="text-caption">{{ info.label }}</div>
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
        stock: {
            String
        }
    },
    setup(props) {
        const info = ref({
            label: props.label,
            stock: props.stock
        })

        return {
            info
        }
    },
    methods: {
        handleActionOption() {
            console.log("option clicked")
        },
        defineTonerColor(toner) {
            if (toner.includes("Cyan")) {
                return "#00acc1"
            }
            if (toner.includes("Magenta")) {
                return "#e91e63"
            }
            if (toner.includes("Amarillo")) {
                return "#fdd835"
            }
            return "#757575"
        },
    }
});
</script>
