import './App.css';
import {Route, Routes} from 'react-router-dom';
import LandingPage from './components/LadingPage';
import Home from './components/Home';

function App() {
  return (
    <Routes>
      <Route path='/' element = {<LandingPage/>}/>
      <Route path='/home' element = {<Home/>}/>
    </Routes>
  );
}
//"react-scripts start
export default App;
