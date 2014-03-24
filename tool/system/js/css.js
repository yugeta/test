/**
 * css操作
 * 【パラメータ】
 *      param @ data     :style_sheet(sample vore.css.data)
 *      param @ id       :style-tag ID(重複の場合は上書き)任意項目※nullの場合は、指定なし
 *      param @ header   :ヘッダ位置（iframe内の場合は記述）任意項目※nullの場合は通常head位置
 * 【サンプル】
 * $IDEACOMPO.css.header_add({
 *  data:[
 *      {
 *          s:'input[type="file"]',
 *          d:[
 *              'width:100%',
 *              'height:100%',
 *              'border:4px dotted #F66'
 *          ]
 *      },
 *      {
 *          s:'html,body,form',
 *          d:[
 *              'margin:0',
 *              'padding:0',
 *              'border:0',
 *          '']
 *      }
 *  ],
 *  $d:iframe.contentWindow.document
 * });
 * 
**/

(function($w,$d,$n,$b){
    var $_={cfg:{
        id:'css',
        
    $:0}};
    
    
    //HEAD内に追記
    $_.header_add=function(cfg){
        
        //初期設定
        if(typeof(cfg.data)=='undefined' || !cfg.data || !cfg.data.length){return}
        if(!cfg.$d){cfg.$d = document}
        
        //-----
        //ブラウザ別処理
        //-----
        
        //IE
        if($n.userAgent.toLowerCase().indexOf('msie')!=-1){
            return;
        }
        //other-Browser
        else{
            //初期設定
            var css = cfg.$d.styleSheets;
            var sheet = cfg.$d.styleSheets[css.length - 1];
            
            //新規sheet作成※ID指定がある場合は、上書き処理対応
            if(cfg.id && $d.getElementById(cfg.id)!=null){
                style = $d.getElementById(cfg.id)
            }
            else{
                var style = cfg.$d.createElement('style');
                style.type='text/css';
                if(cfg.id){style.id = cfg.id}
            }
            
            //適用
            cfg.$d.getElementsByTagName('head')[0].appendChild(style);
            var sheet = style.sheet;
            
            //データセット
            for(var i=0;i<cfg.data.length;i++){
                if(!cfg.data[i].s || !cfg.data[i].d || !cfg.data[i].d.length){continue}
                sheet.insertRule(cfg.data[i].s +'{'+ cfg.data[i].d.join(';') +'}', (sheet.cssRules)?sheet.cssRules.length:0);
            }
        }
    };
    
    //クラス操作(半角スペース区切り)
    $_.name=function(type,name,value){
        var val2 = name.split(" ");
        
        if(type=='add'){
            var flg=0;
            for(var i=0;i<val2.length;i++){
                if(val2[i]==value){flg++;}
            }
            //同一name値が無い場合のみ追加
            if(!flg){val2[val2.length]=value}
            
            return val2.join(" ");
        }
        else if(type=='del'){
            var val3=[];
            for(var i=0;i<val2.length;i++){
                if(val2[i]!=value){
                val3[val3.length]=val2[i];
                }
            }
            
            return val3.join(" ");
        }
    };
    //class内にスペース区切りで存在するセレクタnameで特定の文字列があるかチェック
    $_.check_name=function(target_name,check_name){
        if(!target_name || !check_name){return}
        var arr = target_name.split(" ");
        for(var i=0;i<arr.length;i++){
            if(arr[i]==check_name){return true}
        }
    };
    
    //対象エレメントより上位にclass名を持つエレメントを検索
    $_.search=function(e,val){
        if(!e || !e.tagName || e.tagName=="BODY"){return}
        
        //マッチするエレメントがある場合
        if(core.check_name(e.className,val)){return e}
        
        //上階層チェック
        e = this.search(e.parentNode,val);
        return e;
    };
    
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$_.cfg.id] = $_;
    return $_;
    
})(window,document,navigator,document.body);
