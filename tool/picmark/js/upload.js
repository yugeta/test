


(function($w,$d,$n,$b){
    $_={cfg:{
        id:'picmark'
    }};
    
    //階層表示のパカパカ
    $_.dir = function(elm){
        
        //直近上位のULタグを探す
        var ul = elm.parentNode.childNodes;
        if(!ul.length){return}
        
        //現在のdisplay状態を検索（表示←→非表示）を切り替える
        var flg = elm.open_flg;
        if(elm.open_flg){
            elm.open_flg = false;
        }
        else{
            elm.open_flg = true;
        }
        
        for(var i=0;i<ul.length;i++){
            if(ul[i].nodeType!=1 || ul[i].tagName!='UL'){continue}
            
            //表示
            if(flg){
                ul[i].style.setProperty("display","none","");
                elm.src = elm.src.replace('folder.png','dir.png');
            }
            //非表示
            else{
                ul[i].style.setProperty("display","block","");
                elm.src = elm.src.replace('dir.png','folder.png');
            }
        }
    };
    
    //ファイル移動用イベントセット
    (function(){
        $IDEACOMPO.lib.event($w,'mousedown',function(evt){$_.file_move_down(evt);return false;});
        $IDEACOMPO.lib.event($w,'mousemove',function(evt){$_.file_move(evt);return false;});
        $IDEACOMPO.lib.event($w,'mouseup',function(evt){$_.file_move_up(evt)});
        //$IDEACOMPO.lib.event($w,'mousedown',function(evt){alert(evt.target.tagName)});
    })();
    //ファイル移動
    $_.file_move_down = function(evt){
        if(!evt.target){return}
        //console.log(evt.target.tagName);
        if(evt.target.parentNode.tagName=='LI' && evt.target.parentNode.className=='file'){
            $_.cfg.file_move_flg=true;
        }
        return false;
    };
    $_.file_move_up = function(evt){
        if($_.cfg.file_move_flg){
            delete $_.cfg.file_move_flg;
            console.log("end");
        }
    }
    $_.file_move = function(evt){
        if(!$_.cfg.file_move_flg){return}
        
        console.log(+new Date());
        
        return false;
    }
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$_.cfg.id] = $_;
    return $_;
})(window,document,navigator,document.body);