import React, { useState, useEffect } from 'react';
import {useAuth} from './providers/auth'

import { toast } from 'react-toastify';

import './firebase'
import {getAuth, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
const auth = getAuth();


function Login(){
  const {user, setUser, isLogged, setIsLogged, Logout} = useAuth()

  function registerUser(user){
    localStorage.setItem("user", JSON.stringify(user))
    setUser(user)
    setIsLogged(true)
  }
  function createUserWithEmail(){
    let email  = document.getElementById('email').value
    let password  = document.getElementById('password').value
    if(email && password){
      console.log(email)
      console.log(password)
      // const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //console.log(userCredential.user)
        registerUser(userCredential.user)
        toast.success('Você foi registrado com sucesso!')
        // Signed in
        //const user = userCredential.user;
      })
      .catch((error) => {
        //const errorCode = error.code;
        //const errorMessage = error.message;
        console.log(error.code)
        console.log(error.message)
        if(error.code === 'auth/weak-password'){
          toast.error('Sua senha deve conter 6 digitos')
        }
        if(error.code === 'auth/email-already-in-use'){
          toast.error('Usuário já registrado. Faça seu login!')
        }
      });
    }
  }
  function signInEmail(){
    let email  = document.getElementById('email').value
    let password  = document.getElementById('password').value
    if(email && password){    
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        //const user = userCredential.user;
        registerUser(userCredential.user)
        console.log(user)
      })
      .catch((error) => {
        console.log(error.code)
        console.log(error.message)
        //const errorCode = error.code;
        //const errorMessage = error.message;
        if(error.code === 'auth/wrong-password'){
          toast.error('Sua senha está incorreta')
        }
        if(error.code === 'auth/too-many-requests'){
          toast.error('Muitas tentativas de login. Está conta está temporariamente disabilitada')
        }
      });
    }
  }
  function signInWithFacebook(){
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      registerUser(result.user)
      // The signed-in user info.
      //const user = result.user;
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      //const credential = FacebookAuthProvider.credentialFromResult(result);
      //const accessToken = credential.accessToken;
    })
    .catch((error) => {
      // Handle Errors here.
      //const errorCode = error.code;
      //const errorMessage = error.message;
      // The email of the user's account used.
      //const email = error.email;
      // The AuthCredential type that was used.
      //const credential = FacebookAuthProvider.credentialFromError(error);
    });
  }
  function signInWithGoogle(){
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
    .then((result) => {
      registerUser(result.user)
      //const credential = GoogleAuthProvider.credentialFromResult(result);
      //const token = credential.accessToken;
      //const user = result.user;
      //console.log(user);
    }).catch((error) => {
      console.log(error)
      //const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
              <form onSubmit={e => e.preventDefault()}>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="email" placeholder="name@example.com" />
                  <label for="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control" id="password" placeholder="Password" />
                  <label for="floatingPassword">Password</label>
                </div>
                <div className="d-grid">
                  <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick={signInEmail}>
                    Sign in
                  </button>
                </div>
                <div className="mt-1" style={{textAlign:'center'}}><a href="#" onClick={createUserWithEmail}><small>Criar um conta</small></a></div>
                <hr className="my-4" />
                <div className="d-grid mb-2">
                  <button className="btn btn-sm text-white text-uppercase p-3" style={{'background-color':'#EA4335'}} onClick={signInWithGoogle}>
                    <i className="fab fa-google me-2"></i> Sign in with Google
                  </button>
                </div>
                <div className="d-grid">
                  <button className="btn btn-sm text-white text-uppercase p-3" style={{'background-color':'#3B5998'}} onClick={signInWithFacebook}>
                    <i className="fab fa-facebook-f me-2"></i> Sign in with Facebook
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login;