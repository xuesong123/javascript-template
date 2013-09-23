@ECHO OFF
copy "ayada-1.0.0.js" "node_modules\ayada\lib\ayada-1.0.0.js"
CScript /nologo pack.wsf "ayada-1.0.0.js" "ayada-1.0.0.min.js"
