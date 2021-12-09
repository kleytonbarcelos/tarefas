import React, { useState, useEffect } from 'react';

import Dashboard from './Dashboard';
import Login from './Login';

import {useAuth} from './providers/auth'

function App(){
  const {user, setUser, isLogged, setIsLogged} = useAuth()

  return (
    <>
      {!isLogged ? (
        <Login />
      ) : (
        <Dashboard />
      )}
    </>
  )
}

export default App;