import React from "react";
import {useDispatch} from 'react-redux';
import styles from '../styles/Filtros.module.css';

export default function Filtros(props){

    const dispatch = useDispatch();

    function handleOrderChange(e){//Esto maneja los cambios en el tipo de ordenado
        dispatch({type: e.target.value});
    }

    function handleTypeFilter(e){
        alert('sex');
    }

    
    return(
    <div className = {styles.filtrosMainWrapper}>
        <h2>Filters</h2>

        <div className = {styles.filtersWrapperColumn}>
            <h4>Tipos</h4>

            <div className = {styles.typesContainer}>
                {props.types.map((type, index) => {
                    return <button key = {`btnFltr${index}`} onClick={(e) => handleTypeFilter(e)}>{type}</button>
                })}
            </div>
        </div>

        <div className = {styles.filterWrapperRow}>
                <h4>Only originals</h4>

                <label className = {styles.switch}>
                    <input type="checkbox"/>
                    <span className = {styles.slider}></span>
                </label>
        </div>

        <div className = {styles.filtersWrapperColumn}>
                <h4>Order by</h4>
            <div className = {styles.mainselection}>
                <select defaultValue={props.order} onChange = {(e) => handleOrderChange(e)}>
                    <option value="none">None</option>
                    <option value = 'ORDER_ALPH_ASC'>Alphabetically ascending</option>
                    <option value = 'ORDER_ALPH_DESC'>Alphabetically descending</option>
                    <option value = 'ORDER_ATT_ASC'>By attack ascending</option>
                    <option value = 'ORDER_ATT_DESC'>By attack descending</option>
                </select>
            </div>
        </div>

        
    </div>

    )
}