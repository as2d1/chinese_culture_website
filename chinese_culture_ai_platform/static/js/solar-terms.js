// 使用solar-terms-data.js中的完整节气数据
// 将当前时间转换为北京时间
function getBeijingDate() {
    const now = new Date();
    
    // 获取本地时间与UTC的时差（分钟）
    const localOffset = now.getTimezoneOffset();
    
    // 北京时间是UTC+8，即偏移-480分钟
    const beijingOffset = -480;
    
    // 计算本地时间与北京时间的时差（毫秒）
    const offsetMs = (beijingOffset - localOffset) * 60 * 1000;
    
    // 创建北京时间日期对象
    const beijingDate = new Date(now.getTime() + offsetMs);
    
    console.log('本地时间：', now.toString());
    console.log('本地时区偏移（分钟）：', localOffset);
    console.log('北京时间：', beijingDate.toString());
    console.log('北京日期时间戳：', beijingDate.getTime());
    
    return beijingDate;
}

// 获取最接近当前日期且尚未到达的节气（以北京时间为准）
function getUpcomingSolarTerm() {
    // 确保allSolarTerms已加载
    if (!window.allSolarTerms) {
        console.error('节气数据未加载');
        return null;
    }
    
    // 获取北京时间的今天日期（只保留年月日，不考虑时分秒）
    const beijingNow = getBeijingDate();
    
    // 使用北京时间的年月日创建日期对象（重要：使用UTC来创建，这样可以确保日期比较的一致性）
    const today = new Date(Date.UTC(beijingNow.getFullYear(), beijingNow.getMonth(), beijingNow.getDate(), 0, 0, 0));
    
    const currentYear = beijingNow.getFullYear();
    let nextTerm = null;
    let minDaysDiff = Infinity;
    
    console.log('当前北京日期（ISO格式）：', today.toISOString());
    console.log('当前北京日期（本地格式）：', beijingNow.getFullYear() + '年' + (beijingNow.getMonth() + 1) + '月' + beijingNow.getDate() + '日');
    
    // 检查今年的节气
    for (let i = 0; i < window.allSolarTerms.length; i++) {
        const term = window.allSolarTerms[i];
        const termDate = term.yearlyDate(currentYear);
        
        // 计算节气日期与今天的天数差（使用UTC时间戳确保计算准确）
        const daysDiff = Math.floor((termDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
        
        console.log(`节气: ${term.name}, 日期: ${termDate.toISOString()}, 本地显示: ${currentYear}年${term.month}月${term.day}日, 差距天数: ${daysDiff}`);
        
        // 只考虑未到达的节气（天数差为正数或当天）
        if (daysDiff >= 0 && daysDiff < minDaysDiff) {
            minDaysDiff = daysDiff;
            nextTerm = term;
        }
    }
    
    // 如果今年没有找到未到的节气，看看明年的第一个节气
    if (!nextTerm && window.allSolarTerms.length > 0) {
        const firstTermNextYear = window.allSolarTerms[0];
        nextTerm = Object.assign({}, firstTermNextYear);
        const termDate = firstTermNextYear.yearlyDate(currentYear + 1);
        
        // 计算到明年第一个节气的天数差
        minDaysDiff = Math.floor((termDate - today) / (24 * 60 * 60 * 1000));
    }
    
    // 如果找到了节气，添加日期和倒计时信息
    if (nextTerm) {
        const termDate = nextTerm.yearlyDate(currentYear);
        
        // 如果是明年的节气
        if (minDaysDiff > 366) {
            termDate.setUTCFullYear(currentYear + 1);
        }
        
        // 将UTC时间转换为可读的北京时间（UTC+8）展示格式
        // 注意：月份需要+1，因为JavaScript的月份是从0开始的
        nextTerm.formattedDate = `${termDate.getUTCFullYear()}年${termDate.getUTCMonth() + 1}月${termDate.getUTCDate()}日`;
        
        // 当天显示"今天"而不是0天
        if (minDaysDiff === 0) {
            nextTerm.countDown = 0;
            nextTerm.countDownText = "今天";
        } else {
            nextTerm.countDown = minDaysDiff;
            nextTerm.countDownText = `${minDaysDiff}天后`;
        }
        
        console.log(`下一个节气: ${nextTerm.name}, 格式化日期: ${nextTerm.formattedDate}, 倒计时: ${nextTerm.countDownText}`);
    }
    
    return nextTerm;
}

// 显示即将到来的节气信息
function showSolarTerm() {
    const solarTerm = getUpcomingSolarTerm();
    
    if (!solarTerm) {
        console.error('无法获取节气信息');
        return;
    }
    
    // 检查是否已经存在节气卡片
    if ($('.solar-term-card').length > 0) {
        return; // 如果已存在则不重复添加
    }
    
    // 为每个习俗创建标签
    const customTags = solarTerm.customs.map(custom => 
        `<span class="custom-tag">${custom}</span>`
    ).join('');
    
    // 使用预先计算好的倒计时文本
    const countDownText = solarTerm.countDownText || 
        (solarTerm.countDown === 0 ? '今天' : `还有 ${solarTerm.countDown} 天`);
    
    // 创建节气卡片
    const termCard = `
        <div class="solar-term-card animate__animated animate__fadeIn">
            <div class="solar-term-name">${solarTerm.name}</div>
            <div class="solar-term-date">
                <span class="date-text">${solarTerm.formattedDate}</span>
                <span class="countdown ${solarTerm.countDown === 0 ? 'today' : ''}">${countDownText}</span>
            </div>
            <div class="solar-term-description">${solarTerm.description}</div>
            <div class="solar-term-customs">
                <strong>传统习俗</strong>
                ${customTags}
            </div>
        </div>
    `;
    
    // 添加到聊天历史中，紧随每日诗词之后
    if ($('.daily-poem-card').length > 0) {
        $('.daily-poem-card').after(termCard);
    } else {
        $('#chat-history').prepend(termCard);
    }

    // 在节气卡片之后添加欢迎词卡片（避免重复）
        const dismissed = localStorage.getItem('chatWelcomeDismissedV2') === 'true';
    if ($('.chat-welcome-card').length === 0 && !dismissed) {
        const welcomeCard = `
            <div class="chat-welcome-card animate__animated animate__fadeIn">
                <button class="chat-welcome-close" title="关闭" aria-label="关闭欢迎提示">&times;</button>
                <div class="chat-welcome-title"><i class="fas fa-handshake"></i> 欢迎使用文化智友</div>
                <div class="chat-welcome-text">
                    这里可提问历史、节气、诗词、艺术、哲学等传统文化主题。直接输入问题，或从左侧分类快速开始。
                </div>
            </div>
        `;
        if ($('.solar-term-card').length > 0) {
            $('.solar-term-card').last().after(welcomeCard);
        } else if ($('.daily-poem-card').length > 0) {
            $('.daily-poem-card').last().after(welcomeCard);
        } else {
            $('#chat-history').prepend(welcomeCard);
        }

        // 绑定关闭事件并记录，不再重复显示
        $(document).on('click', '.chat-welcome-close', function() {
            $(this).closest('.chat-welcome-card').slideUp(200, function() {
                $(this).remove();
            });
                try { localStorage.setItem('chatWelcomeDismissedV2', 'true'); } catch (e) {}
        });
    }
    
    // 添加动画效果
    setTimeout(() => {
        $('.solar-term-card .custom-tag').each(function(index) {
            $(this).css('animation', `fadeInUp 0.3s ease forwards ${index * 0.1}s`);
        });
    }, 500);
}

// 为了在清除对话时能重新调用此函数，我们将其导出为全局函数
window.showSolarTermInfo = showSolarTerm;

// 页面加载时显示节气信息
$(document).ready(function() {
    // 延迟执行，确保每日诗词和节气数据已经加载
    setTimeout(() => {
        showSolarTerm();
    }, 700);
});
