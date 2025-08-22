/**
 * 优化中断响应和字体统一的辅助函数
 */

$(document).ready(function() {
    // 监听DOM更改，确保字体样式统一应用
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // 检查是否有新增的消息
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.classList && node.classList.contains('message')) {
                        // 确保字体统一
                        ensureConsistentFonts();
                    }
                }
            }
        });
    });
    
    // 配置观察选项
    const config = { childList: true, subtree: true };
    
    // 开始观察聊天历史区域
    observer.observe(document.getElementById('chat-history'), config);
    
    // 初始化时确保字体一致
    ensureConsistentFonts();
});

/**
 * 确保所有消息使用一致的字体样式
 */
function ensureConsistentFonts() {
    // 获取基本字体样式
    const baseFontFamily = getComputedStyle(document.body).fontFamily;
    
    // 应用到所有消息，确保一致性
    $('.message-text').each(function() {
        // 跳过欢迎消息的首行
        if (!$(this).closest('.bot-message').is(':first-child') || 
            !$(this).find('p:first-child').length) {
            $(this).css('font-family', baseFontFamily);
        }
    });
}

/**
 * 优化的中断响应处理
 * 由interrupt-response.js调用
 */
function handleResponseInterruption(messageElement) {
    if (!messageElement || !messageElement.length) return;
    
    // 触发浏览器重绘，确保动画停止
    messageElement[0].offsetHeight;
    
    // 强制重绘，修复可能的渲染问题
    setTimeout(function() {
        messageElement.addClass('force-repaint');
        setTimeout(function() {
            messageElement.removeClass('force-repaint');
        }, 10);
    }, 50);
}
