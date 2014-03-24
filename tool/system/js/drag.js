//----------
//☆特殊処理
//
//・対象エリア指定
//    	ドラッグ項目のclassに"$NC.drag.area@***"として、***はelement指定記述($NC.$.id(%id%))
// 
// ver 1.001.000
// ・target機能追加
// 
// 
//----------

//------------------------------
//Drop & Drag (drag.click)
//------------------------------
(function($w,$d,$n,$b){
	//各種設定
    var $_ = {cfg:{
        id:'drag',
	    pos:{x:0,y:0},
	    cnt:{},
    $:0}};
	
	//横のみ移動
	$_.click_x = function(evt){
		//初期設定
		var e = $_.check.idFlg(this);
		if(!e){return}
		
		e.move_flg = "x";
		
		$_.check.proc(e);
		
		//基本座標を取得
		var pos = $_.check.pos(e);
		
		//IE
		if (navigator.userAgent.indexOf("MSIE")!=-1){
			e.pos.x = event.x - pos.x;
			e.pos.y = event.y - pos.y;
		}
		//IE以外のブラウザ
		else{
			e.pos.x = evt.pageX - pos.x;
			e.pos.y = evt.pageY - pos.y;
		}
		
		//エリア対象ターゲット処理
		$_.check.clssNameFlg(e);
		
		return false;
	};
    
	//縦のみ移動
	$_.click_y = function(evt){
		//初期設定
		var e = $_.check.idFlg(this);
		if(!e){return}
		
		e.move_flg = "y";
		
		$_.check.proc(e);
		
		//基本座標を取得
		var pos = $_.check.pos(e);
		
		//IE
		if (navigator.userAgent.indexOf("MSIE")!=-1){
			e.pos.x = pos.x;
			e.pos.y = event.y - pos.y;
		}
		//IE以外のブラウザ
		else{
			e.pos.x = pos.x;
			e.pos.y = evt.pageY - pos.y;
		}
		
		//エリア対象ターゲット処理
		$_.check.clssNameFlg(e);
		
		return false;
	};
	
	//クリック"*@drag"のID値がない場合は、対象elementがドラッグ対象になる。
	$_.click = function(evt){
		//初期設定
		var e = $_.check.idFlg(this);
		if(!e){return}
		
		$_.check.proc(e);
		
		//基本座標を取得
		var pos = $_.check.pos(e);
		
		//IE
		if (navigator.userAgent.indexOf("MSIE")!=-1){
			e.pos.x = event.x - pos.x;
			e.pos.y = event.y - pos.y;
		}
		//IE以外のブラウザ
		else{
			e.pos.x = evt.pageX - pos.x;
			e.pos.y = evt.pageY - pos.y;
		}
		
		//エリア対象ターゲット処理
		$_.check.clssNameFlg(e);
		
		return false;
	};
	
	
	$_.check = {
		proc:function(){
			window.document.onmouseup   = $_.release;
			window.document.onmousemove = $_.move;
		},
		//class名にエリアフラグ、ターゲットフラグの確認
		clssNameFlg:function(e){
			if(!e.className){return}
			
			var c = e.className.split(" ");
			
			for(var i=0;i<c.length;i++){
				if(c[i].match(/\$NC\.drag\.area@(.*)$/) && typeof($_.area)=='undefined'){
					var e2 = eval($NC.$.xss(RegExp.$1));
					if(typeof(e2)!='undefined'){
						$_.area = e2;
					}
				}
				else if(c[i].match(/\$NC\.drag\.target@(.*)$/) && typeof($_.target)=='undefined'){
					var e2 = eval($NC.$.xss(RegExp.$1));
					if(typeof(e2)!='undefined'){
						$_.target = e2;
					}
				}
			}
		},
		//クリックしたオブジェクトのelement判定
		idFlg:function(e){
			if(typeof(e)=='undefined' || e==null || !e){return}
			
			var elm='';
			
			if(e.id){
				elm = document.getElementById(e.id.replace("@drag",""));
			}
			else{
				elm = e;
			}
			
			elm.pos={};
			
			$_.flg = elm;
			elm.onselectstart = function(){return false};
			elm.ondragstart   = function(){return false};
			
			return elm;
		},
		pos:function(e){
			if(e.style.left && e.style.top){
				return {
					x:parseInt(e.style.left),
					y:parseInt(e.style.top)
				};
			}
			else{
				return $IDEACOMPO.lib.pos(e);
			}
		},
		
	$:0};
	
	//移動終了
	$_.release = function(){
		var e = $_.flg;
		if(typeof(e)=='undefined'){return}
		//各種フラグ削除
		if(typeof($_.flg)!='undefined'){
			delete $_.flg;
		}
		if(typeof($_.area)!='undefined'){
			delete $_.area;
		}
		if(typeof($_.target)!='undefined'){
			delete $_.target;
		}
		return false;
	};
    
	//移動処理
	$_.move = function(evt){
		if(typeof($_.flg)=='undefined'){return;}
		var e = $_.flg;
		if(typeof(e.pos)=='undefined'){return;}
		if(typeof(e.pos.x)=='undefined' || typeof(e.pos.y)=='undefined'){return;}
		
		var pos={x:0,y:0};
		var size = $IDEACOMPO.lib.size(e);
		
		//IE
		if (navigator.userAgent.indexOf("MSIE")!=-1){
			if(e.move_flg!="y"){
				pos.x = event.x - e.pos.x;
			}
			if(e.move_flg!="x"){
				pos.y = event.y - e.pos.y;
			}
		}
		//IE以外のブラウザ
		else{
			if(e.move_flg!="y"){
				pos.x = evt.pageX - e.pos.x;
			}
			if(e.move_flg!="x"){
				pos.y = evt.pageY - e.pos.y;
			}
		}
		
		//エリア判定
		if(typeof($_.area)!='undefined'){
			var area_pos = $IDEACOMPO.lib.pos($_.area , $_.target);
			var area_size= $IDEACOMPO.lib.size($_.area);
			//x
			if(pos.x < area_pos.x){
				pos.x = area_pos.x;
			}
			else if(pos.x + size.x > area_pos.x + area_size.x){
				pos.x = area_pos.x + area_size.x - size.x;
			}
			
			//y
			if(pos.y < area_pos.y){
				pos.y = area_pos.y;
			}
			else if(pos.y + size.y > area_pos.y + area_size.y){
				pos.y = area_pos.y + area_size.y - size.y;
			}
			
		}
		
		//座標処理
		e.style.left = pos.x+"px";
		e.style.top  = pos.y+"px";
		return false;
	};
    
    //グローバル関数へ保存
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$_.cfg.id] = $_;
    return $_;
    
})(window,document,navigator,document.body);

