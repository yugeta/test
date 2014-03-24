<?
/**
 * list
 * -summary
 * data/user/y/m/d/pic.jpg
 * 
**/

class PICLIST{
    
    //JSONで全てのデータを保持する。
    function lists($user){
        //----------
        //初期設定
        //----------
        
        //各種データ変数
        unset($html,$pics_json,$date_y);
        
        //データフォルダ
        $data_dir = 'data/'.$_REQUEST[tool].'/'.$user.'/';
        
        //存在しないディレクトリの場合は処理しない
        if(!is_dir($data_dir)){return;}
        
        //写真の総枚数
        $total_pics_count=0;
        
        //データ検索
        $datas = $this->directorys_search($data_dir,1);
        
        //Year
        $data_year = array_keys($datas);
        //$data_year = array_reverse($data_year);
        
        for($y=0,$c1=count($data_year);$y<$c1;$y++){
            
            //$key_y = $data_year[$i];
            $val_y = $datas[$data_year[$y]];
            
            // Year folder name
            //if($val_y=='file'){continue;}
            $kai_y = explode('/',str_replace($data_dir,'',$data_year[$y]));
            $file_y = array_pop($kai_y);
            
            unset($date_m);
            
            //month
            $data_month = array_keys($datas[$data_year[$y]]);
            
            for($m=0,$c2=count($data_month);$m<$c2;$m++){
                
                $kai_m = explode('/',str_replace($data_dir,'',$data_month[$m]));
                $file_m = array_pop($kai_m);
                
                $date = new DATE();
                $dt = $date->str2hash($file_y.$file_m);
                
                //pics
                $pics = array_keys($datas[$data_year[$y]][$data_month[$m]]);
                if(!count($pics)){continue;}
                
                unset($pics_json);
                for($d=0,$c3=count($pics);$d<$c3;$d++){
                    
                    $kai_p     = explode('/',str_replace($data_dir,'',$pics[$d]));
                    $file_p    = array_pop($kai_p);
                    //$file_name = explode('.',$file_p);
                    //$kaku      = array_pop($file_name);
                    //$file_name = join('.',$file_p);
                    
                    //画像ファイル以外は除外
                    if(preg_match('/\.s\./',$file_p) || preg_match('/\.txt$/',$file_p)){continue;}
                    //$pics_json[] = '"'.join('.',$file_name).'"';
                    $pics_json[] = '"'.$file_p.'"';
                }
                
                // month,days data memory
                //$date_m[substr($file_m,0,2)][] = '"'.substr($file_m,2,2).'":['.join(',',$pics_json).']';
                
                $data = (count($pics_json))?join(',',$pics_json):'';
                
                $date_m[substr($file_m,0,2)][] = '"'.substr($file_m,2,2).'":['.$data.']';
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
            
            $date_y[] = '"'.$file_y.'":{'.join(',',$date_md).'}';
            
        }
        
        //sort($date_y);
        
        return '{"'.$data_dir.'":{'.join(",",$date_y).'}}';
        //$html[] = 'list:{'.join(",",$date_y).'}';
        
        //return '{'.join(",",$html).'}';
        
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
    function directorys_search($dir,$flg){
        if(!is_dir($dir)){return;}
        
        //初期設定
        $folder = new FOLDER();
        
        //対象フォルダ内の一覧取得
        $files = $folder->lists($dir,$flg);
        
        unset($datas);
        for($i=0,$c=count($files);$i<$c;$i++){
            
            //フォルダの場合は、子階層取得
            if(is_dir($dir.$files[$i])){
                $datas[$dir.$files[$i]] = $this->directorys_search($dir.$files[$i].'/',$flg);
            }
            //ファイルの場合
            else{
                $datas[$dir.$files[$i]] = 'file';
            }
        }
        
        return $datas;
        
    }
    
}
