
(function($w,$d,$n,$b){
    
    var $={};
    $.cfg={id:'books_read',page:0};
    
    $.set=function(){
        
        $.cfg.start = (+new Date());
        
        // page marker memory check.(web storage)
        if (typeof(sessionStorage)=='undefined') {return}
        
        $.cfg.page = sessionStorage.getItem($.cfg.id+"_page");
        
        var browser = $IDEACOMPO.lib.browser();
        
        //loading
        var loading = $d.createElement('div');
        loading.id = 'loading';
        loading.style.setProperty('position','absolute','');
        loading.style.setProperty('top','0','');
        loading.style.setProperty('left','0','');
        loading.style.setProperty('width','100%','');
        loading.style.setProperty('height',browser.y+'px','');
        loading.style.setProperty('opacity','0.5','');
        loading.style.setProperty('background-color','black','');
        loading.style.setProperty('text-align','center','');
        loading.style.setProperty('line-height',browser.y+'px','');
        loading.innerHTML = '<img src="tool/system/img/anim/loading0.gif" />';
        $d.body.appendChild(loading);
        
        //ajax開始
        $IDEACOMPO.ajax.start({
            url : document.form_param.url.value,
            target:$d.getElementById('book'),
            data: {
                tool : document.form_param.tool.value,
                menu : 'book_read_page',
                user : document.form_param.uid.value,
                book : document.form_param.book.value,
                //thumb:thumb,
                //file_name:file_name,
                //thumb_file:thumb_file,
                target:$d.getElementById('book')
            },
            onSuccess: function(res){//console.log(res);
                
                $.cfg.book_data = eval("("+res+")");
                
                $.cfg.page = ($.cfg.page)?$.cfg.page:0;
                
                //page view
                $.read.page($.cfg.page);
                $.read.page_count();
                
                //book read start.
                $.read.set();
                
                //bg-del
                var bg = $d.getElementById('loading');
                if(bg!=null){
                    bg.parentNode.removeChild(bg);
                }
                
                //time
                console.log(((+new Date()) - $.cfg.start)/1000+" sec");
            },
            onError:function(status_code){
                console.log('Error! status:' +status_code);
                console.log(this.data.tool+"/"+this.data.menu+"/"+this.data.user+"/"+this.data.file_name);
            },
            //onError        : function(status_code){con},
            onTimeout:function(){ alert('タイムアウトしました'); }
        });
        
        
    };
    /*
    $.evant={
        scroll:function(){
            $d.body.scrollTop=0;
        }
    };
    */
    //book_read
    $.read={
        //page view.
        page:function(page){
            var div = document.getElementById('book');
            //first page view.
            if(div!=null && typeof($.cfg.book_data.files)!='undefined' && $.cfg.book_data.files.length){
                var html='';
                html+= "<img src='"+$.cfg.book_data.dir+"/"+$.cfg.book_data.files[page]+"'>";
                
                // page readingfuture
                var page_next = (Number(page)+1<=$.cfg.book_data.files.length)?(Number(page)+1):null;
                if(page_next!=null){
                    html+= "<img src='"+$.cfg.book_data.dir+"/"+$.cfg.book_data.files[page_next]+"' style='display:none;'>";
                }
                
                var page_prev = (Number(page)-1>=0)?page:null;
                if(page_prev!=null){
                    html+= "<img src='"+$.cfg.book_data.dir+"/"+$.cfg.book_data.files[page_prev]+"' style='display:none;'>";
                }
                
                
                div.innerHTML = html;
            }
        },
        page_count:function(){
            if(typeof($.cfg.book_data)=='undefined' || typeof($.cfg.book_data.files)=='undefined'){return}
            
            //page count
            var page = $d.getElementById('page');
            if(page!=null){
                // current / total
                page.innerHTML = (Number($.cfg.page)+1)+"/"+$.cfg.book_data.files.length;
                
                // parsentage %
                //page.innerHTML = parseInt((Number($.cfg.page)+1) / $.cfg.book_data.files.length*100)+"%";
            }
        },
        set:function(){
            $IDEACOMPO.lib.event($w,'click',$.read.turn);
            
            
        },
        turn:function(evt){
            var br = $IDEACOMPO.lib.browser();
            
            //console.log("browser:"+br.x+"/"+br.y);
            //console.log("pos:"+evt.pageX+"/"+evt.pageY);
            
            //half of page size is right to next or left to prev
            
            // next ->
            if(evt.pageX > (br.x/3*2)){
                $.read.page_next();
            }
            // <- prev
            else if(evt.pageX < (br.x/3)){
                $.read.page_prev();
            }
            
        },
        page_next:function(){
            if(typeof($.cfg.book_data)=='undefined' || typeof($.cfg.book_data.files)=='undefined'){return}
            
            $.cfg.page++;
            if($.cfg.page>=$.cfg.book_data.files.length){
                $.cfg.page=$.cfg.book_data.files.length-1;
            }
            
            //memory
            sessionStorage.setItem($.cfg.id+'_page', $.cfg.page);
            
            //page view
            $.read.page($.cfg.page);
            
            //page count
            $.read.page_count();
        },
        page_prev:function(){
            if(typeof($.cfg.book_data)=='undefined' || typeof($.cfg.book_data.files)=='undefined'){return}
            
            $.cfg.page--;
            if($.cfg.page<=0){
                $.cfg.page=0;
            }
            
            //memory
            sessionStorage.setItem($.cfg.id+'_page', $.cfg.page);
            
            //page view
            $.read.page($.cfg.page);
            
            //page count
            $.read.page_count();
        }
        
    };
    
    
    
    
    $IDEACOMPO.lib.event($w,'load',$.set);
    //$IDEACOMPO.lib.event($w,'scroll',$.event.scroll);
    
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$.cfg.id]=$;
    return $;
})(window,document,navigator,document.body);