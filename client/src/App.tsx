import React, { useContext } from 'react';
import NavBar from './Components/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import AdminPage from './Pages/AdminPage';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import "./main.css";
import { myContext } from './Pages/Context';
import Register from './Pages/Register';

function App() {
  const ctx = useContext(myContext);
  
  return (
    <BrowserRouter>
    <NavBar />
      <Routes>
        <Route path='/'  element={<Homepage/>}></Route>  
        {
            ctx ? (
              <>
                {ctx.isAdmin ? <Route path='/admin' element={<AdminPage/>}></Route> : null}
                <Route path='/profile' element={<Profile/>}></Route>  
              </>
            ) : (
              <>
                <Route path='/login' element={<Login/>}></Route>  
                <Route path='/register' element={<Register/>}></Route>  
              </>  
            )
        }
    </Routes>
    </BrowserRouter>
  );
}
export default App;
