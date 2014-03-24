


(function($w,$d,$n,$b){
    $_={cfg:{
        id:'picmark'
    }};
    
    //ファイル移動用イベントセット
    (function(){
        $IDEACOMPO.lib.event($w,'mousedown',function(evt){$_.mousedown(evt);return false;});
        $IDEACOMPO.lib.event($w,'mousemove',function(evt){$_.mousemove(evt);return false;});
        $IDEACOMPO.lib.event($w,'mouseup',function(evt){$_.mouseup(evt)});
        //$IDEACOMPO.lib.event($w,'mousedown',function(evt){alert(evt.target.tagName)});
    })();
    //ファイル移動
    $_.mousedown = function(evt){
        if(!evt.target){return}
        var src = evt.target.getAttribute('data-image-view');
        if(evt.target.tagName!='IMG' || !src){return}
        
        $IDEACOMPO.image.viewer(src);
        
    };
    $_.mouseup = function(evt){
        
    }
    $_.mousemove = function(evt){
        
    }
    
    //写真表示
    $_.view = {
        
        all:function(){
            
            if(typeof(pics)=='undefined'){return}
            
            var elm = $d.getElementById('pic_list');//console.log(elm);
            if(elm==null){return}
            
            
            //一覧表示
            for(var i=0;i<pics.pics.length;i++){
                var div = $d.createElement('div');
                div.className = 'pics';
                
                elm.appendChild(div);
                
                var html = "";
                html+= '<div class="picimg"><img class="pics" src="tool/system/img/anim/loading_35.gif" data-image-view="'+pics.pdata+pics.pics[i][1]+'" data-image-path="'+pics.pdata+pics.pics[i][1]+'" draggable="false"></div>';
                //html+= '<div class="picname">'+i+' ('.$cnt.')</div>';
                
                div.innerHTML = html;
                
            }
            
        },
        
    $:0};
    
    
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$_.cfg.id] = $_;
    return $_;
})(window,document,navigator,document.body);