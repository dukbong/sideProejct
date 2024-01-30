package api.kotrans.kotranscode.domain;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LangMstr {
	
	private Long lnagMastrSeq;
	
	private String langNm;
	
	private char useAt;
	
	private char deleteAt;
	
	private String lastChangerId;
	
	private LocalDateTime lastChangeDt;
	
	private String LangCode;
	
}
