import APlayer from "./APlayer.vue";

APlayer.install = (app) => {
    app.component(APlayer.name, APlayer);
}

export default APlayer;