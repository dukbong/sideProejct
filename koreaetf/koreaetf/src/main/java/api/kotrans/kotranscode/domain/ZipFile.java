package api.kotrans.kotranscode.domain;

import java.util.ArrayList;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ZipFile {

//	private InputStreamResource zipfile; // 단독으로 보낼 경우 편리한데 뭐.. 딱히
	String zipfile;
	private ArrayList<String> directory;
}
