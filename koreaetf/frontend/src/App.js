import './App.css';
import React, {useState} from "react";
import Login from "./component/Login";
import AfterLogin from './component/afterLogin';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // 로그인 로직 처리 후
    setLoggedIn(true);
  };

  return (
    <div className="App" style={{width:"100%", height:"100%"}}>
        <AfterLogin />
    </div>
  );
}

export default App;
