package api.kotrans.kotranscode.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import api.kotrans.kotranscode.domain.DbInfo;
import api.kotrans.kotranscode.domain.ResultDao;
import api.kotrans.kotranscode.domain.TransformationRequest;
import api.kotrans.kotranscode.domain.ZipFile;
import api.kotrans.kotranscode.service.DynamicDatabaseService;
import api.kotrans.kotranscode.service.KoTransCode;
import lombok.RequiredArgsConstructor;

/*
 * 사용법 : 프로젝트의 src 압축
 * 이때 루트 폴더를 하나 만들어줘야한다.
 * 
 * test.zip 파일 내부
 * test
 * ---- src
 * ---- main
 * 
 * 루투를 기준으로 읽기 떄문이다.
 * */

@RestController
@RequiredArgsConstructor
public class KotransController {
//	private final DynamicDataSourceManager dynamicDataSourceManager;
	private final DynamicDatabaseService  dynamicDatabaseService;
//	private final DynamicDataSource  dynamicDataSource;
	private final KoTransCode koTransCodeImpl;
	
	// 직접 글자 입력 받은 후 변경하여 보여주는 메소드
	@PostMapping("koTransCode")
	public TransformationRequest koTransCode(@RequestBody TransformationRequest req) {
		return koTransCodeImpl.CodeExchange(req);
	}
	
	// 첨부파일을 받은 후 디렉토리를 돌며 확장자를 찾아 진행하는 메소드
	@PostMapping("koTransCode2")
	public ResponseEntity<ZipFile> koTransCode2(@RequestParam("file") MultipartFile file,
												@RequestParam("searchList") String searchList,
												@RequestParam("searchQuery") String searchQuery,
												@RequestParam("driver") String driver,
												@RequestParam("username") String username,
												@RequestParam("password") String password,
												@RequestParam("url") String url
												) {
		DbInfo dbInfo = new DbInfo(url, username, password, driver, searchList.split(","), searchQuery);
		dbInfo.dbCheck();
		
		try{
			ZipFile zip = koTransCodeImpl.CodeExchange2(file, dbInfo);
			return ResponseEntity.ok().body(zip);
		}catch(Exception e){
			return ResponseEntity.ok().body(null);
		}
	}
	

//	사용자 별 DB 연결
//	@PostMapping("dblogin")
//	public String dbLogin(@RequestBody DbInfo dbInfo, HttpSession session){
//		dbInfo.dbCheck(dbInfo.getUrl());
//		try{
//			// DB 접속 확인
//			if(dbInfo.getDriver() == "" || dbInfo.getDriver() == null){
//				dbInfo.dbCheck(dbInfo.getUrl());
//			}
//			session.setAttribute("dbinfo", dbInfo);
//			dynamicDatabaseService.connectToDatabase((DbInfo)session.getAttribute("dbinfo"));
//			return "y";
//		}catch(Exception e){
//			return "n";
//		}
//	}
	
	@GetMapping("queryTest")
	public List<ResultDao> queryTest(@RequestParam("searchQuery") String searchQuery,
									 @RequestParam("driver") String driver,
									 @RequestParam("username") String username,
									 @RequestParam("password") String password,
									 @RequestParam("url") String url){
		try{
			DbInfo dbInfo = new DbInfo(url, username, password, driver, searchQuery);
			dbInfo.dbCheck();
			return dynamicDatabaseService.connectToDatabase(dbInfo);
		}catch(Exception e){
			return null;
		}
	}
	
}