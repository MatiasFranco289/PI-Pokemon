import React,{useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'
import styles from '../styles/Crear.module.css'
import popUpStyles from '../styles/PopUp.module.css'
const titleImg = require('../imgs/SeatedPikachu.png')

export default function Crear(){
    //Nombre, tipos, imagen Datos
    //Vida, ataque, defensa, velocidad Stats
    //Altura, peso Caracteristicas
    const [types, setTypes] = useState();
    const [input, setInput] = useState({
        name: '',
        types: [],
        img: '',
        hp: '',
        attack: '',
        defense: '',
        speed: '',
        height: '',
        weight: ''
    });
    const [errors, setErrors] = useState({
        name: 'The name must have at least 3 letters.',
        img: 'This should be a valid url.',
        hp: 'This field cannot be empty.',
        attack: 'This field cannot be empty.',
        defense: 'This field cannot be empty.',
        speed: 'This field cannot be empty.',
        height: 'This field cannot be empty.',
        weight: 'This field cannot be empty.',
        types: 'The pokemon must have at least 1 type.'
    });
    const [popUp, setPopUp] = useState({
        title: '',
        info: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/types')
        .then(data => data.json())
        .then(res => setTypes(res));
    },[]);

    function goBack(){
        navigate(-1);
    }

    function handleChanges(e){
        let validateFunc;
        let payload = {attr: e.target.name, min: 0,measure: ''}
        setInput({...input, [e.target.name]: e.target.value});
        
        switch(e.target.name){
            case 'name':
                validateFunc = (obj, pyld) => validateName(obj, pyld);
            break;
            case 'img':
                validateFunc = (obj, pyld) => validateUrl(obj, pyld);
            break
            case 'hp':
                payload.max = 255;
                validateFunc = (obj, pyld) => validateGenericAttr(obj, pyld);
            break;
            case 'attack':
                payload.max = 366;
                validateFunc = (obj, pyld) => validateGenericAttr(obj, pyld);
            break;
            case 'defense':
                payload.max = 230;
                validateFunc = (obj, pyld) => validateGenericAttr(obj, pyld);
            break;
            case 'speed':
                payload.max = 180;
                validateFunc = (obj, pyld) => validateGenericAttr(obj, pyld);
            break;
            case 'height':
                payload.max = 2000;
                payload.min = 9;
                payload.measure = 'cm';
                validateFunc = (obj, pyld) => validateGenericAttr(obj, pyld);
            break;
            case 'weight':
                payload.max = 1000;
                payload.measure = 'kg'
                validateFunc = (obj, pyld) => validateGenericAttr(obj, pyld);
            break;
        }

        setErrors({...errors, [e.target.name]: validateFunc({...input, [e.target.name]: e.target.value}, payload)});

        function validateName(input){
            let err = ''
            if(input.name.length < 3) err = 'The name must have at least 3 letters.'
            else if(input.name.length > 15) err = 'The name can have up to 15 letters.';
            !/^[A-Za-z\s]*$/.test(input.name) && (err = 'The name can only contain letters.');
            return err;
        }

        function validateUrl(input, payload){
            let err = '';
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            !pattern.test(input.img) && (err = 'This should be a valid url.');
            return err;
        }

        function validateGenericAttr(input, payload){
            let err = '';
            if(!input[payload.attr].length) return 'This field cannot be empty.';

            if(!/^[0-9]+$/.test(input[payload.attr])) err = 'This field only accept numbers.'
            else if(input[payload.attr] > payload.max) err = `The ${payload.attr} cannot be higher than ${payload.max}${payload.measure}.`
            else if(input[payload.attr] <= payload.min) err = `The ${payload.attr} must be at least ${payload.min+1}${payload.measure}.`;
            
            return err;
        }

    }

    function handleTypeChange(e){
        e.preventDefault();

        let newTypes = [];
        if(input.types.includes(e.target.name)){//Si el boton esta activo
            newTypes = input.types.filter(x => x!==e.target.name);
            setInput({...input, types: newTypes});
            if(newTypes.length) return;
            setErrors({...errors, types: 'The pokemon must have at least 1 type.'});
        }
        else{//Si esta inactivo
            if(input.types.length < 2){//Si el pokemon tiene menos de dos tipos
                newTypes = input.types;
                newTypes.push(e.target.name);
                setInput({...input, types: newTypes});//Agrega el tipo
                setErrors({...errors, types: ''});//Elimina errores
            }
            else{
                setErrors({...errors, types: 'overTypes'});
            }
        }
        
    }

    function closeHint(e){
        e.preventDefault();
        if(errors.types !== 'overTypes') return
        setErrors({...errors, types: ''});
    }

    async function sendForm(e){
        e.preventDefault();
        
        if(Object.values(errors).some(element => element!=='')){//Convierto errors en un array y lo recorro para ver si hay algun error
            //Manejar errores aca
            setPopUp({
                title: 'Error!',
                info: 'Some fields are empty or have errors.'
            })
        }
        else{//Aca se hace el send
            const requestBody = {
                name: input.name,
                types: input.types,
                img: input.img,
                hp: input.hp,
                attack: input.attack,
                defense: input.defense,
                speed: input.speed,
                height: input.height,
                weight: input.weight
            }

            //Hago el post a la api con la info del formulario
            await fetch('http://localhost:3000/pokemons', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(requestBody)
            })
            .then(data => data.json())
            .then(res => {
                if(res === 'Ok!'){
                    setPopUp({
                        title: 'Success!',
                        info: 'Your Pokemon has been successfully created!'
                    })
                }
                else if(res === 'SequelizeUniqueConstraintError'){
                    setPopUp({
                        title: 'Error!',
                        info: 'An error has ocurred, a pokemon with the same name or image already exist.'
                    });
                }
                else{
                    setPopUp({
                        title: 'Error!',
                        info: 'An error has ocurred during the creation of your pokemon, try again later.'
                    });
                }
            })
        }
    }

    function closePopUp(){
        setPopUp({
            title: '',
            info: ''
        })
    }

    return(
        <div className = {styles.mainWrapper}>

            <div className = {popUp.title?popUpStyles.overlay_active:popUpStyles.overlay_inactive}>
                <div className = {popUp.title?popUpStyles.popup_active:popUpStyles.popup_inactive}>
                    <div className = {popUpStyles.titleSection}>
                        <h2>{popUp.title}</h2>
                    </div>

                    <div className = {popUpStyles.infoSection}>
                        <p>{popUp.info}</p>
                        <button onClick = {() => closePopUp()}>Ok!</button>
                    </div>
                </div>
            </div>
            
            <button className = {styles.exitBtn} onClick = {() => goBack()}>Go back</button>
            <div className = {styles.titleContainer}>
                <h1>Create Pokemon</h1>
            </div>
            <form action="" method="post" onSubmit = {(e) => sendForm(e)}>
                <img className = {styles.titleImg} src = {titleImg} alt="" />
                <h2>Data</h2>
                <div className = {styles.mainSection}>
                    <div className = {styles.section}>
                        <label htmlFor="name">Name</label>
                        <input name = 'name' value = {input.name} onChange = {(e) => handleChanges(e)} type="text" id='name' placeholder = 'Name of the Pokemon'/>
                        {errors.name && (
                            <p className = {styles.danger}>{errors.name}</p>
                        )}
                    </div>

                    <div className = {styles.section}>
                        <label>Types</label>
                        <div className = {styles.btnsContainer}>
                            {types?.map((type, index) => {
                                return <button onClick = {(e) => handleTypeChange(e)} key = {`tpBtn_${index}`} name = {type.id} className = {
                                    input.types.includes(type.id)?styles.typeBtn_active:styles.typeBtn
                                }>
                                    {type.name[0].toUpperCase() + type.name.slice(1)}
                                </button>
                            })}
                        </div>
                        {errors.types && errors.types!=='overTypes' &&(
                            <p className = {styles.danger}>{errors.types}</p>
                        )}
                        <div className = {errors.types!=='overTypes'?styles.hint:styles.hint_active}>
                            <p>A pokemon cannot have more than 2 types!</p>
                            <button onClick = {(e) => closeHint(e)}>X</button>
                        </div>
                    </div>

                    <div className = {styles.section}>
                            <label htmlFor="imgUrl">Image url</label>
                            <input name = 'img' value = {input.img} onChange = {(e) => handleChanges(e)}type="text" id = 'img' placeholder = 'Pokemon image link'/>
                            {errors.img && (
                                <p className = {styles.danger}>{errors.img}</p>
                            )}
                    </div>
                </div>
                <h2>Attributes</h2>
                <div className = {styles.mainSection}>
                    <div className = {styles.section}>
                            <label htmlFor="hp">Hp</label>
                            <input name = 'hp' onChange = {(e) => handleChanges(e)} value = {input.hp} type="text" id='hp' placeholder = 'Pokemon hp'/>
                            {errors.hp && (
                                <p className = {styles.danger}>{errors.hp}</p>
                            )}
                    </div>

                    <div className = {styles.section}>
                            <label htmlFor="hp">Attack</label>
                            <input name = 'attack' onChange = {(e) => handleChanges(e)} value = {input.attack} type="text" id='attack' placeholder = 'Pokemon attack'/>
                            {errors.attack && (
                                <p className = {styles.danger}>{errors.attack}</p>
                            )}
                    </div>

                    <div className = {styles.section}>
                            <label htmlFor="hp">Defense</label>
                            <input name = 'defense' onChange = {(e) => handleChanges(e)} value = {input.defense} type="text" id='defense' placeholder = 'Pokemon defense'/>
                            {errors.defense && (
                                <p className = {styles.danger}>{errors.defense}</p>
                            )}
                    </div>

                    <div className = {styles.section}>
                            <label htmlFor="speed">Speed</label>
                            <input name = 'speed' onChange = {(e) => handleChanges(e)} value = {input.speed} type="text" id='speed' placeholder = 'Pokemon speed'/>
                            {errors.speed && (
                                <p className = {styles.danger}>{errors.speed}</p>
                            )}
                    </div>
                </div>
                <h2>Characteristics</h2>
                <div className = {styles.mainSection}>
                     <div className = {styles.section}>
                            <label htmlFor="height">Height</label>
                            <input name = 'height' onChange = {(e) => handleChanges(e)} value = {input.height} type="text" id='height' placeholder = 'Height of the pokemon in cm'/>
                            {errors.height && (
                                <p className = {styles.danger}>{errors.height}</p>
                            )}
                    </div>

                    <div className = {styles.section}>
                            <label htmlFor="speed">Weight</label>
                            <input name = 'weight' onChange = {(e) => handleChanges(e)} value = {input.weight}type="text" id='weight' placeholder = 'Weight of the pokemon in kg'/>
                            {errors.weight && (
                                <p className = {styles.danger}>{errors.weight}</p>
                            )}
                    </div>
                </div>
                
                <button type="submit" className = {styles.createBtn}>Create!</button>
            </form>
        </div>
    );
}