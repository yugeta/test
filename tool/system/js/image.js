//----------
//画像処理関数ライブラリ
//----------
(function($w,$d,$n,$b){
    //各種初期設定
    var $ = {
        cfg:{
            id:'image',
            img_id:'IDEACOMPO_image_preview',
            bg_id:'IDEACOMPO_bg'
        },
        data:{}
    };
    
    //ページonload後大量画像の読み込み
    //画像の読み込みを待ってから順番に読み込みするモード
    $.load_chain = function(){//console.log('img');
        var imgs = document.getElementsByTagName('img');
        
        var flg=0;
        for(var i=0;i<imgs.length;i++){
            var src = imgs[i].getAttribute('data-image-path');
            if(!src){continue}
            
            //console.log(src);
            
            imgs[i].src = src;
            imgs[i].setAttribute('data-image-path','');
            flg++;
            break;
        }
        
        if(flg){
            setTimeout(function(){$.load_chain()},100);
        }
        
    };
    
    //画面中央にイメージ拡大表示
    $.viewer = function(path){
        
        //画像指定なしの場合は、既存表示を削除する。
        var bg = document.getElementById($.cfg.bg_id);
        if(bg!=null){bg.parentNode.removeChild(bg)}
        var img = document.getElementById($.cfg.img_id);
        if(img!=null){img.parentNode.removeChild(img)}
        
        if(!path){return}
        //console.log(path);
        
        $.viewer_lib.bg_create();
        
        //画像表示
        var img = document.createElement('img');
        img.id = $.cfg.img_id;
        //img.src = path;
        img.src = 'tool/system/img/anim/loading1.gif';
        img.setAttribute('data-src',path);
        img.style.setProperty('position','fixed','important');
        img.style.setProperty('box-shadow','4px 4px 10px rgba(0,0,0,0.5)','important');
        
        
        //else{
        img.onload=function(){
            
            console.log('image-onload:'+this.src);
            
            //ブラウザサイズの取得
            var disp = $IDEACOMPO.lib.browser();
            
            //最大サイズの調整
            this.style.setProperty('max-width' , (disp.x*0.8)+'px','important');
            this.style.setProperty('max-height', (disp.y*0.8)+'px','important');
            
            //
            var x = (disp.x/2)-(this.offsetWidth/2);
            var y = (disp.y/2)-(this.offsetHeight/2);
            
            this.style.setProperty('top' , y+'px','important');
            this.style.setProperty('left', x+'px','important');
            
            //console.log(disp.x+"/"+disp.y+" : "+x+"/"+y+" : "+this.offsetWidth+"/"+this.offsetHeight);
            var attr = 'data-src';
            var src = this.getAttribute(attr);
            if(src){
                this.src = src;
                this.setAttribute(attr,'');
            }
            
            
        };
        
        //$IDEACOMPO.lib.event(img,'load',onload);
        //}
        document.body.appendChild(img);
        
    };
    $.viewer_lib = {
        //事前処理（既存データの削除）
        clear:function(){
            //画像指定なしの場合は、既存表示を削除する。
            var bg = document.getElementById($.cfg.bg_id);
            if(bg!=null){bg.parentNode.removeChild(bg)}
            var img = document.getElementById($.cfg.img_id);
            if(img!=null){img.parentNode.removeChild(img)}
        },
        bg_create:function(){
            //bg表示（黒バック）
            var bg = document.createElement('div');
            bg.id = $.cfg.bg_id;
            bg.style.setProperty('position','absolute','important');
            bg.style.setProperty('top' ,'0','important');
            bg.style.setProperty('left','0','important');
            bg.style.setProperty('width' ,document.body.scrollWidth +'px','important');
            bg.style.setProperty('height',document.body.scrollHeight+'px','important');
            bg.style.setProperty('background-color','black','important');
            bg = $IDEACOMPO.lib.alpha(bg,80);
            //表示終了
            bg.onclick=function(){
                $.viewer();
                if(typeof($.data.settimeout)!='undefined'){clearTimeout($.data.settimeout)}
            };
            /*
            bg.mousemove=function(){
                var bg = document.getElementById($.cfg.bg_id);
                if(bg==null){return}
                bg.style.setProperty('width' ,document.body.scrollWidth +'px','important');
                bg.style.setProperty('height',document.body.scrollHeight+'px','important');
            };
            */
            document.body.appendChild(bg);
        },
        
        
    $:0};
    
    // slide-show
    $.slideshow = function(pics,time){
        if(!pics || !pics.length){return}
        
        // bg -clear - make
        var bg = document.getElementById($.cfg.bg_id);
        if(bg!=null){bg.parentNode.removeChild(bg)}
        
        $.viewer_lib.bg_create();
        
        
        //初期設定
        $.data.time = ((time)?time:5)*1000;// sec -> msec
        
        //メモリに保存
        $.data.pics = pics;
        $.data.num  = 0;
        $.data.next = function(){
            //console.log("time:"+$.data.time);
            $.data.settimeout = setTimeout(function(){$.slideshow_lib.play($.data.onload)} , $.data.time);
        };
        
        //start
        $.slideshow_lib.play();
        
        
    };
    $.slideshow_lib={
        play:function(){
            
            console.log("play:"+$.data.num);
            
            $.data.num++;
            if($.data.pics.length <= $.data.num){$.data.num=0}
            
            $.slideshow_lib.view($.data.pics[$.data.num]);
            
        },
        view:function(path){
            
            if(!path){return}
            
            //画像指定なしの場合は、既存表示を削除する。
            var img = document.getElementById($.cfg.img_id);
            //if(img!=null){img.parentNode.removeChild(img)}
            
            if(img==null){
            //画像表示
                img = document.createElement('img');
                img.id = $.cfg.img_id;
                img.setAttribute('data-src',path);
                //img.src = path;
                img.src = 'tool/system/img/anim/loading1.gif';
                img.style.setProperty('position','fixed','important');
                img.style.setProperty('box-shadow','4px 4px 10px rgba(0,0,0,0.5)','important');
                img.onload = $.slideshow_lib.img_onload;
                
                document.body.appendChild(img);
                /*
                img.onerror = function(){
                    console.log('image-onerror:'+this.src);
                };
                */
            }
            else{
                img.setAttribute('data-src',path);
                img.src = 'tool/system/img/anim/loading1.gif';
                //$.slideshow_lib.img_pos(img);
            }
            
            
        },
        img_onload:function(evt){
            
            var img = evt.target;
            
            console.log('image-onload:'+img.src);
            
            $.slideshow_lib.img_pos(img);
            
            var attr = 'data-src';
            var src = img.getAttribute(attr);
            if(src){
                
                img.src = src;
                img.setAttribute(attr,'');
                
                //console.log('image-onload:'+img.src);
                
                //
                if($.data.settimeout){clearTimeout($.data.settimeout)}
                
                //スライドショー実行
                $.data.next();
            }
        },
        img_pos:function(img){
            if(!img){return}
            //ブラウザサイズの取得
            var disp = $IDEACOMPO.lib.browser();
            
            //最大サイズの調整
            img.style.setProperty('max-width' , (disp.x*0.8)+'px','important');
            img.style.setProperty('max-height', (disp.y*0.8)+'px','important');
            
            //
            var x = (disp.x/2)-(img.offsetWidth/2);
            var y = (disp.y/2)-(img.offsetHeight/2);
            
            img.style.setProperty('top' , y+'px','important');
            img.style.setProperty('left', x+'px','important');
        },
    $:0};
    
    
    $.event = {
        resize:function(){
            //console.log("resize");
            var bg = document.getElementById($.cfg.bg_id);
            if(bg==null){return}
            bg.style.setProperty('width' ,'100%','important');
            bg.style.setProperty('height','100%','important');
            bg.style.setProperty('width' ,document.body.scrollWidth +'px','important');
            bg.style.setProperty('height',document.body.scrollHeight+'px','important');
            
        }
    };
    
    //console.log(typeof($IDEACOMPO));
    //$IDEACOMPO.lib.event($w,'resize',$.event.resize);
    //$IDEACOMPO.lib.event($w,'load',function(){alert(1)});
    window.onresize = function(){$.event.resize()};
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$.cfg.id] = $;
	return $;
})(window,document,navigator,document.body);