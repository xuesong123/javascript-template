<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>test</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<link rel="stylesheet" type="text/css" href="console/css/console.css"/>
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
<h3>System Time: <fmt:formatDate value="${new Date()}" pattern="yyyy-MM-dd HH:mm:ss SSS"/></h3>

<h3>cacheTag test</h3>
<app:cache key="cache1" expires="10">
    <fmt:formatDate value="${new Date()}" pattern="yyyy-MM-dd HH:mm:ss SSS"/>
</app:cache>

<h3>ChooseTag test</h3>
<c:choose>
    <c:when test="${userList.length > 6}"><div>test1</div></c:when>
    <c:when test="${userList.length > 7}"><div>test2</div></c:when>
    <c:otherwise><div>test3</div></c:otherwise>
</c:choose>

<h3>OutTag test</h3>
<c:out escapeXml="true"><div>this is content</div></c:out>
<c:out><div>this is content</div></c:out>

<h3>CommentTag test</h3>
<c:comment>
    <div>Hello World !</div>
    <c:out><div>this is content</div></c:out>
</c:comment>

<h3>EL test</h3>
<div>${com.skin.util.StringUtil.trim("  123   ")}</div>

<h3>ForEachTag test1</h3>
<c:forEach begin="1" end="3" step="1" var="myvar" varStatus="status">myvar: ${myvar}&nbsp;&nbsp;</c:forEach>

<h3>ForEachTag test2</h3>
<c:forEach items="1,2,3" var="myvar" varStatus="status">myvar: ${myvar}&nbsp;&nbsp;</c:forEach>

<h3>ForEachTag test3</h3>
<c:set var="rows" value="${Math.floor((userList.length + 1) / 2)}"/>
<table border="1">
    <c:forEach items="${userList}" var="user" varStatus="status">
        <c:set var="rowNum" value="${Math.floor((status.index + 2) / 2)}"/>
        <!-- rowNum: ${rowNum}, rows: ${rows} -->
        <c:if test="${(status.index % 2) == 0}"><tr></c:if>
        <c:if test="${rowNum < rows}"><td style="width: 300px;"></c:if>
        <c:if test="${rowNum >= rows}">
            <td style="width: 200px;" test="1">
        </c:if>
        <div>rows: ${rows}, rowNum: ${rowNum}, status.index: ${status.index}</div>
        <div>user.userName: ${user.userName}</div>
        <div>user.birthday: <fmt:formatDate value="${user.birthday}" pattern="yyyy-MM-dd HH:mm:ss SSS"/></div>
        </td>
        <!-- ${status.index} ${(status.index + 1) % 2} -->
        <c:if test="${(status.index + 1) % 2 == 0}"></tr></c:if>
    </c:forEach>
    <c:if test="${userList.length % 2 != 0}"><td class="nbb">&nbsp;</td></tr></c:if>
</table>

<div style="height: 20px;"></div>
<div class="scrollpage">
    <app:scrollpage pageNum="${pageNum}" pageSize="${pageSize}" total="${userCount}" className="pagebar" href="/user/userList.do?pageNum=%s"/>
</div>

<t:include file="/include/common/footer.jsp"/>
</body>