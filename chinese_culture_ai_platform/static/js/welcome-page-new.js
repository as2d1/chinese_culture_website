// 欢迎页面脚本 - 使用共享诗词数据
// 注意：此文件需要在poem-data.js之后加载

// 节气数据保留在这里（不需要移动到共享文件）
const welcomeSolarTerms = [
    {
        name: '立春',
        description: '立，是开始的意思，立春就是春季的开始。它是农历二十四节气中的第一个节气，每年2月4日前后太阳到达黄经315°时为立春。立春之日，太阳位于黄经315°，迎着春天的到来，自然界逐渐转暖，意味着万物复苏的开始。',
        customs: ['放风筝', '吃春饼', '咬春', '迎春'],
        date: function() {
            const today = new Date();
            const year = today.getFullYear();
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
    },
    {
        name: '清明',
        description: '清明是二十四节气中的第5个节气，每年4月5日前后太阳到达黄经15°时为清明。清明，顾名思义就是天气晴朗，草木繁茂，万物欣欣向荣的景象。清明节是中国传统的重要节日，扫墓祭祖是这一天的重要习俗。',
        customs: ['扫墓', '踏青', '放风筝', '荡秋千'],
        date: function() {
            const today = new Date();
            const year = today.getFullYear();
            return `${year}年4月5日前后`;
        }
    },
    {
        name: '立夏',
        description: '立夏是二十四节气中的第7个节气，每年5月6日前后太阳到达黄经45°时为立夏。立夏，是夏季的开始，意味着气温明显升高，炎热季节来临，雷雨增多。',
        customs: ['称人', '饮菖蒲酒', '挂艾草', '斗蛋'],
        date: function() {
            const today = new Date();
            const year = today.getFullYear();
            return `${year}年5月6日前后`;
        }
    }
];

// 显示每日诗词
function showWelcomeDailyPoem() {
    // 使用共享的诗词数据
    const poem = window.getSharedDailyPoem();

    const poemHTML = `
        <div class="welcome-poem-title">${poem.title}</div>
        <div class="welcome-poem-content">${poem.content}</div>
        <div class="welcome-poem-author">${poem.dynasty}·${poem.author}</div>
        <div class="welcome-poem-explanation">${poem.explanation}</div>
    `;

    $('#welcome-poem-card').html(poemHTML);
}

// 显示即将到来的节气信息
function showWelcomeSolarTerm() {
    // 使用与主页面相同的函数获取即将到来的节气
    if (typeof getUpcomingSolarTerm !== 'function') {
        console.error('getUpcomingSolarTerm函数未加载');
        return;
    }

    const solarTerm = getUpcomingSolarTerm();

    if (!solarTerm) {
        console.error('无法获取节气信息');
        return;
    }

    // 为每个习俗创建标签
    const customTags = solarTerm.customs.map(custom =>
        `<span class="custom-tag">${custom}</span>`
    ).join('');

    // 创建倒计时文本
    const countDownText = solarTerm.countDown === 0 ?
        '今天' :
        `还有 ${solarTerm.countDown} 天`;

    const termHTML = `
        <div class="welcome-solar-term-name">${solarTerm.name}</div>
        <div class="welcome-solar-term-date">${solarTerm.formattedDate} <span class="countdown">${countDownText}</span></div>
        <div class="welcome-solar-term-description">${solarTerm.description}</div>
        <div class="welcome-solar-term-customs">
            <strong>传统习俗</strong>
            ${customTags}
        </div>
    `;

    $('#welcome-solar-term').html(termHTML);

    // 添加动画效果
    setTimeout(() => {
        $('.custom-tag').each(function(index) {
            $(this).css('animation', `fadeInUp 0.3s ease forwards ${index * 0.1}s`);
        });
    }, 500);
}

// 页面加载完成后执行
$(document).ready(function() {
    // 显示每日诗词
    showWelcomeDailyPoem();

    // 显示节气信息
    showWelcomeSolarTerm();

    // 添加进入按钮的动画
    $('.enter-button').hover(
        function() {
            $(this).find('i').addClass('fa-bounce');
        },
        function() {
            $(this).find('i').removeClass('fa-bounce');
        }
    );
});
