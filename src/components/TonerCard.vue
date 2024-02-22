<template>
    <q-card class="my-card bg-grey-9 q-pa-md q-mr-md">
        <q-card-section class="flex justify-end q-pa-none">
            <PrimaryButton icon="open_in_full" flat size="12px" color="white" class="q-pa-xs" />
        </q-card-section>
        <q-card-section class="q-px-xl text-white text-center">
            <div class="text-h3 text-weight-medium q-pb-sm">{{ info.stock }}</div>
            <div class="text-caption">{{ info.label }}</div>
        </q-card-section>
    </q-card>
</template>

<script>
import { defineComponent, ref } from 'vue'
import PrimaryButton from 'src/components/PrimaryButton.vue';

export default defineComponent({
    name: 'TonerCard',
    components: {
        PrimaryButton,
    },
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
            info,
        }
    },
    methods: {
        handleActionOption() {
            console.log("option clicked")
        }
    }
});
</script>