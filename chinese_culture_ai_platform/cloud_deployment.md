# 云平台部署指南

本文档提供将"中国传统文化知识AI问答平台"部署到各种云平台的步骤指南。

## 一、部署到 PythonAnywhere（推荐新手）

PythonAnywhere 是一个在线 Python 开发和托管环境，非常适合部署 Flask 应用。

### 步骤：

1. 访问 [PythonAnywhere](https://www.pythonanywhere.com/) 注册账号
2. 登录后，进入 Dashboard
3. 点击 "Files" 标签，上传你的项目文件
4. 点击 "Web" 标签，点击 "Add a new web app"
5. 选择 Flask 框架和合适的 Python 版本
6. 设置应用路径和 WSGI 配置
7. 安装所需的依赖项：
   ```
   pip install flask requests flask-cors
   ```
8. 点击 "Reload" 启动应用

完成后，你将获得一个类似 `http://yourusername.pythonanywhere.com` 的网址。

## 二、部署到腾讯云轻量应用服务器（适合中国用户）

### 步骤：

1. 注册并登录 [腾讯云](https://cloud.tencent.com/)
2. 购买轻量应用服务器（建议选择 Ubuntu 系统）
3. 使用 SSH 连接到服务器
4. 安装所需软件：
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-dev nginx
   pip3 install flask gunicorn requests flask-cors
   ```
5. 将项目文件上传到服务器
6. 配置 Gunicorn：
   ```bash
   cd /path/to/your/project
   gunicorn -w 4 -b 127.0.0.1:8000 app:app
   ```
7. 配置 Nginx 作为反向代理：
   ```
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
8. 重启 Nginx：
   ```bash
   sudo service nginx restart
   ```

完成后，你可以通过服务器IP或绑定的域名访问你的应用。

## 三、部署到 Heroku

### 步骤：

1. 注册 [Heroku](https://www.heroku.com/) 账号
2. 安装 Heroku CLI
3. 在项目根目录创建以下文件：
   
   **Procfile**
   ```
   web: gunicorn app:app
   ```
   
   **requirements.txt**
   ```
   flask
   requests
   flask-cors
   gunicorn
   ```
   
4. 初始化 Git 仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
   
5. 创建 Heroku 应用并部署：
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku master
   ```

完成后，你的应用将在 `https://your-app-name.herokuapp.com` 上运行。

## 四、部署到阿里云 ECS（适合中国用户）

步骤与腾讯云类似，需要：

1. 购买 ECS 实例
2. 安装所需软件环境
3. 设置项目
4. 配置 Gunicorn 和 Nginx
5. 配置域名解析

## 注意事项

1. **安全性**：部署到公网时，务必注意应用的安全性，避免暴露敏感信息。
2. **HTTPS**：建议配置 HTTPS 以保护数据传输安全。
3. **流量和成本**：注意监控应用的流量使用情况，避免超出预算。
4. **API密钥**：确保您的讯飞API密钥在公开环境中得到适当保护，可以考虑使用环境变量存储。
