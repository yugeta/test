//----------
//cookie処理
//----------
(function($w,$d,$n,$b){
    //各種初期設定
	var $_ = {
    cfg:{
        id:'cookie',
    $:0},
    data:{
        name:'cookie',
		day:0,
		hour:6,
		min:0,
		sec:0,
        
	$:0}};
	
	//初期設定処理(ログ取得)
	$_.set = function(m,a,u,p,d){
		
		//グローバルデータチェック
		if(typeof($NC.$set)=='undefined' || typeof($NC.$set.src)=='undefined'){
			$NC.$set = $NC.api.script_target($NC.api.data.program_api);
			if(!$NC.$set.src){
				return;
			}
		}
		
		//サーバアドレスチェック
		if(!$NC.$set.src.$.dir){return}
		
        //プログラムファイル
		var file = $NC.api.data.program_api+".php";
		
        //クッキーチェック
		var ck={};
		
		//初期
		if(typeof($NC.$set.cookie)=='undefined'){
			ck = {
				pv:'',
				uu:$NC.$cookie.read(this.data.name),
				su:$NC.$cookie.read(this.data.name+".su")
			};
		}
		//2回目以降
		else{
			ck = {
				pv:$NC.$set.cookie.pv,
				uu:$NC.$set.cookie.uu,
				su:$NC.$set.cookie.su
			};
		}
		
		//プレビューの場合は、ログ取得無('$NC.mode='がURLに含まれる場合)
		if(location.href.indexOf('$NC.mode=')!=-1){return}
		
		//3rdPartyCookie（日付取得）
		var d2 = [
			"mode=log",
			"cookie[name] ="+this.data.name,
			"cookie[pv]="+ck.pv,
			"cookie[uu]="+ck.uu,
			"cookie[su]="+ck.su,
			"data[m]="+m,
			"data[a]="+a,
			"data[u]="+u,
			"data[p]="+p,
			"data[data]="+d,
            
            "sys[url]="+location.href
		];
		//データ送信
		$NC.api.documentWrite(file+"?"+d2.join("&"));
		
	};
	//phpからのcookie設定
	$_.php_set = function(ck0,ck1,ck2){
		if(typeof($NC.$set)=='undefined'){
			$NC.$set = $NC.api.script_target($NC.api.data.program_api);
		}
		$NC.$set.cookie = {
			pv:ck0,
			uu:ck1,
			su:ck2
		};
	};
	
	//日付算出（有効期限用）
	$_.date = function(d,h,m,s){
		var exp=new Date();
		exp.setTime(exp.getTime()+(d*1000*60*60*24)+(h*1000*60*60)+(m*1000*60)+(s*1000));
		return exp.toGMTString();
	};
	
	//ssl判定
	$_.secure = function(){
		if (location.href.match(/^https/)){
			return true;
		}
		else{
			return;
		}
	};
	
	//cookie書き込み
	$_.write = function(nm , val ,d,h,m,s){
		//脆弱性処理
		val = $NC.$.xss(val);
		
        
		if(this.secure()){
			document.cookie = nm+"\="+val+";expires\="+this.date(d,h,m,s)+";path=/;secure";
		}
		else{
			document.cookie = nm+"\="+val+";expires\="+this.date(d,h,m,s)+";path=/;";
		}
	};
    
	//cookie読み込み
	$_.read = function(nm){
		var ck0=document.cookie.split(" ").join("");
		var ck1=ck0.split(";");
		for(var i=0;i<ck1.length;i++){
			var ck2=ck1[i].split("=");
			if(ck2[0]==nm){
				//脆弱性処理
				//ck2[1] = $NC.$.xss(ck2[1]);
				return ck2[1];
			}
		}
		return '';
	};
    
	/*
	//サブドメインを排除したドメインを取得(cookie用)
	domain:function(){
		
		var url = location.hostname.split(".");
		var num = 2;
		if(location.hostname.match(/[.co.jp|.ed.jp|.ac.jp|.go.jp|.or.jp|.co.uk|.me.uk|.org.uk]$/)){
			num = 3;
			return "."+url.splice((url.length - num) , num).join(".");
		}
		else if(location.hostname.match(/[.com|.net|.jp|.org|.biz|.info|.mobi|.us|.bz|.tv|.cc|.me|.in|.asia|.tel|.cx|.cz|.am|.fm|.ac|.sc|.vc|.vg|.cn|.tw|.mu|.ms|.mn|.hn|.la|.gs|.ws|.be]$/)){
			num = 2;
			return "."+url.splice((url.length - num) , num).join(".");
		}
		else{
			return location.hostname;
		}
	},
	*/
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$_.cfg.id] = $_;
	return $_;
})(window,document,navigator,document.body);