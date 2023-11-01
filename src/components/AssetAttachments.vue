<template>
  <div class="row q-px-sm q-pt-sm q-pb-none">
    <div class="col-12 flex justify-between">
      <div class="text-h6">Archivos adjuntados</div>
    </div>
    <div class="col-12 q-mt-md">
      <div class="row flex justify-between">
        <div class="col-lg-3 col-md-4 col-sm-6 col-12 q-pa-md" v-for="(attachment, i) in allAttachments" :key="i + 1">
          <q-card class="my-card text-center">
            <q-card-actions align="right" class="q-pt-sm q-pb-none">
              <q-btn icon="download" color="black" flat round class="q-py-none" size="0.75rem"
                @click="downloadAttachment(attachment)" />
            </q-card-actions>
            <q-card-section class="q-py-none" style="height: 200px; display: grid; align-items: center;">
              <div v-if="attachment.type === 'image'">
                <q-img :src="attachment.url" style="width: 90%; height: 200px;" />
              </div>
              <div v-else-if="attachment.type === 'video'">
                <q-video :src="attachment.url" style="width: 90%;" />
              </div>
              <div v-else>
                <div class="text-red full-width">Error al mostrar el contenido</div>
              </div>
            </q-card-section>
            <q-card-section style="height: 85px; display: grid; align-items: center;">
              <div class="q-pt-sm" style="font-size: 0.85rem;">{{ attachment.label }}</div>
              <div v-if="defaultImage === attachment.label" class="text-grey-14 q-pt-xs" style="font-size: 0.75rem;">
                Imagen predeterminada
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue"
import { useRoute } from 'vue-router'
import { serverURL } from "src/boot/axios"

export default defineComponent({
  name: "AssetAttachments",
  props: {
    asset: {
      type: Object,
    },
  },
  components: {
  },
  setup(props) {
    const isMobile = ref(isUsingMobile());

    function isUsingMobile() {
      const validation1 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const validation2 = window.innerWidth < 768
      const finalValidation = validation1 || validation2;
      return finalValidation;
    }

    window.addEventListener("resize", () => {
      isMobile.value = isUsingMobile()
    })

    const attachmentsURL = ref(serverURL)

    const router = useRoute()

    const idAsset = ref(router.params.id)

    const defaultImage = ref(defineFileName(props.asset.images.default_image))

    const allAttachments = ref([])

    if (props.asset) {
      const assetInfo = props.asset
      if (assetInfo.images?.all) {
        assetInfo.images.all.map((image) => {
          allAttachments.value.push({
            label: defineFileName(image),
            type: defineFileType(image),
            url: `${attachmentsURL.value}/uploads/attachments/${image}`
          })
        })
      }
      if (assetInfo.actions) {
        assetInfo.actions.map((action) => {
          action.attachments.map((image) => {
            allAttachments.value.push({
              label: `Accion ${action.name}: ${defineFileName(image)}`,
              type: defineFileType(image),
              url: `${attachmentsURL.value}/uploads/attachments/${image}`
            })
          })
        })
      }
    }

    function defineFileName(fileName) {
      const formattedName = fileName.replace(/\.[^.]+$/, "");
      return formattedName
    }

    function defineFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase()

      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff']
      const videoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'wmv']

      if (imageExtensions.includes(extension)) {
        return 'image'
      }
      if (videoExtensions.includes(extension)) {
        return 'video'
      }
      return 'error'
    }

    return {
      isMobile,
      router,
      attachmentsURL,
      idAsset,
      allAttachments,
      defaultImage,
    }
  },
  methods: {
    downloadAttachment(attachment) {
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          let imgURL = URL.createObjectURL(blob)

          let a = document.createElement('a');
          a.href = imgURL;
          a.download = 'imagen.jpg';
          a.click();  
        })
        .catch(e => console.error(e));
    }
  }
});
</script>
