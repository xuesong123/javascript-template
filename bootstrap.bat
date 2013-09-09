@ECHO OFF
@ECHO.
@ECHO Nodejs Jsp/Servlet Framework, version 1.0.0
@ECHO (c) 2008-2012 xuesong.net
@ECHO.
@ECHO For details, See the Jsp/Servlet Framework github: https://github.com/xuesong123
@ECHO ================================================================================
@ECHO.

@TITLE Bootstrap
@SET WEBAPP_HOME=./example/nodejs

@ECHO WEBAPP_HOME: %WEBAPP_HOME%
@ECHO  EXECUTABLE: node "bootstrap.js" "-home=%WEBAPP_HOME%"
@ECHO.
@ECHO Application Management Console - @See http://localhost/admin
@ECHO.
@ECHO.

cmd /k node "bootstrap.js" "-home=%WEBAPP_HOME%"
