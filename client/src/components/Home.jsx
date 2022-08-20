import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Home.module.css";
import Pokemons from './Pokemons';
import NavigationBottomBar from './NavigationBottomBar';
import {useParams, useNavigate} from 'react-router-dom';
import Buscador from './Buscador';
import Filtros from './Filtros';
import {getPokemons} from '../actions/index.js';//Esta son las acciones redux que defini
import loadingGif from '../imgs/Loading.gif';


export default function Home(){
    let {page} = useParams();//Aca agarro el param /:page del link
    page = (!page || isNaN(page))?0:page;//Si no se paso ningun param o el param pasado no es un numero, por defecto sera 0
    const dispatch = useDispatch();
    const store = useSelector(store => store);//Aca agarro la store entera
    const [pokemons, setPokemons] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {//Se corre solo una vez al cargar el elemento
        if(store.pokemons.length) return;//Esto es porque al volver atras se vuelve a cargar este elemento generando un nuevo dispatch cuando en realidad ya tenemos los pokemons
        dispatch(getPokemons(0, 12, false));//Hago un dispatch pidiendo los pokemons que necesito 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {//Esto se ejecuta cuando los pokemons de la store cambien
        //Esto se ejectura tambien al cargar asi que este if es para avoidear eso
        if(!store.pokemons.length) return;
        preLoadImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.pokemons])

    useEffect(() => {//Esto se ejecutara cuando el estado pokemons cambie
        //Si se ejecuto al inicio o si ya tengo todos los pokemons que quiero no me interesa entrar
        if(!pokemons.length || pokemons.length > 12) return;
        dispatch(getPokemons(12,28, true));//Pido el resto de pokemons
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[pokemons]);

    useEffect(() => {
        sortPokemons();
    },[store.order])


    function loadingScreen(){
        return(
            <div className = {styles.homeLoading}>
                <img src = {loadingGif} alt="" />
                <h1>Loading...</h1>
            </div>
        );
    }

    function sortPokemons(pkms = pokemons){
        switch(store.order){
            case 'ORDER_ALPH_ASC':
                let sortedPokemonsAsc = [...pkms];
                OrderAlph(sortedPokemonsAsc,[1,-1],'name');
                setPokemons(sortedPokemonsAsc);
            break;
            case 'ORDER_ALPH_DESC':
                let sortedPokemonsDesc = [...pkms];
                OrderAlph(sortedPokemonsDesc,[-1, 1],'name');
                setPokemons(sortedPokemonsDesc);
            break
            default:
                setPokemons(pkms);
            break;

        }

        function OrderAlph(ArrObj, order, prop){//order [1,-1] es ascendente, order [-1,1] es descendente, esto ordena un objeto por la propiedad dada
            ArrObj.sort((a,b) => (a.pokemon[prop] > b.pokemon[prop])?order[0]:order[1]);
        }
    }

    function showPage(){
        //Si intentas cambiar manualmente el link para forzar el parametro {page} mas haya de lo que deberias, esto te lleva home/0
        if(page*12 > pokemons.length) navigate('/home', {replace:true});

        return(    
        <div className = {styles.homeMainContainer}>
            <Buscador/>
            <div className = {styles.homeMainContent}>
                <div className = {styles.filtersMain}>
                    <Filtros quantPokemons = {pokemons.length} order = {store.order} types = {store.types}/>
                </div>
                <div className = {styles.pokemonsMainContainer}>
                    <Pokemons pokemonsData = {pokemons.map(x => x.pokemon)} images = {pokemons.map(x => x.img)} page = {page}/>
                    <NavigationBottomBar page = {page} quantPokemons = {pokemons.length}/>
                </div>
            </div>
        </div>
        );
        
    }

    function preLoadImages(){//This function will preLoad all images and then update the {pokemons} state with all pokemons and their imgs
        const imagePromises = store.pokemons.map((pokemon) => {//Creo una promesa por cada pokemon y las guardo en el array imagePromises
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.addEventListener('load', () => resolve(img));
                img.addEventListener('error', err => reject(err));
                img.src = pokemon.img;
            })
        })

        Promise.all(imagePromises)//Ejecuto todas las promesas 
        .then(response => {//Cuando tenga una respuesta actualizo el estado de este componente forzandolo a re-renderizarse
            const newPokemons = response.map((img, index) => {return {img: img, pokemon: store.pokemons[index]}});
            /* setPokemons(newPokemons); */
            sortPokemons(newPokemons);
        })
        .catch(err => {throw new Error(err)});//Si hubo un error se cuelga
    }

    return(
        <div>
          {!pokemons.length?loadingScreen()://Si todavia no cargo las imagenes, que es lo ultimo en cargar muestra este loading
            showPage()}{/* Si ya tiene toda la informacion necesaria carga todos los elementos del home */}
        </div>
    );
}