package api.kotrans.kotranscode.config;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ChangeQueryConfig {
	public static String changeQuery(String query) {
		query = query.toUpperCase();
		String pattern = "SELECT(.*?)FROM";
		Pattern regex = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
		Matcher matcher = regex.matcher(query);

		List<String> resultList = new ArrayList<>();
		if (matcher.find()) {
			String result = matcher.group(1).trim();
			String[] resultArr = result.split(",");
			for (String str : resultArr) {
				str = str.trim(); // 우선 공백 제거
				if (str.split(" ").length != 1) {
					resultList.add(str.split(" ")[0]);
				} else {
					resultList.add(str);
				}
			}
			if (resultList.size() > 2) {
				return "There are many columns.";
			} else {
				// 사용자 쿼리를 DAO에서 가져올 수 있도록 수정
				try {

					for (int i = 0; i < 2; i++) {
						if (i == 0) {
							query = query.replaceFirst("\\b" + resultArr[0].trim() + "\\b",
									resultList.get(0) + " AS TRANSKEY");
						} else {
							query = query.replaceFirst("\\b" + resultArr[1].trim() + "\\b",
									resultList.get(1) + " AS TRANSVALUE");
						}
					}

					return query;
				} catch (ArrayIndexOutOfBoundsException e) {
					return "There are few columns.";
				}
			}
		} else {
			return "This is an invalid SQL query.";
		}
	}
}
