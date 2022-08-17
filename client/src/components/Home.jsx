import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Home.module.css";
import Pokemons from './Pokemons';
import NavigationBottomBar from './NavigationBottomBar';
import {useParams} from 'react-router-dom';
import Buscador from './Buscador';
import Filtros from './Filtros';
import {getPokemons} from '../actions/index.js';//Esta son las acciones redux que defini
import loadingGif from '../imgs/Loading.gif';

export default function Home(){
    let {page} = useParams();//Aca agarro el param /:page del link
    page = (!page || isNaN(page))?0:page;//Si no se paso ningun param o el param pasado no es un numero, por defecto sera 0
    const dispatch = useDispatch();
    const pokemonsData = useSelector(store => store.pokemons);//Pido de la redux store la propiedad pokemons
    const [images, setImages] = useState();
    const loadedPage = (
    <div className = {styles.homeMainContainer}>
        <Buscador/>
        <div className = {styles.homeMainContent}>
            <div className = {styles.filtersMain}>
                <Filtros pokemons = {pokemonsData}/>
            </div>
            <div className = {styles.pokemonsMainContainer}>
                <Pokemons pokemonsData = {pokemonsData} images = {images} page = {page}/>
                <NavigationBottomBar page = {page} quantPokemons = {pokemonsData.length}/>
            </div>
        </div>
    </div>);

    useEffect(() => {//Se corre esta funcion OnStart una sola vez porque al final tiene []
        dispatch(getPokemons(0, 40, true));//Hago un dispatch pidiendo los pokemons que necesito
    },[]);

    useEffect(() => {//Esto se ejecuta cuando ${pokemonsData} cambie
        if(!pokemonsData.length) return;//Tambien se ejecuta al principio asi que esto es para que no entre si no estan cargados los pokemons

        const imagePromises = pokemonsData.map((pokemon) => {//Creo una promesa por cada pokemon y las guardo en el array imagePromises
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.addEventListener('load', () => resolve(img));
                img.addEventListener('error', err => reject(err));
                img.src = pokemon.img;
            })
        })

        Promise.all(imagePromises).//Ejecuto todas las promesas 
        then(response => setImages(response)).//Cuando tenga una respuesta actualizo el estado de este componente forzandolo a re-renderizarse
        catch(err => setImages(err));
    }, [pokemonsData])

    function loadingScreen(){
        return(
            <div className = {styles.homeLoading}>
                <img src = {loadingGif} alt="" />
                <h1>Loading...</h1>
            </div>
        );
    }

    return(
        <div>
            {!images?loadingScreen()://Si todavia no cargo las imagenes, que es lo ultimo en cargar muestra este loading
            loadedPage}{/* Si ya tiene toda la informacion necesaria carga todos los elementos del home */}
        </div>
    );
}