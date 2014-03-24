<?
/**
 * Cron batch
**/

//die("0:".$argv[1]."\n");

for($i=0,$c=count($argv);$i<$c;$i++){
    //各クエリの分解
    $q2 = explode("=",$argv[$i]);
    if($q2[0]=='' || $q2[1]==''){continue;}
    //requestに格納
    $_REQUEST[$q2[0]] = $q2[1];
}


$batch = new BATCH();
//$batch->cmd2query();
$batch->requires("tool/system/php/");


//echo $_REQUEST['mode']."\n";
//echo '---<br>';

if($_REQUEST['mode']=='books'){
    $batch->books();
}



class BATCH{
    
    //lib
    /*
    //query処理
    function cmd2query(){
        for($i=0;$i< count($argv);$i++){
            //各クエリの分解
            $q2=split("=",$argv[$i]);
            if($q2[0]!=''&&$q2[1]!=''){
                //requestに格納
                $_REQUEST[$q2[0]]=$q2[1];
            }
        }
    }
    */
    
    //フォルダ内のphpを一括でincludeする※class一覧
    function requires($dir){
        if(!is_dir($dir)){return;}
        
        if(!preg_match("@\/$@",$dir)){
            $dir.= '/';
        }
        
        $php = scandir($dir);
        for($i=0,$c=count($php);$i<$c;$i++){
            
            //システムファイルは無視
            if($php[$i]=='.' || $php[$i]=='..'){continue;}
            
            //phpファイル以外は無視
            if(!preg_match("/^(.*)\.php$/",$php[$i])){continue;}
            
            require_once $dir.$php[$i];
        }
    }
    
    
    /**
     * Books - batch
     * [pdf,zip,rar] -> .book/--/%file%.s.jpg
    **/
    
    function books(){
        /*
        if(is_dir('data/.tmp')){
            exec('rm -rf data/.tmp');
        }
        */
        define(TOOL_DIR,'data/books/');
        define(TOOL_THUMB,'data/.books/');
        
        $path = '';
        
        //check
        //if(!is_dir($path)){return;}
        
        // limit_count
        $limit_count = (60*60*1);
        
        //folder-check
        $this->books_folder($path,$limit_count);
        
        
    }
    function books_folder($path,$limit_count){
        
        
        
        $image = new IMAGE();
        
        echo TOOL_DIR.$path.'<br>';
        
        $lists = scandir(TOOL_DIR.$path);
        
        for($i=0,$c=count($lists);$i<$c;$i++){
            if($lists[$i]=='.' || $lists[$i]=='..'){continue;}
            
            //if($limit_count <= 0){return 0;}
            
            //dir
            if(is_dir(TOOL_DIR.$path.$lists[$i])){
                $limit_count = $this->books_folder($path.$lists[$i].'/' , $limit_count);
            }
            
            //file
            else if(file_exists(TOOL_DIR.$path.$lists[$i])){
                
                $sp  = explode('.',$lists[$i]);
                $ext = array_pop($sp);
                $ext = strtolower($ext);
                $flg = '';
                
                //thumb -> move
                if($ext=='.s.jpg'){
                    
                    echo 'thumb:'.TOOL_DIR.$path.$lists[$i]."\n";
                    
                    if(!is_dir(TOOL_THUMB.$path)){
                        mkdir(TOOL_THUMB.$path,0777,true);
                    }
                    //exists file -> remove
                    if(file_exists(TOOL_THUMB.$path.$lists[$i])){
                        unlink(TOOL_THUMB.$path.$lists[$i]);
                    }
                    rename(TOOL_DIR.$path.$lists[$i],TOOL_THUMB.$path.$lists[$i]);
                }
                else if($ext=='pdf' || $ext=='zip' || $ext=='rar'){
                    
                    /*
                    if(is_dir('data/.tmp')){
                        exec('rm -rf data/.tmp');
                    }
                    */
                    
                    $thumb_file = TOOL_THUMB.$path.join('.',$sp).$image->thumb_ext;
                    
                    if(file_exists($thumb_file)){continue;}
                    
                    //book-file
                    if($ext=='pdf'){
                        echo 'PDF ['.$limit_count.']:'.TOOL_DIR.$path.$lists[$i]."\n";
                        $flg = $image->pdf2thumb(TOOL_DIR.$path.$lists[$i],$thumb_file);
                        $limit_count = $limit_count - 20;
                    }
                    else if($ext=='zip'){
                        echo 'ZIP ['.$limit_count.']:'.TOOL_DIR.$path.$lists[$i]."\n";
                        $flg = $image->zip2thumb(TOOL_DIR.$path.$lists[$i],$thumb_file);
                        $limit_count = $limit_count - 10;
                    }
                    else if($ext=='rar'){
                        echo 'RAR ['.$limit_count.']:'.TOOL_DIR.$path.$lists[$i]."\n";
                        $flg = $image->rar2thumb(TOOL_DIR.$path.$lists[$i],$thumb_file);
                        $limit_count = $limit_count - 10;
                    }
                }
                
            }
            
        }
        
    }
    
    
}
