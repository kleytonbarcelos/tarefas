import {createContext, useContext, useEffect, useState } from 'react';

import '../firebase'
import {getAuth, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
const auth = getAuth();

export const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState()
  const [isLogged, setIsLogged] = useState()
  useEffect(()=>{
    checkLogin()
  }, []);
  function checkLogin(){  
    let response = localStorage.getItem("user");
    if (response) {
      response = JSON.parse(response)
      setIsLogged(true)
      setUser(response)
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
    } else {
      // No user is signed in.
      console.log('You are not Logged')
      setIsLogged(false)
    }
  }
  function Logout(){
    localStorage.removeItem('user')
    setIsLogged(false)

    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }
  return (
    <AuthContext.Provider value={{user, setUser, isLogged, setIsLogged, Logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)