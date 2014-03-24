<?

/**
* Picmark
* 単語：Pics-Cabinet-Arrange-Book-Mark
* 概要：写真管理システム、写真のブックマーク
* 
**/

$tool = new TOOL();
$GLOBALS[contents][html] = $tool->index();


class TOOL{
    
    //起動処理
    function index(){
        
        //基本設定
        define(TOOL_DIR,'data/'.$_REQUEST[tool].'/'.UID.'/');
        
        //----------
        //各種分岐
        //----------
        
        $html = '';
        
        //ファイルアップロード処理
        if($_REQUEST[action]=='upload'){
            $picmark = new PICMARK();
            $picmark->upload(TOOL_DIR);
            
            //echo "a";
            //return "b";
            
            exit;
        }
        
        //ajaxで画像一覧の読み込み
        else if($_REQUEST[mode]=='pics'){
            $picmark = new PICVIEW();
            echo $picmark->pic_view();
            exit;
        }
        //ajaxで画像一覧の読み込み
        else if($_REQUEST[mode]=='list'){
            $piclist = new PICLIST();
            echo $piclist->lists(UID);
            exit;
        }
        
        /*
        //debug
        else if($_REQUEST[menu]=='debug'){
            $sys = new SYS();
            $config = $sys->config2data($_REQUEST[tool]);
            
            
            
            $html.= $config[name]."<br>";
            $html.= $config[name_class]."<br>";
            $html.= $config[type]."<br>";
        }
        */
        
        //通常表示（デフォルト）
        //{
            $tpl = new TEMPLATE();
            
            $tpl_path = TOOL.$_REQUEST[tool].'/tpl/'.$_REQUEST[menu].'.html';
            if(!file_exists($tpl_path)){
                $tpl_path = TOOL.$_REQUEST[tool].'/tpl/'.$GLOBALS[config][default_menu].'.html';
            }
            
            $html = $tpl->read_tpl($tpl_path);
            //die(TOOL.$_REQUEST[tool].'/tpl/index.html');
        //}
        
        
        
        
        
        return $html;
        
        //$GLOBALS[tool][html]="picmark";
        
        //echo $tpl->read_tpl(SYS.'/tpl/frame.html');
        
    }
    
    
    
}

