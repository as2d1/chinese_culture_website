// 节气功能
const solarTerms = [
    {
        name: '立春',
        description: '立，是开始的意思，立春就是春季的开始。它是农历二十四节气中的第一个节气，每年2月4日前后太阳到达黄经315°时为立春。立春之日，太阳位于黄经315°，迎着春天的到来，自然界逐渐转暖，意味着万物复苏的开始。',
        customs: ['放风筝', '吃春饼', '咬春', '迎春'],
        date: function() {
            const today = new Date();
            const year = today.getFullYear();
            // 立春一般在2月3日至5日之间
            return `${year}年2月4日前后`;
        }
    },
    {
        name: '雨水',
        description: '雨水是二十四节气中的第2个节气，每年2月19日前后太阳到达黄经330°时为雨水。雨水的到来，意味着降水量将会逐渐增多，雨雪交加，空气湿度不断增大，由降雪开始转为降雨。',
        customs: ['祭白虎', '赏花灯', '迎春祈福'],
        date: function() {
            const today = new Date();
            const year = today.getFullYear();
            return `${year}年2月19日前后`;
        }
    },
    {
        name: '惊蛰',
        description: '惊蛰是二十四节气中的第3个节气，每年3月6日前后太阳到达黄经345°时为惊蛰。惊蛰的到来，标志着天气转暖，春雷始鸣，惊醒了蛰伏在土中冬眠的昆虫，万物复苏，农耕活动开始。',
        customs: ['打小人', '祭白虎', '吃梨'],
        date: function() {
            const today = new Date();
            const year = today.getFullYear();
            return `${year}年3月6日前后`;
        }
    }
];

// 获取当前节气信息
function getCurrentSolarTerm() {
    // 这里简化处理，实际应该根据真实日期计算当前节气
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // 简单判断当前节气
    let currentTerm = null;
    
    if (month === 2 && day <= 18) {
        currentTerm = solarTerms[0]; // 立春
    } else if (month === 2 && day > 18) {
        currentTerm = solarTerms[1]; // 雨水
    } else if (month === 3 && day <= 20) {
        currentTerm = solarTerms[2]; // 惊蛰
    } else {
        // 默认返回立春
        currentTerm = solarTerms[0];
    }
    
    return currentTerm;
}

// 显示当前节气信息
function showSolarTerm() {
    const solarTerm = getCurrentSolarTerm();
    
    // 创建节气卡片
    const termCard = `
        <div class="solar-term-card animate__animated animate__fadeIn">
            <div class="solar-term-name">${solarTerm.name}</div>
            <div class="solar-term-date">${solarTerm.date()}</div>
            <div class="solar-term-description">${solarTerm.description}</div>
            <div class="solar-term-customs">
                <strong>习俗：</strong> ${solarTerm.customs.join('、')}
            </div>
        </div>
    `;
    
    // 添加到聊天历史中，紧随每日诗词之后
    $('.daily-poem-card').after(termCard);
}

// 页面加载时显示节气信息
$(document).ready(function() {
    // 延迟执行，确保每日诗词已经加载
    setTimeout(() => {
        showSolarTerm();
    }, 700);
});
