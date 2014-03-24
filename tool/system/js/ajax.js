
/**
 * Ajaxライブラリ
 *
 * Author : 松木薗
 * Last Update : 2012/9/26
 *
 * 〜 使い方 〜
 * jQuryのajaxメソッドライクな使い方です。
 * オプションを指定したオブジェクトを渡せば動きます。
 *
 * 〜 基本的な使い方 〜
 * $IDEACOMPO.ajax.start({
 *    	url		: 'http://hogefuga.com/page',
 *		data	: {
 *			param1 : 'val1',
 *			param2 : 'val2',
 *			param3 : 'val3'
 *		},
 *		onSuccess	: function(response){ alert(response); },
 *		onError		: function(status_code){ alert('Error! status:' +status_code); },
 *		onTimeout	: function(){ alert('タイムアウトしました'); }
 * });
 *
 * 指定できるオプションとデフォルト値は下記の通り。
 * var option = {
 * 		url		: '',		通信先のURLパス。ここだけ必須。
 * 		debug	: false,	渡すパラメーターが間違ってる, などのメッセージを表示するか。trueで表示。表示にはconsole.log()を使用。
 * 		method	: 'get',	メソッドを指定。'GET' か 'POST'。
 * 		type	: 'text',	レスポンスをどの形式で onSuccess() に渡すか。'text', 'json', 'xml'が指定可能。
 * 		data	: [],		サーバーへ投げるパラメーターを二次元配列形式で格納する。各パラメーターは[パラメーター名, パラメーター値]の配列とすること。
 * 		async	: false,	非同期で通信するか。trueで非同期化。
 * 		header	: {},		ヘッダーに別途カスタムした値を仕込みたい場合に使用。
 * 		timeout	: 10,		タイムアウトの秒数。
 * 		onSuccess	: function(response){ },	通信に成功した場合に呼び出される。引数は type で指定した形式のオブジェクト。
 * 		onError		: function(status_code){ },	通信に失敗した場合に呼び出される。引数はサーバーステータスコード。※通信不可の場合は0が渡される
 * 		onTimeout	: function(){ }				タイムアウト時に呼び出される。
 * };
 */

(function($w,$d,$n,$b){
    
    var $_ = {cfg:{
        id:'ajax',
        
        connectionTimer : null,
        httpObj : null,
        config : {},
        defaultData : {
            debug	: false,
            method	: 'get',
            type	: 'text',
            url		: '',
            data	: {},
            //query   : {},
            async	: true,
            header	: {},
            timeout	: 6000,
            onSuccess : function(response){ $_.resultWithMessage(null, 'OK, Ajax successed!'); },
            onError   : function(status_code){ $_.resultWithMessage(null, 'Oh, Ajax Failed! status:' +status_code); },
            onTimeout : function(){ $_.resultWithMessage(null, 'Timeout!'); },
            onLoading : function(){ $_.resultWithMessage(null, 'Loading!'); }
        }
    }};
    
        
    
    $_.initialize = function(){
		$_.cfg.connectionTimer = null;
		$_.cfg.httpObj	= null;
		$_.cfg.config	= {};
		for(opt in $_.cfg.defaultData){
			$_.cfg.config[opt] = $_.cfg.defaultData[opt];
		}
	};
    
    /**
    * ブラウザを識別
    * return <String> value
    * ('67':IE6か7, '8':IE8以上, 'o':Opera, 'x':それ以外(Firefox, Chrome, Safari))
    */
	$_.browserType = function(){
		if($w.opera) return 'o';
		if($w.ActiveXObject){
			if($w.XDomainRequest) return '8';	// IE8以上
			return '67';
		}
		return 'x';
	};
    
    /**
     * デバッグモードがtrueの場合は、メッセージを表示して値を返す
	 * return <Object> result	第一引数をそのまま返す
	 */
	$_.resultWithMessage = function(result, message){
		if($_.cfg.config.debug){
			var browser = $_.browserType();
			if(browser != '67'){console.log(message)}
		}
		return result;
	};
    
    /**
     * ajaxに必要な情報(config)を精査してセットする。
	 * options.urlは必須。
	 * return <Bool>		config設定に成功(true)したか否(false)か。
	 */
	$_.setConfig = function(options){
		if (typeof options.debug	!== 'undefined') $_.cfg.config.debug		= options.debug;
		if (typeof options.headers	!== 'undefined') $_.cfg.config.header		= options.header;
		if (typeof options.data		!== 'undefined') $_.cfg.config.data			= options.data;
        //if (typeof options.query	!== 'undefined') $_.cfg.config.query		= options.query;
		if (typeof options.async	!== 'undefined') $_.cfg.config.async		= options.async;
		if (typeof options.onError	!== 'undefined') $_.cfg.config.onError		= options.onError;
		if (typeof options.onSuccess!== 'undefined') $_.cfg.config.onSuccess	= options.onSuccess;
		if (typeof options.onTimeout!== 'undefined') $_.cfg.config.onTimeout	= options.onTimeout;
        if (typeof options.onLoading!== 'undefined') $_.cfg.config.onLoading    = options.onLoading;
        
		if (typeof options.url === 'undefined') return $_.resultWithMessage(false, 'URL is not defined!');
		$_.cfg.config.url = options.url;
        
		if (typeof options.method !== 'undefined'){
			var method = options.method.toLowerCase();
			if (! method.match(/^(get|post)$/)) return $_.resultWithMessage(false, 'Ajax method must be "get" or "post"!');
			$_.cfg.config.method = method;
		}
        
		if (typeof options.type !== 'undefined'){
			var type = options.type.toLowerCase();
			if (! type.match(/^(text|xml|json)$/)) return $_.resultWithMessage(false, 'Ajax type must be "text" or "xml" or "json"!');
			$_.cfg.config.type = type;
		}
        
		var timeout	= parseInt($_.cfg.defaultData.timeout);
		if (typeof options.timeout	!== 'undefined'){
			if(! options.timeout.toString().match(/^[0-9]+$/)) return $_.resultWithMessage(false, 'Timeout value must be integer!');
            
			timeout = parseInt(options.timeout);
		}
        
		$_.cfg.config.timeout = timeout * 1000;
		return true;
	};
    
    /**
     * XMLHttpRequestオブジェクトの生成
	 * 何らかの原因で失敗した場合はnullを返す
	 * return <XMLHttpResponse>
	 */
	$_.createHttpRequest = function(){
		var xhr = null;
		var browser = $_.browserType();
        
		// IEシリーズ
		if(browser == '8' || browser == '67'){
			try {
				// MSXML2以降用
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					// 旧MSXML用
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e2) {
					xhr = null;
				}
			}
			return xhr;
		}
		// IE以外
		if($w.XMLHttpRequest){
			var xhr = new XMLHttpRequest();
			// キャッシュさせない
			//xhr.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
			return xhr;
		}
		// 基本、ここに到達することは無いはず…。
		return xhr;
	};
    
    /**
     * パラメーター配列を aa=11&bb=22&cc=... の形式に変換して返す。
	 * パラメーターが存在しない場合は空文字を返す。
	 * return <String> パラメーター連結文字列
	 */
	$_.makeParameter = function(){
        
        var arr = [];
        /*
		for(var i in $_.cfg.config.query){
            arr.push(i+'='+$_.cfg.config.query[i]);
		}
        */
        for(var i in $_.cfg.config.data){
			arr.push(i+"="+encodeURIComponent($_.cfg.config.data[i]));
		}
        
		return arr.join('&');
	};
    
    /**
     * データ送信先URLとパラメーターを作成する
	 * return <Object> urlObj	urlObj.url = URL文字列, urlObj.params = パラメーター文字列
	 * ※GETの時、urlObj.paramsはnullとする
	 */
	$_.makeUrlObj = function(){
		var urlObj = {};
		var params = $_.makeParameter();
		var config = $_.cfg.config;

		if(config.method == 'get'){
			var delimit = '';
			if(params && (config.url.indexOf('?') == -1)){
				delimit = '?';
			}
			else if(params && (config.url.indexOf('&') > -1)){
				delimit = '&';
			}
			
			urlObj.url = config.url +delimit +params;
			urlObj.params = null;
		}
		else{
			urlObj.url = config.url;
			urlObj.params = params;
		}

		return urlObj;
	};
    
    /**
     * 通信に成功した時のレスポンスを返す
	 * return <Object> 通信タイプに応じたレスポンスオブジェクト
	 *
	 * type=jsonの時はjsonオブジェクト、xmlの時はdocumentElementオブジェクト, textの時はresponsTextを返す。
	 * ※現在はresponseTextのみ返す
	 */
	$_.makeSuccessResponseObj = function(httpobj){
		var config = $_.cfg.config;
		if(config.type == 'xml')	return httpobj.responseXML.documentElement;

		var text = httpobj.responseText;
		if(config.type == 'text')	return text;

		var br = $_.browserType();
		if(br == '67' || br == '8'){
			return eval(text);
		}
		else{
			return JSON.parse(text);
		}
	};
    
	$_.setTimeoutFnc = function(httpObj){
        
        if(!$_.cfg.config.timeout){return}
        
		$_.connectionTimer = setTimeout(function(){
			httpObj.abort();
			$_.cfg.config.onTimeout();
		}, $_.cfg.config.timeout);
	};
    
    /**
     * Ajax通信結果に応じた処理を行う。
	 * 通信不可の時もonError(Status Code)を呼び出す。
	 */
	$_.setAjaxResult = function(httpObj){
		var config = $_.cfg.config;
		var serverStatus = parseInt(httpObj.status, 10);

		// タイムアウトタイマー解除
		clearTimeout($_.connectionTimer);

		// 通信不可
		if(serverStatus < 1){
			config.onError(serverStatus);
		}
		// 成功
		else if((serverStatus) < 400){
			config.onSuccess($_.makeSuccessResponseObj(httpObj));
		}
		// 40x, 50xなどのサーバーエラー
		else{
			config.onError(serverStatus);
		}
	};

	/**
	 * Ajax 本処理開始
	 * return <Bool>	通信成功の如何にかかわらず、処理を実行できたか(true)できなかったか(false)を返す
	 */
	$_.connectionStart = function(){
		var config	= $_.cfg.config;
		var urlObj	= $_.makeUrlObj();
        
		httpObj = $_.createHttpRequest();
        
		if(!httpObj){return false}
        
		httpObj.open(config.method, urlObj.url, config.async);
		httpObj.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		httpObj.onreadystatechange = function(){
            
            //console.log(this.readyState);
            
			if(this.readyState == 4){
				$_.setAjaxResult(this);
			}
		};
		$_.setTimeoutFnc(httpObj);

		// ネットワークエラーやDNSエラー(通信不可)の場合、エラーが上がってしまうのでtry-catchで包む
		try{
			httpObj.send(urlObj.params);
		}
		catch(e){
			$_.resultWithMessage(null, e);
		}
		return true;
	};


	/**
	 * 処理起点。外部からはここを呼ぶこと。
	 * params <Hash> options		Ajaxの設定(URL, 送信タイプなど)を格納したオブジェクト。defaultData 参照。
	 */
	$_.start = function(options){
		$_.initialize(options);
		if(typeof options === 'undefined') return;
		if(! $_.setConfig(options)) return;
		$_.connectionStart();
	};
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$_.cfg.id] = $_;
    return $_;
})(window,document,navigator,document.body);
