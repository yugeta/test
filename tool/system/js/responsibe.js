/**
 * responsive design
 * PC(full:960-) / middle(double-triple:640-960) / smartphone(single-double:320-640)
**/

(function($w,$d,$n,$b){
    var $={cfg:{id:'responsive'}};
    
    // loaded start up.
    $.start_up=function(){
        
        /*
        var meta = '<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no">';
        document.write(meta);
        */
        
        var meta = $d.createElement('meta');
        meta.name='viewport';
        meta.content = 'width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no';
        
        var head = $d.getElementsByTagName('head');
        head[0].appendChild(meta);
        
        var links = head[0].getElementsByTagName('link');
        
        //console.log($w.innerWidth);
        
        for(var i=0;i<links.length;i++){
            //links[i].disabled = true;
            
            
            
        }
        
        
        //alert($w.innerWidth);
        
        /*
        var head = $d.getElementsByTagName('head');
        
        if(head.length){
            //console.log("b");
            
            head[0].onDOMContentLoaded = function(){
                console.log("aaa");
                var meta = document.createElement('meta');
                meta.name='viewport';
                meta.content = 'width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no';
                this.appendChild(meta);
            };
        }
        */
        //console.log(typeof($w.$IDEACOMPO.lib));
        
        
    };
    
    
    //setTimeout(function(){$.start_up()},0);
    $.start_up()
    
    
    if(typeof($w.$IDEACOMPO)!='undefined'){
        $w.$IDEACOMPO[$.cfg.id]=$;
    }
    
    /*
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$.cfg.id]=$;
    */
    return $;
})(window,document,navigator,document.body);