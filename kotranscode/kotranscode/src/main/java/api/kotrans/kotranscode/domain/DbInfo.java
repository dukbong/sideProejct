package api.kotrans.kotranscode.domain;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
// DB 연결
public class DbInfo {

	// private String dbType;
	private String url;
	private String username;
	private String password;
	private String driver;
	private String[] searchList;
	private String searchQuery;
	
	// Test 코드를 보내기 우한 생성자
	public DbInfo(String url, String username, String password, String driver, String searchQuery){
		this.url = url;
		this.username = username;
		this.password = password;
		this.driver = driver;
		this.searchQuery = searchQuery;
	}
	
	// dbType에 따른 드라이브 설정
	public void dbCheck() {
		if(this.driver.length() > 0){
			return;
		}
		
		if (this.url.contains("oracle")) {
			this.driver = "oracle.jdbc.driver.OracleDriver";
		} else if (this.url.contains("h2")) {
			this.driver = "org.h2.Driver";
		} else if (this.url.contains("mysql")) { // 8.x 이상
			this.driver = "com.mysql.cj.jdbc.Driver";
		} else if (this.url.contains("mariadb")) {
			this.driver = "org.mariadb.jdbc.Driver";
		}
	}

}
