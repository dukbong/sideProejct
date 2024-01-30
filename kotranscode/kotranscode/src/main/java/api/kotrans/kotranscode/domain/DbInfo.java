package api.kotrans.kotranscode.domain;

import java.util.Arrays;

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
public class DbInfo{

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



	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((driver == null) ? 0 : driver.hashCode());
		result = prime * result + ((password == null) ? 0 : password.hashCode());
		result = prime * result + Arrays.hashCode(searchList);
		result = prime * result + ((searchQuery == null) ? 0 : searchQuery.hashCode());
		result = prime * result + ((url == null) ? 0 : url.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		return result;
	}



	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		DbInfo other = (DbInfo) obj;
		if (driver == null) {
			if (other.driver != null)
				return false;
		} else if (!driver.equals(other.driver))
			return false;
		if (password == null) {
			if (other.password != null)
				return false;
		} else if (!password.equals(other.password))
			return false;
		if (!Arrays.equals(searchList, other.searchList))
			return false;
		if (searchQuery == null) {
			if (other.searchQuery != null)
				return false;
		} else if (!searchQuery.equals(other.searchQuery))
			return false;
		if (url == null) {
			if (other.url != null)
				return false;
		} else if (!url.equals(other.url))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}

}