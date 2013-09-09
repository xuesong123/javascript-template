<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>Application Management Console</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<link rel="stylesheet" type="text/css" href="${contextPath}/resource/css/style.css"/>
</head>
<body>
<t:include file="/include/common/header.jsp"/>
<div class="wrap">
    <p><a href="${contextPath}/exit.do" style="color: #9e0000;">shutdown server</a></p>
    <table border="1">
        <tr>
            <td>Host</td>
            <td>Home</td>
            <td>ContextPath</td>
            <td>WatchStatus</td>
            <td>Status</td>
        </tr>
        <c:forEach items="${servletContextList}" var="servletContext" varStatus="status">
            <tr>
                <td>${servletContext.host}</td>
                <td>${servletContext.getRealPath("/")}</td>
                <td><a href="${servletContext.path}" target="_blank">${servletContext.path}</a></td>
                <td title="watchStatus: ${servletContext.watchStatus}">
                    <c:choose>
                        <c:when test="${servletContext.watchStatus == 0}"><span style="color: #ff0000;">stoped</span></c:when>
                        <c:when test="${servletContext.watchStatus == 1}"><span style="color: #00ff00;">running</span></c:when>
                        <c:otherwise><span style="color: #000000;">unknown</span></c:otherwise>
                    </c:choose>
                    <a href="/admin/watch.do?contextPath=${servletContext.path}">watch</a>
                    <a href="/admin/unwatch.do?contextPath=${servletContext.path}">unwatch</a>
                </td>
                <td title="status: ${servletContext.status}">
                    <c:choose>
                        <c:when test="${servletContext.status == 0}"><span style="color: #ff0000;">stoped</span></c:when>
                        <c:when test="${servletContext.status == 1}"><span style="color: #ffff00;">starting</span></c:when>
                        <c:when test="${servletContext.status == 2}"><span style="color: #00ff00;">running</span></c:when>
                        <c:when test="${servletContext.status == 3}"><span style="color: #00ff00;">stopping</span></c:when>
                        <c:otherwise><span style="color: #000000;">unknown</span></c:otherwise>
                    </c:choose>

                    <c:if test="${servletContext.admin != true}">
                        <a href="/admin/restart.do?contextPath=${servletContext.path}">restart</a>
                        <a href="/admin/shutdown.do?contextPath=${servletContext.path}">shutdown</a>
                    </c:if>
                </td>
            </tr>
        </c:forEach>
    </table>
</div>
<div style="height: 600px;"></div>
<t:include file="/include/common/footer.jsp"/>
</body>