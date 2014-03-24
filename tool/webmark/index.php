<?

/**
* Servman
* 単語：Server-Strage-Admin-Manage-Setting
* 概要：サーバーデータ管理システム
* 
**/

$tool = new TOOL();
$GLOBALS[contents][html] = $tool->index();

class TOOL{
    
    //起動処理
    function index(){
        
        //$tpl = new TEMPLATE();
        
        $html = "WebMark";
        
        return $html;
        
        //$GLOBALS[tool][html]="picmark";
        
        //echo $tpl->read_tpl(SYS.'/tpl/frame.html');
        
    }
    
    
    
}

