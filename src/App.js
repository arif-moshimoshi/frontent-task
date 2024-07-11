import logo from './logo.svg';
import './App.css';
import AddTask from './Pages/TaskCreation';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TaskList from './Pages/TaskList';


function App() {
  return (    
    <BrowserRouter>
    
    <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/create" element={<AddTask mode="create" />} />
        <Route path="/create/:taskId" element={<AddTask mode="edit" />} />

    </Routes>
</BrowserRouter>

  );
}

export default App;
