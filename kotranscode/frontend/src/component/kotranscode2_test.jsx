import axios from "axios";
import React, { useState } from "react";
import "./kotranscode.css";
import "./kotranscode2.css";

// 첨부파일 형식으로 디렉토리 구조를 주면 확장자를 찾아서 변경후 디렉토리 구조 그대로 반환해준다.
function Kotranscode2() {
  const fileInput = React.useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [directory, setDirectory] = useState([]);

  // const handleButtonClick = (e) => {
  //   fileInput.current.click();
  // };

  const handleChange = (e) => {
    // console.log(e.target.files[0]); // 파일 정보를 알 수 있다. [마지막 수정일, 이름, 확장자, 사이즈]
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      document.getElementById("changing").style.display = "block";
      document.getElementById("sendfile").disabled = true;
      document.getElementById("filechang").disabled = true;
      document.getElementById("loading-spinner").style.display = "inline-block";

      // 검색 확장자 리스트
      let checkArr = [];
      const checklist = document.querySelectorAll('#checkboxDiv input[type="checkbox"]');

      checklist.forEach((checkbox) => {
        console.log("value = " + checkbox.value + ", checked = " + checkbox.checked);
        if(checkbox.checked){
          checkArr.push(checkbox.value);
        }
      });
      formData.append("searchList", checkArr);
      formData.append("searchQueryss", document.getElementById("searchQueryss").value);
      formData.append("driver", document.getElementById("driver").value);
      formData.append("url", document.getElementById("url").value);
      formData.append("username", document.getElementById("username").value);
      formData.append("password", document.getElementById("password").value);

      axios
        .post("koTransCode2", formData, {
          // responseType: "arraybuffer",
          // headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
          console.log(response.data);
          // console.log(response.data.directory);
          // console.log(response.data.zipfile);

          // // 처리가 완료된 후에 원하는 작업 수행

          // setZipFileData(response.data.zipfile);
          setDirectory([...response.data.directory]); // 변경 감지
          document.getElementById("directoryarea").style.display = "block";
          document.getElementById("directoryTitle").style.display="block";
          // setShowDownloadConfirmation(true);

          // base64
          const byteArray = Uint8Array.from(atob(response.data.zipfile), c => c.charCodeAt(0));

          const blob = new Blob([new Uint8Array(byteArray)], { type: "application/zip" });

          // const blob = new Blob([response.data], { type: "application/zip" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;

          link.setAttribute(
            "download",
            new Date().getTime() + "_" + selectedFile.name
          );
          document.body.appendChild(link);
          link.click();

          // 다운로드 후에는 리소스 해제
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          document.getElementById("changing").style.display = "none";
          document.getElementById("sendfile").disabled = false;
          document.getElementById("filechang").disabled = false;
        })
        .catch((error) => {
          alert("오류 발생");
          console.error("Error uploading file:", error);
          document.getElementById("sendfile").disabled = false;
          document.getElementById("filechang").disabled = false;
          document.getElementById("changing").style.display = "none";
        });
    }else{
      alert("첨부 파일이 없습니다.");
    }
  };

  const queryTest = () => {
    axios.get('queryTest', {
      params : {
        query : document.getElementById("searchQuery").value
      }
    })
    .then((res) => {
      let testShow = [];
      console.log(res.data);
      console.log(res.data[0]);
      let originLen = Array.from(res.data).length;
      if(res.data[0] === '^err$'){
        throw new Error("err Error");
      }
      Array.from(res.data).length = 4;

      if(originLen < 4){
        for(let i = 0; i < originLen; i++){
          testShow.push(res.data[i]);
        }
      }else{
        for(let i = 0; i < 4; i++){
          testShow.push(res.data[i]);
        }
      }
      let alertStr = "테스트 결과\n 조회할 컬럼은 하나여야 합니다.\n둘이상일 경우 첫번쨰 컬럼만 보여집니다.\n";
      for(let i = 0; i < testShow.length; i++){
        alertStr += testShow[i] + "\n";
      }
      if(testShow.length >= 4){
        alertStr += "...\n";
      }
      alertStr += "원하는 결과가 맞다면 '확인' 아니라면 '취소'를 눌러주세요."
      const shouldDelete = window.confirm(alertStr);

    })
    .catch((err) => {
      alert("알수 없는 오류 발생! 쿼리문을 재작성해주세요.");
      console.log(err);
    })
  }


  return (
    <div style={{height:"100%", width:"100%", backgroundColor: "black"}}>

<div style={{width:"500px"}}>
        <table>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>URL : </td>
            <td style={{width:"60%"}}><input type="text" id="url" name="url" style={{width:"100%"}}/></td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>USERNAME : </td>
            <td style={{width:"60%"}}><input type="text" id="username" name="username" style={{width:"100%"}}/></td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>PASSWORD : </td>
            <td style={{width:"60%"}}><input type="text" id="password" name="password" style={{width:"100%"}}/></td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left"}}>DRIVER : </td>
            <td style={{width:"60%"}}><input type="text" id="driver" name="driver" style={{width:"100%"}}/></td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>QUERY : </td>
            <td style={{width:"50%"}}><input type="text" id="searchQueryss" name="searchQueryss" style={{width:"100%"}}/></td>
            <td style={{width:"10%"}}><button onClick={queryTest} style={{width:"100%", marginLeft:"5px"}}>Test</button></td>
          </tr>
        </table>
        
      </div>


      <div id = 'checkboxDiv'style={{height: "20%", backgroundColor:"gray"}}>
        검색 확장자 : <br/>
        <label for='jsp'>.jsp</label>
        <input id = 'jsp' type="checkbox" name='jsp' value='.jsp'/>
        <label for='js'>.js</label>
        <input id = 'js' type="checkbox" name='js' value='.js'/>
        <label for='html'>.html</label>
        <input id = 'html' type="checkbox" name='html' value='.html'/>
        <label for='java'>.java</label>
        <input id = 'java' type="checkbox" name='java' value='.java'/>
      </div> 

      <div id = 'excludeDiv'style={{height: "20%", backgroundColor:"gray"}}>
        제외하고자 하는 파일명 : <input id='excludefile'type="text" name = "excludefile"/><br/>
        ex) test.java, test.jsp, test.js <br/>
        
      <div id = 'startQuery'>
        검색 쿼리 입력 : <input id='searchQuery'type="text" name = "searchQuery"/>
        <button onClick={queryTest}>Test</button>
      </div>
      </div> 

      <div style={{height: "10%", marginTop:"20px"}}>
        <input
          id="filechang"
          type="file"
          ref={fileInput}
          onChange={handleChange}
          // style={{ display: "none" }}
          readOnly
          style={{
            color:"white",
            fontSize: "15px",
            textAlign: "center",
          }}
        />
        <button id="sendfile" style={{fontSize: "15px"}} onClick={handleFileUpload}>파일 전송</button>
        <p style={{color:"white", fontSize:"15px"}}>자동으로 다운로드 됩니다.</p>
        <p id="changing" style={{fontSize:"15px"}}>파일 변환 중--<span id="loading-spinner"></span></p>

      </div>
      <div style={{backgroundColor: "gray", height:"10%", textAlign:"left"}}>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [사용 설명]<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 스프링 프로젝트의 src 폴더를 zip형식으로 압축한다.<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 변환이 필요한 확장자를 선택한다.<br/><br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;압축 파일의 디렉토리 구조&gt;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |--- src<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |--- main<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |--- test<br/>
        <br/><br/>
        추가 기능<br/>
        2. 제외 파일 적용하기<br/><br/>
        추후<br/>
        1. 디자인


      </div>
      <div style={{backgroundColor: "red", height:"10%"}}></div>
       <div id="directoryTitle"style={{color:"white", fontSize:"20px", display:"none"}}>Directory Structure</div>
       <div id="directoryarea" style={{textAlign:"left" ,background:"black",color:"white",display:"none", height: "300px", overflowY: "scroll"}}>
            {directory.map((item, index) => {
                const updatedItem = item.replace('^update', ''); // ^update 제거

                return (
                    <li key={index} style={{ color: item.includes('^update') ? 'red' : 'white' }}>
                        {updatedItem}
                    </li>
                );
            })}
          </div>
    </div>
  );
}

export default Kotranscode2;
