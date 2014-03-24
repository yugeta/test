/**
 * 共通関数
 * 
**/

(function($w,$d,$n,$b){
    var $={cfg:{id:'IDEACOMPO'}};
    
    $.event = function(t,m,f){
        if (t.addEventListener){
            t.addEventListener(m, f, false);
        }
        else{
            t.attachEvent('on'+m,function(){f.call(t,$w.event)});
        }
    };
    $.mousemove = function(){
        //クッキー保持時間
        if(typeof($w.$IDEACOMPO)=='undefined'){return}
        if(typeof($w.$IDEACOMPO.cookie_end)=='undefined'){return}
        
        // session time over
        if((+new Date()) > $w.$IDEACOMPO.cookie_end){
            location.reload();
        }
        /*
        // time upload -> over write
        else{
            var exp=new Date();
            var val = "";
            val += (exp.getYear()+1900).toString();
            val += (exp.getMonth()+1).toString();
            val += (exp.getDay()).toString();
            val += (exp.getHours()).toString();
            val += (exp.getMinutes()).toString();
            val += (exp.getSeconds()).toString();
            
            exp.setTime(exp.getTime()+$w.$IDEACOMPO.cookie_end);
            //return exp.toGMTString();
            //console.log(exp);
            
            document.cookie = "fw\="+val+";expires\="+exp+";path=/;";
        }
        */
        //console.log((+new Date())+"/"+document.cookie +"/"+$w.$IDEACOMPO.cookie_end);
        
    };
    
    $.load = function(){
        //画像読み込み
        $IDEACOMPO.image.load_chain();
        
        
    };
    
    //この関数は、
    //クッキー切れの際に自動的にページをリロードさせる。
    //(function(){
        //console.log(document.cookie);
        var dead_time=0;
        var cookies = document.cookie.split('; ');
        for(var i=0;i<cookies.length;i++){
            //console.log('-'+cookies[i]+'-');
            var sp = cookies[i].split('=');
            if(sp[0]!='fw'){continue}
            //console.log(sp[1]);
            var data = sp[1].split('.');
            //有効期限切れで強制リロード
            if(data[2]){
                dead_time = data[2]*1000;
                setTimeout(function(){location.reload()},dead_time);
            }
            break;
        }
        
        //イベントに埋め込み
        //スタート時間を埋め込んで、終了時間を判定する
        if(dead_time){
            if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
            $w.$IDEACOMPO.cookie_end = (+new Date())+dead_time;
            
            //var t = $w;
            //var m = 'mousemove';
            /*
            var f = function(){
                if(typeof($w.$IDEACOMPO)=='undefined'){return}
                if(typeof($w.$IDEACOMPO.cookie_end)=='undefined'){return}
                if((+new Date()) > $w.$IDEACOMPO.cookie_end){location.reload()}
                //else{console.log(+new Date())}
            };
            
            var f = $_.loaded;
            */
            //イベント登録
            
            $.event($w,'mousemove',function(){$.mousemove()});
            $.event($w,'load',function(){$.load()});
            
            //mousemove
            /*
            if (t.addEventListener){
                t.addEventListener(m, f, false);
            }
            else{
                t.attachEvent('on' + m, function() { f.call(t , $w.event); });
            }
            
            
            //load
            if (t.addEventListener){
                t.addEventListener(m, f, false);
            }
            else{
                t.attachEvent('on' + m, function() { f.call(t , $w.event); });
            }
            */
        }
        
        
        
        
        
        
        
    //})($w,$b);
    
    
    
    return $;
})(window,document,navigator,document.body);