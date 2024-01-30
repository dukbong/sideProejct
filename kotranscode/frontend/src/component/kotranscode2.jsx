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
      // 1. 첨부 파일
      formData.append("file", selectedFile);
      // 2. 검색 확장자 리스트
      let checkArr = [];
      // const checklist = document.querySelectorAll('#checkboxDiv input[type="checkbox"]');
      const checklist = document.querySelectorAll('#extensionFiled input[type="checkbox"]');
      checklist.forEach((checkbox) => {
        console.log("value = " + checkbox.value + ", checked = " + checkbox.checked);
        if(checkbox.checked){
          checkArr.push(checkbox.value);
        }
      });
      formData.append("searchList", checkArr);

      // 3. 검색 쿼리
      const searchQuery = document.getElementById("searchQuery").value;
      formData.append("searchQuery", searchQuery);

      // 4. DB정보
      formData.append("driver", document.getElementById("driver").value);
      formData.append("url", document.getElementById("url").value);
      formData.append("username", document.getElementById("username").value);
      formData.append("password", document.getElementById("password").value);
         

      // document.getElementById("changing").style.display = "block";
      document.getElementById("sendfile").disabled = true;
      document.getElementById("filechang").disabled = true;
      document.getElementById("loading-spinner").style.display = "inline-block";

      axios
        .post("koTransCode2", formData, {
          // responseType: "arraybuffer",
          // headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
          console.log(response.data);
          // setZipFileData(response.data.zipfile);
          setDirectory([...response.data.directory]); // 변경 감지
          document.getElementById("directoryarea").style.display = "block";
          // document.getElementById("directoryTitle").style.display="block";
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

          // document.getElementById("changing").style.display = "none";
          document.getElementById("sendfile").disabled = false;
          document.getElementById("filechang").disabled = false;
          document.getElementById("loading-spinner").style.display = "none";
        })
        .catch((error) => {
          alert("오류 발생");
          console.error("Error uploading file:", error);
          document.getElementById("sendfile").disabled = false;
          document.getElementById("filechang").disabled = false;
          // document.getElementById("changing").style.display = "none";
          document.getElementById("loading-spinner").style.display = "none";
        });
    }else{
      alert("첨부 파일이 없습니다.");
    }
  };

  const queryTest = () => {
    axios.get('queryTest', {
      params : {
        searchQuery : document.getElementById("searchQuery").value,
        driver : document.getElementById("driver").value,
        username : document.getElementById("username").value,
        password : document.getElementById("password").value,
        url : document.getElementById("url").value
      }
    })
    .then((res) => {
      if(res.data == ''){
        throw new Error("쿼리문 작성 오류");
      }
      let testShow = [];
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
      let alertStr = "====테스트 결과====\n조회 컬럼은 2개만 가능합니다.\nkey에는 한글 value에는 코드가 와야합니다.\n================\n";
      alertStr += "key          value\n";
      for(let i = 0; i < testShow.length; i++){
        alertStr += testShow[i].transKey + "          " + testShow[i].transValue + "\n";
      }
      if(testShow.length >= 4){
        alertStr += "...\n";
      }
      alert(alertStr);
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
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>URL<span class="requ"> *</span></td>
            <td style={{width:"100%"}}><input type="text" id="url" name="url" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="ex) jdbc:oracle:thin:@localhost:8080/test"/></td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>USERNAME<span class="requ"> *</span></td>
            <td style={{width:"60%"}}><input type="text" id="username" name="username" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="ex) username"/></td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>PASSWORD<span class="requ"> *</span></td>
            <td style={{width:"60%"}}><input type="text" id="password" name="password" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="ex) password"/></td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left"}}>DRIVER</td>
            <td style={{width:"60%"}}><input type="text" id="driver" name="driver" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="Please read the user manual."/></td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>QUERY<span class="requ"> *</span></td>
            <td style={{display:"flex"}}>
              <input type="text" id="searchQuery" name="searchQuery" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="ex) SELECT KO, CODE FROM LANG"/>
              <button onClick={queryTest} style={{width:"16%", marginLeft:"1%", boxSizing: "border-box"}} class="custom-button">TEST</button>
            </td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>PREFIX + SUFFIX<span class="requ"> *</span></td>
            <td style={{display: "flex"}}>
              <input type="text" id="searchQuery" name="searchQuery" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="ex) ${msg."/>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "white", width: "100%", boxSizing: "border-box", marginLeft: "1%", marginRight: "1%" }}>
                CODE
              </div>
              <input type="text" id="searchQuery" name="searchQuery" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="ex) }"/>
            </td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>EXTENSION<span class="requ"> *</span></td>       
            <td>
              <fieldset id="extensionFiled">
                <legend style={{color:"white"}}>Choose File Extension:</legend>
                <div style={{textAlign:"left"}}>
                  <input type="checkbox" id="jsp" name="jsp" value=".jsp"/>
                  <label for="jsp" style={{color:"white", fontSize:"18px"}}> .jsp</label>
                </div>

                <div style={{textAlign:"left"}}>
                  <input type="checkbox" id="js" name="js" value=".js"/>
                  <label for="js" style={{color:"white", fontSize:"18px"}}> .js</label>
                </div>
              </fieldset>
            </td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>FILE TAMPERING</td>
            <td>
            <input id="filechang" type="file" ref={fileInput} onChange={handleChange} readOnly style={{color:"white", fontSize: "15px", width:"80%"}}/>
            <button id="sendfile" style={{fontSize: "15px", width:"20%"}} onClick={handleFileUpload}>전송</button>
            </td>
          </tr>
          <tr>
            <td></td>
            <td><p style={{color:"white", fontSize:"15px", textAlign:"left"}}>자동으로 다운로드 됩니다.&nbsp;&nbsp;<span id="loading-spinner"></span></p></td>
          </tr>
          <tr>
            <td colSpan={2} style={{color:"white", textAlign:"left", fontWeight:"bold"}}>사용 설명서 : <a href = "https://github.com/dukbong/sideProejct">GitHub 방문</a></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </table>
        
      </div>
      <div style={{color:"red"}}>
        추가 할 기능 : prefix, suffix 넘겨서 그걸 이용해서 변조하기.
      </div>
      
       <div id="directoryarea" style={{textAlign:"left" ,background:"black",color:"white",display:"none", height: "300px", overflowY: "scroll"}}>
            {directory.map((item, index) => {
               const updatedItem = item.replace('^update', '').replace('^insert', ''); // ^update와 ^insert 제거

                return (
                    <li key={index} style={{ color: item.includes('^update') ? 'red' : (item.includes('^insert') ? 'blue' : 'white') }}>
                        {updatedItem}
                    </li>
                );
            })}
        </div>
    </div>
  );
}

export default Kotranscode2;
