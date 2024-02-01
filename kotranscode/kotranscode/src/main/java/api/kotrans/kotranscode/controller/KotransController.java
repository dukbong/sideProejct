package api.kotrans.kotranscode.controller;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
import lombok.extern.slf4j.Slf4j;

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
@Slf4j
@RequestMapping("/api")
public class KotransController {
	// private final DynamicDataSourceManager dynamicDataSourceManager;
	private final DynamicDatabaseService dynamicDatabaseService;
	// private final DynamicDataSource dynamicDataSource;
	private final KoTransCode koTransCodeImpl;

	// 직접 글자 입력 받은 후 변경하여 보여주는 메소드
	@PostMapping("/koTransCode")
	public TransformationRequest koTransCode(@RequestBody TransformationRequest req) {
		return koTransCodeImpl.CodeExchange(req);
	}

	// 첨부파일을 받은 후 디렉토리를 돌며 확장자를 찾아 진행하는 메소드
	@PostMapping("/koTransCode2")
	public ResponseEntity<ZipFile> koTransCode2(@RequestParam("file") MultipartFile file,
												@RequestParam("searchList") String searchList, @RequestParam("searchQuery") String searchQuery,
												@RequestParam("driver") String driver, @RequestParam("username") String username,
												@RequestParam("password") String password, @RequestParam("url") String url,
												@RequestParam("prefix") String prefix, @RequestParam("suffix") String suffix,
												@RequestParam("exprefix") String exprefix, HttpSession session) {
		log.debug("{}","koTransCode2");
		String[] exprefixArr = Arrays.stream(exprefix.split(","))
					                 .map(String::trim)
					                 .toArray(String[]::new);
		String[] listarr = searchList.split(",");
		
		DbInfo dbInfo = new DbInfo(url, username, password, driver, listarr, exprefixArr, searchQuery, prefix, suffix);
		dbInfo.dbCheck();
		// 세션에 저장
		DbInfo checkDbInfo = (DbInfo) session.getAttribute("dbInfo");
		if (checkDbInfo == null || !checkDbInfo.equals(dbInfo)) {
			// null이면 세션에 저장되어있는게 없기 때문에 새롭게 session에 저장
			// 세션에 저장되있는것과 지금 입력된 값이 다르면 새롭게 세션에 저장
			session.setAttribute("dbInfo",
					new DbInfo(dbInfo.getUrl(), dbInfo.getUsername(), dbInfo.getPassword(), dbInfo.getDriver(),
							dbInfo.getSearchList(), dbInfo.getExprefix(), dbInfo.getSearchQuery(), dbInfo.getPrefix(), dbInfo.getSuffix()));
		}

		try {
			ZipFile zip = koTransCodeImpl.CodeExchange2(file, dbInfo);
			return ResponseEntity.ok().body(zip);
		} catch (Exception e) {
			return ResponseEntity.ok().body(null);
		}
	}

	@GetMapping("/queryTest")
	public List<ResultDao> queryTest(@RequestParam("searchQuery") String searchQuery,
								 	 @RequestParam("driver") String driver, @RequestParam("username") String username,
								 	 @RequestParam("password") String password, @RequestParam("url") String url) {
		try {
			DbInfo dbInfo = new DbInfo(url, username, password, driver, searchQuery);
			dbInfo.dbCheck();
			return dynamicDatabaseService.connectToDatabase(dbInfo);
		} catch (Exception e) {
			return null;
		}
	}

	@GetMapping("/currentInfo")
	public DbInfo currentInfo(HttpSession session) {
		DbInfo dbInfo = (DbInfo) session.getAttribute("dbInfo");
		return dbInfo;
	}
}