/**
 * List View Library
 * ▶概要
 * 　写真ファイル構成データを一括AJAX保持
 * 　写真詳細情報は随時AJAXからの読み込みで行う。（必要な箇所のみ）
**/
(function($w,$d,$n,$b){
    var $ = {cfg:{id:'list'},data:{},event:{}};
    
    //写真表示
    $.view = {
        
        //読込中処理※読み込み完了で、アトリビュートを削除
        loading:function(){
            
            var img = document.getElementsByTagName('img');
            
            for(var i=0;i<img.length;i++){
                //ロードデータ確認
                var img_load = img[i].getAttribute('data-image-load');
                if(!img_load){continue}
                
                img[i].src = img_load;
                img[i].setAttribute('data-image-load','');
                
            }
            
        },
        
        //日ごとの表示
        day:function(data){
            
            var y = [];
            
            for(var i in $w.data.date){
                //y.push(i);
                y[y.length] = i;
            }
            
            console.log(y.join(","));
            
        },
        
    $:0};
    
    
    //ファイル移動用イベントセット
    (function(){
        //$IDEACOMPO.lib.event($w,'click',function(evt){$.event.click(evt);return false;});
        
        $IDEACOMPO.lib.event($w,'mousedown',function(evt){$.event.select_clear(evt);return false;});
        //$IDEACOMPO.lib.event($w,'mousemove',function(evt){$.event.move(evt);return false;});
        //$IDEACOMPO.lib.event($w,'mouseup',function(evt){$.event.up(evt)});
        
        //$IDEACOMPO.lib.event($w,'mousedown',function(evt){alert(evt.target.tagName)});
        $IDEACOMPO.lib.event($w,'keydown',function(evt){$.event.keydown(evt)});
        $IDEACOMPO.lib.event($w,'keyup',function(evt){$.event.keyup(evt)});
    })();
    
    //ファイル移動
    $.event={
        
        select_clear:function(evt){
            
            //console.log(evt.target);return;
            // ignore menu-list
            if($IDEACOMPO.lib.search.css(evt.target,'menu_list')){return}
            
            // clear
            class_name = 'pics_sel';
            if(!$.event.shift){
            
                //全部削除
                var pic_list = $d.getElementById('pic_list');
                if(pic_list!=null){
                    var selected = pic_list.getElementsByClassName(class_name);
                    for(var i=selected.length-1;i>=0;i--){
                        $IDEACOMPO.lib.element.class_del(selected[i],class_name);
                    }
                }
            }
        },
        
        select:function(elm){
            if(!elm){return}
            
            class_name = 'pics_sel';
            
            if(!$.event.shift){
                //追加
                $IDEACOMPO.lib.element.class_add(elm,class_name);
            }
            else{
                //追加
                if(!$IDEACOMPO.lib.element.class_check(elm,class_name)){
                    $IDEACOMPO.lib.element.class_add(elm,class_name);
                }
                //削除
                else{
                    $IDEACOMPO.lib.element.class_del(elm,class_name);
                }
            }
        },
        
        click : function(evt){
            var target;
            if(!evt){}
            else if(evt.nodeType==1){target = evt}
            else if(evt.target.nodeType==1){target = evt.target}
            if(!target){return}
            
            //初期設定
            var link   = target.getAttribute('data-image-link');
            var folder = target.getAttribute('data-folder-link');
            
            console.log(link+" : "+folder);
            
            //イメージ拡大表示
            if(link){
                $IDEACOMPO.image.viewer(link);
            }
            
            //folder
            else if(folder){
                //console.log(folder);
                $.thumb.view(folder);
            }
            
            //console.log(link+" : "+folder);
        },
        /*
        up : function(evt){
            if($.cfg.file_move_flg){
                delete $.cfg.file_move_flg;
                console.log("end");
            }
        },
        move : function(evt){
            if(!$.cfg.file_move_flg){return}
            
            console.log(+new Date());
            
            return false;
        }
        */
        keydown:function(evt){
            //console.log('keydown:'+evt.keyCode);
            if(evt.shiftKey){
                $.event.shift = true;
            }
            
        },
        keyup:function(evt){
            //console.log(evt.keyCode);
            //console.log(evt.shiftKey);
            if(typeof(evt.shiftKey)!='undefined'){
                $.event.shift = false;
            }
        },
        
        error_thumb:function(e){
            
            var e2 = $IDEACOMPO.lib.search.css(e.parentNode,'folder');
            if(!e2){
                e2 = $IDEACOMPO.lib.search.css(e.parentNode,'file');
            }
            
            //console.log("error:"+e.src);
            //console.log('tool/system/img/128/stop.png');
            console.log(e2.getAttribute('data-image-link'));
            
            //拡張子確認
            var attr = e2.getAttribute('data-image-link');
            if(!attr){
                e.src = 'tool/system/img/64/paper.png';
            }
            
            var sp = attr.split('.');
            ext = sp[sp.length-1].toLowerCase();
            
            console.log(e.src+" : "+ext);
            
            //music
            if(ext=='mp3'){
                e.src = 'tool/system/img/128/music.png';
            }
            //movie
            else if(ext=='avi' || ext=='mp4' || ext=='mpg'){
                e.src = 'tool/system/img/128/movie.png';
            }
            //image
            else{
                e.src = 'tool/system/img/64/paper.png';
            }
            
            
            //e.style.setProperty('widht','64px','important');
        },
        
    $:0};
    
    // Slide-show
    $.slide_show={
        play:function(){
            //console.log('slide-show');
            
            var pic_list = $d.getElementById('pic_list');
            if(pic_list==null){return}
            
            var lists = pic_list.getElementsByClassName('pics_sel');
            if(!lists.length){return}
            
            var pics = [];
            for(var i=0;i<lists.length;i++){
                //console.log(lists[i].getAttribute('data-folder-link'));
                var folder = lists[i].getAttribute('data-folder-link');
                if(folder){
                    //写真リストを追加する
                    pic_data = this.data2pics(folder);
                    for(var j=0;j<pic_data.length;j++){
                        pics.push(pic_data[j]);
                        //console.log(j+"/"+pic_data[j]);
                    }
                }
                
                
            }
            
            //スライドショー再生
            
            if(pics.length){
                $IDEACOMPO.image.slideshow(pics);
            }
            
        },
        //folder data -> pics
        data2pics:function(folder){
            if(!folder){return []}
            
            var folders = folder.split('/');
            var pics = [];
            for(var dir in $.data){
                for(var y in $.data[dir]){
                    
                    if(folders.length>=1 && folders[0]!=y){continue}
                    for(var m in $.data[dir][y]){
                        
                        if(folders.length>=2 && folders[1]!=m){continue}
                        for(var d in $.data[dir][y][m]){
                            
                            if(folders.length>=3 && folders[2]!=d){continue}
                            for(var f=0;f<$.data[dir][y][m][d].length;f++){
                                pics.push(dir + y +'/'+ m.toString() + d.toString() +"/"+ $.data[dir][y][m][d][f]);
                            }
                        }
                    }
                }
            }
            return pics;
        }
    };
    
    /**
     * サムネイル表示
     * 【概要】
     * データ一覧を引き渡せば、現在の画像エリアにサムネイルを表示する
     * 【仕様】
     * dir:  対象ディレクトリ data/picmark/%user%/
     * pics: yyyy/mmdd/hhiiss.ext
     * 
     * 表示した際に、メモリ保存する。($w.pics)
    **/
    $.thumb = {
        
        list_clear:function(){
            var elm = $d.getElementById('pic_list');
            if(elm==null){return}
            elm.innerHTML = '';
            return elm;
        },
        
        view:function(folder){
            
            this.list_clear();
            
            // month
            if(folder && folder.split('/').length==1){
                //this.month(folder);
                this.lists('month',folder);
            }
            //day
            else if(folder && folder.split('/').length==2){
                //this.day(folder);
                this.lists('day',folder);
            }
            //pisc
            else if(folder && folder.split('/').length==3){
                //this.pics(folder);
                this.lists('pics',folder);
            }
            //year
            else{
                this.lists('year');
            }
            
            // will read thumbnail
            //setTimeout($.view.loading, 0);
        },
        
        //自動判定用フラグ
        lists_mode:{
            year:0,
            month:1,
            day:2,
            pics:3
        },
        breadcrumb_list_addvalue:['年','月','日'],
        
        //breadcrumb_list
        breadcrumb_list:function(mode,folder){
            
            var folders = [];
            if(folder){
                folders = folder.split('/');
            }
            
            //var folder_names = folders
            //folder_names.unshift('Top');
            var html=[];
            var folder2=[];
            var folder_names=['Top'];
            
            for(var i=0;i<folders.length;i++){
                folder_names.push(folders[i]+this.breadcrumb_list_addvalue[i]);
            }
            for(var i=0;i<folder_names.length;i++){
                if(folder_names.length-1==i){
                    html.push(folder_names[i]);
                }
                else{
                    html.push('<a href="javascript:void(0)" onclick="$IDEACOMPO.list.thumb.view(\''+folder2.join('/')+'\')">'+folder_names[i]+'</a>');
                    folder2.push(folders[i]);
                }
                
            }
            return '<div class="breadcrumb_list">'+html.join(' > ')+'</div>';
        },
        
        //thumbnail-pics
        pics:function(elm,mode,dir,y,m,d,f,num){
            
            var div = $d.createElement('div');
            //div.className = 'pic_frame';
            if(mode=='pics'){
                div.className = 'folder';
            }
            else{
                div.className = 'file';
            }
            
            elm.appendChild(div);
            
            // Pfirst-icture and Name Insert
            var image = dir + y +'/'+ m +d+"/"+ f;
            var thumb = this.thumb_ext(image);
            var loading = 'tool/system/img/anim/loading_35.gif';
            var file_name = '';
            var folder = '';
            var count = {obj:0,pics:0};
            if(mode=='year'){
                file_name = y+'年';
                folder = y;
                image = '';
                count.pics = this.pics_count($.data[dir][y]);
                count.obj  = this.obj_count($.data[dir][y]);
            }
            else if(mode=='month'){
                file_name = y+'年'+m+'月';
                folder = y+"/"+m;
                image = '';
                count.pics = this.pics_count($.data[dir][y][m]);
                count.obj  = this.obj_count($.data[dir][y][m]);
            }
            else if(mode=='day'){
                file_name = y+'年'+m+'月'+d+'日';
                folder = y+"/"+m+"/"+d;
                image = '';
                count.pics = this.pics_count($.data[dir][y][m][d]);
                count.obj  = this.obj_count($.data[dir][y][m][d]);
            }
            else if(mode=='pics'){
                //folder = y+"/"+m+"/"+d+'/'+data[dir][y][m][d][i];
                //file_name = y+'年'+m+'月'+d+'日'+'<br>'+f;
                file_name = f;
            }
            
            //フォルダの場合は、中に写真データがいくつ入っているか数値を表示
            if(count.pics){
                file_name += '<br>('+count.obj+' data/ '+count.pics+' pics)';
            }
            
            //set attribute
            // data-image-link="'+image+'" data-folder-link="'+folder+'"
            div.setAttribute('data-image-link' ,image);
            div.setAttribute('data-folder-link',folder);
            //ファイルの場合
            if(image){
                div.onclick = function(){$.event.click(this)};
            }
            //フォルダの場合
            else{
                div.onclick = function(){$.event.select(this)};
                div.ondblclick = function(){$.event.click(this)};
            }
            
            div.innerHTML =  $IDEACOMPO.picmark_lib.html(loading, thumb , file_name ,num);
        },
        //オブジェクトの中にstringがいくつあるか数える
        pics_count:function(data){
            var count=0;
            
            if(typeof(data)=='string'){
                count++;
            }
            else{
                if(data.length){
                    return data.length;
                }
                else{
                    for(var i in data){
                        count+= this.pics_count(data[i]);
                    }
                }
            }
            
            return count;
        },
        //データ直下の階層数をカウント
        obj_count:function(data){
            var count=0;
            
            if(typeof(data)=='object'){
                if(data.length){
                    return data.length;
                }
                else{
                    for(var i in data){
                        count++;
                    }
                }
            }
            
            return count;
        },
        
        // Specifitic List View
        lists:function(mode,folder){
            
            var data = $.data;
            var elm = this.list_clear();
            
            mode   = (mode)?mode:'year';
            folder = (folder)?folder:"";
            var folders = folder.split('/');
            
            var num=1;
            
            //breadcrumb_list
            elm.innerHTML = this.breadcrumb_list(mode,folder);
            
            for(var dir in data){
                for(var y in data[dir]){
                    
                    //console.log(folder +' : '+ folders[0] +' : '+ y);
                    if(folder && folders[0] && y!=folders[0]){continue}
                    for(var m in data[dir][y]){
                        
                        if(folder && folders[1] && m!=folders[1]){continue}
                        for(var d in data[dir][y][m]){
                            
                            if(folder && folders[2] && d!=folders[2]){continue}
                            for(var i=0;i<data[dir][y][m][d].length;i++){
                                
                                //thumbnail
                                this.pics(elm,mode,dir,y,m,d,data[dir][y][m][d][i] , num++);
                                
                                //check
                                if(this.lists_mode[mode]<3){break}
                            }
                            //check
                            if(this.lists_mode[mode]<2){break}
                        }
                        //check
                        if(this.lists_mode[mode]<1){break}
                    }
                    
                }
            }
            //サムネイル表示
            $.view.loading();
        },
        // image-file to thumb-file
        thumb_ext:function(file){//console.log(file);
            if(!file){return}
            
            var sp = file.split('.');
            return sp.splice(sp.length-2,1).join('.') +'.s.jpg';
            
        },
    $:0};
    
    $.menu={
        pics_count:function(){
            var menu = $d.getElementById('menu_list');
            if(menu==null){return}
            
            var lists = menu.getElementsByClassName('menu');
            for(var i=0;i<lists.length;i++){
                if(!lists[i].getAttribute('data-menu')){continue}
                lists[i].innerHTML += ' ('+this.count(lists[i].getAttribute('data-menu'))+' data)';
            }
            
        },
        count:function(data_menu){
            var count=0;
            for(var dir in $.data){
                for(var y in $.data[dir]){
                    if(data_menu=='year'){count++}
                    else{
                        for(var m in $.data[dir][y]){
                            if(data_menu=='month'){count++}
                            else{
                                for(var d in $.data[dir][y][m]){
                                    if(data_menu=='day'){count++}
                                    else{
                                        for(var f in $.data[dir][y][m][d]){
                                            if(data_menu=='pics'){count++}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return count;
        }
    };
    
    
    //Ajax Data Momories
    $.memory = function(data){
        
        if(!data){return}
        
        $.cfg.dir  = data.dir;
        $.cfg.date = data.date;
        $.cfg.file_count = data.file_count;
        
        for(var i in data.pics){
            if(typeof($.cfg.pics[i])!='undefined'){continue}
            
            $.cfg.pics[i] = data.pics[i];
        }
        
        
    };
    
    $.keep = function(data){
        
        if(!data){return}
        
        if(typeof($w.data)=='undefined'){$w.data={}} 
        
        //対象フォルダ
        $w.data.dir = data.dir;
        $w.data.end = data.end;
        $w.data.date= data.date;
        
        //個別データ
        if(typeof($w.data.pics)=='undefined'){$w.data.pics={}} 
        
        for(var i in data.pics){
            $w.data.pics[i] = data.pics[i];
        }
        
        
    };
    
    //ajax処理　※「もっと読み込む」ボタンを押した処理
    $.pics_add=function(){
        
        //progress-bar
        $IDEACOMPO.progress.bar.view();
        
        var more = $d.getElementById($.cfg.id+'_more');
        if(more!=null){
            more.parentNode.removeChild(more);
        }
        
        //開始値を変更
        $.cfg.read_from += $.cfg.read_count;
        
        $.cfg.ajax_start = (+new Date());
        //ajax開始
        $IDEACOMPO.ajax.start({
            url : document.form_param.url.value,
            data: {
                tool : document.form_param.tool.value,
                mode : 'list',
                user : document.form_param.uid.value,
                
                //読み込み数調整※下記ブランクの場合は上限無し
                //null=0（0スタート）
                //read_from:$.cfg.read_from,   //読み込み開始番号(1~**)
                //read_count:$.cfg.read_count,  //読み込み開始からのカウント数
                
            $:0},
            onSuccess    : function(res){
                //console.log(res);
                
                if(res){
                    var data = eval('('+res+')');
                    
                    if(!data){return}
                    // to memories
                    $.data = data;
                    
                    // Pics Data View
                    $.thumb.lists();
                    
                    // Menu-list count
                    $.menu.pics_count();
                }
                
                //Pics Data Memories
                //$.memory(data);
                
                //progress-bar
                $IDEACOMPO.progress.bar.close();
                
                // use time
                console.log('Data Loading Time : '+(((+new Date()) - $.cfg.ajax_start)/1000)+' s');
                
            },
            //onError        : function(status_code){ alert('Error! status:' +status_code); },
            onError:function(status_code){
                console.log('error');
            },
            onTimeout:function(){
                alert('タイムアウトしました');
            }
        });
        
        
    };
    
    //$d.body.unselectable = 'ON';
    
    //起動時処理
    $IDEACOMPO.lib.event($w,'load',$.pics_add);
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$.cfg.id] = $;
    return $;
})(window,document,navigator,document.body);