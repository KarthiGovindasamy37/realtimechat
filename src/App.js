import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ForgotPage from './ForgotPage';
import TemporaryPage from './TemporaryPage';
import ConfirmPage from './ConfirmPage';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Portal from './Portal';
import ChatList from './Components/ChatList';
import Conversation from './Components/Conversation';
import Online from './Components/Online';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/forgot' element={<ForgotPage/>}/>
      <Route path='/temporary' element={<TemporaryPage/>}/>
      <Route path='/confirm' element={<ConfirmPage/>}/>
      <Route path='/portal' element={<Portal/>}>
        <Route index element={<Conversation/>}/>
        <Route path='chat' element={<ChatList/>}/>
        <Route path='online' element={<Online/>}/>
      </Route>
    </Routes>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    </BrowserRouter>
  );
}

export default App;
