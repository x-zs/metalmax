//定义命名场景
var InputNameSceneM = cc.Scene.extend({
	ctor:function(title){
		this._super();
		cc.log("调用命名场景的构造函数:   "+title);
		var inputNameLayerM = new InputNameLayerM(title);
        this.addChild(inputNameLayerM);
	},
    onEnter:function () {
        this._super();
         cc.log("加载命名场景:onEnter");
    }
});
//定义命名图层
var InputNameLayerM = cc.Layer.extend({
	ctor:function(title){
		this._super();
		cc.log("调用命名图层的构造函数：  "+title);
		var titleLabel = new cc.LabelTTF(title, "Arial", 30);
		titleLabel.x = GC.w2;
		titleLabel.y = GC.h - 40;
		this.addChild(titleLabel);
		cc.log("titleLabel("+titleLabel.x+","+titleLabel.y+","+titleLabel.width+","+titleLabel.height+")");
		var inputNameTextField = new cc.TextFieldTTF("____________", "Arial", 25);
		inputNameTextField.x = GC.w2;
		inputNameTextField.y = GC.h - 80;
		inputNameTextField.attachWithIME();
		this.addChild(inputNameTextField);
		cc.log("titleLabel("+inputNameTextField.x+","+inputNameTextField.y+","+inputNameTextField.width+","+inputNameTextField.height+")");
		var completeBtn = new cc.LabelTTF("完成", "Arial", 30);
		completeBtn.x = GC.w - 100;
		completeBtn.y = GC.h - 80;
		this.addChild(completeBtn);
		cc.log("完成按钮("+completeBtn.x+","+completeBtn.y+","+completeBtn.width+","+completeBtn.height+")");
		if ('touches' in cc.sys.capabilities) {
			cc.eventManager.addListener({
	            event: cc.EventListener.TOUCH_ONE_BY_ONE,
	            onTouchBegan: function(touch,event){
	            	cc.director.runScene(new GameWorldScene());
	            	// cc.log("触摸开始");
	            },
	            onTouchMoved:function(touch,event){
	            	cc.log("触摸移动");
	            },
	            onTouchEnded:function(touch,event){
	            	var point = touch.getLocation();
	            	cc.log("触摸结束,触摸("+point.x+","+point.y+")");
	            	this.clickFunction();
	            },
        	}, this);
		}else if ('mouse' in cc.sys.capabilities ){
			cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function(event){
                	var winSize = cc.director.getWinSize();
			    	cc.log("屏幕大小("+winSize.width+","+winSize.height+")");
                	var point = event.getLocation();
                	cc.log("鼠标点击,点击("+point.x+","+point.y+")");
                	var inputRect = cc.rect(0, GC.h - 80 - 20, GC.w-80-80, 40);
                	var completeRect = cc.rect(GC.w -80-60, GC.h-80-20, 80, 40);
			    	if (cc.rectContainsPoint(inputRect,point)) {
			    		cc.log("点中了输入框");
			    		cc.log("点击的矩形：("+inputRect.x+","+inputRect.y+","+inputRect.width+","+inputRect.height+")");
			    		inputNameTextField.attachWithIME();
			    	}else if (cc.rectContainsPoint(completeRect,point)) {
			    		cc.log("点中了完成按钮");
			    		cc.log("点击的矩形：("+completeRect.x+","+completeRect.y+","+completeRect.width+","+completeRect.height+")");
			    		if (inputNameTextField.getContentText().length != 0) {
			    			inputNameTextField.detachWithIME();
			                cc.log("输入的用户名为： "+inputNameTextField.getContentText());
			            }else{
			            	inputNameTextField.attachWithIME();
			            	cc.log("未输入任何文字");
			            }
			    	}else{
			    		inputNameTextField.attachWithIME();
			    		cc.log("未点中任何东西");
			    	}
    			},
            }, this);
		};
	},
});
