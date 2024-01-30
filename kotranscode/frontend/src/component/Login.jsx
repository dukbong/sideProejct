import axios from "axios";
import React, {useState, Redirect} from "react";
function Login({onLogin}){
    const [isLoggedIn, setLoggedIn] = useState(false);

    const loginInfo = {};

    const loginHander = () => {
        const login = document.querySelectorAll("#loginDiv input[type=text]");
        if(login[0].value === ''){
            alert("DB url은 필수 값입니다.");
            return;
        }else{
            loginInfo.url = login[0].value;
        }

        if(login[1].value === ''){
            alert("username은 필수 값입니다.");
            return;
        }else{
            loginInfo.username = login[1].value;
        }

        loginInfo.password = login[2].value;

        axios.post('dblogin', loginInfo, {
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        .then((res) => {
            console.log(res.data);

            if(loginInfo.url === '' || login.username === ''){
                throw new Error("err");
            }
            if(res.data === 'y'){
                console.log("login success");
                setLoggedIn(true);
                onLogin();
            }else{
                throw new Error("login Error");
            }
        })
        .catch((err) => {
            alert("Login Error!");
        });
       
        if (isLoggedIn) {
            return <Redirect to="/home" />;
        }
    }

   
    

    return (
        <div id="loginDiv" style={{color:"white", fontSize:"20px"}}>
            DB 정보를 입력해주세요.
            {/* <div id = 'dbTypeBoxDiv'style={{height: "20%", backgroundColor:"gray"}}>
                DB 종류<br/>
                <label for='Oracle'>Oracle</label>
                <input id = 'Oracle' type="checkbox" name='Oracle' value='Oracle'/>
                <label for='h2'>h2</label>
                <input id = 'h2' type="checkbox" name='h2' value='h2'/>
            </div>  */}
            <div>
            DataBaseURL : <input type="text" id="url" name="url" style={{width: "150px"}}/>
            </div>
            <div>
            DB username : <input type="text" id="username" name="username" style={{width: "150px"}}/>
            </div>
            <div>
            DB password : <input type="text" id="password" name="password" style={{width: "150px"}}/>
            </div>
            <div>
                <button id="loginbtn" onClick={loginHander}>LOGIN</button>
            </div>
        </div>
    );

}

export default Login;