/**
 * Constantes para facilitar el uso de funciones
 */
const API_KEY = "?api_key=6c214eacc098404fa7eea530184eead5&language=es";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR = BASE_URL + "/trending/all/day"+API_KEY;
const TOP10 = BASE_URL + "/trending/all/week"+API_KEY;
const MOVIES = BASE_URL + "/movie/popular"+API_KEY;
const TV = BASE_URL + "/tv/popular"+API_KEY;
const RECOMENDATION = BASE_URL + "/trending/all/week"+API_KEY+"&page=2";

const IMG_URL_S = "http://image.tmdb.org/t/p/w154";
const IMG_URL_M = "http://image.tmdb.org/t/p/w780";
const IMG_URL_L = "http://image.tmdb.org/t/p/w1280";

const URLS = [POPULAR,TOP10,MOVIES,TV,RECOMENDATION];

getCarouseles(URLS);

/*  
* - Recorremos las URLS con map(foreach) que pasamos por parametro a fetch 
* - Fetch devuelve una promesa que pasamos por parametro como un objeto response
* - En el primer then recorremos todos los objetos responses para despues retornar el cuerpo de cada uno de ellos como un JSON. .map es como un for, recorremos el array de objetos response
* - En el segundo then pasa por parametro un array data que contendra todos los json
*/

function getCarouseles(urls){

    Promise.all(urls.map(url=>fetch(url)))
    .then( responses => {
        return Promise.all(responses.map(response => {
            return response.json();
        }));
    })
    .then(data => {
        console.log(data);
        showCarouseles(data);
    })
    .catch(error=> {
        console.log(error);
    });
}



function showCarouseles(data){

    getPortada(data)

    let vistos = localStorage.getItem("id")
    
    if(vistos!=null){
        document.querySelector(".show").style.display = "block";
        let vistosSplit = vistos.substring(9,1000000000).split(",")
        let vistosSort = vistosSplit.sort();
        for(i =0 ; i<data.length; i++){
            checkVistos(data[i],vistosSort)
        }
    }
    

    
    /*
    * TOP 10 TENDENCIAS SEMANALES Y RECOMENDACIONES
    */
    for(i =1 ; i<=10; i++){
        document.getElementById("carousel-tendencia").innerHTML += " <div class='top'><div class='num-video'><p class='top-num'>"+i+"</p><a onclick='data("+data[1].results[i].id+")' href='ficha.html?type="+data[1].results[i].media_type+"&id="+data[1].results[i].id+"'><img src='"+IMG_URL_M+data[1].results[i].poster_path+"' alt='Imagen portada'></a></div></div>";             
        document.getElementById("carousel-recomendaciones").innerHTML += " <div class='recomendacion'><a onclick='data("+data[4].results[i].id+")' href='ficha.html?type="+data[4].results[i].media_type+"&id="+data[4].results[i].id+"'><img src='"+IMG_URL_M+data[4].results[i].poster_path+"' alt='Imagen portada'></a></div>";             
    }

    /*
    * PELICULAS Y SERIES POPULARES
    * Contendran siempre el mismo numero de peliculas y series. (URL)Page = 1
    */
    for(i =0 ; i<=data[2].results.length-1; i++){
        document.getElementById("carousel-peliculas-populares").innerHTML += " <div class='pelicula'><a onclick='data("+data[2].results[i].id+")' href='ficha.html?type=movie&id="+data[2].results[i].id+"'><img src='"+IMG_URL_M+data[2].results[i].poster_path+"' alt='Imagen portada'></a></div>";             
        document.getElementById("carousel-series-populares").innerHTML += " <div class='serie'><a onclick='data("+data[3].results[i].id+")' href='ficha.html?type=tv&id="+data[3].results[i].id+"'><img src='"+IMG_URL_M+data[3].results[i].poster_path+"' alt='Imagen portada'></a></div>";             
    }

    
}

/**
 * Esta funcion se a realizado de esta manera por los problemas presentados:
 * 1º Al dar click a la pelicula nos redirige a otro html y al volver a index.html si tuvieramos una variable inicializada se volveria a inicializar, por eso he intentado no inicializar nada
 * 2º El primer click como el localstorage.id no tiene nada, nos aparece undefined y luego seguidamente el id (esto se arregla inicializando la variable, pero como hemos dicho arriba no podemos utilizando este metodo), eso lo solucionamos en la funcion () que eliminamos ese registro "undefined"
 * 3º Esta funcion la ejecuta el atributo onclick, a esta funcion se le pasa el id por parametro (lo hice asi porque asi directamente le paso el id desde la llamada a la url)
 * @param {*} id 
 */
function data(id){
    localStorage.setItem("id", localStorage.id += id+"," )
    
}


function getPortada(data){
    /*
    * TENDENCIAS POPULARES HOY
    */  
    let arrayMovies = [];
    for(i =0 ; i<data[0].results.length; i++){
        document.getElementById("carousel-popular").innerHTML += "<div class='popular'><a onclick='data("+data[0].results[i].id+")' href='ficha.html?type="+data[0].results[i].media_type+"&id="+data[0].results[i].id+"'><img src='"+IMG_URL_M+data[0].results[i].poster_path+"' alt='Imagen portada'></a></div>";
        arrayMovies[i] = data[0].results[i].id;
    }

    //Generamos un numero aleatorio para sacar una pelicula aleatoria
    const aleatorio = Math.floor(Math.random() * arrayMovies.length)
    let portada = document.querySelector(".portada")
    portada.setAttribute("id", data[0].results[aleatorio].id)
    document.getElementById("play").setAttribute("onclick","data("+data[0].results[aleatorio].id+")");
    document.getElementById("play").addEventListener("click", () => play(data[0].results[aleatorio].media_type,data[0].results[aleatorio].id))  
    portada.style.backgroundImage = "url("+IMG_URL_L+data[0].results[aleatorio].backdrop_path+")";
    
    //Añadimos tipo de video si es pelicula o serie
    if(data[0].results[aleatorio].media_type === "movie"){
        document.querySelector(".tipo-video").innerHTML = "PELICULA";
    }else{
        document.querySelector(".tipo-video").innerHTML = "SERIE";
    }
    
    //Añadimos Titulo de la pelicula o serie
    if(data[0].results[aleatorio].original_title){
        document.querySelector(".titulo").innerHTML=data[0].results[aleatorio].original_title;
    }else{
        document.querySelector(".titulo").innerHTML=data[0].results[aleatorio].name;
    }
    
    //Añadimos sipnosis de pelicula o serie
    document.querySelector(".descripcion").innerHTML=data[0].results[aleatorio].overview.substr(0,300) + "...";

    //Añadimos votos, valoracion
    let votos = data[0].results[aleatorio].vote_average;
    if(votos >= 7){
        document.getElementById("star").style.color = "#16CA13";
    }else if(votos < 7 && votos >= 4){
        document.getElementById("star").style.color = "#CAC313";
    }else if(votos < 4){
        document.getElementById("star").style.color = "#CA1313";
    }
    document.getElementById("valorado").innerHTML=Math.round(votos)+"/10"

    

}

function checkVistos(data,vistos){
    //Añadimos los videos que hemos visto recientemente, con localstorage podremos tenerlos siempre que entremos en nuestro navegador
    for(let j=0 ; j<data.results.length; j++){
    //Eliminamos los ids repetidos y los que estan vacios
        for(let i=0; i<vistos.length; i++){
            if(vistos[i] === ""){vistos.splice(i,1)}
            if(vistos[i+1] === vistos[i]){vistos.splice(i,1)}
            if(data.results[j].id == vistos[i]){
                document.getElementById("carousel-vistas").innerHTML += "<div class='visto'><span></span><a href='ficha.html?type="+data.results[j].media_type+"&id="+vistos[i]+"'><img src='"+IMG_URL_M+data.results[j].poster_path+"' alt='Imagen portada'></a></div>";
                vistos.splice(i,1)
                
            }
            
        }
    
    }
      
}
    



function play(media,id){

    location.href="ficha.html?type="+media+"&id="+id;
}
    
    
    /*let tagA = [...videos]
    for(let i=0;i<tagA.length;i++){
        tagA[i].addEventListener("click", function(){
            alert("aqui")
            let id = tagA[i].getAttributeNode("id").value
            
        })
        

    }
    
    let Anchors = document.getElementsByTagName("a");
    for (let i = 0; i < Anchors.length ; i++) {
    Anchors[i].addEventListener("click", function (event) {
            event.preventDefault();
            alert("aolg")
        },false);
    }*/


//////////////////////////////////////////////////////////////////////////////////////////////////////*
/*

function generarTrailers(idPelicula){
    fetch(`https://api.themoviedb.org/3/movie/${idPelicula}/videos?api_key=6c214eacc098404fa7eea530184eead5&language=es`)

    .then((response) => response.json())
    .then(data => {
        console.log(idPelicula)
        if (typeof(data.results[0]) !== 'undefined') {
            document.getElementById("trailer").setAttribute("src","https://www.youtube.com/embed/"+data.results[0].key+"?autoplay=1&controls=0&modestbraning=1&loop=1&showinfo=1")
            
        }else{
            let aleatorio2 = arrayPeliculas[Math.floor(Math.random() * arrayPeliculas.length)];
            console.log("id pelicula aleatorio: "+aleatorio2)
            generarTrailers(aleatorio2);
        }
        
        
    })


    .catch()
}

function existVideos(id,type){
    let url = "";

    if(type === "movie"){
        url = BASE_URL +"/movie/"+id+"?"+API_KEY+"&append_to_response=videos,images";
    }else{
        url = BASE_URL +"/tv/"+id+"?"+API_KEY+"&append_to_response=videos,images";
    }
    

    fetch(url)
    .then( response => response.json())
    .then(data => {

        console.log(data)
    })
    .catch(error=> {
        console.log(error);
    });


}*/