// 共享的每日诗词数据
const sharedPoems = [
    {
        title: '春晓',
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        author: '孟浩然',
        dynasty: '唐',
        explanation: '描绘了一个春日清晨的美好景象，诗人被鸟叫声唤醒，思索着昨夜风雨吹落了多少花朵。'
    },
    {
        title: '静夜思',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        author: '李白',
        dynasty: '唐',
        explanation: '诗人夜晚看到地上的月光，勾起对家乡的思念之情，表达了游子对故乡的深深眷恋。'
    },
    {
        title: '登鹳雀楼',
        content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
        author: '王之涣',
        dynasty: '唐',
        explanation: '登高望远，描绘了雄伟的自然景观，表达了诗人积极进取、追求更高境界的人生态度。'
    },
    {
        title: '相思',
        content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
        author: '王维',
        dynasty: '唐',
        explanation: '以红豆象征相思之情，表达了诗人对远方友人的思念和美好祝愿。'
    },
    {
        title: '峨眉山月歌',
        content: '峨眉山月半轮秋，影入平羌江水流。夜发清溪向三峡，思君不见下渝州。',
        author: '李白',
        dynasty: '唐',
        explanation: '描述了峨眉山下的月夜美景，以及诗人漂泊途中对友人的思念之情。'
    },
    {
        title: '望庐山瀑布',
        content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
        author: '李白',
        dynasty: '唐',
        explanation: '描绘了庐山瀑布气势磅礴的壮丽景象，展现了诗人对自然奇观的赞美和惊叹。'
    },
    {
        title: '鹿柴',
        content: '空山不见人，但闻人语响。返景入深林，复照青苔上。',
        author: '王维',
        dynasty: '唐',
        explanation: '描绘了山林幽静的环境中，阳光照在青苔上的宁静景象，体现了诗人对自然的感悟和对禅意的追求。'
    },
    {
        title: '送别',
        content: '山中相送罢，日暮掩柴扉。春草年年绿，王孙归不归？',
        author: '王维',
        dynasty: '唐',
        explanation: '描述了在山中送别友人后的惆怅心情，以及对友人是否还会归来的期盼与担忧。'
    },
    {
        title: '绝句',
        content: '两个黄鹂鸣翠柳，一行白鹭上青天。窗含西岭千秋雪，门泊东吴万里船。',
        author: '杜甫',
        dynasty: '唐',
        explanation: '描绘了一幅自然和谐的画面，表现了诗人对安定生活的向往和对广阔世界的关注。'
    },
    {
        title: '赋得古原草送别',
        content: '离离原上草，一岁一枯荣。野火烧不尽，春风吹又生。远芳侵古道，晴翠接荒城。又送王孙去，萋萋满别情。',
        author: '白居易',
        dynasty: '唐',
        explanation: '以原野上的野草象征生命的顽强和友情的永恒，表达了送别友人的不舍之情。'
    },
    {
        title: '山行',
        content: '远上寒山石径斜，白云生处有人家。停车坐爱枫林晚，霜叶红于二月花。',
        author: '杜牧',
        dynasty: '唐',
        explanation: '描绘了一个秋日登山的美好景色，表达了诗人对自然美景的欣赏和热爱。'
    },
    {
        title: '清明',
        content: '清明时节雨纷纷，路上行人欲断魂。借问酒家何处有，牧童遥指杏花村。',
        author: '杜牧',
        dynasty: '唐',
        explanation: '描绘了清明时节细雨绵绵的景象，以及行人在雨中寻找酒家的情景，表现了清明祭祖的习俗与氛围。'
    }
];

// 导出共享数据，使其他脚本可以访问
window.sharedPoems = sharedPoems;

// 获取每日诗词的通用函数
function getSharedDailyPoem() {
    // 根据北京时间日期生成一个固定的索引，确保同一天显示相同的诗词
    const today = getBeijingDate();
    const dateStr = `${today.getFullYear()}${today.getMonth()+1}${today.getDate()}`;
    const index = parseInt(dateStr, 10) % sharedPoems.length;
    
    return sharedPoems[index];
}

// 获取北京时间
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
    
    return beijingDate;
}

// 导出获取诗词的函数
window.getSharedDailyPoem = getSharedDailyPoem;
