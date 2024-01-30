package api.kotrans.kotranscode.domain;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransformationRequest {
	
	private String form; // javascript, html
	
	private String code;
	
	private int count;
	
	private List<Integer> line = new ArrayList<>();

}
