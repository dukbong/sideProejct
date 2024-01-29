package api.kotrans.kotranscode.serviceImpl;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.FileVisitOption;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import api.kotrans.kotranscode.config.ChangeQueryConfig;
import api.kotrans.kotranscode.dao.KoTransCodeDao;
import api.kotrans.kotranscode.domain.DbInfo;
import api.kotrans.kotranscode.domain.ResultDao;
import api.kotrans.kotranscode.domain.TransformationRequest;
import api.kotrans.kotranscode.domain.ZipFile;
import api.kotrans.kotranscode.service.DynamicDatabaseService;
import api.kotrans.kotranscode.service.KoTransCode;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KoTransCodeImpl implements KoTransCode {

	private final KoTransCodeDao koTransCodeDao;
	private final DynamicDatabaseService dynamicDatabaseService;

	@Override
 	public TransformationRequest CodeExchange(TransformationRequest req) {
		StringBuilder sb = new StringBuilder();

		int count = 0;

		String[] arr = req.getCode().split("\n");

		for (int i = 0; i < arr.length; i++) {

			String row = arr[i];

			if (req.getForm().equals("html")) {
				// html code 일 경우
				row = row.replaceAll("<!--(.*?)-->", "");
				row = row.replaceAll("<%--(.*?)--%>", "");
			} else {
				// js code 일 경우
				row = row.replaceAll("/\\*(.*?)\\*/", "");
				row = row.replaceAll("//[^\n]*", "");
			}

			Pattern pattern = Pattern.compile("[가-힣]+");
			Matcher matcher = pattern.matcher(row);
			StringBuilder resultBuilder = new StringBuilder();

			while (matcher.find()) {
				resultBuilder.append(matcher.group());
				resultBuilder.append(" "); // Add space
			}

			// 한글이 존재한다면 해당 조건에 걸린 후 변경된다.
			if (!resultBuilder.toString().equals("")) {
				// 마지막 수정일을 가장 윗줄에 추가해준다.

				String oldChar = resultBuilder.toString().trim();
				row = row.replace(oldChar, "${msg.C000000649}");

				if (req.getForm().equals("html")) {
					row += " <!-- " + resultBuilder.toString() + " -->\n";
					row += " <%-- " + arr[i] + " --%>";
				} else {
					row += " // " + resultBuilder.toString() + "\n";
					row += " // " + arr[i];
				}

				sb.append(row).append("\n");

				req.getLine().add(i);
				count++;
				continue;
			}
			sb.append(arr[i]).append("\n");
		}

		req.setCode(sb.toString());
		req.setCount(count);

		return req;
	}

	@Override
//	public ZipFile CodeExchange2(MultipartFile file, String[] searchCondition, String searchQuery) {
		public ZipFile CodeExchange2(MultipartFile file, DbInfo dbInfo) {
		
		// 여기서 바로 DB 연결하고 Map으로 저장한다.
		// 아래에선 Map을 get해서 value값으로 대체한다.
		// ===========================================================
		
		dbInfo.setSearchQuery(ChangeQueryConfig.changeQuery(dbInfo.getSearchQuery()));
		List<ResultDao> resultMap = null;
		try{
			resultMap = dynamicDatabaseService.connectToDatabase(dbInfo);
		}catch(Exception e){
			throw e;
		}
		
		// ===========================================================
		
		Long start = System.currentTimeMillis();
		UUID uid = UUID.randomUUID();
		ArrayList<String> testResult = new ArrayList<>();
		ZipFile zip = new ZipFile();
		try {
			// 루트 경로를 보여준다.
			String currentWorkingDirectory = System.getProperty("user.dir");
			System.out.println("currentWorkingDirectory = " + currentWorkingDirectory);

			Path projectRoot = Paths.get(currentWorkingDirectory); // 절대 경로로 표시
			 System.out.println("projectRoot : " + projectRoot.toString());
			Path tempDirectory = Files.createDirectories(projectRoot.resolve("temp-zip")); // temp-zip이라는 폴더의  경로
			 System.out.println("temDirectory : " + tempDirectory);

			Path testDirectory = Files.createDirectories(tempDirectory.resolve(uid.toString())); // temp-zip이라는  폴더의  경로
			// Path uploadedFilePath = tempDirectory.resolve(file.getOriginalFilename());
			Path uploadedFilePath = testDirectory.resolve(file.getOriginalFilename());

			Files.copy(file.getInputStream(), uploadedFilePath, StandardCopyOption.REPLACE_EXISTING); // 폴더
																										// 생성
																										// file.getOriginalFilename()

			// String unzipDirectory = unzip(uploadedFilePath.toString(), tempDirectory.toString());
			String unzipDirectory = unzip(uploadedFilePath.toString(), testDirectory.toString());

			System.out.println("압축 해제 완료 및 폴더 생성 완료 : " + ((System.currentTimeMillis() - start) / 1000) + "초 소요");
			start = System.currentTimeMillis();

			// System.out.println("unzipDirectory : " + unzipDirectory);
			String[] directoryAddressArr = unzipDirectory.split("[\\\\/]");

			String testDir = "";
			boolean foundTemp = false;
			for (String segment : directoryAddressArr) {
				if (foundTemp) {
					testDir = segment;
					break;
				}
				if (segment.equals(uid.toString())) {
					foundTemp = true;
				}
			}

			// Directory 구조와 변경된 파일을 감지한다.
			// 이건 ZipFile.setDirectory(testResult);
			testResult.add(testDir);
			// testResult.addAll(printDirectory(unzipDirectory, tempDirectory.toString(),testDir, searchCondition));
//			testResult.addAll(printDirectory(unzipDirectory, testDirectory.toString(), testDir, searchCondition)); // 여기에 Map 추가해서 넣기.
			testResult.addAll(printDirectory(unzipDirectory, testDirectory.toString(), testDir, dbInfo.getSearchList(), resultMap)); // 여기에 Map 추가해서 넣기.

			System.out.println("디렉토리 구조 파악 및 파일 수정 까지 완료 : " + ((System.currentTimeMillis() - start) / 1000) + "초 소요");
			start = System.currentTimeMillis();

			zip.setDirectory(testResult);
			// 보낼 파일 압축
			// String newZipPath = makeZip(tempDirectory.toString(), testDir, uid);
			String newZipPath = makeZip(testDirectory.toString(), testDir, uid);

			System.out.println("압축 파일 생성 완료 : " + ((System.currentTimeMillis() - start) / 1000) + "초 소요");
			start = System.currentTimeMillis();

			// byte를 base64로 변환 후 보내기
			Path path = Paths.get(newZipPath);
			byte[] zipBytes = Files.readAllBytes(path);
			zip.setZipfile(Base64.getEncoder().encodeToString(zipBytes));

			// InputStream으로 보내기
			// InputStream inputStream = new FileInputStream(newZipPath);
			// zip.setZipfile(new InputStreamResource(inputStream));

			// 생성된 파일들 모두 삭제
			deleteFile(tempDirectory.resolve(uid.toString()));
			System.out.println("파일 삭제 완료 : " + ((System.currentTimeMillis() - start) / 1000) + "초 소요");
			start = System.currentTimeMillis();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		System.out.println("클라이언트에게 전달 완료 : " + ((System.currentTimeMillis() - start) / 1000) + "초 소요");
		return zip;
	}
	
	// dao에 연결 가능하게 쿼리 변환
	// ex) select member_id, member_name from member
	//     select member_id as key, member_name as value from member
//	public String changeQuery(String query){
//		query = query.toUpperCase();
//		String pattern = "SELECT(.*?)FROM";
//        Pattern regex = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
//        Matcher matcher = regex.matcher(query);
//
//        
//        List<String> resultList = new ArrayList<>();
//        if (matcher.find()) {
//            String result = matcher.group(1).trim();
//            String[] resultArr = result.split(",");
//            for(String str : resultArr){
//                str = str.trim(); // 우선 공백 제거
//                if(str.split(" ").length != 1){
//                    resultList.add(str.split(" ")[0]);
//                }else{
//                    resultList.add(str);
//                }
//            }
//            if(resultList.size() > 2){
//            	return "There are many columns.";
//            }else{
//                // 사용자 쿼리를 DAO에서 가져올 수 있도록 수정
//            	try{
//            		for(int i = 0; i < 2; i++){
//            			if(i == 0){
//            				query = query.replace(resultArr[0], resultList.get(0) + " AS TRANSKEY");
//            			}else{
//            				query = query.replace(resultArr[1], resultList.get(1) + " AS TRANSVALUE");
//            			}
//            		}
//            		return query;
//            	}catch(ArrayIndexOutOfBoundsException e){
//            		return "There are few columns.";
//            	}
//            }
//        } else {
//            return "This is an invalid SQL query.";
//        }
//	}

	// Files.delete() 메소드는 비어있는 폴더 또는 일반 파일만 가능하다.
	private void deleteFile(Path deleteFilePath) {
		try{
			Files.walkFileTree(deleteFilePath, EnumSet.noneOf(FileVisitOption.class), Integer.MAX_VALUE, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    Files.delete(file);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
                    // 예외 발생 시 계속 진행
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                    Files.delete(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
		}catch(IOException e){
			e.printStackTrace();
		}
	}

	private String makeZip(String filePath, String folderName, UUID uid) {
		String sourceFolderPath = filePath + "\\" + folderName;
		String zipFilePath = filePath + "\\" + uid + "_" + folderName + ".zip";
		
		try {
			zipFolder(sourceFolderPath, zipFilePath);
			System.out.println("압축이 완료되었습니다.");
		} catch (IOException e) {
			e.printStackTrace();
		}

		return zipFilePath;
	}

	public void zipFolder(String sourceFolderPath, String zipFilePath) throws IOException {
		try (FileOutputStream fos = new FileOutputStream(zipFilePath); ZipOutputStream zos = new ZipOutputStream(fos)) {

			File sourceFolder = new File(sourceFolderPath);
			zipFile(sourceFolder, sourceFolder.getName(), zos);
		}
	}

	private void zipFile(File file, String entryName, ZipOutputStream zos) throws IOException {
		if (file.isDirectory()) {
			for (File innerFile : file.listFiles()) {
				zipFile(innerFile, entryName + "/" + innerFile.getName(), zos);
			}
		} else {
			try (FileInputStream fis = new FileInputStream(file)) {
				ZipEntry zipEntry = new ZipEntry(entryName);
				zos.putNextEntry(zipEntry);

				byte[] buffer = new byte[1024];
				int len;
				while ((len = fis.read(buffer)) > 0) {
					zos.write(buffer, 0, len);
				}

				zos.closeEntry();
				fis.close();
			}
		}
	}

	// 압축 파일 해제
	private String unzip(String zipFilePath, String destDirectory) {
		String unzipDirectory = null;
		try (ZipInputStream zipInputStream = new ZipInputStream(Files.newInputStream(Paths.get(zipFilePath)))) {
			ZipEntry zipEntry = zipInputStream.getNextEntry();
			unzipDirectory = Paths.get(destDirectory, zipEntry.getName()).toString();
			while (zipEntry != null) {
				Path filePath = Paths.get(destDirectory, zipEntry.getName());
				if (!zipEntry.isDirectory()) {
					Files.createDirectories(filePath.getParent());
					Files.copy(zipInputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
				} else {
					Files.createDirectories(filePath);
				}
				zipEntry = zipInputStream.getNextEntry();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return unzipDirectory;
	}

	// 압축 푼것의 구조를 파악한다.
	private ArrayList<String> printDirectory(String directoryPath, String tempDirectory, String folderName, String[] searchCondition, List<ResultDao> resultMap) {
		ArrayList<String> list = new ArrayList<>(); // 확인용
		try (Stream<Path> paths = Files.walk(Paths.get(tempDirectory + "\\" + folderName))) {
			Path root = Paths.get(tempDirectory + "\\" + folderName);

			paths.filter(Files::isRegularFile).map(path -> root.relativize(path)).map(Path::toString).forEach(i -> {
				// i >> bin\mvn.cmd 이런식으로 나온다.
				for (int j = 0; j < searchCondition.length; j++) {
					if (i.endsWith(searchCondition[j])) {
						String fileContent = FileContent(tempDirectory, folderName, i);
						boolean check = FileWrite(tempDirectory, folderName, i, fileContent, resultMap);
						// 변경이 되었을 경우
						if (check) {
							i += "^update";
						}
						// 변경이 필요하지만 안되었을 경우
						if (!check) {
							i += "^insert"; 
						}
						break;
					}
				}
				list.add(folderName + "\\" + i);
			});

			Collections.reverse(list);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return list;
	}

	// 파일 읽기 (하나를 통으로 리턴)
	public String FileContent(String tempDirectory, String folderName, String targetFile) {
		// 파일을 열기 위해서 tempDirectory +
		// directoryAddressArr[directoryAddressArr.length - 1] + "\" + printDirectory안에 있는 지역변수 i를 합쳐줘야한다.
		StringBuilder sb = new StringBuilder();
		sb.append(tempDirectory).append("\\").append(folderName).append("\\").append(targetFile);
		String filePath = sb.toString();
		sb.setLength(0);

		try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
			String line;
			while ((line = reader.readLine()) != null) {
				sb.append(line).append("\n");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sb.toString();
	}

	// 파일 수정
	private boolean FileWrite(String tempDirectory, String folderName, String targetFile, String fileContent, List<ResultDao> resultMap) {
		boolean result = false;
		StringBuilder sb = new StringBuilder();
		sb.append(tempDirectory).append("\\").append(folderName).append("\\").append(targetFile);
		String filePath = sb.toString();

		sb.setLength(0); // 초기화

		try (BufferedWriter bw = new BufferedWriter(new FileWriter(filePath))) {
			// fileContent를 가지고 여기서 한번에 파일들을 다국어 처리 해줄꺼다.
			String[] arr = fileContent.split("\n");

			if (targetFile.endsWith(".jsp") || targetFile.endsWith(".html")) {
				// jsp 파일일 경우
				for (int i = 0; i < arr.length; i++) {

					String row = arr[i];
					row = row.replaceAll("<!--(.*?)-->", "");
					if (targetFile.endsWith(".jsp")) {
						row = row.replaceAll("<%--(.*?)--%>", "");
					}

					Pattern pattern = Pattern.compile("[가-힣]+");
					Matcher matcher = pattern.matcher(row);
					StringBuilder resultBuilder = new StringBuilder();

					while (matcher.find()) {
						resultBuilder.append(matcher.group());
						resultBuilder.append(" "); // Add space
					}

					// 한글이 존재한다면 해당 조건에 걸린 후 변경된다.
					if (!resultBuilder.toString().equals("")) {
						// =====================DB작업 : SELECT=====================
						String oldChar = resultBuilder.toString().trim();
						for(ResultDao rd : resultMap){
							if(rd.getTransKey().equals(oldChar)){
								row = row.replace(oldChar, "${msg." + rd.getTransValue() + "}");
								result = true;
							}
						}
						// =====================DB작업 : SELECT=====================
						
						row += " <!-- " + resultBuilder.toString() + " -->\n";
						if (targetFile.endsWith(".jsp")) {
							row += " <%-- " + arr[i] + " --%>\n";
						}else{
							row += " <!-- " + arr[i] + " -->\n";
						}
						
						
						sb.append(row).append("\n");

						continue;
					}
					sb.append(arr[i]).append("\n");
				}

			} else if (targetFile.endsWith(".js") || targetFile.endsWith(".java")) {
				// js 파일일 경우
				for (int i = 0; i < arr.length; i++) {

					String row = arr[i];

					row = row.replaceAll("/\\*(.*?)\\*/", "");
					row = row.replaceAll("//[^\n]*", "");

					Pattern pattern = Pattern.compile("[가-힣]+");
					Matcher matcher = pattern.matcher(row);
					StringBuilder resultBuilder = new StringBuilder();

					while (matcher.find()) {
						resultBuilder.append(matcher.group());
						resultBuilder.append(" "); // Add space
					}

					// 한글이 존재한다면 해당 조건에 걸린 후 변경된다.
					if (!resultBuilder.toString().equals("")) {
						// =====================DB작업 : SELECT=====================
						String oldChar = resultBuilder.toString().trim();
						for(ResultDao rd : resultMap){
							if(rd.getTransKey().equals(oldChar)){
								row = row.replace(oldChar, "${msg." + rd.getTransValue() + "}");
								result = true;
							}
						}
						// =====================DB작업 : SELECT=====================
						
						row += " // " + resultBuilder.toString() + "\n";
						row += " // " + arr[i];

						sb.append(row).append("\n");

						continue;
					}
					sb.append(arr[i]).append("\n");
				}

			}

			bw.write(sb.toString());

		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public List<String> testCode(String query) {
		return koTransCodeDao.testCode(query);
	}

}
