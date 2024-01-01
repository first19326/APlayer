

## Installation

Using npm:

```bash
npm i @worstone/vue-aplayer
```

Using pnpm:

```bash
pnpm add @worstone/vue-aplayer
```

## Usage

```vue
<template>
	<APlayer :audio="audio" />
</template>
<script setup>
    import { ref } from "vue";
	import APlayer from "@worstone/vue-aplayer";
    const audio = ref([]);

    onMounted(() => {
        // load audios data and update to the variable audio
        audio.value = [];
    });
</script>
```

Audios data is empty during component initialization, so the default style will be loaded. After the audios data variable are updated, the player style will be automatically updated.

If you want a better experience, refer to the following methods to use it.

```vue
<template>
	<APlayer :audio="audio" ref="aplayer" />
</template>
<script setup>
    import { ref } from "vue";
	import APlayer from "@worstone/vue-aplayer";
    
    const aplayer = ref(null);
    // set 2 or more audios data
    const audio = ref([]);

    onMounted(() => {
        // load audios data
        let audios = [];
        // add to player list
        aplayer.value.addList(audios);
    });
</script>
```

## Options

| Name          | Type         | Default           | Description                                                  |
| ------------- | ------------ | ----------------- | ------------------------------------------------------------ |
| audio         | Object/Array | -                 | audio info, should be an object or object array              |
| audio.name    | String       | -                 | audio name                                                   |
| audio.artist  | String       | -                 | audio artist                                                 |
| audio.url     | String       | -                 | audio url                                                    |
| audio.cover   | String       | -                 | audio cover                                                  |
| audio.lrc     | String       | -                 | audio lrc                                                    |
| audio.theme   | String       | -                 | main color when switching to this audio, it has priority over the theme |
| mode          | String       | 'normal'          | player mode, values: 'normal', 'fixed', 'mini'               |
| autoplay      | Boolean      | false             | audio autoplay                                               |
| mutex         | Boolean      | true              | prevent to play multiple player at the same time, pause other players when this player start play |
| preload       | String       | 'auto'            | values: 'none', 'metadata', 'auto'                           |
| theme         | Boolean      | '#B7DAFF'         | main color                                                   |
| autoSwitch    | Boolean      | true              | self-adapting theme according to cover, it requires the library [color-thief](https://github.com/lokesh/color-thief/blob/master/src/color-thief.js) |
| loop          | String       | 'all'             | player loop play, values: 'all', 'one', 'none'               |
| order         | String       | 'list'            | player play order, values: 'list', 'random'                  |
| muted         | Boolean      | false             | indicate whether player should mute at first                 |
| volume        | Number       | 0.7               | default volume, notice that player will remember user setting, default volume will not work after user set volume themselves |
| lrcType       | Number       | 1                 | lrc type, values: 1, 2                                       |
| lrcShow       | Boolean      | true              | indicate whether lrc should show at first                    |
| listFolded    | Boolean      | false             | indicate whether list should folded at first                 |
| listMaxHeight | Number       | 250               | list max height                                              |
| noticeSwitch  | Boolean      | true              | notice is enabled by default, only the notice content is printed on the console when disabled |
| storageName   | String       | 'aplayer-setting' | localStorage key that store player setting                   |

For example:

```vue
<template>
	<APlayer :audio="audio" mode="normal" autoplay=false mutex=true preload="auto" theme="#FADFA3" autoSwitch=true loop="all" order="random" muted=false volume=0.7 :lrcType=1 lrcShow=true listFolded=false listMaxHeight=250 />
</template>
<script setup>
	import { ref } from "vue";
    
    const audio = ref([
        {
            "title": "烟雨行舟（原唱：伦桑）",
            "author": "司南",
            "url": "https://api.i-meto.com/meting/api?server=netease&type=url&id=1301884692&auth=898d1269a732530c578b63624fe8be0bdfc14205",
            "pic": "https://api.i-meto.com/meting/api?server=netease&type=pic&id=109951167056907210&auth=a4976ca0e04dc7a5592a706e1bd70c93acd1591f",
            "lrc": "https://api.i-meto.com/meting/api?server=netease&type=lrc&id=1301884692&auth=425c4730fe0caf12cf4c0eabacc3398097c8ba49"
        },
        {
            "title": "Legends Never Die",
            "author": "Against the Current",
            "url": "https://api.i-meto.com/meting/api?server=netease&type=url&id=506196018&auth=c5c21102c12896557ecf3fd43a415c050fe757a6",
            "pic": "https://api.i-meto.com/meting/api?server=netease&type=pic&id=109951163918904060&auth=ab3ada1788834c2c30fc14be2320219dbeaebc12",
            "lrc": "https://api.i-meto.com/meting/api?server=netease&type=lrc&id=506196018&auth=9038409d31ec7f40ea7888b77f0839051a2859a5"
        }
    ])
</script>
```

![](./image/example.png)

## API

- `init()`: init player
- `play()`: play audio
- `pause()`: pause audio
- `toggle()`: play / pause audio
- `seek(time: number)`: seek to specified time, the unit of time is second
- `mute`: switch player mute status
- `setVolume(volume: number, storage: boolean)`: set audio volume
- `setTheme(color: string, index: number)`: set player theme, the default of index is current audio index
- `setMode(mode: string)`: set player mode, the value of mode should be 'normal', 'fixed' or 'mini'
- `setLoop(loop: string)`: set player loop play, the value of mode should be 'all', 'one' or 'none'
- `setOrder(order: string)`: set player order play, the value of mode should be 'list' or 'random'
- `setNotice(text: string, time: number, opacity: number)`: show message, the unit of time is millisecond, the default of time is 2000, the default of opacity is 0.8, setting time to 0 can disable notice autohide
- `skipBack()`: skip to previous audio
- `skipForward()`: skip to next audio
- `destroy()`: destroy player
- `showLrc()`: show lrc
- `hideLrc()`: hide lrc
- `toggleLrc()`: show / hide lrc
- `showList()`: show list
- `hideList()`: hide list
- `toggleList()`: show / hide list
- `addList(audios: object | array, clear: boolean)`: add new audios to the list
- `removeList(index: number)`: remove an audio from the list
- `switchList(index: number)`: switch to an audio in the list
- `clearList()`: remove all audios from the list
- `audioRef`: native audio
  - `audioRef.currentTime`: returns the current playback position
  - `audioRef.duration`: returns audio total time
  - `audioRef.paused`: returns whether the audio paused
  - most [native api](http://www.w3schools.com/tags/ref_av_dom.asp) are supported

## Event binding

### Audio events

- abort
- canplay
- canplaythrough
- durationchange
- emptied
- ended
- error
- loadeddata
- loadedmetadata
- loadstart
- mozaudioavailable
- pause
- play
- playing
- progress
- ratechange
- seeked
- seeking
- stalled
- suspend
- timeupdate
- volumechange
- waiting

### Player events

- listshow
- listhide
- listadd
- listremove
- listswitch
- listclear
- noticeshow
- noticehide
- init
- destroy
- lrcshow
- lrchide

## LRC

### LRC file

The first way, put LRC to a LRC file, LRC file will be loaded when this audio start to play.

```vue
<template>
	<APlayer :audio="audio" :lrcType=1></APlayer>
</template>
<script setup>
    import { ref } from "vue";
    import APlayer from "@worstone/vue-aplayer"
    const audio = ref([
        {
            "title": "烟雨行舟（原唱：伦桑）",
            "author": "司南",
            "url": "https://api.i-meto.com/meting/api?server=netease&type=url&id=1301884692&auth=898d1269a732530c578b63624fe8be0bdfc14205",
            "pic": "https://api.i-meto.com/meting/api?server=netease&type=pic&id=109951167056907210&auth=a4976ca0e04dc7a5592a706e1bd70c93acd1591f", 
            "lrc": "https://api.i-meto.com/meting/api?server=netease&type=lrc&id=1301884692&auth=425c4730fe0caf12cf4c0eabacc3398097c8ba49"
        }
    ]);
</script>
```

### LRC string in JS

The second way, put LRC to a JS string.

```vue
<template>
	<APlayer :audio="audio" :lrcType=2></APlayer>
</template>
<script setup>
    import { ref } from "vue";
    import APlayer from "@worstone/vue-aplayer"
    const audio = ref([
        {
            "title": "烟雨行舟（原唱：伦桑）",
            "author": "司南",
            "url": "https://api.i-meto.com/meting/api?server=netease&type=url&id=1301884692&auth=898d1269a732530c578b63624fe8be0bdfc14205",
            "pic": "https://api.i-meto.com/meting/api?server=netease&type=pic&id=109951167056907210&auth=a4976ca0e04dc7a5592a706e1bd70c93acd1591f", 
            "lrc": "[00:00.00] 作词 : Bye[00:01.00] 作曲 : Bye[00:21.95]编曲：Bye[00:23.58]混音：MR鱼[00:25.24]母带：MR曾经[00:27.09]封面：小草清清[00:38.07]烟雨入江南[00:40.33]山水如墨染[00:43.02]宛若丹青未干[00:44.93]提笔然 点欲穿[00:48.59]行舟临秀川[00:50.89]画鹢推清澜[00:54.06]缱绻怡然[00:58.96]天色沉靛蓝[01:01.64]波光似锦缎[01:04.31]缀着零星白帆[01:06.79]诗情满 千卷难[01:09.79]渔舟齐桅杆[01:12.36]鸳鸯凭舷栏[01:15.37]琴瑟相伴[01:21.05]一叶轻船[01:23.41]一双桨悠懒[01:26.28]一绵江风微拂素罗衫[01:31.95]渔火点点聚散[01:34.38]欸乃声声浅淡[01:37.14]天近晚[01:38.74]炊烟袅飘沿斑[01:42.41]一叶轻船[01:44.73]一双人倚揽[01:47.70]一曲烟雨行舟太缓慢[01:53.16]执手相看[01:55.59]把酒当歌言欢[01:58.73]红尘路漫漫[02:02.05]愿今生与你共览[02:51.49]暮霭渐褪暗[02:53.70]胭脂余味淡[02:56.30]我支着竹绢伞[02:58.75]你闲摆花团扇[03:01.82]浪儿晃曳慢[03:04.30]夜垂云流缓[03:07.54]且吟且谈[03:13.08]一叶轻船[03:15.52]一双桨悠懒[03:18.40]一绵江风微拂素罗衫[03:23.88]渔火点点聚散[03:26.38]欸乃声声浅淡[03:29.10]天近晚[03:30.79]炊烟袅飘沿斑[03:34.57]一叶轻船[03:36.78]一双人倚揽[03:39.69]一雨烟雨行舟太缓慢[03:45.01]执手相看[03:47.48]把酒当歌言欢[03:50.72]红尘路漫漫[03:54.18]欲今生与你共览[03:57.64]一叶轻船[03:58.32]一双月对半[04:01.13]一帘清梦幽幽醉阑珊[04:06.21]移舟靠岸[04:09.10]案前惟剩空盏[04:12.14]莫怨良辰短[04:15.47]曲终了韵意未完[04:20.47]*第一次制作，感谢支持。"
        }
    ]);
</script>
```

### LRC format

The following LRC format are supported:

`[mm:ss]APlayer`
`[mm:ss.xx]is`
`[mm:ss.xxx]amazing`
`[mm:ss.xx][mm:ss.xx]APlayer`
`[mm:ss.xx]<mm:ss.xx>is`
`[mm:ss.xx]amazing[mm:ss.xx]APlayer`

## MSE support

### HLS

It requires the library [hls.js](https://github.com/video-dev/hls.js).

```html
<script src="https://cdn.bootcdn.net/ajax/libs/hls.js/1.4.12/hls.min.js"></script>
```

or

```vue
<template></template>
<script setup>
    import Hls from "hls.js";
</script>
```


## Self-adapting theme

It requires the library [color-thief](https://github.com/lokesh/color-thief/blob/master/src/color-thief.js).

```html
<script src="https://cdn.bootcdn.net/ajax/libs/color-thief/2.4.0/color-thief.min.js"></script>
```

or

```vue
<template></template>
<script setup>
    import ColorThief from "color-thief";
</script>
```

## FAQ

### Why do other parameters of the player not update with variables ?

The initialization parameters only take effect during initialization, at other times, the player can only be set through the API.

### Why can't player autoplay in some mobile browsers ?

Most mobile browsers forbid audio autoplay, you wont be able to achieve it without hacks. In addition, desktop browsers may also require some settings to achieve player autoplay.

## Development

### Clone Code

```
git clone git@github.com:first19326/APlayer.git
```

### Install Dependencies

```bash
cd APlayer
pnpm install
```

### Dev Mode

```bash
pnpm dev
```

### Build Release

```bash
pnpm build
```

After building, the files will be found in the project's `dist` directory.