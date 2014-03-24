/**
 * 日時に関わる関数処理
 * 
 * 
 * 1) $NC.$date.format.str2date(date);
 *      文字列形式(yyyymmdd)を日付形式に変換(Date())
 *      param1:date string-format(yyyymmdd)
 * 
 * 2) $NC.$date.format.arr2string(date);
 *      配列形式を文字列に変換※月日は、桁数を調整する。
 *      array-format(yyyy , mm , dd) to string-format(yyyymmdd)
 * 
 * 
 * 3) $NC.$date.format.date2string(date);
 *      日付形式を文字列形式にする。
 * 
 * 4) $NC.$date.format.range(date1,date2);
 *      ２つの日付の期間日数を算出する。
 * 
 * 5) $NC.$date.format.move(date);
 *      
 * 
 **/

(function($w,$d,$n){
    
    var $_={cfg:{
        id:'date',
        
    $:0}};
    
    //データフォーマット調整
    
    //
    //Sat Mar 30 2013 13:11:14 GMT+0900 (JST) → 20130330
    $_.date2ymd = function(data){
        if(!data){return}
        
        var dt = new Date(data);
        
        var y = (dt.getYear()+1900);
        var m = (dt.getMonth()+1);
        if(m<10){m='0'+m.toString()}
        var d = dt.getDate();
        if(d<10){d='0'+d.toString()}
        
        return y.toString() + m.toString() + d.toString();
    }
    $_.date2ymdhis = function(data){
        if(!data){return}
        
        var dt = new Date(data);
        
        //日付フォーマット
        var y = (dt.getYear()+1900);
        var m = (dt.getMonth()+1);
        if(m<10){m='0'+m.toString()}
        var d = dt.getDate();
        if(d<10){d='0'+d.toString()}
        
        //時間フォーマット
        var h = dt.getHours();
        if(h<10){h='0'+h.toString()}
        var i = dt.getMinutes();
        if(i<10){i='0'+i.toString()}
        var s = dt.getSeconds();
        if(s<10){s='0'+s.toString()}
        
        
        return y.toString() + m.toString() + d.toString() + h.toString() + i.toString() + s.toString();
    }
    
    $_.format={
        
        //yyyymmdd → Date()
        str2date:function(date){
            return new Date(date.substr(0,4) , date.substr(4,2)-1 , date.substr(6,2));
        },
        
        // [y,m,d] → yyyymmdd
        arr2string:function(){
            
        },
        
        //Date() → string
        date2string:function(dd){
            var y = dd.getYear()+1900;
            var m = dd.getMonth()+1;
            var d = dd.getDate();
            
            m = (m<10)?"0"+Number(m).toString():m;
            d = (d<10)?"0"+Number(d).toString():d;
            
            return y.toString()+m.toString()+d.toString();
        },
        
        //期間 ※date1,2はstring
        range:function(date1 , date2){
            var d1 = this.str2date(date1);
            var d2 = this.str2date(date2);
            return ((d2-d1)/(60*60*24)/1000);
        },
        
        //○日移動する
        move:function(date , moveCount){
            
            //Date(),フォーマットに変換
            var dd = this.str2date(date);
            var d2 = new Date(dd.getTime()+(moveCount*60*60*24*1000));
            //var d2 = 
            return this.date2string(d2);
        },
        
        //yyyymmdd形式を送ると曜日を返す
        str2week:function(date){
            var dd = day = str2date(date);
            
            return dd.getDay();
            
        },
        
    $:0};
    
    //２つの日付間の日数を取得(2013.3.21 ~ 2013.3.23 = 3)　※両日を含めた日数（○日間）
    //日数を配列で返す
    //date1 , date2 は、yyyymmss形式
    $_.date2range_arr = function(date1 , date2){
        
        //期間取得
        var cnt = $_.format.range(date1,date2);
        
        //キャッシュ用データ
        var dates = [date1];
        
        //日付登録処理
        for(var i=1;i<=cnt;i++){
            dates[dates.length] = $_.format.move(date1 , i);
        }
        
        return dates;
    };
    
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$_.cfg.id] = $_;
    return $_;
})(window,document,navigator);