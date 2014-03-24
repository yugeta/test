<?

/**
 * フレームワークの共通仕様
 * 
 * 【認証の流れ】
 * 
 * 
 * 
 * 
 * 
**/

class SYS{
    /*
    //初期設定
    //ユーザーデータ格納ファイル
    public $sys  = DAT;
    public $pass = 'passwd.txt';
    public $data = 'user_data.txt';
    public $cfg  = 'config.txt';
    */
    //ヘッダのsys、api、tool毎の読み込みLINKタグ処理
    function header_link(){
        
        $tag = '';
        
        //システムライブラリ
        //共通CSS
        $file = SYS."css/".$_REQUEST[sys].".css";
        if(file_exists($file)){
            $tag.= "<link rel='stylesheet' type='text/css' href='".$file."' />"."\n";
        }
        
        //JS
        $folder = new FOLDER();
        $js_files = $folder->lists(SYS."js/");
        for($i=0,$c=count($js_files);$i<$c;$i++){
            $tag.= "<script type='text/javascript' src='".SYS."js/".$js_files[$i]."'></script>"."\n";
        }
        
        //toolライブラリ
        if($_REQUEST[tool]){
            $file = TOOL.$_REQUEST[tool]."/css/common.css";
            if(file_exists($file)){
                $tag.= "<link rel='stylesheet' type='text/css' href='".$file."' />"."\n";
            }
            
            $file = TOOL.$_REQUEST[tool]."/js/common.js";
            if(file_exists($file)){
                $tag.= "<script type='text/javascript' src='".$file."'></script>"."\n";
            }
            
            if($_REQUEST[menu]){
                $file = TOOL.$_REQUEST[tool]."/css/".$_REQUEST[menu].".css";
                if(file_exists($file)){
                    $tag.= "<link rel='stylesheet' type='text/css' href='".$file."' />"."\n";
                }
                
                $file = TOOL.$_REQUEST[tool]."/js/".$_REQUEST[menu].".js";
                if(file_exists($file)){
                    $tag.= "<script type='text/javascript' src='".$file."'></script>"."\n";
                }
            }
            
        }
        
        return $tag;
        
    }
    
    //ユーザーデータのヘッダ表示
    function user_data($uid){
        
        $url = new URL();
        $tpl = new TEMPLATE();
        
        unset($data);
        
        //ログイン中
        if($uid){
            
            
            $data.='[ '.'<a href="'.$url->url().'?tool=account'.'">'.$uid.'</a>'.' ] ';
            $data.='<a href="'.$url->url().'?sys=logout'.(($_SERVER[QUERY_STRING])?'&'.$_SERVER[QUERY_STRING]:'').'">logout</a>';
        }
        
        //ログインしてない場合（ログインモードフラグがONの場合のみ）
        else if($GLOBALS[config][login_mode] && is_dir(DAT)){
            
            $data.= $tpl->read_tpl(SYS."/tpl/header_login.html");
            
        }
        
        return $data;
    }
    
    //初期設定（管理者情報登録）※設定ファイルが存在しない場合の処理
    function first_setting(){
        $tpl = new TEMPLATE();
        $url = new URL();
        
        //登録情報が無い場合の処理
        if($_POST[id] && $_POST[pw]){
            $ymd = date(YmdHis);
            //初期設定ファイル登録
            $this->config_write();
            //管理者情報の登録
            $this->user_data_write($ymd);
            //管理者パスワード登録
            $this->passwd_write($ymd);
            
            //ログイン前画面へ遷移
            $url->move($url->url());
        }
        //通常は専用設定画面を表示する
        else{
            echo $tpl->read_tpl(SYS.'/tpl/first_setting.html');
            exit;
        }
    }
    
    //ユーザー登録
    function regist(){
        
        $tpl = new TEMPLATE();
        $str = new STRING();
        //$login = new LOGIN();
        $ideacompo = new IDEACOMPO();
        
        //登録処理※データ保存ファイル確認（登録済み確認）
        //if($_POST[id] && $_POST[pw] && !$login->user_confirm($str->enc_code($_POST[id]))){
        if($_POST[id] && $_POST[pw] && !$ideacompo->user_confirm($str->enc_code($_POST[id]))){
            
            /*
            //メールタイプ仕様の場合のバリデート
            if($_POST[user_id_type]=='mail'){
                //$ptn = '/^[a-z0-9!#$%&\'*+\/=?^_`|~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`|~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[a-z]2,4|museum|travel)$/i';
                $ptn = '/(.+)@(.+)\.(.+)/';
                if(!preg_match($ptn,$_POST[id])){
                    die("no-mail");
                }
            }
            */
            //設定
            $ymd = date(YmdHis);
            //管理者情報の登録
            $this->user_data_write($ymd);
            //管理者パスワード登録
            $this->passwd_write($ymd);
            
            //完了表示
            echo $tpl->read_tpl(SYS.'/tpl/regist_complete.html');
            exit;
        }
        
        //登録情報入力ページの表示
        echo $tpl->read_tpl(SYS.'/tpl/regist.html');
        exit;
    }
    
    //初期設定データの書き込み ※config.txt
    function config_write(){
        //管理設定（初期設定）の時のみ
        if(is_dir($this->sys)){return;}
        
        //ディレクトリ作成
        mkdir($this->sys,0777,true);
        
        //config
        unset($config);
        $keys = array_keys($_POST[config]);
        for($i=0,$cnt=count($keys);$i<$cnt;$i++){
            $config .= $keys[$i].'='.$_POST[config][$keys[$i]]."\n";
        }
        
        //データ保存
        file_put_contents($this->sys.$this->cfg, $config);
        
    }
    
    //ユーザー情報の書き込み
    function user_data_write($ymd){
        
        $str = new STRING();
        $ideacompo = new IDEACOMPO();
        
        unset($user_data);
        //データ登録
        $user_data[0] = $ymd;
        //ユーザーID
        $user_data[1] = $str->enc_code($_POST[id]);
        //氏名
        $user_data[2] = $str->enc_code($_POST[nm]);
        //メール
        $user_data[3] = $str->enc_code($_POST[ml]);
        
        $user_data[]  = '';
        
        file_put_contents(DAT.$ideacompo->data, join(",",$user_data)."\n", FILE_APPEND);
    }
    
    //パスワード保存[UID , PWD , AUTH , GROUP , ymdhis]
    function passwd_write($ymd){
        
        $str = new STRING();
        $ideacompo = new IDEACOMPO();
        
        //パスワード登録
        unset($user_data);
        //ユーザーID
        $user_data[0] = $str->enc_code($_POST[id]);
        //パスワード
        $user_data[1] = $str->enc_code($_POST[pw]);
        //auth
        $user_data[2] = $_POST[auth];
        //group
        $user_data[3] = $_POST[group];
        //update
        $user_data[4] = $ymd;
        $user_data[]  = '';
        
        file_put_contents(DAT.$ideacompo->pass, join(",",$user_data)."\n", FILE_APPEND);
    }
    
    function view_logo(){
        
        $url = new URL();
        
        if($_REQUEST[tool]){
            /*
            $tool = new TOOL();
            
            $logo_str   = $tool->name;
            $logo_class = split(",",$tool->name_class);
            
            $link = $url->url()."?tool=".$_REQUEST[tool];
            */
            $config = $this->config2data($_REQUEST[tool]);
            
            $logo_str   = ($config[name])?$config[name]:$_REQUEST[tool];
            $logo_class = ($config[name_class])?explode(",",$config[name_class]):'';
            $link = $url->url()."?tool=".$_REQUEST[tool];
            
            //die($logo_str);
        }
        else{
            $logo_str = $GLOBALS[config][name];
            $logo_class   = explode(",",$GLOBALS[config][name_class]);
            
            $logo_bgcolor = explode(",",$GLOBALS[config][name_logo_bgcolor]);
            $logo_border  = explode(",",$GLOBALS[config][name_logo_border]);
            $logo_color   = explode(",",$GLOBALS[config][name_logo_color]);
            $logo_rotate  = explode(",",$GLOBALS[config][name_logo_rotate]);
            
            $link = $url->url();
        }
        
        //商事処理
        $html = '';
        $html.= '<div class="logo" onclick=\'location.href="'.$link.'"\'>';
        //$html.= "a".mb_strlen($url);
        for($i=0,$cnt=mb_strlen($logo_str);$i<$cnt;$i++){
            
            $bg = 'background-color:'.(($logo_bgcolor[$i])?$logo_bgcolor[$i]:'black').';';
            $border = 'border:1px solid '.(($logo_border[$i])?$logo_border[$i]:'black').';';
            $col = 'color:'.(($logo_color[$i])?$logo_color[$i]:'white').';';
            $deg = ($logo_rotate[$i])?'-webkit-transform:rotate('.$logo_rotate[$i].'deg);':'';
            $cls = ($logo_class[$i])?'class="'.$logo_class[$i].'"':'';
            
            $html.= '<div '.$cls.'>'.mb_substr($logo_str,$i,1).'</div>';
            //$html.= '<div>'.$i.'</div>';
        }
        $html.= '<div style="clear:both;display:none;"></div>';
        $html.= '</div>';
        return $html;
    }
    
    //TOOLリストリンク
    function tool_list($uid){
        
        //ログイン時のみ有効
        //die(UID);
        if(!UID || UID=='UID'){return;}
        
        $folder = new FOLDER();
        $url = new URL();
        
        unset($tool,$html);
        
        $tool[0][nm] = "TOP";
        $tool[0][tool] = "";
        
        $tool_list = $folder->lists('tool');
        for($i=0,$c=count($tool_list);$i<$c;$i++){
            
            $num = count($tool);
            /*
            $main_file = 'tool/'.$tool_list[$i].'/index.php';
            //die($main_file);
            if(file_exists($main_file)){
                require_once $main_file;
                $tool_php = new TOOL();
                if($tool_php->type != 'service'){continue;}
            }
            */
            
            //type=service以外は対象外
            $config = $this->config2data($tool_list[$i]);
            //die("type:".$config['type']);
            if($config['type']!='service'){continue;}
            
            $tool[$num][nm] = ($config[name])?$config[name]:$tool_list[$i];
            $tool[$num][tool] = $tool_list[$i];
        }
        
        //表示
        for($i=0,$c=count($tool);$i<$c;$i++){
            if($tool[$i][tool]==$_REQUEST[tool]){
                $html[] = $tool[$i][nm];
            }
            else{
                $html[] = '<a href="'.$url->url().(($tool[$i][tool])?'?tool='.$tool[$i][tool]:'').'">'.$tool[$i][nm].'</a>';
            }
        }
        
        return join(' | ',$html);
    }
    
    //config.txtのデータを配列で返す
    function config2data($tool){
        $config_file = 'tool/'.$tool.'/cfg/config.txt';
        if(!file_exists($config_file)){return;}
        $data = file($config_file);
        unset($config);
        for($i=0,$c=count($data);$i<$c;$i++){
            $data[$i] = str_replace("\r",'',$data[$i]);
            $data[$i] = str_replace("\n",'',$data[$i]);
            if(!$data[$i]){continue;}
            $sp = explode('=',$data[$i]);
            $config[$sp[0]] = $sp[1];
        }
        return $config;
    }
    
    //ユーザー設定
    function account_set(){
        $tpl = new TEMPLATE();
        //登録情報入力ページの表示
        echo $tpl->read_tpl(SYS.'/tpl/account_set.html');
        exit;
    }
    
    //ユーザー情報読み込み
    function read_account($id){
        
        $str = new STRING();
        
        $uid = $str->enc_code($id);
        
        $GLOBALS[account][id] = $id;
        
        $file_data = $this->sys.$this->data;
        $file_pass = $this->sys.DAT;
        
        unset($account);
        
        //パスワード情報[UID,PWD,AUTH,  ,ymdhis]
        if(file_exists($file_pass)){
            $data = file($file_pass);
            //下の行から検索
            for($c=count($data),$i=$c-1;$i>=0;$i--){
                
                $sp = explode(",",$data[$i]);
                
                //IDマッチング確認
                if($sp[0]==$uid){
                    //pw確認
                    $GLOBALS[account][pw] = $str->dec_code($sp[1]);
                    
                    $GLOBALS[account][auth] = $sp[2];
                    break;
                }
            }
        }
        //ユーザー情報[ymdhis,UID,Name,Mail,...]
        if(file_exists($file_data)){
            $data = file($file_data);
            //下の行から検索
            for($c=count($data),$i=$c-1;$i>=0;$i--){
                
                $sp = explode(",",$data[$i]);
                
                //IDマッチング確認
                if($sp[1]==$uid){
                    //pw確認
                    $GLOBALS[account][nm] = $str->dec_code($sp[2]);
                    $GLOBALS[account][ml] = $str->dec_code($sp[3]);
                    break;
                }
            }
        }
        
        $account[id]   = $GLOBALS[account][id];
        $account[pw]   = $GLOBALS[account][pw];
        $account[auth] = $GLOBALS[account][auth];
        $account[nm]   = $GLOBALS[account][nm];
        $account[ml]   = $GLOBALS[account][ml];
        
        return $account;
        
    }
    
    //system-tool※テンプレート用
    function system_tools(){
        //die(AUTH);
        //if(true){return;}
        
        
    }
    
    //tool-configで指定されたGLOBALS[menu][**]をリンクリスト表示する
    // param  mode:null（画面ヘッダ下）
    // param  mode:left（画面左メニュー）
    function system_menu($mode=null){
        
        if(!$GLOBALS[config]){return;}
        
        $keys = array_keys($GLOBALS[config]);
        
        //return join(",",$keys);
        
        if(!count($keys)){return;}
        
        unset($menus);
        
        for($i=0,$c=count($keys);$i<$c;$i++){
            if(preg_match('/^menu\[(.*)\]$/',$keys[$i],$ret)){
                $menus[] = $ret[1];
            }
        }
        
        $url = new URL();
        
        $html='';
        for($i=0,$c=count($menus);$i<$c;$i++){
            
            $menu = '&menu='.$menus[$i];
            if($GLOBALS[config][default_menu]==$menus[$i]){
                $menu='';
            }
            
            $vals = explode(',',$GLOBALS[config]['menu['.$menus[$i].']']);
            
            if($_REQUEST[menu] == $menus[$i]){
                $html .= '<span href="'.$url->url.'?tool='.$_REQUEST[tool].$menu.'" class="menu_link" title="'.$vals[1].'">';
                $html .= $vals[0];
                $html .= '</span>';
            }
            else{
                $html .= '<a href="'.$url->url.'?tool='.$_REQUEST[tool].$menu.'" class="menu_link" title="'.$vals[1].'">';
                $html .= $vals[0];
                $html .= '</a>';
            }
                
        }
        return $html;
    }
    
}



