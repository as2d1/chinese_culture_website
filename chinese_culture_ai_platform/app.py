from flask import Flask, render_template, request, jsonify, Response, make_response, send_from_directory
import json
import requests
from flask_cors import CORS
import threading
from queue import Queue

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 讯飞星火API配置
api_key = "rpnqoexOyTwQCLPGzmWH:GVOtZCtKlnPohtYtWjVQ"  # 请替换为您的API密钥
url = "https://spark-api-open.xf-yun.com/v2/chat/completions"

# 存储用户会话历史
sessions = {}

# 中国传统文化相关的提示词
CULTURE_PROMPT = """你是一个专注于中国传统文化知识的AI助手，名为"文化智友"。
请用博学、温和、谦逊的语气回答用户关于中国传统文化的问题。
你精通：
1. 中国古代历史朝代与重要事件
2. 传统节日与习俗
3. 诗词歌赋与文学经典
4. 传统艺术（书法、绘画、戏曲、音乐等）
5. 传统哲学思想（儒、道、佛等）
6. 古代科技与发明
7. 传统医学与养生
8. 民间传说与神话故事
9. 传统建筑与园林艺术
10. 传统手工艺与非物质文化遗产

当用户询问与中国传统文化无关的问题时，请礼貌地将话题引导回中国传统文化领域。
在回答问题时，适当引用古籍原文或名人名言，增加回答的权威性和文化底蕴。"""

@app.route('/')
def welcome():
    """渲染欢迎页面"""
    return render_template('welcome.html')

@app.route('/chat')
def index():
    """渲染主聊天页面"""
    return render_template('index.html')

@app.route('/api/ask', methods=['GET', 'POST'])
def ask():
    """处理用户问题并返回AI回答"""
    if request.method == 'POST':
        data = request.json
        question = data.get('question', '')
        session_id = data.get('session_id', 'default')
    else:
        # GET请求处理
        question = request.args.get('question', '')
        session_id = request.args.get('session_id', 'default')
        
    # 记录请求信息用于调试
    print(f"收到问题: {question}")
    print(f"会话ID: {session_id}")
    
    # 获取或创建会话历史
    if session_id not in sessions:
        sessions[session_id] = []
        # 添加系统提示词
        sessions[session_id].append({
            "role": "system",
            "content": CULTURE_PROMPT
        })
    
    # 添加用户问题
    sessions[session_id].append({
        "role": "user",
        "content": question
    })
    
    # 保持会话历史在合理长度
    if len(sessions[session_id]) > 10:  # 保留最新的10条消息
        # 保留系统提示词
        system_prompt = sessions[session_id][0] if sessions[session_id][0]['role'] == 'system' else None
        sessions[session_id] = sessions[session_id][-9:]  # 保留最新的9条
        if system_prompt:
            sessions[session_id].insert(0, system_prompt)
    
    # 创建响应队列
    response_queue = Queue()
    
    # 在后台线程中处理API请求
    thread = threading.Thread(target=get_answer_stream, args=(sessions[session_id], response_queue))
    thread.start()
    
    def generate():
        while True:
            chunk = response_queue.get()
            if chunk is None:  # 结束标志
                break
            yield f"data: {json.dumps({'content': chunk})}\n\n"
    
    return Response(generate(), mimetype='text/event-stream')

@app.route('/api/ask_sync', methods=['POST'])
def ask_sync():
    """同步方式处理用户问题并返回AI回答"""
    data = request.json
    question = data.get('question', '')
    session_id = data.get('session_id', 'default')
    
    # 获取或创建会话历史
    if session_id not in sessions:
        sessions[session_id] = []
        # 添加系统提示词
        sessions[session_id].append({
            "role": "system",
            "content": CULTURE_PROMPT
        })
    
    # 添加用户问题
    sessions[session_id].append({
        "role": "user",
        "content": question
    })
    
    # 获取AI回答
    answer = get_answer(sessions[session_id])
    
    # 添加AI回答到会话历史
    sessions[session_id].append({
        "role": "assistant",
        "content": answer
    })
    
    # 保持会话历史在合理长度
    if len(sessions[session_id]) > 10:
        # 保留系统提示词
        system_prompt = sessions[session_id][0] if sessions[session_id][0]['role'] == 'system' else None
        sessions[session_id] = sessions[session_id][-9:]
        if system_prompt:
            sessions[session_id].insert(0, system_prompt)
    
    return jsonify({"answer": answer})

def get_answer(messages):
    """非流式方式获取回答"""
    headers = {
        'Authorization': f"Bearer {api_key}",
        'Content-Type': 'application/json'
    }
    
    body = {
        "model": "x1",
        "user": "cultural_assistant",
        "messages": messages,
        "stream": False,
        "tools": [
            {
                "type": "web_search",
                "web_search": {
                    "enable": True,
                    "search_mode": "deep"
                }
            }
        ]
    }
    
    try:
        response = requests.post(url=url, json=body, headers=headers)
        
        if response.status_code != 200:
            print(f"API请求失败，状态码: {response.status_code}")
            print(f"错误信息: {response.text}")
            return "API请求失败，请检查API密钥或网络连接"
        
        result = response.json()
        return result['choices'][0]['message']['content']
    except Exception as e:
        print(f"发生错误: {e}")
        return f"请求过程中发生错误: {e}"

def get_answer_stream(messages, response_queue):
    """流式方式获取回答"""
    headers = {
        'Authorization': f"Bearer {api_key}",
        'Content-Type': 'application/json'
    }
    
    # 打印请求信息用于调试
    print(f"正在向API发送请求，消息历史长度: {len(messages)}")
    for msg in messages:
        print(f"- {msg['role']}: {msg['content'][:30]}...")
    
    body = {
        "model": "x1",
        "user": "cultural_assistant",
        "messages": messages,
        "stream": True,
        "tools": [
            {
                "type": "web_search",
                "web_search": {
                    "enable": True,
                    "search_mode": "deep"
                }
            }
        ]
    }
    
    print(f"请求体: {json.dumps(body, ensure_ascii=False)[:200]}...")
    full_response = ""
    
    try:
        print("正在发送API请求...")
        response = requests.post(url=url, json=body, headers=headers, stream=True)
        print(f"API响应状态码: {response.status_code}")
        
        if response.status_code != 200:
            print(f"API请求失败，状态码: {response.status_code}")
            print(f"错误信息: {response.text}")
            print(f"请求头: {headers}")
            
            error_msg = f"API请求失败，状态码: {response.status_code}"
            if response.status_code == 401:
                error_msg = "API密钥验证失败，请检查您的API密钥是否正确"
            elif response.status_code == 400:
                error_msg = "API请求参数有误，请检查请求格式"
            
            response_queue.put(error_msg)
            response_queue.put(None)  # 结束标志
            return
        
        for chunks in response.iter_lines():
            if chunks:
                chunks_str = chunks.decode('utf-8')
                
                if '[DONE]' in chunks_str:
                    break
                
                if chunks_str.startswith("data: "):
                    data_org = chunks_str[6:]
                    try:
                        chunk = json.loads(data_org)
                        if 'choices' in chunk and len(chunk['choices']) > 0:
                            delta = chunk['choices'][0]['delta']
                            
                            if 'content' in delta and delta['content']:
                                content = delta['content']
                                response_queue.put(content)
                                full_response += content
                    except json.JSONDecodeError as e:
                        print(f"JSON解析错误: {e}")
                        print(f"错误数据: {data_org}")
    except Exception as e:
        print(f"发生错误: {e}")
        response_queue.put(f"请求过程中发生错误: {e}")
    
    # 将完整回答添加到会话历史
    messages.append({
        "role": "assistant",
        "content": full_response
    })
    
    response_queue.put(None)  # 结束标志

@app.route('/api/clear_session', methods=['POST'])
def clear_session():
    """清除特定会话的历史记录"""
    data = request.json
    session_id = data.get('session_id', 'default')
    
    if session_id in sessions:
        # 保留系统提示词
        system_prompt = sessions[session_id][0] if (sessions[session_id] and sessions[session_id][0]['role'] == 'system') else None
        sessions[session_id] = []
        if system_prompt:
            sessions[session_id].append(system_prompt)
    
    return jsonify({"status": "success"})

@app.route('/api/recommended_questions')
def recommended_questions():
    """获取推荐问题"""
    questions = [
        "中国古代四大发明是什么？它们对世界有什么影响？",
        "请介绍一下中国传统节日春节的习俗和象征意义。",
        "儒家、道家和佛家的核心思想有哪些区别和共同点？",
        "中国古代诗词中常见的意象有哪些？分别代表什么含义？",
        "中国传统建筑有哪些特点？为什么会形成这些风格？",
        "中国传统医学的基本理论是什么？与西方医学有何不同？",
        "请介绍几个著名的中国神话故事及其文化内涵。",
        "中国书法艺术有哪些主要的字体和流派？",
        "中国传统音乐的特点是什么？有哪些代表性乐器？",
        "中国传统戏曲有哪些主要剧种？它们各有什么特点？"
    ]
    return jsonify({"questions": questions})

@app.route('/sitemap.xml')
def sitemap():
        # 动态生成包含绝对地址的 sitemap
        base = request.url_root.rstrip('/')
        xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>{base}/</loc>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>{base}/chat</loc>
        <changefreq>daily</changefreq>
    </url>
</urlset>
"""
        resp = make_response(xml)
        resp.headers['Content-Type'] = 'application/xml; charset=utf-8'
        return resp

@app.route('/sw.js')
def service_worker():
        # 将 Service Worker 以根路径提供，确保作用域覆盖整个站点
        return send_from_directory('static', 'sw.js', mimetype='application/javascript')

# 基础SEO：robots.txt 与缓存优化（必须在 app.run 之前注册）
@app.after_request
def add_cache_headers(response):
    # 为静态资源添加较长缓存
    if request.path.startswith('/static/'):
        response.headers['Cache-Control'] = 'public, max-age=604800'
    return response

@app.route('/robots.txt')
def robots_txt():
    base = request.url_root.rstrip('/')
    content = f"""User-agent: *
Allow: /
Sitemap: {base}/sitemap.xml
"""
    resp = make_response(content)
    resp.headers['Content-Type'] = 'text/plain; charset=utf-8'
    return resp

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
