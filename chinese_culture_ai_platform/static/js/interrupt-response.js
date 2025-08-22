// 添加中断响应功能

// 显示停止按钮
function showStopButton() {
    // 确保停止按钮在最上层并可见
    $('#stop-button').css({
        'z-index': '10000',
        'display': 'flex',
        'opacity': '1',
        'pointer-events': 'auto'
    }).fadeIn(300);
    
    // 添加固定位置类，确保在滚动时仍可见
    $('#stop-button').addClass('fixed-stop-button');
}

// 隐藏停止按钮
function hideStopButton() {
    $('#stop-button').fadeOut(300);
    $('#stop-button').removeClass('fixed-stop-button');
}

// 停止当前响应流
function stopResponseGeneration() {
    if (currentStream) {
        currentStream.close();
        currentStream = null;
        
        // 更新界面状态
        isWaitingForResponse = false;
        hideStopButton();
        
        // 获取当前响应的消息框 - 查找最后一个正在加载的消息
        const currentBotMessage = $('.message.bot-message.loading').last();
        
        if (currentBotMessage.length > 0) {
            const messageText = currentBotMessage.find('.message-text');
            
            // 移除加载状态和打字指示器
            currentBotMessage.removeClass('loading');
            messageText.find('.typing-indicator').remove();
            messageText.find('.typing').remove();
            
            // 检查是否已有实际内容
            const hasContent = messageText.children().not('.typing-indicator, .typing, .response-stopped').length > 0;
            
            if (hasContent) {
                // 如果有内容，添加中断标记
                messageText.append('<div class="response-stopped"><em>（响应已中断）</em></div>');
                currentBotMessage.addClass('response-interrupted');
            } else {
                // 如果没有内容，显示中断消息
                messageText.html('<p><em>响应已被用户中断</em></p>');
            }
        }
    }
}

// 添加停止按钮事件监听
$(document).ready(function() {
    $('#stop-button').click(function() {
        stopResponseGeneration();
    });
    
    // 添加ESC键响应
    $(document).keydown(function(e) {
        // 如果按下了ESC键 (keyCode 27) 并且当前有响应流
        if (e.keyCode === 27 && isWaitingForResponse && currentStream) {
            stopResponseGeneration();
            e.preventDefault();
        }
    });
});
