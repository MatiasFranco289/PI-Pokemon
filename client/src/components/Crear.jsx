import React,{useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'
import styles from '../styles/Crear.module.css'
const titleImg = require('../imgs/SeatedPikachu.png')

export default function Crear(){
    //Nombre, tipos, imagen Datos
    //Vida, ataque, defensa, velocidad Stats
    //Altura, peso Caracteristicas
    const [types, setTypes] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/types')
        .then(data => data.json())
        .then(res => setTypes(res));
    },[])

    function goBack(){
        navigate(-1);
    }

    return(
        <div className = {styles.mainWrapper}>
            <button className = {styles.exitBtn} onClick = {() => goBack()}>Go back</button>
            <div className = {styles.titleContainer}>
                <h1>Create Pokemon</h1>
            </div>
            <form action="" method="post">
                <img className = {styles.titleImg} src = {titleImg} alt="" />
                <h2>Data</h2>
                <div className = {styles.mainSection}>
                    <div className = {styles.section}>
                        <label htmlFor="name">Name</label>
                        <input type="text" id='name' placeholder = 'Name of the Pokemon'/>
                    </div>

                    <div className = {styles.section}>
                        <label>Types</label>
                        <div className = {styles.btnsContainer}>
                            {types?.map((type, index) => {
                                return <button key = {`tpBtn_${index}`}>{type.name[0].toUpperCase() + type.name.slice(1)}</button>
                            })}
                        </div>
                    </div>

                    <div className = {styles.section}>
                            <label htmlFor="imgUrl">Image url</label>
                            <input type="url" id = 'imgUrl' placeholder = 'Pokemon image link'/>
                    </div>
                </div>
                <h2>Attributes</h2>
                <div className = {styles.mainSection}>
                    <div className = {styles.section}>
                            <label htmlFor="hp">Hp</label>
                            <input type="text" id='hp' placeholder = 'Pokemon hp'/>
                    </div>

                    <div className = {styles.section}>
                            <label htmlFor="hp">Attack</label>
                            <input type="text" id='attack' placeholder = 'Pokemon attack'/>
                    </div>

                    <div className = {styles.section}>
                            <label htmlFor="hp">Defense</label>
                            <input type="text" id='defense' placeholder = 'Pokemon defense'/>
                    </div>

                    <div className = {styles.section}>
                            <label htmlFor="speed">Speed</label>
                            <input type="text" id='speed' placeholder = 'Pokemon speed'/>
                    </div>
                </div>
                <h2>Characteristics</h2>
                <div className = {styles.mainSection}>
                     <div className = {styles.section}>
                            <label htmlFor="height">Height</label>
                            <input type="text" id='height' placeholder = 'Height of the pokemon in cm'/>
                    </div>

                    <div className = {styles.section}>
                            <label htmlFor="speed">Weight</label>
                            <input type="text" id='weight' placeholder = 'Weight of the pokemon in kg'/>
                    </div>
                </div>
                
                <button type="submit" className = {styles.createBtn}>Create!</button>
            </form>
        </div>
    );
}