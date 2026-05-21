import React, { useState } from 'react';

// 游戏剧本状态机定义
const SCENES = {
  // === LEVEL 1 ===
  'scene_1': {
    title: '第一章：圈地运动与流亡',
    ascii: `
  /===============================\\
  |      M A N C H E S T E R      |
  |             1 8 4 8           |
  \\===============================/
         _   _      _   _
        ( )_( )    ( )_( )  <-- 羊吃人
         (o o)      (o o)
        ==\\ /==    ==\\ /==
          " "        " "
    `,
    text: '1848年，英国。由于资本原始积累的“圈地运动”，你祖辈的土地被贵族强占用来养羊。你一无所有，被迫流亡到工业重镇曼彻斯特。马克思曾说：“资本来到世间，从头到脚，每个毛孔都滴着血和肮脏的东西。” 面对生存危机，你决定：',
    options: [
      { text: '沦为自由得一无所有的无产者，进纺织厂出卖劳动力', next: 'scene_2a', hpEffect: -5, conEffect: +5 },
      { text: '拒绝进厂，在街头流浪，靠黑市和乞讨苟活', next: 'scene_2b', hpEffect: -10, conEffect: +10 }
    ]
  },

  // === LEVEL 2 ===
  'scene_2a': {
    title: '第二章：蒸汽与铁的绞肉机',
    ascii: `
      /=====================\\
      |   FACTORY FLOOR     |
      |   [#]   [#]   [#]   |
      |  /||\\ /||\\ /||\\  |
      |  |||||||||||||||||  |
      |  SURPLUS --> VALUE  |
      \\=====================/
    `,
    text: '你进厂了。资本家为了压榨“绝对剩余价值”，疯狂延长工时。飞速旋转的齿轮让你头晕目眩，你感觉自己不是人在支配机器，而是机器在奴役和异化你。这时，工头拿着鞭子走过来，宣布今晚所有人无偿加班4小时！',
    options: [
      { text: '默默忍受，“996是福报”，只要有口饭吃就行', next: 'scene_3a', hpEffect: -25, conEffect: -10 },
      { text: '下班后偷偷联合车间工友，传递《共产党宣言》', next: 'scene_3b', hpEffect: -10, conEffect: +30 }
    ]
  },
  'scene_2b': {
    title: '第二章：资产阶级法权',
    ascii: `
       _______
      /       \\
     |  POLICE |  <-- 国家机器
     |  [###]  |      统治工具
      \\_______/
         |||
         |||
    `,
    text: '你流落街头。但资产阶级政府通过了《惩治流浪汉法案》——不为资本家提供剩余价值就是犯罪！巡警拿着警棍盯上了你，国家机器作为阶级统治的工具露出了爪牙。面对逼近的警棍：',
    options: [
      { text: '放弃尊严投降，被强行押进惩罚性私营工场充当苦力', next: 'scene_3a', hpEffect: -20, conEffect: 0 },
      { text: '拼死反抗，加入城市地下的无政府主义激进秘密暗杀暴动', next: 'scene_3c', hpEffect: -30, conEffect: +15 }
    ]
  },

  // === LEVEL 3 ===
  'scene_3a': {
    title: '第三章：异化的顶点与工伤',
    ascii: `
       /===================\\
       |   !!! CRITICAL !!!|
       |     GEAR CRUSH    |
       |      ⚙️ ⚙️ ⚙️     |
       \\===================/
    `,
    text: '由于连续16小时超负荷异化劳动，你神志恍惚，右臂不幸被卷入轰鸣的齿轮！黑心老板不仅拒绝赔偿，还因你“丧失劳动能力”直接将你开除。此时外面爆发了生产过剩的经济危机，无数失业牛马（产业后备军）正红着眼等工位。你：',
    options: [
      { text: '跪在工厂门口乞求老板施舍，或者去教会领发霉的救济粮', next: 'ending_1', hpEffect: -30, conEffect: -10 },
      { text: '愤怒掀桌！号召工友砸碎这台吃人的机器（卢德运动）！', next: 'ending_2', hpEffect: -20, conEffect: +10 }
    ]
  },
  'scene_3b': {
    title: '第三章：真理的地下火种',
    ascii: `
       /===================\\
       |   THE MANIFESTO   |
       |    ___________    |
       |   / ☭        /    |
       |  /  WORKERS /     |
       | /_UNITE!___/      |
       \\===================/
    `,
    text: '深夜的地下室，油灯如豆。工友们围在一起，当你读出“无产者在这个革命中失去的只是锁链”时，大家眼里燃起了火光。突然哨兵密报：叛徒告密，反动宪兵正全副武装包围工厂车间，罢工箭在弦上！',
    options: [
      { text: '提早发动全面武装罢工，强行占领工厂，组建公社委员会', next: 'ending_3', hpEffect: -40, conEffect: +20 },
      { text: '按兵不动，掩护骨干撤退，转入地下建立政党印刷小报启蒙大众', next: 'ending_4', hpEffect: -5, conEffect: +35 }
    ]
  },
  'scene_3c': {
    title: '第三章：硝烟中的迷茫',
    ascii: `
         ___________
        /           \\
       /   DANGER    \\
      |    [💥] [🔫]  |
       \\_____________/
    `,
    text: '你参与了刺杀黑心工厂主的行动。然而，孤立的恐怖袭击无法动摇整个资本主义生产方式，反而招来了军队的残酷镇压。车间被血洗，你胸口中弹，在枪林弹雨中失血过多，奄奄一息：',
    options: [
      { text: '隐姓埋名逃亡海外，彻底放弃反抗，在异国他乡苟延残喘', next: 'ending_5', hpEffect: -50, conEffect: -10 },
      { text: '在临死前，用最后的力气把武器和血染的传单交给身后的年轻工人', next: 'ending_6', hpEffect: -100, conEffect: +30 }
    ]
  },

  // === 8 ENDINGS ===
  'ending_1': { title: '结局：终极牛马的宿命', isEnding: true, type: 'bad', text: '【资本再生产的耗材】你最终死在了臭气熏天的贫民窟车棚里。由于你的顺从，你体面地完成了资本主义制度下“劳动力商品的再生产”——你死了，但你的后代将继续进厂当牛马，无穷匮也。' },
  'ending_2': { title: '结局：卢德运动的叹息', isEnding: true, type: 'bad', text: '【盲目的砸机器暴动】你们砸碎了齿轮，但很快被全副武装的军警镇压。马克思站在窗前叹息：工人们还很幼稚，他们只看到了机器（生产力）的罪恶，还没有看清机器背后占有它们的资本主义制度（生产关系）。' },
  'ending_3': { title: '结局：巴黎公社的余晖', isEnding: true, type: 'mid', text: '【悲壮的无产阶级史诗】罢工演变成了起义，红旗插上了曼彻斯特市政厅！但由于缺乏成熟政党的集中领导，你们没有没收反动银行，最终被资产阶级残酷反扑血洗。虽然你倒在了血泊中，但你们的尝试为后人留下了永恒的“公社原则”。' },
  'ending_4': { title: '结局：红星照耀未来', isEnding: true, type: 'perfect', text: '' }, // 特效单独渲染
  'ending_5': { title: '结局：流亡者的孤寂', isEnding: true, type: 'bad', text: '【历史唯物主义的旁观者】你隐姓埋名逃到了美洲，彻底沦为资本主义钢铁洪流下的局外人。当你在异乡的黑作坊里听闻欧洲革命爆发的消息时，只能发出无力的叹息。' },
  'ending_6': { title: '结局：传承的火炬', isEnding: true, type: 'mid', text: '【阶级斗争从未熄灭】你合上了双眼。但那个接过你武器的年轻工人，目光比你当年更坚定。历史唯物主义的车轮不会停下，只要剥削还在，压迫还在，反抗的火种就永远在地下代代相传。' }
};

export default function DasKapitalGame() {
  const [currentSceneId, setCurrentSceneId] = useState('scene_1');
  const [hp, setHp] = useState(80);
  const [consciousness, setConsciousness] = useState(20);

  const scene = SCENES[currentSceneId];

  const handleChoice = (option) => {
    // 计算新属性（确保在0-100之间）
    const newHp = Math.max(0, Math.min(100, hp + (option.hpEffect || 0)));
    const newConsciousness = Math.max(0, Math.min(100, consciousness + (option.conEffect || 0)));
    
    setHp(newHp);
    setConsciousness(newConsciousness);

    // 判断特殊死亡
    if (newHp <= 0 && !SCENES[option.next].isEnding) {
      setCurrentSceneId('ending_1'); // 体力耗尽直接变牛马
    } else {
      // 如果去完美结局线，需要判断觉醒度门槛
      if (option.next === 'ending_4' && newConsciousness < 65) {
        setCurrentSceneId('ending_3'); // 觉醒不够，被迫走向不成熟的暴动流血
      } else {
        setCurrentSceneId(option.next);
      }
    }
  };

  const restartGame = () => {
    setCurrentSceneId('scene_1');
    setHp(80);
    setConsciousness(20);
  };

  // === 完美结局巨幅特制组件 ===
  if (scene.isEnding && scene.type === 'perfect') {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-mono">
        <div className="w-full max-w-3xl border-8 border-red-600 bg-zinc-900 p-8 shadow-[0_0_30px_rgba(220,38,38,0.7)] text-center relative overflow-hidden animate-pulse">
          {/* 大字报标题 */}
          <div className="bg-red-600 text-black font-extrabold text-3xl md:text-5xl py-4 my-4 tracking-widest uppercase border-4 border-white shadow-[0_5px_0_rgba(0,0,0,1)]">
            ★ 达成完美结局 ★
          </div>
          <div className="text-red-500 font-black text-2xl md:text-4xl my-6 tracking-wide animate-bounce">
            无 产 阶 级 彻 底 觉 醒 ！
          </div>
          
          <pre className="text-left text-green-400 text-xs md:text-sm bg-black p-4 border-2 border-red-600 inline-block my-4 overflow-x-auto max-w-full">
{`   ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
   ★    ⚙️  THE PROLETARIAT HAS AWAKENED! ⚙️   ★
   ★          ☭  THE RED DAWN 1848  ☭          ★
   ★★★★★★★★★★★★★★★★★★`}
          </pre>

          {/* 核心阐述 */}
          <p className="text-gray-200 text-lg text-left leading-relaxed my-6 border-l-4 border-red-600 pl-4 bg-zinc-800 p-4">
            【红星照耀未来】理论终于转化为改天换地的物质力量！你没有盲目砸机器，也没有进行个人暗杀，而是通过科学理论武装了广大的“牛马打工人”。你们建立了具有铁一般纪律的无产阶级政党。历史唯物主义的车轮滚滚向前，真理落地，你们成功夺取了生产资料，曼彻斯特迎来了觉醒的黎明！
          </p>

          {/* 马克思名言聚光灯 */}
          <div className="border-4 border-dashed border-yellow-500 p-4 my-6 bg-black text-yellow-400 font-bold text-md md:text-xl text-center italic">
            “让统治阶级在共产主义革命面前战栗吧。无产者在这个革命中失去的只是锁链。他们获得的将是整个世界！”
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm">
            <div className="border-2 border-white p-2">最终生命: {hp}%</div>
            <div className="border-2 border-yellow-500 text-yellow-400 p-2 font-bold">最终觉醒: {consciousness}% (破茧成蝶)</div>
          </div>

          <button
            onClick={restartGame}
            className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xl border-4 border-white shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_rgba(255,255,255,1)] transition-all"
          >
            ↺ 带着真理，开启下一次解放！
          </button>
        </div>
      </div>
    );
  }

  // === 常规场景与普通结局渲染 ===
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-black font-mono p-4 flex flex-col items-center justify-center selection:bg-red-600 selection:text-white">
      <div className="w-full max-w-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        
        {/* 顶部标头 */}
        <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-4">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter bg-black text-white px-3 py-1">
            资本论：1848打工人觉醒模拟器
          </h1>
          <span className="text-xs font-bold border-2 border-black px-2 py-0.5 bg-yellow-400">
            Vibe Coding v2.0
          </span>
        </div>

        {/* 状态面板（如果是结局则隐藏进度条） */}
        {!scene.isEnding && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border-2 border-black p-2 bg-[#f4f1ea]">
              <div className="text-xs font-black mb-1 text-red-600">牛马生命值 (Health): {hp}%</div>
              <div className="w-full bg-gray-300 h-4 border border-black overflow-hidden">
                <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${hp}%` }}></div>
              </div>
            </div>
            <div className="border-2 border-black p-2 bg-[#f4f1ea]">
              <div className="text-xs font-black mb-1">阶级觉醒度 (Consciousness): {consciousness}%</div>
              <div className="w-full bg-gray-300 h-4 border border-black overflow-hidden">
                <div className="bg-black h-full transition-all duration-300" style={{ width: `${consciousness}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {/* 核心视觉展示区 (ASCII) */}
        {scene.ascii && (
          <div className="border-4 border-black bg-zinc-900 text-green-400 p-2 mb-4 overflow-x-auto">
            <pre className="text-xs md:text-sm font-mono leading-tight whitespace-pre">
              {scene.ascii}
            </pre>
          </div>
        )}

        {/* 标题 & 剧本文案叙述区 */}
        <div className="border-4 border-black p-4 bg-[#f4f1ea] mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg font-black mb-2 text-red-600 border-b-2 border-black pb-1">
            {scene.title}
          </h2>
          <p className="text-sm md:text-md leading-relaxed font-medium">
            {scene.text}
          </p>
        </div>

        {/* 交互选项或重启按钮 */}
        <div className="flex flex-col gap-3">
          {scene.isEnding ? (
            <button
              onClick={restartGame}
              className="w-full border-4 border-black bg-red-600 text-white p-4 font-black text-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
            >
              ↺ 重新投胎 / 开启下一次反抗
            </button>
          ) : (
            scene.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(option)}
                className="w-full border-4 border-black bg-white hover:bg-black hover:text-white p-3 text-left text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all group flex items-center justify-between"
              >
                <span>{index + 1}. {option.text}</span>
                <span className="text-xs border border-gray-400 px-1 group-hover:border-white opacity-60">SELECT</span>
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
}