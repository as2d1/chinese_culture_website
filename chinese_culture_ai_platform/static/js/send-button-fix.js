/**
 * 发送按钮增强动画
 */
$(document).ready(function() {
    // 发送按钮悬停和点击动画
    const sendBtn = $('.send-btn');
    
    // 悬停效果
    sendBtn.hover(
        function() {
            $(this).addClass('btn-hover');
        },
        function() {
            $(this).removeClass('btn-hover');
        }
    );
    
    // 点击效果
    sendBtn.on('mousedown', function() {
        $(this).addClass('btn-active');
    });
    
    $(document).on('mouseup', function() {
        sendBtn.removeClass('btn-active');
    });
    
    // 修复输入框和按钮的交互
    $('#question-input').on('focus', function() {
        $('.input-group').addClass('input-focused');
    }).on('blur', function() {
        $('.input-group').removeClass('input-focused');
    });
});
