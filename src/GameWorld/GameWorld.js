/**
 * Created by 路漫漫在狂奔 on 16/7/30.
 */

var GameWorldLayer = cc.Layer.extend({
    btn                 : null,
    mapWidth            : 0,
    mapHeight           : 0,
    mapSize             : 0,
    mapTile             : 0,
    mapIndex            : 0,
    mapObject           : 0,
    startPoint          : 0,
    mapBg               : null,
    mapMeta             : null,     //碰撞层
    rocker              : null,     // 摇杆
    player              : null,
    playerDir           : 0,        // [当前方向]
    playerSpeed         : 3.0,      // [速度]
    tank                : null,
    tankStatus          : null,
    tanktPoint          : 0,
    menu                : null,     // [菜单]
    layer               : null,     // [属性]
    menuStatus          : 0,     // [菜单状态]

    ctor:function () {
        this._super();
        //背景音乐
        cc.audioEngine.playMusic(res.mp3_world, true);
        //载入大地图
        this.loadBackground();
        //载入玩家
        this.loadMainLayer();
        // 加载摇杆
        this.loadRocker();


        return true;
    },
    loadBackground : function(){
        //载入tile map
        this.map = new cc.TMXTiledMap(res.MainMap_tmx);
        this.mapBg = this.map.getLayer("bg");
        //隐藏碰撞层
        this.mapMeta = this.map.getLayer("meta");
        this.mapMeta.setVisible(false);

        this.addChild(this.map,-1);
        //获取map size 方形，获取单边即可
        this.mapHeight = this.mapWidth = this.map.getContentSize().width;
        this.mapTile = this.map.getTileSize().height;
        this.mapSize = this.map.getMapSize().height;

        //获取map中的object
        this.mapObject = this.map.getObjectGroup('Object');
        this.startPoint = this.mapObject.getObject('startPoint');

    },
    //初始化视角，玩家等
    loadMainLayer : function(){

        cc.spriteFrameCache.addSpriteFrames(res.zhujiao_plist);
        cc.spriteFrameCache.addSpriteFrames(res.no7_plist);

        this.tankPoint = this.mapObject.getObject('NO7');
        this.tank = new cc.Sprite('#NO7_1_1.png');
        this.addChild(this.tank,1);
        this.tank.setScale(2);
        this.tank.setPosition(this.tankPoint);

        this.player = new cc.Sprite('#lang_1_1.png');
        this.addChild(this.player,1);
        this.player.name = '红狼';
        this.player.setPosition(this.startPoint);
        this.player.setScale(2);

        //视角跟随
        this.setViewPointCenter(this.player);
        // this.runAction(cc.follow(this.player, cc.rect(0, 0,this.mapWidth,this.mapHeight)));

    },
    //碰撞层方法
    tileCoordForPosition : function(position){
        var x = position.x /this.mapTile;
        var y = (( this.mapSize * this.mapTile) - position.y) / this.mapTile;
        return cc.p(x, y);
    },
    setPlayerPosition : function(position){
        var tileCoord = this.tileCoordForPosition(position);

        var tileGid = this.mapMeta.getTileGIDAt(tileCoord);
        if (tileGid) {
            var properties = this.map.getPropertiesForGID(tileGid);
            if (properties) {
                var collision = properties["Collidable"];
                if ("true" == collision) {
                     //战斗测试
                     if (this.tankStatus) {
                         this.runAction(cc.blink(1.0, 10));
                         this.scheduleOnce(function(){cc.director.pushScene(new BattleSceneM())},1.0);
                     }

                    return ;
                }
            }
        }
        this.player.setPosition(position);
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
            if (this.tankStatus==1) {
                var str = "NO7_"+ i +'_' +dir + ".png";
            }else{
                var str = "lang_"+ i +'_' +dir + ".png";
            }

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
                p.y += rockerSpeed * this.playerSpeed;
                break;
            case Direction.D_RIGHT:
                p.x += rockerSpeed * this.playerSpeed;
                break;
            case Direction.D_DOWN:
                p.y -= rockerSpeed * this.playerSpeed;
                break;
            case Direction.D_LEFT:
                p.x -= rockerSpeed * this.playerSpeed;
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

    //乘降战车距离检测
    updownCheck : function() {
        var p = this.player.getPosition();
        var t = this.tank.getPosition();
        var num = Math.abs( (p.x - t.x)  + (p.y - t.y) );

        // cc.log(num);
        if (num < 25) {
            //乘降系统 test
            //纹理替换前记得[停止动作]
            this.player.stopAllActions();

            if (!this.tankStatus) {
                this.player.setTexture('#NO7_1_1.png');
                this.tankStatus = 1;
                this.tank.setVisible(false);
            }else{
                this.player.setTexture('#lang_1_1.png');
                this.tankStatus = 0;
                this.tank.setPosition(this.player.x,this.player.y);
                this.tank.setVisible(true);
            }
            this.playerChangeDir(this.playerDir);
        }else{
            //乘降提示
            var label = this.getChildByTag(101);
            if (!label) {
                label = new cc.LabelTTF("没坦克瞎按毛啊", "Arial", 40);
                label.setFontFillColor(cc.color(0,0,200));
                label.setPosition(this.player.x,this.player.y+100);
                this.addChild(label,0,101);
            }else{
                label.setPosition(this.player.x,this.player.y+100);
                label.setVisible(true);
            }
            //动画
            var action = cc.sequence(cc.moveBy(3.0, cc.p(0, 100)) );
            label.runAction(action);
            label.schedule(function(){label.setVisible(false);}, 3);
        }

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

        // }else{
        //     var camera = this.getPosition();
        //     var isOut = Math.abs(position.x - (-camera.x));
        //     cc.log('isOut :'+isOut);

        //     if (position.x > GC.w2 && (position.x < (this.mapWidth - GC.w2)) ) {//视窗移动范围判定
        //         if (isOut < 200) {//视窗是否移动判定
        //             this.setPositionX(camera.x + this.cameraSpeed);
        //             this.rocker.setPositionX(camera.x + this.cameraSpeed);
        //         }
        //         if (isOut > 600) {
        //             this.setPositionX(camera.x - this.cameraSpeed);
        //             this.rocker.setPositionX(camera.x - this.cameraSpeed);
        //         }
        //     }
        // }


    },
    LoadMenu : function(){
        if (this.menuStatus) {
            this.rocker.resume();
            this.rocker.setVisible(true);
            this.layer.setVisible(false);
            this.menuStatus = 0;
            return;
        }else {
            this.rocker.pause();
            this.rocker.setVisible(false);
            if (this.menu) {
                this.layer.setPosition(this.player.x-240,this.player.y-200);
                this.layer.setVisible(true);
                this.menuStatus = 1;
                return;
            }

            this.layer = new cc.LayerColor(cc.color.BLACK,460,170);
            this.menu = new cc.Menu();

            var item = [['对话',this.waitTodo],['强度',this.waitTodo],['装备',this.waitTodo],['调查',this.waitTodo],['乘降',this.updownCheck],['工具',this.waitTodo],['炮弹',this.waitTodo],['模式',this.waitTodo]];

            for (var i = 0; i < item.length; i++) {
                var str = item[i][0];
                var Label = new cc.LabelTTF(str,"Arial",24);
                var node = new cc.MenuItemLabel(Label,item[i][1],this);
                node.setName(str);
                this.menu.addChild(node);
            }


            // this.menu.setContentSize(cc.size(100,100));
            //添加的子节点水平间距
            this.menu.alignItemsHorizontally();
            // 两列四行
            this.menu.alignItemsInRows(4,4);
            // 水平间距
            // this.menu.alignItemsHorizontallyWithPadding(10);
            // 垂直间距
            // this.menu.alignItemsVerticallyWithPadding(10);

            // 菜单统一加载的layer
            this.layer.addChild(this.menu,3);

            //加载属性
            this.LoadPro();
        }

    },
    LoadPro :  function(){

        var name =  new cc.LabelTTF("红狼","Arial",18);
        var hp = new cc.LabelTTF("HP","Arial",18);
        var hpnumber = new cc.LabelTTF("34","Arial",18);
        var sp = new cc.LabelTTF("SP","Arial",18);
        var spnumber = new cc.LabelTTF("280","Arial",18);

        // 统一加载的layer
        this.layer.addChild(name);
        this.layer.addChild(hp);
        this.layer.addChild(hpnumber);
        this.layer.addChild(sp);
        this.layer.addChild(spnumber);
        this.addChild(this.layer);

        //位置设定
        var w = this.layer.getContentSize().width;
        var h = this.layer.getContentSize().height;
        hpnumber.setPosition(w-20,h-20);
        hp.setPosition(w/6 * 5,h-20);
        name.setPosition(w/2,h-20);
        spnumber.setPosition(w-20,h/5 * 3);
        sp.setPosition(w/6 * 5,h/5 * 3);

        this.menu.setPosition(60,h*1.5);

        this.layer.setPosition(this.player.x-240,this.player.y-200);
    },
    waitTodo : function () {
        alert('正在建设中。。。。。。');
    }
});

var GameWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.loadResource();
        this.loadLayer();
    },
    onExit : function(){
        this.unLoadResource();
        this._super();
    },
    loadResource : function(){
    },
    unLoadResource : function(){
    },
    loadLayer : function(){
        var layer = new GameWorldLayer();
        this.addChild(layer);
    }
});
