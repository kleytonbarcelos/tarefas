import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";

import './firebase'
import {getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function App(){
  const [tasks, setTasks] = useState([])

  const [displayName, setDisplayName] = useState();
  const [email, setEmail] = useState();
  const [photoURL, setPhotoURL] = useState();

  function signInWithGoogle(){
    const provider = new GoogleAuthProvider()
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(user);
      setDisplayName(user.displayName)
      setEmail(user.email)
      setPhotoURL(user.photoURL)
    }).catch((error) => {
      console.log(error)
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }

  useEffect(() => {
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
    <nav className="navbar navbar-expand-lg" style={{'background-color':'#e3f2fd'}}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/"><i className="fab fa-servicestack"></i> Quick Tarefas - <span>{displayName}</span></a>
        <div className="d-flex align-items-center">
          <div class="nav-item dropdown no-caret dropdown-user me-3 me-lg-4">
              <a class="btn btn-icon btn-transparent-dark dropdown-toggle" id="navbarDropdownUserImage" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img class="img-fluid" style={{width:32, height:32, borderRadius:'50%'}} src={photoURL} /></a>
              <div class="dropdown-menu dropdown-menu-end border-0 shadow animated--fade-in-up" aria-labelledby="navbarDropdownUserImage">
                  <h6 class="dropdown-header d-flex align-items-center">
                      <img class="dropdown-user-img me-3" style={{width:64, height:64, borderRadius:'5%'}} src={photoURL} />
                      <div class="dropdown-user-details">
                          <div class="dropdown-user-details-name">{displayName}</div>
                          <small class="dropdown-user-details-email"><a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="cfb9a3baa1ae8faea0a3e1aca0a2">{email}</a></small>
                      </div>
                  </h6>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#!">
                      <div class="dropdown-item-icon"><i data-feather="log-out"></i></div>
                      Logout
                  </a>
              </div>
          </div>
        </div>
      </div>
    </nav>
    <div className="container">
      <button className="btn btn-outline-secondary btn-lg" onClick={signInWithGoogle}>Google Login</button>
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
  );
}

export default App;