import './App.css';
import {Route, Routes} from 'react-router-dom';
import LandingPage from './components/LadingPage';
import Home from './components/Home';
import PokemonDetails from './components/PokemonDetails';

function App() {
  return (
    <Routes>
      <Route path='/' element = {<LandingPage/>}/>
      <Route path='/home/:page' element = {<Home/>}/>
      <Route path='/home' element = {<Home/>}/>
      <Route path='/pokemonDetails/:name' element = {<PokemonDetails/>}/>
    </Routes>
  );
}
//"react-scripts start
export default App;
