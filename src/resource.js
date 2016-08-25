var res = {
    mp3_world : "res/sound/BGM/WorldTheme.mp3",
    mp3_start : "res/sound/BGM/Startup.mp3",
    mp3_boss : "res/sound/BGM/BossFight.mp3",
    mp3_Battle : "res/sound/WAR/StartBattle.mp3",
    start_bg_png : "res/bg/start_bg.png",
    startParticle_plist : "res/startParticle.plist",
    startParticle_png   : "res/startParticle.png",

    JoystickBG        : "res/player/JoystickBG.png",
    Joystick        : "res/player/Joystick.png",

    zhujiao_plist : "res/player/zhujiao.plist",
    zhujiao_png   : "res/player/zhujiao.png",

    no7_plist : "res/player/no7.plist",
    no7_png   : "res/player/no7.png",
    NPC_plist : "res/NPC/npc.plist",
    NPC_png   : "res/NPC/npc.png",

    wav_gun : "res/sound/WAR/WT_Cannon.wav",
    wav_gunEnd : "res/sound/WAR//WT_Cannon_End.wav",
    A2_plist : "res/fight/FA/A_M.plist",
    A2_png   : "res/fight/FA/A_M.png",
    BattleBG_M_png : "res/Test/HeiYan.png",
    BattleEnemy_M_png : "res/fight/enemy/X04_JP.png",
    BattleRole_M_png : "res/fight/tank/RLA.png",
    enemyBullet_M_png : "res/Test/enemyBullet.png",
    roleBullet_M_png : "res/Test/roleBullet.png",
    //map
    MainMap_tmx : "res/map/MainMap.tmx",
    MainMap_png : "res/map/map.png",
    // MainMap_tmx : "res/map/MMR.tmx",
    // MainMap_png : "res/map/MMRmap.png",
    laduo_tmx : "res/map/laduo.tmx",
    outdoor_png : "res/map/outdoor.png",
    indoor_png : "res/map/indoor.png",
    garage_png : "res/map/garage.png",
    home1_tmx : "res/map/home1.tmx",
    home2_tmx : "res/map/home2.tmx"



};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
