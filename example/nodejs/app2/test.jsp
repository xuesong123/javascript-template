<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>Application Management Console</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
</head>
<body>
<div style="height: 60px; line-height: 30px;"><h1>Application Management Console</h1></div>
<div class="wrap">
    <%
        for(var i = 0; i < 10; i++)
        {
    %>
        <p><%=i%></p>
    <%
        }
    %>
</div>
<div style="height: 600px;"></div>
<div class="wrap footer">
    <p>
        <a href="https://github.com/xuesong123/javascript-template" target="_blank">javascript-template</a>|
        <a href="https://github.com/xuesong123/httpproxy" target="_blank">httpproxy</a>|
        <a href="https://github.com/xuesong123/ayada" target="_blank">ayada</a>|
    </p>
</div>
</body>