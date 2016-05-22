
$(function(){
	/*处理touch在active下的状态*/
	document.body.addEventListener('touchstart', function () { }); 
	
	$('.close_adv_btn').click(function(){
	  $(this).parents('.g-hd').fadeOut(500);	
	});
	
	/*var iContHeight = parseInt($('.dis_dialist').offset().top) + parseInt($('.dis_dialist').outerHeight());
	$('.dis_asubmit').click(function(){	  
		var sendValue = $('#send-content').val();		
		if(sendValue.replace(/\s/g,'')==''){
			alert('请输入内容');
		}else{
			var sendStr = "<li>"+sendValue+"</li>";
		  $('.dis_dialist').append(sendStr);
			
			var currentHeight = parseInt($('.dis_dialist li:last-child').outerHeight());
			var currentTop = parseInt($('.dis_dialist li:last-child').offset().top);
			var iLimitCont = currentHeight + currentTop;			
			console.log(currentTop +"+"+ currentHeight +"="+iLimitCont +"||"+ iContHeight);
			if(iLimitCont > iContHeight){
				//console.log('超出啦！');
				$('.dis_dialist li:first-child').fadeOut(200,function(){
					 $(this).remove();
				});
			}
		}	
		
	});*/
	
	
});

/*封装css3*/
(function (root, factory) {	
	if (typeof define === 'function') {
			define(factory);
	}else if (typeof exports === 'object') {
			module.exports = factory;
	} else {
			root.WN = factory();
	}
	
})(this,function(){	
		var WN = {},
				body=document.body || document.documentElement,
				style=body.style, 
				transition="transition",
				transitionEnd,
				animationEnd,
				vendorPrefix; 
			
		transition=transition.charAt(0).toUpperCase() + transition.substr(1);
  
		vendorPrefix=(function(){//现在的opera也是webkit
				var  i=0, vendor=["Moz", "Webkit", "Khtml", "O", "ms"];
				while (i < vendor.length) {
						if (typeof style[vendor[i] + transition] === "string") {
							return vendor[i];
						}
						i++;
				}
				return false;
		})();
  
		transitionEnd=(function(){
				var transEndEventNames = {
					WebkitTransition : 'webkitTransitionEnd',
					MozTransition    : 'transitionend',
					OTransition      : 'oTransitionEnd otransitionend',
					transition       : 'transitionend'
				}
				for(var name in transEndEventNames){
						if(typeof style[name] === "string"){
								return transEndEventNames[name]
						}
				}
		})();
  
		animationEnd=(function(){
				var animEndEventNames = {
					WebkitAnimation : 'webkitAnimationEnd',
					animation      : 'animationend'
				}
				for(var name in animEndEventNames){
						if(typeof style[name] === "string"){
								return animEndEventNames[name]
						}
				}
		})();
		WN.addTranEvent=function(elem,fn,duration){
				var called=false;
				var fncallback = function(){
								if(!called){
										fn();
										called=true;
								}
				};
				function hand(){    
						elem.addEventListener(transitionEnd, function () {
								elem.removeEventListener(transitionEnd, arguments.callee, false);
										fncallback();
						}, false);
				}
				setTimeout(hand,duration);
		};
		WN.addAnimEvent=function(elem,fn){
				elem.addEventListener(animationEnd,fn,false)
		};

		WN.removeAnimEvent=function(elem,fn){
				elem.removeEventListener(animationEnd,fn,false)
		};

		WN.setStyleAttribute=function(elem,val){
				if(Object.prototype.toString.call(val)==="[object Object]"){
						for(var name in val){
								if(/^transition|animation|transform/.test(name)){
										var styleName=name.charAt(0).toUpperCase() + name.substr(1);
										elem.style[vendorPrefix+styleName]=val[name];
								}else{
										elem.style[name]=val[name];
								}
						}
				}
		};
		WN.transitionEnd=transitionEnd;
		WN.vendorPrefix=vendorPrefix;
		WN.animationEnd=animationEnd;
		return WN;
});

/*模拟对话框+加载+alert*/
;(function($, window, undefined) {
    
    var win = $(window),
        doc = $(document),
        count = 1,
        isLock = false;

    var Dialog = function(options) {       
        this.settings = $.extend({}, Dialog.defaults, options);
        
        this.init();
        
    }
    
    Dialog.prototype = {
        init : function() {
            
            this.create();
        
            if (this.settings.lock) {
                this.lock();
            }

            if (!isNaN(this.settings.time)&&this.settings.time!=null) {
                this.time();
            }
            
        },
        create : function() {

            var divHeader = (this.settings.title==null)?'':'<div class="rDialog-header-'+ this.settings.title +'"></div>';
            var templates = '<div class="rDialog-wrap">' +
                                divHeader +
                                '<div class="rDialog-content">'+ this.settings.content +'</div>' +
                                '<div class="rDialog-footer"></div>' +
                            '</div>';
            
            this.dialog = $('<div>').addClass('rDialog').css({ zIndex : this.settings.zIndex + (count++) }).html(templates).prependTo('body');
            if ($.isFunction(this.settings.ok)) {
                this.ok();
            }
            if ($.isFunction(this.settings.cancel)) {
               this.cancel(); 
            }           
            this.size();
            this.position();
            
        },
        ok : function() {
            var _this = this,
                footer = this.dialog.find('.rDialog-footer');
            
            $('<a>', {
                href : 'javascript:;',
                text : this.settings.okText
            }).on("click", function() {
                    var okCallback = _this.settings.ok();
                    if (okCallback == undefined || okCallback) {
                        _this.close();
                    }

            }).addClass('rDialog-ok').prependTo(footer);
            
        },
        cancel : function() {
            
            var _this = this,
                footer = this.dialog.find('.rDialog-footer');
            
            $('<a>', {
                href : 'javascript:;',
                text : this.settings.cancelText
            }).on("click",function() {
                    var cancelCallback = _this.settings.cancel();
                    if (cancelCallback == undefined || cancelCallback) {
                        _this.close();
                    }
            }).addClass('rDialog-cancel').appendTo(footer);
            
        },
        size : function() {
            
            var content = this.dialog.find('.rDialog-content'),
            	wrap = this.dialog.find('.rDialog-wrap');
            
            content.css({ 
                width : this.settings.width,
                height : this.settings.height
            });
           
        },
        position : function() {
            
            var _this = this,
                winWidth = win.width(),
                winHeight = win.height(),
                scrollTop = 0;
            
            this.dialog.css({ 
                left : (winWidth - _this.dialog.width()) / 2,
                top : (winHeight - _this.dialog.height()) / 2 + scrollTop
            });

        },        
        lock : function() {
            
            if (isLock) return;
            
            this.lock = $('<div>').css({ zIndex : this.settings.zIndex }).addClass('rDialog-mask');
            this.lock.appendTo('body');
            
            isLock = true;

        },
        unLock : function() {
    		if (this.settings.lock) {
    			if (isLock) {
	                this.lock.remove();
	                isLock = false;
                }
            }
        },
        close : function() {
            this.dialog.remove();
            this.unLock();
        },      
        time : function() {
            
            var _this = this;
            
            this.closeTimer = setTimeout(function() {
                _this.close();
            }, this.settings.time);

        }
        
    }
    Dialog.defaults = {
        content: '加载中...',
        title: 'load',
        width: 'auto',
        height: 'auto',
        ok: null,
        cancel: null,
        okText: '确定',
        cancelText: '取消',
        time: null,
        lock: true,
        zIndex: 99999
        
    }
    
    var rDialog = function(options) {
        return new Dialog(options);
    }
    
    window.rDialog = $.rDialog = $.dialog = rDialog;
    
})(window.jQuery || window.Zepto, window);

(function($, window, undefined){	
	
  /*===============评分*start============================*/
	 var Score = function(options) {       
				this.opts = $.extend({}, Score.defaults, options);        
				this.init();        
    }   
	
    Score.prototype = {			  
				init : function(){					
					
					obj = this;
					
					cpd = $(obj.opts.self);
					
					return cpd.each(function(index, element) {
              
							var oCurrentObj = $(this);	
							
							var s = oCurrentObj.attr('s');							
								
							 for(var i=0; i<parseInt(s); i++){
										oCurrentObj.find(obj.opts.star).eq(i).addClass('active');
							 }							
							 if(obj.opts.tf){
								 
							     $(this).find(obj.opts.star).on('click',function(){
								
										 var index = oCurrentObj.find(obj.opts.star).index(this);
										 
										 oCurrentObj.attr('s',(index+1));
										 
										 oCurrentObj.find(obj.opts.star).removeClass('active');
										 
										 for(var i=0; i<=index; i++){
													oCurrentObj.find(obj.opts.star).eq(i).addClass('active');
										 }
											
									});	 
							 }
							
          });					 
				}
	 }	 
	 Score.defaults = {
        iNum : 0            
   }    
   var rScore = function(options) {
        return new Score(options);
   }
   window.rScore = $.rScore = $.score = rScore;
   /*===============评分*end============================*/	
	
})(window.jQuery || window.Zepto, window);

;(function($, window, undefined){	
	var Screen = function(options){		 
	    this.settings = Extend(Screen.defaults,options);			
			this.initize();		 	
	};
	
	function Extend (desc, src){
		
	  for(var member in src){
		  desc[member] = src[member];
   	}
	  return desc;
		
	};
	
	
	Screen.prototype = {
		 initize : function(){			 
			 
			 /*初始化需要的参数*/		
			 var _self   = this;
			 this.swper  = $(this.settings.warp);
			 this.inner  = $(this.settings.inner);	
			 this.direct = '';	
			 this.inner_width = Math.floor((this.inner.find('li').eq(0).outerWidth() + parseInt(this.inner.find('li').eq(0).css('marginRight')))+1) * this.inner.find('li').size();
			 this.limitX = this.inner_width - this.swper.width();
			 
			 this.sX,this.sY,this.mX,this.mY,this.eX,this.eY,this.dx,this.dy = 0;	
			 
			 //console.log(Math.floor((this.inner.find('li').eq(0).outerWidth() + parseInt(this.inner.find('li').eq(0).css('marginRight')))));
			 			 
			 this.inner.css({
				 width : this.inner_width,
				 height : this.inner.find('li').eq(0).outerHeight()
			 })
			 
			 /*初始化的时候定位page数*/			 
			 WN.setStyleAttribute(this.inner[0],{
				  transitionDuration : '0s',
					transform : 'translateX(0)'
			 })
			 
			 /*外层添加对应的滑动事件*/			 			 
			 this.swper[0].addEventListener('touchstart',function(){				  
					_self.touchStart(_self); 
			 },false);
			 this.swper[0].addEventListener('touchmove',function(){
				  _self.touchMove(_self); 
			 },false);
			 this.swper[0].addEventListener('touchend',function(){
				  _self.touchEnd(_self); 
			 },false);
			 
			 if(typeof this.settings.onInit == 'function'){
				 this.settings.onInit.call(this,'');
			 }
			 
			 
		 },
		 
		 touchStart : function(obj,ev){		
		 	  
			 var ev = event || window.event;
			 ev.preventDefault();
			 obj.sX = ev.touches[0].pageX;
			 obj.sY = ev.touches[0].pageY;			 
			
			 obj.currentValue = obj.inner[0].style.webkitTransform; 		
			 obj.getValue = obj.currentValue.match(/\d+\.*\d+/);
			 obj.getValue = obj.getValue?obj.getValue[0]:0;			 
			 
		 },
		 
		 touchMove : function(obj,ev){
			  var ev = event || window.event;
				ev.preventDefault();
				obj.mX = ev.touches[0].pageX;
				obj.mY = ev.touches[0].pageY;
				
				var left = -obj.getValue - (obj.sX - obj.mX);
					  
				//console.log(left +"||"+ obj.limitX);
				
				if(Math.abs(left) >= obj.limitX){			
					left = obj.limitX								
					return false;
				}else if(left >= 0){	
					left = 0;						
					return false;
				}else{							
					 WN.setStyleAttribute(obj.inner[0],{
						 transitionDuration : '0s',
						transform : 'translateX('+left+'px)'
					 })	
				}				 
		 },
		 
		 touchEnd : function(obj,ev){
			  
				 var ev = event || window.event;
				 ev.preventDefault();
				 
				 obj.eX = ev.changedTouches[0].pageX;				 
				 
				 obj.dX = obj.sX - obj.eX;
				
		 }		 
	};
	
	Screen.defaults = {
		 
	}
	
	var mScreen = function(options){	
	    
      return new Screen(options);
  }
	
	window.mScreen = $.mScreen = mScreen;
	
})($, window);


/*===============输入发送*start============================*/
(function($, window, undefined){	
	
  
	 var Psend = function(options) { 	     
				this.opts = $.extend({}, Psend.defaults, options);        
				this.initize();        
    }
		
		Psend.prototype = {
		  initize : function(){	
			  var __this = this;
		    this.sCont = $(this.opts.showCont);
				this.sInput = $(this.opts.input)
				this.sBtn  = $(this.opts.sendBtn);
				this.iContHeight = Math.floor(this.sCont.height() + this.sCont.offset().top);
				
				this.sBtn.click(function(){					
				   	__this.updateCn(__this);
						
				});
				
		  },
			updateCn : function(__this){
				
				var sendValue = __this.sInput.val();
				var sendStr = '';				
				
				if(sendValue.replace(/\s/g,'')==''){
					alert('请输入内容');
				}else if(sendValue.length > __this.opts.limitWord){
					alert('允许输入最大字符数为:'+__this.opts.limitWord);
				}else{
					if(typeof __this.opts.beforeSend == 'function'){
						__this.opts.beforeSend();
					}
					
					var sendStr = "<li>"+sendValue+"</li>";
					__this.sCont.append(sendStr).find('li:last-child').fadeOut(0).fadeIn(500,function(){
						 if(typeof __this.opts.callBack == 'function'){
					     __this.opts.callBack.call();
					   }				
					});
					
					if(__this.isRemove()){
						//console.log('检测超出');
						$(this.opts.showCont+' li:first-child').fadeOut(0,function(){
							 $(this).remove();
							 if(__this.isRemove()){
								   $(__this.opts.showCont+' li:first-child').fadeOut(200,function(){
										   $(this).remove();
											 
									 });
							 }else{
								  return ; 
							 }
						});
					}
				}				
			},
			isRemove : function(){
				
				 var currentHeight = parseInt($(this.opts.showCont+' li:last-child').outerHeight());
				 var currentTop = parseInt($(this.opts.showCont+' li:last-child').offset().top);
				 var iLimitCont = currentHeight + currentTop;
				 
				 //console.log(currentTop +"+"+ currentHeight +"="+iLimitCont +"||"+ this.iContHeight);
				 
				 if(iLimitCont > this.iContHeight && this.sCont.size() >= 4){
					  return true; 
				 }else{
					  return false; 
				 }
			},
			callBack : function(){
		   	
		  }
		}
		
	Psend.defaults = {
		 limitWord : 120
	}
	
	var pSend = function(options){	
	    
      return new Psend(options);
  }
	
	window.pSend = $.pSend = pSend;
	
})($, window);   