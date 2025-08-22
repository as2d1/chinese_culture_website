// 每日诗词功能 - 使用共享诗词数据
// 注意：此文件需要在poem-data.js之后加载

// 显示每日诗词
function showDailyPoem() {
    // 使用共享的诗词数据
    const poem = window.getSharedDailyPoem();
    
    // 检查是否已经存在诗词卡片
    if ($('.daily-poem-wrapper').length > 0) {
        return; // 如果已存在则不重复添加
    }
    
    // 创建每日诗词卡片 - 添加额外的wrapper确保正确显示
    const poemCard = `
        <div class="daily-poem-wrapper">
            <div class="daily-poem-card animate__animated animate__fadeIn">
                <div class="daily-poem-title">今日诗词：${poem.title}</div>
                <div class="daily-poem-content">${poem.content}</div>
                <div class="daily-poem-author">${poem.dynasty}·${poem.author}</div>
                <div class="daily-poem-explanation">${poem.explanation}</div>
            </div>
        </div>
    `;
    
    // 添加到聊天历史顶部
    $('#chat-history').prepend(poemCard);
    
    // 添加延迟检查确保诗词卡片可见且完整显示
    setTimeout(() => {
        // 确保卡片可见且高度正确
        $('.daily-poem-card').css('height', 'auto');
        $('.daily-poem-card').css('max-height', 'none');
        $('.daily-poem-card').css('overflow', 'visible');
    }, 100);
}

// 页面加载时显示每日诗词
$(document).ready(function() {
    // 短暂延迟以确保DOM完全加载
    setTimeout(() => {
        showDailyPoem();
    }, 500);
});

// 为了在清除对话时能重新调用此函数，我们将其导出为全局函数
window.showDailyPoem = showDailyPoem;
