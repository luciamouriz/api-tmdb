/**
 * Constantes para facilitar el uso de funciones
 */
const API_KEY = "?api_key=6c214eacc098404fa7eea530184eead5";
const BASE_URL = "https://api.themoviedb.org/3";


const IMG_URL_S = "http://image.tmdb.org/t/p/w154";
const IMG_URL_M = "http://image.tmdb.org/t/p/w780";
const IMG_URL_L = "http://image.tmdb.org/t/p/w1280";

//Cogemos el id y el tipo de la URL
const urlParams = new URLSearchParams(window.location.search); 
const id = urlParams.get('id');
const type = urlParams.get('type');

//URLS peliculas y serie
const MOVIE = BASE_URL + "/movie/"+id+API_KEY+"&language=es&append_to_response=videos,images";
const TV = BASE_URL + "/tv/"+id+API_KEY+"&language=es&append_to_response=videos,images";

//URLS reparto de peliculas y series
const TV_CRE = BASE_URL + "/tv/"+id+"/credits"+API_KEY+"&language=es&append_to_response=videos,images";
const MOVIE_CRE = BASE_URL + "/movie/"+id+"/credits"+API_KEY+"&language=es&append_to_response=videos,images";

//URLS videos similares de peliculas y series
const TV_SIM = BASE_URL + "/tv/"+id+"/similar"+API_KEY+"&language=es&append_to_response=videos,images";
const MOVIE_SIM = BASE_URL + "/movie/"+id+"/similar"+API_KEY+"&language=es&append_to_response=videos,images";


getFicha()



/**
 * Funcion indica si es una pelicula o serie
 * @param {*} urlmovie 
 * @param {*} urltv 
 * @returns 
 */
function isMovieOrTv(urlmovie,urltv){
    if(type==="movie"){
        return urlmovie;
    }else{
        return urltv;
    }

}

/**
 * Funcion imprime la ficha de la pelicula o serie
 */
function getFicha(){

    fetch(isMovieOrTv(MOVIE,TV))
    .then(response => response.json())
    .then(data =>{

        if(type==="movie"){

            document.getElementById("genero").innerHTML += "Pelicula";
            document.getElementById("title-ficha").innerHTML += data.title;
            window.document.title += "Ver | "+data.title;
            document.getElementById("info").innerHTML += data.release_date.substring(0, 4) +" "+ data.runtime.toString().substring(0, 1) +"h "+data.runtime.toString().substring(1, 3)+"m  <i>"+ data.genres[0].name+"</i>";
            document.getElementById("sinopsis").innerHTML += data.overview;
                    
            
        }else{

            document.getElementById("genero").innerHTML += "Serie";
            document.getElementById("title-ficha").innerHTML += data.name;
            window.document.title += "Ver | "+data.name;
            document.getElementById("info").innerHTML += data.first_air_date.substring(0, 4) +" "+ data.episode_run_time.toString().substring(0, 1) +"h <i>"+ data.genres[0].name+"</i>";
            document.getElementById("sinopsis").innerHTML += data.overview;

            //Temporadas de la serie
            for(let i=0;i<data.seasons.length;i++){
                document.getElementById("contenedor-cajas-seasons").innerHTML += `<div class="season" id="${data.seasons[i].season_number}"><p id="title-season">${data.seasons[i].name}</p></div><div id="data-${data.seasons[i].season_number}"></div>`;
            }


            const season = document.querySelectorAll(".season")
            season.forEach((season) => {
                season.addEventListener('click', () => {

                    const cajaEpisodes = document.querySelector(".contenedor-episodes")
                    cajaEpisodes.classList.toggle("contenedor-episodes-none");

                    //Borramos todo lo primero para luego imprimir
                    const carruselEpisodes = document.getElementById("carousel-episodes");
                    carruselEpisodes.innerHTML = "";


                    if (season.hasChildNodes()) {
                        //Imprimirmos los episodios, obtenemos lo primero el id de temporada, que lo hemos pasado arriba mediante un class en html
                        let idseason = season.getAttribute("id")
                        document.getElementById("data-"+idseason).appendChild(cajaEpisodes)
                        

                        const EPISODES = BASE_URL + "/tv/" +id+ "/season/"+idseason+API_KEY+"&language=es&append_to_response=videos";
                        fetch(EPISODES)
                        .then(response =>(response.json()))
                        .then(data => {
                            for(let i=0;i<data.episodes.length;i++){
                                if (data.episodes[i].still_path){
                                    carruselEpisodes.innerHTML += `<div class='episode'><div class="descripcion-episodio"><p class='title-episode'>${data.episodes[i].name}</p><p>${data.episodes[i].overview}</p></div><img src='${IMG_URL_M}${data.episodes[i].still_path}' alt='Episodio'></div>`;
                                }else{
                                    carruselEpisodes.innerHTML += `<div class='episode'><div class="descripcion-episodio"><p class='title-episode'>${data.episodes[i].name}</p><p>${data.episodes[i].overview}</p></div><img src='../img/noepisode.png'></div>`;
                                }
                                
                               
                            }
                            
                        })
                        .catch(error=> {console.log(error)})
                        
                      }
                    
                });
            });
            
         }
         
        existVideo(data)
        credits()
        similar()

    })

    .catch(error=> {console.log(error)})



}
function episodes(idseason){

    const EPISODES = BASE_URL + "/tv/" +id+ "/season/"+idseason+API_KEY+"&language=es&append_to_response=videos";

    fetch(EPISODES)
    
    .then(response =>(response.json()))
    .then(data => {
        for(let i=0;i<data.episodes.length;i++){
            document.getElementById("carousel-episode").innerHTML += `<div class='episode'><p class='title-episode'>${data.episodes[i].name}</p><img src='${IMG_URL_M}${data.episodes[i].still_path}' alt='Episodio'></div>`;
        }


    })
    .catch(error=> {console.log(error)})
    
    

}
/**
 * Funcion que nos dice si el video existe o no
 * Si existe el video entonces guardaremos el idvideo en una variable j y lo mostraremos despues del for en forma de html
 * Si no existe el video porque no hay entonces le meteremos una imagen de portada
 * @param {*} data 
 */
function existVideo(data){
    let j
    if(data.videos.results.length){
        for(let i=0;i<data.videos.results.length;i++){
            if(data.videos.results[i].key){
                j=i
            }
        }

        let idvideo = data.videos.results[j].key
        document.getElementById("media").innerHTML = '<iframe width="100%" height="515" src="https://www.youtube.com/embed/'+idvideo+'?autoplay=1&modestbraning=1&loop=1&showinfo=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                
    }else{
        let rutaIMG = data.backdrop_path
        document.getElementById("media").innerHTML = "<img src='"+IMG_URL_L+rutaIMG+"' class='proximamente'>";
    }
}

/**
 * Funcion que nos imprime los creditos, el reparto de actores y su correspondiente personaje
 * en forma de carrusel, si no tiene imagen no nos mostrara el personaje del reparto
 */
function credits(){
    fetch(isMovieOrTv(MOVIE_CRE,TV_CRE))
    .then( response =>  response.json())
            
    .then(data => {
        for(let i=0;i<data.cast.length;i++){
            let actor = data.cast[i].name
            let photo = data.cast[i].profile_path
            let depart = data.cast[i].known_for_department
            let character = data.cast[i].character

            //Si la foto no se encuentra no se pondra
            if(photo != null){
                document.getElementById("carousel-reparto").innerHTML += "<div class='reparto'><p class='depart'>"+depart+"</p><img src='"+IMG_URL_S+photo+"' alt='Foto de reparto'> <p>"+actor+"</p><p>"+character+"</p></div>"
            }
            
        }
    
    })
    .catch(error=> {console.log(error)})
}

/**
 * Funcion que nos imprimira todas las peliculas o series que son similares a la que estamos viendo en ese momento
 * Si no tiene imagen, para que no quede feo no nos mostrara ese elemento
 */
function similar(){
    fetch(isMovieOrTv(MOVIE_SIM,TV_SIM))
    .then( response =>  response.json())
            
    .then(data => {
        for(let i=0;i<data.results.length;i++){
            let poster = data.results[i].backdrop_path
            
            if(data.results[i].name){
                title =  data.results[i].name
            }else{
                title =  data.results[i].title
            }

            //Si la foto no se encuentra no se pondra
            //Si el tipo es pelicula se añade a la URL si no se añade tv
            if(poster != null){
                if(type=="movie"){
                    document.getElementById("carousel-similar").innerHTML += "<div class='similar'><p class='title-similar'>"+title+"</p><a href='ficha.html?type=movie&id="+data.results[i].id+"'><img src='"+IMG_URL_M+poster+"' alt='Similares'></a></div>"
                }else{
                    document.getElementById("carousel-similar").innerHTML += "<div class='similar'><p class='title-similar'>"+title+"</p><a href='ficha.html?type=tv&id="+data.results[i].id+"'><img src='"+IMG_URL_M+poster+"' alt='Similares'></a></div>"
                }
            }
            
            
        }
    
    })
    .catch(error=> {console.log(error)})
}


