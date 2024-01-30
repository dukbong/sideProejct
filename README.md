## Issues
1. There is a mix of Korean and English in the text, so we need to figure out how to handle this.

## KoTransCode
**KoTransCode** is a website that helps with multilingual processing of ***jsp*** files and ***js*** files.

Reason for planning : The reason for creating this website is to solve the problem of taking a lot of time to process multiple languages.

The project consists of Front : React and Back : Spring boot.

### Design Process
Initially, the design involved receiving source code and an Excel file, where Korean text in the source code would be replaced with the corresponding entries in the Excel file.
However, the current approach allows individuals to use their own database.
The entire source code is compressed, and the server retrieves language codes from the database to convert Korean text in the source code into code snippets.

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

<img width="446" alt="image" src="https://github.com/dukbong/sideProejct/assets/37864182/a32612ca-b212-49ed-9794-90fae7d4cc73">

### How large can the attached file be?
Currently, up to 100MB is possible, and according to test results, it takes about ***35 seconds for 30MB***.

### Session content
The session is maintained for ***30 minutes*** after the first transmission, the most recent DB_Info is saved, and Url, UserName, PassWorad, Driver, Extension, and Query are automatically created.

### Directory File Structure View
- ***Red*** indicates modified source code, where changes have been completed.
- ***Blue*** indicates source code that requires verification, where confirmation is needed.
- ***White*** indicates unchanged source code.
  
In the context of source code verification, blue signifies cases where the words are not present in the database, requiring attention.
