<?

/**
* ACBook
* 単語：household-account-books-petty_cash_book
* 概要：家計簿システム（小遣い帳）
* 
**/

//基本設定
define(TOOL_DIR ,'data/' .$_REQUEST[tool].'/'.UID.'/');
define(THUMB_DIR,'data/.'.$_REQUEST[tool].'/'.UID.'/');

$tool  = new TOOL();
$shelf = new TOOL_SHELF();
$tpl   = new TEMPLATE();
$url   = new URL();

if($_REQUEST[menu]=='shelf'){
    //$GLOBALS[contents][html] = $shelf->view();
    $GLOBALS[contents][html] = $tpl->read_tpl(TOOL.$_REQUEST[tool].'/tpl/'.$_REQUEST[menu].'.html');
}
else if($_REQUEST[menu]=='make_thumb'){
    echo $shelf->make_thumb($_REQUEST[file_name],$_REQUEST[thumb_file]);
    exit;
}
else if($_REQUEST[menu]=='book_read'){
    //echo $shelf->book_read($_REQUEST[path]);
    
    //$GLOBALS[contents][html] = $shelf->book_read_page($_REQUEST[path],$_REQUEST[page]);
    
    //$GLOBALS[contents][html] = '<img src="'.$url->url().'?tool='.$_REQUEST[tool].'&menu=book_read_page&book='.$_REQUEST[path].'&page=0">';
    
    echo $tpl->read_tpl('tool/'.$_REQUEST[tool].'/tpl/'.$_REQUEST[menu].'.html');
    
    exit;
}
else if($_REQUEST[menu]=='book_read_page'){
    //echo $shelf->book_read($_REQUEST[path]);
    
    //if(true){return;}
    
    echo $shelf->book_read_page($_REQUEST[book]);
    
    //echo $tpl->read_tpl('tool/'.$_REQUEST[tool].'/tpl/'.$_REQUEST[menu].'.html');
    
    exit;
}
/*
else if($_REQUEST[menu]=='total_file_count'){
    echo $shelf->total_file_count($_REQUEST[path]);
    exit;
}
*/
else{
    $GLOBALS[contents][html] = 'books';
}


/**
Tool common function
**/

class TOOL{
    
    
    
}

