//Tomaremos el select donde irán todos los options
const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedasSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
    moneda: "",
    criptomoneda: "",
} 

//Un promise que se ejecuta cuando se cargan bien las criptomonedas 
//Siempre se recomienda retornar una promesa en las operaciones asíncronas para extender funcionalidad, creó otra promesa para poder encadenar otro .then y trabajar más comodo
const obtenerCriptomonedas = criptomonedas => new Promise (resolve =>{
    resolve(criptomonedas);
});

document.addEventListener("DOMContentLoaded", ()=>{
    consultarCriptomonedas();
    formulario.addEventListener("submit", submitFormulario);

    criptomonedasSelect.addEventListener("change", leerValor);
    monedasSelect.addEventListener("change", leerValor);
});

async function consultarCriptomonedas() {

    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";


    // fetch(url)
    // .then((result) => {
    //     return result.json();
    // }).then((resultado) => {
    //     return obtenerCriptomonedas(resultado.Data); //Le pasamos el resultado para que nos traiga el array de criptos para el select
    // }).then((criptomonedas =>{
    //     selectCriptomonedas(criptomonedas); //Manejamos el éxito del resolve con un .then
    // }));

    try {
        const result = await fetch(url);
        const response = await result.json();
        const criptomonedas = await obtenerCriptomonedas(response.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;
        // console.log(cripto.CoinInfo);  //Pendiente de las letras en mayúsculas y minúsculas
        const option = document.createElement("OPTION");
        option.innerText = FullName;
        option.value = Name;
        criptomonedasSelect.appendChild(option);


        //Otra forma mas corta
        // criptomonedasSelect.innerHTML += `
        // <option value="${Name}">${FullName}</option>
        // `
    });
};

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    //Validar
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === "" || criptomoneda === ""){
        mostrarAlerta("Ambos campos son obligatorios");
        return;
    }

    //Limpiamos el HTML
    limpiarHTML(resultado);
    //Consultar API con los resultados
    consultarApi();
}

function mostrarAlerta(mensaje) {

    const errorExiste = document.querySelector(".error");

    if(!errorExiste){ 
        const mensajeDiv = document.createElement("DIV");
        mensajeDiv.classList.add("error")
        mensajeDiv.textContent = mensaje;
        formulario.appendChild(mensajeDiv);
        setTimeout(() => {
            mensajeDiv.remove(); //Después que pasen 2 seg se va a quitar este mensaje
        }, 2000);
    }

}

async function consultarApi() {
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    //Muestra el spinner
    mostrarSpinner();




            // fetch(url)
            // .then((result) => {
            //     return result.json();
            // }).then((cotizacion) => {
            //     mostrarCotizaciónHTML(cotizacion.DISPLAY[criptomoneda][moneda]); //Hace que nuestro objeto sea dinámico también
            // });

            try {
                const result = await fetch(url);
                const response = await result.json();
                mostrarCotizaciónHTML(response.DISPLAY[criptomoneda][moneda]);
            } catch (error) {
                console.log(error);
            }

    
}

function mostrarCotizaciónHTML(cotizacion) {
    const {criptomoneda} = objBusqueda;

        console.log(cotizacion);
        console.log(cotizacion.FROMSYMBOL);
        const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, FROMSYMBOL} = cotizacion;

        const simbolo = document.createElement("p");
        simbolo.classList.add("symbol");
        simbolo.innerHTML = `La cotización de ${criptomoneda}: <span>${FROMSYMBOL}</span>`;

        const precio = document.createElement("p");
        precio.classList.add("precio");
        precio.innerHTML = `El precio es de<span>${PRICE}</span>`;

        const precioAlto = document.createElement("p");
        precioAlto.innerHTML = `<p>Precio más alto del día <span>${HIGHDAY}</span> </p>`;
        
        const precioBajo = document.createElement("p");
        precioBajo.innerHTML = `<p>Precio más bajo del día <span>${LOWDAY}</span> </p>`;

        const change = document.createElement("p");
        change.innerHTML = `<p>Cambio de las últimas 24 horas: <span>${CHANGEPCT24HOUR}</span> </p>`;

        const ultUpdate = document.createElement("p");
        ultUpdate.innerHTML = `<p>Ultima actualización: <span>${LASTUPDATE}</span> </p>`;


        resultado.appendChild(simbolo);
        resultado.appendChild(precio);
        resultado.appendChild(precioAlto);
        resultado.appendChild(precioBajo);
        resultado.appendChild(change);
}

function limpiarHTML(contenedor) {
    while(contenedor.firstChild){
        contenedor.removeChild(contenedor.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML(resultado);

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    
    resultado.appendChild(spinner);

    setTimeout(() => {
        spinner.remove();
    }, 1000);
}