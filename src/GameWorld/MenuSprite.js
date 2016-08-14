/**
 * Created by 路漫漫在狂奔 on 16/7/30.
 */

// 类型
var menu = {};

// 菜单精灵
var GameMenu = cc.Sprite.extend({
    list            : {},
    _listener       : null,                 // 监听器
    target          : null,
    callback        : null,                 // 回调函数
    _callbackSch    : null,                 // 计时器[回调函数]
    player          : null,

    ctor: function(){
        this._super();
        // 加载[监听器]
        this._loadListener();
        // 加载[菜单]
        this._loadMenu();
    },
    // 加载[监听器]
    _loadListener : function(){
        var listener = cc.EventListener.create({
            event           : cc.EventListener.TOUCH_ONE_BY_ONE,
            target          : this,
            swallowTouches  : true,
            onTouchBegan    : this.onTouchBegan
        });

        // TODO 内存管理问题的一种解决方案
        this.setUserObject(listener);
        cc.eventManager.addListener(listener, this);
        this._listener = listener;
    },

    onTouchBegan: function (touch, event) {

        return true;
    },
     loadMenu : function(){
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

            var list = [['对话',this.waitTodo],['强度',this.waitTodo],['装备',this.waitTodo],['调查',this.waitTodo],['乘降',this.updownCheck],['工具',this.waitTodo],['炮弹',this.waitTodo],['模式',this.waitTodo]];

            for (var i = 0; i < this.lsit.length; i++) {
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
            this.addChild(this.menu,3);

            //加载属性
            this.LoadPro();
        }

    },
    loadPro :  function(){

        var name =  new cc.LabelTTF("红狼","Arial",18);
        var hp = new cc.LabelTTF("HP","Arial",18);
        var hpnumber = new cc.LabelTTF("34","Arial",18);
        var sp = new cc.LabelTTF("SP","Arial",18);
        var spnumber = new cc.LabelTTF("280","Arial",18);

        // 统一加载的layer
        this.addChild(name);
        this.addChild(hp);
        this.addChild(hpnumber);
        this.addChild(sp);
        this.addChild(spnumber);
        this.addChild(this.layer);

        //位置设定
        var w = this.getContentSize().width;
        var h = this.getContentSize().height;
        hpnumber.setPosition(w-20,h-20);
        hp.setPosition(w/6 * 5,h-20);
        name.setPosition(w/2,h-20);
        spnumber.setPosition(w-20,h/5 * 3);
        sp.setPosition(w/6 * 5,h/5 * 3);

        this.menu.setPosition(60,h*1.5);

        this.setPosition(this.player.x-240,this.player.y-200);
    },
    waitTodo : function () {
        alert('正在建设中。。。。。。');
    }
    loadSchedule : function(){
        if (this._callbackSch == null){
            this._callbackSch = this.scheduleUpdate();
        }
    },
    unLoadSchedule : function(){
        this.unscheduleAllCallbacks();
        this._callbackSch = null;
    },
    update : function(dt){
        // 回调函数
        (this.callback && typeof(this.callback) === "function") && this.callback();
    },

    // 触摸开关
    setTouchEnabled : function(enable){
        if (this._listener){
            if (enable){
                // 若有添加过，引擎会自动过滤。所以，任性的添加吧。
                cc.eventManager.addListener(this._listener, this);
            }else{
                cc.eventManager.removeListener(this._listener);
            }
        }else{
            cc.log("setTouchEnabled 无效！listener 为空...");
        }
    },
    onExit: function(){
        if (this._listener != null){
            cc.eventManager.removeListener(this._listener);
        }
        this._super();
    }

});
