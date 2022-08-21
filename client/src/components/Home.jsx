import React, {useState, useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Home.module.css";
import Pokemons from './Pokemons';
import NavigationBottomBar from './NavigationBottomBar';
import {useParams, useNavigate} from 'react-router-dom';
import Buscador from './Buscador';
import Filtros from './Filtros';
import {getPokemons} from '../actions/index.js';//Esta son las acciones redux que defini
import loadingGif from '../imgs/Loading.gif';

//Si no hay nada en la store --> Dispatch, render Loading...

//Recibe respuesta del dispatch.
//Se recarga el elemento.
//Ahora en lugar de loading corre preCargarImagenes.
//Precargar imagen crea un elemento 

export default function Home(){
    let {page} = useParams();//Aca agarro el param /:page del link
    page = (!page || isNaN(page))?0:page;//Si no se paso ningun param o el param pasado no es un numero, por defecto sera 0
    const dispatch = useDispatch();
    const store = useSelector(store => store);//Aca agarro la store entera
    const dataLoaded = useRef(false);
    
    useEffect(() => {//Se corre solo una vez al cargar el elemento, pidiendo los pokemones si la store esta vacia
        if(!store.pokemons.length){
            dispatch(getPokemons(0,40, true));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    function loadingScreen(){
        return(
            <div className = {styles.homeLoading}>
                <img src = {loadingGif} alt="" />
                <h1>Loading...</h1>
            </div>
        );
    }

    function filterByType(pkms){
        if(store.filters.types.length){
            let types = store.filters.types;
            
            types.forEach(type => {
                type = type.toLowerCase();
                pkms = pkms.filter(pokemon => pokemon.types.includes(type));
            })
        }

        return pkms;
    }

    function sortPokemons(pkms){
        let sortedPokemons = pkms;

        switch(store.order){
            case 'ORDER_ALPH_ASC':
                OrderAlph(sortedPokemons,[1, -1],'name');
            break;
            case 'ORDER_ALPH_DESC':
                OrderAlph(sortedPokemons,[-1, 1],'name');
            break;
            case 'ORDER_ATT_ASC':
                OrderAlph(sortedPokemons,[1, -1],'attack');
            break;
            case 'ORDER_ATT_DESC':
                OrderAlph(sortedPokemons,[-1, 1],'attack');
            break;
        }

        return sortedPokemons;

        function OrderAlph(ArrObj, order, prop){//order [1,-1] es ascendente, order [-1,1] es descendente, esto ordena un objeto por la propiedad dada
            ArrObj.sort((a,b) => (a[prop] > b[prop])?order[0]:order[1]);
        }
    }

    function filterByProcedency(pkms){
        store.filters.originals && (pkms = pkms.filter(pokemon => pokemon.name[0] !== pokemon.name[0].toLowerCase()));
        return pkms;
    }


    //sort by attack
    //Haces un dispatch
    //Reordenas la store
    //Y listo we

    function showPage(){
        //Si intentas cambiar manualmente el link para forzar el parametro {page} mas haya de lo que deberias, esto te lleva home/0
        let localPokemons = sortPokemons([...store.pokemons]);//Sort by alph, no necesito ningun dato extra 
        localPokemons = filterByType(localPokemons);//Sort by type, no necesito ningun dato extra
        localPokemons = filterByProcedency(localPokemons);//SortByProcedency identifica los pokemons originales porque su primera letra es minuscula

        return(    
        <div className = {styles.homeMainContainer}>
            <Buscador/>
            <div className = {styles.homeMainContent}>
                <div className = {styles.filtersMain}>
                    <Filtros pokemons = {store.pokemons.map(x => {return {name:x.name,attack:x.attack}})} order = {store.order} types = {store.types} filters = {store.filters}/>
                </div>
                <div className = {styles.pokemonsMainContainer}>
                    <Pokemons pokemonsData = {localPokemons} page = {page}/>
                    <NavigationBottomBar page = {page} quantPokemons = {localPokemons.length}/>
                </div>
            </div>
        </div>
        );
        
    }


    return(
        <div>
          {!store.pokemons.length?loadingScreen()://Si todavia no cargo las imagenes, que es lo ultimo en cargar muestra este loading
            showPage()}{/* Si ya tiene toda la informacion necesaria carga todos los elementos del home */}
        </div>
    );
}