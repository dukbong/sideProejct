package api.kotrans.kotranscode.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import api.kotrans.kotranscode.domain.LangMstr;
import api.kotrans.kotranscode.domain.QueryInfo;
import api.kotrans.kotranscode.domain.ResultDao;

@Mapper
public interface KoTransCodeDao {

	String getCode(String oldChar);

	void addCode(LangMstr insertData);

	String getLastCode();

	// 접속 테스트
	List<ResultDao> connTest(String query);
	
	// 실제 변환을 도와주는 쿼리
	String getKoCode(QueryInfo queryInfo);

	// 첨부 전 쿼리 테스트
	List<String> testCode(String query);
}
