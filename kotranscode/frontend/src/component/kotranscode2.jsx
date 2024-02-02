import axios from "axios";
import React, { useState, useEffect } from "react";
import "./kotranscode.css";
import "./kotranscode2.css";
import Ads from './ads.jsx';

// 첨부파일 형식으로 디렉토리 구조를 주면 확장자를 찾아서 변경후 디렉토리 구조 그대로 반환해준다.
function Kotranscode2() {
  const fileInput = React.useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [directory, setDirectory] = useState([]);

  useEffect(() => {
    // axios.get("/api/currentInfo") // deploy
    axios.get("/currentInfo") // local
    .then((res) => {
      if(res.data !== ''){
        document.getElementById("url").value = res.data.url;
        document.getElementById("username").value = res.data.username;
        document.getElementById("password").value = res.data.password;
        document.getElementById("driver").value = res.data.driver;
        document.getElementById("searchQuery").value = res.data.searchQuery;
        document.getElementById("prefix").value = res.data.prefix;
        document.getElementById("suffix").value = res.data.suffix;
        const searchList = res.data.searchList;
        Array.from(searchList).forEach((i) => {
          const checkbox = document.querySelectorAll("#extensionFiled input[type=checkbox]");
          Array.from(checkbox).forEach((j) => {
            if(j.value === i){
              j.checked = true;
            }
          })
        })
        const excludePrefix = Array.from(res.data.exprefix);
        let exprefixStr = "";
        for(let i = 0; i < excludePrefix.length; i++){
          exprefixStr += excludePrefix[i]
          if(i !== excludePrefix.length - 2){
            exprefixStr += ",";
          }
        }
        document.getElementById("exprefix").value = exprefixStr;
      }
    })
  }, []);

  const handleChange = (e) => {
    // console.log(e.target.files[0]); // 파일 정보를 알 수 있다. [마지막 수정일, 이름, 확장자, 사이즈]
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = () => {

    if(document.getElementById("url").value === '' || document.getElementById("username").value === '' ||
       document.getElementById("prefix").value === '' || document.getElementById("searchQuery").value === '' ||
       !(document.querySelectorAll("#extensionFiled #jsp")[0].checked || document.querySelectorAll("#extensionFiled #js")[0].checked)){
        alert("Please enter all required values.");
        return;
       }

    if (selectedFile) {
      const formData = new FormData();
      // 1. 첨부 파일
      formData.append("file", selectedFile);
      // 2. 검색 확장자 리스트
      let checkArr = [];
      // const checklist = document.querySelectorAll('#checkboxDiv input[type="checkbox"]');
      const checklist = document.querySelectorAll('#extensionFiled input[type="checkbox"]');
      checklist.forEach((checkbox) => {
        // console.log("value = " + checkbox.value + ", checked = " + checkbox.checked);
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
      formData.append("prefix", document.getElementById("prefix").value);
      formData.append("suffix", document.getElementById("suffix").value);
      formData.append("exprefix", document.getElementById("exprefix").value);
         

      // document.getElementById("changing").style.display = "block";
      document.getElementById("sendfile").disabled = true;
      document.getElementById("filechang").disabled = true;
      document.getElementById("loading-spinner").style.display = "inline-block";

      setDirectory([]);

      axios
        // .post("/api/koTransCode2", formData, { // deploy
        .post("/koTransCode2", formData, { // local
          // responseType: "arraybuffer",
          // headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
          // console.log(response.data);
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
    // axios.get('/api/queryTest', { // deploy
    axios.get('/queryTest', { // local
      params : {
        searchQuery : document.getElementById("searchQuery").value,
        driver : document.getElementById("driver").value,
        username : document.getElementById("username").value,
        password : document.getElementById("password").value,
        url : document.getElementById("url").value
      }
    })
    .then((res) => {
      if(res.data === ''){
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
      alertStr += "key           value\n";
      for(let i = 0; i < testShow.length; i++){
        alertStr += testShow[i].transKey + "           " + testShow[i].transValue + "\n";
      }
      if(testShow.length >= 4){
        alertStr += "...\n";
      }
      alert(alertStr);
    })
    .catch((err) => {
      alert("알수 없는 오류 발생! 쿼리문을 재작성해주세요.");
      // console.log(err);
    })
  }

  const [excludeFiles, setExcludeFiles] = useState([]);

  const handleAddFile = () => {
    const newExcludeFiles = [...excludeFiles, `excludeFile${excludeFiles.length + 2}`];
    setExcludeFiles(newExcludeFiles);
  };

  const handleCancelFile = (index) => {
    const newExcludeFiles = excludeFiles.filter((file, i) => i !== index);
    setExcludeFiles(newExcludeFiles);
  };

  return (
    <div>
    <div style={{display : "flex", height:"100%"}}>
    <div style={{height:"500px", width:"600px", backgroundColor: "#31353f"}}>
      <div style={{width:"555px", paddingTop:"40px", paddingRight:"50px", paddingLeft:"15px"}}>
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
            <td style={{width:"60%"}}><input type="text" id="password" name="password" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="ex) password, Can be omitted if not present"/></td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left"}}>DRIVER</td>
            <td style={{width:"60%"}}><input type="text" id="driver" name="driver" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="Please read the user manual."/></td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>QUERY<span className="requ"> *</span></td>
            <td style={{display:"flex"}}>
              <input type="text" id="searchQuery" name="searchQuery" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="ex) SELECT KO, CODE FROM LANG"/>
              <button onClick={queryTest} style={{width:"16%", marginLeft:"1%", boxSizing: "border-box"}} className="custom-button">TEST</button>
            </td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>PREFIX + SUFFIX<span class="requ"> *</span></td>
            <td style={{display: "flex"}}>
              <input type="text" id="prefix" name="prefix" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="ex) ${msg."/>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "white", width: "100%", boxSizing: "border-box", marginLeft: "1%", marginRight: "1%" }}>
                CODE
              </div>
              <input type="text" id="suffix" name="suffix" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="ex) }"/>
            </td>
          </tr>
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>EXCLUDE PREFIX</td>
            <td style={{width:"60%"}}><input type="text" id="exprefix" name="exprefix" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="Please write a prefix to exclude when searching."/></td>
          </tr>
          <tr>
            <td style={{ width: "40%", color: "white", textAlign: "left", fontWeight: "bold" }}>EXCLUDED FILES</td>
            <td style={{ display: "flex"}}>
              <input type="text" id="excludeFile1" name="excludeFile1" style={{width:"100%",height : "30px", boxSizing: "border-box"}} placeholder="File you want to exclude."/>
              <button onClick={handleAddFile} style={{width:"16%", marginLeft:"1%", boxSizing: "border-box"}} className="add-custom-button">+</button>
            </td>
          </tr>
          {excludeFiles.map((file, index) => (
                <tr>
                  <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}></td>    
                  <td  style={{ display: "flex"}}>
                    <input
                      type="text"
                      id={file}
                      name={file}
                      style={{width:"100%",height : "30px", boxSizing: "border-box"}}
                      placeholder="File you want to exclude."
                    />
                    <button
                      style={{width:"16%", marginLeft:"1%", boxSizing: "border-box"}}
                      className="cancel-custom-button"
                      onClick={() => handleCancelFile(index)}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
          <tr>
            <td style={{width:"40%", color: "white", textAlign:"left", fontWeight:"bold"}}>EXTENSION<span className="requ"> *</span></td>       
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

    </div>
    <div style={{width:"20px"}}></div>
      <div style={{height:"500px", width:"100%", backgroundColor: "#31353f"}}>
        <div id="directoryarea" style={{paddingLeft:"10px",textAlign:"left" ,background:"#31353f",color:"white",display:"none", height: "100%", overflowY: "scroll"}}>
          <ui>
        {directory.map((item, index) => {
    const updatedItem = item.replace('_$UPDATE', '').replace('_$INSERT', ''); // ^update와 ^insert 제거

    return (
        <li key={index} className={item.includes('_$UPDATE') ? 'update' : (item.includes('_$INSERT') ? 'insert' : '')} style={{fontSize:"18px"}}>
            <span className="circle" style={{fontSize:"20px"}} ></span>{updatedItem}
        </li>
    );
})}
</ui>
        </div>
      </div>
    </div>
              <Ads/>
    </div>
  );
}

export default Kotranscode2;
