<?

/**
写真表示機能

【仕様】
・大量データに対応するため、初回表示個数から、追加読み込みを行う
・タグ機能対応
・検索機能
・基準は撮影日（年、月、日）
・

**/

class PICVIEW{
    
    function view(){
        
        
        
    }
    
    //JSONで全てのデータを保持する。
    function pic_view(){
        
        //初期設定
        $data_dir = 'data/'.$_REQUEST[tool].'/'.UID.'/';
        /*
        $pdata = TOOL_DIR.'data/';
        $thumb = TOOL_DIR.'thumb/';
        */
        
        //存在しないディレクトリの場合は処理しない
        if(!is_dir($data_dir)){return;}
        
        $datas = $this->directorys_search($data_dir);
        
        unset($html,$json,$date_y);
        
        //Year
        $data_year = array_keys($datas);
        $data_year = array_reverse($data_year);
        
        //読み込み上限数
        $read_from  = ($_REQUEST[read_from])?$_REQUEST[read_from]:0;
        $read_count = $_REQUEST[read_count];
        //読み込み最終フラグ
        $read_end = 0;
        //写真の総枚数
        $total_pics_count=0;
        
        for($i=0,$c1=count($data_year);$i<$c1;$i++){
            /*
            //max-count判定
            if($_REQUEST[max_count]){
                if($max_count<=0){break;}
            }
            */
            $key_y = $data_year[$i];
            $val_y = $datas[$key_y];
            
            if($val_y=='file'){continue;}
            $kai_y = explode('/',str_replace($data_dir,'',$key_y));
            $file_y = array_pop($kai_y);
            
            //unset($date_d);
            unset($date_m);
            
            //month
            $data_month = array_keys($datas[$key_y]);
            $data_month = array_reverse($data_month);
            
            for($j=0,$c2=count($data_month);$j<$c2;$j++){
                
                $key_m = $data_month[$j];
                $val_m = $datas[$key_y][$key_m];
                
                if($val_m=='file'){continue;}
                $kai_m = explode('/',str_replace($data_dir,'',$key_m));
                $file_m = array_pop($kai_m);
                
                $date = new DATE();
                $dt = $date->str2hash($file_y.$file_m);
                
                //pics
                $arr = array_keys($datas[$key_y][$key_m]);
                if(!count($arr)){continue;}
                
                $total_day_pics=0;
                $first_img ='';
                
                foreach($datas[$key_y][$key_m] as $key_p=>$val_p){
                    
                    $fl = str_replace($data_dir,'',$key_p);
                    $kai_p = explode('/',$fl);
                    $file_p = array_pop($kai_p);
                    $file_p2= explode('.',$file_p);
                    $kaku = array_pop($file_p2);
                    
                    //画像ファイル以外は除外
                    if(preg_match('/\.s\./',$key_p) || preg_match('/\.txt$/',$key_p)){continue;}
                    
                    $first_img = $file_p;
                    $total_day_pics++;
                    
                    //read-from判定(カウントダウン方式：0になるまではスキップする)
                    if($read_from){
                        $read_from--;
                        continue;
                    }
                    
                    //read-count判定（カウントダウン方式：０になるとbreakする）
                    if($_REQUEST[read_count]){
                        if($read_count<=0){
                            $read_end++;
                            //break;
                            continue;
                        }
                        $read_count--;
                    }
                    
                    //val[0:genre 1:file-path , 2:file-name※同じ場合は無]
                    unset($val);
                    
                    if(strtolower($kaku)=='jpeg'){
                        $kaku = 'jpg';
                    }
                    
                    if(strtolower($kaku)=='jpg' || strtolower($kaku)=='gif' || strtolower($kaku)=='png'){
                        $val[] = 'type:"img"';
                        
                        //ファイル名
                        //$val[1] = 'path:"'.$fl.'"';
                        //$val[2] = 'icon:""';
                    }
                    //movie
                    else{
                        //$image_file =  'data-image-path="'.SYS.'img/thumb/player.png"';
                        $val[] = 'type:"mov"';
                        //ファイル名
                        //$val[1] = 'path:"'.$fl.'"';
                        //$val[2] = 'icon:"'.SYS.'img/thumb/player.png"';
                    }
                    
                    $val[] = 'y:"'.$file_y.'"';
                    $val[] = 'm:"'.substr($file_m,0,2).'"';
                    $val[] = 'd:"'.substr($file_m,2,2).'"';
                    //$val[] = 'f:"'.join('.',$file_p2).'"';
                    $val[] = 'ext:"'.$kaku.'"';
                    
                    //ファイル名
                    $val[] = 'file:"'.$this->read_property($data_dir.join('/',$kai_p).'/'.join('.',$file_p2).'.txt', 'api', 'name').'"';
                    
                    $json[] = '"'.join('.',$file_p2).'":{'.join(',',$val).'}';
                    
                    //break;
                }
                
                $total_pics_count+= $total_day_pics;
                
                // month,days data memory
                $date_m[substr($file_m,0,2)][] = '"'.substr($file_m,2,2).'":{img_count:'.$total_day_pics.',img_first:"'.join('.',$file_p2).'"}';
            }
            
            unset($date_md);
            
            foreach($date_m as $m=>$arr_d){
                unset($d);
                //sort($arr_d);
                for($j=0,$c3=count($arr_d);$j<$c3;$j++){
                    $d[] = $arr_d[$j];
                }
                $date_md[] = '"'.$m.'":{'.join(',',$d).'}';
            }
            
            //$m1 = array_keys($date_m);
            
            $date_y[] = '"'.$file_y.'":{'.join(',',$date_md).'}';
            
        }
        
        //sort($date_y);
        
        $html[] = 'dir:"'.$data_dir.'"';
        $html[] = 'end:'.$read_end;
        $html[] = 'file_count:'.$total_pics_count;
        $html[] = 'pics:{'.join(",",$json).'}';
        $html[] = 'date:{'.join(',',$date_y).'}';
        //$html[] = 'date:['.join(',',$data_year).']';
        //$html[] = 'test:"'.$test.'"';
        
        return '{'.join(",",$html).'}';
        
        //exit;
    }
    
    function read_property($file,$type1,$type2){
        if(!file_exists($file)){return;}
        
        $data = explode("\n",file_get_contents($file));
        
        for($i=0,$c=count($data);$i<$c;$i++){
            //$data[$i] = str_replace(array("\n","\r"),'');
            //if(!$data[$i]){continue;}
            
            $sp = explode(',',$data[$i]);
            if(!count($sp)){continue;}
            
            if($sp[0]==$type1 && $sp[1]==$type2){
                return str_replace(array("\n","\r"),'',$sp[2]);
            }
            
        }
        
    }
    
    //対象ディレクトリ内の階層をhashで返す。
    /*
    $files[0] = "a"; //file
    $files[1] = "b/"; //dir
    $files[1][0] = "c"; //file
    $files[1][1] = "d"; //file
    */
    function directorys_search($dir){
        if(!is_dir($dir)){return;}
        
        //初期設定
        $folder = new FOLDER();
        
        //対象フォルダ内の一覧取得
        $files = $folder->lists($dir);
        
        unset($datas);
        for($i=0,$c=count($files);$i<$c;$i++){
            //フォルダじゃない場合は、シカト
            //if($files[$i]=='.' || $files[$i]=='..'){continue;}
            
            //フォルダの場合は、子階層取得
            if(is_dir($dir.$files[$i])){
                $datas[$dir.$files[$i]] = $this->directorys_search($dir.$files[$i].'/');
            }
            //ファイルの場合
            else{
                $datas[$dir.$files[$i]] = 'file';
            }
        }
        
        return $datas;
        
    }
    
}

