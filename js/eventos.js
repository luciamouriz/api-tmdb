const flechaIzquierda = document.querySelectorAll('.flecha-izquierda');
const flechaDerecha = document.querySelectorAll('.flecha-derecha');

/*Primero obtenemos el div padre de flechaizquierda y derecha
Despues obtenemos el ultimo hijo que sera el carousel que hay que mover
Por eso en el DOM de los carouseles SIEMPRE tiene que estar de ultimo el contenedor-carousel-?*/

flechaIzquierda.forEach((flechaIzquierda) => {
	flechaIzquierda.addEventListener('click', (e) => {
		flechaIzquierda.parentNode.lastElementChild.scrollLeft -=  flechaIzquierda.parentNode.lastElementChild.offsetWidth;
	});
});

flechaDerecha.forEach((flechaDerecha) => {
	flechaDerecha.addEventListener('click', (e) => {
		flechaDerecha.parentNode.lastElementChild.scrollLeft +=  flechaDerecha.parentNode.lastElementChild.offsetWidth;
       
	});
});

function searchVideos(){
    let buscar = document.getElementById("buscar");
    let text = document.getElementById("texto").value
    let search = BASE_URL + "/search/multi"+API_KEY+"&language=es&query="+text+"&page=1&include_adult=false";

    if(text){
        buscar.style.display = "block";
        fetch(search)
        .then(response => response.json())
        .then(data=>{
            document.getElementById("buscar-videos").innerHTML = ""; 
            for(i =0 ; i<data.results.length; i++){
                if(data.results[i].poster_path){
                    document.getElementById("buscar-videos").innerHTML += "<a href='ficha.html?type=movie&id="+data.results[i].id+"'><img src='"+IMG_URL_M+data.results[i].poster_path+"' alt='Imagen portada'></a>"
                }
            }
            
        })

    }else{
        buscar.style.display = "none"; 
        document.getElementById("buscar-videos").innerHTML = "";     
    }
}


    
/*


// ? ----- ----- Hover ----- -----
peliculas.forEach((pelicula) => {
	pelicula.addEventListener('mouseenter', (e) => {
		const elemento = e.currentTarget;
		setTimeout(() => {
			peliculas.forEach(pelicula => pelicula.classList.remove('hover'));
			elemento.classList.add('hover');
		}, 300);
	});
});

fila.addEventListener('mouseleave', () => {
	peliculas.forEach(pelicula => pelicula.classList.remove('hover'));
});*/