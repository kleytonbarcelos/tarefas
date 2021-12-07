import React, { useState,useEffect } from 'react';

function App(){
  const [tasks, setTasks] = useState([])
  async function handleSubmit() {
    let task = document.getElementById('novaTarefa').value
    if (task) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          name: task.trim(),
        },
      ]);
    }
  }
  useEffect(() => {
    let response = localStorage.getItem("tasks");
    let tasks = (JSON.parse(response)) || [];
    setTasks(tasks);
    //setTask("");
  }, []);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  async function editTask(id) {
    document.getElementById('tarefa').value = id
    //setTasks(newtasks);
    //let newSelecteds = selecteds.filter((item) => item != id);
    //setSelecteds(newSelecteds);
  }
  async function removeTask(id) {
    let newtasks = tasks.filter((item) => item.id !== id);
    setTasks(newtasks);
    //let newSelecteds = selecteds.filter((item) => item != id);
    //setSelecteds(newSelecteds);
  }
  // async function removeMultipleTasks() {
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
  return (
    <div className="container">
      <form className="mt-3 row" onSubmit={e => e.preventDefault()}>
        <div className="input-group mb-3">
          <input type="text" className="form-control" name="novaTarefa" id="novaTarefa" placeholder="Tarefa" aria-label="Tarefa" aria-describedby="basic-addon2" />
          <div className="input-group-append">
            <button className="btn btn-primary" onClick={()=>handleSubmit()}>Adicionar tarefa</button>
          </div>
        </div>
      </form>
      <div>{JSON.stringify(tasks)}</div>
      <div className="mt-3">
        <ul className="list-group">
          {tasks.map((task, index)=>(
            <li key={index} title={index} className="d-flex justify-content-between list-group-item" aria-current="true">
              <div>{task.name}</div>
              <div>
                <button class="me-2 btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>editTask(task.id)}>Editar</button>
                <button class="btn btn-danger" onClick={()=>removeTask(task.id)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Editar tarefa</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="tarefa" class="form-label">Tarefa</label>
                <input type="text" class="form-control" id="tarefa" placeholder="Tarefa" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
              <button type="button" class="btn btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;