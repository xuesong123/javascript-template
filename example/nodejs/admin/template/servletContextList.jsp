<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>Application Management Console</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<style type="text/css">
body{font-size: 14px;}
table{
    width: 100%;
    border-spacing: 0px 0px;
    border-collapse: collapse;
    background-color: #ffffff;
}

table, table td, table th{
    border: 1px #cdcdcd solid;
    border-collapse: collapse;
}

table tr td{padding-left: 4px;}

table.highlight tr.old{
    background-color: #ffffff;
}

table.highlight tr.even{
    background-color: #f9f9f9;
}

table.highlight tr.hover{
    background-color: #e8f5fe;
}

table.highlight tr.clicked{
    background-color: #ffffdd;
}
</style>
</head>
<body>
<t:include file="/include/common/header.jsp"/>
<div class="wrap">
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
                <td>${servletContext.path}</td>
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