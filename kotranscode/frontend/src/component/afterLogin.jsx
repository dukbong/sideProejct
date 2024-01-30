
// import React, {useState} from "react";
// import Kotranscode from "./kotranscode";
import Kotranscode2 from "./kotranscode2";

function AfterLogin(){
    // const[page, setpage] = useState(0);

    // const toggleComponent = (e, level) => {
    //   setpage(level);
    //    const target = document.getElementsByClassName(e.target.className);
    //    for(let i = 0; i < target.length; i++){
    //     let targetId = target[i].id;
  
    //     if(targetId === e.target.id){
    //       target[i].style.color = "red";
    //       target[i].style.fontWeight = "bold"; 
    //     }else{
    //       target[i].style.color = "white";
    //       target[i].style.fontWeight = "nomal"; 
    //     }
    //    }
    // }

    return(
    <div>
        <div class="mainWrap" style={{display:"flex"}}>
            <h2 style={{color:"white"}}>Multilingual processing<a href = "https://github.com/dukbong" style={{fontSize:"12px"}}>creator : dukbong</a></h2>
        </div>

        {/* <div class="categoryDiv" style={{display: "flex", gap: "13px"}}>
            <span id= "javascript" class= "cateTag" style={{fontSize: "20px", color:"red", fontWeight:"bold", cursor:"pointer"}} onClick={(e) => {e.preventDefault(); toggleComponent(e, 0);}}>Version1</span>
            <span id= "jsp" class= "cateTag" style={{fontSize: "20px", color:"white", fontWeight:"bold", cursor:"pointer"}} onClick={(e) => {e.preventDefault(); toggleComponent(e, 1);}}>Version2</span>
        </div> */}
        {/* <div style={{textAlign:"center", justifyContent: "center"}}> */}
            {/* {page === 0 ? <Kotranscode/> : <Kotranscode2/>} */}
        {/* </div> */}
        <Kotranscode2/>
    </div>
    );
}

export default AfterLogin;