**KoTransCode** is a website that helps with multilingual processing of ***jsp*** files and ***js*** files.

The reason for creating this website is to solve the problem of taking a lot of time to process multiple languages.

The project consists of Front : React and Back : Spring boot.

### How to use the website
1. Enter the DB url, username, and password.
2. In the case of DB drivers ***Oracle, MySQL 8.x, MariaDB, and H***2 can be omitted.
3. Write SQL queries for multilingual processing.
4. You can write a SQL query for multilingual processing. At this time, there ***must be two columns*** and ***no alias*** should be given to the search column.
5. Press the TEST button to check the results and confirm if they are correct, or rewrite if not.
6. Select the extension you want to change.
7. Attach the attachment and press the send button.
8. The download will proceed automatically after some time.

### How to create an attachment
The extension of the attached file must be ***zip*** and the attached file must always have a ***root folder***.

It should have a directory structure like the example below.

<img width="446" alt="image" src="https://github.com/dukbong/sideProejct/assets/37864182/a32612ca-b212-49ed-9794-90fae7d4cc73">

### How large can the attached file be?
Currently, up to 100MB is possible, and according to test results, it takes about ***35 seconds for 30MB***.
