# 中国传统文化知识AI问答平台

这是一个基于讯飞星火API的中国传统文化知识问答平台，用户可以通过该平台了解中国传统文化的各个方面，包括历史、节日、诗词文学、传统艺术、哲学思想等。

## 功能特点

- 中国传统文化领域的智能问答
- 流式响应，实时显示AI回答
- 支持持续对话，具有上下文理解能力
- 分类导航，方便用户了解不同领域的知识
- 推荐问题，为用户提供灵感
- 美观的中国风界面设计
- 背景音乐播放器，提供传统音乐

## 技术栈

- **后端**：Python Flask
- **前端**：HTML5, CSS3, JavaScript (jQuery)
- **AI**：讯飞星火大模型API

## 安装与运行

### 环境要求

- Python 3.8+
- Flask
- requests
- flask-cors

### 安装步骤

1. 克隆代码到本地：
```bash
git clone https://github.com/yourusername/chinese_culture_ai.git
cd chinese_culture_ai
```

2. 安装所需Python包：
```bash
pip install flask requests flask-cors
```

3. 配置讯飞星火API密钥：
   - 在 `app.py` 文件中，将 `api_key` 变量替换为您自己的讯飞星火API密钥：
   ```python
   api_key = "Bearer YOUR_API_KEY_HERE"
   ```

4. 运行应用：
```bash
python app.py
```

5. 在浏览器中访问：
```
http://127.0.0.1:5000/
```

## 部署方案

如需将平台部署到互联网，供其他人远程访问，可以参考以下方案：

### 1. 局域网分享
编辑 `app.py`，修改启动参数：
```python
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
```
这样局域网内其他设备可通过你的IP地址访问：`http://<你的IP>:5000`

### 2. 内网穿透
使用内网穿透工具将本地服务映射到公网：
- **[ngrok](https://ngrok.com/)**: 详细步骤参见 `deploy_ngrok.md`
- **[花生壳](https://hsk.oray.com/)**: 详细步骤参见 `deploy_oray.md`

### 3. 云平台部署
长期稳定的方案是将应用部署到云服务器：
- **PythonAnywhere**: 适合新手的免费Python托管平台
- **腾讯云/阿里云**: 国内可靠的云服务器方案
- **Heroku**: 国外知名的应用托管平台

详细的云平台部署指南请参见 `cloud_deployment.md`

## 项目结构

```
chinese_culture_ai_platform/
│
├── app.py                 # 主应用文件，Flask服务器
│
├── static/                # 静态文件目录
│   ├── css/               # CSS样式文件
│   │   └── style.css      # 主样式文件
│   │
│   ├── js/                # JavaScript文件
│   │   └── script.js      # 主脚本文件
│   │
│   └── images/            # 图像文件
│       └── chinese_pattern_bg.png  # 背景图案
│
├── templates/             # HTML模板目录
│   └── index.html         # 主页模板
│
└── README.md              # 项目说明文件
```

## 自定义与拓展

- **修改API配置**：在 `app.py` 中可以调整API请求参数
- **添加新的推荐问题**：在 `app.py` 的 `recommended_questions` 函数中添加
- **更换背景音乐**：在 `script.js` 的 `initMusicPlayer` 函数中修改音频源
- **添加新的文化分类**：在 `index.html` 的分类导航和 `script.js` 的 `handleCategoryClick` 函数中添加

## 注意事项

- 请确保您的API密钥有足够的额度
- 如果遇到跨域问题，请检查Flask的CORS设置
- 背景图片和音乐文件需要自行添加到对应目录

## 许可证

此项目采用 MIT 许可证 - 详细信息请参阅 [LICENSE](LICENSE) 文件。

## 贡献

欢迎贡献代码或提供改进建议！请通过PR或issue与我们交流。
