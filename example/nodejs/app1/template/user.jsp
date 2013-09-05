<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>test</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
</head>
<body>
<t:include file="/include/common/header.jsp"/>
<p><a href="${contextPath}/userlist/1.html">userlist</a></p>
<h4>user.userId: ${user.userId}</h4>
<h4>user.userName: ${user.userName}</h4>
<h4>user.userAge: ${user.userAge}</h4>
<h4>user.birthday: <fmt:formatDate value="${user.birthday}" pattern="yyyy-MM-dd"/></h4>
<t:include file="/include/common/footer.jsp"/>
</body>