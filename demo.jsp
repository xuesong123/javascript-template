<%@ page contextType="text/html; charset=UTF-8"%>
<%@ page contextType="text/html; charset=UTF-8"%>
<%@ page contextType="text/html; charset=UTF-8"%>
<%@ page contextType="text/html; charset=UTF-8"%>
<h1>Hello Ayada</h1>
<t:import name="app:cache" className="com.mytest.taglib.CacheTag"/>
<h3>System Time: <fmt:formatDate value="${new Date()}" pattern="yyyy-MM-dd HH:mm:ss SSS"/></h3>

<h3>cacheTag test</h3>

<div class="panel">
&lt;app:cache key="cache1" expires="10"&gt;
    &lt;fmt:formatDate value="&#0036;{new Date()}" pattern="yyyy-MM-dd HH:mm:ss SSS"/&gt;
&lt;/app:cache&gt;
</div>

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

<h3>Include test</h3>
<t:include file="includePage1"/>

<h3>Format Tag test1</h3>
<div class="panel">&lt;f:substring value="一二三四五六七八九十" length="16" padding="..."/&gt;</div>
<p class="bb">Result:</p>
<div class="panel"><f:substring value="一二三四五六七八九十" length="16" padding="..."/></div>

<h3>Format Tag test2</h3>
<div class="panel">&lt;f:substring length="16" padding="..."&gt;一二三四五六七八九十&lt;/f:substring&gt;</div>
<p class="bb">Result:</p>
<div class="panel"><f:substring length="16" padding="...">一二三四五六七八九十</f:substring></div>

<h3>ActionTag test</h3>
<c:action className="com.mytest.action.HelloAction" method="execute" page="actionPage1">
    <c:param name="a" value="1"/>
    <c:param name="b">2</c:param>
</c:action>

<c:action className="com.mytest.action.HelloAction2" method="execute" page="actionPage1">
    <c:param name="a" value="1"/>
    <c:param name="b">2</c:param>
</c:action>

<c:action className="com.mytest.action.HelloAction2" method="execute" page="actionPage1">
    <c:param name="a" value="1"/>
    <c:param name="b">2</c:param>
</c:action>

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
    <app:scrollpage pageNum="${pageNum}" pageSize="${pageSize}" total="${userCount}" className="pagebar" href="javascript: runTest(%s, ${pageSize})"/>
</div>