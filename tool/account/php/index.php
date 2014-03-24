<?

class index{
    
    //起動処理
    function start(){
        
        $index = new index();
        
        if($_REQUEST[action]=='write'){
            $index->write();
        }
        else{
            return $index->view(UID);
        }
        
    }
    
    //登録画面表示
    function view($uid){
        //ライブラリ
        $tpl = new TEMPLATE();
        $sys = new SYS();
        
        //初期設定
        $sys->read_account(UID);
        
        //既存データ取得
        return $tpl->read_tpl('tool/'.$_REQUEST[tool].'/tpl/set.html');
    }
    
    //データ書き込み
    function write(){
        $uid = UID;
        $ymd = date(YmdHis);
        $sys = new SYS();
        
        //既存データの読み込み
        $account = $sys->read_account(UID);
        
        
        
        //die($account[pw]."/".$_POST[pw]);
        //$pass = $sys->sys.$sys->pass;
        if($account[pw]!=$_POST[pw]||$account[auth]!=$_POST[auth]){
            $sys->passwd_write($ymd);
        }
        
        
        //$data = $sys->sys.$sys->data;
        if($account[nm]!=$_POST[nm]||$account[ml]!=$_POST[ml]){
            $sys->user_data_write($ymd);
        }
        
        
        //リダイレクト
        $url = new URL();
        $url->move($url->url.'?tool='.$_REQUEST[tool]);
        
    }
    
    
    
}