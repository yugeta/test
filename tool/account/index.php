<?

if($_REQUEST[menu]){
    $_REQUEST[menu]="index";
}
if(!$_REQUEST[action]){
    $_REQUEST[action]='start';
}

if(class_exists($_REQUEST[menu]) && method_exists($_REQUEST[menu],$_REQUEST[action])){
    $GLOBALS[contents][html] = call_user_func(array($_REQUEST[menu],$_REQUEST[action]));
    //$GLOBALS[contents][html] = call_user_func($_REQUEST[menu].'::'.$_REQUEST[action]);
}

else if(file_exists(TOOL.$_REQUEST[tool].'/tpl/'.$_REQUEST[menu].'.html')){
    $GLOBALS[contents][html] = $tpl->read_tpl(TOOL.$_REQUEST[tool].'/tpl/'.$_REQUEST[menu].'.html');
}

else{
    $GLOBALS[contents][html] = "準備中";
}
