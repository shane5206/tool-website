/* 台灣地址中翻英 — 漢語拼音規範（中華郵政）
   - 22 縣市 + ~170 鄉鎮市區
   - 常見路名字典 + 漢語拼音字典 fallback
   - 解析郵遞區號 / 段 / 巷 / 弄 / 號 / 樓 / 室 / 之
*/
(function () {

  /* -------- 縣市 -------- */
  const CITIES = {
    '臺北市': 'Taipei City', '台北市': 'Taipei City',
    '新北市': 'New Taipei City',
    '桃園市': 'Taoyuan City',
    '臺中市': 'Taichung City', '台中市': 'Taichung City',
    '臺南市': 'Tainan City', '台南市': 'Tainan City',
    '高雄市': 'Kaohsiung City',
    '基隆市': 'Keelung City',
    '新竹市': 'Hsinchu City',
    '嘉義市': 'Chiayi City',
    '新竹縣': 'Hsinchu County',
    '苗栗縣': 'Miaoli County',
    '彰化縣': 'Changhua County',
    '南投縣': 'Nantou County',
    '雲林縣': 'Yunlin County',
    '嘉義縣': 'Chiayi County',
    '屏東縣': 'Pingtung County',
    '宜蘭縣': 'Yilan County',
    '花蓮縣': 'Hualien County',
    '臺東縣': 'Taitung County', '台東縣': 'Taitung County',
    '澎湖縣': 'Penghu County',
    '金門縣': 'Kinmen County',
    '連江縣': 'Lienchiang County'
  };

  /* -------- 鄉鎮市區 -------- */
  const DISTRICTS = {
    // 台北市
    '中正區': 'Zhongzheng Dist.', '大同區': 'Datong Dist.', '中山區': 'Zhongshan Dist.',
    '松山區': 'Songshan Dist.', '大安區': "Da'an Dist.", '萬華區': 'Wanhua Dist.',
    '信義區': 'Xinyi Dist.', '士林區': 'Shilin Dist.', '北投區': 'Beitou Dist.',
    '內湖區': 'Neihu Dist.', '南港區': 'Nangang Dist.', '文山區': 'Wenshan Dist.',
    // 新北市
    '板橋區': 'Banqiao Dist.', '三重區': 'Sanchong Dist.', '中和區': 'Zhonghe Dist.',
    '永和區': 'Yonghe Dist.', '新莊區': 'Xinzhuang Dist.', '新店區': 'Xindian Dist.',
    '土城區': 'Tucheng Dist.', '蘆洲區': 'Luzhou Dist.', '樹林區': 'Shulin Dist.',
    '汐止區': 'Xizhi Dist.', '淡水區': 'Tamsui Dist.', '三峽區': 'Sanxia Dist.',
    '林口區': 'Linkou Dist.', '泰山區': 'Taishan Dist.', '鶯歌區': 'Yingge Dist.',
    '五股區': 'Wugu Dist.', '八里區': 'Bali Dist.', '深坑區': 'Shenkeng Dist.',
    '石碇區': 'Shiding Dist.', '坪林區': 'Pinglin Dist.', '烏來區': 'Wulai Dist.',
    '金山區': 'Jinshan Dist.', '萬里區': 'Wanli Dist.', '貢寮區': 'Gongliao Dist.',
    '雙溪區': 'Shuangxi Dist.', '平溪區': 'Pingxi Dist.', '瑞芳區': 'Ruifang Dist.',
    '石門區': 'Shimen Dist.', '三芝區': 'Sanzhi Dist.',
    // 桃園市
    '桃園區': 'Taoyuan Dist.', '中壢區': 'Zhongli Dist.', '平鎮區': 'Pingzhen Dist.',
    '八德區': 'Bade Dist.', '楊梅區': 'Yangmei Dist.', '蘆竹區': 'Luzhu Dist.',
    '大溪區': 'Daxi Dist.', '龍潭區': 'Longtan Dist.', '龜山區': 'Guishan Dist.',
    '大園區': 'Dayuan Dist.', '觀音區': 'Guanyin Dist.', '新屋區': 'Xinwu Dist.',
    // 台中市
    '北屯區': 'Beitun Dist.', '西屯區': 'Xitun Dist.', '南屯區': 'Nantun Dist.',
    '太平區': 'Taiping Dist.', '大里區': 'Dali Dist.', '霧峰區': 'Wufeng Dist.',
    '烏日區': 'Wuri Dist.', '豐原區': 'Fengyuan Dist.', '后里區': 'Houli Dist.',
    '石岡區': 'Shigang Dist.', '東勢區': 'Dongshi Dist.', '和平區': 'Heping Dist.',
    '新社區': 'Xinshe Dist.', '潭子區': 'Tanzi Dist.', '大雅區': 'Daya Dist.',
    '神岡區': 'Shengang Dist.', '大肚區': 'Dadu Dist.', '沙鹿區': 'Shalu Dist.',
    '龍井區': 'Longjing Dist.', '梧棲區': 'Wuqi Dist.', '清水區': 'Qingshui Dist.',
    '大甲區': 'Dajia Dist.', '外埔區': 'Waipu Dist.',
    // 台南市
    '中西區': 'West Central Dist.', '安平區': 'Anping Dist.', '安南區': 'Annan Dist.',
    '永康區': 'Yongkang Dist.', '歸仁區': 'Guiren Dist.', '新化區': 'Xinhua Dist.',
    '仁德區': 'Rende Dist.', '關廟區': 'Guanmiao Dist.', '麻豆區': 'Madou Dist.',
    '佳里區': 'Jiali Dist.', '新營區': 'Xinying Dist.', '善化區': 'Shanhua Dist.',
    '新市區': 'Xinshi Dist.', '安定區': 'Anding Dist.', '東山區': 'Dongshan Dist.',
    // 高雄市
    '新興區': 'Xinxing Dist.', '前金區': 'Qianjin Dist.', '苓雅區': 'Lingya Dist.',
    '鹽埕區': 'Yancheng Dist.', '鼓山區': 'Gushan Dist.', '旗津區': 'Qijin Dist.',
    '前鎮區': 'Qianzhen Dist.', '三民區': 'Sanmin Dist.', '楠梓區': 'Nanzi Dist.',
    '小港區': 'Xiaogang Dist.', '左營區': 'Zuoying Dist.', '仁武區': 'Renwu Dist.',
    '大社區': 'Dashe Dist.', '岡山區': 'Gangshan Dist.', '鳳山區': 'Fengshan Dist.',
    '大寮區': 'Daliao Dist.', '林園區': 'Linyuan Dist.', '鳥松區': 'Niaosong Dist.',
    '大樹區': 'Dashu Dist.', '旗山區': 'Qishan Dist.', '美濃區': 'Meinong Dist.',
    '橋頭區': 'Qiaotou Dist.',
    // 基隆市
    '七堵區': 'Qidu Dist.', '暖暖區': 'Nuannuan Dist.', '仁愛區': 'Renai Dist.',
    '安樂區': 'Anle Dist.',
    // 新竹市
    '香山區': 'Xiangshan Dist.',
    // 共用方向區（注意：需在縣市辨識後才解析，否則 "東區" 在不同縣市意義不同）
    // 我們在識別到縣市後，再嘗試 "東區/西區/南區/北區/中區"
    // 新竹縣常見
    '竹北市': 'Zhubei City', '竹東鎮': 'Zhudong Township', '新埔鎮': 'Xinpu Township',
    '關西鎮': 'Guanxi Township', '湖口鄉': 'Hukou Township', '新豐鄉': 'Xinfeng Township',
    '芎林鄉': 'Qionglin Township', '橫山鄉': 'Hengshan Township', '北埔鄉': 'Beipu Township',
    '寶山鄉': 'Baoshan Township', '峨眉鄉': 'Emei Township', '尖石鄉': 'Jianshi Township',
    '五峰鄉': 'Wufeng Township',
    // 苗栗縣
    '苗栗市': 'Miaoli City', '頭份市': 'Toufen City', '竹南鎮': 'Zhunan Township',
    '後龍鎮': 'Houlong Township', '通霄鎮': 'Tongxiao Township', '苑裡鎮': 'Yuanli Township',
    '卓蘭鎮': 'Zhuolan Township',
    // 彰化縣
    '彰化市': 'Changhua City', '員林市': 'Yuanlin City', '鹿港鎮': 'Lugang Township',
    '和美鎮': 'Hemei Township', '田中鎮': 'Tianzhong Township', '北斗鎮': 'Beidou Township',
    '溪湖鎮': 'Xihu Township', '二林鎮': 'Erlin Township',
    // 南投縣
    '南投市': 'Nantou City', '草屯鎮': 'Caotun Township', '埔里鎮': 'Puli Township',
    '竹山鎮': 'Zhushan Township', '集集鎮': 'Jiji Township',
    // 雲林縣
    '斗六市': 'Douliu City', '虎尾鎮': 'Huwei Township', '西螺鎮': 'Xiluo Township',
    '北港鎮': 'Beigang Township', '斗南鎮': 'Dounan Township', '土庫鎮': 'Tuku Township',
    // 嘉義縣
    '太保市': 'Taibao City', '朴子市': 'Puzi City', '布袋鎮': 'Budai Township',
    '大林鎮': 'Dalin Township', '民雄鄉': 'Minxiong Township',
    // 屏東縣
    '屏東市': 'Pingtung City', '潮州鎮': 'Chaozhou Township', '東港鎮': 'Donggang Township',
    '恆春鎮': 'Hengchun Township',
    // 宜蘭縣
    '宜蘭市': 'Yilan City', '羅東鎮': 'Luodong Township', '蘇澳鎮': 'Su\'ao Township',
    '頭城鎮': 'Toucheng Township', '礁溪鄉': 'Jiaoxi Township',
    // 花蓮縣
    '花蓮市': 'Hualien City', '鳳林鎮': 'Fenglin Township', '玉里鎮': 'Yuli Township',
    '吉安鄉': "Ji'an Township", '壽豐鄉': 'Shoufeng Township',
    // 台東縣
    '臺東市': 'Taitung City', '台東市': 'Taitung City', '成功鎮': 'Chenggong Township',
    '關山鎮': 'Guanshan Township'
  };

  /* -------- 路名專用字典（不靠拼音猜） -------- */
  const ROAD_NAMES = {
    '中山': 'Zhongshan', '中正': 'Zhongzheng', '中華': 'Zhonghua', '中央': 'Zhongyang',
    '中興': 'Zhongxing', '中和': 'Zhonghe', '中正一': 'Zhongzheng 1st',
    '忠孝': 'Zhongxiao', '仁愛': 'Renai', '信義': 'Xinyi', '和平': 'Heping', '博愛': 'Boai',
    '民族': 'Minzu', '民權': 'Minquan', '民生': 'Minsheng', '民有': 'Minyou', '民治': 'Minzhi',
    '建國': 'Jianguo', '新生': 'Xinsheng', '光復': 'Guangfu', '復興': 'Fuxing',
    '大同': 'Datong', '三民': 'Sanmin', '四維': 'Siwei', '五福': 'Wufu',
    '六合': 'Liuhe', '七賢': 'Qixian', '八德': 'Bade', '九如': 'Jiuru', '十全': 'Shiquan',
    '市府': 'Shifu', '市政': 'Shizheng', '市民': 'Shimin',
    '南京': 'Nanjing', '北平': 'Beiping', '南陽': 'Nanyang', '杭州': 'Hangzhou',
    '重慶': 'Chongqing', '長安': "Chang'an", '青島': 'Qingdao', '寧夏': 'Ningxia',
    '林森': 'Linsen', '羅斯福': 'Roosevelt', '凱達格蘭': 'Ketagalan',
    '士林': 'Shilin', '北投': 'Beitou', '內湖': 'Neihu', '南港': 'Nangang',
    '基隆': 'Keelung', '基河': 'Jihe', '陽明': 'Yangming', '士東': 'Shidong',
    '承德': 'Chengde', '松江': 'Songjiang', '松山': 'Songshan', '敦化': 'Dunhua',
    '富錦': 'Fujin', '富民': 'Fumin', '安和': 'Anhe', '東興': 'Dongxing',
    '基隆一': 'Keelung 1st', '基隆二': 'Keelung 2nd',
    '景福': 'Jingfu', '景興': 'Jingxing', '景文': 'Jingwen', '辛亥': 'Xinhai',
    '羅斯福': 'Roosevelt', '汀州': 'Tingzhou', '水源': 'Shuiyuan',
    '南京東': 'Nanjing E.', '南京西': 'Nanjing W.',
    '台灣': 'Taiwan', '臺灣': 'Taiwan',
    '逢甲': 'Fengjia', '勤美': 'Qinmei', '美村': 'Meicun', '公益': 'Gongyi',
    '文心': 'Wenxin', '台灣大': 'Taiwan University',
    '青年': 'Qingnian', '健康': 'Jiankang', '經國': 'Jingguo', '經武': 'Jingwu',
    '介壽': 'Jieshou', '介壽一': 'Jieshou 1st',
    '河南': 'Henan', '河北': 'Hebei', '甘肅': 'Gansu', '蘭州': 'Lanzhou',
    '寧波': 'Ningbo', '昆明': 'Kunming', '長沙': 'Changsha', '長春': 'Changchun',
    '太原': 'Taiyuan', '武昌': 'Wuchang', '徐州': 'Xuzhou'
  };

  /* -------- 漢語拼音字典（罕用字 fallback） -------- */
  const PINYIN = {
    '一': 'yi','二': 'er','三': 'san','四': 'si','五': 'wu','六': 'liu','七': 'qi','八': 'ba','九': 'jiu','十': 'shi','百': 'bai','千': 'qian',
    '東': 'dong','西': 'xi','南': 'nan','北': 'bei','中': 'zhong','大': 'da','小': 'xiao','上': 'shang','下': 'xia','前': 'qian','後': 'hou','左': 'zuo','右': 'you','內': 'nei','外': 'wai',
    '山': 'shan','水': 'shui','河': 'he','江': 'jiang','海': 'hai','湖': 'hu','溪': 'xi','灣': 'wan','島': 'dao','石': 'shi','土': 'tu','田': 'tian','林': 'lin','森': 'sen','園': 'yuan','坡': 'po',
    '正': 'zheng','華': 'hua','興': 'xing','央': 'yang','和': 'he','安': 'an','平': 'ping','信': 'xin','義': 'yi','仁': 'ren','愛': 'ai','忠': 'zhong','孝': 'xiao','博': 'bo','德': 'de','福': 'fu','壽': 'shou','賢': 'xian',
    '民': 'min','族': 'zu','權': 'quan','生': 'sheng','治': 'zhi','有': 'you','族': 'zu',
    '建': 'jian','國': 'guo','新': 'xin','舊': 'jiu','光': 'guang','復': 'fu','興': 'xing','同': 'tong',
    '三': 'san','四': 'si','維': 'wei','合': 'he','如': 'ru','全': 'quan','文': 'wen','化': 'hua','武': 'wu','學': 'xue','校': 'xiao','院': 'yuan','府': 'fu','政': 'zheng','公': 'gong','市': 'shi',
    '台': 'tai','臺': 'tai','灣': 'wan','北': 'bei','南': 'nan','東': 'dong','西': 'xi','基': 'ji','隆': 'long','宜': 'yi','蘭': 'lan','花': 'hua','蓮': 'lian','彰': 'zhang','雲': 'yun','嘉': 'jia','屏': 'ping',
    '京': 'jing','滬': 'hu','蘇': 'su','杭': 'hang','寧': 'ning','滬': 'hu','瀋': 'shen','陽': 'yang','陰': 'yin','慶': 'qing','重': 'chong','汀': 'ting','州': 'zhou','青': 'qing','島': 'dao','夏': 'xia',
    '甘': 'gan','肅': 'su','晉': 'jin','遼': 'liao','吉': 'ji','黑': 'hei','龍': 'long','蒙': 'meng','貴': 'gui','滇': 'dian','藏': 'zang','疆': 'jiang','桂': 'gui','閩': 'min','贛': 'gan',
    '河': 'he','南': 'nan','北': 'bei','秦': 'qin','楚': 'chu','齊': 'qi','魯': 'lu','吳': 'wu','越': 'yue','燕': 'yan',
    '太': 'tai','原': 'yuan','昆': 'kun','明': 'ming','長': 'chang','春': 'chun','沙': 'sha','武': 'wu','昌': 'chang','徐': 'xu','寧': 'ning','波': 'bo',
    '介': 'jie','經': 'jing','健': 'jian','康': 'kang','青': 'qing','年': 'nian','美': 'mei','逢': 'feng','甲': 'jia','勤': 'qin','文': 'wen','心': 'xin','益': 'yi','村': 'cun',
    '凱': 'kai','達': 'da','格': 'ge','蘭': 'lan','羅': 'luo','斯': 'si','福': 'fu','林': 'lin','森': 'sen',
    '承': 'cheng','松': 'song','江': 'jiang','敦': 'dun','化': 'hua','基': 'ji','陽': 'yang','明': 'ming','士': 'shi','富': 'fu','錦': 'jin','汀': 'ting','水': 'shui','源': 'yuan','辛': 'xin','亥': 'hai','景': 'jing',
    '頂': 'ding','底': 'di','頭': 'tou','尾': 'wei','口': 'kou','門': 'men','關': 'guan','橋': 'qiao','街': 'jie','路': 'lu','巷': 'xiang','弄': 'long','段': 'duan','號': 'hao','樓': 'lou','室': 'shi',
    '里': 'li','鄰': 'lin','村': 'cun','鄉': 'xiang','鎮': 'zhen','區': 'qu','縣': 'xian','市': 'shi',
    '元': 'yuan','元': 'yuan','春': 'chun','秋': 'qiu','日': 'ri','月': 'yue','星': 'xing','天': 'tian','地': 'di','金': 'jin','銀': 'yin','銅': 'tong','鐵': 'tie','玉': 'yu','石': 'shi','寶': 'bao',
    '長': 'chang','短': 'duan','高': 'gao','低': 'di','寬': 'kuan','窄': 'zhai','深': 'shen','淺': 'qian',
    '思': 'si','想': 'xiang','念': 'nian','志': 'zhi','成': 'cheng','功': 'gong','勝': 'sheng','利': 'li','立': 'li','站': 'zhan','行': 'xing','走': 'zou',
    '紅': 'hong','黃': 'huang','綠': 'lu','藍': 'lan','黑': 'hei','白': 'bai','彩': 'cai','色': 'se',
    '雙': 'shuang','單': 'dan','十': 'shi','百': 'bai','千': 'qian','萬': 'wan',
    '春': 'chun','夏': 'xia','秋': 'qiu','冬': 'dong'
  };

  const SECTION_NUM = { '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'十一':11,'十二':12 };
  const ORDINAL = {1:'1st',2:'2nd',3:'3rd',4:'4th',5:'5th',6:'6th',7:'7th',8:'8th',9:'9th',10:'10th',11:'11th',12:'12th'};
  const DIRECTION = { '東': 'E.', '西': 'W.', '南': 'S.', '北': 'N.' };
  const ROAD_TYPE = { '路': 'Rd.', '街': 'St.', '大道': 'Blvd.', '大路': 'Blvd.' };

  /* Sort dict keys by length desc so longest match wins */
  function sortByLen(obj) {
    return Object.keys(obj).sort((a, b) => b.length - a.length).map(k => [k, obj[k]]);
  }
  const CITIES_S = sortByLen(CITIES);
  const DISTRICTS_S = sortByLen(DISTRICTS);
  const ROADS_S = sortByLen(ROAD_NAMES);

  /* Capitalize first letter, lowercase rest */
  function cap(s) { return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s; }

  /* Pinyin a chinese substring char-by-char (capitalized concatenation) */
  function pinyinize(zh) {
    if (!zh) return '';
    // try road name dict first (longest match), then per-char
    for (const [k, v] of ROADS_S) {
      if (zh === k) return v;
    }
    // greedy multi-char road name match within string
    let i = 0, out = '';
    while (i < zh.length) {
      // try 4,3,2 char roadname prefix
      let matched = false;
      for (let len = Math.min(4, zh.length - i); len >= 2; len--) {
        const seg = zh.slice(i, i + len);
        for (const [k, v] of ROADS_S) {
          if (k === seg) { out += (out ? '' : '') + v; i += len; matched = true; break; }
        }
        if (matched) break;
      }
      if (matched) continue;
      // single char pinyin
      const ch = zh[i];
      const py = PINYIN[ch];
      if (py) out += cap(py);
      else out += '[' + ch + ']';
      i++;
    }
    return out;
  }

  /* Normalize input */
  function normalize(raw) {
    let s = String(raw || '').trim();
    s = s.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
    s = s.replace(/[\s,，、]/g, '');
    s = s.replace(/Ｆ|Ｆ/g, 'F');
    return s;
  }

  /* Match longest city/district at start */
  function matchAtStart(s, sortedPairs) {
    for (const [k, v] of sortedPairs) {
      if (s.startsWith(k)) return { key: k, value: v, rest: s.slice(k.length) };
    }
    return null;
  }

  /* MAIN convert */
  function convert(raw) {
    if (!raw || !String(raw).trim()) return { ok: false, error: '請輸入地址' };

    let s = normalize(raw);

    // 1) ZIP
    let zip = '';
    const zipM = s.match(/^(\d{3}(?:-?\d{2,3})?)/);
    if (zipM) { zip = zipM[1]; s = s.slice(zipM[0].length); }

    // 2) City
    const cityHit = matchAtStart(s, CITIES_S);
    if (!cityHit) return { ok: false, error: '無法識別縣市名稱（請以「台北市」「新北市」等開頭）' };
    const cityEn = cityHit.value;
    s = cityHit.rest;

    // 3) District / township
    let distEn = null;
    const distHit = matchAtStart(s, DISTRICTS_S);
    if (distHit) { distEn = distHit.value; s = distHit.rest; }
    else {
      // try 東區 / 西區 / 南區 / 北區 / 中區 etc.
      const m = s.match(/^(東區|西區|南區|北區|中區|中正區|東山區|西港區)/);
      if (m) {
        const dirMap = { '東區': 'East Dist.', '西區': 'West Dist.', '南區': 'South Dist.', '北區': 'North Dist.', '中區': 'Central Dist.' };
        distEn = dirMap[m[1]] || (pinyinize(m[1].slice(0, -1)) + ' Dist.');
        s = s.slice(m[0].length);
      } else {
        // generic 鄉/鎮/區/市 suffix parse
        const g = s.match(/^([\u4e00-\u9fa5]{1,4})(鄉|鎮|區)/);
        if (g) {
          const suffix = { '鄉': 'Township', '鎮': 'Township', '區': 'Dist.' }[g[2]];
          distEn = pinyinize(g[1]) + ' ' + suffix;
          s = s.slice(g[0].length);
        }
      }
    }

    // 4) Skip optional 村/里/鄰
    s = s.replace(/^([\u4e00-\u9fa5]{1,5})(村|里)/, '');
    s = s.replace(/^(\d+)鄰/, '');

    // 5) Street: (name)(數字一/二/...)?(東/西/南/北)?(路|街|大道|大路)
    let streetEn = '';
    const streetM = s.match(/^([\u4e00-\u9fa5]{1,8}?)(十一|十二|一|二|三|四|五|六|七|八|九|十)?(東|西|南|北)?(大道|大路|路|街)/);
    if (streetM) {
      const namePart = streetM[1];
      const numCh = streetM[2] || '';
      const dir = streetM[3] || '';
      const type = streetM[4];
      const ordEn = numCh ? ' ' + ORDINAL[SECTION_NUM[numCh]] : '';
      const dirEn = dir ? DIRECTION[dir] + ' ' : '';
      streetEn = pinyinize(namePart) + ordEn + (ordEn ? ' ' : ' ') + dirEn + ROAD_TYPE[type];
      // Clean any double spaces
      streetEn = streetEn.replace(/\s+/g, ' ').trim();
      s = s.slice(streetM[0].length);
    }

    // 6) Section: 一段..十二段
    let sec = null;
    const secM = s.match(/^(十一|十二|一|二|三|四|五|六|七|八|九|十)段/);
    if (secM) { sec = SECTION_NUM[secM[1]]; s = s.slice(secM[0].length); }

    // 7) Lane / Alley / Number / Floor / Room
    let lane = null, aly = null, no = null, fl = null, rm = null;
    const laneM = s.match(/^(\d+)巷/); if (laneM) { lane = laneM[1]; s = s.slice(laneM[0].length); }
    const alyM = s.match(/^(\d+)弄/); if (alyM) { aly = alyM[1]; s = s.slice(alyM[0].length); }
    const noM = s.match(/^(\d+)(?:[-之](\d+))?號/);
    if (noM) { no = noM[2] ? noM[1] + '-' + noM[2] : noM[1]; s = s.slice(noM[0].length); }
    const flM = s.match(/^(\d+)樓(?:之(\d+))?/);
    if (flM) { fl = flM[2] ? flM[1] + 'F.-' + flM[2] : flM[1] + 'F.'; s = s.slice(flM[0].length); }
    const rmM = s.match(/^(\d+)室/); if (rmM) { rm = 'Rm. ' + rmM[1]; s = s.slice(rmM[0].length); }

    // 8) Remainder (e.g. 大樓名) — just pinyin-ize as building suffix
    let extra = '';
    if (s) extra = pinyinize(s) + ' Bldg.';

    // Compose: smallest first
    const parts = [];
    if (extra) parts.push(extra);
    if (fl) parts.push(fl);
    if (rm) parts.push(rm);
    if (no) parts.push('No. ' + no);
    if (aly) parts.push('Aly. ' + aly);
    if (lane) parts.push('Ln. ' + lane);
    if (sec) parts.push('Sec. ' + sec);
    if (streetEn) parts.push(streetEn);
    if (distEn) parts.push(distEn);
    parts.push(cityEn + (zip ? ' ' + zip : ''));
    parts.push('Taiwan (R.O.C.)');

    const english = parts.join(', ');

    // Warn if [unknown] chars detected
    const unknowns = (english.match(/\[[\u4e00-\u9fa5]\]/g) || []);

    return {
      ok: true,
      english,
      zip: zip || '—',
      cityEn,
      distEn: distEn || '—',
      streetEn: streetEn || '—',
      warning: unknowns.length ? `${unknowns.length} 個字無法自動拼音，已標記 [字]` : null
    };
  }

  /* ---- copy helper (reuse delegated handler in app.js by setting dataset.copy on the button) ---- */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); document.body.removeChild(ta); return true; }
      catch (err) { document.body.removeChild(ta); return false; }
    }
  }

  function init() {
    const root = document.querySelector('[data-tool="address"]');
    if (!root) return;
    const input = root.querySelector('#addr');
    const errEl = root.querySelector('[data-addr-error]');
    const resultEl = document.querySelector('[data-addr-result]');
    const phEl = document.querySelector('[data-addr-placeholder]');
    const valueEl = document.querySelector('[data-addr-value]');
    const metaEl = document.querySelector('[data-addr-meta]');
    const altEl = document.querySelector('[data-addr-alt]');
    const copyBtn = document.querySelector('[data-addr-copy]');

    function render() {
      const v = input.value;
      if (!v || !v.trim()) {
        errEl.classList.remove('is-visible');
        resultEl.style.display = 'none';
        altEl.style.display = 'none';
        phEl.style.display = '';
        return;
      }
      const r = convert(v);
      if (!r.ok) {
        errEl.textContent = r.error;
        errEl.classList.add('is-visible');
        resultEl.style.display = 'none';
        altEl.style.display = 'none';
        phEl.style.display = '';
        return;
      }
      errEl.classList.remove('is-visible');
      valueEl.textContent = r.english;
      metaEl.textContent = r.warning ? '⚠ ' + r.warning : '✓ 已依漢語拼音規範轉換';
      metaEl.style.color = r.warning ? '#B91C1C' : '';
      document.querySelector('[data-addr-zip]').textContent = r.zip;
      document.querySelector('[data-addr-city]').textContent = r.cityEn;
      document.querySelector('[data-addr-dist]').textContent = r.distEn;
      document.querySelector('[data-addr-street]').textContent = r.streetEn;
      resultEl.style.display = '';
      altEl.style.display = '';
      phEl.style.display = 'none';
      copyBtn.dataset.copy = r.english;
    }

    input.addEventListener('input', render);

    root.querySelectorAll('[data-example]').forEach(c => {
      c.addEventListener('click', () => {
        input.value = c.dataset.example;
        render();
        input.focus();
      });
    });

    copyBtn.addEventListener('click', async () => {
      const text = copyBtn.dataset.copy;
      if (!text) return;
      const ok = await copyText(text);
      if (ok) {
        const orig = copyBtn.textContent;
        copyBtn.textContent = '已複製';
        copyBtn.classList.add('is-copied');
        setTimeout(() => { copyBtn.textContent = orig; copyBtn.classList.remove('is-copied'); }, 1400);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  // Expose for debugging
  window.TWAddress = { convert };
})();
