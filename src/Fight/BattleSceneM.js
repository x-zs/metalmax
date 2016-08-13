var Index_M = 0;
//定义场景
var BattleSceneM = cc.Scene.extend({
	onEnter:function () {
        this._super();
        cc.log("加载战斗场景");
        var battlebgLayerM = new BattleBackgroundLayerM();
        this.addChild(battlebgLayerM);
        var battleLayerM = new BattleLayerM();
        this.addChild(battleLayerM);
    }
});
//定义战斗层
var BattleLayerM = cc.Layer.extend({
	ctor:function(){
		this._super();
		cc.audioEngine.playMusic(res.mp3_boss, true);
		cc.log("添加战斗层");
		var enemyMSprite = new EnemyMSprite(res.BattleEnemy_M_png,100,53,27,GC.w2/2,GC.h2);
		enemyMSprite.tag = 117;
		this.addChild(enemyMSprite);
		cc.log("添加怪物精灵"+enemyMSprite.tag);
		var roleMSprite = new RoleMSprite(res.BattleRole_M_png,200,57,43,GC.w2*1.5,GC.h2);
		roleMSprite.tag = 118;
		this.addChild(roleMSprite);
		cc.log("添加角色精灵"+roleMSprite.tag);
		var bulletSprite = new cc.Sprite(res.enemyBullet_M_png);
		//bulletSprite.setVisible(false);
		bulletSprite.tag = 119;
		this.addChild(bulletSprite);
		cc.log("添加子弹精灵"+bulletSprite.tag);
		this.schedule(this.battleFun,3,6,1);
		/*
		schedule(callback_fn, interval, repeat, delay)里面四个参数对应的含义是：
		callback_fn：调用的方法名
		interval：间隔多久再进行调用
		repeat：重复的次数
		delay：延迟多久再进行调用
		*/
	},
	battleFun:function(){
		if (Index_M%2 == 0) {
			this.action("R");
		}else{
			this.action("E");
		};
		Index_M ++;
	},
	action:function(attack){
		var enemyMSprite = this.getChildByTag(117);
		var roleMSprite = this.getChildByTag(118);
		var bulletSprite = this.getChildByTag(119);
		var startTime = 0.5;
		var time = 0.3;
		var bulletTime = 1;
		var distance = 5;
		var attackAction_E = cc.moveTo(time, cc.p(GC.w2/2 + distance, GC.h2));
		var backAction_E = cc.moveTo(time, cc.p(GC.w2/2 - distance, GC.h2));
		backAction_E.delayTime = time;
		var attackAction_R = cc.moveTo(time, cc.p(GC.w2*1.5 - distance, GC.h2));
		var backAction_R = cc.moveTo(time, cc.p(GC.w2*1.5 + distance, GC.h2));
		var bulletHId = cc.fadeTo(0,0);
		var bulletVis = cc.fadeTo(0,255);
		backAction_R.delayTime = time;
		if (attack == "E") {
			roleMSprite.HP -= (enemyMSprite.AT - roleMSprite.DF);
			// cc.log("敌人进攻"+"enemyMSprite HP:"+enemyMSprite.HP+",roleMSprite HP:"+roleMSprite.HP);

			enemyMSprite.runAction(cc.sequence(cc.delayTime(startTime),attackAction_E,backAction_E));
			roleMSprite.runAction(cc.sequence(cc.delayTime(startTime+time+bulletTime),backAction_R,attackAction_R));

			bulletSprite.setTexture(res.enemyBullet_M_png);
			bulletSprite.setPosition(enemyMSprite.getPositionX(),enemyMSprite.getPositionY());

			var bulletAction = cc.moveTo(bulletTime,cc.p(roleMSprite.getPositionX(),roleMSprite.getPositionY()));
			bulletSprite.runAction(cc.sequence(bulletHId,cc.delayTime(startTime+time),bulletVis,bulletAction,bulletHId));
			//战斗信息输出
			this.warLog(roleMSprite.HP,enemyMSprite.HP,0);

		}else if (attack == "R") {
			enemyMSprite.HP -= (roleMSprite.AT - enemyMSprite.DF);
			// cc.log("我方进攻"+"enemyMSprite HP:"+enemyMSprite.HP+",roleMSprite HP:"+roleMSprite.HP);

			roleMSprite.runAction(cc.sequence(cc.delayTime(startTime),attackAction_R,backAction_R));
        	//enemyMSprite.runAction(cc.sequence(cc.delayTime(startTime+time+bulletTime),backAction_E,attackAction_E));


			if (enemyMSprite.HP > 0) {
				enemyMSprite.runAction(cc.sequence(cc.delayTime(startTime+time+bulletTime),backAction_E,attackAction_E));
			}else{
				enemyMSprite.runAction(cc.sequence(cc.delayTime(startTime+time+bulletTime),cc.blink(1,3),cc.fadeTo(0,0)));
				cc.director.popScene();
			};

			bulletSprite.setTexture(res.roleBullet_M_png);
			bulletSprite.setPosition(roleMSprite.getPositionX(),roleMSprite.getPositionY());

			var bulletAction = cc.moveTo(bulletTime,cc.p(enemyMSprite.getPositionX(),enemyMSprite.getPositionY()));
			bulletSprite.runAction(cc.sequence(bulletHId,cc.delayTime(startTime+time),bulletVis,bulletAction,bulletHId));
			//战斗信息输出
			this.warLog(roleMSprite.HP,enemyMSprite.HP,1);
		};
	},
	warLog : function (mhp,ehp,status) {
		//提示
        // var label = this.getChildByName('warlog');
        var str = '';
        if (status) {
        	str = "我方进攻"+"enemy HP: "+ehp+",my HP: "+mhp;
        } else {
        	str = "敌人进攻"+"enemy HP: "+ehp+",my HP: "+mhp;
        }

        var label = new cc.LabelTTF(str, "Arial", 24);
        // label.setName('warlog');
        // label.setFontFillColor(cc.color(0,0,200));
        label.setPosition(GC.w2,GC.h2-200);
        this.addChild(label);


        //动画
        var action = cc.sequence(cc.moveBy(2.0, cc.p(0, 100)) );
        label.runAction(action);
        label.schedule(function(){label.setVisible(false);}, 2);
        // this.
	}
});
//定义战斗背景层
var BattleBackgroundLayerM = cc.Layer.extend({
	ctor:function(){
		this._super();
		cc.log("添加战斗背景层");
		var winSize = cc.director.getWinSize();
		//背景图精灵
		var battlebgSpriteM = new cc.Sprite(res.BattleBG_M_png);
		battlebgSpriteM.setPosition(GC.w2, GC.h2);
		this.addChild(battlebgSpriteM);
		cc.log("添加战斗背景图精灵");
		var rect = battlebgSpriteM.getTextureRect();
		var pSize = battlebgSpriteM.getContentSize();
		cc.log(GC.w+","+GC.h+"  "+"("+rect.x+","+rect.y+","+rect.width+","+rect.height+") "+"("+pSize.width+","+pSize.height+")");

	}
});
