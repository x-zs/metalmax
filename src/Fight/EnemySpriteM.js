var EnemyMSprite = cc.Sprite.extend({
	HP: 0,//生命值
	AT: 0,//攻击
	DF: 0,// 防御力
	ctor:function(image,HP,AT,DF,x,y){
		this._super(image);
		this.initProperty(HP,AT,DF);
		this.setPosition(x,y);
		cc.log("敌人－－－－生命值："+this.HP+",攻击力："+this.AT+",防御力："+this.DF+",坐标：("+this.getPosition().x+","+this.getPosition().y+")");
	},
	initProperty:function(HP,AT,DF){
		this.HP = HP;
		this.AT = AT;
		this.DF = DF;
	},
});