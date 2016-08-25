var npcScaleM = 1.5;

var LaduoSceneM = cc.Scene.extend({

	onEnter : function () {
		cc.log("加载拉多镇场景");
        this._super();
        this.loadLayer();

    },

    loadLayer : function() {
        var baduoLayerM = new LaduoLayerM();
        this.addChild(baduoLayerM);
    }
});

var LaduoLayerM = cc.Layer.extend({
	map    		 : null,
	mapObj 		 : null,
	mapWidth     : 0,
    mapHeight    : 0,
    mapSize      : 0,
    mapTile      : 0,
    mapIndex     : 0,
    rocker       : null,
    mapMeta      : null,
	player       : null,
	player_Point : null,
	playerDir    :0,
	playerSpeed  : 1.5,
	npc1   	     : null,
	npc1_Point   : null,
	npc2   	     : null,
	npc2_Point   : null,
	npc3   	     : null,
	npc3_Point   : null,
	npc4   	     : null,
	npc4_Point   : null,
	npc5   	     : null,
	npc5_Point   : null,
	npc6   	     : null,
	npc6_Point   : null,
	npc7   	     : null,
	npc7_Point   : null,


	ctor : function() {
		cc.log("加载层");
		this._super();
		//背景音乐
        cc.audioEngine.playMusic(res.mp3_world, true);
        //地图
		this.loadMap();
		//玩家
		this.loadMainLayer();
		//npc
		this.loadNPC();
		//摇杆
        this.loadRocker();
	},

	loadMap : function() {
		cc.log("加载瓦片地图");

		this.map = new cc.TMXTiledMap(res.laduo_tmx);

		//获取map size 方形，获取单边即可
        this.mapHeight = this.mapWidth = this.map.getContentSize().width;
        this.mapTile = this.map.getTileSize().height;
        this.mapSize = this.map.getMapSize().height;
        //隐藏碰撞层
        this.mapMeta = this.map.getLayer("块层 5");
        this.mapMeta.setVisible(false);

		this.mapObj = this.map.getObjectGroup('obj');

		this.player_Point = this.mapObj.getObject("player");

		this.npc1_Point = this.mapObj.getObject('npc1');
		this.npc2_Point = this.mapObj.getObject('npc2');
		this.npc3_Point = this.mapObj.getObject('npc3');
		this.npc4_Point = this.mapObj.getObject('npc4');
		this.npc5_Point = this.mapObj.getObject('npc5');
		this.npc6_Point = this.mapObj.getObject('npc6');
		this.npc7_Point = this.mapObj.getObject('npc7');


		this.addChild(this.map,-1);
	},

	loadMainLayer : function(){
		cc.log("加载玩家");
        cc.spriteFrameCache.addSpriteFrames(res.zhujiao_plist);
        // cc.spriteFrameCache.addSpriteFrames(res.no7_plist);

        this.player = new cc.Sprite('#lang_1_1.png');
        this.player.name = '红狼';
        this.player.setPosition(this.player_Point);
        // this.player.setScale(npcScaleM);
        this.addChild(this.player,1);

        //视角跟随
        this.setViewPointCenter(this.player);

    },

	loadNPC : function() {
		cc.log("加载npc");
		cc.spriteFrameCache.addSpriteFrames(res.NPC_plist);
        cc.spriteFrameCache.addSpriteFrames(res.NPC_png);

        this.npc1 = new cc.Sprite('#NPC01_0_0.png');
        this.npc1.name = 'npc1';
        this.npc1.setPosition(this.npc1_Point);
        // this.npc1.setScale(npcScaleM);
        this.addChild(this.npc1,1);
        cc.log

        this.npc2 = new cc.Sprite('#NPC02_0_0.png');
        this.npc2.name = 'npc2';
        this.npc2.setPosition(this.npc2_Point);
        // this.npc2.setScale(npcScaleM);
        this.addChild(this.npc2,1);

		this.npc3 = new cc.Sprite('#NPC03_0_0.png');
        this.npc3.name = 'npc3';
        this.npc3.setPosition(this.npc3_Point);
        // this.npc3.setScale(npcScaleM);
        this.addChild(this.npc3,1);

        this.npc4 = new cc.Sprite('#NPC04_0_2.png');
        this.npc4.name = 'npc4';
        this.npc4.setPosition(this.npc4_Point);
        // this.npc4.setScale(npcScaleM);
        this.addChild(this.npc4,1);

        this.npc5 = new cc.Sprite('#NPC05_0_0.png');
        this.npc5.name = 'npc5';
        this.npc5.setPosition(this.npc5_Point);
        // this.npc5.setScale(npcScaleM);
        this.addChild(this.npc5,1);

        this.npc6 = new cc.Sprite('#NPC06_0_0.png');
        this.npc6.name = 'npc6';
        this.npc6.setPosition(this.npc6_Point);
        // this.npc6.setScale(npcScaleM);
        this.addChild(this.npc6,1);

        this.npc7 = new cc.Sprite('#NPC07_0_0.png');
        this.npc7.name = 'npc7';
        this.npc7.setPosition(this.npc7_Point);
        // this.npc7.setScale(npcScaleM);
        this.addChild(this.npc7,1);

        this.log(this.npc1);
        this.log(this.npc2);
        this.log(this.npc3);
        this.log(this.npc4);
        this.log(this.npc5);
        this.log(this.npc6);
        this.log(this.npc7);
	},
	log : function(npc) {
		cc.log(npc.name+":  ("+npc.x+","+(24*33-npc.y)+")");
	},

    // 加载摇杆 按钮
    loadRocker : function(){
        this.rocker = new Rocker(res.JoystickBG, res.Joystick, 128);
        this.rocker.callback = this.onCallback.bind(this);
        this.addChild(this.rocker,2);
        this.rocker.setPosition(this.player.x-280,this.player.y-100);

        var labelA = new cc.LabelTTF("B", "Arial", 40);
        var labelB = new cc.LabelTTF("A", "Arial", 40);
        //创建菜单，并监听
        var nodeA = new cc.MenuItemLabel(labelA,this.LoadMenu,this);
        var nodeB = new cc.MenuItemLabel(labelB,this.LoadMenu,this);
        this.btn = new cc.Menu(nodeA,nodeB);
        //添加的子节点水平间距
        this.btn.alignItemsHorizontallyWithPadding(50);
        this.addChild(this.btn,4);
        this.btn.setPosition(this.player.x+280,this.player.y-120);
        nodeB.setColor(cc.color.RED);
        nodeA.setColor(cc.color.BLUE);


    },
    // 回调函数[摇杆中触发]
    onCallback : function(sender){
        var dir = this.rocker.direction;
        if (dir != this.playerDir){
            this.playerDir = dir;
            // cc.log("回调函数");
            this.playerChangeDir(this.playerDir);
        }else{
            this.onRun();
        }
    },
    // 改变方向[切换帧动画]
    playerChangeDir : function(dir){
        this.player.stopAllActions();
        if (dir > 0){
            this.player.runAction(this.getAnimate(dir).repeatForever());
        }
    },
    // 获取动画
    getAnimate : function(dir){
        // 动作数组
        var animFrames = [];
        for (var i = 1; i < 5; i++) {
            var str = "lang_"+ i +'_' +dir + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.1);
        return cc.animate(animation);
    },
    // 跑动[玩家]
    onRun : function(){
        // 获取摇杆方向
        var dir = this.rocker.direction;
        // 获取摇杆速度 (取值范围[0-1])
        var rockerSpeed = this.rocker.speed;
        // 获取摇杆弧度
        var radians = this.rocker.radians;
        var p = this.player.getPosition();
        switch (dir){
            case Direction.D_UP:
                p.y += this.playerSpeed;
                break;
            case Direction.D_RIGHT:
                p.x += this.playerSpeed;
                break;
            case Direction.D_DOWN:
                p.y -= this.playerSpeed;
                break;
            case Direction.D_LEFT:
                p.x -= this.playerSpeed;
                break;
            default :
                break;
        }
        if (p.x <= (this.mapSize * this.mapSize) && p.y <= (this.mapSize * this.mapSize) && p.y >= 0 && p.x >= 0) {
            this.setPlayerPosition(p);
        }
        //视角跟随
        this.setViewPointCenter(p);
        //跟随玩家位置
        this.rocker.setPosition(this.player.x-280,this.player.y-100);
        this.btn.setPosition(this.player.x+260,this.player.y-120);
    },

    //碰撞层方法
    tileCoordForPosition : function(p){
        var x = Math.round( p.x / this.mapTile );
        //TMX是左上角为0,0  cocos2d-x是左下角为0,0
        var y = Math.round( (( this.mapSize * this.mapTile) - p.y) / this.mapTile );
        return cc.p(x, y);
    },
    setPlayerPosition : function(p){
        var tileCoord = this.tileCoordForPosition(p);
        // tileGIDAt
        var tileGid = this.mapMeta.getTileGIDAt(tileCoord);
        // var tileGidObj = this.mapObj.getTileGIDAt(tileCoord);
        if (tileGid ) {
            var properties = this.map.getPropertiesForGID(tileGid);
            // cc.log(properties);
            if (properties.collide=="true") {
                return ;
            }else if (properties.in=="true") {
                cc.director.runScene(new LaduoSceneM());
            }

        }
        this.player.setPosition(p);
    },

    setViewPointCenter : function(position) {

        // if (isInit) {
            //计算视角
            var x = Math.max(position.x, GC.w2);
            var y = Math.max(position.y, GC.h2);
            x = Math.min(x, (this.mapWidth * this.mapTile) - GC.w2);
            y = Math.min(y, (this.mapHeight  * this.mapTile) - GC.h2);

            //修正视角
            var viewPoint = cc.p(GC.w2-x, GC.h2-y);
            this.setPosition(viewPoint);
    },
});
