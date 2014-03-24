<?

/*
* 各種便利機能
* 1,classをfunctionのように使えるようにする機能
*/

class UTILITY{
    
    //classをfunctionのように使えるようにする機能
    //[ class_name , $func_name , $data*array]
    //クラスが存在しない、クラス内のfunctionが存在しない場合は未処理で返す
    function class_read($class_name , $func_name , $data){
        
        //classの存在確認
        if(!class_exists($class_name)){return;}
        
        //dataが配列の場合とstringの場合で処理を分ける
        if(is_array($data)){
            return call_user_func_array(array($class_name,$func_name) , $data);
        }
        else{
            return call_user_func(array($class_name,$func_name));
        }
        
        
    }
    
}