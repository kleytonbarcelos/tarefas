import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";

import './firebase'
import {getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function App(){
  const [tasks, setTasks] = useState([])


  const [displayName, setDisplayName] = useState();
  const [email, setEmail] = useState();
  const [photoURL, setPhotoURL] = useState();
  function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      setDisplayName(user.displayName)
      setEmail(user.email)
      setPhotoURL(user.photoURL)
    }).catch((error) => {
      console.log(error)
      // Handle Errors here.
      // error.code;
      // error.message;
      // error.email;
      // The AuthCredential type that was used.
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
    //let newSelecteds = selecteds.filter((item) => item != id);
    //setSelecteds(newSelecteds);
  }
  // function removeMultipleTasks() {
  //   let newtasks = tasks.filter((item) => {
  //     if (!selecteds.includes(item.id)) {
  //       return item;
  //     }
  //   });
  //   setTasks(newtasks);
  //   setSelecteds([]);
  // }
  // async function handleSelectedItem(id) {
  //   if (selecteds.includes(id)) {
  //     setSelecteds(selecteds.filter((item) => item !== id));
  //   } else {
  //     setSelecteds([...selecteds, id]);
  //   }
  // }
  // async function deleteTasks() {
  //   localStorage.clear();
  //   setTasks([]);
  // }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const [newTarefa, setNewTarefa] = useState();
  const [tarefaId, setTarefaId] = useState();
  const [tarefaNome, setTarefaNome] = useState();

  return (
    <>
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/"><i className="fab fa-servicestack"></i> Quick Tarefas - <span>{displayName}</span></a>
        <div><button className="btn btn-light" onClick={signInWithGoogle}><i className="fas fa-sign-out-alt"></i> Sair</button></div>
      </div>
    </nav>
    <div className="container">
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