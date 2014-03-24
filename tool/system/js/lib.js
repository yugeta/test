/**
 * $.pos(element , target)
 * $.size(element)
 * $.url(url)
 * $.domain(url)
 * $.dir(url)
 * $.document(element)
 * $.scroll(element)
 * $.browser()
 * $.event(target , mode , function)
 * $.get_style(element , style)
 * $.camelize(prop)
 * $.elm_id.encode(elm)
 * $.secure_value.xss()
 * $.alpha(element , num(%))
 * $.select_add()
 * $.table_add()
 * $.select_add()
 * 
 * 
**/

(function($w,$d,$n,$b){
    
    var $ = {cfg:{id:'lib'}};
    
    /***********
    概要：対象項目の座標を取得
	param:e  elesment
    param:t  target(特定項目内での座標取得も可※未記入OK) ]
    ***********/
    $.pos=function(e,t){
    	if(typeof(t)=='undefined' || t==null){
			t = $b;
		}
		//座標算出;
		var pos={x:0,y:0};
		
		if(typeof(e)=='undefined' || e==null){return pos;}
        
		//通常座標;
		var flg=0;
		do{
			if(e == t){break}
			pos.x += e.offsetLeft;
			pos.y += e.offsetTop;
			if(flg>10000){break}
			flg++;
		}
		while(e = e.offsetParent);
		
		return pos;
    };
    
    /***********
    概要：対象項目のサイズを取得(指定がない場合はwindow(body)サイズ)
	param:e  対象element
    ***********/
    $.size=function(e){
        if(!e){return{x:0,y:0}}
		//対象element
		if(typeof(e)=='undefined'){
			if ($n.userAgent.match("MSIE") && $d.compatMode!='BackCompat'){
				e = $d.documentElement;
			}
			else{
				e = $d.getElementsByTagName("body")[0];
			}
		}
		//サイズ取得;
		var size={
			x:e.offsetWidth,
			y:e.offsetHeight
		};
		
		//子階層依存※下に１つのみの子を持つ場合サイズチェックを行う;
		if(e.childNodes.length==1 && e.tagName=='A'){
			var chk ={
				x:e.childNodes[0].offsetWidth,
				y:e.childNodes[0].offsetHeight
			};
			if(chk.x > size.x){
				size.x = chk.x;
			}
			if(chk.y > size.y){
				size.y = chk.y;
			}
		}
		return size;
	};
    
    /***********
    //URLからクエリ値を連想配列で返す;
    概要：表示しているページのブラウザアドレスのURLクエリを連想配列で返します。
	param:url  未記入可
    ***********/
    $.url=function(uri){
		if(!uri){
			uri = location.href;
		}
		var data={};
        
		//URLとクエリ分離分解;
		var query=[];
		if(uri.indexOf("?")!=-1){
			query = uri.split("?");
		}
		else if(u.indexOf(";")!=-1){
			query = uri.split(";");
		}
		else{
			query[0] = uri;
			query[1] = '';
		}
        
		//基本情報取得;
		var sp = query[0].split("/");
		var data={
			dir:this.dir(uri),
            domain:sp[2],
            protocol:sp[0].replace(":",""),
            
			query:(query[1])?(function(q){
                var d={};
                var sp1 = q.split("&");
                for(var i=0;i<sp1.length;i++){
                    var kv = sp1[i].split("=");
                    if(!kv[0]){continue}
                    d[kv[0]]=kv[1];
                }
                return d;
			})(query[1]):{},
            
            url:query[0]
		};
        
		return data;
	};
    
    /***********
     * 概要：表示しているページのブラウザアドレスのドメイン（サブドメイン）を返します。
	 * param:url  URL指定も可※未記入可
    ***********/
    $.domain=function(u){
    	if(typeof(u)=='undefined' || !u){
			u = location.href;
		}
		//正常なURLかどうかチェック;
		if(!u.match(/:\/\//)){return}
		var a = u.split("/");
		return a[2];
	};
    
    /***********
     * 概要：表示しているページのブラウザアドレスのURLのアクセスファイルの値を返します。
	 * param:url  URL指定も可※未記入可
     * **********/
	$.dir=function(u){
		if(!u){
			u = location.href;
		}
		var u1 = u.split("?")[0].split("/");
		var url='';
		for(var i=0;i<u1.length-1;i++){
			url+=u1[i]+"/";
		}
		return url;
	};
    
    /***********
    概要：document.bodyサイズ（スクロール域も含めた）または、対象項目のサイズ
	[ element:対象項目※未記入可 ]
	**********/
    $.document=function(e){
		//対象element;
		if(typeof(e)=='undefined'){
			if ($n.userAgent.match("MSIE") && $d.compatMode!='BackCompat'){
				e = $d.documentElement;
			}
			else{
				e = $d.getElementsByTagName("body")[0];
			}
		}
		//サイズ取得;
		return {
			x : e.scrollWidth,
			y : e.scrollHeight
		};
	};
    
    /**********
    概要：スクロール値の取得
	[ element:対象項目※未記入可 ]
	**********/
	$.scroll=function(e){
		//初期設定;
		var scroll={x:0,y:0};
		//ブラウザ判定処理;
		if($n.userAgent.indexOf("iPhone")!=-1 || $n.userAgent.indexOf("iPad")!=-1){
			return {
                x:$w.scrollX,
                y:$w.scrollY
            };
		}
		else if(typeof(e)=='undefined' || e==null){
			if($d.compatMode=='BackCompat' || $n.userAgent.indexOf("Safari")!=-1){
				e = $d.getElementsByTagName("body")[0];
			}
			else{
				e = $d.documentElement;
			}
		}
		//スクロール値;
		return {
			x:e.scrollLeft,
			y:e.scrollTop
		};
	};
    
    /**********
	//ブラウザ画面サイズ;
    概要：ブラウザの表示画面サイズ
	**********/
	$.browser=function(){
		var d={x:0,y:0};
		var e;
		if($w.innerWidth){
			d.x = $w.innerWidth;
			d.y = $w.innerHeight;
		}
		else if($n.userAgent.indexOf("MSIE")!=-1 && $d.compatMode=='BackCompat'){
			d.x = $b.clientWidth;
			d.y = $b.clientHeight;
		}
		else{
			d.x = $d.documentElement.clientWidth;
			d.y = $d.documentElement.clientHeight;
		}
		return d;
	};
    
    /**********
    概要：イベント情報の追記登録
	[ target:window,document mode:load,mousedown※onを抜かす function:実行関数 ]
     * **********/
	$.event=function(t, m, f){
		//other IE;
		if (t.addEventListener){
			t.addEventListener(m, f, false);
		}
		//IE;
		else{
			if(m=='load'){
				var d = $b;
				if(typeof(d)!='undefined'){d = $w;}
				
				if((typeof(onload)!='undefined' && typeof(d.onload)!='undefined' && onload == d.onload) || typeof(eval(onload))=='object'){
					t.attachEvent('on' + m, function() { f.call(t , $w.event); });
				}
				else{
					f.call(t, $w.event);
				}
			}
			else{
				t.attachEvent('on' + m, function() { f.call(t , $w.event); });
			}
		}
	};
    
    $.evt={
        keydown:function(evt){
            //キー番号を表示
            console.log(evt.keyCode);
            
            //shift
            console.log(evt.shiftKey);
            
            //control
            console.log(evt.ctrlKey);
            
            //alt
            console.log(evt.altKey);
            
        },
        
        
    $:0};
    
    /**********
    //style値を取得
    概要：対象項目のCSS値を取得
	param:element  対象項目
    **********/
    $.get_style=function(e,s){
		if(!s){return}
		//対象項目チェック;
		if(typeof(e)=='undefined' || e==null || !e){
			e = $b;
		}
		//属性チェック;
		var d='';
		if(typeof(e.currentStyle)!='undefined'){
			d = e.currentStyle[$.string.camelize(s)];
			if(d=='medium'){
				d = "0";
			}
		}
		else if(typeof($d.defaultView)!='undefined'){
			d = $d.defaultView.getComputedStyle(e,'').getPropertyValue(s);
		}
		return d;
	};
    
    /**********
     * 文字列操作
    //camelize,capitalize;
    概要：style属性などの文字列整形を行う※例)「font-type」→「fontType」
	[ prop:文字列 ]
    **********/
    $.string={
        //
        url_encode:function(str,list){
            if(str=="" || typeof(str)=="undefined"){return ""}
            //var arr = ['&','"',"'",'=',' '];
            for(var i=0;i<list.length;i++){
                //str=str.split(arr[i]).join(encodeURIComponent(arr[i]));
                str=str.split(list[i]).join(escape(list[i]));
            }
            return str;
        },
        //
        url_decode:function(str,list){
            //var arr = ['&','"',"'",'=',' '];
            for(var i=0;i<list.length;i++){
                //str=str.split(arr[i]).join(encodeURIComponent(arr[i]));
                str=str.split(escape(list[i])).join(list[i]);
            }
            return str;
        },
        //ハイフン区切りを大文字に変換する。
        camelize:function(v){
            if(typeof(v)!='string'){return}
            return v.replace(/-([a-z])/g , function(m){return m.charAt(1).toUpperCase();});
        },
        //数値を３桁ずつ「,（カンマ）」で区切る
        number_format:function(sourceStr){
            var destStr = sourceStr.toString();
            var tmpStr = "";
            while (destStr != (tmpStr = destStr.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2"))) {
                destStr = tmpStr;
            }
            return destStr;
        },
        //string内の数値以外を排除し、typeを数値にする。※小数点対応
        //大文字非対応
        string2number:function(str){
            return Number(str.innerText.replace(/[^0-9]/g,""));
        },
        /*
        //文字列
        sprintf:function(format,str){
            
        },
        */
        
    $:0};
    /*
    $.camelize=function(v){
		if(typeof(v)!='string'){return}
		return v.replace(/-([a-z])/g , function(m){return m.charAt(1).toUpperCase();});
	};
    */
    /***********
    //脆弱性文字列変換処理;
    
    ***********/
    $.secure_value={
        xss:function(v){
            if(!v){return v;}
            var d="-";
            v+="";
            v = v.split("\r").join("").split("\n").join("");
            v = v.split("<").join(d).split("%3c").join(d).split("%3C").join(d);
            v = v.split(">").join(d).split("%3e").join(d).split("%3E").join(d);
            return v;
        },
		encode:function(v){
			v = v.split("\r").join("%r%");
			v = v.split("\n").join("%n%");
			v = v.split(" ").join("%sp%");
			v = v.split("'").join("%qt%");
			v = v.split('"').join("%dqt%");
			v = v.split("<br>").join("%br%");
			return v;
		},
		decode:function(v){
			v = v.split("%r%").join("\r");
			v = v.split("%n%").join("\n");
			v = v.split("%sp%").join(" ");
			v = v.split("%qt%").join("'");
			v = v.split("%dqt%").join('"');
			v = v.split("%br%").join("<br>");
			return v;
		}
	};
    
    /**********
    //elementのDOM階層（対象elementの階層dom構造をユニーク値で返す）;
    //element → id(途中でIDがあれば、そこで止まる);
    
    概要：対象項目の「ページ内DOM構造ユニークID」を出力する（エンコード）
	[ element:対象項目 ]
    **********/
	$.elm_id={
        encode:function(e){
            if(typeof(e)=='undefined' || e==null || !e){return}
            var dom = [];
            var f=0;
            do{
                if(e.id && e == $d.getElementById(e.id)){
                    dom[dom.length] = e.id;
                    break;
                }
                else if(!e.parentNode){break}
                
                var num = 0;
                var cnt = 0;
                if(e.parentNode.childNodes.length){
                    for(var i=0;i<e.parentNode.childNodes.length;i++){
                        if(typeof(e.parentNode.childNodes[i].tagName)=='undefined'){continue}
                        if(e.parentNode.childNodes[i].tagName != e.tagName){continue}
                        if(e.parentNode.childNodes[i] == e){
                            num=cnt;
                            break;
                        }
                        cnt++;
                    }
                }
                //小文字英数字で形成する。;
                dom[dom.length] = e.tagName.toLowerCase() + "["+num+"]";
                if(e == $b){break}
                f++;
                if(f>10000){break}
            }
            while (e = e.parentNode);
            //rsort;
            var dom2 = [];
            for(var i=dom.length-1;i>=0;i--){
                dom2[dom2.length] = dom[i];
            }
            return dom2.join(".");
        },
        //ID化した文字列をエレメントに戻す（変換）
        decode:function(id){
            if(!id || typeof(id)!='string'){return}
            //単一IDの場合;
            if($d.getElementById(id)!=null){return $d.getElementById(id)}
            //element抽出処理
            var elm= $d.getElementsByTagName("html")[0];
            var d1 = id.split(".");
            var flg=0;
            for(var i=0;i<d1.length;i++){
                if(d1[i].match(/^(.*?)\[(.*?)\]$/)){
                    var tag = RegExp.$1;
                    var num = RegExp.$2;
                    var cnt = 0;
                    var flg2= 0;
                    if(tag=='' || num==''){
                        alert("tag名が不整合です。 : "+d1[i]);
                        return;
                    }
                    var e2 = elm.childNodes;
                    
                    for(var j=0;j<e2.length;j++){
                        if(!e2[j].tagName || typeof(e2[j])=='undefined'){continue}
                        if(e2[j].tagName != tag.toUpperCase()){continue}
                        if(cnt == num){
                            elm = e2[j];
                            flg2++;
                            break;
                        }
                        cnt++;
                    }
                    //存在しないelement処理
                    if(flg2==0){return}
                    flg++;
                }
                else if($d.getElementById(d1[i])!=null){
                    elm = $d.getElementById(d1[i]);
                    flg++;
                }
                else if($d.getElementById(d1[i])==null){return}
            }
            if(!flg){return}
            return elm;
        }
	};
    
    /**********
    //elementの透明度設定;
    概要：対象項目の透明度を設定
	[ element:対象項目 num:%]
    **********/
    $.alpha=function(e , n){
		//IE
		if ($n.userAgent.indexOf("MSIE")!=-1){
			if (n < 0){
				n = parseInt(parseFloat(RegExp.$1) + (n));
				if (n <= 0) {n = 0;} else if (n >= 100) {n = 100;}
			}
			e.style.filter = 'alpha(opacity='+n+')';
		}
		//FireFox;
		else if ($n.userAgent.indexOf("Firefox")!=-1){
			if (n < 0){
				if (n <= 0) {n = 0;} else if (n >= 1) {n = 1;}
			}else{n = n/100;}
			e.style.opacity = n;
			
		}
		//Opera & Safari;
		else if (($n.userAgent.indexOf("Opera")!=-1)||($n.userAgent.indexOf("Safari")!=-1)){
			if (n < 0){
				if (n <= 0) {n = 0;} else if (n >= 1) {n = 1;}
			}else{n = n/100;}
			e.style.opacity = n;
		}
		//Netscape;
		else if ($n.userAgent.indexOf("Netscape")!=-1){
			if (n < 0){
				if (n <= 0) {n = 0;} else if (n >= 1) {n = 1;}
			}else{n = n/100;}
			e.style.MozOpacity = n;
		}
		return e;
	};
    
    /**********
    //Table要素に行要素を追加する(全ブラウザ対応版)
    
    概要：Table要素に行要素を追加する
	使用方法：[ table:table要素 html:HTML記述※tr含む]
    **********/
    $.table_add=function(t,h){
		if(typeof(t)=='undefined' || t==null || !t){return;}
		if(!h){return}
		var d = $d.createElement("div");
		d.innerHTML = "<table>"+h+"</table>";
		var tr = d.getElementsByTagName("tbody");
		for(var i=0;i<tr.length;i++){
			t.appendChild(tr[i]);
		}
	};
    
    /**********
    //select項目操作;
    概要：select項目に値を追加する。
	使用方法：[ e , key , value ,title ]
    **********/
	$.select_add=function(e, key , value , title){
		if(typeof(e)=='undefined' || e==null || !e){return}
		
		var num = e.length;
		
		//key,value 設定;
		e.options[num] = new Option(value , key);
		
		//title値;
		if(title){
			e.options[num].title = title;
		}
	};
    
    $.drag=function(e){
        //alert(e.value);
        //alert(e.tagName);
    };
    
    /**
     * 
    **/
    $.element={
        //class名を追記する。※登録済みの場合は、追加無し
        // param  : [ target-element , add-class-name ]
        // return :変更後のclass名
        class_add:function(elm,str){
            if(!elm){return}
            
            if(!elm.className){
                elm.className = str;
            }
            else{
                var classNames = elm.className.split(' ');
                var flg=0;
                
                //check regist
                for(var i=0;i<classNames.length;i++){
                    if(classNames[i] == str){
                        flg++;
                        break;
                    }
                }
                
                if(!flg){
                    classNames.push(str);
                }
                elm.className = classNames.join(' ');
            }
            
            return elm.className;
        },
        //class名を削除する。※無い場合は、変更無し
        // param  : [ target-element , del-class-name ]
        // return : 変更後のclass名
        class_del:function(elm,str){
            if(!elm){return}
            
            if(!elm.className){
                return '';
            }
            else{
                var classNames = elm.className.split(' ');
                var new_class_name=[];
                //check regist
                for(var i=0;i<classNames.length;i++){
                    if(classNames[i] != str){
                        new_class_name.push(classNames[i]);
                    }
                }
                
                elm.className = new_class_name.join(' ');
            }
            
            return elm.className;
        },
        //class名に対象の値が存在するか確認
        // param  : [ target-elm , string ]
        // return : [ true:存在する false:存在しない ]
        class_check:function(elm,str){//console.log(elm.tagName+"/"+str);
            if(elm && elm.className){
                
                //if(elm.className==str){return true}
                
                var classNames = elm.className.split(' ');
                
                //console.log(classNames.length);
                
                //check regist
                for(var i=0;i<classNames.length;i++){
                    //console.log(classNames[i] +"=="+ str);
                    if(classNames[i] == str){return true}
                }
            }
            return false;
        },
        
        
    $:0};
    
    /*
    
    */
    $.search={
        
        //対象エレメントより上位にclass名を持つエレメントを検索
        css:function(e,val){
            if(!e || !e.tagName || e.tagName=="BODY"){return}
            
            //マッチするエレメントがある場合
            if($.element.class_check(e,val)){return e}
            
            //console.log(e.tagName+"/"+e.className+"/"+val);
            
            //上階層チェック
            e = this.css(e.parentNode,val);
            return e;
        }
    };
    
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$.cfg.id] = $;
    return $;
})(window,document,navigator,document.body);


