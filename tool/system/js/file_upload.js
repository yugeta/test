/**
 * File-Upload
 * 【概要】
 *      フレームワーク内でのファイルアップロード機能を付与する。
 *      
 * 【使用方法】
 *      １、ページ内（最下部）にset関数を記述する。※サンプル参照
 *      ２、対象項目にアップロードエリアが出現すればセット完了
 * 
 * 【サンプル】--

(function(){
    //alert(typeof($IDEACOMPO.file_upload));
    $IDEACOMPO.file_upload.set({
        target:document.getElementsByClassName('file_upload'),
        //送信先URL
        send_path:'<!--%class:URL:url%-->',
        //送信用クエリ
        send_query:{
            tool:'<!--%request:tool%-->',
            menu:'<!--%request:menu%-->',
            action:'upload'
        },
    $:0});
})();

 *  ----------
 *      
 *      
 *      
**/


(function($w,$d,$n,$b){
    var $_={cfg:{
        id:'file_upload',
        
        
    $:0}};
    
    //起動処理
    /**
     * cfg:object(hash)
     * param target : elements(array or syngle-element)
     * 
     * 
    **/
    $_.set=function(cfg){
        if(typeof(cfg.target)=='undefined'){return}
        
        //singleの場合は、配列に帰る
        if(!cfg.target.length){
            cfg.target = [cfg.target];
        }
        
        //エレメント別セット
        for(var i=0;i<cfg.target.length;i++){
            //console.log(i);
            $_.proc.iframe(cfg.target[i],cfg.send_path,cfg.send_query);
        }
        
    };
    
    //iframe送信後処理（再表示）
    $_.send=function(){
        //console.log(this.tagName);
        if(typeof(this.upload_flg)=='undefined'){
            this.upload_flg=0;
        }
        //登録後登録画面に戻さない場合は、以下のreturnを有効にする。
        //else{return}
        
        //console.log(this.upload_flg);
        this.upload_flg++;
        
        //iframe内DOM
        //this.contentWindow.document.body.innerHTML = $_.proc.iframe_inner(this);
        $_.proc.iframe_inner(this);
        
        //CSS設定
        $_.proc.iframe_css(this);
    };
    
    //各種関数
    $_.proc={
        //アップロード用iframeをセット
        iframe:function(target,send_path,send_query){
            if(!target){return}
            
            var iframe = $d.createElement('iframe');
            iframe.style.setProperty('width', '100%','');
            iframe.style.setProperty('height','100%','');
            iframe.style.setProperty('margin','0','');
            iframe.style.setProperty('padding','0','');
            iframe.style.setProperty('border','0','');
            iframe.params={
                send_path:send_path,
                send_query:send_query
            };
            $IDEACOMPO.lib.event(iframe,'load',$_.send);
            //$IDEACOMPO.lib.event(iframe,'load',setTimeout(function(){$_.send()},3000));
            target.appendChild(iframe);
            /*
            //iframe内DOM
            iframe.contentWindow.document.body.innerHTML = $_.proc.iframe_inner(iframe);
            
            //CSS設定
            $_.proc.iframe_css(iframe);
            */
            
        },
        //css設定
        iframe_css:function(iframe){
            $IDEACOMPO.css.header_add({
                data:[
                    {
                        s:'input[type="file"]',
                        d:[
                            'width:100%',
                            'height:100%',
                            'border:4px dotted #F66',
                            'text-indent:-100px',
                            'color:transparent',
                        '']
                    },
                    {
                        s:'html,body,form',
                        d:[
                            'margin:0',
                            'padding:0',
                            'border:0',
                            
                        '']
                    },
                    {
                        s:'input[type="text"]',
                        d:[
                            'display:none',
                        '']
                    },
                    {
                        s:'img.upload_img',
                        d:[
                            'margin:4px',
                            'max-width:256px',
                            'min-width:64px',
                        '']
                    },
                {}],
                $d:iframe.contentWindow.document
            });
        },
        //iframeソース
        iframe_inner:function(iframe){
            var html='';
            
            html+='<form name="form_file_upload" enctype="multipart/form-data" method="post" action="'+iframe.params.send_path+'">';
            
            if(iframe.params.send_query){
                for(var i in iframe.params.send_query){
                    html+='<input type="hidden" name="'+i+'" value="'+iframe.params.send_query[i]+'" />';
                }
            }
            
            //html+='<input type="file" name="file_data[]" multiple="multiple" onchange="submit()" />';
            html+='<input type="file" name="file_data[]" multiple="multiple" />';
            html+='</form>';
            
            iframe.contentWindow.document.body.innerHTML = html;
            
            var form = iframe.contentWindow.document.form_file_upload;
            var input = form.getElementsByTagName('input');
            for(var i=0;i<input.length;i++){
                if(input[i].type!='file'){continue}
                input[i].onchange = function(event){
                    //file-APIを使う※使えるブラウザ限定
                    if(window.File){
                        
                        //form非表示
                        this.style.setProperty('display','none','');
                        
                        console.log('Upload file total:'+this.files.length);
                        //console.log('value:'+this.value);
                        
                        //ファイルプロパティを取得
                        for(var j=0;j<this.files.length;j++){
                            if(this.files[j].lastModifiedDate){
                                //情報を送信データに埋め込む
                                
                                //ファイル名
                                var inp = $d.createElement('input');
                                inp.type = 'text';
                                inp.name = 'file_property['+j+'][name]';
                                inp.value = this.files[j].name;
                                this.form.appendChild(inp);
                                
                                //タイプ
                                var inp = $d.createElement('input');
                                inp.type = 'text';
                                inp.name = 'file_property['+j+'][type]';
                                inp.value = this.files[j].type;
                                this.form.appendChild(inp);
                                
                                //サイズ
                                var inp = $d.createElement('input');
                                inp.type = 'text';
                                inp.name = 'file_property['+j+'][size]';
                                inp.value = this.files[j].size;
                                this.form.appendChild(inp);
                                
                                //URN
                                var inp = $d.createElement('input');
                                inp.type = 'text';
                                inp.name = 'file_property['+j+'][urn]';
                                inp.value = (this.files[j].urn)?this.files[j].urn:'';
                                this.form.appendChild(inp);
                                
                                //ファイル更新日
                                var inp = $d.createElement('input');
                                inp.type = 'text';
                                inp.name = 'file_property['+j+'][modify]';
                                //日付フォーマットをyyyymmddに
                                inp.value = $w.$IDEACOMPO.date.date2ymdhis(this.files[j].lastModifiedDate);
                                this.form.appendChild(inp);
                                
                                console.log(j+':'+this.files[j].name);
                                //console.log('  '+this.files[j].value);
                                // _f.mozFullPath (only firefox/確認Ver3.6)
                                // _f.webkitRelativePath (chrome)
                                //console.log('  '+this.files.item(j).webkitRelativePath);
                                //console.log('  '+this.files[j].webkitRelativePath);
                                
                                var img = document.createElement('img');
                                img.className = 'upload_img';
                                if(this.files[j].type.match(/^image/)){
                                    //img.src = 'data:image/jpeg;'+this.files[j].name;
                                    img.src = 'tool/system/img/thumb/player.png';
                                }
                                else{
                                    img.src = 'tool/system/img/thumb/player.png';
                                }
                                img.style.setProperty('width',(100/(this.files.length/8))+'px','');
                                //img.style.setProperty('max-width','100px','');
                                //img.style.setProperty('min-width','16px','');
                                //img.style.setProperty('margin','4px','');
                                
                                this.parentNode.appendChild(img);
                                
                            }
                        }
                    }
                    this.form.submit()
                };
            }
            
            //return html;
        },
        
        
    $:0};
    
    
    //グローバル関数へ保存
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$_.cfg.id] = $_;
    return $_;
    
})(window,document,navigator,document.body);