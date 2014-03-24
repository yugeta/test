PickMark

【概要】
    写真をブックマークしておくサイト
    
    ユーザー同士で共有可能。
    家族や親戚などでの共有に便利。
    家族写真のなどの一括管理用
    参考は、macのiPhoto
    
    URL to URLの登録も可能
    
【データ仕様】
    
    基本ディレクトリ
        data/picmark/*user*/
    
    写真データ※撮影日
        *DIR*/pic/yyyymmdd/
        ファイル名規則：元ファイル（同一がある場合は、通し番号付与）
    
    サムネイル※写真データと同一ファイル名
        *DIR*/thumb/---
        
    各種データ
        ・元データファイル名
        ・撮影日
        ・GPS
        ・サイズ
        ・タグ


//test
http://192.168.1.15/codiad/workspace/labo/design/action=

【apache、phpの設定について】

    ファイルアップロード時に以下の制限があるため、デフォルト値を変更する場合は
    設定変更の必要がある。
    
    #メモリ値を上限させる
    php_value memory_limit 1G
    
    #post送信時の最大サイズを変更する
    php_value post_max_size 12G
    
    #type=fileでの最大ファイルサイズを変更する
    php_value upload_max_filesize 10G
    
    #preg_matchに影響します。
    php_value pcre.backtrack_limit 500000
    php_value pcre.recursion_limit 500000
    
    #type=fileでの最大ファイルサイズを変更する
    php_value max_file_uploads 1000
    
    #サーバーからの返り値時間を変更する。
    php_value max_execution_time 1000

【搭載予定】
・画像検索機能（マップ、その他）
・マップ配置機能
・☆マーク機能
・メモ機能
・タイトル機能（画像に対して）
・タグ機能（タグクラウド）



