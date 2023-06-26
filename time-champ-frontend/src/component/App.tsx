import './App.css';
import {Routes,Route } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Home from '../home';
import RequiredAuth from './RequiredAuth';
import Validate from './validate';

function App() {
  return (
       <Routes>
          <Route path='/*' element={<Login/>} />
          <Route path='/signup' element={<Signup />} />
          <Route element={<RequiredAuth />} >
            <Route path='/home' element={<Home />} />
            <Route path='/validate' element={<Validate />} />
          </Route>
       
        </Routes>
  );
}

export default App;
