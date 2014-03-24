<?

/**
 * 画像アップロード＆写真一覧表示
 * 
 * 【フォルダ構成】
 *      data/picmark/%UID%/
 *          //data/  : 元写真データ
 *          //thumb/ : サムネイル、写真情報
 *              yyyy/mmdd/%pic_data% [data:.jpg  thumb:jpg,txt]
 * 写真ファイル：更新日HHIISS_連番.jpg　※連番は、000（3桁）からスタートし、カウントアップする。
 * サムネイル　：（上記と同じ）.thumb.jpg
 * 写真情報　　：（上記と同じ）.exif.txt
 *              
 * 【exif（詳細）情報】
 * 
 * -変更不可情報
 * ファイル名（元）
 * 更新日（撮影日）
 * GPS情報（LON , LAT）
 * 
 * -変更可能情報
 * 写真名称
 * 
 * 
 * 
**/

class PICMARK{
    
    //データ格納フォルダ
    //public $pics = 'pics/';
    
    //各種拡張子※ファイル名に付与して同一階層に保持する。
    //public $ext_data = 'data';
    public $ext_thumb = 's.jpg';
    public $ext_exif  = 'txt';
    
    //サムネイル作成（縮小サイズ）
    //public $thumb_size = 100;
    
    //サムネイル長編の長さ
    public $thumb_size = 120;
    
    //ファイルアップロード処理
    function upload($dir){
        //複数ファイル対応
        if(count($_FILES[file_data][error])){
            
            $upload = new FILE_UPLOAD();
            $date = new DATE();
            $str = new STRING();
            
            for($i=0,$c=count($_FILES[file_data][error]);$i<$c;$i++){
                
                //１ファイル毎のデータとして取得
                $data = $upload->file_update_property($_FILES[file_data],$i);
                
                //exif情報
                $exif = exif_read_data($data[tmp_name]);
                
                //保存ディレクトリ確定（日付）YYYY/MMDD/
                if($exif[DateTimeOriginal]){
                    $dt = $exif[DateTimeOriginal];
                    $dt = str_replace(':','',$dt);
                    $dt = str_replace(' ','',$dt);
                    $dt2 = $date->str2hash($dt);
                    $path = $dt2[y].'/'.$dt2[m].$dt2[d].'/';
                    
                    //$file_name = $dt2[h].$dt2[i].$dt2[s];
                    //$file_name = $dt2[y].$dt2[m].$dt2[d].$dt2[h].$dt2[i].$dt2[s];
                    $file_name = date(U,mktime($dt2[h],$dt2[i],$dt2[s],$dt2[m],$dt2[d],$dt2[y]));
                }
                //送信データとして保持
                else if($_REQUEST[file_property][$i][modify]){
                    //$y = substr($_REQUEST[file_property][$i][modify],0,4);
                    //$md = substr($_REQUEST[file_property][$i][modify],4,4);
                    //$path = $y.'/'.$md.'/';
                    $dt2 = $date->str2hash($_REQUEST[file_property][$i][modify]);
                    $path = $dt2[y].'/'.$dt2[m].$dt2[d].'/';
                    
                    //$file_name = substr($_REQUEST[file_property][$i][modify],8,6);
                    //$file_name = $_REQUEST[file_property][$i][modify];
                    
                    $file_name = date(U,mktime($dt2[h],$dt2[i],$dt2[s],$dt2[m],$dt2[d],$dt2[y]));
                }
                //タイムスタンプ取得
                else{
                    $path = date(Y,filemtime($data[tmp_name])).'/'.date(md,filemtime($data[tmp_name])).'/';
                    
                    //$file_name = date(His,filemtime($data[tmp_name]));
                    //$file_name = date(YmdHis,filemtime($data[tmp_name]));
                    $file_name = date(U,mktime(date(H,filemtime($data[tmp_name])),date(i,filemtime($data[tmp_name])),date(s,filemtime($data[tmp_name])),date(m,filemtime($data[tmp_name])),date(d,filemtime($data[tmp_name])),date(Y,filemtime($data[tmp_name]))));
                }
                
                //62進数変換+ファイルサイズ
                $file_name = $str->enc_62($file_name).'_'.$str->enc_62($_REQUEST[file_property][$i][size]);
                
                //拡張子決定
                $sp = explode('.',$data[name]);
                $ext = array_pop($sp);
                //小文字に変換
                $ext = strtolower($ext);
                
                if($ext == 'jpeg'){
                    $ext = 'jpg';
                }
                //$ext = $this->ext_data.".".$ext;
                
                //$dpath = $dir.'data/'.$path;
                //$thumb= $dir.'thumb/'.$path;
                
                $upload_flg=0;
                
                //同一ファイル名処理
                //※存在する場合のみ
                //ファイル容量、サイズ、その他情報を比較し、同じ場合は、処理無し
                //違う画像と判断されれば、名前に通し番号を付与する。
                if(file_exists($dir.$path.$file_name.'.'.$ext)){
                    //file_put_contents($dir.'test.txt',filesize($path.$data[name]).'/'.filesize($data[tmp_name]));
                    //容量比較※同一容量の場合は処理無し
                    if(filesize($dir.$path.$file_name.'.'.$ext) == filesize($data[tmp_name])){$upload_flg++;}
                    
                    //通し番号追加
                    $file_name = $this->file_name_numbering($dir.$path,$file_name.'.'.$ext);
                }
                
                if(!$upload_flg){
                    //フォルダ作成
                    if(!is_dir($dir.$path)){
                        mkdir($dir.$path , 0777 , true);
                    }
                    
                    //ファイル移動
                    rename($data[tmp_name] , $dir.$path.$file_name.'.'.$ext);
                    //file_put_contents("txt.txt",$data[tmp_name]."\n".$dir.$path.$file_name.'.'.$ext."\n".$file_name);
                    //$upload->file_upload_start($data[tmp_name], $file_name.'.'.$ext, $dir.$path);
                }
                
                
                //return;
                
                /**
                 * 画像回転処理
                 * 1:通常
                 * 2:左右反転
                 * 3:180°回転
                 * 4:上下反転
                 * 5:反時計回りに90°回転 上下反転
                 * 6:時計回りに90°回転
                 * 7:時計回りに90°回転 上下反転
                 * 8:反時計回りに90°回転
                **/
                /*
                if($exif[Orientation]){
                    $this->make_orientation_fixed_blob($dpath.$data[name]);
                }
                */
                
                //既存サムネイルは削除する。
                if(file_exists($dir.$path.$file_name.'.'.$this->ext_thumb)){
                    unlink($dir.$path.$file_name.'.'.$this->ext_thumb);
                }
                
                //サムネイル作成（縮小サイズ）
                $this->thumb_nail($dir.$path.$file_name.'.'.$ext);
                /*
                $size = 100;
                
                //$image = new IMAGE();
                //$image->thumb($thumb , $data[name] , 64);
                //ファイルパスをファイル名と拡張子に分解
                //サイズ取得
                list($x,$y) = getimagesize($dir.$path.$file_name.'.'.$ext);
                
                //サムネイルサイズ計算
                //横長（正方形）
                if($x >= $y){
                    $thumb_x = $size;
                    $thumb_y = (int)($y / ($x / $size));
                }
                //縦長
                else{
                    $thumb_x = (int)($x / ($y / $size));
                    $thumb_y = $size;
                }
                
                //
                //画像サイズ変更
                $image_p = imagecreatetruecolor($thumb_x, $thumb_y);
                $image = imagecreatefromjpeg($dir.$path.$file_name.'.'.$ext);
                imagecopyresampled($image_p, $image, 0, 0, 0, 0, $thumb_x, $thumb_y, $x, $y);
                imagejpeg($image_p, $dir.$path.$file_name.'.'.$this->ext_thumb);
                */
                
                /**
                 * EXIF情報
                **/
                //$str = new STRING();
                $gps = new GPS();
                unset($txt);
                
                //name
                if($_REQUEST[file_property][$i][name]){
                    $txt[] = 'api,name,'.$_REQUEST[file_property][$i][name].','."\n";
                }
                //type
                if($_REQUEST[file_property][$i][type]){
                    $txt[] = 'api,type,'.$_REQUEST[file_property][$i][type].','."\n";
                }
                //urn
                if($_REQUEST[file_property][$i][urn]){
                    $txt[] = 'api,urn,'.$_REQUEST[file_property][$i][urn].','."\n";
                }
                //size
                if($_REQUEST[file_property][$i][size]){
                    $txt[] = 'api,size,'.$_REQUEST[file_property][$i][size].','."\n";
                }
                //modify
                if($_REQUEST[file_property][$i][type]){
                    $txt[] = 'api,modify,'.$_REQUEST[file_property][$i][modify].','."\n";
                }
                
                //画像サイズ
                $txt[] = "sys,width,".$x.','."\n";
                $txt[] = "sys,height,".$y.','."\n";
                
                //GPS
                if($exif[GPSLatitude] && $exif[GPSLongitude]){
                    $txt[] = "gps,latitude,".$gps->exif($exif[GPSLatitude]).','."\n";//緯度
                    $txt[] = "gps,longitude,".$gps->exif($exif[GPSLongitude]).','."\n";//軽度
                }
                /*
                if($exif[Orientation]){
                    $txt[] = 'orientation,'.$exif[Orientation].','."\n";
                }
                
                //タイムスタンプ
                if($exif[FileDateTime]){
                    $txt[] = 'FileDateTime,'.$exif[FileDateTime].','."\n";
                    $txt[] = 'FileDateTime2,'.date(YmdHis,$exif[FileDateTime]).','."\n";
                }
                
                //$exif[DateTime]
                if($exif[DateTime]){
                    $txt[] = 'DateTime,'.$exif[DateTime].','."\n";
                }
                */
                $ptns = array("\n","\r");
                //exif情報
                foreach($exif as $key=>$val){
                    //$html[] = $key."=".$val;
                    //配列
                    if(is_array($val)){
                        foreach($val as $a=>$b){
                            $txt[] = 'exif,'.$key."[".$a."],".str_replace($ptns,"",$b).','."\n";
                        }
                        /*
                        for($i=0,$c=count($val);$i<$c;$i++){
                            $html[] = $key."[".$i."]=".$val[$i];
                        }
                        */
                    }
                    //文字列
                    else{
                        $txt[] = 'exif,'.$key.",".str_replace($ptns,'',$val).','."\n";
                    }
                    
                }
                
                
                $txt[] = 'file-update,'.date(YmdHis,filemtime($file)).','."\n";
                
                
                file_put_contents($dir.$path.$file_name.'.'.$this->ext_exif, join("",$txt));
                
            }
        }
    }
    
    /**
     * サムネイル作成
    **/
    function thumb_nail($pic){
        
        //ファイルパスをファイル名と拡張子に分解
        //サイズ取得
        list($x,$y) = getimagesize($pic);
        
        //サムネイルサイズ計算
        //横長（正方形）
        if($x >= $y){
            $thumb_x = $this->thumb_size;
            $thumb_y = (int)($y / ($x / $this->thumb_size));
        }
        //縦長
        else{
            $thumb_x = (int)($x / ($y / $this->thumb_size));
            $thumb_y = $this->thumb_size;
        }
        
        //サムネイルファイル名
        $sp = explode('.',$pic);
        $ext = array_pop($sp);
        
        //画像サイズ変更
        $image_p = imagecreatetruecolor($thumb_x, $thumb_y);
        $image = imagecreatefromjpeg($pic);
        imagecopyresampled($image_p, $image, 0, 0, 0, 0, $thumb_x, $thumb_y, $x, $y);
        imagejpeg($image_p, join('.',$sp).'.'.$this->ext_thumb);
        
    }
    
    /*
    //orientation処理
    function make_orientation_fixed_blob($raw)
    {
        $img = new Imagick();
        $ver = $img->getVersion();
        
        $img->readImageBlob($raw);
        $orientation = 0;
        if( method_exists($img, "getImageOrientation") ){
          $orientation = $img->getImageOrientation();
        }
        if(!$orientation && function_exists("read_exif_data")){
          $exif = read_exif_data($this->image_path("original").DIRECTORY_SEPARATOR.$this->file_name());
          $orientation = $exif['Orientation'];
        }
        switch((int)$orientation) {
            case 0:#未定義
                break;
            case 1:#通常
                break;
            case 2:#左右反転
                $img->flopImage();
                break;
            case 3:#180°回転
                $img->rotateImage(new ImagickPixel(), 180 );
                break;
            case 4:#上下反転
                $img->flipImage();
                break;
            case 5:#反時計回りに90°回転 上下反転
                $img->rotateImage(new ImagickPixel(), 270 );
                $img->flipImage();
                break;
            case 6:#時計回りに90°回転
                $img->rotateImage(new ImagickPixel(), 90 );
                break;
            case 7:#時計回りに90°回転 上下反転
                $img->rotateImage(new ImagickPixel(), 90 );
                $img->flipImage();
                break;
            case 8:#反時計回りに90°回転
                $img->rotateImage(new ImagickPixel(), 270 );
                break;
        }
        $raw = $img->getImageBlob();
        unset($img);
        return $raw;
    }
    */
    //同一フォルダ内に同じファイル名がある場合は、ナンバリングをする。
    function file_name_numbering($path,$name){
        //不番号初期設定
        $num = 1;
        
        //ファイル名分解
        $file_names = explode('.',$name);
        $kaku = array_pop($file_names);
        $new_file = join('.',$file_names);
        
        //番号削除処理
        if(preg_match('/^(.*)(\[[0-9]+\])$/',$new_file,$match)){
            $new_file = $match[1];
        }
        
        //付番処理
        while(file_exists($path.$new_file.'['.$num.'].'.$kaku)){
            $num++;
        }
        //return $new_file.'['.$num.'].'.$kaku;
        return $new_file.'['.$num.']';
    }
    
    //画像情報取得
    function exif($file){
        
        //$file = TOOL.$_REQUEST[tool].'/img/IMG_0733.JPG';
        if(!file_exists($file)){return;}
        
        $exif = exif_read_data($file); 
        
        //return file_exists($file);
        
        unset($html);
        
        
        foreach($exif as $key=>$val){
            //$html[] = $key."=".$val;
            //配列
            if(is_array($val)){
                foreach($val as $a=>$b){
                    $html[] = $key."[".$a."]=".$b;
                }
                /*
                for($i=0,$c=count($val);$i<$c;$i++){
                    $html[] = $key."[".$i."]=".$val[$i];
                }
                */
            }
            //文字列
            else{
                $html[] = $key."=".$val;
            }
            
        }
        
        /*
        $date = new DATE();
        
        //$html.= 'file-update'.":".filemtime($file);
        $html[] = 'file-update'.":".date(YmdHis,filemtime($file));
        $html[] = 'FileDateTime'.":".$exif[FileDateTime];
        $html[] = 'FileType'.":".$exif[FileType];//2:jpegのみ対象とする
        //$html.= 'GPSLatitude'.":".join("/",$exif[GPSLatitude]);
        //$html.= 'GPSLongitude'.":".join("/",$exif[GPSLongitude]);
        
        $gps = new GPS();
        $html[] = 'GPSLatitude'.":".$gps->exif($exif[GPSLatitude]);
        $html[] = 'GPSLongitude'.":".$gps->exif($exif[GPSLongitude]);
        //$html.= 'SubjectLocation'.":".join("/",$exif[SubjectLocation]);
        $html[] = 'COMPUTED'.":".join("/",$exif[COMPUTED]);
        */
        
        
        return join("\n",$html);
    }
    
    //ファイルリスト
    function file_list(){
        $dir = 'data/'.$_REQUEST[tool].'/'.UID.'/';
        //return '<div>test</div>';
        //return $dir;
        //存在しないディレクトリの場合は処理しない
        if(!is_dir($dir)){return;}
        
        $datas = $this->directorys_search($dir);
        
        return $this->directorys_view($datas,$dir);
        
    }
    
    //public $file = '<img src="'.SYS.'img/icon_16/file.png" class="file">';
    //public $dir  = '<img src="'.SYS.'img/icon_16/dir.png" class="dir">';
    
    //hashをディレクトリ階層表示する
    function directorys_view($datas,$dir){
        
        unset($html);
        
        foreach($datas as $key=>$val){
            $path = str_replace($dir,'',$key);
            $kai = explode('/',$path);
            $under = array_pop($kai);
            //ファイル
            if($val=='file'){
                $html[] = '<li class="file" data-path="'.$key.'">'.'<img src="'.SYS.'img/icon_16/file.png" draggable="false">' . $under .'</li>';
            }
            //フォルダ
            else{
                $html[] = '<li class="dir" data-path="'.$key.'">'.'<img src="'.SYS.'img/icon_16/dir.png" draggable="false" onclick="$IDEACOMPO.picmark.dir(this)">' . $under . $this->directorys_view($datas[$key],$dir) .'</li>';
            }
        }
        
        return '<ul>' . join('',$html) . '</ul>';
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
            if(is_dir($dir.$files[$i])){
                //フォルダの場合は、子階層取得
                $datas[$dir.$files[$i]] = $this->directorys_search($dir.$files[$i].'/');
            }
            //ファイルの場合
            else{
                $datas[$dir.$files[$i]] = 'file';
            }
        }
        
        return $datas;
        
    }
    
    //----------
    //画像リスト
    //----------
    function pic_view($mode=''){
        
        //初期設定
        $pdata = TOOL_DIR.'data/';
        $thumb = TOOL_DIR.'thumb/';
        
        //存在しないディレクトリの場合は処理しない
        if(!is_dir($pdata)){return;}
        
        
        //die("aa");
        //日別表示
        if($mode=='date'){
            return $this->pic_view_date($pdata,$thumb);
        }
        //年別表示
        else if($mode=='year'){
            return $this->pic_view_year($pdata,$thumb);
        }
        //全て表示
        else if($mode=='all'){
            return $this->pic_view_all($pdata,$thumb);
        }
        //全て表示
        else if($mode=='tag'){
            return $this->pic_view_tag($pdata,$thumb);
        }
        //最新１００個※デフォルト
        else if($mode=='new'){
            return $this->pic_view_new($pdata,$thumb);
        }
        //JSで全てのデータを保持し、リアルタイムに反映する。
        else{
            return $this->pic_view_json($pdata,$thumb);
        }
        
        
    }
    
    //全てのデータ※データ数が1000を超えると表示レスポンスが著しく低下する。
    function pic_view_all($pdata,$thumb){
        
        $datas = $this->directorys_search($pdata);
        
        unset($html);
        
        //Year
        $data_year = array_keys($datas);
        $data_year = array_reverse($data_year);
        for($i=0,$c1=count($data_year);$i<$c1;$i++){
            
            $key_y = $data_year[$i];
            $val_y = $datas[$key_y];
            
            if($val_y=='file'){continue;}
            $kai_y = explode('/',str_replace($pdata,'',$key_y));
            $file_y = array_pop($kai_y);
            
            $html.= '<div class="pic_year">';
            //$html.= '<h4>'.$file_y.'</h4>';
            //month
            $data_month = array_keys($datas[$key_y]);
            $data_month = array_reverse($data_month);
            for($j=0,$c2=count($data_month);$j<$c2;$j++){
                
                $key_m = $data_month[$j];
                $val_m = $datas[$key_y][$key_m];
                
                if($val_m=='file'){continue;}
                $kai_m = explode('/',str_replace($pdata,'',$key_m));
                $file_m = array_pop($kai_m);
                
                $date = new DATE();
                $dt = $date->str2hash($file_y.$file_m);
                
                //pics
                $arr = array_keys($datas[$key_y][$key_m]);
                $html.= '<div class="pic_month">';
                $html.= '<h4>'.$dt[y].'.'.$dt[m].'.'.$dt[d].' ('.count($arr).'個のデータ)'.'</h4>';
                foreach($datas[$key_y][$key_m] as $key_p=>$val_p){
                    
                    $fl = str_replace($pdata,'',$key_p);
                    $kai_p = explode('/',$fl);
                    $file_p = array_pop($kai_p);
                    $file_p2= explode('.',$file_p);
                    $kaku = array_pop($file_p2);
                    if(strtolower($kaku)=='jpg' || strtolower($kaku)=='jpeg' || strtolower($kaku)=='gif' || strtolower($kaku)=='png'){
                        $image_file =  'data-image-view="'.$pdata.$fl.'" data-image-path="'.$thumb.$fl.'"';
                    }
                    else{
                        $image_file =  'data-image-path="'.SYS.'img/thumb/player.png"';
                    }
                    
                    $html.= '<div class="pics">';
                    $html.= '<div class="picimg"><img class="pics" src="'.SYS.'img/anim/loading_35.gif" '.$image_file.' draggable="false"></div>';
                    $html.= '<div class="picname">'.$file_p.'</div>';
                    $html.= '</div>';
                }
                $html.='<div style="clear:both;"></div>';
                $html.='</div>';
            }
            $html.='</div>';
        }
        /*
        foreach($datas as $key_y=>$val_y){
            if($val_y=='file'){continue;}
            $kai_y = explode('/',str_replace($pdata,'',$key_y));
            $file_y = array_pop($kai_y);
            
            $html.= '<div class="pic_year">';
            //$html.= '<h4>'.$file_y.'</h4>';
            //month
            foreach($datas[$key_y] as $key_m=>$val_m){
                if($val_m=='file'){continue;}
                $kai_m = explode('/',str_replace($pdata,'',$key_m));
                $file_m = array_pop($kai_m);
                
                $date = new DATE();
                $dt = $date->str2hash($file_y.$file_m);
                
                //pics
                $arr = array_keys($datas[$key_y][$key_m]);
                $html.= '<div class="pic_month">';
                $html.= '<h4>'.$dt[y].'.'.$dt[m].'.'.$dt[d].' ('.count($arr).'個のデータ)'.'</h4>';
                foreach($datas[$key_y][$key_m] as $key_p=>$val_p){
                    $fl = str_replace($pdata,'',$key_p);
                    $kai_p = explode('/',$fl);
                    $file_p = array_pop($kai_p);
                    $file_p2= explode('.',$file_p);
                    $kaku = array_pop($file_p2);
                    if(strtolower($kaku)=='jpg' || strtolower($kaku)=='jpeg' || strtolower($kaku)=='gif' || strtolower($kaku)=='png'){
                        $image_file =  'data-image-view="'.$pdata.$fl.'" data-image-path="'.$thumb.$fl.'"';
                    }
                    else{
                        $image_file =  'data-image-path="'.SYS.'img/thumb/player.png"';
                    }
                    
                    $html.= '<div class="pics">';
                    $html.= '<div class="picimg"><img class="pics" src="'.SYS.'img/anim/loading_35.gif" '.$image_file.' draggable="false"></div>';
                    $html.= '<div class="picname">'.$file_p.'</div>';
                    $html.= '</div>';
                }
                $html.='<div style="clear:both;"></div>';
                $html.='</div>';
            }
            $html.='</div>';
        }
        */
        return $html;
        
    }
    
    //最新１００個のデータを表示（タイムスタンプが最新のモノ）
    function pic_view_new($pdata,$thumb){
        
        $datas = $this->directorys_search($pdata);
        
        unset($html);
        
        //最新上限数
        $max_count = 100;
        
        //Year
        $data_year = array_keys($datas);
        $data_year = array_reverse($data_year);
        for($i=0,$c1=count($data_year);$i<$c1;$i++){
            
            //最新上限数判定
            if(!$max_count){break;}
            
            $key_y = $data_year[$i];
            $val_y = $datas[$key_y];
            
            if($val_y=='file'){continue;}
            $kai_y = explode('/',str_replace($pdata,'',$key_y));
            $file_y = array_pop($kai_y);
            
            $html.= '<div class="pic_year">';
            //$html.= '<h4>'.$file_y.'</h4>';
            //month
            $data_month = array_keys($datas[$key_y]);
            $data_month = array_reverse($data_month);
            for($j=0,$c2=count($data_month);$j<$c2;$j++){
                //最新上限数判定
                if(!$max_count){break;}
                
                $key_m = $data_month[$j];
                $val_m = $datas[$key_y][$key_m];
                
            //for($datas[$key_y] as $key_m=>$val_m){
                if($val_m=='file'){continue;}
                $kai_m = explode('/',str_replace($pdata,'',$key_m));
                $file_m = array_pop($kai_m);
                
                $date = new DATE();
                $dt = $date->str2hash($file_y.$file_m);
                
                //pics
                $arr = array_keys($datas[$key_y][$key_m]);
                $html.= '<div class="pic_month">';
                $html.= '<h4>'.$dt[y].'.'.$dt[m].'.'.$dt[d].' ('.count($arr).'個のデータ)'.'</h4>';
                foreach($datas[$key_y][$key_m] as $key_p=>$val_p){
                    //最新上限数判定
                    if(!$max_count){break;}
                    
                    $fl = str_replace($pdata,'',$key_p);
                    $kai_p = explode('/',$fl);
                    $file_p = array_pop($kai_p);
                    $file_p2= explode('.',$file_p);
                    $kaku = array_pop($file_p2);
                    if(strtolower($kaku)=='jpg' || strtolower($kaku)=='jpeg' || strtolower($kaku)=='gif' || strtolower($kaku)=='png'){
                        $image_file =  'data-image-view="'.$pdata.$fl.'" data-image-path="'.$thumb.$fl.'"';
                    }
                    else{
                        $image_file =  'data-image-path="'.SYS.'img/thumb/player.png"';
                    }
                    
                    $html.= '<div class="pics">';
                    $html.= '<div class="picimg"><img class="pics" src="'.SYS.'img/anim/loading_35.gif" '.$image_file.' draggable="false"></div>';
                    $html.= '<div class="picname">'.$file_p.'</div>';
                    $html.= '</div>';
                    
                    $max_count--;
                }
                $html.='<div style="clear:both;"></div>';
                $html.='</div>';
            }
            $html.='</div>';
        }
        
        return $html;
    }
    
    //日別表示
    function pic_view_date($pdata,$thumb){
        
    }
    //年別表示
    function pic_view_year($pdata,$thumb){
        $datas = $this->directorys_search($pdata);
        
        unset($html);
        
        //Year
        $data_year = array_keys($datas);
        $data_year = array_reverse($data_year);
        for($i=0,$c1=count($data_year);$i<$c1;$i++){
            
            $key_y = $data_year[$i];
            $val_y = $datas[$key_y];
            
            //写真の保有個数
            $cnt = 0;
            
            if($val_y=='file'){continue;}
            $kai_y = explode('/',str_replace($pdata,'',$key_y));
            $file_y = array_pop($kai_y);
            
            $html.= '<div class="pic_year">';
            
            //$html.= '<h4>'.$file_y.'</h4>';
            //month
            $data_month = array_keys($datas[$key_y]);
            $data_month = array_reverse($data_month);
            for($j=0,$c2=count($data_month);$j<$c2;$j++){
                
                $key_m = $data_month[$j];
                $val_m = $datas[$key_y][$key_m];
                
                if($val_m=='file'){continue;}
                $kai_m = explode('/',str_replace($pdata,'',$key_m));
                $file_m = array_pop($kai_m);
                
                $date = new DATE();
                $dt = $date->str2hash($file_y.$file_m);
                
                //pics
                $arr = array_keys($datas[$key_y][$key_m]);
                //$html.= '<div class="pic_month">';
                //$html.= '<h4>'.$dt[y].'.'.$dt[m].'.'.$dt[d].' ('.count($arr).'個のデータ)'.'</h4>';
                foreach($datas[$key_y][$key_m] as $key_p=>$val_p){
                    
                    $fl = str_replace($pdata,'',$key_p);
                    $kai_p = explode('/',$fl);
                    $file_p = array_pop($kai_p);
                    $file_p2= explode('.',$file_p);
                    $kaku = array_pop($file_p2);
                    if(strtolower($kaku)=='jpg' || strtolower($kaku)=='jpeg' || strtolower($kaku)=='gif' || strtolower($kaku)=='png'){
                        $image_file =  'data-image-view="'.$pdata.$fl.'" data-image-path="'.$thumb.$fl.'"';
                    }
                    else{
                        $image_file =  'data-image-path="'.SYS.'img/thumb/player.png"';
                    }
                    //写真の保有個数を追加
                    $cnt++;
                }
            }
            
            $image_file='';
            
            $html.= '<div class="pics">';
            $html.= '<div class="picimg"><img class="pics" src="'.SYS.'img/anim/loading_35.gif" '.$image_file.' draggable="false"></div>';
            $html.= '<div class="picname">'.$file_y.' ('.$cnt.')</div>';
            $html.= '</div>';
            
            $html.='</div>';
        }
        $html.='<div style="clear:both;"></div>';
        return $html;
    }
    //タグ別表示
    function pic_view_tag($pdata,$thumb){
        
    }
    
    
    //JSONで全てのデータを保持する。
    function pic_view_json(){
        
        //初期設定
        $pdata = TOOL_DIR.'data/';
        $thumb = TOOL_DIR.'thumb/';
        
        //存在しないディレクトリの場合は処理しない
        if(!is_dir($pdata)){return;}
        
        $datas = $this->directorys_search($pdata);
        
        unset($html,$json);
        
        //Year
        $data_year = array_keys($datas);
        $data_year = array_reverse($data_year);
        
        for($i=0,$c1=count($data_year);$i<$c1;$i++){
            $key_y = $data_year[$i];
            $val_y = $datas[$key_y];
            
            if($val_y=='file'){continue;}
            $kai_y = explode('/',str_replace($pdata,'',$key_y));
            $file_y = array_pop($kai_y);
            
            //month
            $data_month = array_keys($datas[$key_y]);
            $data_month = array_reverse($data_month);
            for($j=0,$c2=count($data_month);$j<$c2;$j++){
                
                $key_m = $data_month[$j];
                $val_m = $datas[$key_y][$key_m];
                
                if($val_m=='file'){continue;}
                $kai_m = explode('/',str_replace($pdata,'',$key_m));
                $file_m = array_pop($kai_m);
                
                $date = new DATE();
                $dt = $date->str2hash($file_y.$file_m);
                
                //pics
                $arr = array_keys($datas[$key_y][$key_m]);
                if(!count($arr)){continue;}
                
                foreach($datas[$key_y][$key_m] as $key_p=>$val_p){
                    $fl = str_replace($pdata,'',$key_p);
                    $kai_p = explode('/',$fl);
                    $file_p = array_pop($kai_p);
                    $file_p2= explode('.',$file_p);
                    $kaku = array_pop($file_p2);
                    
                    //val[0:genre 1:file-name]
                    unset($val);
                    
                    if(strtolower($kaku)=='jpg' || strtolower($kaku)=='jpeg' || strtolower($kaku)=='gif' || strtolower($kaku)=='png'){
                        $val[0] = '"photo"';
                        $val[1] = '"'.$fl.'"';
                    }
                    else{
                        //$image_file =  'data-image-path="'.SYS.'img/thumb/player.png"';
                        $val[0] = '"mov"';
                        $val[1] = '"'.SYS.'img/thumb/player.png"';
                    }
                    
                    //$json[] = '"'.$file_y.'/'.$file_m.'/'.$file_p.'":['.join(',',$val).']';
                    $json[] = '['.join(',',$val).']';
                    //break;
                }
            }
        }
        
        $html[] = '"pdata":"'.$pdata.'"';
        $html[] = '"thumb":"'.$thumb.'"';
        $html[] = '"pics":['.join(",",$json).']';
        
        return '({'.join(",",$html).'})';
        
        //exit;
    }
    
    function base64($file){
        return base64_encode(file_get_contents($file));
    }
    
    
}
