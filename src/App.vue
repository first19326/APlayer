<template>
    <div class="tools">
        <a href="https://vitejs.dev" target="_blank"><img src="./assets/vite.svg?url" class="logo" alt="Vite logo" /></a>
        <a href="https://vuejs.org/" target="_blank"><img src="./assets/vue.svg?url" class="logo vue" alt="Vue logo" /></a>
    </div>
    <div class="project">
        <h2><a href="https://github.com/first19326/aplayer">Vue-APlayer</a></h2>
        <span class="description">—— Vue 3.x for APlayer.</span>
    </div>
    <APlayer :audio="audio" :lrcType=1 ref="aplayer" style="max-width: 600px" />
    <APlayer :audio="fixedAudio" mode="fixed" />
    <div class="data">
        <div class="column">
            <span>跳转时间</span><input type="text" v-model="time" @focus="focus" @blur="blur" />
        </div>
        <div class="column">
            <span>音频音量</span><input type="text" v-model="volume" @focus="focus" @blur="blur" />
        </div>
        <div class="column">
            <span>主题颜色</span><input type="text" v-model="theme" @focus="focus" @blur="blur" />
        </div>
        <div class="column">
            <span>当前模式</span><input type="text" v-model="mode" @focus="focus" @blur="blur" />
        </div>
        <div class="column">
            <span>通知内容</span><input type="text" v-model="notice" @focus="focus" @blur="blur" />
        </div>
        <div class="column">
            <span>音频信息</span><input type="text" v-model="audios" @focus="focus" @blur="blur" />
        </div>
        <div class="column">
            <span>当前音频</span><input type="text" v-model="index" @focus="focus" @blur="blur" />
        </div>
    </div>
    <div class="controller">
        <div class="button" @click="aplayer.play"><span>播放音频</span></div>
        <div class="button" @click="aplayer.pause"><span>暂停音频</span></div>
        <div class="button" @click="aplayer.toggle"><span>播放/暂停音频</span></div>
        <div class="button" @click="seek"><span>跳转特定时间</span></div>
        <div class="button" @click="setVolume"><span>设置音频音量</span></div>
        <div class="button" @click="setTheme"><span>设置主题颜色</span></div>
        <div class="button" @click="setMode"><span>设置播放器模式</span></div>
        <div class="button" @click="setNotice"><span>显示通知</span></div>
        <div class="button" @click="aplayer.skipBack"><span>上一首音频</span></div>
        <div class="button" @click="aplayer.skipForward"><span>下一首音频</span></div>
        <div class="button" @click="aplayer.destroy"><span>销毁播放器</span></div>
        <div class="button" @click="aplayer.showLrc"><span>显示歌词</span></div>
        <div class="button" @click="aplayer.hideLrc"><span>隐藏歌词</span></div>
        <div class="button" @click="aplayer.toggleLrc"><span>显示/隐藏歌词</span></div>
        <div class="button" @click="aplayer.showList"><span>显示播放列表</span></div>
        <div class="button" @click="aplayer.hideList"><span>隐藏播放列表</span></div>
        <div class="button" @click="aplayer.toggleList"><span>显示/隐藏播放列表</span></div>
        <div class="button" @click="addAudios"><span>添加音频</span></div>
        <div class="button" @click="removeList"><span>移除音频</span></div>
        <div class="button" @click="switchList"><span>切换音频</span></div>
        <div class="button" @click="aplayer.clearList"><span>清空播放列表</span></div>
    </div>   
</template>
<script setup>
    import APlayer from "./components/vue-aplayer/APlayer.vue";
    // import APlayer from "@worstone/vue-aplayer";
    // import Hls from "hls.js";
    // import ColorThief from "color-thief";
    import { onMounted, ref } from "vue";

    // aplayer ref
    const aplayer = ref(null);

    // input value
    const time = ref(60);
    const volume = ref(0.7);
    const theme = ref('#41B883');
    const mode = ref('normal');
    const notice = ref('This is a notice of aplayer.');
    // please use '"' for the standard JSON format
    const audios = ref('{"title": "念", "author": "薛之谦", "pic": "https://p1.music.126.net/QxtlFDWCaKICD00pGIlzNg==/109951168739117009.jpg", "url": "https://api-meting.imsyy.top/api?server=netease&type=url&id=2064033095", "lrc": "https://api-meting.imsyy.top/api?server=netease&type=lrc&id=2064033095"}');
    const index = ref(1);

    // init data
    const audio = ref([
        {
            "title": "烟雨行舟（原唱：伦桑）",
            "author": "司南",
            "url": "https://api.i-meto.com/meting/api?server=netease&type=url&id=1301884692&auth=898d1269a732530c578b63624fe8be0bdfc14205",
            "pic": "https://api.i-meto.com/meting/api?server=netease&type=pic&id=109951167056907210&auth=a4976ca0e04dc7a5592a706e1bd70c93acd1591f",
            "lrc": "http://api.i-meto.com/meting/api?server=netease&type=lrc&id=1301884692&auth=425c4730fe0caf12cf4c0eabacc3398097c8ba49"
            // "lrc": "[00:00.00] 作词 : Bye[00:01.00] 作曲 : Bye[00:21.95]编曲：Bye[00:23.58]混音：MR鱼[00:25.24]母带：MR曾经[00:27.09]封面：小草清清[00:38.07]烟雨入江南[00:40.33]山水如墨染[00:43.02]宛若丹青未干[00:44.93]提笔然 点欲穿[00:48.59]行舟临秀川[00:50.89]画鹢推清澜[00:54.06]缱绻怡然[00:58.96]天色沉靛蓝[01:01.64]波光似锦缎[01:04.31]缀着零星白帆[01:06.79]诗情满 千卷难[01:09.79]渔舟齐桅杆[01:12.36]鸳鸯凭舷栏[01:15.37]琴瑟相伴[01:21.05]一叶轻船[01:23.41]一双桨悠懒[01:26.28]一绵江风微拂素罗衫[01:31.95]渔火点点聚散[01:34.38]欸乃声声浅淡[01:37.14]天近晚[01:38.74]炊烟袅飘沿斑[01:42.41]一叶轻船[01:44.73]一双人倚揽[01:47.70]一曲烟雨行舟太缓慢[01:53.16]执手相看[01:55.59]把酒当歌言欢[01:58.73]红尘路漫漫[02:02.05]愿今生与你共览[02:51.49]暮霭渐褪暗[02:53.70]胭脂余味淡[02:56.30]我支着竹绢伞[02:58.75]你闲摆花团扇[03:01.82]浪儿晃曳慢[03:04.30]夜垂云流缓[03:07.54]且吟且谈[03:13.08]一叶轻船[03:15.52]一双桨悠懒[03:18.40]一绵江风微拂素罗衫[03:23.88]渔火点点聚散[03:26.38]欸乃声声浅淡[03:29.10]天近晚[03:30.79]炊烟袅飘沿斑[03:34.57]一叶轻船[03:36.78]一双人倚揽[03:39.69]一雨烟雨行舟太缓慢[03:45.01]执手相看[03:47.48]把酒当歌言欢[03:50.72]红尘路漫漫[03:54.18]欲今生与你共览[03:57.64]一叶轻船[03:58.32]一双月对半[04:01.13]一帘清梦幽幽醉阑珊[04:06.21]移舟靠岸[04:09.10]案前惟剩空盏[04:12.14]莫怨良辰短[04:15.47]曲终了韵意未完[04:20.47]*第一次制作，感谢支持。"
        },
        {
            "title": "Legends Never Die",
            "author": "Against the Current",
            "url": "https://api.i-meto.com/meting/api?server=netease&type=url&id=506196018&auth=c5c21102c12896557ecf3fd43a415c050fe757a6",
            "pic": "https://api.i-meto.com/meting/api?server=netease&type=pic&id=109951163918904060&auth=ab3ada1788834c2c30fc14be2320219dbeaebc12",
            "lrc": "https://api.i-meto.com/meting/api?server=netease&type=lrc&id=506196018&auth=9038409d31ec7f40ea7888b77f0839051a2859a5"
        }
    ]);
    const fixedAudio = ref([]);

    // input events
    const focus = (event) => {
        event.target.classList.add("active");
    }
    const blur = (event) => {
        event.target.classList.remove("active");
    }

    // aplayer events
    const seek = () => {
        aplayer.value.seek(time.value);
    }
    const setVolume = () => {
        aplayer.value.setVolume(volume.value);
    }
    const setTheme = () => {
        aplayer.value.setTheme(theme.value);
    }
    const setMode = () => {
        aplayer.value.setMode(mode.value);
    }
    const setNotice = () => {
        aplayer.value.setNotice(notice.value);
    }
    const addAudios = () => {
        aplayer.value.addList(JSON.parse(audios.value));
    }
    const removeList = () => {
        aplayer.value.removeList(index.value - 1);
    }
    const switchList = () => {
        aplayer.value.switchList(index.value - 1);
    }

    // onmounted methods
    const loadAudios = async () => {
        const response = await fetch("https://api.i-meto.com/meting/api?server=netease&type=playlist&id=2243342814");
        let audios = await response.json();
        aplayer.value.addList(audios);
        fixedAudio.value = audios;
    }

    onMounted(() => {
        loadAudios();
    });
</script>
<style lang="scss" scoped>
    .tools {
        .logo {
            height: 6em;
            padding: 1.5em;
            will-change: filter;
            transition: filter 300ms;

            &:hover {
                filter: drop-shadow(0 0 2em #646CFFAA);
            }

            &.vue:hover {
                filter: drop-shadow(0 0 2em #42B883AA);
            }
        }
    }

    .project {
        position: relative;
        margin-bottom: 100px;
        cursor: pointer;

        h2 {
            display: inline-block;
            font-size: 2.5rem;
        }

        .description {
            display: inline-block;
            margin-left: 20px;
            color: #AAA;
        }

        &::after {
            content: "";
            position: absolute;
            bottom: 30px;
            left: -5px;
            width: calc(100% + 10px);
            height: 25px;
            z-index: -1;
            background: #888;
            opacity: 0.1;
            border-radius: 5px;
        }
    }

    .data {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 50px;
        max-width: 950px;

        .column {
            margin: 15px;

            input {
                margin-left: 15px;
                width: 200px;
                height: 30px;
                outline: none;
                border: 0px;
                border-radius: 5px;
                text-align: center;
                color: #888;
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 1px 5px 0 rgba(0, 0, 0, 0.1);

                &:hover {
                    transform: scale(1.1);
                    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 5px 25px 0 rgba(0, 0, 0, 0.2);
                }

                &.active {
                    transform: scale(1.1);
                    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 5px 25px 0 rgba(0, 0, 0, 0.2);
                }
            }
        }
        
    }

    .controller {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 50px;
        margin-bottom: 60px;
        max-width: 850px;

        .button {
            display: flex;
            flex-direction: row;
            align-content: center;
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;
            margin: 10px;
            width: 150px;
            height: 35px;
            border-radius: 5px;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 1px 5px 0 rgba(0, 0, 0, 0.1);

            &:hover {
                transform: scale(1.1);
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 5px 25px 0 rgba(0, 0, 0, 0.2);
            }
        }
    }
</style>