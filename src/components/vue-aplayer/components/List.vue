<template>
    <div class="aplayer-list" :class="{ 'aplayer-list-hide': !aplayer.listFolded }" :style="{ 'max-height': `${aplayer.listMaxHeight}px` }">
        <ol :style="{ 'max-height': `${aplayer.listMaxHeight}px` }" ref="ol">
            <li v-for="(audio, index) in aplayer.audio" :class="{ 'aplayer-list-light': (index === aplayer.index) }" @click="switchList(index)">
                <span class="aplayer-list-cur" :style="{ background: `${aplayer.coverColor[aplayer.index] || audio.theme || aplayer.theme}` }"></span>
                <span class="aplayer-list-index">{{ index + 1 }}</span>
                <span class="aplayer-list-title">{{ audio.name }}</span>
                <span class="aplayer-list-author">{{ audio.artist ? audio.artist : "" }}</span>
            </li>
        </ol>
    </div>
</template>
<script>
    export default {
        props: ["aplayer"],
        computed: {
            ol () {
                return this.$refs.ol;
            }
        },
        methods: {
            showList () {
                setTimeout(() => {
                    this.ol.scrollTop = this.aplayer.index * 33;
                }, 0);
            },
            switchList (index) {
                if (index !== this.aplayer.index) {
                    this.$emit("switchList", index);
                    this.$emit("play");
                } else {
                    this.$emit("toggle");
                }
            }
        },
    }
</script>