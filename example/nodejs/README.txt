nodejs web application example

1. app1.js
> node app1.js

@see
# urlrewrite
http://localhost/userlist/118.html rewrite: http://localhost/user/userList.do
http://localhost/user/821.html     rewrite: http://localhost/user/user.do

# jsp & servlet
http://localhost/user/userList.do
http://localhost/user/user.do
http://localhost/test/exceptionTest.do

# struts action & spring mvc
http://localhost/person/test1.html
http://localhost/person/test1/test2.html

1. admin.js
> node admin.js

Application Management Console
----------------------------------------------------------------------------
     all application:    http://localhost/admin/list.do
 restart application:    http://localhost/admin/restart.do?contextPath=/
shutdown application:    http://localhost/admin/shutdown.do?contextPath=/