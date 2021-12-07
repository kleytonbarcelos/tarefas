import React, { useState } from 'react';

function App(){
  const [tasks, setTasks] = useState([])
  async function handleSubmit() {
    let task = document.getElementById('tarefa').value
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
  return (
    <div className="container">
    <form className="mt-3 row" onSubmit={e => e.preventDefault()}>
      <div className="input-group mb-3">
        <input type="text" className="form-control" name="tarefa" id="tarefa" placeholder="Tarefa" aria-label="Tarefa" aria-describedby="basic-addon2" />
        <div className="input-group-append">
          <button className="btn btn-primary" onClick={()=>handleSubmit()}>Adicionar tarefa</button>
        </div>
      </div>
    </form>
      <div className="mt-3">
        <ul className="list-group">
          {tasks.map((task, index)=>(<li key={index} title={index} className="list-group-item" aria-current="true">{task.name}</li>))}
        </ul>
      </div>
    </div>
  );
}

export default App;