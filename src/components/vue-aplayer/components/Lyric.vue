<template>
    <div class="aplayer-lrc" v-show="aplayer.lyricShow">
        <div class="aplayer-lrc-contents" :style="transformStyle">
            <p :class="{ 'aplayer-lrc-current': index === currentLyricIndex }" v-for="(lyric, index) in aplayer.lyrics[aplayer.index]">{{ lyric[1] }}</p>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["aplayer", "audioStatus"],
        data () {
            return {
                currentLyricIndex: 0,
            }
        },
        computed: {
            transformStyle () {
                return {
                    transform: `translateY(-${this.currentLyricIndex * 16}px)`,
                    webkitTransform: `translateY(-${this.currentLyricIndex * 16}px)`,
                }
            }
        },
        methods: { 
            updateLyric () {
                let lyric = this.aplayer.lyrics[this.aplayer.index];
                if (lyric) {
                    for (let i = 0; i < lyric.length; i++) {
                        const current = lyric[i];
                        const next = lyric[i + 1];
                        if (this.audioStatus.playedTime >= current[0] && (!next || this.audioStatus.playedTime < next[0])) {
                            this.currentLyricIndex = i;
                        }
                    }
                }
            }
        }
    }
</script>