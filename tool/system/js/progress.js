/**
 * Loading , Wating 処理
 * 
 * ▶概要
 * 　読み込み時間が５秒以上かかる可能性がある場合は、進捗バーを表示して、ストレス軽減を行う必要がある。
 * 　本ツールをJSセットし、特定関数を指定するだけで、簡単に読込中アニメーションが実現できる。
 * 
 * ▶仕様
 * 
 * 
 * ▶設置方法
 *      
 * 
 **/

(function($w,$d,$n){
    
    var $ = {cfg:{id:'progress'}};
    
    //データフォーマット調整
    $.bar={
        //表示
        view:function(title){
            if($d.getElementById($.cfg.id)==null){
                var div = $d.createElement("div");
                div.id = $.cfg.id;
                div.style.setProperty("background-color","black","important");
                div.style.setProperty("opacity","0.5","important");
                div.style.setProperty("position","absolute","important");
                div.style.setProperty("top"   ,"0","important");
                div.style.setProperty("left"  ,"0","important");
                div.style.setProperty("width" ,$d.body.scrollWidth +"px","important");
                div.style.setProperty("height",$d.body.scrollHeight+"px","important");
                div.style.setProperty("text-align","center","important");
                div.style.setProperty("padding-top","100px","important");
                
                $d.body.appendChild(div);
                
                var html="";
                
                //closeボタン
                
                
                //タイトル
                html += "<div id='"+$.cfg.id+"_title' style='font-size:30px;font-weight:bold;color:white;'>"+((title)?title:"Loading...")+"</div>";
                
                //icon
                html += "<img src='tool/system/img/anim/loading_32.gif' style='margin:20px;' />";
                
                //進捗バー
                //html += "<div id='"+$.cfg.id+"_anim' style='width:320px;height:30px;background-color:white;text-align:left;margin:10px auto;'></div>";
                
                
                div.innerHTML = html;
                
            }
            
            
        },
        //削除
        close:function(){
            var e = $d.getElementById($.cfg.id);
            if(e!=null){
                e.parentNode.removeChild(e);
            }
            
        }
    };
    
    $.anim={
        
    };
    
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$.cfg.id] = $;
    return $;
})(window,document,navigator);