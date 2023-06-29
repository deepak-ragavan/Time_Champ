import './App.css';
import {Routes,Route } from 'react-router-dom';
import Login from './login/login';
import Signup from './login/signup';
import Home from './home/home';
import RequiredAuth from './auth/RequiredAuth';
import Validate from './auth/validate';

function App() {
  return (
       <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup />} />
          <Route element={<RequiredAuth />} >
            <Route path='/home' element={<Home />} />
            <Route path='/validate' element={<Validate />} />
          </Route>
       
        </Routes>
  );
}

export default App;
