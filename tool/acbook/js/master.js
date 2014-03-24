
(function(){
    var $={};
    
    $.set=function(){
        var groups = document.getElementsByClassName('group');
        
        for(var i=0;i<groups.length;i++){
            groups[i].onclick=function(){
                var num = this.getAttribute('data-value');
                document.form1['data[group]'].value = num;
                $.himoku_list.view_switchs('close');
                //preview
                var inner = (num)?this.innerHTML:"";
                document.getElementById('himoku_preview').innerHTML = inner;
            };
        }
        
        var himoku_button = document.getElementsByClassName('himoku_button');
        for(var i=0;i<himoku_button.length;i++){
            himoku_button[i].onclick = function(){$.himoku_list.view_switchs()};
        }
        var himoku_list = document.getElementsByClassName('himoku_list');
        for(var i=0;i<himoku_list.length;i++){
            var close = himoku_list[i].getElementsByClassName('close');
            for(var j=0;j<close.length;j++){
                close[j].onclick = function(){$.himoku_list.view_switchs('close')};
            }
        }
        
        //data_send
        var data_send = document.getElementsByClassName('data_send');
        for(var i=0;i<data_send.length;i++){
            data_send[i].onclick=function(){
                $.deta_send();
            };
        }
        
    };
    
    //himoku_list_view
    $.himoku_list={
        // flg[ open / close / blank ]
        view_switchs:function(flg){
            var himoku_list = document.getElementsByClassName('himoku_list');
            for(var i=0;i<himoku_list.length;i++){
                
                if(!flg){
                    if(himoku_list[i].getAttribute('data-himoku_list_view')=='open'){
                        flg = 'close';
                    }
                    else{
                        flg = 'open';
                    }
                }
                
                himoku_list[i].setAttribute('data-himoku_list_view',flg);
                himoku_list[i].style.setProperty('display',((flg=='open')?'block':'none'),'');
            }
        }
    };
    
    
    $.deta_send=function(){
        if(!document.form1){return}
        
        document.form1.submit();
        
    };
    
    //金額合計（個数×単価）
    $.price_sum=function(){
        var count = document.form1['data[count]'];
        var price = document.form1['data[price]'];
        var sum   = document.form1['data[sum]'];
        if(!count || !price || !sum){return}
        
        var num_count = (!count.value)?1:Number(count.value);
        var num_price = (!price.value)?0:Number(price.value);
        
        //if(!count.value){count.value = num_count}
        
        
        sum.value = (num_count * num_price);
        
    };
    
    
    //$IDEACOMPO.lib.event(window,"load",$.set);
    
    if(typeof(window.$IDEACOMPO)=='undefined'){window.$IDEACOMPO={}}
    window.$IDEACOMPO.acbook=$;
    return $;
})();
