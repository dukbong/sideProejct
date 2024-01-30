import axios from "axios";
import React, {useState} from "react";
import './kotranscode.css';

// 직접 입력하고 변경된 코드를 보여준다.
function KotransCode() {

    const [htmlCode, setHtmlCode] = useState("");
    const [changeCount, setChangeCount] = useState(0);
    const [changedLines, setChangedLines] = useState([]);
    const [titleName, setTitleName] = useState("Html Code");

    const htmlTransBtn = () => {

        axios.post("koTransCode", {
          form : titleName.split(" ")[0].toLowerCase().trim(),
          code : document.getElementById("originarea").value
        })
        .then((res) => {
          const newHtmlCode = res.data.code;
          const newCount = res.data.count;

          let newLine = Array.from(res.data.line);

          for(let i = 0; i < newLine.length; i++){
            newLine[i] = newLine[i] + 1;
          }
    
          if(newCount > 0){
            setHtmlCode(newHtmlCode);
            setChangeCount(newCount);
            setChangedLines(newLine);
  
            const changePointElement = document.getElementById("changePoint");
            changePointElement.style.display = "block";
          }
    
          if(newCount === 0){
            alert("변경 사항이 없습니다.");
          }
        });
    }

    const titleChange = (newTitle) => {
        setTitleName(`${newTitle} Code`);
        if(newTitle === 'JavaScript'){
          document.getElementById("titleName").style.color = "#FFEB3B";
        }else{
          document.getElementById("titleName").style.color = "white";
        }
    
        setHtmlCode("");
        document.getElementById("originarea").value = "";
    
        const changePointElement = document.getElementById("changePoint");
        changePointElement.style.display = "none";
      }

      const textAreaStyle = {
        width : "40%",
        height : "400px",
        resize : "none"
      }

    return (
      <div style={{textAlign: "center"}}>
        <div class="wrap" style={{display: "flex"}}>
            <button class="button" onClick={() => titleChange('JavaScript')}><strong>JavaScript</strong></button>
            <div style={{width: "10px"}}></div>
            <button class="button" onClick={() => titleChange('Html')}><strong>HTML</strong></button>
        </div>
        <h2 id = "titleName" style={{color : "white"}}>{titleName}</h2>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <textarea id="originarea" style={textAreaStyle}></textarea>
            <div style={{ width: '5%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                <span id="transBtn" onClick={htmlTransBtn} style={{fontWeight: "bold", fontSize: "22px", cursor:"pointer", color:"red"}}>&gt;&gt;</span>
            </div>
            <textarea id="changearea" style={textAreaStyle} value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)}></textarea>
        </div>

        <p style={{display : "none"}} id = "changePoint">
            <span style={{color: "white"}}>Change Count : {changeCount}</span>
            <br/>
            <span style={{color: "white"}}>Change Line : {changedLines.join(', ')}</span>
        </p>
      </div>
    );
}

export default KotransCode;
