import React, {useEffect} from "react";
import {useDispatch} from 'react-redux';
import styles from '../styles/Filtros.module.css';
import {setOnlyOriginals, setTypeFilter} from '../actions/index.js';
import { useNavigate } from "react-router-dom";
import {addAttackInfo} from '../actions/index.js';
const loadingGears = require('../imgs/LoadingGears.gif');

export default function Filtros(props){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addAttackInfo(props.pokemons.map(x => x.name)));
    }, [])

    function handleOrderChange(e){//Esto maneja los cambios en el tipo de ordenado
        dispatch({type: 'SORT', payload: e.target.value});
    }

    function handleTypeFilter(e){
        if(props.filters.types.includes(e.target.name)){//Si hiciste click sobre un boton activo
            let newState = props.filters.types.filter(x => x !== e.target.name)
            dispatch(setTypeFilter(newState));
        }
        else{//Si hiciste click sobre un boton inactivo
            let newState = [...props.filters.types, e.target.name];
            newState.length > 2 && newState.shift();
            dispatch(setTypeFilter(newState));
            navigate('/home/0');
        }
    }

    function handleOriginal(){
        dispatch(setOnlyOriginals());//Hace un dispatch que cambia el estado de filters.original (bool) a su contrario
        navigate('/home/0');
    }

    function showPage(){
       return(
        <div className = {styles.filtrosMainWrapper_active}>
            <h2>Filters</h2>
            <div className = {styles.filtersWrapperColumn}>
                <h4>Tipos</h4>

                <div className = {styles.typesContainer}>
                    {props.types.map((type, index) => {
                        return <button className = {props.filters.types.includes(type)?styles.typesBtn_active:styles.typesBtn_inactive} name = {type} key = {`btnFltr${index}`} onClick={(e) => handleTypeFilter(e)}>
                            {type}
                        </button>
                    })}
                </div>
            </div>

            <div className = {styles.filterWrapperRow}>
                    <h4>Created by users</h4>

                    <label className = {styles.switch}>
                        <input type="checkbox"/>
                        <span className = {props.filters.originals?styles.slider_active:styles.slider_inactive} onClick = {() => handleOriginal()}></span>
                    </label>
            </div>

            <div className = {styles.filtersWrapperColumn}>
                    <h4>Order by</h4>
                <div className = {styles.mainselection}>
                    <select defaultValue={props.order} onChange = {(e) => handleOrderChange(e)}>
                        {props.order === 'none'?<option value="none">Select one</option>:null}
                        <option value = 'ORDER_ALPH_ASC'>Alphabetically ascending</option>
                        <option value = 'ORDER_ALPH_DESC'>Alphabetically descending</option>
                        <option value = 'ORDER_ATT_ASC'>By attack ascending</option>
                        <option value = 'ORDER_ATT_DESC'>By attack descending</option>
                    </select>
                </div>
            </div>
        </div>
       );
    }

    function loading(){
        return(
            <div className = {styles.filtrosMainWrapper_loading}>
                <h2>Loading filters...</h2>
                <img src = {loadingGears} alt="loadingGears"/>
            </div>
        );
    }

    
    return(props.pokemons[0].attack?showPage():loading());
}