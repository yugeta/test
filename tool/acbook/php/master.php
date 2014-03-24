<?

class master{
    
    function index(){
        $tpl = new TEMPLATE();
        return $tpl->read_tpl(TOOL.$_REQUEST[tool].'/tpl/'.$_REQUEST[menu].'.html');
    }
    
    function read($tool,$user,$file){
        
        //return $tool."/".$user."/".$file;
        $path = 'data/'.$tool."/".$user.'/master/'.$file.".dat";
        //return $path;
        
        //return $path." : ".file_exists($path);
        
        if(!file_exists($path)){return;}
        
        //return "aa";
        return file_get_contents($path);
        
    }
    
    function write(){
        
        $url = new URL();
        $backup = new BACKUP();
        
        $keys = array_keys($_REQUEST[data]);
        
        for($i=0,$c=count($keys);$i<$c;$i++){
            $path = 'data/'.$_REQUEST[tool]."/".$_REQUEST[uid].'/master/'.$keys[$i].".dat";
            
            //data-save
            file_put_contents($path,$_REQUEST[data][$keys[$i]]);
            
            //data-backup
            $backup->write($path,$_REQUEST[data][$keys[$i]]);
            
        }
        
        header("Location: ".$url->url()."?tool=".$_REQUEST[tool]."&menu=".$_REQUEST[menu]);
    }
    
    
    
}