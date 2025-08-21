@echo off
echo 正在启动中国传统文化知识AI问答平台...
echo.
echo 确保您已经安装了所需的Python库:
echo   - Flask
echo   - requests
echo   - flask-cors
echo.
echo 如果尚未安装，请先运行: pip install flask requests flask-cors
echo.
echo 按任意键继续...
pause > nul

echo 正在启动Flask服务器...
python app.py
