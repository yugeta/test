<?
/**
* 文字列操作
**/

class STRING{
    
    /**
    * 62進数エンコード、デコード
    **/
    
    // num→id
    function enc_62($n){
        $char = array_merge(
            range(0,9),
            range('a','z'),
            range('A','Z')
        );
        
        $cn = count($char);
        $str = '';
        while ($n != 0) {
            $a1 = (int) ($n / $cn);
            $a2 = $n - ($a1*$cn);
            
            $str = $char[$a2].$str;
            $n = $a1;
        }
        return $str;
    }
    // id→num
    function dec_62($n){
        $char = array_merge(
            range(0,9),
            range('a','z'),
            range('A','Z')
        );
        
        $cn = count($char);
        for ($i=0; $i<$cn; $i++) {
            $chars[$char[$i]] = $i;
        }
        $str = 0;
        for ($i=0,$cnt=strlen($n);$i<$cnt; $i++) {
            $str += $chars[substr($n, ($i+1)*-1, 1)] * pow($cn, $i);
        }
        
        return $str;
    }
    
    /**
    * 文字列をAsciiコードに変換する
    * 
    **/
    
    public $code_split = ':';
    
    //パスワード暗号化（Asciiコード化）
    function enc_code($str,$split=null){
        if(!$split){
            $split = $this->code_split;
        }
        if($str){
            for($i=0,$c=strlen($str);$i<$c;$i++){
                $pass[] .= ord(substr($str,$i,1));
            }
            return join($split,$pass);
        }
        else{
            return '';
        }
        
    }
    
    //パスワード復元（Asciiコード→復元）
    function dec_code($str,$split=null){
        
        if($str==''){return '';}
        
        if(!$split){
            $split = $this->code_split;
        }
        
        unset($pass);
        $pass='';
        $pass_arr = @split($split,$str);
        
        for($p=0,$c=count($pass_arr);$p<$c;$p++){
            $pass .= chr($pass_arr[$p]);
        }
        
        return $pass;
    }
    
    // command-file encode
    function cmd_format($str){
        unset($ptn,$cng);
        
        //space
        $ptn[] = ' ';
        $cng[] = '\ ';
        
        
        
        return str_replace($ptn,$cng,$str);
        
    }
    
    /*
    //内容確認をし、内容がないものは""ブランクを返す
    function check_bool($val){
        return ($val)?$val:'';
    }
    */
}
    
