<?

/**
 * ファイルアップロード
 * 
**/

class FILE_UPLOAD{
    //複数アップロードデータを単一データに変換
    function file_update_property($file , $num){
        
        unset($data);
        $data[name] = $file[name][$num];
        $data[tmp_name] = $file[tmp_name][$num];
        $data[type] = $file[type][$num];
        $data[size] = $file[size][$num];
        $data[error] = $file[error][$num];
        
        return $data;
    }
    
    //ファイル情報
    function file_update_info($f){
        unset($i);
        $i[] = "Name:".$f[name];
        $i[] = "tmp_name:".$f[tmp_name];
        $i[] = "type:".$f[type];
        $i[] = "size:".$f[size]."Bite";
        $i[] = "error:".$f[error];
        
        echo join("<br>",$i)."<hr>";
        return $i;
    }
    
    function file_upload_start($tmp,$file,$dir=""){
        /*
        if(!$dir){
            $dir="data/";
        }
        $parent = $this->make_dir($parent);
        $dir = $this->make_dir($dir);
        */
        
        if($dir && !is_dir($dir)){
            mkdir($dir , 0777 , true);
        }
        
        //データをテンポラリから本番へ移動
        if(file_exists($tmp)){
            rename($tmp , $dir.$file);
        }
    }
    
    //多重階層作成（ディレクトリのみ）[階層文字列を返す]
    function make_dir($dir,$parent=""){
        if(!$dir){return;}
        
        $path = $parent.$dir;
        
        //同名ファイルとして存在確認
        if(file_exists($path)){}
        //ディレクトリの存在確認
        else if(is_dir($path)){}
        //上記ヒット無い場合はフォルダ作成
        else{
            $dirs = split("\/",$dir);
            $dir_path = "";
            //階層が複数ある場合は、ループ処理
            if(count($dirs)>1){
                for($i=0;$i< count($dirs);$i++){
                    $dir_path.= $dirs[$i]."/";
                    if(is_dir($parent.$dir_path)){continue;}
                    mkdir($parent.$dir_path);
                }
            }
            else{
                $dir_path = $dirs[0];
                mkdir($parent.$dir_path);
            }
            $path = $parent.$dir_path;
        }
        
        //階層表記判定
        if(!preg_match("/\/$/",$path)){
            $path .= "/";
        }
        
        return $path;
    }
    
    //ディレクトリ内のリストを取得
    function searchDir($path,$val){
        
        if($d = @dir($path)){
            while ($entry = $d->read()) {
                if ($entry != '.' && $entry != '..' && preg_match('/'.$val.'/',$entry,$match)){
                    $data[] = $entry;
                }
            }
            unset($d); $d = null;
            @sort($data);
            return $data;
        }
    }
    
    //文字列のエンコード処理
    function value_encode($str){
        $arr = array('&','"',"'",'=',' ');
        
        for($i=0;$i< count($arr);$i++){
            $str = str_replace($arr[$i],rawurlencode($arr[$i]),$str);
        }
        return $str;
    }
    //コマンド用文字列変換
    function value_exec($str){
        $arr = array('&','"',"'",'=',' ');
        
        for($i=0;$i< count($arr);$i++){
            $str = str_replace($arr[$i],"\\".$arr[$i],$str);
        }
        return $str;
    }
    
    //type値を取得
    function check_type($path){
        if(is_link($path)){
            return "link";
        }
        if(is_file($path)){
            return "file";
        }
        else if(is_dir($path)){
            return "folder";
        }
        else{
            return "";
        }
    }
    
}
