// 全局变量
const sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
let isWaitingForResponse = false;
let currentStream = null;

// 存储聊天历史记录
let chatHistory = [];
let currentChatIndex = -1; // -1表示当前是新对话

// 主题设置
let darkMode = false;

// 页面加载完成后执行
$(document).ready(function() {
    // 加载推荐问题
    loadRecommendedQuestions();
    
    // 初始化背景音乐播放器
    initMusicPlayer();
    
    // 事件监听器
    setupEventListeners();
    
    // 显示回到顶部按钮
    handleBackToTopButton();
    
    // 加载历史记录
    loadChatHistory();
    
    // 检查主题设置
    checkThemePreference();
    
    // 加载音乐和背景
    preloadAssetsForBetterExperience();
    
    // 初始化工具提示
    $('[data-toggle="tooltip"]').tooltip();
});

// 加载推荐问题
function loadRecommendedQuestions() {
    fetch('/api/recommended_questions')
        .then(response => response.json())
        .then(data => {
            const questionsContainer = $('#recommended-questions-list');
            questionsContainer.empty();
            
            data.questions.forEach(question => {
                const questionElement = $('<div>')
                    .addClass('recommended-question')
                    .text(question)
                    .click(function() {
                        $('#question-input').val(question);
                        $('#question-form').submit();
                    });
                questionsContainer.append(questionElement);
            });
        })
        .catch(error => console.error('获取推荐问题失败:', error));
}

// 初始化音乐播放器
function initMusicPlayer() {
    // 默认音乐列表
    const defaultMusicList = [
        {
            name: '古筝 - 高山流水',
            artist: '中国传统音乐',
            url: 'https://music.163.com/song/media/outer/url?id=186953.mp3',
            cover: 'https://p2.music.126.net/6-tHGloBYYIv-UL-l55ZYA==/19165587183900741.jpg'
        },
        {
            name: '二胡 - 二泉映月',
            artist: '中国传统音乐',
            url: 'https://music.163.com/song/media/outer/url?id=186836.mp3',
            cover: 'https://p2.music.126.net/6-tHGloBYYIv-UL-l55ZYA==/19165587183900741.jpg'
        },
        {
            name: '古琴 - 潇湘水云',
            artist: '中国传统音乐',
            url: 'https://music.163.com/song/media/outer/url?id=190072.mp3',
            cover: 'https://p2.music.126.net/6-tHGloBYYIv-UL-l55ZYA==/19165587183900741.jpg'
        }
    ];

    // 从本地存储加载音乐列表，如果失败则使用默认列表
    let musicList = defaultMusicList;
    try {
        const storedList = localStorage.getItem('customMusicList');
        if (storedList) {
            const parsedList = JSON.parse(storedList);
            if (Array.isArray(parsedList) && parsedList.length > 0) {
                // 验证每个音乐项是否包含必需的属性
                musicList = parsedList.filter(item => 
                    item && typeof item === 'object' && 
                    item.name && typeof item.name === 'string' &&
                    item.url && typeof item.url === 'string'
                );
                
                // 如果过滤后列表为空，则使用默认列表
                if (musicList.length === 0) {
                    musicList = defaultMusicList;
                    localStorage.removeItem('customMusicList'); // 清除无效数据
                }
            }
        }
    } catch (e) {
        console.error('加载自定义音乐列表失败:', e);
        localStorage.removeItem('customMusicList'); // 清除无效数据
    }

    // 初始化播放器
    window.musicPlayer = new APlayer({
        container: document.getElementById('music-player'),
        mini: false,
        autoplay: false,
        loop: 'all',
        volume: 0.7,
        mutex: true,
        audio: musicList
    });
    
    // 使音乐播放器容器可拖动
    $("#music-player-container").draggable({
        handle: ".music-header",
        containment: "window",
        scroll: false
    });
    
    // 缩小播放器
    $("#music-minimize").click(function() {
        $("#music-player-container").toggleClass("minimized");
    });
    
    // 扩大播放器
    $("#music-expand").click(function() {
        $("#music-player-container").toggleClass("expanded");
    });
    
    // 保存播放器位置
    const savedPos = localStorage.getItem('musicPlayerPosition');
    if (savedPos) {
        const pos = JSON.parse(savedPos);
        $("#music-player-container").css({
            'top': pos.top,
            'bottom': 'auto',
            'left': pos.left,
            'right': 'auto'
        });
    }
    
    // 记录播放器位置
    $("#music-player-container").on("dragstop", function(event, ui) {
        localStorage.setItem('musicPlayerPosition', JSON.stringify({
            top: ui.position.top,
            left: ui.position.left
        }));
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 侧边栏切换
    $('#sidebar-toggle').click(function() {
        toggleSidebar();
        // 确保切换按钮可见
        setTimeout(() => {
            $('#sidebar-toggle').css({
                'visibility': 'visible',
                'opacity': '1',
                'display': 'flex',
                'z-index': '9999'
            });
        }, 50);
    });
    
    // 移动端侧边栏切换按钮
    $('#sidebar-toggle-btn').click(function() {
        $('#sidebar').toggleClass('show');
    });
    
    // 点击主内容区域关闭侧边栏（仅在移动端）
    $('.main-content').click(function(e) {
        if ($(window).width() < 992) {
            $('#sidebar').removeClass('show');
        }
    });
    
    // 自定义音乐按钮
    $('#add-custom-music').click(function() {
        $('#customMusicModal').modal('show');
    });
    
    // 保存自定义音乐
    $('#save-custom-music').click(function() {
        const name = $('#music-name').val().trim();
        const artist = $('#music-artist').val().trim();
        const url = $('#music-url').val().trim();
        const cover = $('#music-cover').val().trim() || 'https://p2.music.126.net/6-tHGloBYYIv-UL-l55ZYA==/19165587183900741.jpg';
        
        if (name && url) {
            try {
                // 获取现有音乐列表
                let musicList = [];
                try {
                    const storedList = localStorage.getItem('customMusicList');
                    if (storedList) {
                        const parsedList = JSON.parse(storedList);
                        if (Array.isArray(parsedList)) {
                            musicList = parsedList;
                        }
                    }
                } catch (e) {
                    console.error('读取音乐列表失败:', e);
                }
                
                // 如果列表为空，则从当前播放器获取
                if (musicList.length === 0 && window.musicPlayer && window.musicPlayer.list && window.musicPlayer.list.audios) {
                    musicList = window.musicPlayer.list.audios;
                }
                
                // 添加新音乐
                const newMusic = {
                    name: name,
                    artist: artist,
                    url: url,
                    cover: cover
                };
                
                musicList.push(newMusic);
                
                // 保存到本地存储
                localStorage.setItem('customMusicList', JSON.stringify(musicList));
                
                // 更新播放器
                if (window.musicPlayer && window.musicPlayer.list) {
                    window.musicPlayer.list.add(newMusic);
                    
                    // 播放新添加的音乐
                    const newIndex = window.musicPlayer.list.audios.length - 1;
                    window.musicPlayer.list.switch(newIndex);
                    window.musicPlayer.play();
                }
                
                // 清空表单并关闭模态框
                $('#music-name').val('');
                $('#music-artist').val('');
                $('#music-url').val('');
                $('#music-cover').val('');
                $('#customMusicModal').modal('hide');
                
                // 显示成功消息
                showToast('添加音乐成功！');
            } catch (e) {
                console.error('添加音乐失败:', e);
                showToast('添加音乐失败，请检查格式是否正确', 'error');
            }
        } else {
            showToast('请至少填写音乐名称和URL', 'error');
        }
    });
    
    // 表单提交
    $('#question-form').submit(function(e) {
        e.preventDefault();
        sendQuestion();
    });
    
    // 清除对话历史
    $('#clear-btn').click(function() {
        clearCurrentChat();
    });
    
    // 导出对话
    $('#export-btn').click(function() {
        exportCurrentChat();
    });
    
    // 文化分类点击
    $('.category-nav a').click(function(e) {
        e.preventDefault();
        const category = $(this).data('category');
        handleCategoryClick(category);
    });
    
    // 回到顶部按钮
    $('#back-to-top').click(function() {
        $('#chat-history').animate({ scrollTop: 0 }, 'slow');
    });
    
    // 监听滚动
    $('#chat-history').scroll(function() {
        handleBackToTopButton();
    });
    
    // 主题切换
    $('#theme-toggle').click(function() {
        toggleTheme();
    });
    
    // 分享按钮
    $('#share-btn').click(function() {
        shareCurrentChat();
    });
    
    // 打印按钮
    $('#print-btn').click(function() {
        printCurrentChat();
    });
    
    // 语音输入
    $('#voice-input').click(function() {
        startVoiceInput();
    });
    
    // 拍照识别
    $('#take-photo').click(function() {
        takeCulturalPhoto();
    });
    
    // 上传文件
    $('#upload-file').click(function() {
        uploadCulturalFile();
    });
}

// 发送问题
function sendQuestion() {
    // 如果正在等待响应，则不发送新问题
    if (isWaitingForResponse) return;
    
    const question = $('#question-input').val().trim();
    if (!question) return;
    
    // 显示用户问题
    addMessage(question, 'user');
    
    // 清空输入框
    $('#question-input').val('');
    
    // 只显示中断按钮，不再使用全局加载状态
    // 取消调用showLoading();
    showStopButton();
    
    // 创建一个机器人消息占位符
    const botMessageId = `bot-message-${Date.now()}`;
    createBotMessagePlaceholder(botMessageId);
    
    // 设置等待状态
    isWaitingForResponse = true;
    
    // 取消之前的流
    if (currentStream) {
        currentStream.close();
    }
    
    // 使用事件源实现流式响应
    const url = `/api/ask?question=${encodeURIComponent(question)}&session_id=${sessionId}`;
    currentStream = new EventSource(url);
    
    // 存储完整响应
    let fullResponse = "";
    
    // 监听消息事件
    currentStream.onmessage = function(event) {
        try {
            const data = JSON.parse(event.data);
            if (data.content) {
                fullResponse += data.content;
                updateBotMessage(botMessageId, fullResponse);
                scrollToBottom();
            }
        } catch (e) {
            console.error('解析事件数据失败:', e);
        }
    };
    
    // 监听错误
    currentStream.onerror = function(error) {
        console.error('流式响应错误:', error);
        // 关闭流
        currentStream.close();
        currentStream = null;
        
        // 完成响应 - 保留已生成的内容
        if (!fullResponse) {
            updateBotMessage(botMessageId, "很抱歉，我暂时无法回答这个问题，请稍后再试。");
        } else {
            // 如果有已生成的内容，添加中断标记但保留内容
            const currentContent = fullResponse + "\n\n<em>（连接中断）</em>";
            updateBotMessage(botMessageId, currentContent);
        }
        isWaitingForResponse = false;
        // 移除消息的加载状态
        $(`#${botMessageId}`).removeClass('loading');
        hideStopButton();
    };
    
    // 监听流结束
    currentStream.addEventListener('end', function() {
        // 关闭流
        currentStream.close();
        currentStream = null;
        isWaitingForResponse = false;
        // 移除消息的加载状态
        $(`#${botMessageId}`).removeClass('loading');
        hideStopButton();
    });
    
    // 滚动到底部
    scrollToBottom();
}

// 创建机器人消息占位符
function createBotMessagePlaceholder(id) {
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const botMessage = `
        <div class="message bot-message loading" id="${id}">
            <div class="avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-name">文化智友</span>
                    <span class="message-time">${timeString}</span>
                </div>
                <div class="message-text">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p class="typing">正在思考...</p>
                </div>
            </div>
        </div>
    `;
    $('#chat-history').append(botMessage);
    scrollToBottom();
}

// 更新机器人消息
function updateBotMessage(id, text) {
    // 转换markdown为HTML
    marked.setOptions({
        breaks: true,  // 将换行符转换为<br>
        gfm: true,     // 使用GitHub风格的Markdown
        xhtml: true    // 使用自闭合标签以确保HTML标准化
    });
    
    // 确保文本格式正确
    let formattedText = text
        .replace(/\r\n/g, '\n') // 标准化换行符
        .replace(/\r/g, '\n')   // 标准化换行符
        .replace(/\n{3,}/g, '\n\n'); // 将多个连续换行符减少为最多两个
    
    const htmlContent = marked.parse(formattedText);
    $(`#${id} .message-text`).html(htmlContent);
    
    // 移除加载状态
    $(`#${id}`).removeClass('loading');
    
    scrollToBottom();
}

// 添加消息
function addMessage(text, sender, timestamp) {
    try {
        const avatar = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        const messageClass = sender === 'user' ? 'user-message' : 'bot-message';
        const name = sender === 'user' ? '您' : '文化智友';
        
        // 安全处理时间戳
        let timeString;
        try {
            if (timestamp) {
                // 尝试多种可能的日期格式
                const date = new Date(timestamp);
                if (!isNaN(date.getTime())) {
                    timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else {
                    timeString = timestamp;
                }
            } else {
                timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        } catch (e) {
            timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // 清理和安全处理文本内容
        let safeText = '';
        if (text !== null && text !== undefined) {
            // 如果不是字符串，转换为字符串
            if (typeof text !== 'string') {
                try {
                    safeText = JSON.stringify(text);
                } catch (e) {
                    safeText = String(text);
                }
            } else {
                safeText = text;
            }
            
            // 检查和移除可能的乱码字符
            safeText = safeText.replace(/[\u0000-\u001F\u007F-\u009F\uFFFD]/g, '');
            
            // 检查是否是JSON字符串，如果是则尝试解析
            if (safeText.startsWith('{') && safeText.endsWith('}')) {
                try {
                    const jsonObj = JSON.parse(safeText);
                    if (jsonObj.content) {
                        safeText = jsonObj.content;
                    }
                } catch (e) {
                    // 不是有效的JSON，保持原样
                }
            }
        }
        
        // 转换markdown为HTML（如果是机器人消息）
        let messageContent;
        try {
            if (sender === 'user') {
                // 处理用户消息 - 确保换行被保留
                // 将普通换行符转换为HTML换行
                let formattedText = safeText
                    .replace(/\n/g, '<br>')  // 替换换行符为HTML换行
                    .replace(/\r/g, '');     // 移除回车符
                messageContent = `<p>${formattedText}</p>`;
            } else {
                // 处理机器人消息 - 使用markdown解析
                // 设置marked选项以保留换行和段落格式
                marked.setOptions({
                    breaks: true,  // 将换行符转换为<br>
                    gfm: true,     // 使用GitHub风格的Markdown
                    xhtml: true    // 使用自闭合标签以确保HTML标准化
                });
                
                // 确保段落正确分隔
                let formattedText = safeText
                    .replace(/\r\n/g, '\n') // 标准化换行符
                    .replace(/\r/g, '\n')   // 标准化换行符
                    .replace(/\n{3,}/g, '\n\n'); // 将多个连续换行符减少为最多两个
                
                // 使用marked解析markdown
                messageContent = marked.parse(formattedText);
            }
        } catch (e) {
            console.warn('Markdown解析失败:', e);
            // 回退处理 - 保留换行
            messageContent = `<p>${safeText.replace(/\n/g, '<br>')}</p>`;
        }
        
        // 检测消息长度并应用不同的类 - 根据长度使用不同的类名
        let messageCompactClass = '';
        if (safeText.length <= 5) {
            // 特短消息 (5个字符或更少)
            messageCompactClass = 'short-message very-short-message';
        } else if (safeText.length <= 10) {
            // 短消息 (6-10个字符)
            messageCompactClass = 'short-message';
        } else if (safeText.length <= 20) {
            // 中等长度消息 (11-20个字符)
            messageCompactClass = 'medium-message';
        }
        
        // 创建并添加消息
        const message = `
            <div class="message ${messageClass} ${messageCompactClass} animate__animated animate__fadeIn">
                <div class="avatar">
                    ${avatar}
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-name">${name}</span>
                        <span class="message-time">${timeString}</span>
                    </div>
                    <div class="message-text">
                        ${messageContent}
                    </div>
                </div>
            </div>
        `;
        
        $('#chat-history').append(message);
        scrollToBottom();
    } catch (e) {
        console.error('添加消息时出错:', e);
        // 添加一个简单的后备消息
        const simpleMessage = `
            <div class="message ${sender === 'user' ? 'user-message' : 'bot-message'}">
                <div class="avatar">
                    <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-name">${sender === 'user' ? '您' : '文化智友'}</span>
                        <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="message-text">
                        <p>${sender === 'user' ? '您的消息' : '助手回复'}</p>
                    </div>
                </div>
            </div>
        `;
        $('#chat-history').append(simpleMessage);
        scrollToBottom();
    }
    
    // 每次添加消息后保存历史
    setTimeout(() => saveCurrentChatToHistory(), 100);
}

// 加载聊天历史记录
function loadChatHistory() {
    try {
        // 从本地存储加载历史记录
        const savedHistory = localStorage.getItem('culturalChatHistory');
        if (savedHistory) {
            const parsedHistory = JSON.parse(savedHistory);
            
            // 验证和清理历史记录数据
            if (Array.isArray(parsedHistory)) {
                chatHistory = parsedHistory.filter(chat => {
                    // 检查是否有基本必要属性
                    if (!chat || typeof chat !== 'object') return false;
                    if (!Array.isArray(chat.messages) || chat.messages.length === 0) return false;
                    
                    // 修复可能的标题问题
                    if (!chat.title || typeof chat.title !== 'string') {
                        // 尝试从第一个用户消息中提取标题
                        const firstUserMsg = chat.messages.find(m => m.role === 'user');
                        if (firstUserMsg && firstUserMsg.content) {
                            let content = firstUserMsg.content;
                            // 如果内容是HTML，提取纯文本
                            content = content.replace(/<[^>]*>/g, '');
                            chat.title = content.substring(0, 20) + (content.length > 20 ? '...' : '');
                        } else {
                            chat.title = '未命名对话';
                        }
                    }
                    
                    // 确保时间戳存在
                    if (!chat.timestamp) {
                        chat.timestamp = Date.now();
                    }
                    
                    // 清理每个消息
                    chat.messages = chat.messages.filter(msg => {
                        if (!msg || typeof msg !== 'object') return false;
                        if (!msg.role || (msg.role !== 'user' && msg.role !== 'assistant')) return false;
                        
                        // 修复内容
                        if (!msg.content || typeof msg.content !== 'string') {
                            msg.content = '';
                            return false;
                        }
                        
                        return true;
                    });
                    
                    return chat.messages.length > 0;
                });
            } else {
                chatHistory = [];
            }
            
            // 保存清理后的历史记录
            localStorage.setItem('culturalChatHistory', JSON.stringify(chatHistory));
            renderHistoryList();
        }
    } catch (error) {
        console.error('加载历史记录失败:', error);
        // 清除可能损坏的历史记录
        localStorage.removeItem('culturalChatHistory');
        chatHistory = [];
        renderHistoryList();
    }
}

// 渲染历史记录列表
function renderHistoryList() {
    const historyContainer = $('#history-list');
    historyContainer.empty();
    
    if (chatHistory.length === 0) {
        historyContainer.html('<div class="empty-history"><i class="fas fa-history"></i><br>暂无历史记录</div>');
        return;
    }
    
    // 反向遍历，最新的在前面
    for (let i = chatHistory.length - 1; i >= 0; i--) {
        const chat = chatHistory[i];
        
        // 确保时间戳是有效的
        const timestamp = chat.timestamp ? chat.timestamp : Date.now();
        const date = new Date(timestamp);
        
        // 格式化日期 - 如果是今天显示时间，如果是其他日期显示日期
        let formattedDate;
        const today = new Date();
        if (date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear()) {
            // 今天的对话显示时间
            formattedDate = `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else {
            // 其他日期显示完整日期
            formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
        
        // 确保标题是字符串并去除HTML标签
        let title = chat.title || '未命名对话';
        title = typeof title === 'string' ? title.replace(/<[^>]*>?/gm, '') : '未命名对话';
        
        // 提取对话消息数量以显示在标题中
        const messageCount = chat.messages ? chat.messages.length : 0;
        
        const historyItem = $('<div>')
            .addClass('history-item')
            .attr('data-index', i)
            .html(`
                <div class="history-title">${title}</div>
                <div class="history-date"><i class="far fa-comment-dots"></i> ${messageCount}条消息 · ${formattedDate}</div>
                <div class="history-delete" title="删除此对话"><i class="fas fa-times"></i></div>
            `);
        
        // 点击历史项加载对话
        historyItem.click(function(e) {
            // 检查是否点击了删除按钮
            if ($(e.target).closest('.history-delete').length) {
                e.stopPropagation(); // 阻止事件冒泡
                deleteHistoryItem(i);
            } else {
                loadChatFromHistory(i);
            }
        });
            
        if (i === currentChatIndex) {
            historyItem.addClass('active');
        }
        
        historyContainer.append(historyItem);
    }
}

// 删除历史记录项
function deleteHistoryItem(index) {
    // 显示确认对话框
    if (confirm('确定要删除这条对话历史记录吗？')) {
        // 如果删除的是当前对话
        if (index === currentChatIndex) {
            // 清空当前聊天界面
            $('#chat-history').empty();
            
            // 添加欢迎消息
            const welcomeMessage = `
                <div class="message bot-message animate__animated animate__fadeIn">
                    <div class="avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-header">
                            <span class="message-name">文化智友</span>
                            <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div class="message-text">
                            <p><strong>欢迎来到「文化智友」</strong></p>
                            <p>您的中国传统文化知识助手，探索五千年文化智慧。</p>
                            <p>请问您想了解什么中国传统文化知识呢？</p>
                        </div>
                    </div>
                </div>
            `;
            $('#chat-history').append(welcomeMessage);
            
            // 添加每日诗词
            showDailyPoem();
            
            // 重置当前聊天索引
            currentChatIndex = -1;
        }
        
        // 从历史记录中删除
        chatHistory.splice(index, 1);
        
        // 保存到本地存储
        localStorage.setItem('culturalChatHistory', JSON.stringify(chatHistory));
        
        // 更新历史记录UI
        renderHistoryList();
        
        // 显示提示
        showToast('历史记录已删除');
    }
}

// 从历史记录加载聊天
function loadChatFromHistory(index) {
    if (index >= 0 && index < chatHistory.length) {
        try {
            currentChatIndex = index;
            const chat = chatHistory[index];
            
            // 清除当前聊天界面
            $('#chat-history').empty();
            
            // 加载欢迎消息
            const welcomeMessage = `
                <div class="message bot-message animate__animated animate__fadeIn">
                    <div class="avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-header">
                            <span class="message-name">文化智友</span>
                            <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div class="message-text">
                            <p><strong>正在查看历史对话</strong> - ${chat.title || '未命名对话'}</p>
                        </div>
                    </div>
                </div>
            `;
            $('#chat-history').append(welcomeMessage);
            
            // 加载历史消息
            if (chat.messages && Array.isArray(chat.messages)) {
                chat.messages.forEach(msg => {
                    try {
                        // 检查消息是否有效
                        if (!msg || !msg.role || !msg.content) return;
                        
                        // 清理消息内容 - 移除可能导致乱码的字符
                        let safeContent = msg.content;
                        
                        // 如果内容不是字符串，尝试转换
                        if (typeof safeContent !== 'string') {
                            try {
                                safeContent = JSON.stringify(safeContent);
                            } catch (e) {
                                safeContent = '内容格式错误';
                            }
                        }
                        
                        // 解码HTML实体
                        const decodeHTML = function(html) {
                            const textarea = document.createElement('textarea');
                            textarea.innerHTML = html;
                            return textarea.value;
                        };
                        
                        // 尝试清理HTML内容并确保换行符是标准格式
                        safeContent = decodeHTML(safeContent)
                            .replace(/\r\n/g, '\n') // 标准化换行符
                            .replace(/\r/g, '\n');  // 标准化换行符
                        
                        // 检查是否为JSON字符串
                        if (safeContent.startsWith('{') && safeContent.endsWith('}')) {
                            try {
                                const parsed = JSON.parse(safeContent);
                                if (parsed.content) {
                                    safeContent = parsed.content;
                                } else if (parsed.text) {
                                    safeContent = parsed.text;
                                }
                            } catch (e) {
                                // 解析失败，保持原样
                            }
                        }
                        
                        // 使用适当的时间戳
                        let timestamp = '';
                        if (msg.timestamp) {
                            try {
                                const date = new Date(msg.timestamp);
                                timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            } catch (e) {
                                timestamp = '';
                            }
                        }
                        
                        if (msg.role === 'user') {
                            addMessage(safeContent, 'user', timestamp);
                        } else if (msg.role === 'assistant') {
                            addMessage(safeContent, 'bot', timestamp);
                        }
                    } catch (e) {
                        console.error('处理消息时出错:', e);
                    }
                });
            }
            
            // 高亮当前历史项
            $('.history-item').removeClass('active');
            $(`.history-item[data-index="${index}"]`).addClass('active');
            
            // 滚动到底部
            scrollToBottom();
        } catch (e) {
            console.error('加载历史对话失败:', e);
            showToast('加载历史对话失败，请尝试清除浏览器缓存', 'error');
        }
    }
}

// 保存当前对话到历史记录
function saveCurrentChatToHistory() {
    const messages = [];
    
    // 收集当前对话中的所有消息
    $('#chat-history .message').each(function() {
        const isUser = $(this).hasClass('user-message');
        // 获取纯文本内容而不是HTML
        const contentHTML = $(this).find('.message-text').html();
        // 创建临时元素来提取纯文本
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentHTML;
        const content = tempDiv.textContent || tempDiv.innerText || contentHTML;
        const timestamp = $(this).find('.message-time').text();
        
        if (content && content.trim()) {
            messages.push({
                role: isUser ? 'user' : 'assistant',
                content: content,
                timestamp: timestamp || new Date().toLocaleString()
            });
        }
    });
    
    if (messages.length === 0) return;
    
    // 确定标题 - 使用第一条用户消息的前20个字符
    const firstUserMessage = messages.find(m => m.role === 'user');
    
    // 安全地提取标题文本，确保没有HTML标签
    let titleText = '未命名对话';
    if (firstUserMessage && firstUserMessage.content) {
        // 确保内容是字符串
        const contentStr = String(firstUserMessage.content);
        // 移除所有HTML标签和多余空格
        titleText = contentStr.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        // 限制长度
        titleText = titleText.substring(0, 20) + (titleText.length > 20 ? '...' : '');
    }
    
    const chatData = {
        title: titleText,
        timestamp: new Date().getTime(),
        messages: messages,
        sessionId: sessionId
    };
    
    // 如果是编辑当前对话，则更新
    if (currentChatIndex >= 0 && currentChatIndex < chatHistory.length) {
        chatHistory[currentChatIndex] = chatData;
    } else {
        // 否则添加新对话
        chatHistory.push(chatData);
        currentChatIndex = chatHistory.length - 1;
    }
    
    // 限制历史记录最多保存20条
    if (chatHistory.length > 20) {
        chatHistory = chatHistory.slice(chatHistory.length - 20);
    }
    
    // 保存到本地存储
    localStorage.setItem('culturalChatHistory', JSON.stringify(chatHistory));
    
    // 更新历史记录UI
    renderHistoryList();
}

// 清除当前聊天
function clearCurrentChat() {
    // 取消当前流式请求
    if (currentStream) {
        currentStream.close();
        currentStream = null;
        isWaitingForResponse = false;
        hideLoading();
    }
    
    // 发送请求清除服务器端会话历史
    fetch('/api/clear_session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ session_id: sessionId })
    })
    .then(response => response.json())
    .then(() => {
        // 清除聊天界面
        $('#chat-history').empty();
        
        // 添加欢迎消息
        const welcomeMessage = `
            <div class="message bot-message animate__animated animate__fadeIn">
                <div class="avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-name">文化智友</span>
                        <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="message-text">
                        <p><strong>欢迎来到「文化智友」</strong></p>
                        <p>您的中国传统文化知识助手，探索五千年文化智慧。</p>
                        <p>请问您想了解什么中国传统文化知识呢？</p>
                    </div>
                </div>
            </div>
        `;
        $('#chat-history').append(welcomeMessage);
        
        // 显示每日诗词
        setTimeout(() => {
            showDailyPoem();
            // 如果有二十四节气信息，也重新显示
            if (typeof showSolarTermInfo === 'function') {
                showSolarTermInfo();
            }
        }, 200);
        
        // 创建新对话
        currentChatIndex = -1;
        $('.history-item').removeClass('active');
    })
    .catch(error => console.error('清除聊天历史失败:', error));
}

// 处理分类点击
function handleCategoryClick(category) {
    const categoryQuestions = {
        'history': '请概述中国历史上的主要朝代及其重要贡献',
        'festival': '中国传统节日有哪些？它们各有什么特点和习俗？',
        'literature': '中国古典诗词的发展历程和主要流派是什么？',
        'art': '请介绍中国传统艺术的主要形式及其特点',
        'philosophy': '儒家、道家和佛家思想的核心理念是什么？它们如何影响中国文化？',
        'science': '中国古代有哪些重要的科技发明？',
        'medicine': '中医的基本理论体系是什么？阴阳五行如何应用于中医？',
        'mythology': '中国神话中的主要神仙体系是怎样的？',
        'architecture': '中国古代建筑有哪些特点？为什么中国古建筑大多是木结构？',
        'craft': '中国传统手工艺包括哪些类别？它们的工艺特点是什么？'
    };
    
    const question = categoryQuestions[category] || '请介绍中国传统文化的主要特点';
    $('#question-input').val(question);
    $('#question-form').submit();
}

// 显示回到顶部按钮
function handleBackToTopButton() {
    const chatHistory = $('#chat-history');
    if (chatHistory.scrollTop() > 300) {
        $('#back-to-top').fadeIn();
    } else {
        $('#back-to-top').fadeOut();
    }
}

// 滚动到底部
function scrollToBottom() {
    const chatHistory = document.getElementById('chat-history');
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// 显示加载状态
function showLoading() {
    $('#loading-overlay').removeClass('d-none');
}

// 隐藏加载状态
function hideLoading() {
    $('#loading-overlay').addClass('d-none');
}

// 导出当前对话
function exportCurrentChat() {
    // 收集当前对话内容
    let exportContent = "# 文化智友对话记录\n\n";
    exportContent += `导出时间：${new Date().toLocaleString()}\n\n`;
    
    $('#chat-history .message').each(function() {
        const isUser = $(this).hasClass('user-message');
        const sender = isUser ? '我' : '文化智友';
        const content = $(this).find('.message-text').text();
        const time = $(this).find('.message-time').text();
        
        exportContent += `## ${sender} (${time})\n\n${content}\n\n---\n\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([exportContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `文化智友对话_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
}

// 分享当前对话
async function shareCurrentChat() {
    try {
        // 生成对话纯文本摘要
        let text = '我在“文化智友”与AI探讨中国传统文化：\n\n';
        $('#chat-history .message').each(function() {
            const isUser = $(this).hasClass('user-message');
            const sender = isUser ? '我' : '文化智友';
            const content = $(this).find('.message-text').text().trim();
            if (content) {
                text += `【${sender}】${content}\n\n`;
            }
        });
        const title = document.title || '文化智友';
        const url = window.location.origin + '/chat';

        if (navigator.share) {
            await navigator.share({ title, text, url });
        } else {
            await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
            showToast('已复制对话与链接，可粘贴分享');
        }
    } catch (e) {
        console.error('分享失败:', e);
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('已复制页面链接');
        } catch (e2) {
            alert('分享未完成，请手动复制链接。');
        }
    }
}

// 打印当前对话
function printCurrentChat() {
    window.print();
}

// 语音输入功能
function startVoiceInput() {
    // 检查浏览器是否支持语音识别
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('您的浏览器不支持语音识别功能，请使用Chrome浏览器');
        return;
    }
    
    alert('语音输入功能待实现，敬请期待！');
    // 在实际项目中可以接入语音识别API
}

// 拍照识别功能
function takeCulturalPhoto() {
    alert('拍照识别功能待实现，敬请期待！');
    // 在实际项目中可以接入相机API并进行文化元素识别
}

// 上传文件功能
function uploadCulturalFile() {
    alert('文件上传功能待实现，敬请期待！');
    // 在实际项目中可以实现文件上传和分析
}

// 切换主题
function toggleTheme() {
    darkMode = !darkMode;
    
    if (darkMode) {
        $('body').addClass('dark-theme');
        $('#theme-toggle i').removeClass('fa-moon').addClass('fa-sun');
    } else {
        $('body').removeClass('dark-theme');
        $('#theme-toggle i').removeClass('fa-sun').addClass('fa-moon');
    }
    
    // 保存主题偏好
    localStorage.setItem('darkMode', darkMode);
}

// 检查主题偏好
function checkThemePreference() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        darkMode = true;
        $('body').addClass('dark-theme');
        $('#theme-toggle i').removeClass('fa-moon').addClass('fa-sun');
    }
}

// 预加载资源
function preloadAssetsForBetterExperience() {
    // 预加载背景图片
    const bgImage = new Image();
    bgImage.src = '../images/chinese_pattern_bg.png';
}

// 添加对代码高亮的支持
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
});
