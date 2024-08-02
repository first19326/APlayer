<template>
    <div class="aplayer" v-if="!destroyComponent" :class="{ 'aplayer-narrow': styleStatus.narrow, 'aplayer-fixed': aplayer.mode === 'fixed', 'aplayer-mini': (aplayer.mode === 'mini' || (aplayer.mode === 'fixed' && styleStatus.mini)), 'aplayer-loading': (audioStatus.playStatus && audioStatus.waitingStatus), 'aplayer-withlist': (aplayer.audio.length > 1), 'aplayer-withlrc': (aplayer.mode === 'normal' && aplayer.lyricShow), 'aplayer-mobile': styleStatus.isMobile }" ref="aplayer">
        <List v-if="aplayer.mode === 'fixed'" :aplayer="aplayer" @play="play" @toggle="toggle" @switchList="switchList" ref="list" />
        <div class="aplayer-body" :style="{ width: `${aplayer.mode === 'fixed' ? 'calc(100% - 18px)' : '100%'}` }">
            <div class="aplayer-pic" :style="coverStyle" @click="toggle">
                <div class="aplayer-button" :class="{ 'aplayer-play': !audioStatus.playStatus, 'aplayer-pause': audioStatus.playStatus }">
                    <div ref="switch">
                        <Icon type="play" v-show="!audioStatus.playStatus"></Icon>
                        <Icon type="pause" v-show="audioStatus.playStatus"></Icon>
                    </div>
                </div>
            </div>
            <div class="aplayer-info" ref="info">
                <div class="aplayer-music">
                    <span class="aplayer-title">{{ aplayer.audio[aplayer.index] ? aplayer.audio[aplayer.index].name : "No Audio" }}</span>
                    <span class="aplayer-author">{{ aplayer.audio[aplayer.index] ? " - " + aplayer.audio[aplayer.index].artist : "" }}</span>
                </div>
                <Lyric v-if="aplayer.mode === 'normal'" v-show="aplayer.lyricShow" :aplayer="aplayer" ref="lyric" />
                <Controller :aplayer="aplayer" :audioStatus="audioStatus" :styleStatus="styleStatus" @playedTime="playedTime" @disableTimeUpdate="disableTimeUpdate" @toggle="toggle" @skipBack="skipBack" @skipForward="skipForward" @seek="seek" @mute="mute" @setLoop="setLoop" @setOrder="setOrder" @toggleList="toggleList" @toggleLrc="toggleLrc" @setVolume="setVolume" />
            </div>
            <div class="aplayer-notice" :style="{ opacity: aplayer.noticeOpacity }">{{ aplayer.noticeText }}</div>
            <div class="aplayer-miniswitcher" @click="styleStatus.mini = !styleStatus.mini">
                <button class="aplayer-icon">
                    <Icon type="right"></Icon>
                </button>
            </div>
        </div>
        <List v-if="aplayer.mode === 'normal'" :aplayer="aplayer" @play="play" @toggle="toggle" @switchList="switchList" ref="list" />
        <Lyric v-if="aplayer.mode === 'fixed'" v-show="aplayer.lyricShow" :aplayer="aplayer" ref="lyric" />
        <audio ref="audio"></audio>
    </div>
</template>
<script>
    import smoothScroll from "smoothScroll";
    import utils from "./utils/utils.js";
    import Icon from "./components/Icon.vue";
    import List from "./components/List.vue";
    import Lyric from "./components/Lyric.vue";
    import Controller from "./components/Controller.vue";

    let activeMutexInstance = null;

    const mediaEvents = [
        "abort",
        "canplay", "canplaythrough",
        "durationchange",
        "emptied", "encrypted", "ended", "error",
        "interruptbegin", "interruptend",
        "loadeddata", "loadedmetadata", "loadstart",
        "mozaudioavailable",
        "pause", "play", "playing", "progress",
        "ratechange",
        "seeked", "seeking", "stalled", "suspend",
        "timeupdate",
        "volumechange",
        "waiting",
    ];

    const aplayer = {
        name: "APlayer",
        components: {
            smoothScroll,
            utils,
            Icon,
            List,
            Lyric,
            Controller,
        },
        props: {
            audio: {
                type: Array,
                default: [],
            },
            mode: {
                type: String,
                default: "normal", // "normal", "fixed", "mini"
            },
            autoplay: {
                type: Boolean,
                default: false,
            },
            mutex: {
                type: Boolean,
                default: true,
            },
            preload: {
                type: String,
                default: "metadata", // "auto", "metadata", "none"
            },
            theme: {
                type: String,
                default: "#B7DAFF",
            },
            autoSwitch: {
                type: Boolean,
                default: true,
            },
            loop: {
                type: String,
                default: "all", // "one", "all", "none"  
            },
            order: {
                type: String,
                default: "list", // "list", "random"
            },
            muted: {
                type: Boolean,
                default: false,
            },
            volume: {
                type: Number,
                default: 0.7,
                validator (value) {
                    return value >= 0 && value <= 1;
                },
            },
            lrcType: {
                type: Number,
                default: 1,
            },
            lrcShow: {
                type: Boolean,
                default: true,
            },
            listFolded: {
                type: Boolean,
                default: false,
            },
            listMaxHeight: {
                type: Number,
                default: 250,
            },
            noticeSwitch: {
                type: Boolean,
                default: true,
            },
            storageName: {
                type: String,
                default: "aplayer-setting",
            }
        },
        data () {
            return {
                aplayer: {
                    index: 0,
                    audio: [],
                    randomOrder: [],
                    mode: this.mode,
                    autoplay: this.autoplay,
                    mutex: this.mutex,
                    preload: this.preload,
                    theme: this.theme,
                    autoSwitch: this.autoSwitch,
                    coverColor: [],
                    loop: this.loop,
                    order: this.order,
                    muted: this.muted,
                    volume: this.volume,
                    lyricType: this.lrcType,
                    lyricShow: this.lrcShow,
                    lyricIndex: 0,
                    lyrics: [],
                    listFolded: this.listFolded,
                    listMaxHeight: this.listMaxHeight,
                    noticeSwitch: this.noticeSwitch,
                    noticeText: "",
                    noticeOpacity: 0,
                    storageName: this.storageName,
                    storage: {},
                },
                audioStatus: {
                    duration: 0,
                    loadedTime: 0,
                    playedTime: 0,
                    playStatus: false,
                    waitingStatus: false,
                    disableTimeUpdate: false,
                },
                styleStatus: {
                    isMobile: /mobile/i.test(window.navigator.userAgent),
                    narrow: false,
                    timeNarrow: false,
                    mini: true,
                },
                destroyComponent: false,
            }
        },
        computed: {
            audioRef () {
                return this.$refs.audio;
            },
            coverStyle () {
                let audio = this.aplayer.audio[this.aplayer.index];
                if (!audio?.cover) {
                    return {
                        "background-color": `${this.aplayer.coverColor[this.aplayer.index] || audio?.theme || this.aplayer.theme}`
                    }
                }
                return {
                    "background-image": `url(${audio.cover})`,
                    "background-color": `${this.aplayer.coverColor[this.aplayer.index] || audio?.theme || this.aplayer.theme}`
                }
            },
        },
        methods: {
            // internal methods
            getStorage (key) {
                return this.aplayer.storage[key];
            },
            setStorage (key, value) {
                this.aplayer.storage[key] = value;
                localStorage.setItem(this.aplayer.storageName, JSON.stringify(this.aplayer.storage));
            },
            setAudio (audio) {
                if (this.hls) {
                    this.hls.destroy();
                    this.hls = null;
                }
                let type = audio.type;
                if (!type || type === "auto") {
                    type = (/m3u8(#|\?|$)/i.exec(audio.url)) ? "hls" : "normal";
                }
                if (type === "hls") {
                    if (Hls.isSupported()) {
                        this.hls = new Hls();
                        this.hls.loadSource(audio.url);
                        this.hls.attachMedia(this.audioRef);
                    } else if (this.audioRef.canPlayType("application/x-mpegURL") || this.audioRef.canPlayType("application/vnd.apple.mpegURL")) {
                        this.audioRef.src = audio.url;
                    } else {
                        this.setNotice("Error: HLS is not supported.");
                    }
                } else if (type === "normal") {
                    this.audioRef.src = audio.url;
                }
            },
            prevIndex () {
                let index = this.aplayer.index;
                if (this.aplayer.audio.length > 1) {
                    if (this.aplayer.order === "list") {
                        return index - 1 < 0 ? this.aplayer.audio.length - 1 : index - 1;
                    } else if (this.aplayer.order === "random") {
                        let randomIndex = this.aplayer.randomOrder.indexOf(index);
                        if (randomIndex === 0) {
                            return this.aplayer.randomOrder[this.aplayer.randomOrder.length - 1];
                        } else {
                            return this.aplayer.randomOrder[randomIndex - 1];
                        }
                    }
                } else {
                    return 0;
                }
            },
            nextIndex () {
                let index = this.aplayer.index;
                if (this.aplayer.audio.length > 1) {
                    if (this.aplayer.order === "list") {
                        return (index + 1) % this.aplayer.audio.length;
                    } else if (this.aplayer.order === "random") {
                        let randomIndex = this.aplayer.randomOrder.indexOf(index);
                        if (randomIndex === this.aplayer.randomOrder.length - 1) {
                            return this.aplayer.randomOrder[0];
                        } else {
                            return this.aplayer.randomOrder[randomIndex + 1];
                        }
                    }
                } else {
                    return 0;
                }
            },
            coverColor () {
                let isEmpty = !this.aplayer.coverColor[this.aplayer.index];
                if (this.aplayer.autoSwitch && isEmpty) {
                    try {
                        if (!this.colorThief) {
                            this.colorThief = new ColorThief();
                        }
                        this.colorThief.getColorAsync(this.aplayer.audio[this.aplayer.index]?.cover, ([red, green, blue]) => this.aplayer.coverColor[this.aplayer.index] = `rgb(${red}, ${green}, ${blue})`);
                    } catch (e) {
                        this.aplayer.autoSwitch = false;
                        this.setNotice("The color-thief is required to support self-adapting theme.");
                    }
                }
            },
            switchStyle () {
                if (this.$refs.switch) {
                    this.$refs.switch.style.display = "none";
                    setTimeout(() => {
                        if (this.$refs.switch) {
                            this.$refs.switch.style.display = "block";
                        }
                    }, 100);
                }
            },
            loadedTime () {
                return this.audioRef.buffered.length ? this.audioRef.buffered.end(this.audioRef.buffered.length - 1) : 0;
            },
            playedTime (time) {
                this.audioStatus.playedTime = time;
            },
            disableTimeUpdate (status) {
                this.audioStatus.disableTimeUpdate = status;
            },
            async loadLyric (lrc, index) {
                try {
                    let response = await fetch(this.aplayer.audio[index].lrc);
                    if (response.ok || response.status === 304) {
                        lrc = utils.parse(await response.text());
                    } else {
                        this.setNotice("LRC file request fails: status " + response.status);
                    } 
                } catch (e) {
                    console.warn(e);
                } finally {
                    this.aplayer.lyrics[index] = lrc;
                    this.updateLyric();
                }
            },
            switchLyric (index) {
                if (this.aplayer.lyrics[index]) {
                    return ;
                }
                let lrc = [[0, "Not available"]];
                if (this.aplayer.lyricType === 1) {
                    // async
                    this.aplayer.lyrics[index] = [[0, "Loading"]];
                    this.loadLyric(lrc, index);
                } else if (this.aplayer.lyricType === 2) {
                    // sync
                    if (this.aplayer.audio[index].lrc) {
                        lrc = utils.parse(this.aplayer.audio[index].lrc);
                    }
                    this.aplayer.lyrics[index] = lrc;
                    this.updateLyric();
                }
            },
            updateLyric () {
                let lyric = this.aplayer.lyrics[this.aplayer.index];
                if (lyric) {
                    for (let i = 0; i < lyric.length; i++) {
                        const current = lyric[i];
                        const next = lyric[i + 1];
                        if (this.audioStatus.playedTime >= current[0] && (!next || this.audioStatus.playedTime < next[0])) {
                            this.aplayer.lyricIndex = i;
                        }
                    }
                }
            },
            // expose methods
            init () {
                this.destroyComponent = false;

                // load localstorage data
                this.aplayer.storage = JSON.parse(localStorage.getItem(this.aplayer.storageName)) || {};
                this.aplayer.volume = this.getStorage("volume") || this.aplayer.volume;

                // set audio
                this.audioRef.preload = this.aplayer.preload;
                this.audioRef.muted = this.aplayer.muted;
                this.audioRef.volume = this.aplayer.volume;

                // bind events
                mediaEvents.forEach(event => {
                    this.audioRef.addEventListener(event, e => this.$emit(event, e));
                });

                this.audioRef.addEventListener('play', () => this.audioStatus.playStatus = true);
                this.audioRef.addEventListener('pause', () => this.audioStatus.playStatus = false);
                this.audioRef.addEventListener('timeupdate', this.timeupdate);
                // show audio time: the metadata has loaded or changed
                this.audioRef.addEventListener('durationchange', this.durationchange);
                // can seek now
                this.audioRef.addEventListener('loadedmetadata', this.loadedmetadata);
                // show audio loaded bar: to inform interested parties of progress downloading the media
                this.audioRef.addEventListener('canplay', this.canplay);
                this.audioRef.addEventListener('progress', this.progress);
                // audio download error: an error occurs
                this.audioRef.addEventListener('error', this.error);
                // multiple audio play
                this.audioRef.addEventListener('ended', this.ended);
                // audio loading
                this.audioRef.addEventListener('waiting', this.waiting);
                // audio loaded
                this.audioRef.addEventListener('playing', this.playing);

                window.addEventListener("resize", this.resize);

                this.addList(this.audio, true);
                this.aplayer.autoplay && this.play();
                this.$emit("init");
            },
            play () {
                this.switchStyle();
                this.audioStatus.playStatus = true;
                this.$nextTick(() => {
                    this.audioStatus.playStatus = true;
                    if (this.aplayer.mutex) {
                        if (activeMutexInstance && activeMutexInstance !== this) {
                            activeMutexInstance.pause();
                        }
                        activeMutexInstance = this;
                    }

                    const playPromise = this.audioRef.play();
                    if (playPromise) {
                        playPromise.catch((e) => {
                            console.warn(e);
                            if (e.name === 'NotAllowedError') {
                                this.audioStatus.playStatus = false;
                            }
                        });
                    }
                });
            },
            pause () {
                this.switchStyle();
                this.audioStatus.playStatus = false;
                this.audioRef.pause();
            },
            toggle () {
                !this.audioStatus.playStatus ? this.play() : this.pause();
            },
            seek (time) {
                time = Math.max(time, 0);
                time = Math.min(time, this.audioStatus.duration);
                this.audioStatus.playedTime = time;
                this.audioRef.currentTime = time;
            },
            mute () {
                this.aplayer.muted = !this.aplayer.muted;
                this.audioRef.muted = !this.audioRef.muted;
            },
            setVolume (volume, storage = false) {
                volume = parseFloat(volume);
                if (!isNaN(volume)) {
                    volume = Math.max(volume, 0);
                    volume = Math.min(volume, 1);

                    this.aplayer.volume = volume;
                    this.audioRef.volume = volume;
                    storage && this.setStorage("volume", volume);

                    if (this.aplayer.muted) {
                        this.mute();
                    }
                }
            },
            // user set theme > auto cover theme > audio theme > aplayer theme
            setTheme (color, index = this.aplayer.index) {
                if (color) {
                    if (this.aplayer.coverColor[index]) {
                        this.aplayer.coverColor[index] = color;
                    } else if (this.aplayer.audio[index]) {
                        this.aplayer.audio[index].theme = color
                    }
                }
            },
            setMode (mode = "normal") {
                if (mode != "normal" && mode != "fixed" && mode != "mini") {
                    return ;
                }
                this.aplayer.mode = mode;

                // reset style status
                setTimeout(() => {
                    this.resize();
                }, 0);
            },
            setLoop (loop) {
                if (loop != "one" && loop != "all" && loop != "none") {
                    return ;
                }
                if (this.aplayer.audio.length <= 1 && loop === "one") {
                    loop = "all";
                }
                this.aplayer.loop = loop;
            },
            setOrder (order) {
                if (order != "list" && order != "random") {
                    return ;
                }
                this.aplayer.order = order;
            },
            setNotice (text, time = 2000, opacity = 0.8) {
                if (!this.aplayer.noticeSwitch || this.aplayer.mode === "mini" || (this.aplayer.mode === "fixed" && this.styleStatus.mini)) {
                    console.warn(text);
                    return ;
                }
                this.aplayer.noticeText = text;
                this.aplayer.noticeOpacity = opacity;
                if (this.noticeTimeout) {
                    clearTimeout(this.noticeTimeout);
                }
                this.$emit("noticeshow");
                if (time) {
                    this.noticeTimeout = setTimeout(() => {
                        this.aplayer.noticeOpacity = 0;
                        this.$emit("noticehide");
                    }, time);
                }
            },
            skipBack () {
                this.switchList(this.prevIndex());
            },
            skipForward () {
                this.switchList(this.nextIndex());
            },
            destroy () {
                this.destroyComponent = true;
                this.$emit("destroy");
            },
            showLrc () {
                this.$emit("lrcshow");
                this.aplayer.lyricShow = true;
            },
            hideLrc () {
                this.$emit("lrchide");
                this.aplayer.lyricShow = false;
            },
            toggleLrc () {
                !this.aplayer.lyricShow ? this.showLrc() : this.hideLrc();
            },
            showList () {
                this.$emit("listshow");
                if (this.aplayer.mode !== "mini") {
                    this.$refs.list.showList();
                }
                this.aplayer.listFolded = true;
            },
            hideList () {
                this.$emit("listhide");
                this.aplayer.listFolded = false;
            },
            toggleList () {
                !this.aplayer.listFolded ? this.showList() : this.hideList();
            },
            addList (audios, clear = false) {
                this.$emit("listadd", audios);
                if (Object.prototype.toString.call(audios) !== "[object Array]") {
                    audios = [audios];
                }

                audios.map((item) => {
                    item.name = item.name || item.title || "Audio Name";
                    item.artist = item.artist || item.author || "Audio Artist";
                    item.cover = item.cover || item.pic;
                    item.type = item.type || "normal";
                    return item;
                });

                const isEmpty = this.aplayer.audio.length === 0;

                if (clear) {
                    this.aplayer.audio = [];
                }
                this.aplayer.audio = this.aplayer.audio.concat(audios);

                this.aplayer.randomOrder = utils.randomOrder(this.aplayer.audio.length);

                if (isEmpty) {
                    let index = 0;
                    if (this.aplayer.order === "random") {
                        index = this.aplayer.randomOrder[0];
                    }
                    this.switchList(index);
                }
            },
            removeList (index) {
                this.$emit("listremove", nextIndex);
                this.aplayer.coverColor.splice(index, 1);
                this.aplayer.randomOrder.splice(this.aplayer.randomOrder.indexOf(this.aplayer.audio.length - 1), 1);
                if (this.aplayer.audio[index]) {
                    if (this.aplayer.audio.length > 1) {
                        this.aplayer.audio.splice(index, 1);
                        if (index === this.aplayer.index) {
                            if (this.aplayer.audio[index]) {
                                this.switchList(index);
                            } else {
                                this.switchList(index - 1);
                            }
                        }
                        if (this.aplayer.index > index) {
                            this.aplayer.index--;
                        }
                    } else {
                        this.clearList();
                    }
                }
                this.aplayer.lyrics.splice(index, 1);
            },
            switchList (index) {
                this.$emit("listswitch", index);
                if (typeof index !== "undefined" && this.aplayer.audio[index]) {
                    this.aplayer.index = index;
                    this.coverColor();
                    if (this.aplayer.mode !== "mini") {
                        smoothScroll(index * 33, 500, null, this.$refs.list.ol);
                    }
                    // set audio
                    this.setAudio(this.aplayer.audio[index]);
                    // set lyric
                    this.switchLyric(index);
                    // set time
                    this.audioStatus.duration = 0;
                    this.audioStatus.playedTime = 0;
                }
            },
            clearList () {
                this.$emit("listclear");
                this.pause();
                this.audioRef.src = "";
                this.aplayer.audio = [];
                this.aplayer.randomOrder = [];
                this.aplayer.coverColor = [];
                this.aplayer.lyrics = [];
                this.aplayer.index = 0;
                this.aplayer.lyricIndex = 0;
                this.audioStatus.duration = 0;
                this.audioStatus.loadedTime = 0;
                this.audioStatus.playedTime = 0;
                this.audioStatus.playStatus = false;
                this.audioStatus.waitingStatus = false;
                this.audioStatus.disableTimeUpdate = false;
            },
            // media events
            timeupdate () {
                if (!this.audioStatus.disableTimeUpdate) {
                    this.audioStatus.playedTime = this.audioRef.currentTime;
                }
                this.updateLyric();
            },
            durationchange () {
                this.audioStatus.duration = this.audioRef.duration;
            },
            loadedmetadata () {
                this.seek(0);
                this.audioStatus.playStatus && this.audioRef.play();
            },
            canplay () {
                this.audioStatus.loadedTime = this.loadedTime();
            },
            progress () {
                this.audioStatus.loadedTime = this.loadedTime();
            },
            error () {
                if (this.aplayer.audio.length > 1) {
                    let playStatus = this.audioStatus.playStatus;
                    this.setNotice("An audio error has occurred, player will skip forward in 2 seconds.");
                    this.skipForwardTimeout && clearTimeout(this.skipForwardTimeout);
                    this.skipForwardTimeout = setTimeout(() => {
                        this.skipForward();
                        playStatus && this.play();
                    }, 2000);
                } else if (this.aplayer.audio.length === 1) {
                    this.setNotice("An audio error has occurred.");
                }
            }, 
            ended () {
                let index = this.aplayer.index;
                if (this.aplayer.loop === "none") {
                    this.skipForward();
                    if (this.aplayer.order === "list") {
                        (index < this.aplayer.audio.length - 1) ? this.play() : this.pause();
                    } else if (this.aplayer.order === "random") {
                        (this.aplayer.randomOrder.indexOf(index) < this.aplayer.randomOrder.length - 1) ? this.play() : this.pause();
                    }
                } else if (this.aplayer.loop === "one") {
                    this.switchList(index);
                    this.play();
                } else if (this.aplayer.loop === "all") {
                    this.skipForward();
                    this.play();
                }
            },
            waiting () {
                this.audioStatus.waitingStatus = true;
            },
            playing () {
                this.audioStatus.waitingStatus = false;
            },
            resize () {
                if (this.aplayer.mode === "normal") {
                    this.styleStatus.narrow = (this.$refs.aplayer.offsetWidth <= 300);
                    this.styleStatus.timeNarrow = (this.$refs.info.offsetWidth <= 200);
                } else {
                    this.styleStatus.narrow = window.innerWidth <= 318;
                    this.styleStatus.timeNarrow = true;
                }
            },
        },
        watch: {
            audio (audio) {
                this.addList(audio, true);
            }
        },
        mounted () {
            this.init();
        },
        beforeUnmount () {
            this.clearList();

            this.hls && this.hls.destroy();
            if (activeMutexInstance === this) activeMutexInstance = null;
            this.colorThief = null;
            this.noticeTimeout && clearTimeout(this.noticeTimeout);
            this.skipForwardTimeout && clearTimeout(this.skipForwardTimeout);

            // remove bind events
            mediaEvents.forEach(event => {
                this.audioRef.removeEventListener(event, e => this.$emit(event, e));
            });

            this.audioRef.removeEventListener('play', () => this.audioStatus.playStatus = true);
            this.audioRef.removeEventListener('pause', () => this.audioStatus.playStatus = false);
            this.audioRef.removeEventListener('timeupdate', this.timeupdate);
            this.audioRef.removeEventListener('durationchange', this.durationchange);
            this.audioRef.removeEventListener('loadedmetadata', this.loadedmetadata);
            this.audioRef.removeEventListener('canplay', this.canplay);
            this.audioRef.removeEventListener('progress', this.progress);
            this.audioRef.removeEventListener('error', this.error);
            this.audioRef.removeEventListener('ended', this.ended);
            this.audioRef.removeEventListener('waiting', this.waiting);
            this.audioRef.removeEventListener('playing', this.playing);
            window.removeEventListener("resize", this.resize);
        }
    };
    export default aplayer;
</script>
<style lang="scss">
    @import "./style/index";
</style>