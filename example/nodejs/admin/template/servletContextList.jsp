<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>test</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<style type="text/css">
body{font-size: 14px;}
div.pagebar{clear: both;}
div.pagebar a{float: left; margin-left: 4px; padding: 0px 4px; height: 20px; display: block; text-decoration: none; cursor: none;}
div.pagebar a.block{float: left; margin-left: 4px; padding: 0px 4px; height: 20px; border: 1px solid #c0c0c0; display: block; text-decoration: none; cursor: pointer;}
div.pagebar a.active{background: #c0c0c0;}
div.pagebar input{width: 30px;}
h3{margin-top: 10px;}
</style>
</head>
<body>
<t:include file="/include/common/header.jsp"/>
<h1>Application Admin Console</h1>
<hr/>
<p></p>
<table border="1" style="width: 800px;">
    <tr>
        <td>Host</td>
        <td>Home</td>
        <td>Path</td>
        <td>Status</td>
        <td>Operate</td>
    </tr>
    <c:forEach items="${servletContextList}" var="servletContext" varStatus="status">
        <tr>
            <td>${servletContext.host}</td>
            <td>${servletContext.home}</td>
            <td>${servletContext.path}</td>
            <td title="status: ${servletContext.status}">
                <c:choose>
                    <c:when test="${servletContext.status == 0}"><span style="color: #ff0000;">stoped</span></c:when>
                    <c:when test="${servletContext.status == 1}"><span style="color: #ffff00;">starting</span></c:when>
                    <c:when test="${servletContext.status == 2}"><span style="color: #00ff00;">running</span></c:when>
                    <c:when test="${servletContext.status == 3}"><span style="color: #00ff00;">stopping</span></c:when>
                    <c:otherwise><span style="color: #000000;">unknown</span></c:otherwise>
                </c:choose>
            </td>
            <td>
                <c:if test="${servletContext.admin != true}">
                    <a href="/admin/restart.do?contextPath=${servletContext.path}">restart</a>
                    <a href="/admin/shutdown.do?contextPath=${servletContext.path}">shutdown</a>
                </c:if>
            </td>
        </tr>
    </c:forEach>
</table>

<t:include file="/include/common/footer.jsp"/>
</body>