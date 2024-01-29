package api.kotrans.kotranscode.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.datasource.pooled.PooledDataSource;
import org.apache.ibatis.mapping.Environment;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.transaction.TransactionFactory;
import org.apache.ibatis.transaction.jdbc.JdbcTransactionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import api.kotrans.kotranscode.config.ChangeQueryConfig;
import api.kotrans.kotranscode.dao.KoTransCodeDao;
import api.kotrans.kotranscode.domain.DbInfo;
import api.kotrans.kotranscode.domain.ResultDao;

@Service
public class DynamicDatabaseService {

	private final SqlSessionFactory sqlSessionFactory;

	@Autowired
	public DynamicDatabaseService(SqlSessionFactory sqlSessionFactory) {
		this.sqlSessionFactory = sqlSessionFactory;
	}

	public List<ResultDao> connectToDatabase(DbInfo dbInfo) {
		
		// 동적으로 DataSource 설정
		PooledDataSource dataSource = new PooledDataSource();
		dataSource.setDriver(dbInfo.getDriver());
		dataSource.setUrl(dbInfo.getUrl());
		dataSource.setUsername(dbInfo.getUsername());
		dataSource.setPassword(dbInfo.getPassword());

		// JdbcTransactionFactory를 사용하여 TransactionFactory 생성
		TransactionFactory transactionFactory = new JdbcTransactionFactory();

		// 설정된 DataSource 및 TransactionFactory로 SqlSessionFactory를 업데이트
		Environment environment = new Environment("development", transactionFactory, dataSource);

		sqlSessionFactory.getConfiguration().setEnvironment(environment);
		SqlSession sqlSession = sqlSessionFactory.openSession();
		try {
			// 접속 (세션) 확인 작업 공간
			// ===================================================
			KoTransCodeDao mapper = sqlSession.getMapper(KoTransCodeDao.class);
			Long start = System.currentTimeMillis();
			List<ResultDao> result = mapper.connTest(ChangeQueryConfig.changeQuery(dbInfo.getSearchQuery()));
			for(ResultDao rd : result) {
				System.out.println("key = " + rd.getTransKey() + ", value = " + rd.getTransValue());
			}
			Long end = System.currentTimeMillis();
			System.out.println("쿼리 실행 시간 : " + ((end - start) / 1000) + "초 소요");
			return result;
			// ===================================================
		} catch (Exception e) {
			System.out.println("query = " + ChangeQueryConfig.changeQuery(dbInfo.getSearchQuery()));
			e.printStackTrace();
			throw e;
		} finally {
			sqlSession.close();
		}
	}
}