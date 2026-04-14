/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ShieldAlert, Zap, Target, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- INITIALIZATION ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- КОНСТАНТЫ НАТАЛЬНОЙ КАРТЫ ---
const NATAL_CHART = {
  Lagna: "Sagittarius (Стрелец), Purva Ashadha",
  Moon: "Gemini (Близнецы), Mrigasira, 7-й дом",
  BirthTithi: "Rikta Tithi (9-й лунный день, Навами)",
  Saturn: "Aries (Овен), 5-й дом (Debilitated/Нича)",
  Sun: "Aries (Овен), 5-й дом (Exalted/Уча)",
  Mercury: "Aries, 5-й дом (Nipuna Yoga)",
  Jupiter: "Libra, 11-й дом",
  YogasCount: 32,
  KeyYogas: ['Anthya Vayasi Dhana', 'Neecha Bhanga Raja Yoga', 'Rogagrastha', 'Pitru Dosha', 'Nipuna', 'Amala', 'Harsha', 'Vesai', 'Anaphaa', 'Kedaara'],
  BirthDate: "1965-04-25"
};

// --- HARDCODED DATA FOR APRIL 2026 ---
const HOLY_EVENTS: Record<string, { title: string; type: string; description: string; practice: string }> = {
  "2026-04-13": {
    title: "Камада Экадаши",
    type: "Экадаши",
    description: "День исполнения заветных желаний и глубокого очищения кармических узлов прошлого.",
    practice: "Рекомендуется пост на зернобобовые. Время для молитвы о роде и совершения бескорыстных поступков."
  },
  "2026-04-15": {
    title: "Будха Прадош Врат",
    type: "Прадош",
    description: "Священный вечер Шивы, направленный на устранение ментальных блоков.",
    practice: "Зажгите лампу с маслом гхи после заката. Чтение мантры 'Ом Намах Шивайя' 108 раз."
  },
  "2026-04-27": {
    title: "Варутини Экадаши",
    type: "Экадаши",
    description: "День, дарующий удачу и уничтожающий грехи прошлого.",
    practice: "Соблюдайте пост, избегайте гнева и лжи. Благоприятно для благотворительности."
  },
  "2026-04-29": {
    title: "Прадош Врат",
    type: "Прадош",
    description: "Вечернее поклонение Шиве для устранения препятствий.",
    practice: "Медитация в сумерках. Подношение воды и цветов Шиве."
  }
};

const HARDCODED_INSIGHTS: Record<string, Record<string, string>> = {
  "2026-04-14": {
    general: `Татьяна, сегодня 14 апреля 2026 года, день Камада Экадаши. Ваше рождение в Рикта Титхи (Навами) требует осознанного управления ментальной энергией. Сейчас Сатурн идет транзитом по вашему 4-му дому (Рыбы), что классифицируется как Ардх-Аштама Шани. Это период глубокой интеллектуальной инвентаризации и укрепления ментального фундамента.

Nipuna Yoga (Буддха-Адитья): Nipuna Yoga (Буддха-Адитья) — это мощное соединение Солнца и Меркурия, которое в вашей натальной карте расположено в 5-м доме, отвечающем за интеллект, творчество и стратегическое мышление. Эта йога наделяет вас способностью к глубокому анализу и умением видеть суть вещей за нагромождением фактов. Сегодня её влияние максимально активизировано, требуя от вас безупречной интеллектуальной дисциплины и четкого структурирования всех информационных потоков. Влияние йоги направлено на усиление вашей способности к долгосрочному планированию и принятию взвешенных решений. Что делать: используйте этот мощный ресурс для разработки детальных стратегий и аудита текущих проектов. Чего не делать: категорически избегайте ментальной суеты, пустых разговоров и хаотичного поглощения информации, так как Сатурн в 4-м доме требует от вас предельной концентрации и порядка в мыслях.

Pitru Dosha: Pitru Dosha в вашем гороскопе — это не просто кармический долг, а глубоко укоренившиеся подсознательные интеллектуальные барьеры, которые могут проявляться как необъяснимая осторожность или страх перед полной реализацией своего потенциала. Эта программа часто связана с натальным Сатурном в 5-м доме, создающим ощущение «внутреннего цензора». Сегодня — идеальное время для осознанного очищения ума от этих старых когнитивных паттернов и родовых сценариев «невидимости». Влияние этой доши сегодня может ощущаться как внутреннее сопротивление новым идеям, которое необходимо преодолеть через логику и осознанность. Что делать: проведите ревизию своих убеждений, выявите те из них, которые больше не служат вашему росту, и замените их на конструктивные установки. Чего не делать: не позволяйте иррациональным сомнениям и страхам прошлого блокировать ваши текущие логические выводы и стратегические шаги.

Kedaara Yoga: Kedaara Yoga — это редкая комбинация, которая дарует вам исключительную ментальную устойчивость и способность сохранять спокойствие даже в самых турбулентных ситуациях. Она обозначает вашу связь с земной энергией через интеллект, превращая ваши знания в надежный фундамент. Сегодня эта йога требует от вас максимального «заземления» через наведение идеального порядка в текущих делах, планах и документах. Её влияние помогает вам структурировать реальность и создавать прочные системы. Что делать: займитесь систематизацией своих задач, финансовых отчетов и рабочих процессов, создавая четкую и понятную структуру. Чего не делать: не начинайте новые масштабные интеллектуальные проекты, пока не доведете до совершенства текущие дела, так как избыток незавершенных задач может ослабить защитную силу этой йоги.

Anthya Vayasi Dhana: Anthya Vayasi Dhana — это йога, обещающая значительное интеллектуальное и материальное процветание во второй половине жизни, основанное на накопленном опыте и глубокой экспертности. Она обозначает, что ваш успех — это результат долгого пути и системного накопления знаний. Текущий транзит Сатурна по 4-му дому требует от вас еще большего укрепления вашей экспертной базы и защиты накопленных ресурсов. Влияние этой йоги сегодня направлено на осознание ценности вашего опыта как главного актива. Что делать: инвестируйте время в повышение квалификации, систематизацию своих уникальных знаний и разработку стратегии сохранения ресурсов. Чего не делать: избегайте любых импульсивных финансовых решений или поспешных шагов в карьере, сейчас время для глубокого анализа, выдержки и стратегического выжидания.

Rogagrastha: Rogagrastha Yoga в вашем контексте указывает на специфическую уязвимость ментального аппарата перед лицом чрезмерных информационных нагрузок. Сатурн в Овне, находясь в аспекте на ваш 5-й дом интеллекта, создает риск «перегорания» предохранителей при попытке объять необъятное. Эта йога обозначает необходимость строгой гигиены ума и соблюдения баланса между аналитикой и отдыхом. Сегодня её влияние может проявиться как умственная усталость или потеря концентрации. Что делать: строго соблюдайте режим интеллектуального труда, делайте регулярные паузы, практикуйте техники расслабления и пейте достаточно чистой воды для поддержания ясности сознания. Чего не делать: категорически запрещено игнорировать сигналы организма об усталости, пытаться работать «на износ» или забивать ум лишней информацией, так как это может привести к длительному снижению продуктивности.`,
    jyotish: `Anthya Vayasi Dhana: Татьяна, это йога реализации через накопленную мудрость и экспертность. Она обозначает, что ваш успех — это результат долгого пути и системного накопления знаний. Текущий транзит Сатурна по 4-му дому требует от вас еще большего укрепления вашей экспертной базы и защиты накопленных ресурсов. Влияние этой йоги сегодня направлено на осознание ценности вашего опыта как главного актива. Сейчас Сатурн в 4-м доме проверяет вашу ментальную устойчивость. Ваш натальный Сатурн в 5-м доме требует от вас системного подхода к интеллекту. Что делать: пропишите интеллектуальную стратегию развития на ближайшие годы и инвестируйте время в повышение своей квалификации. Чего не делать: не тратьте ментальный ресурс на пустые споры и не принимайте импульсивных решений.

Rogagrastha: Эта комбинация указывает на риск когнитивного переутомления и ментального перенапряжения. Сатурн в 4-м доме может создавать ощущение ментальной тяжести при избытке информации, а его аспект на 5-й дом усиливает склонность к интеллектуальному выгоранию. Ваш ум — это инструмент, который требует регулярной настройки, очистки и качественного отдыха. Влияние йоги сегодня требует от вас строгой гигиены ума и соблюдения баланса. Что делать: практикуйте медитацию, тишину или техники глубокого дыхания для разгрузки ума, соблюдайте режим труда. Чего не делать: не перегружайте себя аналитикой в вечернее время и не игнорируйте признаки умственной усталости, так как это сигнал к необходимости немедленной паузы.

Neecha Bhanga Raja Yoga: Neecha Bhanga Raja Yoga — это уникальная комбинация, при которой падение планеты (в вашем случае Сатурна в Овне в 5-м доме) отменяется, превращая изначальную слабость в источник силы. Это йога «триумфа через дисциплину», обозначающая, что ваши самые большие интеллектуальные вызовы станут вашими главными преимуществами. Сегодня она активируется через принятие полной ответственности за свои решения и системный подход к решению сложных задач. Влияние йоги дает вам возможность превратить любые препятствия в ступени для роста. Что делать: беритесь за наиболее сложные аналитические задачи, требующие предельной концентрации и воли. Чего не делать: не допускайте ни тени сомнения в своих способностях и не пасуйте перед трудностями, так как именно в преодолении скрыт ваш ресурс.

Harsha Yoga: Harsha Yoga — это одна из Випарита Раджа Йог, которая дарует вам способность ментально побеждать любые препятствия и выходить победителем из самых сложных ситуаций. Она обозначает вашу внутреннюю неуязвимость и способность сохранять радость и ясность ума вопреки внешним обстоятельствам. Сегодня эта йога активируется через духовную и интеллектуальную дисциплину, создавая мощный защитный кокон вокруг вашего внутреннего мира. Её влияние помогает вам игнорировать внешний шум и концентрироваться на главном. Что делать: проведите время в глубоком сосредоточении, изучайте серьезные философские или профессиональные тексты. Чего не делать: не позволяйте внешним раздражителям или чужому мнению нарушать ваш внутренний покой и сбивать вас с выбранного стратегического курса.`,
    tarot: `Аркан 19 (СОЛНЦЕ) и Pitru Dosha:
• Суть: Pitru Dosha в вашем гороскопе — это глубоко укоренившиеся подсознательные интеллектуальные барьеры и родовые сценарии «невидимости», которые могут проявляться как необъяснимая осторожность. Сегодня энергия Солнца (Аркан 19) позволяет осознанно пересмотреть эти сценарии и выйти из тени старых убеждений.
• Влияние: Энергия Солнца дает ресурс для очищения ума от деструктивных настроек. Психосоматически это может проявляться в напряжении шеи и плеч — местах, где «копится» груз ответственности и страх перед проявленностью.
• Что делать: Сделайте упражнения на расслабление шейно-воротниковой зоны и осознанно разрешите себе мыслить масштабно, выходя за рамки привычных ограничений.
• Чего не делать: Не ограничивайте свой полет мысли из-за страха совершить ошибку и не позволяйте иррациональным сомнениям прошлого блокировать ваши текущие шаги.

Nipuna Yoga и Стратегический план:
• Суть: Nipuna Yoga (Буддха-Адитья) — это ваш интеллект стратега, дарующий остроту ума и способность к глубокому анализу. Сегодня она требует перевода теоретического анализа в плоскость конкретных, выверенных действий.
• Влияние: Транзит Сатурна по 4-му дому требует безупречного порядка в интеллектуальном фундаменте и четкого структурирования планов.
• Что делать: Используйте йогу как инструмент глубокого аудита ваших текущих планов, составьте четкий график работы и отдыха, переводя идеи в конкретные задачи.
• Чего не делать: Не занимайтесь пустым теоретизированием без привязки к реальности и не допускайте хаоса в информационных потоках.

Kedaara Yoga, Anthya Vayasi Dhana и Rogagrastha:
• Суть: Стабильность через концентрацию, реализация через мудрость и риск ментального перегрева при избыточных нагрузках.
• Влияние: Ваша реализация напрямую зависит от ясности и покоя вашего ума. Rogagrastha предупреждает о «утечке» ценной энергии через ментальную суету и информационный шум.
• Что делать: Поймите, что ваш главный актив — это ваш интеллект. Инвестируйте в его чистоту, покой и системное развитие, создавая прочный фундамент через Kedaara Yoga.
• Чего не делать: Не допускайте интеллектуального хаоса, многозадачности и игнорирования сигналов организма о необходимости отдыха.`,
    sankhya: `Число дня (1): «Сегодня миром правит Солнце. Для вашей Лагны Стрельца это мощный импульс для укрепления ментальной воли и проявления лидерских качеств. Число 1 выступает как идеальный антидот для вашего Рикта Титхи (Навами), переводя вас из состояния пассивности в состояние активного Творца своей реальности.

Рикта Титхи и Единица: Ваше рождение в Навами может создавать подсознательное ощущение «пустоты» или нехватки ресурсов. Число 1 сегодня полностью компенсирует этот дефицит, давая энергию для решительного завершения начатых дел и принятия волевых решений. Что делать: примите важное решение, которое долго откладывали, и возьмите на себя роль интеллектуального лидера. Чего не делать: не сомневайтесь в своей экспертности и не позволяйте страху «пустых рук» блокировать вашу инициативу.

Vesai Yoga: Vesai Yoga возникает, когда планета находится во 2-м доме от Солнца, и в вашем контексте это йога интеллектуального и финансового предвидения. Она обозначает способность видеть структуру там, где другие видят хаос, и дает вам мудрый взгляд на материальные стратегии. Сегодня, под влиянием числа дня 1, эта йога активирует ваш аналитический центр, позволяя выявить скрытые возможности для роста через системный аудит активов. Что делать: проведите глубокий анализ своих интеллектуальных и материальных ресурсов, составьте детальный план на основе логики. Чего не делать: категорически избегайте импульсивных решений, продиктованных минутной эмоцией, так как Сатурн требует холодного расчета.

Nipuna Yoga и Число 1: Nipuna Yoga — это соединение Солнца и Меркурия, йога «профессионала», дарующая остроту ума. Сегодня она требует от вас максимальной проявленности вашей экспертности и честности в оценке своих ментальных ресурсов. Влияние йоги направлено на укрепление вашего авторитета через демонстрацию реальных компетенций. Что делать: открыто заявляйте о своих профессиональных навыках и берите на себя ответственность за сложные задачи. Чего не делать: не скрывайте свои таланты из ложной скромности и не допускайте интеллектуального хаоса, так как сегодня это будет работать против вас.`
  }
};

// --- COMPONENTS ---

const Calendar = ({ selectedDate, onDateSelect }: { selectedDate: string, onDateSelect: (date: string) => void }) => {
  const daysInMonth = 30; // April
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/10 p-6 rounded-xl space-y-6">
      <div className="flex justify-between items-center px-2">
        <h4 className="text-[16px] font-serif text-[#D4AF37] uppercase tracking-widest">Апрель 2026</h4>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
          <span key={d} className="text-[10px] text-[#D4AF37]/40 uppercase font-bold">{d}</span>
        ))}
        {days.map(d => {
          const dateStr = `2026-04-${d.toString().padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          const hasEvent = !!HOLY_EVENTS[dateStr];
          
          return (
            <button
              key={d}
              onClick={() => onDateSelect(dateStr)}
              className={`h-10 w-10 flex flex-col items-center justify-center rounded-lg transition-all relative ${
                isSelected ? 'bg-[#D4AF37] text-[#050505]' : 'hover:bg-[#D4AF37]/10 text-[#A0A0A0]'
              }`}
            >
              <span className="text-[14px] font-medium">{d}</span>
              {hasEvent && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 bg-[#D4AF37] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

type TabType = 'ИНСАЙТЫ' | 'ДЖЙОТИШ' | 'ТАРО' | 'САНКХЬЯ' | 'КАЛЕНДАРЬ';

export default function AstrologicalGuide() {
  const [activeTab, setActiveTab] = useState<TabType>('ИНСАЙТЫ');
  const [selectedDate, setSelectedDate] = useState("2026-04-14");
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const getTabKey = (tab: TabType): string => {
    switch (tab) {
      case 'ИНСАЙТЫ': return 'general';
      case 'ДЖЙОТИШ': return 'jyotish';
      case 'ТАРО': return 'tarot';
      case 'САНКХЬЯ': return 'sankhya';
      default: return 'calendar';
    }
  };

  const fetchInsight = async (type: string, prompt: string, date: string) => {
    const cacheKey = `${type}_${date}`;
    if (insights[cacheKey]) return;
    
    // Check hardcoded first
    if (HARDCODED_INSIGHTS[date] && HARDCODED_INSIGHTS[date][type]) {
      setInsights(prev => ({ ...prev, [cacheKey]: HARDCODED_INSIGHTS[date][type] }));
      return;
    }

    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Вы — личный Гуру Татьяны. Тон: Прямой, Стратегический. 
          Натальные данные: Лагна ${NATAL_CHART.Lagna}, Сатурн в Овне (Нича), Титхи рождения ${NATAL_CHART.BirthTithi}.
          Йоги: ${NATAL_CHART.KeyYogas.join(', ')}.
          Требования: Минимум 4 предложения на каждую йогу. Текст 14px-16px. Цвет #A0A0A0.`,
        }
      });
      setInsights(prev => ({ ...prev, [cacheKey]: response.text || "Данные уточняются." }));
    } catch (error) {
      console.error(error);
      setInsights(prev => ({ ...prev, [cacheKey]: "Синхронизация временно недоступна." }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    if (activeTab === 'ИНСАЙТЫ') {
      ['general', 'jyotish', 'tarot', 'sankhya'].forEach(type => {
        fetchInsight(type, `Анализ на ${selectedDate}. Учти 32 йоги и Рикта Титхи.`, selectedDate);
      });
    } else {
      const type = getTabKey(activeTab);
      if (type !== 'calendar') {
        fetchInsight(type, `Анализ на ${selectedDate}. Учти 32 йоги и Рикта Титхи.`, selectedDate);
      }
    }
  }, [activeTab, selectedDate]);

  const tabs: TabType[] = ['ИНСАЙТЫ', 'ДЖЙОТИШ', 'ТАРО', 'САНКХЬЯ', 'КАЛЕНДАРЬ'];

  const isTabLoading = activeTab === 'ИНСАЙТЫ' 
    ? (loading.general || loading.jyotish || loading.tarot || loading.sankhya)
    : loading[getTabKey(activeTab)];

  return (
    <div className="min-h-screen bg-[#050505] text-[#A0A0A0] font-sans font-light pb-[100px]">
      
      {/* HEADER */}
      <header className="pt-12 pb-6 text-center border-b border-[#D4AF37]/10 bg-[#050505]">
        <div className="flex flex-col items-center gap-6">
          <img 
            src="/logo.png" 
            alt="АстроСтратег" 
            className="max-h-32 w-auto"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-[24px] md:text-[32px] font-serif tracking-widest uppercase text-[#D4AF37]">
            АстроСтратег
          </h1>
        </div>
      </header>

      {/* STICKY NAVIGATION */}
      <nav className="sticky top-0 bg-[#050505]/95 backdrop-blur-md border-b border-[#D4AF37]/10 z-50 py-3">
        <div className="max-w-4xl mx-auto flex justify-center gap-4 md:gap-10 overflow-x-auto px-4 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] tracking-[0.2em] uppercase transition-all pb-1 border-b-2 whitespace-nowrap font-bold ${
                activeTab === tab ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-[#D4AF37]/20 hover:text-[#D4AF37]/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full pb-[100px]">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedDate}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {/* DATE DISPLAY */}
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/40 font-bold">Анализ на дату</span>
              <h3 className="text-[20px] font-serif text-[#D4AF37]">{selectedDate}</h3>
            </div>

            {/* CONTENT SECTIONS */}
            {isTabLoading ? (
              <div className="py-20 text-center space-y-4">
                <Loader2 className="mx-auto animate-spin text-[#D4AF37]" size={32} />
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/40 font-bold">Синхронизация...</p>
              </div>
            ) : (
              <div className="space-y-12">
                {activeTab === 'ИНСАЙТЫ' && (
                  <section className="space-y-16">
                    <div className="flex flex-col items-center gap-6 justify-center text-center">
                      <Target className="text-[#D4AF37]/30" size={32} />
                      <h2 className="text-[18px] font-serif text-[#D4AF37] uppercase tracking-widest">Полный стратегический отчет</h2>
                    </div>
                    
                    <div className="space-y-12 divide-y divide-[#D4AF37]/10">
                      <div className="pt-0 space-y-6">
                        <h4 className="text-[14px] uppercase tracking-widest text-[#D4AF37]/60 font-bold">1. Общий вектор</h4>
                        <div className="text-[14px] md:text-[16px] text-[#A0A0A0] leading-relaxed text-justify whitespace-pre-line">
                          {insights[`general_${selectedDate}`]}
                        </div>
                      </div>

                      <div className="pt-12 space-y-6">
                        <h4 className="text-[14px] uppercase tracking-widest text-[#D4AF37]/60 font-bold">2. Джйотиш и Йоги</h4>
                        <div className="text-[14px] md:text-[16px] text-[#A0A0A0] leading-relaxed text-justify whitespace-pre-line">
                          {insights[`jyotish_${selectedDate}`]}
                        </div>
                      </div>

                      <div className="pt-12 space-y-6">
                        <h4 className="text-[14px] uppercase tracking-widest text-[#D4AF37]/60 font-bold">3. Энергия Аркана</h4>
                        <div className="text-[14px] md:text-[16px] text-[#A0A0A0] leading-relaxed text-justify whitespace-pre-line">
                          {insights[`tarot_${selectedDate}`]}
                        </div>
                      </div>

                      <div className="pt-12 space-y-6">
                        <h4 className="text-[14px] uppercase tracking-widest text-[#D4AF37]/60 font-bold">4. Нумерологический резонанс</h4>
                        <div className="text-[14px] md:text-[16px] text-[#A0A0A0] leading-relaxed text-justify whitespace-pre-line">
                          {insights[`sankhya_${selectedDate}`]}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'ДЖЙОТИШ' && (
                  <section className="space-y-8">
                    <div className="flex items-center gap-4 justify-center">
                      <ShieldAlert className="text-[#D4AF37]/30" size={24} />
                      <h2 className="text-[18px] font-serif text-[#D4AF37] uppercase tracking-widest">Анализ Йог</h2>
                    </div>
                    <div className="text-[14px] md:text-[16px] text-[#A0A0A0] leading-relaxed text-justify whitespace-pre-line">
                      {insights[`jyotish_${selectedDate}`]}
                    </div>
                  </section>
                )}

                {activeTab === 'ТАРО' && (
                  <section className="space-y-8 text-center">
                    <div className="flex items-center gap-4 justify-center">
                      <Zap className="text-[#D4AF37]/30" size={24} />
                      <h2 className="text-[18px] font-serif text-[#D4AF37] uppercase tracking-widest">Аркан Дня</h2>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-[24px] font-serif text-[#D4AF37] uppercase tracking-widest">
                        {(() => {
                          const day = parseInt(selectedDate.split('-')[2]);
                          if (day === 14) return 'Солнце (19)';
                          const arcana = day > 22 ? day - 22 : day;
                          return `Аркан ${arcana}`;
                        })()}
                      </h4>
                      <div className="text-[14px] md:text-[16px] text-[#A0A0A0] leading-relaxed text-justify whitespace-pre-line max-w-2xl mx-auto">
                        {insights[`tarot_${selectedDate}`]}
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'САНКХЬЯ' && (
                  <section className="space-y-8 text-center">
                    <div className="text-[80px] font-serif text-[#D4AF37] leading-none opacity-80">
                      {selectedDate === '2026-04-14' ? '1' : selectedDate.split('-')[2].split('').reduce((a, b) => parseInt(a) + parseInt(b), 0).toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0)}
                    </div>
                    <h2 className="text-[14px] uppercase tracking-[0.6em] text-[#D4AF37]/40 font-bold">Число резонанса</h2>
                    <div className="text-[14px] md:text-[16px] text-[#A0A0A0] leading-relaxed text-justify whitespace-pre-line max-w-2xl mx-auto">
                      {insights[`sankhya_${selectedDate}`]}
                    </div>
                  </section>
                )}

                {activeTab === 'КАЛЕНДАРЬ' && (
                  <section className="space-y-12">
                    <div className="space-y-8">
                      <div className="text-center space-y-4">
                        <CalendarIcon className="mx-auto text-[#D4AF37]/30" size={32} />
                        <h2 className="text-[18px] font-serif text-[#D4AF37] uppercase tracking-widest">Выбор даты и события</h2>
                      </div>
                      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    </div>

                    <div className="space-y-6 pt-12 border-t border-[#D4AF37]/10">
                      <h3 className="text-[16px] font-serif text-center text-[#D4AF37] uppercase tracking-widest">Священные дни Апреля</h3>
                      <div className="space-y-6">
                        {Object.entries(HOLY_EVENTS)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([date, event]) => (
                            <div key={date} className="p-6 border border-[#D4AF37]/10 rounded-xl bg-[#0a0a0a] space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[14px] font-serif text-[#D4AF37]">{date}</span>
                                <span className="text-[10px] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full uppercase text-[#D4AF37] font-bold">{event.type}</span>
                              </div>
                              <h4 className="text-[16px] font-serif text-[#D4AF37]">{event.title}</h4>
                              <p className="text-[13px] text-[#A0A0A0] leading-relaxed">{event.description}</p>
                              <p className="text-[12px] text-[#D4AF37]/60 italic">{event.practice}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="py-12 text-center border-t border-[#D4AF37]/10 bg-[#050505]">
        <p className="text-[#D4AF37]/20 text-[10px] tracking-[1em] uppercase font-bold">Vedic Wisdom & Modern Design</p>
      </footer>
    </div>
  );
}
