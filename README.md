if## KoTransCode
**KoTransCode** is a website that helps with multilingual processing of ***jsp*** files and ***js*** files.

Reason for planning : The reason for creating this website is to solve the problem of taking a lot of time to process multiple languages.

### Design Process
Initially, the design involved receiving source code and an Excel file, where Korean text in the source code would be replaced with the corresponding entries in the Excel file.
However, the current approach allows individuals to use their own database.
The entire source code is compressed, and the server retrieves language codes from the database to convert Korean text in the source code into code snippets.

### Skill


### Check before Use
1. The jsp file and js file must be properly separated before use. Currently, characters in jsp tags are coded properly, but in the case of js files, only Korean characters can be coded and processed.
2. The query for retrieval can be written without distinction between lowercase and uppercase, and it is not possible to write anything other than column names when composing the query. Additionally, ***aliases should not be included***.
```SQL
-- Example query:

SELECT
  CMMN_CODE_NM, CMMN_CODE
FROM TEST_CMMN_CODE
```

### How to use the website
1. Enter your DB Url, Username, and Password. If there is no password, leave it blank.
2. In the case of DB drivers ***Oracle, MySQL 8.x, MariaDB, and H***2 can be omitted.
3. Write SQL queries for multilingual processing.
4. You can write a SQL query for multilingual processing. At this time, there ***must be two columns*** and ***no alias*** should be given to the search column.
5. Press the TEST button to check the results and confirm if they are correct, or rewrite if not.
6. When converting Hangul to any code, you must specify the prefix and suffix. The ***prefix is ​​required***, but the suffix is ​​not.
7. Select the extension you want to change.
8. Attach the attachment and press the send button.
9. The download will proceed automatically after some time.

### How to create an attachment
The extension of the attached file must be ***zip*** and the attached file must always have a ***root folder***.

It should have a directory structure like the example below.

```
--test.zip

src
│
├── main
│   ├── java ...
│   ├── resources ...  
│   └── webapp ...       
│               
└── test
    └── java ...
             
```

### How large can the attached file be?
Currently, up to 100MB is possible, and according to test results, it takes about ***35 seconds for 30MB***.
#### Enhanced Features
A buffer was used for memory management, and as a result, it took ***29 seconds based on 90MB***.

### Session content
The session is maintained for ***30 minutes*** after the first transmission, the most recent DB_Info is saved, and Url, UserName, PassWorad, Driver, Extension, and Query are automatically created.

### Directory File Structure View
- ***Green*** indicates modified source code, where changes have been completed.
- ***Red*** indicates source code that requires verification, where confirmation is needed.
- ***White*** indicates unchanged source code.
  
In the context of source code verification, blue signifies cases where the words are not present in the database, requiring attention.
