


(function($w,$d,$n,$b){
    $_={cfg:{
        id:'picview',
        read_from:0,
        read_count:50,
        
        //memory
        dir:'',
        file_count:0,
        date:{},
        pics:{},
        
    $:0}};
    
    /*
    //ファイル移動用イベントセット
    (function(){
        //$IDEACOMPO.lib.event($w,'mousedown',function(evt){$_.mousedown(evt);return false;});
        //$IDEACOMPO.lib.event($w,'mousemove',function(evt){$_.mousemove(evt);return false;});
        //$IDEACOMPO.lib.event($w,'mouseup',function(evt){$_.mouseup(evt)});
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
    */
    
    //写真表示
    $_.view = {
        /*
        //ページ起動時
        set:function(){
            
            if(typeof(pics)=='undefined'){return}
            
            var elm = $d.getElementById('pic_list');
            if(elm==null){return}
            
            //var dir_reg = RegExt(pics.dir,'g');
            //サムネイル一覧表示
            $_.thumb.view(pics.dir , pics.pics);
            
        },
        */
        
        //読込中処理※読み込み完了で、アトリビュートを削除
        loading:function(){
            
            var img = document.getElementsByTagName('img');
            
            for(var i=0;i<img.length;i++){
                //ロードデータ確認
                var img_load = img[i].getAttribute('data-image-load');
                if(!img_load){continue}
                
                img[i].src = img_load;
                img[i].setAttribute('data-image-load','');
                
                //break;
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
        $IDEACOMPO.lib.event($w,'mousedown',function(evt){$_.event.down(evt);return false;});
        $IDEACOMPO.lib.event($w,'mousemove',function(evt){$_.event.move(evt);return false;});
        $IDEACOMPO.lib.event($w,'mouseup',function(evt){$_.event.up(evt)});
        //$IDEACOMPO.lib.event($w,'mousedown',function(evt){alert(evt.target.tagName)});
    })();
    
    //ファイル移動
    $_.event={
        down : function(evt){
            if(!evt.target){return}
            //console.log(evt.target.tagName);
            if(evt.target.parentNode.tagName=='LI' && evt.target.parentNode.className=='file'){
                $_.cfg.file_move_flg=true;
            }
            
            if(evt.target){
                var src = evt.target.getAttribute('data-image-link');
                if(evt.target.tagName!='IMG' || !src){return}
                
                $IDEACOMPO.image.viewer(src);
            }
            
        },
        up : function(evt){
            if($_.cfg.file_move_flg){
                delete $_.cfg.file_move_flg;
                console.log("end");
            }
        },
        move : function(evt){
            if(!$_.cfg.file_move_flg){return}
            
            console.log(+new Date());
            
            return false;
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
    $_.thumb = {
        view:function(data,mode){
            //Data Check
            if(!data.dir || !data.pics){return}
            
            //Insert Element Check
            var elm = $d.getElementById('pic_list');
            if(elm==null){return}
            
            //「もっと読む」ボタンの削除
            var more = $d.getElementById($_.cfg.id+'_more');
            if(more!=null){
                more.parentNode.removeChild(more);
            }
            
            mode='day';
            
            // Single Picture view
            if(!mode || mode=='pics'){
                this.pics(elm,data.dir,data.pics);
            }
            else if(mode=='year'){
                this.year(elm,data.dir,data.date);
                data.end = "";
            }
            else if(mode=='month'){
                this.month(elm,data.dir,data.date);
                data.end = "";
            }
            else if(mode=='day'){
                this.day(elm,data.dir,data.date);
                data.end = "";
            }
            
            setTimeout($_.view.loading, 0);
            
            //「もっと読む」ボタンを追加※フラグが立っている場合は読むボタンを表示
            if(data.end){
                var div = $d.createElement('div');
                div.id = $_.cfg.id+'_more';
                div.innerHTML = 'もっと読み込む';
                div.onclick = $_.pics_add;
                elm.appendChild(div);
            }
        },
        
        //画像単体表示
        pics:function(elm,dir,pics){
            
            for(var i in pics){
                
                // Picture Frame Make
                var div = $d.createElement('div');
                div.className = 'pics';
                elm.appendChild(div);
                
                // Picture and Name Insert
                var base = dir + pics[i].y +'/'+ pics[i].m + pics[i].d +'/'+ i;
                var link_img = base +'.'+ pics[i].ext;
                var load_img = base + '.s.jpg';
                var thumb = 'tool/system/img/anim/loading_35.gif';
                div.innerHTML = this.html(thumb, load_img, link_img, pics[i].file);
            }
            
        },
        
        //年表示
        year:function(elm,dir,date){
            
            for(var y in date){
                
                
                //first_m
                var m='';
                for(var j in date[y]){
                    m = j;
                    break;
                }
                //first_d
                var d='';
                for(var j in date[y][m]){
                    d = j;
                    break;
                }
                
                // Picture Frame Make
                var div = $d.createElement('div');
                div.className = 'pics';
                elm.appendChild(div);
                
                // Pfirst-icture and Name Insert
                var base = dir + y +'/'+ m + d +'/'+ date[y][m][d]['img_first'];
                //var link_img = base +'.'+ pics[i].ext;
                var link_img = "";
                var load_img = base + '.s.jpg';
                var thumb = 'tool/system/img/anim/loading_35.gif';
                div.innerHTML = this.html(thumb, load_img, link_img, y);
                
            }
            
        },
        //月表示
        month:function(elm,dir,date){
            
            for(var y in date){
                
                for(var m in date[y]){
                    
                    //first_d
                    var d='';
                    for(var j in date[y][m]){
                        d = j;
                        break;
                    }
                    
                    // Picture Frame Make
                    var div = $d.createElement('div');
                    div.className = 'pics';
                    elm.appendChild(div);
                    
                    // Pfirst-icture and Name Insert
                    var base = dir + y +'/'+ m + d +'/'+ date[y][m][d]['img_first'];
                    //var link_img = base +'.'+ pics[i].ext;
                    var link_img = "";
                    var load_img = base + '.s.jpg';
                    var thumb = 'tool/system/img/anim/loading_35.gif';
                    div.innerHTML = this.html(thumb, load_img, link_img, y.toString()+'年'+m.toString()+'月');
                }
            }
            
        },
        //日表示
        day:function(elm,dir,date){
            
            for(var y in date){
                
                for(var m in date[y]){
                    
                    for(var d in date[y][m]){
                        // Picture Frame Make
                        var div = $d.createElement('div');
                        div.className = 'pics';
                        elm.appendChild(div);
                        
                        // Pfirst-icture and Name Insert
                        var base = dir + y +'/'+ m + d +'/'+ date[y][m][d]['img_first'];
                        //var link_img = base +'.'+ pics[i].ext;
                        var link_img = "";
                        var load_img = base + '.s.jpg';
                        var thumb = 'tool/system/img/anim/loading_35.gif';
                        div.innerHTML = this.html(thumb, load_img, link_img, y.toString()+'年'+m.toString()+'月'+d.toString()+'日');
                    }
                }
            }
        },
        
        //サムネイルビューのHTMLソース
        html:function(thumb,load_img,link_img,file_name){
            
            var html = "";
            
            html+= '<table>';
            
            html+= '<tr>';
            html+= '<td class="picimg">';
            html+= '<img class="pics" src="'+thumb+'" data-image-load="'+load_img+'" data-image-link="'+link_img+'" draggable="false">';
            html+= '</td>';
            html+= '</tr>';
            
            html+= '<tr>';
            html+= '<td class="picname">'+file_name+'</td>';
            html+= '</tr>';
            
            html+= '</table>';
            
            return html;
        }
    };
    
    
    
    //Ajax Data Momories
    $_.memory = function(data){
        
        if(!data){return}
        
        $_.cfg.dir  = data.dir;
        $_.cfg.date = data.date;
        $_.cfg.file_count = data.file_count;
        
        //if(typeof($_.cfg.pics)=='undefined'){$_.cfg.pics={}}
        
        for(var i in data.pics){
            if(typeof($_.cfg.pics[i])!='undefined'){continue}
            
            $_.cfg.pics[i] = data.pics[i];
        }
        
        
    };
    
    $_.keep = function(data){
        
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
    $_.pics_add=function(){
        var more = $d.getElementById($_.cfg.id+'_more');
        if(more!=null){
            more.parentNode.removeChild(more);
        }
        
        //開始値を変更
        $_.cfg.read_from += $_.cfg.read_count;
        
        //ajax開始
        $IDEACOMPO.ajax.start({
            url : document.form_param.url.value,
            data: {
                tool : document.form_param.tool.value,
                mode : 'pics',
                user : document.form_param.uid.value,
                
                //読み込み数調整※下記ブランクの場合は上限無し
                //null=0（0スタート）
                read_from:$IDEACOMPO.picview.cfg.read_from,   //読み込み開始番号(1~**)
                read_count:$IDEACOMPO.picview.cfg.read_count,  //読み込み開始からのカウント数
                
            $:0},
            onSuccess    : function(response){
                console.log(response);
                
                var data = eval('('+response+')');
                
                //console.log(pics.data);
                
                //$IDEACOMPO.picview.view.set();
                //$IDEACOMPO.picview.thumb(pics.dir , pics.pics , pics.end);
                
                // Pics Data View
                $_.thumb.view(data);
                
                //Pics Data Memories
                $_.memory(data);
                
                
            },
            onError    	: function(status_code){ alert('Error! status:' +status_code); },
            onTimeout	: function(){ alert('タイムアウトしました'); }
        });
        
        
    };
    
    //起動時処理
    $IDEACOMPO.lib.event($w,'load',$_.pics_add);
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$_.cfg.id] = $_;
    return $_;
})(window,document,navigator,document.body);