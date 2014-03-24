
(function($w,$d,$n,$b){
    
    var $={};
    $.cfg={id:'books'};
    
    
    
    $.loading=function(){
        
        var imgs = $d.getElementById('books_contents').getElementsByTagName('img');
        
        // only first image
        for(var i=0;i<imgs.length;i++){
            if(imgs[i].getAttribute('data-proc_end')){continue}
            //console.log("imgs:"+imgs[i].getAttribute('data-proc_end'));
            //console.log(imgs[i].getAttribute('data-thumb'));
            
            // not file is continue.
            if(!imgs[i].getAttribute('data-thumb')){continue}
            
            imgs[i].onload  = $.load;
            imgs[i].onerror = $.err;
            imgs[i].setAttribute('data-loading',imgs[i].src);
            imgs[i].src = imgs[i].getAttribute('data-thumb');
            //console.log("src:"+imgs[i].src);
            //imgs[i].setAttribute('data-thumb','');
            imgs[i].setAttribute('data-proc_end','1');
            
            break;
        }
        
        //make_thumb_link_hidden
        /*
        var make_thumb = $d.getElementById('make_thumb');
        if(make_thumb!=null && !imgs.length){
            make_thumb.style.setProperty('display','none','');
            make_thumb.onclick=function(){
                
            }
        }
        */
        //console.log(imgs.length);
        
    };
    
    $.load = function(evt){//console.log("load");
        
        // go next !
        if(evt.target.getAttribute('data-loading')){
            $.loading();
        }
    };
    
    $.err = function(evt){//console.log("err");
        if(!evt.target.getAttribute('data-loading')){return}
        
        var src = evt.target.src;
        evt.target.src = evt.target.getAttribute('data-loading');
        evt.target.setAttribute('data-loading','')
        
        //make_thumb
        $.make_thumb(evt.target,evt.target.getAttribute('data-link'),evt.target.getAttribute('data-thumb').split('?')[0]);
        
        $.time = (+new Date());
        
    };
    
    $.make_thumb=function(e,file_name,thumb_file){
        
        console.log("book-file:"+file_name);
        console.log("thumb:"+thumb_file);
        return;
        
        //ajax開始
        $IDEACOMPO.ajax.start({
            url : document.form_param.url.value,
            target:e,
            data: {
                tool : document.form_param.tool.value,
                menu : 'make_thumb',
                user : document.form_param.uid.value,
                //thumb:thumb,
                file_name:file_name,
                thumb_file:thumb_file,
                target:e,
                //読み込み数調整※下記ブランクの場合は上限無し
                //null=0（0スタート）
                //read_from:$.cfg.read_from,   //読み込み開始番号(1~**)
                //read_count:$.cfg.read_count,  //読み込み開始からのカウント数
                
            $:0},
            onSuccess: function(res){
                console.log("make thumb time : "+parseInt(((+new Date())-$.time)/100)/10+" sec");
                
                if(res){
                    this.data.target.src = res;
                }
                else{
                    this.data.target.src = this.data.target.getAttribute('data-dammy');
                }
                
                
                //new thumb
                $.loading();
                
                return;
                
            },
            onError:function(status_code){
                console.log('Error! status:' +status_code);
                console.log(this.data.tool+"/"+this.data.menu+"/"+this.data.user+"/"+this.data.file_name);
            },
            //onError        : function(status_code){con},
            onTimeout:function(){ alert('タイムアウトしました'); }
        });
        
    };
    
    
    $IDEACOMPO.lib.event($w,'load',$.loading);
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    
    $w.$IDEACOMPO[$.cfg.id]=$;
    return $;
})(window,document,navigator,document.body);
