<template>
    <div class="aplayer-controller">
        <div class="aplayer-bar-wrap" @mouseover="aplayerThumbShowStatus = true" @mouseout="aplayerThumbShowStatus = false">
            <div class="aplayer-bar" ref="aplayerBar">
                <div class="aplayer-loaded" :style="{ width: `${audioStatus.duration ? audioStatus.loadedTime / audioStatus.duration * 100 : 0}%` }"></div>
                <div class="aplayer-played" :style="{ width: `${audioStatus.duration ? audioStatus.playedTime / audioStatus.duration * 100 : 0}%`, background: `${aplayer.coverColor[aplayer.index] || audio?.theme || aplayer.theme}` }">
                    <span class="aplayer-thumb" :style="{ background: `${aplayer.coverColor[aplayer.index] || audio?.theme || aplayer.theme}` }" v-show="aplayerThumbShowStatus">
                        <span class="aplayer-loading-icon"><Icon type="loading"></Icon></span>
                    </span>
                </div>
            </div>
        </div>
        <div :class="{ 'aplayer-time': true, 'aplayer-time-narrow': styleStatus.timeNarrow }">
            <span class="aplayer-time-inner">
                <span class="aplayer-ptime">{{ playedTime }}</span> / <span class="aplayer-dtime">{{ duration }}</span>
            </span>
            <span class="aplayer-icon aplayer-icon-back" @click="$emit('skipBack')">
                <Icon type="skip"></Icon>
            </span>
            <span class="aplayer-icon aplayer-icon-play" @click="$emit('toggle')">
                <Icon type="play" v-show="!audioStatus.playStatus"></Icon>
                <Icon type="pause" v-show="audioStatus.playStatus"></Icon>
            </span>
            <span class="aplayer-icon aplayer-icon-forward" @click="$emit('skipForward')">
                <Icon type="skip"></Icon>
            </span>
            <div class="aplayer-volume-wrap" :class="{ 'aplayer-volume-bar-wrap-active': volumeBarShowStatus }">
                <button type="button" class="aplayer-icon aplayer-icon-volume-down" @click="$emit('mute')">
                    <Icon :type="switchVolumeIcon"></Icon>
                </button>
                <div class="aplayer-volume-bar-wrap">
                    <div class="aplayer-volume-bar" ref="volumeBar">
                        <div class="aplayer-volume" :style="{ height: `${aplayer.muted ? 0 : aplayer.volume * 100}%`, background: `${aplayer.coverColor[aplayer.index] || audio?.theme || aplayer.theme}` }"></div>
                    </div>
                </div>
            </div>
            <button type="button" class="aplayer-icon aplayer-icon-order" @click="orderButtonClick">
                <Icon type="orderList" v-show="aplayer.order === 'list'"></Icon>
                <Icon type="orderRandom" v-show="aplayer.order === 'random'"></Icon>
            </button>
            <button type="button" class="aplayer-icon aplayer-icon-loop" @click="loopButtonClick">
                <Icon type="loopOne" v-show="aplayer.loop === 'one'"></Icon>
                <Icon type="loopAll" v-show="aplayer.loop === 'all'"></Icon>
                <Icon type="loopNone" v-show="aplayer.loop === 'none'"></Icon>
            </button>
            <button type="button" class="aplayer-icon aplayer-icon-menu" @click="$emit('toggleList')">
                <Icon type="menu"></Icon>
            </button>
            <button type="button" :class="{ 'aplayer-icon': true, 'aplayer-icon-lrc': true, 'aplayer-icon-lrc-inactivity': !aplayer.lyricShow }" @click="$emit('toggleLrc')">
                <Icon type="lrc"></Icon>
            </button>
        </div>
    </div>
</template>
<script>
    import utils from "../utils/utils.js";
    import Icon from "./Icon.vue";

    const loopArr = ["one", "all", "none"];
    const orderArr = ["list", "random"];

    export default {
        components: {
            utils,
            Icon,
        },
        props: ["aplayer", "audioStatus", "styleStatus"],
        data () {
            return {
                aplayerThumbShowStatus: false,
                volumeBarShowStatus: false,
            }
        },
        computed: {
            aplayerBar () {
                return this.$refs.aplayerBar;
            },
            volumeBar () {
                return this.$refs.volumeBar;
            },
            switchVolumeIcon () {
                if (this.aplayer.muted || this.aplayer.volume <= 0) return "volumeOff";
                if (this.aplayer.volume >= 0.95) return "volumeUp";
                return "volumeDown";
            },
            audio () {
                return this.aplayer.audio[this.aplayer.index];
            },
            duration () {
                return utils.secondToTime(this.audioStatus.duration);
            },
            playedTime: {
                get () {
                    return utils.secondToTime(this.audioStatus.playedTime);
                },
                set (time) {
                    this.$emit("playedTime", time);
                }
            },
            disableTimeUpdate: {
                get () {
                    return this.audioStatus.disableTimeUpdate;
                },
                set (status) {
                    this.$emit("disableTimeUpdate", status);
                },
            }
        },
        methods: {
            loopButtonClick () {
                let index = loopArr.indexOf(this.aplayer.loop);
                index = (index + 1) % loopArr.length;
                this.$emit("setLoop", loopArr[index]);
            },
            orderButtonClick () {
                let index = orderArr.indexOf(this.aplayer.order);
                index = (index + 1) % orderArr.length;
                this.$emit("setOrder", orderArr[index]);
            },

            aplayerBarMoving (e) {
                let percentage = ((e.clientX || e.changedTouches[0].clientX) - this.aplayerBar.getBoundingClientRect().left) / this.aplayerBar.clientWidth;
                percentage = Math.max(percentage, 0);
                percentage = Math.min(percentage, 1);
                this.playedTime = percentage * this.audioStatus.duration;
                this.$emit("updateLyric");
            },
            aplayerBarMoveEnd (e) {
                document.removeEventListener(utils.eventsName.moveEnd, this.aplayerBarMoveEnd);
                document.removeEventListener(utils.eventsName.moving, this.aplayerBarMoving);
                let percentage = ((e.clientX || e.changedTouches[0].clientX) - this.aplayerBar.getBoundingClientRect().left) / this.aplayerBar.clientWidth;
                percentage = Math.max(percentage, 0);
                percentage = Math.min(percentage, 1);
                this.$emit("seek", percentage * this.audioStatus.duration);
                this.disableTimeUpdate = false;
            },
            aplayerBarMoveStart () {
                this.disableTimeUpdate = true;
                document.addEventListener(utils.eventsName.moving, this.aplayerBarMoving);
                document.addEventListener(utils.eventsName.moveEnd, this.aplayerBarMoveEnd);
            },

            volumeBarMoving (e) {
                let percentage = 1 - ((e.clientY || e.changedTouches[0].clientY) - this.volumeBar.getBoundingClientRect().top) / this.volumeBar.clientHeight;
                percentage = Math.max(percentage, 0);
                percentage = Math.min(percentage, 1);
                this.$emit("setVolume", percentage);
            },
            volumeBarMoveEnd (e) {
                this.volumeBarShowStatus = false;
                document.removeEventListener(utils.eventsName.moveEnd, this.volumeBarMoveEnd);
                document.removeEventListener(utils.eventsName.moving, this.volumeBarMoving);
                let percentage = 1 - ((e.clientY || e.changedTouches[0].clientY) - this.volumeBar.getBoundingClientRect().top) / this.volumeBar.clientHeight;
                percentage = Math.max(percentage, 0);
                percentage = Math.min(percentage, 1);
                this.$emit("setVolume", percentage, true);
            },
            volumeBarMoveStart () {
                this.volumeBarShowStatus = true;
                document.addEventListener(utils.eventsName.moving, this.volumeBarMoving);
                document.addEventListener(utils.eventsName.moveEnd, this.volumeBarMoveEnd);
            },
        },
        mounted () {
            this.aplayerBar.parentNode.addEventListener(utils.eventsName.moveStart, this.aplayerBarMoveStart);
            this.volumeBar.parentNode.addEventListener(utils.eventsName.moveStart, this.volumeBarMoveStart);
        },
        beforeUnmount () {
            this.aplayerBar.parentNode.removeEventListener(utils.eventsName.moveStart, this.aplayerBarMoveStart);
            this.volumeBar.parentNode.removeEventListener(utils.eventsName.moveStart, this.volumeBarMoveStart);
        }
    }
</script>