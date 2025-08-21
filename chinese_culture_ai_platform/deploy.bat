@echo off
echo 中国传统文化知识AI问答平台 - 部署助手
echo ====================================
echo.
echo 本脚本将帮助您部署并分享您的AI平台
echo.
echo 请选择部署模式:
echo 1. 本地模式 (仅限本机访问)
echo 2. 局域网模式 (同一网络下的设备可访问)
echo 3. 公网模式 (需安装内网穿透工具，互联网可访问)
echo.

set /p mode=请输入选项数字（1-3）:

if "%mode%"=="1" goto local
if "%mode%"=="2" goto lan
if "%mode%"=="3" goto wan

echo 输入错误，请重新运行脚本
goto end

:local
echo.
echo 正在启动本地模式...
echo 完成后，您可以通过 http://127.0.0.1:5000 访问平台
echo.
python app.py
goto end

:lan
echo.
echo 正在启动局域网模式...
echo.
echo 您的本地IP地址是:
ipconfig | findstr "IPv4"
echo.
echo 请记住您的IP地址，其他设备可通过 http://您的IP:5000 访问平台
echo.
python app_lan.py
goto end

:wan
echo.
echo 公网模式需要使用内网穿透工具...
echo.
echo 1. 请确保已安装ngrok或花生壳等内网穿透工具
echo 2. 本窗口将启动Flask应用
echo 3. 请在另一个终端窗口中启动内网穿透工具
echo.
echo 请查看部署文档了解详细步骤:
echo - deploy_ngrok.md (使用ngrok)
echo - deploy_oray.md (使用花生壳)
echo - cloud_deployment.md (使用云服务器)
echo.
echo 按任意键启动Flask应用...
pause > nul
python app_lan.py

:end
pause
