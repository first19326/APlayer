<template>
    <component :is="icons[type]"></component>
</template>
<script setup>
    import Play from "../assets/play.svg?component";
    import Pause from "../assets/pause.svg?component";
    import VolumeUp from "../assets/volume-up.svg?component";
    import VolumeDown from "../assets/volume-down.svg?component";
    import VolumeOff from "../assets/volume-off.svg?component";
    import OrderRandom from "../assets/order-random.svg?component";
    import OrderList from "../assets/order-list.svg?component";
    import Menu from "../assets/menu.svg?component";
    import LoopAll from "../assets/loop-all.svg?component";
    import LoopOne from "../assets/loop-one.svg?component";
    import LoopNone from "../assets/loop-none.svg?component";
    import Loading from "../assets/loading.svg?component";
    import Right from "../assets/right.svg?component";
    import Skip from "../assets/skip.svg?component";
    import Lrc from "../assets/lrc.svg?component";

    const props = defineProps({
        type: {
            type: String
        }
    });

    const icons = {
        "play" : Play,
        "pause" : Pause,
        "volumeUp" : VolumeUp,
        "volumeDown" : VolumeDown,
        "volumeOff" : VolumeOff,
        "orderRandom" : OrderRandom,
        "orderList" : OrderList,
        "menu" : Menu,
        "loopAll" : LoopAll,
        "loopOne" : LoopOne,
        "loopNone" : LoopNone,
        "loading" : Loading,
        "right" : Right,
        "skip" : Skip,
        "lrc" : Lrc,
    };
</script>