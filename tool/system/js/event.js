(function(){
	
	var $={};
	
	$.add=function(t, m, f){
		//other IE;
		if (t.addEventListener){
			t.addEventListener(m, f, false);
		}
		//IE[6-10];
		else{
			if(m=='load'){
				var d = document.body;
				if(typeof(d)!='undefined'){d = window;}
				
				if((typeof(onload)!='undefined' && typeof(d.onload)!='undefined' && onload == d.onload) || typeof(eval(onload))=='object'){
					t.attachEvent('on' + m, function() { f.call(t , window.event); });
				}
				else{
					f.call(t, window.event);
				}
			}
			else{
				t.attachEvent('on' + m, function() { f.call(t , window.event); });
			}
		}
	};
	
	if(typeof($IDEACOMPO)=='undefined'){$IDEACOMPO={}}
	//if(typeof($IDEACOMPO.$event)=='undefined'){$IDEACOMPO.$event={}}
	$IDEACOMPO.$event = $;
	
	return $;
})();