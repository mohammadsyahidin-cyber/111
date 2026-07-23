"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BatteryMedium,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  Flag,
  Lightbulb,
  ListChecks,
  Mic,
  MoreHorizontal,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Signal,
  SkipForward,
  Sparkles,
  Square,
  Wifi,
} from "lucide-react";

type Screen =
  | "discovery"
  | "processing-outline"
  | "outline"
  | "guide"
  | "recording"
  | "processing-article"
  | "article"
  | "processing-update"
  | "updated";

type ModuleItem = {
  id: string;
  title: string;
  meta: string;
  description: string;
  accent: "red" | "green" | "gold" | "gray";
  status?: "recommended" | "completed" | "new";
};

const discoveryQuestions = [
  {
    question: "您出生在哪里，小时候主要在哪里长大？",
    hint: "可以从出生年份、家乡和小时候住过的地方说起。",
    transcript:
      "我是 1956 年出生的，老家在湖南湘潭下面的一个村子。小时候一直跟着父母住在乡下，家门口有一条河，去学校要走四十多分钟。",
  },
  {
    question: "小时候家里是什么样的？有哪些人和事印象最深？",
    hint: "可以说说家里有哪些人、父母做什么，以及童年最深的记忆。",
    transcript:
      "家里一共五个孩子，我排老二。父亲做木匠，母亲在生产队干活。小时候最盼着父亲从外面做工回来，他总会给我们带一点糖。",
  },
  {
    question: "您的读书经历是怎样的？有没有印象很深的老师或同学？",
    hint: "不需要按年份讲完整，先说记得最清楚的部分。",
    transcript:
      "我读完初中以后去了县里的师范学校。那时候家里其实供不起，是班主任周老师帮我申请了补助，我才没有退学。",
  },
  {
    question: "您的第一份工作是什么？后来又经历了哪些工作变化？",
    hint: "可以从第一次工作的地点、当时的感受说起。",
    transcript:
      "1976 年师范毕业后，我被分到石桥小学。那是我第一份工作，也是后来做了四十年的工作。第一天站上讲台，我紧张得把准备好的开场白全忘了。",
  },
  {
    question: "您是怎样认识爱人的？成家以后经历过哪些重要变化？",
    hint: "可以先说相识的经过，不需要一次讲完全部家庭经历。",
    transcript:
      "我和老陈是在学校修屋顶的时候认识的。他那时是公社里的维修工。结婚以后日子一直不宽裕，但他很支持我教书。",
  },
  {
    question: "回头看，人生中最重要的转折或最困难的阶段是什么？",
    hint: "可以是一项决定、一次离别，也可以是一段很难熬的日子。",
    transcript:
      "最难的是 1982 年发大水。学校进了水，有几个孩子回不了家，我们几位老师陪着他们在教室里守了一夜。",
  },
  {
    question: "哪些人对您影响最大，最希望写进这本传记？",
    hint: "亲人、老师、同事或学生都可以，也可以说说为什么。",
    transcript:
      "王校长对我影响最大。我刚到学校时总想回县城，是他把自己的雨伞借给我，还带着我挨家挨户去做家访。",
  },
  {
    question: "如果现在先讲一个完整故事，您最想从哪件事开始？",
    hint: "这个回答会帮助小青推荐第一次深入采访的主题。",
    transcript:
      "那就先从第一次走进乡村教室讲起吧。那一天我到现在还记得，窗户破着，孩子们都坐得很直。",
  },
];

const initialModules: ModuleItem[] = [
  {
    id: "first-class",
    title: "第一次走进乡村教室",
    meta: "1976 年 · 20 岁",
    description: "从一个紧张的年轻人，到被孩子们叫作“林老师”。",
    accent: "red",
    status: "recommended",
  },
  {
    id: "become-teacher",
    title: "从学生到林老师",
    meta: "求学与工作选择",
    description: "为什么选择教书，以及师范学校留下的记忆。",
    accent: "green",
  },
  {
    id: "flood-night",
    title: "那场涨水的夜晚",
    meta: "一次难忘的守护",
    description: "大雨、孩子和一夜没有熄灭的教室灯。",
    accent: "gold",
  },
  {
    id: "meet-partner",
    title: "和陈师傅相识",
    meta: "工作与家庭",
    description: "两个人如何相识，又如何一起撑起一个家。",
    accent: "green",
  },
  {
    id: "retirement",
    title: "退休那天，学生回来了",
    meta: "四十年教学生涯",
    description: "讲台之外，那些真正留下来的东西。",
    accent: "gray",
  },
];

const updatedModules: ModuleItem[] = [
  {
    ...initialModules[0],
    meta: "已生成文章 · 8 分钟前",
    description: "《二十岁那年，我第一次站上讲台》",
    status: "completed",
    accent: "green",
  },
  {
    id: "umbrella",
    title: "王校长借给我的那把伞",
    meta: "新发现 · 建议下次采访",
    description: "一把旧雨伞，和一位年轻教师留下来的原因。",
    accent: "red",
    status: "new",
  },
  {
    id: "home-visit",
    title: "第一次翻山去家访",
    meta: "新发现",
    description: "走了三个小时山路，只为了把一个孩子劝回课堂。",
    accent: "gold",
    status: "new",
  },
  ...initialModules.slice(2),
];

const interviewQuestions = [
  "还记得第一次走进那间教室时，看见了什么吗？",
  "当时最紧张的是什么？孩子们有什么反应？",
  "王校长那天对您说了什么？",
  "那一天之后，您什么时候第一次觉得自己真的成了老师？",
];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("discovery");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isDiscoveryRecording, setIsDiscoveryRecording] = useState(false);
  const [discoverySeconds, setDiscoverySeconds] = useState(0);
  const [selectedModule, setSelectedModule] = useState(initialModules[0]);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeInterviewQuestion, setActiveInterviewQuestion] = useState(0);
  const [questionStates, setQuestionStates] = useState<
    Array<"pending" | "done" | "skipped">
  >(interviewQuestions.map(() => "pending"));
  const [showOptional, setShowOptional] = useState(false);
  const [factConfirmed, setFactConfirmed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (screen !== "recording" || isPaused) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [screen, isPaused]);

  useEffect(() => {
    if (screen !== "discovery" || !isDiscoveryRecording) return;
    const timer = window.setInterval(
      () => setDiscoverySeconds((value) => value + 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [screen, isDiscoveryRecording]);

  useEffect(() => {
    if (screen === "processing-outline") {
      const timer = window.setTimeout(() => setScreen("outline"), 1300);
      return () => window.clearTimeout(timer);
    }
    if (screen === "processing-article") {
      const timer = window.setTimeout(() => setScreen("article"), 1700);
      return () => window.clearTimeout(timer);
    }
    if (screen === "processing-update") {
      const timer = window.setTimeout(() => setScreen("updated"), 1400);
      return () => window.clearTimeout(timer);
    }
  }, [screen]);

  const currentAnswer = answers[questionIndex];
  const navTitle =
    screen === "discovery" || screen === "processing-outline"
      ? "初始采访"
      : screen === "outline" || screen === "updated"
        ? "采访提纲"
        : screen === "guide" || screen === "recording"
          ? "故事采访"
          : "故事文章";

  function toggleDiscoveryRecording() {
    if (!isDiscoveryRecording) {
      setDiscoverySeconds(0);
      setIsDiscoveryRecording(true);
      return;
    }
    setIsDiscoveryRecording(false);
    setAnswers((previous) => {
      const next = [...previous];
      next[questionIndex] = discoveryQuestions[questionIndex].transcript;
      return next;
    });
  }

  function resetDiscoveryRecording() {
    setAnswers((previous) => {
      const next = [...previous];
      next[questionIndex] = "";
      return next;
    });
    setDiscoverySeconds(0);
    setIsDiscoveryRecording(false);
  }

  function nextDiscoveryQuestion() {
    if (!currentAnswer) return;
    if (questionIndex < discoveryQuestions.length - 1) {
      setQuestionIndex((value) => value + 1);
      setDiscoverySeconds(0);
      setIsDiscoveryRecording(false);
      return;
    }
    setScreen("processing-outline");
  }

  function previousDiscoveryQuestion() {
    if (questionIndex > 0) {
      setQuestionIndex((value) => value - 1);
      setDiscoverySeconds(0);
      setIsDiscoveryRecording(false);
    }
  }

  function openModule(module: ModuleItem) {
    setSelectedModule(module);
    setScreen("guide");
  }

  function startRecording() {
    setSeconds(0);
    setIsPaused(false);
    setActiveInterviewQuestion(0);
    setQuestionStates(interviewQuestions.map(() => "pending"));
    setScreen("recording");
  }

  function advanceQuestion(nextState: "done" | "skipped") {
    setQuestionStates((previous) =>
      previous.map((status, index) =>
        index === activeInterviewQuestion ? nextState : status,
      ),
    );
    if (activeInterviewQuestion < interviewQuestions.length - 1) {
      setActiveInterviewQuestion((value) => value + 1);
    }
  }

  function goBack() {
    if (screen === "discovery") {
      previousDiscoveryQuestion();
      return;
    }
    if (screen === "outline") {
      setScreen("discovery");
      setQuestionIndex(discoveryQuestions.length - 1);
      return;
    }
    if (screen === "guide") {
      setScreen("outline");
      return;
    }
    if (screen === "recording") {
      setScreen("guide");
      return;
    }
    if (screen === "article") {
      setScreen("guide");
      return;
    }
    if (screen === "updated") {
      setScreen("article");
    }
  }

  function resetPrototype() {
    setShowMenu(false);
    setScreen("discovery");
    setQuestionIndex(0);
    setAnswers([]);
    setIsDiscoveryRecording(false);
    setDiscoverySeconds(0);
    setSeconds(0);
    setFactConfirmed(false);
  }

  const canGoBack =
    !screen.startsWith("processing") &&
    !(screen === "discovery" && questionIndex === 0);

  return (
    <main className="prototype-stage">
      <section className="device-shell" aria-label="山顶传记交互原型">
        <div className="status-bar">
          <span>9:41</span>
          <div>
            <Signal size={15} />
            <Wifi size={15} />
            <BatteryMedium size={18} />
          </div>
        </div>

        <header className="app-header">
          <button
            className="icon-button"
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            aria-label="返回"
            title="返回"
          >
            <ArrowLeft size={21} />
          </button>
          <div className="app-title">{navTitle}</div>
          <div className="menu-wrap">
            <div className="mini-program-capsule">
              <button
                type="button"
                onClick={() => setShowMenu((value) => !value)}
                aria-label="更多操作"
                title="更多操作"
              >
                <MoreHorizontal size={20} />
              </button>
              <i />
              <button type="button" aria-label="关闭小程序" title="关闭小程序">
                <Circle size={17} fill="currentColor" />
              </button>
            </div>
            {showMenu && (
              <div className="prototype-menu">
                <button type="button" onClick={resetPrototype}>
                  <RotateCcw size={16} />
                  重新体验
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setScreen("updated");
                  }}
                >
                  <Flag size={16} />
                  查看最终状态
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="screen-content">
          {screen === "discovery" && (
            <DiscoveryScreen
              questionIndex={questionIndex}
              currentAnswer={currentAnswer}
              isRecording={isDiscoveryRecording}
              seconds={discoverySeconds}
              onToggleRecording={toggleDiscoveryRecording}
              onResetRecording={resetDiscoveryRecording}
              onNext={nextDiscoveryQuestion}
            />
          )}

          {screen === "processing-outline" && (
            <ProcessingScreen
              icon={<ListChecks size={26} />}
              title="正在整理首版提纲"
              copy="小青正在从刚才的回答里提取人生阶段、重要人物和故事线索。"
            />
          )}

          {screen === "outline" && (
            <OutlineScreen
              modules={initialModules}
              version="v1"
              completed={0}
              onOpen={openModule}
            />
          )}

          {screen === "guide" && (
            <GuideScreen
              module={selectedModule}
              showOptional={showOptional}
              onToggleOptional={() => setShowOptional((value) => !value)}
              onStart={startRecording}
            />
          )}

          {screen === "recording" && (
            <RecordingScreen
              seconds={seconds}
              isPaused={isPaused}
              activeQuestion={activeInterviewQuestion}
              questionStates={questionStates}
              onTogglePause={() => setIsPaused((value) => !value)}
              onAdvance={advanceQuestion}
              onFinish={() => setScreen("processing-article")}
            />
          )}

          {screen === "processing-article" && (
            <ProcessingScreen
              icon={<Sparkles size={26} />}
              title="小青正在整理这段回忆"
              copy="正在区分讲述人与提问者，梳理时间、人物和情绪细节。"
            />
          )}

          {screen === "article" && (
            <ArticleScreen
              factConfirmed={factConfirmed}
              onConfirmFact={() => setFactConfirmed(true)}
              onUpdate={() => setScreen("processing-update")}
            />
          )}

          {screen === "processing-update" && (
            <ProcessingScreen
              icon={<ListChecks size={26} />}
              title="正在更新采访提纲"
              copy="小青发现了两条新故事，并重新安排了下一次采访重点。"
            />
          )}

          {screen === "updated" && (
            <UpdatedOutlineScreen
              modules={updatedModules}
              onOpen={(module) => {
                setSelectedModule(module);
                setScreen("guide");
              }}
              onArticle={() => setScreen("article")}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function DiscoveryScreen({
  questionIndex,
  currentAnswer,
  isRecording,
  seconds,
  onToggleRecording,
  onResetRecording,
  onNext,
}: {
  questionIndex: number;
  currentAnswer?: string;
  isRecording: boolean;
  seconds: number;
  onToggleRecording: () => void;
  onResetRecording: () => void;
  onNext: () => void;
}) {
  const question = discoveryQuestions[questionIndex];
  return (
    <div className="screen discovery-screen">
      {questionIndex === 0 && (
        <div className="discovery-intro">
          <div>
            <Image src="/shanding-logo.png" alt="" width={34} height={34} />
            <span>先简单聊聊这一生</span>
          </div>
          <p>共 8 个固定问题，全部通过录音回答，预计 15—20 分钟。</p>
        </div>
      )}

      <div className="progress-label discovery-progress">
        <span>
          问题 {questionIndex + 1} / {discoveryQuestions.length}
        </span>
        <strong>约剩 {Math.max(2, 16 - questionIndex * 2)} 分钟</strong>
      </div>
      <div className="progress-track">
        <span
          style={{
            width: `${((questionIndex + 1) / discoveryQuestions.length) * 100}%`,
          }}
        />
      </div>

      <div className="screen-heading">
        <h1>{question.question}</h1>
        <p>{question.hint}</p>
      </div>

      {!currentAnswer && (
        <div className={`discovery-recorder ${isRecording ? "is-recording" : ""}`}>
          <div className="discovery-wave">
            {Array.from({ length: 23 }, (_, index) => (
              <i
                key={index}
                style={{
                  height: isRecording
                    ? `${12 + ((index * 13) % 33)}px`
                    : `${6 + ((index * 7) % 8)}px`,
                  animationDelay: `${(index % 6) * 90}ms`,
                }}
              />
            ))}
          </div>
          <div className="discovery-time">
            {isRecording ? formatTime(seconds) : "准备好后开始回答"}
          </div>
          <button
            type="button"
            className={`discovery-mic ${isRecording ? "stop" : ""}`}
            onClick={onToggleRecording}
            aria-label={isRecording ? "结束回答" : "开始录音回答"}
          >
            {isRecording ? (
              <Square size={21} fill="currentColor" />
            ) : (
              <Mic size={24} />
            )}
          </button>
          <strong>{isRecording ? "点击结束回答" : "点击开始录音回答"}</strong>
          <small>请让回答者靠近手机，正常说话即可</small>
        </div>
      )}

      {currentAnswer && (
        <div className="discovery-transcript">
          <div className="transcript-head">
            <span>
              <CheckCircle2 size={17} />
              已完成录音
            </span>
            <small>{formatTime(Math.max(seconds, 18))}</small>
          </div>
          <p>{currentAnswer}</p>
          <button type="button" onClick={onResetRecording}>
            <RefreshCw size={15} />
            重新录制
          </button>
        </div>
      )}

      <div className="sticky-action">
        <button
          className="primary-button"
          type="button"
          onClick={onNext}
          disabled={!currentAnswer}
        >
          {questionIndex === discoveryQuestions.length - 1
            ? "生成初始提纲"
            : "确认并进入下一题"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function ProcessingScreen({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="screen processing-screen">
      <div className="processing-mark">
        <span>{icon}</span>
        <i />
        <i />
        <i />
      </div>
      <h1>{title}</h1>
      <p>{copy}</p>
      <div className="processing-lines">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function OutlineScreen({
  modules,
  version,
  completed,
  onOpen,
}: {
  modules: ModuleItem[];
  version: string;
  completed: number;
  onOpen: (module: ModuleItem) => void;
}) {
  return (
    <div className="screen outline-screen">
      <div className="screen-heading compact">
        <span className="eyebrow">采访提纲 {version}</span>
        <h1>先从一个具体故事开始</h1>
        <p>这份提纲来自刚才的回答。每次采访后，它都会继续补充和调整。</p>
      </div>

      <div className="outline-stats">
        <div>
          <strong>{modules.length}</strong>
          <span>个故事方向</span>
        </div>
        <div>
          <strong>{completed}</strong>
          <span>篇文章完成</span>
        </div>
        <div>
          <strong>约 30 分钟</strong>
          <span>本次建议</span>
        </div>
      </div>

      <div className="section-label">
        <span>优先采访</span>
        <small>不需要按顺序完成</small>
      </div>

      <div className="module-list">
        {modules.map((module, index) => (
          <button
            type="button"
            className="module-row"
            onClick={() => onOpen(module)}
            key={module.id}
          >
            <span className={`module-index ${module.accent}`}>
              {module.status === "completed" ? <Check size={17} /> : index + 1}
            </span>
            <span className="module-copy">
              <span className="module-title-line">
                <strong>{module.title}</strong>
                {module.status === "recommended" && <em>推荐</em>}
                {module.status === "new" && <em className="new">新发现</em>}
                {module.status === "completed" && <em className="done">已完成</em>}
              </span>
              <small>{module.meta}</small>
              <p>{module.description}</p>
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>

      <div className="sticky-action outline-action">
        <button
          className="primary-button"
          type="button"
          onClick={() => onOpen(modules[0])}
        >
          从推荐故事开始
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function GuideScreen({
  module,
  showOptional,
  onToggleOptional,
  onStart,
}: {
  module: ModuleItem;
  showOptional: boolean;
  onToggleOptional: () => void;
  onStart: () => void;
}) {
  return (
    <div className="screen guide-screen">
      <div className="topic-band">
        <span className="eyebrow">本次采访</span>
        <h1>{module.title}</h1>
        <div className="topic-meta">
          <span>
            <Clock3 size={15} /> 预计 20—30 分钟
          </span>
          <span>
            <Mic size={15} /> 4 个核心问题
          </span>
        </div>
      </div>

      <div className="interview-tip">
        <Lightbulb size={19} />
        <p>
          不必按顺序问完。妈妈讲到有意思的地方，可以顺着继续聊；不合适的问题直接跳过。
        </p>
      </div>

      <div className="question-section">
        <div className="section-label">
          <span>核心问题</span>
          <small>支撑一篇完整故事</small>
        </div>
        <ol className="question-preview-list">
          {interviewQuestions.map((question, index) => (
            <li key={question}>
              <span>{index + 1}</span>
              <p>{question}</p>
            </li>
          ))}
        </ol>
      </div>

      <button
        type="button"
        className="optional-toggle"
        onClick={onToggleOptional}
        aria-expanded={showOptional}
      >
        <span>
          <Sparkles size={17} />
          可以顺着问
        </span>
        <ChevronDown
          size={18}
          className={showOptional ? "chevron-open" : ""}
        />
      </button>

      {showOptional && (
        <div className="optional-questions">
          <p>那间教室是什么样子的？</p>
          <p>第一堂课结束后，您做的第一件事是什么？</p>
          <p>如果回到那一天，您最想对当时的自己说什么？</p>
        </div>
      )}

      <div className="sticky-action">
        <button className="primary-button record-button" type="button" onClick={onStart}>
          <Mic size={19} />
          开始采访并录音
        </button>
      </div>
    </div>
  );
}

function RecordingScreen({
  seconds,
  isPaused,
  activeQuestion,
  questionStates,
  onTogglePause,
  onAdvance,
  onFinish,
}: {
  seconds: number;
  isPaused: boolean;
  activeQuestion: number;
  questionStates: Array<"pending" | "done" | "skipped">;
  onTogglePause: () => void;
  onAdvance: (state: "done" | "skipped") => void;
  onFinish: () => void;
}) {
  return (
    <div className="screen recording-screen">
      <div className="recording-status">
        <span className={isPaused ? "paused-dot" : "live-dot"} />
        {isPaused ? "录音已暂停" : "正在录音"}
      </div>
      <div className="timer">{formatTime(seconds)}</div>
      <div className={`waveform ${isPaused ? "paused" : ""}`}>
        {Array.from({ length: 33 }, (_, index) => (
          <i
            key={index}
            style={{
              height: `${12 + ((index * 17) % 35)}px`,
              animationDelay: `${(index % 7) * 80}ms`,
            }}
          />
        ))}
      </div>

      <div className="current-question">
        <div className="question-position">
          <span>
            问题 {activeQuestion + 1}/{interviewQuestions.length}
          </span>
          <small>提纲只是提醒，可以自由发挥</small>
        </div>
        <h1>{interviewQuestions[activeQuestion]}</h1>
        <div className="question-actions">
          <button type="button" onClick={() => onAdvance("skipped")}>
            <SkipForward size={17} />
            跳过
          </button>
          <button
            type="button"
            className="question-done"
            onClick={() => onAdvance("done")}
          >
            <Check size={17} />
            已经聊到
          </button>
        </div>
      </div>

      <div className="mini-question-list">
        {interviewQuestions.map((question, index) => (
          <button
            type="button"
            key={question}
            className={index === activeQuestion ? "active" : ""}
          >
            {questionStates[index] === "done" ? (
              <CheckCircle2 size={16} />
            ) : questionStates[index] === "skipped" ? (
              <SkipForward size={16} />
            ) : (
              <span>{index + 1}</span>
            )}
            <p>{question}</p>
          </button>
        ))}
      </div>

      <div className="recording-controls">
        <button
          type="button"
          className="round-control"
          onClick={onTogglePause}
          aria-label={isPaused ? "继续录音" : "暂停录音"}
          title={isPaused ? "继续录音" : "暂停录音"}
        >
          {isPaused ? <Play size={22} /> : <Pause size={22} />}
        </button>
        <button type="button" className="finish-recording" onClick={onFinish}>
          <Square size={18} fill="currentColor" />
          结束采访
        </button>
      </div>
    </div>
  );
}

function ArticleScreen({
  factConfirmed,
  onConfirmFact,
  onUpdate,
}: {
  factConfirmed: boolean;
  onConfirmFact: () => void;
  onUpdate: () => void;
}) {
  return (
    <div className="screen article-screen">
      <div className="article-complete">
        <CheckCircle2 size={19} />
        已根据这次采访生成文章
      </div>

      <article>
        <div className="article-cover">
          <Image
            src="/lin-xiulan-teacher.png"
            alt="林秀兰老师站在教室里"
            fill
            sizes="(max-width: 820px) 100vw, 430px"
          />
          <span>人物图片 · 原型示例</span>
        </div>
        <div className="article-body">
          <span className="eyebrow">第一篇故事</span>
          <h1>二十岁那年，我第一次站上讲台</h1>
          <div className="article-meta">
            <span>林秀兰 口述</span>
            <i />
            <span>约 1,260 字</span>
          </div>
          <p>
            1976
            年秋天，我提着一只旧藤箱，第一次走进石桥小学。教室比我想象中还要小，窗纸破了两块，二十几个孩子齐刷刷地看着我。那一刻，我连事先准备好的第一句话都忘了。
          </p>
          <blockquote>
            “王校长把一把旧雨伞递给我，说，山里的雨说来就来，老师不能让孩子等。”
          </blockquote>
          <p>
            第一堂课讲的是一篇短短的课文。下课铃响以后，没有一个孩子起身。我以为自己讲错了，后来才知道，他们只是从没见过这么年轻的老师。一个扎羊角辫的小姑娘跑过来，小声喊了第一句“林老师”。
          </p>
          <p>
            那天回宿舍的路上下起大雨。我撑着王校长借我的伞，鞋上全是泥，心里却第一次觉得，也许我真的可以留在这里。
          </p>
        </div>
      </article>

      <div className={`fact-check ${factConfirmed ? "confirmed" : ""}`}>
        <div>
          <Flag size={18} />
          <span>
            <strong>{factConfirmed ? "信息已确认" : "有 1 处需要确认"}</strong>
            <small>
              {factConfirmed ? "已记录为 1976 年秋天" : "第一次任教是在 1976 年秋天吗？"}
            </small>
          </span>
        </div>
        {!factConfirmed && (
          <button type="button" onClick={onConfirmFact}>
            确认
          </button>
        )}
      </div>

      <div className="sticky-action article-action">
        <button className="primary-button" type="button" onClick={onUpdate}>
          保存文章并更新提纲
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function UpdatedOutlineScreen({
  modules,
  onOpen,
  onArticle,
}: {
  modules: ModuleItem[];
  onOpen: (module: ModuleItem) => void;
  onArticle: () => void;
}) {
  return (
    <div className="screen updated-screen">
      <div className="update-summary">
        <div className="update-icon">
          <Sparkles size={23} />
        </div>
        <div>
          <span className="eyebrow">采访提纲已更新为 v2</span>
          <h1>这次谈话带来了两个新故事</h1>
          <p>已完成 1 个模块，新增 2 条线索，并调整了下一次采访重点。</p>
        </div>
      </div>

      <div className="change-strip">
        <span>
          <Check size={15} /> 1 篇文章
        </span>
        <span>
          <Sparkles size={15} /> 2 个新故事
        </span>
        <span>
          <ListChecks size={15} /> 6 个待采访
        </span>
      </div>

      <div className="section-label">
        <span>更新后的采访提纲</span>
        <small>已按建议顺序排列</small>
      </div>

      <div className="module-list updated-list">
        {modules.map((module, index) => (
          <button
            type="button"
            className="module-row"
            onClick={() =>
              module.status === "completed" ? onArticle() : onOpen(module)
            }
            key={`${module.id}-${index}`}
          >
            <span className={`module-index ${module.accent}`}>
              {module.status === "completed" ? <Check size={17} /> : index + 1}
            </span>
            <span className="module-copy">
              <span className="module-title-line">
                <strong>{module.title}</strong>
                {module.status === "new" && <em className="new">新发现</em>}
                {module.status === "completed" && <em className="done">已完成</em>}
              </span>
              <small>{module.meta}</small>
              <p>{module.description}</p>
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>

      <div className="sticky-action">
        <button
          className="primary-button"
          type="button"
          onClick={() => onOpen(modules[1])}
        >
          继续下一个故事
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
