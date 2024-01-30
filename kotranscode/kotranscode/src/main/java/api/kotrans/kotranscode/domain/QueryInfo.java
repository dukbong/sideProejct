package api.kotrans.kotranscode.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// 쿼리 정보
public class QueryInfo {
	private String query;
	private String oldChar;
}
