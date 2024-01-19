
@echo off
REM Change directory to your local project folder
cd "C:\minting-daps
REM Initialize local Git repository
git init

REM Add all files to the repository (or specify certain files)
git add .

REM Commit the changes
git commit -m "first commit"

REM Add your remote GitHub repository URL
git remote add origin https://github.com/tenchan000517/thirdweb-minting-dapps.git

REM Push to GitHub
git push -u origin master
