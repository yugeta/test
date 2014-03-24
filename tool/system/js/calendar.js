

/*
カレンダーシステム
new-date:2012.10.11
write:yugeta 
version:1.000.000

□使い方

１、htmlソース作業
    ・ライブラリの読み込み（librari.js , calender.js）
    ・カレンダー要素（表示するパーツ※エリア）
    ・JS変数設定を記述
２、カレンダー要素仕様
    ※sample

<div id='calendar_view' style='position:absolute;width:320px;left:-1000px;top:-1000px;'>
    <div style='height:10px;text-align:center;'>▲</div>
    <div style='height:24px;line-height:24px;background-color:black;border-top-left-radius:8px;border-top-right-radius:8px;'>
        <div style='width:12px;height:12px;line-height:12px;font-size:14px;border:1px solid black;background-color:white;float:right;margin:4px 8px;cursor:pointer;' onclick='$NC.calendar.click_close("calendar_view")'>x</div>
    </div>
    <div id='calendar_data' style='background-color:white;border-left:1px solid black;border-right:1px solid black;'>
        <div style='text-align:center;' id='calendar_range'></div>
        <div style='text-align:center;'>
            <input type='button' value='prev' onclick='$NC.calendar.click_prev_month("calendar_view")'>
            <input type='button' value='present' onclick='$NC.calendar.click_present_month("calendar_view")'>
            <input type='button' value='next' onclick='$NC.calendar.click_next_month("calendar_view")'>
        </div>
        <div>
            <div id='cal_1' style='float:left;margin:8px;'></div>
            <div id='cal_2' style='float:left;margin:8px;'></div>
            <div style='clear:both;'></div>
        <div style='clear:both;'></div>
        </div>
    </div>
    <div style='height:24px;line-height:24px;text-align:right;background-color:black;border-bottom-left-radius:8px;border-bottom-right-radius:8px;padding-right:8px;'>
        <input type='button' value='cancel' onclick='$NC.calendar.click_close("calendar_view")' />
        <input type='button' value='設定' onclick='$NC.calendar.click_submit("calendar_view")' />
    </div>
</div>
    
    【ポイント】
    ・一番親となるdivのIDを元に内部変数を格納する作りになるので、ページ内で複数カレンダーを表示する場合は
    　各種IDを変更してください。
    ・各種イベント処理
        １、カレンダーウィンドウを閉じるボタン：onclick='$NC.calendar.click_close("calendar_view")' 
        ２、カレンダーを１月後へ移動：onclick='$NC.calendar.click_next_month("calendar_view")'
        ３、カレンダーを１月前へ移動：onclick='$NC.calendar.click_prev_month("calendar_view")'
        ４、カレンダーを当月へ移動　：onclick='$NC.calendar.click_present_month("calendar_view")'
        ５：選択した日付を反映：onclick='$NC.calendar.click_submit("calendar_view")'
    
３。JS変数設定の仕様
    
    JSの起動関数に直接セットする。(**)がついている箇所は任意
    
$NC.calendar.set({
    //カレンダーヘッダ文字列(**)
    header:'Calender',
    //フッタ文字列(**)
    footer:'',
    //既存UIのID(**)
    view:'calendar_view',
    //カレンダー表示エリアのID(**)
    calendar:'calendar_data',
    //カレンダー表示起動ボタン(**)
    btn:'calendar_btn',
    //今日の日付
    today:'<!--%system:ymdhis%-->',
    
    
    //----------
    //日付エレメント情報※期間選択ができるように２つまでのカレンダー指定ができます。パターン１と２は重複できません。
    //----------
    //yyyy , mm , ddを別項目に入力する場合（パターン１）
    elm_y1:document.getElementById('y1'),
    elm_m1:document.getElementById('m1'),
    elm_d1:document.getElementById('d1'),
    
    elm_y2:document.getElementById('y2'),
    elm_m2:document.getElementById('m2'),
    elm_d2:document.getElementById('d2'),
    
    // [2012.12.1] を１項目ないに入力する場合（パターン２）
    elm_ymd1:'',
    elm_ymd2:'',
    ymd_split:".",//分割文字(20120101の場合は、yyyymmddと登録)
    
    //カレンダー表示エレメント（※１つ表示の場合はelm_cal_1のみでOK）
    elm_cal_1:document.getElementById('cal_1'),
    elm_cal_2:document.getElementById('cal_2'),
    
    //日付決定後関数(**)
    submit:'num_change.pv_su_uu()',
    
    $:0
});
    

*/

(function($w,$d,$n,$b){
    
    //デフォルトデータ
    var $c={
        cfg:{
            id:'calender',
        $:0},
        data:{
            view:'calendar_view',
            header:'Calendar',
            
            //選択範囲外の表示（選択時）[true:表示 false:非表示]
            over_flg:false,
            
            week:['日','月','火','水','木','金','土'],
            css:[
                {s:'.calendar',d:['','border-left:1px solid #DDD;border-right:1px solid #DDD;margin:4px;']},
                {s:'.calendar_parent',d:['border:1px solid red;']},
                {s:'.calendar_month',d:['background-color:#DDD;padding:4px 0;','cursor:pointer;','font-size:12px;','height:20px;','line-height:20px;']},
                {s:'.calendar_month:hover',d:['background-color:#7dbeff;','cursor:pointer;','font-size:13px;','text-decoration:underline;']},
                {s:'.calendar_week',d:['font-size:10px;','border:0;','font-weight:bold;']},
                
                {s:'.calendar_date',d:['font-size:10px;border:1px solid #DDD;width:18px;height:12px;line-height:12px;']},
                {s:'.calendar_date_out',d:['background-color:#EEE;']},
                {s:'.calendar_date:hover',d:['background-color:#FDA;','cursor:pointer;']},
                {s:'.calendar_sel',d:['background-color:#7dbeff;color:#ffffff;']},
                {s:'.calendar_over',d:['background-color:#777777;color:#ffffff;']},
                {s:'.calendar_today',d:['border:2px solid #f68a1e;']},
            {}],
            
        $:0},
    };
    
    //カレンダー初期設定
    //起動処理
    $c.set=function(init){
        
        //設定変更データ処理
        if(init.view){
            $c.data.existing_id = init.view;
        }
        if(!init.week){
            init.week = $c.data.week;
        }
        if(!init.header){
            init.header = $c.data.header;
        }
        
        //css設定
        $c.lib.css_set();
        
        //カレンダー座標指定
        var view = $NC.$.id(init.view);
        if(view==null){return}
        
        //選択・ダブルクリック等を解除する
        view.mousedown = function(){return false};
        
        view.data={init:init};
        
        var btn  = $IDEACOMPO.lib.id(init.btn);
        var cal  = $IDEACOMPO.lib.id(init.calendar);
        
        //座標をセットして、非表示にする（初回）
        var pos  = $IDEACOMPO.lib.pos(btn);
        var siz  = $IDEACOMPO.lib.size(btn);
        view.style.setProperty("top", pos.y+siz.y+"px","");
        view.style.setProperty("left",pos.x+(siz.x/2)-($IDEACOMPO.lib.size(view).x/2)+"px","");
        view.style.setProperty("display","none","");
        
        var y=init.elm_y1.value;
        var m=init.elm_m1.value;
        
        view.data.month={y:y,m:m};
        
        $c.view.view_calendar(init.view);
        
        //タイトル表示
        var header_string = "<!--$NC.calendar.header-->";
        var header_elm = view.getElementsByClassName("NC_calendar_header");
        for(var i=0;i<header_elm.length;i++){
            header_elm[i].innerHTML = view.data.init.header;
        }
    };
    
    /***********
    * ボタン動作
    * ※htmlから直接利用化
    ***********/
    //設定ボタン
    $c.click_submit=function(id){
        var view = document.getElementById(id);
        if(typeof(view.data.sel)=='undefined'){return;}
        
        var d1 = $c.lib.date_format_array(view.data.sel[0]);
        var d2 = $c.lib.date_format_array(view.data.sel[view.data.sel.length-1]);
        
        view.data.init.elm_y1.value = d1.y;
        view.data.init.elm_m1.value = d1.m;
        view.data.init.elm_d1.value = d1.d;
        view.data.init.elm_y2.value = d2.y;
        view.data.init.elm_m2.value = d2.m;
        view.data.init.elm_d2.value = d2.d;
        
        if(view!=null){
            view.style.setProperty("display","none","");
        }
        
        //fantion
        if(view.data.init.submit){
            eval(view.data.init.submit);
        }
        //console.log(view.data.sel.length+" : "+d1.y+"/"+d1.m+"/"+d1.d+" : "+d2.y+"/"+d2.m+"/"+d2.d);
        
    };
    //次月ボタン
    $c.click_next_month=function(id){
        var view = document.getElementById(id);
        view.data.month = $c.lib.move_month(view.data.month.y, view.data.month.m, 1);
        $c.view.view_calendar(id);
    };
    //前月ボタン
    $c.click_prev_month=function(id){
        var view = $NC.$.id(id);
        view.data.month = $c.lib.move_month(view.data.month.y, view.data.month.m, -1);
        $c.view.view_calendar(id);
    };
    //当月ボタン
    $c.click_present_month=function(id){
        var view = document.getElementById(id);
        var d = $c.lib.date_format_array(view.data.init.today);
        
        view.data.month = $c.lib.move_month(d.y, d.m, 0);
        $c.view.view_calendar(id);
    };
    //クローズボタン(キャンセル)
    $c.click_close=function(id){
        var view = document.getElementById(id);
        if(view!=null){
            view.style.setProperty("display","none","");
        }
        //フラグ削除
        if(typeof(view.data.flg_click)!="undefined"){
            delete view.data.flg_click;
        }
    };
     //オープンボタン
    $c.click_open=function(id){
        var view = document.getElementById(id);
        $c.view.view_calendar($c.data.view);
        if(view!=null){
            view.style.setProperty("display","block","");
        }
    };
    
    
    
    
    
    
    
    /***********
    * システムイベント
    ***********/
    $c.event={
        //月選択
        click_month:function(e){
            if(!e){return}
            
            var id = e.getAttribute("data-id");
            var y  = e.getAttribute("data-year");
            var m  = e.getAttribute("data-month");
            
            if(!id || !y || !m){return}
            
            //既存データ解除
            $c.lib.date_unselect(id);
            
            //対象日選択
            var start = $c.lib.date_format_reed(y,m,1);
            var last  = $c.lib.date_format_reed(y,m,$c.lib.pick_month_days(y,m));
            $c.lib.date_select(id,{date1:start,date2:last});
            
            var view = document.getElementById(id);
            if(view==null){return}
            
            if(view.data.init.month){
                eval(view.data.init.month);
            }
        },
        
        //日選択(TOTAL２回クリック)
        click_date:function(e){
            if(!e){return}
            
            var id = e.getAttribute("data-id");
            var y  = e.getAttribute("data-year");
            var m  = e.getAttribute("data-month");
            var d  = e.getAttribute("data-day");
            
            if(!id || !y || !m || !d){return}
            
            var view = document.getElementById(id);
            if(view==null){return}
            
            //現在選択解除
            $c.lib.date_unselect(id);
            
            //選択日
            var date = $c.lib.date_format_reed(y,m,d);
            
            //１回目
            if(typeof(view.data.flg_click)=='undefined'){
                
                //初日選択
                $c.lib.date_select(id, {date1:date, date2:date});
                
                //フラグセット
                view.data.flg_click=date;
                
                //オプション関数起動
                if(typeof(view.data.init.click)!='undefined' && view.data.init.click[0]){
                    eval(view.data.init.click[0]);
                }
            }
            //２回目
            else{
                //日付取得
                var range = this.range_date_select(view.data.flg_click , date);
                
                //期間選択
                $c.lib.date_select(id, range);
                
                //フラグ解除
                delete view.data.flg_click;
                
                //オプション関数起動
                if(typeof(view.data.init.click)!='undefined' && view.data.init.click[1]){
                    eval(view.data.init.click[1]);
                }
            }
            
        },
        
        //２つの日付から、start、endの日付を返す。
        range_date_select:function(date1,date2){
            //逆方向処理
            if(date2 < date1){
                var chk1 = $c.lib.date_format_array(date1);
                
                //上限手前１ヶ月
                var limit = $c.lib.pick_month_days(chk1.y,chk1.m)-1;
                
                //当月日数分の減分日次
                var limit_days = $c.lib.move_date(chk1.y,chk1.m,chk1.d, limit *-1);
                
                //上限日
                var limit_date = $c.lib.date_format_reed(limit_days.y,limit_days.m, limit_days.d);
                
                //リミット処理
                var over1 = "";
                var over2 = "";
                
                if(date2 < limit_date){
                    var limit_date_arr = $c.lib.date_format_array(limit_date);
                    var limit_next_arr = $c.lib.move_date(limit_date_arr.y,limit_date_arr.m,limit_date_arr.d,-1);
                    over1 = date2;
                    over2 = $c.lib.date_format_reed(limit_next_arr.y,limit_next_arr.m,limit_next_arr.d);
                    
                    date2 = limit_date
                }
                
                return {
                    date1:date2,
                    date2:date1,
                    over1:over1,
                    over2:over2
                };
            }
            //正方向処理
            else{
                var chk = $c.lib.date_format_array(date1);
                
                //上限後ろ１ヶ月
                var limit = $c.lib.pick_month_days(chk.y,chk.m)-1;
                
                //当月1ヶ月分の増分日時
                var limit_days = $c.lib.move_date(chk.y,chk.m,chk.d, limit);
                
                //上限日
                var limit_date = $c.lib.date_format_reed(limit_days.y,limit_days.m, limit_days.d);
                
                var over1 = "";
                var over2 = "";
                
                //リミット処理
                if(date2 > limit_date){
                    var limit_date_arr = $c.lib.date_format_array(limit_date);
                    var limit_next_arr = $c.lib.move_date(limit_date_arr.y,limit_date_arr.m,limit_date_arr.d,1);
                    over1 = $c.lib.date_format_reed(limit_next_arr.y,limit_next_arr.m,limit_next_arr.d);
                    over2 = date2;
                    
                    date2 = limit_date
                }
                
                return {
                    date1:date1,
                    date2:date2,
                    over1:over1,
                    over2:over2
                };
            }
        },
        
        //マウスオーバー処理
        ms_over_date:function(e){
            if(!e){return}
            
            var id = e.getAttribute("data-id");
            if(!id){return}
            
            var view = $NC.$.id(id);
            if(view==null){return}
            
            if(typeof(view.data.flg_click)=='undefined'){return}
            
            
            var y = e.getAttribute("data-year");
            var m = e.getAttribute("data-month");
            var d = e.getAttribute("data-day");
            
            if(!id || !y || !m || !d){return}
            
            var date1 = view.data.flg_click;
            var date2 = $c.lib.date_format_reed(y,m,d);
            
            var range = this.range_date_select(date1,date2);
            
            //期間選択
            $c.lib.date_select(id, range);
            
        },
        /*
        ms_over_month:function(e){
            if(!e){return}
            
            var id = e.getAttribute("data-id");
            var y = e.getAttribute("data-year");
            var m = e.getAttribute("data-month");
            
            if(!id || !y || !m){return}
            
            //月の最初
            var date1 = $c.lib.date_format_reed(y,m,1);
            //月の最終日取得
            var last_date = $c.lib.pick_month_days(y,m)
            //月の最後
            var date2 = $c.lib.date_format_reed(y,m,last_date);
            //選択期間
            var range = this.range_date_select(date1,date2);
            
            //現在選択解除
            $c.lib.date_unselect(id);
            //1ヶ月選択
            $c.lib.date_select(id, range);
            
        },
        */
        //マウスアウト処理※選択解除
        ms_out:function(e){
            
            if(!e){return}
            
            var id = e.getAttribute("data-id");
            if(!id){return}
            
            //現在選択解除※２回め選択時のみ
            var view = document.getElementById(id);
            if(view==null){return}
            if(typeof(view.data.flg_click)=='undefined'){return}
            $c.lib.date_unselect(id);
            
        },
    $:0};
    
    /***********
    * 表示
    ***********/
    $c.view={
        //カレンダー表示処理
        view_calendar:function(id){
            var view = document.getElementById(id);
            var init = view.data.init;
            
            var cal_1="";
            if(init.elm_y1 && init.elm_m1 && init.elm_d1){
                cal_1 ={
                    y:init.elm_y1,
                    m:init.elm_m1,
                    d:init.elm_d1
                };
                if(cal_1.y==null || cal_1.m==null || cal_1.d==null){cal_1=""}
            }
            else if(init.elm_ymd1){
                cal_1 ={ymd:$NC.$.id(init.elm_ymd1)};
                if(cal_1==null){cal_1=""}
            }
            var cal_2="";
            if(init.elm_y2 && init.elm_m2 && init.elm_d2){
                cal_2 ={
                    y:init.elm_y2,
                    m:init.elm_m2,
                    d:init.elm_d2
                };
                
                if(cal_2.y==null || cal_2.m==null || cal_2.d==null){cal_2=""}
            }
            else if(init.elm_ymd2){
                cal_2 ={ymd:$NC.$.id(init.elm_ymd2)};
                if(cal_2==null){cal_2=""}
            }
            
            var y = view.data.month.y;
            var m = view.data.month.m;
            
             //カレンダー１
            if(init.elm_cal_1!=null){
                //カレンダーシングル表示（当月）
                init.elm_cal_1.innerHTML = $c.view.single_view(id,y,m,cal_1,cal_2,-1);
            }
            //カレンダー２
            if(view.data.init.elm_cal_2!=null){
                //カレンダーシングル表示（当月）
                init.elm_cal_2.innerHTML = $c.view.single_view(id,y,m,cal_1,cal_2,0);
            }
            
            //イベントセット※セルのアクション
            var cal_date = $d.getElementsByClassName("calendar_date");
            for(var i=0;i<cal_date.length;i++){
                cal_date[i].onclick     =function(){$c.event.click_date(this)};
                cal_date[i].onmouseover =function(){$c.event.ms_over_date(this)};
                cal_date[i].onmouseout  =function(){$c.event.ms_out(this)};
            }
            var cal_mon = $d.getElementsByClassName("calendar_month");
            for(var i=0;i<cal_mon.length;i++){
                cal_mon[i].onclick     =function(){$c.event.click_month(this)};
                //cal_mon[i].onmouseover =function(){$c.event.ms_over_month(this)};
                cal_mon[i].onmouseout  =function(){$c.event.ms_out(this)};
            }
            
            /*
            //from-to表示
            var range = document.getElementById("calendar_range");
            if(range!=null){
                range.innerHTML = "test";
            }
            */
        },
        
        //１ヶ月分のカレンダー単体表示処理（HTMLソースを返す）
        single_view:function(id,y,m,ymd1,ymd2,cnt){
            var view = document.getElementById(id);
            var init = view.data.init;
            
            var d = $c.lib.move_month(y,m,cnt);
            
            var date1 = $c.lib.elm2date(ymd1);
            var date2 = $c.lib.elm2date(ymd2);
            
            var html="";
            html+="<div class='calendar'>";
            html+="<div class='calendar_month' data-id='"+id+"' data-year='"+d.y+"' data-month='"+d.m+"'>"+d.y+"年"+d.m+"月</div>";
            html+="<div>";
            html+="<table>";
            //week
            html+="<tr>";
            for(var i=0;i<init.week.length;i++){
                html+="<td class='calendar_week'>"+init.week[i]+"</td>";
            }
            html+="</tr>";
            
            //date
            html+="<tr>";
            
            //前月
            var prev = $c.lib.pick_week(d.y,d.m,1);
            for(var i=0;i<prev;i++){
                html+="<td class='calendar_date calendar_date_out' data-id='"+id+"' data-year='"+d.y+"' data-month='"+d.m+"' data-day='1' ></td>";
            }
            
            //当月
            var week=prev;
            var days = $c.lib.pick_month_days(d.y,d.m);
            var n_days={};
            for(var i=1;i<=days;i++){
                
                class_name="calendar_date";
                
                //対象日判定
                var range = $c.lib.date_format_reed(d.y, d.m, i);
                if(date1<=range && date2>=range){
                    class_name+=" calendar_sel";
                    if(typeof(view.data.sel)=="undefined"){view.data.sel=[]}
                    view.data.sel[view.data.sel.length]=range;
                }
                //今日確認
                var today="";
                if(init.today){
                    today = init.today.toString().substring(0,8);
                    if(range == today){
                        class_name+=" calendar_today";
                    }
                }
                html+="<td id='calendar_date["+range+"]' class='"+class_name+"' data-id='"+id+"' data-year='"+d.y+"' data-month='"+d.m+"' data-day='"+i+"' >"+i+"</td>";
                
                n_days.y = d.y;
                n_days.m = d.m;
                n_days.d = i;
                
                //改行処理
                if(week==6){
                    html+="</tr>";
                    if(days-i >6){
                        html+="<tr>";
                    }
                    week=0;
                }
                else{
                    week++;
                }
            }
            
            //次月
            if(week>0){
                for(var i=0;i<(7-week);i++){
                    html+="<td class='calendar_date calendar_date_out' data-id='"+id+"' data-year='"+n_days.y+"' data-month='"+n_days.m+"' data-day='"+n_days.d+"'></td>";
                }
            }
            html+="</tr>";
            html+="</table>";
            html+="</div>";
            
            html+="</div>";
            
            
            return html;
            
        },
    $:0};
    
    /***********
    * 各種関数
    ***********/
    $c.lib={
        
        //カレンダー専用のCSSをセットする。
        css_set:function(){
            //IEは処理なし
            if(navigator.userAgent.toLowerCase().indexOf('msie')!=-1){return}
            
            var css = document.styleSheets;
            var sheet = document.styleSheets[css.length - 1];
            
            //ヘッダタグ内に新規sheet作成
            var style = document.createElement('style');
            document.getElementsByTagName('head')[0].appendChild(style);
            sheet = style.sheet;

            //デフォルトデータ
            var css = $c.data.css;
            
            //データセット
            for(var i=0;i<css.length;i++){
                if(!css[i].s || !css[i].d){continue}
                sheet.insertRule(css[i].s +'{'+ css[i].d.join('') +'}', sheet.cssRules.length);
            }
        },
        
        //対象日時を選択
        date_select:function(id,range){
            //通常選択範囲
            if(range.date1 && range.date2){
                var view = document.getElementById(id);
                
                for(var i=range.date1;i<=range.date2;i++){
                    var e = document.getElementById("calendar_date["+i+"]");
                    if(e==null || !e.className){continue}
                    
                    if(e.className.indexOf("calendar_sel")==-1){
                        e.className += " calendar_sel";
                        if(typeof(view.data.sel)=='undefined'){view.data.sel=[]}
                        view.data.sel[view.data.sel.length]=i;
                    }
                    
                }
            }
            //範囲外選択
            if(range.over1 && range.over2 && $c.data.over_flg){
                var view = document.getElementById(id);
                
                for(var i=range.over1;i<=range.over2;i++){
                    var e = document.getElementById("calendar_date["+i+"]");
                    if(e==null || !e.className){continue}
                    
                    if(e.className.indexOf("calendar_over")==-1){
                        e.className += " calendar_over";
                    }
                    
                }
            }
            
            //from-to表示
            var range_elm = document.getElementById("calendar_range");
            if(range_elm!=null){
                var d1 = $c.lib.date_format_array(range.date1);
                var d2 = $c.lib.date_format_array(range.date2);
                range_elm.innerHTML = d1.y+"/"+d1.m+"/"+d1.d+" - "+d2.y+"/"+d2.m+"/"+d2.d;
            }
        },
        //対象日時を選択解除
        date_unselect:function(id){
            var view = document.getElementById(id);
            if(view==null){return}
            
            //全セルを取得
            var days = view.getElementsByClassName("calendar_date");
            
            for(var i=0;i<days.length;i++){
                if(!days[i].id){continue}
                /*
                //クリック済み（フラグ箇所）の日は選択したまま
                if(!days[i].getAttribute("data-year") || !days[i].getAttribute("data-month") || !days[i].getAttribute("data-day")){continue}
                if(view.data.flg_click==$c.lib.date_format_reed(days[i].getAttribute("data-year"),days[i].getAttribute("data-month"),days[i].getAttribute("data-day"))
                ){continue}
                */
                //非選択処理
                days[i].className = days[i].className.split(" calendar_sel").join("");
                days[i].className = days[i].className.split(" calendar_over").join("");
            }
            
            //メモリ値を削除
            if(typeof(view.data.sel)!='undefined'){
                delete view.data.sel;
            }
            if(typeof(view.data.over)!='undefined'){
                delete view.data.over;
            }
        },
        
        //対象項目から日付を返す
        elm2date:function(e){
            return  $c.lib.date_format_reed(e.y.value, e.m.value, e.d.value);
        },
        //yyyymmddのフォーマットに変更する
        date_format_reed:function(y,m,d){
            m = parseInt(m,10);
            d = parseInt(d,10);
            
            if(m<10){m="0"+m}
            if(d<10){d="0"+d}
            
            return  y.toString()+m.toString()+d.toString();
        },
        date_format_array:function(date){
            date = date.toString();
            return {y:date.substring(0,4),m:date.substring(4,6),d:date.substring(6,8)};
        },
        //対象月の曜日を出力（日曜日が０）
        pick_week:function(y,m,d){
            return new Date(y,(m-1),d).getDay();
        },
        //対象月の最終日を出力
        pick_month_days:function(y,m){
            return new Date(y,m,0).getDate();
        },
        //月コントロール(○月分移動)
        move_month:function(y,m,cnt){
            var y = parseInt(y,10);
            var m = parseInt(m,10)+cnt;
            if(m<1){
                y = y-(parseInt(Math.abs(m)/12,10)+1);
                m = 12+(m%12);
                
            }
            else if(m>12){
                y = y+parseInt(m/12,10);
                m = m%12;
            }
            
            return {y:y,m:m};
        },
        
        //日コントロール（○日分移動）
        move_date:function(y,m,d,cnt){
            var msec = (+new Date(y,(m-1),d))+(1000*60*60*24)*cnt;
            var d = new Date();
            d.setTime(msec);
            
            return {y:(d.getYear()+1900), m:(d.getMonth()+1), d:d.getDate()};
        },
        
    $:0};
    
    if(typeof($w.$IDEACOMPO)=='undefined'){$w.$IDEACOMPO={}}
    $w.$IDEACOMPO[$c.cfg.id] = $c;
    return $c;
})(window,document,navigator,document.body);

