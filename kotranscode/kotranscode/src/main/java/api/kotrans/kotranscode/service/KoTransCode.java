package api.kotrans.kotranscode.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import api.kotrans.kotranscode.domain.DbInfo;
import api.kotrans.kotranscode.domain.TransformationRequest;
import api.kotrans.kotranscode.domain.ZipFile;

public interface KoTransCode {

	TransformationRequest CodeExchange(TransformationRequest req);

//	ZipFile CodeExchange2(MultipartFile file, String[] searchCondition, String searchQuery);
	ZipFile CodeExchange2(MultipartFile file, DbInfo dbInfo);

	List<String> testCode(String query);

}
