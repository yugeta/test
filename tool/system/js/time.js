/**
 * 時間に関わる関数処理
 * 
 * 
 * 1) time-format
 *      hhiiss -> hh:ii:ss
 * 
 * 2) sec2format
 * 
 *      
 * 
 **/

(function($w,$d,$n){
    
    var $={cfg:{id:'time'}};
    
    //データフォーマット調整
    
    //
    //num -> **hour **min **sec
    $.sec2format = function(sec){
        if(!sec || typeof(sec)!='number'){return 0}
        
        if(sec<60){
            return sec+'sec';
        }
        else if(sec<3600){
            var min = parseInt(sec/60);
            return min+'min '+(sec-(min*60))+'sec';
        }
        else{
            var hour = parseInt(sec/3600);
            var min  = parseInt((sec-(hour*3600))/60);
            return hour+'hour '+min+'min '+(sec-((hour*3600)+(min*60)))+'sec';
        }
        
        
    }
    
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$.cfg.id] = $;
    return $;
})(window,document,navigator);
