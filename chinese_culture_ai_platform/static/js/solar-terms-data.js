// 完整的二十四节气数据
const allSolarTerms = [
    {
        name: '立春',
        description: '立，是开始的意思，立春就是春季的开始。它是农历二十四节气中的第一个节气，每年2月4日前后太阳到达黄经315°时为立春。立春之日，太阳位于黄经315°，迎着春天的到来，自然界逐渐转暖，意味着万物复苏的开始。',
        customs: ['放风筝', '吃春饼', '咬春', '迎春'],
        month: 2,
        day: 4,
        yearlyDate: function(year) {
            // 确保返回的是北京时间午夜，即UTC+8
            return new Date(Date.UTC(year, 1, 4, 0, 0, 0)); // 使用UTC时间以保证全球一致
        }
    },
    {
        name: '雨水',
        description: '雨水是二十四节气中的第2个节气，每年2月19日前后太阳到达黄经330°时为雨水。雨水的到来，意味着降水量将会逐渐增多，雨雪交加，空气湿度不断增大，由降雪开始转为降雨。',
        customs: ['祭白虎', '赏花灯', '迎春祈福'],
        month: 2,
        day: 19,
        yearlyDate: function(year) {
            // 确保返回的是北京时间午夜，即UTC+8
            return new Date(Date.UTC(year, 1, 19, 0, 0, 0));
        }
    },
    {
        name: '惊蛰',
        description: '惊蛰是二十四节气中的第3个节气，每年3月6日前后太阳到达黄经345°时为惊蛰。惊蛰的到来，标志着天气转暖，春雷始鸣，惊醒了蛰伏在土中冬眠的昆虫，万物复苏，农耕活动开始。',
        customs: ['打小人', '祭白虎', '吃梨'],
        month: 3,
        day: 6,
        yearlyDate: function(year) {
            // 确保返回的是北京时间午夜，即UTC+8
            return new Date(Date.UTC(year, 2, 6, 0, 0, 0));
        }
    },
    {
        name: '春分',
        description: '春分是二十四节气中的第4个节气，每年3月21日前后太阳到达黄经0°时为春分。春分这天，太阳几乎直射赤道，昼夜几乎相等。这一天也被视为万物生长的起点，是播种的大好时机。',
        customs: ['祭日', '竖蛋', '踏青'],
        month: 3,
        day: 21,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 2, 21));
        }
    },
    {
        name: '清明',
        description: '清明是二十四节气中的第5个节气，每年4月5日前后太阳到达黄经15°时为清明。清明，顾名思义就是天气晴朗，草木繁茂，万物欣欣向荣的景象。清明节是中国传统的重要节日，扫墓祭祖是这一天的重要习俗。',
        customs: ['扫墓', '踏青', '放风筝', '荡秋千'],
        month: 4,
        day: 5,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 3, 5));
        }
    },
    {
        name: '谷雨',
        description: '谷雨是二十四节气中的第6个节气，每年4月20日前后太阳到达黄经30°时为谷雨。谷雨是春季最后一个节气，谷雨过后雨水增多，利于谷类农作物生长，故称谷雨。谷雨时节，雨量充足，气温适宜，正是播种移苗的最佳时节。',
        customs: ['尝春茶', '植树', '祭雨神'],
        month: 4,
        day: 20,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 3, 20));
        }
    },
    {
        name: '立夏',
        description: '立夏是二十四节气中的第7个节气，每年5月6日前后太阳到达黄经45°时为立夏。立夏，是夏季的开始，意味着气温明显升高，炎热季节来临，雷雨增多。',
        customs: ['称人', '饮菖蒲酒', '挂艾草', '斗蛋'],
        month: 5,
        day: 6,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 4, 6));
        }
    },
    {
        name: '小满',
        description: '小满是二十四节气中的第8个节气，每年5月21日前后太阳到达黄经60°时为小满。小满时节，南方地区麦类等夏熟作物籽粒开始饱满，但还未成熟，所以称为小满。此时气温升高，降水增多，是农作物生长的重要阶段。',
        customs: ['尝麦饭', '赏石榴花', '晾晒衣物'],
        month: 5,
        day: 21,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 4, 21));
        }
    },
    {
        name: '芒种',
        description: '芒种是二十四节气中的第9个节气，每年6月6日前后太阳到达黄经75°时为芒种。芒种，是有芒的麦子快要成熟、可以播种的意思。此时，麦类等有芒作物成熟，同时也是播种谷黍等农作物的时节。',
        customs: ['吃青梅', '赶蚊虫', '晒书画'],
        month: 6,
        day: 6,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 5, 6));
        }
    },
    {
        name: '夏至',
        description: '夏至是二十四节气中的第10个节气，每年6月21日前后太阳到达黄经90°时为夏至。夏至这天，太阳直射地面的位置到达一年的最北端，北半球各地的白昼时间达到全年最长。夏至也意味着炎热的夏天正式开始。',
        customs: ['吃凉面', '洗冷水浴', '饮用绿豆汤', '赏荷花'],
        month: 6,
        day: 21,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 5, 21));
        }
    },
    {
        name: '小暑',
        description: '小暑是二十四节气中的第11个节气，每年7月7日前后太阳到达黄经105°时为小暑。小暑，表示盛夏正式开始，天气开始进入炎热状态，但还没有到最热的时候。这一时期也是雷雨、高温、高湿的"桑拿天"多发期。',
        customs: ['吃西瓜', '喝绿豆汤', '晾晒中药材'],
        month: 7,
        day: 7,
        yearlyDate: function(year) {
            // 确保返回的是北京时间午夜，即UTC+8
            return new Date(Date.UTC(year, 6, 7, 0, 0, 0));
        }
    },
    {
        name: '大暑',
        description: '大暑是二十四节气中的第12个节气，每年7月23日前后太阳到达黄经120°时为大暑。大暑，是一年中最热的节气，此时正值"三伏天"里的"中伏"前后，也是一年中气温最高、最闷热的时期。',
        customs: ['吃羊肉', '喝姜汤', '用扇子', '饮绿豆汤'],
        month: 7,
        day: 23,
        yearlyDate: function(year) {
            // 确保返回的是北京时间午夜，即UTC+8
            return new Date(Date.UTC(year, 6, 23, 0, 0, 0));
        }
    },
    {
        name: '立秋',
        description: '立秋是二十四节气中的第13个节气，每年8月7日前后太阳到达黄经135°时为立秋。立秋，意味着秋天的开始，炎热的夏季即将过去，秋高气爽的季节即将到来。此时，田间的农作物开始成熟，一派丰收在望的景象。',
        customs: ['贴秋膘', '吃西瓜', '啃秋'],
        month: 8,
        day: 7,
        yearlyDate: function(year) {
            // 确保返回的是北京时间午夜，即UTC+8
            return new Date(Date.UTC(year, 7, 7, 0, 0, 0));
        }
    },
    {
        name: '处暑',
        description: '处暑是二十四节气中的第14个节气，每年8月23日前后太阳到达黄经150°时为处暑。处暑，是表示炎热的夏天结束，暑气逐渐消退。此后，天气由炎热向凉爽过渡，气温逐渐下降，早晚温差加大。',
        customs: ['喝莲子汤', '吃西瓜', '晒秋'],
        month: 8,
        day: 23,
        yearlyDate: function(year) {
            // 确保返回的是北京时间午夜，即UTC+8
            return new Date(Date.UTC(year, 7, 23, 0, 0, 0));
        }
    },
    {
        name: '白露',
        description: '白露是二十四节气中的第15个节气，每年9月8日前后太阳到达黄经165°时为白露。白露，是表示天气转凉，露水开始凝结。此时，夜晚天气转凉，温度下降到露点以下，水蒸气便会在植物表面凝结成白色露珠，因此叫白露。',
        customs: ['饮用白露茶', '吃芝麻', '品尝螃蟹'],
        month: 9,
        day: 8,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 8, 8));
        }
    },
    {
        name: '秋分',
        description: '秋分是二十四节气中的第16个节气，每年9月23日前后太阳到达黄经180°时为秋分。秋分这一天，太阳几乎直射赤道，全球各地昼夜几乎相等。秋分过后，北半球昼短夜长，南半球则相反。秋分也是传统的"祭月节"。',
        customs: ['拜月', '赏月', '吃月饼', '吃秋分果'],
        month: 9,
        day: 23,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 8, 23));
        }
    },
    {
        name: '寒露',
        description: '寒露是二十四节气中的第17个节气，每年10月8日前后太阳到达黄经195°时为寒露。寒露，表示天气更加寒冷，露水更加寒凉。此时，秋意渐浓，早晚温差大，空气湿度增大，露水凝结更多，天气开始转凉。',
        customs: ['喝寒露茶', '赏菊', '吃柿子'],
        month: 10,
        day: 8,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 9, 8));
        }
    },
    {
        name: '霜降',
        description: '霜降是二十四节气中的第18个节气，也是秋季的最后一个节气，每年10月23日前后太阳到达黄经210°时为霜降。霜降时节，天气渐冷，开始有霜冻出现，预示着冬天即将来临。此时，深秋景象明显，树叶开始大量脱落。',
        customs: ['赏枫叶', '吃柿子', '喝姜汤'],
        month: 10,
        day: 23,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 9, 23));
        }
    },
    {
        name: '立冬',
        description: '立冬是二十四节气中的第19个节气，每年11月7日前后太阳到达黄经225°时为立冬。立冬，表示冬季的开始，意味着天气开始变得寒冷，温度显著下降。民间有立冬进补的习俗，以增强抵抗寒冷的能力。',
        customs: ['吃饺子', '进补', '祭祀'],
        month: 11,
        day: 7,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 10, 7));
        }
    },
    {
        name: '小雪',
        description: '小雪是二十四节气中的第20个节气，每年11月22日前后太阳到达黄经240°时为小雪。小雪，表示开始降雪，但雪量不大。此时，气温显著下降，开始出现降雪现象，但雪量较小，故称小雪。',
        customs: ['围炉煮茶', '吃羊肉', '腌制腊肉'],
        month: 11,
        day: 22,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 10, 22));
        }
    },
    {
        name: '大雪',
        description: '大雪是二十四节气中的第21个节气，每年12月7日前后太阳到达黄经255°时为大雪。大雪，表示降雪量增大。此时，天气更加寒冷，降雪的可能性和降雪量都比小雪时节有所增加。',
        customs: ['温灸', '堆雪人', '吃羊肉'],
        month: 12,
        day: 7,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 11, 7));
        }
    },
    {
        name: '冬至',
        description: '冬至是二十四节气中的第22个节气，每年12月22日前后太阳到达黄经270°时为冬至。冬至这一天，北半球白昼最短，夜晚最长。冬至是中国民间的传统节日，有"冬至大如年"的说法，民间有吃饺子、赏梅等习俗。',
        customs: ['吃饺子', '吃汤圆', '贴九九消寒图'],
        month: 12,
        day: 22,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 11, 22));
        }
    },
    {
        name: '小寒',
        description: '小寒是二十四节气中的第23个节气，每年1月6日前后太阳到达黄经285°时为小寒。小寒，表示寒冷开始加剧。此时，天气寒冷，但还没有到达最冷的时候。民间有"小寒胜大寒"的说法，表示有时小寒会比大寒还冷。',
        customs: ['吃腊八粥', '炖羊肉', '吃萝卜'],
        month: 1,
        day: 6,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 0, 6));
        }
    },
    {
        name: '大寒',
        description: '大寒是二十四节气中的第24个节气，也是冬季的最后一个节气，每年1月20日前后太阳到达黄经300°时为大寒。大寒，表示寒冷达到极点。此时，是一年中最寒冷的时节，但过了大寒，天气就会逐渐回暖。',
        customs: ['吃糯米饭', '熬姜汤', '贴窗花'],
        month: 1,
        day: 20,
        yearlyDate: function(year) {
            return new Date(Date.UTC(year, 0, 20));
        }
    }
];

// 导出数据
window.allSolarTerms = allSolarTerms;
