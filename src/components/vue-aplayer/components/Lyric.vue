<template>
    <div class="aplayer-lrc">
        <div class="aplayer-lrc-contents" :style="transformStyle">
            <p :class="{ 'aplayer-lrc-current': index === aplayer.lyricIndex }" v-for="(lyric, index) in aplayer.lyrics[aplayer.index]">{{ lyric[1] }}</p>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["aplayer"],
        computed: {
            transformStyle () {
                return {
                    transform: `translateY(-${this.aplayer.lyricIndex * 16}px)`,
                    webkitTransform: `translateY(-${this.aplayer.lyricIndex * 16}px)`,
                }
            }
        }
    }
</script>