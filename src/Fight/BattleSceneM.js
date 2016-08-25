
//定义战斗层
var BattleLayerM = cc.Layer.extend({
    enemy           : null,
    player          : null,
    bullet          : null,
    menu            : null,

    ctor : function() {
        this._super();

        //初始化资源和精灵
        this.loadAndInt();

    },
    loadAndInt : function () {
        //背景音乐
        cc.audioEngine.playMusic(res.mp3_boss, true);
        cc.audioEngine.setMusicVolume(0.5);

        //载入战斗精灵
        this.enemy = new EnemyMSprite(res.BattleEnemy_M_png,100,53,27,GC.w2/2,GC.h2);
        this.addChild(this.enemy,1,117);

        this.player = new RoleMSprite(res.BattleRole_M_png,200,57,43,GC.w2*1.5,GC.h2);
        this.addChild(this.player,1,118);

        //炮弹动画
        cc.spriteFrameCache.addSpriteFrames(res.A2_plist);
        this.bullet = new cc.Sprite("#A2_0.png");
        this.addChild(this.bullet,1,119);

        //载入菜单
        var labelA = new cc.LabelTTF("攻击", "Arial", 40);
        var labelB = new cc.LabelTTF("逃跑", "Arial", 40);
        //创建菜单，并监听
        var nodeA = new cc.MenuItemLabel(labelA,this.attackAnimate,this);
        var nodeB = new cc.MenuItemLabel(labelB,this.flee,this);
        var btn = new cc.Menu(nodeA,nodeB);
        //水平间距
        btn.alignItemsHorizontallyWithPadding(50);
        this.addChild(btn,4);
        btn.setPosition(GC.w*0.7,GC.h2-200);
    },
    // 获取动画
    getAnimate : function(e){

        // 动作数组
        var animFrames = [];
        var i = e ? 0 : 6;
        var con = e ? 6 : 15;
        while (i<con) {
            var str = "A2_"+ i +".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
            i++;
        }
        var animation = new cc.Animation(animFrames, 0.1);
        return cc.animate(animation);
    },
    //
    attackAnimate : function(){
        var startTime = 0.5;
        var time = 0.3;
        var bulletTime = 1;
        var distance = 5;

        var attack_E = cc.moveTo(time, cc.p(GC.w2/2 + distance, GC.h2));
        var defender_E = cc.moveTo(time, cc.p(GC.w2/2 - distance, GC.h2));

        //被攻击动作
        this.enemy.runAction(cc.sequence(cc.delayTime(bulletTime),defender_E,attack_E));

        //设置炮弹路径
        this.bullet.setPosition(this.player.x,this.player.y);
        var bulletAction = cc.moveTo(bulletTime,cc.p(this.enemy.x,this.enemy.y));
        this.bullet.runAction(
            //并发执行
            cc.spawn(
                cc.show(),
                //开炮
                this.getAnimate(1),
                //开炮音效
                cc.callFunc(function(){
                    cc.audioEngine.playEffect(res.wav_gun);
                }),
                //移动炮弹
                bulletAction,
                //顺序执行
                cc.sequence(
                    //延时
                    cc.delayTime(startTime+time),
                    cc.spawn(
                        //爆炸音效
                        cc.callFunc(function(){
                            cc.audioEngine.playEffect(res.wav_gunEnd);
                        }),
                        //爆炸
                        this.getAnimate(0)
                    ),
                    cc.hide()
                )
            )
        );
        this.enemy.HP -= ( Math.floor(this.player.AT+ Math.random()*10) - Math.floor(this.enemy.DF+Math.random()*10));
        //延时调用
        this.scheduleOnce(function () {
            this.warLog(this.player.HP,this.enemy.HP,1);
        }, 1);
        this.scheduleOnce(function () {
            if (this.enemy.HP>0) {
                this.enemyAnimate();
            }else {
                this.flee();
            }
        },2);
    },
    //敌人攻击
    enemyAnimate : function () {
        var startTime = 0.5;
        var time = 0.3;
        var bulletTime = 1;
        var distance = 5;

        var attack_P = cc.moveTo(time, cc.p(GC.w2*1.5 - distance, GC.h2));
        var defender_P = cc.moveTo(time, cc.p(GC.w2*1.5 + distance, GC.h2));

        //被攻击动作
        this.player.runAction(cc.sequence(cc.delayTime(bulletTime),defender_P,attack_P));

        //设置炮弹路径
        this.bullet.setPosition(this.enemy.x,this.enemy.y);
        var bulletAction = cc.moveTo(bulletTime,cc.p(this.player.x,this.player.y));
        this.bullet.runAction(
            //并发执行
            cc.spawn(
                cc.show(),
                //开炮
                this.getAnimate(1),
                //开炮音效
                cc.callFunc(function(){
                    cc.audioEngine.playEffect(res.wav_gun);
                }),
                //移动炮弹
                bulletAction,
                //顺序执行
                cc.sequence(
                    //延时
                    cc.delayTime(startTime+time),
                    cc.spawn(
                        //爆炸音效
                        cc.callFunc(function(){
                            cc.audioEngine.playEffect(res.wav_gunEnd);
                        }),
                        //爆炸
                        this.getAnimate(0)
                    ),
                    cc.hide()
                )
            )
        );

        this.player.HP -= ( Math.floor(this.enemy.AT+ Math.random()*10) - Math.floor(this.player.DF+Math.random()*10));
        //延时调用
        this.scheduleOnce(function () {
            this.warLog(this.player.HP,this.enemy.HP,0);
        }, 1);

    },
    warLog : function (mhp,ehp,status) {
        var str = '';
        if (status) {
            str = "我方进攻"+"enemy HP: "+ehp+",my HP: "+mhp;
        } else {
            str = "敌人进攻"+"enemy HP: "+ehp+",my HP: "+mhp;
        }

        var label = new cc.LabelTTF(str, "Arial", 24);
        label.setPosition(GC.w2,GC.h2-180);
        this.addChild(label);

        //动画
        var action = cc.sequence(cc.moveBy(1.0, cc.p(0, 100)) );
        label.runAction(action);
        label.scheduleOnce(function(){label.runAction(cc.removeSelf())}, 1);
    },
    flee : function () {
        cc.director.popScene();
    }


});
//定义战斗背景层
// var BattleBackgroundLayerM = cc.Layer.extend({
//     ctor:function(){
//         this._super();
//         cc.log("添加战斗背景层");
//         var winSize = cc.director.getWinSize();
//         //背景图精灵
//         var battlebgSpriteM = new cc.Sprite(res.BattleBG_M_png);
//         battlebgSpriteM.setPosition(GC.w2, GC.h2);
//         this.addChild(battlebgSpriteM);
//         cc.log("添加战斗背景图精灵");
//         var rect = battlebgSpriteM.getTextureRect();
//         var pSize = battlebgSpriteM.getContentSize();
//         cc.log(GC.w+","+GC.h+"  "+"("+rect.x+","+rect.y+","+rect.width+","+rect.height+") "+"("+pSize.width+","+pSize.height+")");

//     }
// });

var BattleSceneM = cc.Scene.extend({
    onEnter : function () {
        this._super();
        // cc.log("加载战斗场景");
        // var battlebgLayerM = new BattleBackgroundLayerM();
        // this.addChild(battlebgLayerM);
        var battleLayerM = new BattleLayerM();
        this.addChild(battleLayerM);
    }
});
