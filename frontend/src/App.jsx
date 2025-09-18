import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"
import LoginPage from './components/LoginPage';
import CreateAccount from './components/CreateAccount';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/createaccount' element={<CreateAccount />} />
      </Routes>

      <Toaster position="top-right" richColors />

    </Router>
  )
}

export default App
