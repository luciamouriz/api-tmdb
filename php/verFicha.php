<?php

define('IMG_URL_S', 'http://image.tmdb.org/t/p/w154');
define('IMG_URL_M', 'http://image.tmdb.org/t/p/w780');
define('IMG_URL_L', 'http://image.tmdb.org/t/p/w1280');

if(isset($_GET["id"])){

    $id = $_GET["id"];

    //@ Para que no salga el error de file_get_contents
    $movies = @file_get_contents("https://api.themoviedb.org/3/movie/$id?api_key=6c214eacc098404fa7eea530184eead5&language=es&append_to_response=videos,images",true);
    $tv = @file_get_contents("https://api.themoviedb.org/3/tv/$id?api_key=6c214eacc098404fa7eea530184eead5&language=es&append_to_response=videos,images",true);
    
    if($tv){
        
        $json = json_decode($tv);
        
        /*Pasamos por sesiones la informacion
        / Trim, quita las comillas que JSON nos deja cuando lo obtenemos
        / JSON_UNESCAPED_UNICODE hace que codifique caracteres especiales como tildes, eñes
        */
       
        $overview = trim(json_encode($json->overview,JSON_UNESCAPED_UNICODE),'"');
        $title = trim(json_encode($json->name,JSON_UNESCAPED_UNICODE), '"');
        $genre = trim(json_encode($json->genres[0]->name,JSON_UNESCAPED_UNICODE), '"');
        $date = trim(json_encode($json->first_air_date,JSON_UNESCAPED_UNICODE), '"');
        $time = trim(json_encode($json->episode_run_time,JSON_UNESCAPED_UNICODE), '"');
        
    
    }else{

        $json = json_decode($movies);

        $overview = trim(json_encode($json->overview,JSON_UNESCAPED_UNICODE),'"');
        $title = trim(json_encode($json->title,JSON_UNESCAPED_UNICODE), '"');
        $genre = trim(json_encode($json->genres[0]->name,JSON_UNESCAPED_UNICODE), '"');
        $date = trim(json_encode($json->release_date,JSON_UNESCAPED_UNICODE), '"');
        $time = trim(json_encode($json->runtime,JSON_UNESCAPED_UNICODE), '"');
    }

   
  
}



/**
 * Obtendremos el reparto de la pelicula o serie que seleccionemos
 */
function getCredits($id){
    
    if(@file_get_contents("https://api.themoviedb.org/3/movie/$id/credits?api_key=6c214eacc098404fa7eea530184eead5&language=es",true)){
        $reparto = @file_get_contents("https://api.themoviedb.org/3/movie/$id/credits?api_key=6c214eacc098404fa7eea530184eead5&language=es",true);
    }else{
        $reparto = @file_get_contents("https://api.themoviedb.org/3/tv/$id/credits?api_key=6c214eacc098404fa7eea530184eead5&language=es",true);
    }
    if($reparto){ 
        $json = json_decode($reparto);

        for($i=0;$i<count($json->cast);$i++){
            $actor = trim(json_encode($json->cast[$i]->name,JSON_UNESCAPED_UNICODE),'"');
            $photo = trim(json_encode($json->cast[$i]->profile_path,JSON_UNESCAPED_UNICODE),'"');
            $depart = trim(json_encode($json->cast[$i]->known_for_department,JSON_UNESCAPED_UNICODE),'"');
            $character = trim(json_encode($json->cast[$i]->character,JSON_UNESCAPED_UNICODE),'"');
            $depart = strtoupper($depart);

            //Si la foto no se encuentra no se pondra
            if($photo != "null"){
                echo <<< LS
                
                <div class="reparto">
                    <p class="depart">$depart</p>
                    <img src="http://image.tmdb.org/t/p/w154$photo" alt="Foto de reparto">
                    <p>$actor</p>
                    <p>$character</p>
                </div>
                LS;
            }
            
        }
            
        
       
        
    }
}

/**
 * Obtenemos el video si existe y si no pondremos una imagen de portada
 */
function getVideo($json){
    if($json->videos->results){
        for($i=0;$i<count($json->videos->results);$i++){
            if($json->videos->results[$i]->key){
                $j=$i;
            }
            
        }

        $idvideo = trim(json_encode($json->videos->results[$j]->key,JSON_UNESCAPED_UNICODE), '"');
        echo '<iframe width="100%" height="515" src="https://www.youtube.com/embed/'.$idvideo.'?autoplay=1&controls=0&modestbraning=1&loop=1&showinfo=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                
    }else{
        $rutaIMG = trim(json_encode($json->backdrop_path,JSON_UNESCAPED_UNICODE), '"');
        echo "<img src=".IMG_URL_L."$rutaIMG class='proximamente'>";
    }
}


function getSimilar($id){

   if(@file_get_contents("https://api.themoviedb.org/3/tv/$id/similar?api_key=6c214eacc098404fa7eea530184eead5&language=es",true)){
        $similar = @file_get_contents("https://api.themoviedb.org/3/tv/$id/similar?api_key=6c214eacc098404fa7eea530184eead5&language=es",true);
        
    }else{
        $similar = @file_get_contents("https://api.themoviedb.org/3/movie/$id/similar?api_key=6c214eacc098404fa7eea530184eead5&language=es",true);
        
    }

    if($similar){ 
        $json = json_decode($similar);

        for($i=0;$i<count($json->results);$i++){
                $poster = trim(json_encode($json->results[$i]->backdrop_path,JSON_UNESCAPED_UNICODE),'"');
                
                if(@gettype($json->results[$i]->name) != 'NULL'){
                    $title = trim(json_encode($json->results[$i]->name,JSON_UNESCAPED_UNICODE),'"');
                }else{
                    $title = trim(json_encode($json->results[$i]->title,JSON_UNESCAPED_UNICODE),'"');
                }
                //Si la foto no se encuentra no se pondra
                if($poster != "null"){
                    echo <<< LS

                    <div class="similar">
                        <p class="title-similar">$title</p>
                        <a href="#"><img src="http://image.tmdb.org/t/p/w780$poster" alt="Similares"></a>
                        
                    </div>
                    LS;
                }
                
            }
       
        
        }

}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../fonts/stylefonts.css">
    <title>Ver | <?php echo $title?></title>
</head>
<body>
    <header>
        <nav>
            <img class="logo" src="../img/logo.png" alt="logo Zine">
            <div class="menu">
                <div>INICIO</div>
                <div>PELICULAS</div>
                <div>SERIES TV</div>
                <div><input type="text" name="buscar" class="buscar" placeholder="BUSCAR"></div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="34" height="34" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="10" cy="10" r="7" />
                        <line x1="21" y1="21" x2="15" y2="15" />
                    </svg>
                </div>
            </div>
        </nav>
    </header>
    <main class="main-ficha">
        <div class="contenedor-ficha">
            <p class="back-arrow"><a href="../index.html">&#129092;</a></p>
            <div class="ficha">
                <?php getVideo($json);?>
                <p class="title-ficha"><?php echo $title; ?></p>
                <p><?php  echo substr($date,0,4)." ".$time[0]."h ".substr($time,1,2)."m  ".$genre; ?></p>
                <hr>
                <p><?php echo  $overview?></p>
                <hr>
                <div class="contenedor-reparto">
                    <p class="titulo-popular">Reparto principal</p>
                    <button role="button" id="flecha-izquierda" class="flecha-izquierda">&#10094;</button>
                    <button role="button" id="flecha-derecha" class="flecha-derecha">&#10095;</button>
                    <div class="contenedor-carousel-reparto">
                        <div id="carousel-reparto" class="carousel-reparto"><?php getCredits($id); ?></div>
                    </div>
                </div>

                <div class="contenedor-similar">
                    <p class="titulo-popular">Similar a lo que estas viendo</p>
                    <button role="button" id="flecha-izquierda" class="flecha-izquierda">&#10094;</button>
                    <button role="button" id="flecha-derecha" class="flecha-derecha">&#10095;</button>
                    <div class="contenedor-carousel-similar">
                        <div id="carousel-similar" class="carousel-similar"><?php getSimilar($id); ?></div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <footer>
        <div class="info-footer">
            <div class="rrss-footer">
                <h2>Siguenos</h2>
                <img  src="../img/redesSociales.png">
            </div>
            <div class="conocenos">
                <h2>Conocenos</h2>
                <p><a href="#">Trabaja con nosotros</a></p>
                <p><a href="#">Contactanos</a></p>
            </div>
            <div class="condiciones">
                <h2>Condiciones</h2>
                <p><a href="#">Privacidad</a></p>
                <p><a href="#">Términos de uso</a></p>
                <p><a href="#">Avisos legales</a></p>
            </div>
            <div class="ayuda">
                <h2>¿Necesitas ayuda?</h2>
                <p><a href="#">Cuenta</a></p>
                <p><a href="#">Centro de ayuda</a></p>
                <p><a href="#">Canjea Tarjeta Regalo</a></p>
                <p><a href="#">Preguntas frecuentes</a></p>
            </div>
        </div>
        <div class="lineas">
            <span></span>
            <img class="logo-footer" src="../img/ZINE.png" alt="Logo Zine">
            <span></span>
            <p class="copy">Copyright &copy; 2022 Zine - Todos los derechos reservados. Número de registro: 000000-000.</p>
        </div>
    </footer>
    <script src="../js/carrouseles.js"></script>
</body>
</html>