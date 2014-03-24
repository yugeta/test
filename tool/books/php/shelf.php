<?
/**
shelf view

- summary -
This system is the shelf views.

**/

class TOOL_SHELF{
    
    //public $root = '/var/www/books/';
    
    function folder_link($path){
        
        $folder = new FOLDER();
        $url    = new URL();
        //$thumb  = new THUMBNAIL();
        $image  = new IMAGE();
        
        $lists = $folder->lists(TOOL_DIR.$path);
        
        unset($html);
        
        $ptn[0] = '/\((.+)\)/';
        $ptn[1] = '/\[(.+)\]/';
        $ptn[2] = '/【(.+)】/';
        
        for($i=0,$c=count($lists);$i<$c;$i++){
            
            //system file is expect.
            if(preg_match('/^\./',$lists[$i])){continue;}
            
            // thumbnail is expect.
            if(preg_match('/'.$image->thumb_ext.'$/',$lists[$i])){continue;}
            
            //book name
            unset($book_name);
            $sp = explode('.',$lists[$i]);
            $ext = array_pop($sp);
            $etx = strtolower($ext);
            
            if($ext=='pdf' || $ext=='zip' || $ext=='rar' || $ext=='lzh'){
                $book_name = join('.',$sp);
            }
            else{
                $book_name = $lists[$i];
            }
            
            $book_name = preg_replace($ptn,'',$book_name);
            $book_name = trim($book_name);
            
            //dir
            if(is_dir(TOOL_DIR.$path.$lists[$i])){
                
                $h = '<div class="book_folder">';
                $h.= '<a href="'.$url->url().'?tool='.$_REQUEST[tool].'&path='.$path.$lists[$i].'/">';
                $h.= '<img src="'.SYS.'img/128/blank_map.png">';
                $h.= $book_name;
                $h.= '</a>';
                $h.= '</div>';
                
                $html[]= $h;
            }
            
            //file
            else{
                //$thumb = $thumb->file2thumb($path.$lists[$i]);
                $book_name2 = preg_replace('/^(.+) (第?)([0-9]+)(巻?)$/','$2$3$4',$book_name);
                $book_name  = ($book_name2)?$book_name2:$book_name;
                $thumb      = THUMB_DIR.$image->file_name2thumb_name($path.$lists[$i]).'?'.date(YmdHis);
                //$thumb      = TOOL_DIR.$image->file_name2thumb_name($path.$lists[$i]).'?'.date(YmdHis);
                $link       = TOOL_DIR.$path.$lists[$i];
                $dammy      = SYS.'img/128/book.png';
                
                $h = '<div dara-href="'.$path.$lists[$i].'" class="book_file" onclick="window.open(\''.$url->url().'?tool='.$_REQUEST[tool].'&menu=book_read&path='.$path.$lists[$i].'\')">';
                $h.= '<img src="'.SYS.'img/anim/loading_35.gif" data-thumb="'.$thumb.'" data-link="'.$link.'" data-dammy="'.$dammy.'" title="'.$link.'">';
                $h.= '<br>'.$book_name;
                $h.= '</div>';
                
                $html[]= $h;
                
            }
            
            
        }
        
        $html[]= '<div style="clear:both;"></div>';
        
        return join('',$html);
    }
    
    // up-folder-link
    function breadcrumb_list($path){
        
        $url = new URL();
        
        if(!$path){return;}
        
        $path = str_replace(TOOL_DIR,'',$path);
        
        $paths = explode('/',$path);
        
        
        unset($html,$new_path);
        
        $html[] = '<a href="'.$url->url().'?tool='.$_REQUEST[tool].'">TOP</a>';
        
        
        for($i=0,$c=count($paths);$i<$c;$i++){
            
            if(!$paths[$i]){continue;}
            
            $new_path .= $paths[$i]."/";
            if($i==$c-2){
                $html[] = '<span class="file_title">'.$paths[$i].'</span>';
            }
            else{
                $html[] = '<a href="'.$url->url().'?tool='.$_REQUEST[tool].'&path='.$new_path.'">'.$paths[$i].'</a>';
            }
        }
        
        return join(' <span class="breadcrumb_arrow">&gt;</span> ',$html);
    }
    
    /*
    function file2thumb($file){
        
        $thumb = new THUMBNAIL();
        
        $sp = explode('.',$file);
        $ext = array_pop($sp);
        
        return join(',',$sp).$thumb->thumb_ext;;
        
    }
    */
    
    function test(){return;
        $path = '/var/www/books/001.漫画/一般コミック/あ/あ/[ちばてつや] あした天気になあれ/';
        $file = 'あした天気になあれ 第01巻.pdf';
        $book = $path.$file;
        
        
        
        /*
        $im = new imagick( $book.'[0]' ); 
        //jpg出力
        // convert to jpg 
        $im->setImageColorspace(255); 
        $im->setCompression(Imagick::COMPRESSION_JPEG); 
        $im->setCompressionQuality(60); 
        $im->setImageFormat('jpeg');
        
        //resize 
        $im->resizeImage(290, 375, imagick::FILTER_LANCZOS, 1);  
        
        //write image on server 
        $im->writeImage('thumb.jpg'); 
        $im->clear(); 
        $im->destroy(); 
        */
        /*
        $image = new Imagick();
        $image->setResolution(300, 300);
        $image->readImageBlob($book);
        // convert the output to JPEG
        $image->setImageFormat('jpeg');
        $image->setImageCompressionQuality(90);
        */
        
        $image = new Imagick();
        $image->readImage($book.'[2]');
        $image->setImageFormat("png");
        //header("Content-type: image/png");
        echo $image->getImageBlob();
        //exit;
        
        /*
        // create new imagick object from image.jpg
        $im = new Imagick( "image.jpg" );
        
        // change format to png
        $im->setImageFormat( "png" );
        
        // output the image to the browser as a png
        header( "Content-Type: image/png" );
        echo $im;
        
        // or you could output the image to a file:
        //$im->writeImage( "image.png" );
        */
    }
    
    //起動処理
    function index(){return;
        
        /*
        //image_magic version
        exec('/usr/bin/convert -version', $output);
        $im = join(",",$output);
        return $im;
        */
        
        /*
        //$tpl = new TEMPLATE();
        
        $sys = new SYS();
        $config = $sys->config2data($_REQUEST[tool]);
        
        $html = '--<br>';
        
        $html.= $config[name]."<br>";
        $html.= $config[name_class]."<br>";
        $html.= $config[type]."<br>";
        
        return $html;
        
        //$GLOBALS[tool][html]="picmark";
        
        //echo $tpl->read_tpl(SYS.'/tpl/frame.html');
        */
        
        //$path = '/var/www/books/001.漫画/一般コミック/あ/あ/[手塚治虫] アドルフに告ぐ/';
        $path = '/var/www/books/001.漫画/一般コミック/あ/あ/[ちばてつや] あした天気になあれ/';
        $file = 'あした天気になあれ 第01巻.pdf';
        $book = $path.$file;
        
        $img = new Imagick($book);
        
        $img->setResolution(200,200);
        $img->readImage("{$pdf_file}[0]");
        $img->scaleImage(800,0);
        
        //set new format
        $img->setImageFormat('jpg');
        
        // -flatten option, this is necessary for images with transparency, it will produce white background for transparent regions
        $img = $img->flattenImages();
        
        //$img->setImageIndex(0);
        //$img->writeImage('out.png');
        //$img->writeImages('out.png');とすると全ページを画像にしてくれる
        
        header("Content-type: image/".$img->getImageFormat()); 
        echo $img;
        
        $img->destroy();
        /*
        $im = new Imagick();
        //$img = new Imagick();
        $im->setResolution( 300, 300 ); 
        $im->readImage( $book );
        */
        /*
        // Output the image
        $output = $im->getimageblob();
        $outputtype = $im->getFormat();
        
        header("Content-type: $outputtype");
        echo $output;
        
        exit;
        */
        /*
        $folder = new FOLDER();
        $books = $folder->lists($path);
        
        $html ='';
        for($i=0,$c=count($books);$i<$c;$i++){
            $html.= $books[$i].'<br>';
        }
        
        return $html;
        */
        //echo $tpl->read_tpl(SYS.'/tpl/frame.html');
        
    }
    
    
    function total_file_count($path){
        
        $count=0;
        
        $folder = new FOLDER();
        
        $lists = $folder->lists(TOOL_DIR.$path);
        
        for($i=0,$c=count($lists);$i<$c;$i++){
            
            //dir
            if(is_dir(TOOL_DIR.$path.$lists[$i])){
                $count += $this->total_file_count($path.$lists[$i].'/');
            }
            
            //file
            else if(file_exists(TOOL_DIR.$path.$lists[$i])){
                $sp = explode('.',$lists[$i]);
                $ext = array_pop($sp);
                $ext = strtolower($ext);
                
                if($ext=='pdf' || $ext=='zip' || $ext=='rar'){
                    $count++;
                }
                
            }
            
        }
        
        return $count;
    }
    function total_file_count_numberformat($path){
        return number_format($this->total_file_count($path));
    }
    
    
    function make_thumb($file_name,$thumb_file){
        
        $image = new IMAGE();
        
        $sp = explode('.',$file_name);
        $ext = array_pop($sp);
        $ext = strtolower($ext);
        
        if($ext=='pdf'){
            $flg = $image->pdf2thumb($file_name,$thumb_file);
        }
        else if($ext=='zip'){
            $flg = $image->zip2thumb($file_name,$thumb_file);
        }
        else if($ext=='rar'){
            $flg = $image->rar2thumb($file_name,$thumb_file);
        }
        else{
            $flg = '';
        }
        
        return $flg;
    }
    
    //book reader folder name return.
    function book_read_folder($book){
        $conv1 = array('/',' ',"[","]","(",")");
        $conv2 = array('_','_',"_","_","_","_");
        return 'data/.tmp/'.UID.'/'.str_replace($conv1,$conv2,$book);
    }
    
    function book_read_page($book){
        
        
        $path = TOOL_DIR.$book;
        //$page = ($page)?$page:0;
        
        $sp = explode('.',$book);
        $ext = array_pop($sp);
        $ext = strtolower($ext);
        
        //tmp
        $tmp = $this->book_read_folder($book);
        
        //return $ext;
        //return $tmp;
        //return $book;
        //return file_exists($path).":".$path;
        
        //empty check
        if(is_dir($tmp)){
            $inner = scandir($tmp);
            if(!count($inner)){
                return "alert(12345)";
                exec('rm -rf '.$tmp);
            }
        }
        
        if(!is_dir($tmp)){
            
            
            mkdir($tmp,0777,true);
            
            $conv1 = array(" ","(",")","[","]");
            $conv2 = array("\ ","\(","\)","\[","\]");
            
            if($ext=='pdf'){
                
                $im = new Imagick();
                //画像を生成したいPDFを読み込む
                //$im->readImage(str_replace($conv1,$conv2,$path));
                $im->readImage($path);
                
                //return $path."<br>".$im->getImageScene();
                
                for($i=0,$c=$im->getImageScene();$i<=$c;$i++){
                    //PDFのページ
                    $im->setImageIndex($i);
                    //$im->setImageFormat('jpg');
                    //サムネイルサイズ 640pxに収める
                    //$im->thumbnailImage(640, 640, true);
                    //シャープ
                    //$im->sharpenImage(0, 1);
                    //生成
                    $im->writeImage($tmp.'/'.sprintf('%04d',$i).'.jpg');
                }
                
                $im->destroy();
                
                // get image size
                //$size = $im->getImageGeometry();
                /*
                // get image format.
                $outputtype = $im->getFormat();
                
                //表示
                header("Content-type: $outputtype");
                echo $im->getimageblob();
                */
                
            }
            else if($ext=='zip'){
                $cmd = 'unzip -d '.$tmp.' -jo '.str_replace($conv1,$conv2,$path);
                $res = `$cmd`;
            }
            else if($ext=='rar'){
                $cmd = 'unrar e -o- '.str_replace($conv1,$conv2,$path).' '.$tmp;
                $res = `$cmd`;
            }
        }
        
        //syslog
        file_put_contents($tmp.'.txt', date(YmdHis).",\n", FILE_APPEND);
        
        
        // return json-data
        $lists = scandir($tmp);
        
        $c1 = array('#'  ,'');
        $c2 = array('%23','');
        
        unset($list2,$json);
        for($i=0,$c=count($lists);$i<$c;$i++){
            if($lists[$i]=='.'||$lists[$i]=='..'){continue;}
            if(!preg_match('/\.jpg$/i',$lists[$i])){continue;}
            
            $list2[] = '"'.str_replace($c1,$c2,$lists[$i]).'"';
        }
        
        $json.= '{';
        $json.= 'update:"'.date("YmdHis",filemtime($tmp)).'",';
        $json.= 'dir:"'.$tmp.'",';
        $json.= 'files:'.'['.join(',',$list2).']';
        $json.= '}';
        
        
        return $json;
    }
    
}