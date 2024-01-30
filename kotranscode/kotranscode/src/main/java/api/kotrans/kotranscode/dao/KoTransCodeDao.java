package api.kotrans.kotranscode.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import api.kotrans.kotranscode.domain.ResultDao;

@Mapper
public interface KoTransCodeDao {

	// 접속 테스트
	List<ResultDao> connTest(String query);
	
}
