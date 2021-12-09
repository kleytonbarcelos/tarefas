import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import './firebase'
import {getAuth, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

const auth = getAuth();
auth.languageCode = 'it';

toast.configure()


function App(){

  const handleClick = () => toast.success('Mensagem de sucesso')


  const [isLogged, setIsLogged] = useState()
  const [user, setUser] = useState()

  function Logout(){
    localStorage.setItem('user', '')
    setIsLogged(false)

    //const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }
  function checkLogin(){
    let user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user)
      setIsLogged(true)
      setUser(user)
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log('Logged in > '+user.displayName)
    } else {
      // No user is signed in.
      console.log('You are not Logged')
    }
  }

  const [tasks, setTasks] = useState([])

  function registerUser(user){
    localStorage.setItem("user", JSON.stringify(user))
    setUser(user)
    setIsLogged(true)
  }
  function createUserWithEmail(){
    let email  = document.getElementById('email').value
    let password  = document.getElementById('password').value
    console.log(email)
    console.log(password)
    if(email && password){
//      const auth = getAuth();
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

    //const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      //const user = userCredential.user;
      registerUser(userCredential.user)
    })
    .catch((error) => {
      //const errorCode = error.code;
      //const errorMessage = error.message;
    });
  }
  function signInWithFacebook(){
    const provider = new FacebookAuthProvider();
    //const auth = getAuth();
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
    //const auth = getAuth();
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
  useEffect(()=>{
    checkLogin()
    //############################################################
    //############################################################
    let response = localStorage.getItem("tasks");
    if(response){
      response = JSON.parse(response)
      response.sort((a, b) => (a.id > b.id) ? 1 : -1)
      setTasks(response);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks]);
  function saveNewTask() {
    if (newTarefa) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          name: newTarefa.trim(),
        },
      ]);
      setNewTarefa("")
    }
  }
  function editTask(id) {
    handleShow()
    let taskSelected = tasks.filter((item) => parseInt(item.id) === parseInt(id))[0];
    setTarefaId(taskSelected.id)
    setTarefaNome(taskSelected.name)
  }
  function editTaskSave() {
    if (tarefaNome) {
      let allTasks = tasks.filter((item) => parseInt(item.id) !== parseInt(tarefaId));
      allTasks.push({
        id: parseInt(tarefaId),
        name: tarefaNome.trim(),
      })
      allTasks.sort((a, b) => (a.id > b.id) ? 1 : -1)
      setTasks(allTasks);
      handleClose()
    }
  }
  function removeTask(id) {
    let newtasks = tasks.filter((item) => parseInt(item.id) !== parseInt(id));
    setTasks(newtasks);
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const [newTarefa, setNewTarefa] = useState();
  const [tarefaId, setTarefaId] = useState();
  const [tarefaNome, setTarefaNome] = useState();

  return (
    <>
    {!isLogged ? (
        <div className="container">
          <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
              <div className="card border-0 shadow rounded-3 my-5">
                <div className="card-body p-4 p-sm-5">
                  <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
                  <form>
                    <div className="form-floating mb-3">
                      <input type="email" className="form-control" id="email" placeholder="name@example.com" />
                      <label for="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input type="password" className="form-control" id="password" placeholder="Password" />
                      <label for="floatingPassword">Password</label>
                    </div>

                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" value="" id="rememberPasswordCheck" />
                      <label className="form-check-label" for="rememberPasswordCheck">
                        Remember password
                      </label>
                    </div>
                    <div className="d-grid">
                      <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick={signInEmail}>Sign in</button>
                    </div>
                    <small className="mt-3"><a href="#" onClick={createUserWithEmail}>Create a new account</a></small>
                    <hr className="my-4" />
                    <div className="d-grid mb-2">
                      <button className="btn btn-lg text-white text-uppercase" style={{'background-color':'#EA4335'}}>
                        <i className="fab fa-google me-2"></i> Sign in with Google
                      </button>
                    </div>
                    <div className="d-grid">
                      <button className="btn btn-lg text-white text-uppercase" style={{'background-color':'#3B5998'}}>
                        <i className="fab fa-facebook-f me-2"></i> Sign in with Facebook
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <nav className="navbar bg-dark navbar-expand-lg">
            <div className="container-fluid">
              <a className="navbar-brand" href="/"><i className="fab fa-servicestack"></i> Quick Tarefas</a>
              <div className="d-flex align-items-center">
                <div className="nav-item dropdown no-caret dropdown-user me-3 me-lg-4">
                    <button className="btn btn-icon btn-transparent-dark dropdown-toggle" id="navbarDropdownUserImage" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img alt="" className="img-fluid" style={{width:32, height:32, borderRadius:'50%'}} src={user && user.photoURL} /></button>
                    <div className="dropdown-menu dropdown-menu-end border-0 shadow animated--fade-in-up" aria-labelledby="navbarDropdownUserImage">
                        <h6 className="dropdown-header d-flex align-items-center">
                            <img className="me-3" style={{'width': 64, 'height': 64, 'borderRadius':'5%'}} alt="" src={user && user.photoURL} />
                            <div className="">
                                <div>{user && user.displayName}</div>
                                <small><a href="/">{user && user.email}</a></small>
                            </div>
                        </h6>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#!" onClick={Logout}>
                            <div className="dropdown-item-icon"><i data-feather="log-out"></i></div>
                            Logout
                        </a>
                    </div>
                </div>
              </div>
            </div>
          </nav>
          <div className="container mt-3">
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              centered
              >
              <Modal.Header closeButton>
                <Modal.Title>Editar tarefa</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input type="hidden" className="form-control" value={tarefaId} />
                <div className="mb-3">
                  <label for="tarefa" className="form-label">Tarefa</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tarefaNome} 
                    onChange={e => setTarefaNome(e.target.value)}
                    autoFocus={true}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        editTaskSave()
                      }
                    }}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Fechar
                </Button>
                <Button variant="primary" onClick={()=>editTaskSave()}>Salvar</Button>
              </Modal.Footer>
            </Modal>
            <form className="mt-3 row" onSubmit={e => e.preventDefault()}>
              <div className="input-group mb-3">
                <input type="text" className="form-control" value={newTarefa} onChange={e => setNewTarefa(e.target.value)} placeholder="Tarefa" aria-label="Tarefa" aria-describedby="basic-addon2" />
                <div className="input-group-append">
                  <button className="btn btn-primary" onClick={()=>saveNewTask()}>Adicionar tarefa</button>
                </div>
              </div>
            </form>
            {/* <div>{JSON.stringify(tasks)}</div> */}
            <div className="mt-3">
              <ul className="list-group">
                {tasks.map((task, index)=>(
                  <li key={index} title={index} className="d-flex justify-content-between list-group-item" aria-current="true">
                    <div>{task.name}</div>
                    <div>
                      <span className="badge rounded-pill bg-secondary hand me-2" onClick={()=>editTask(task.id)}>Editar</span>
                      <span className="badge rounded-pill bg-danger hand" onClick={()=>removeTask(task.id)}>Excluir</span>
                      {/* <span className="me-2 badge bg-secondary hand" onClick={()=>editTask(task.id)}><i className="fa fa-edit" aria-hidden="true"></i> Editar</span>
                      <span className="badge bg-danger hand" onClick={()=>removeTask(task.id)}>Excluir</span> */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default App;