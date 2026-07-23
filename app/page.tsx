"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
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
  Menu,
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
  UserRound,
  Wifi,
  X,
} from "lucide-react";

type Screen =
  | "home"
  | "discovery"
  | "processing-outline"
  | "outline"
  | "chapter"
  | "records"
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
  status?: "recommended" | "completed" | "new" | "moved";
  changeNote?: string;
};

type ChapterItem = {
  id: string;
  order: string;
  title: string;
  period: string;
  summary: string;
  sections: ModuleItem[];
  changeNote?: string;
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

const initialChapters: ChapterItem[] = [
  {
    id: "childhood",
    order: "第一章",
    title: "河流、村庄与童年",
    period: "1956—1970",
    summary: "从出生地、家庭关系和童年记忆，理解她最初成为怎样的人。",
    sections: [
      {
        id: "village-river",
        title: "家门口的那条河",
        meta: "出生与故乡",
        description: "湘潭乡下的村庄、老屋，以及每天去学校的四十分钟。",
        accent: "gold",
      },
      {
        id: "five-children",
        title: "五个孩子的家",
        meta: "家庭与童年",
        description: "做木匠的父亲、在生产队劳动的母亲和一颗糖的记忆。",
        accent: "gray",
      },
    ],
  },
  {
    id: "education",
    order: "第二章",
    title: "读书与人生选择",
    period: "1970—1976",
    summary: "那些帮助她继续读书的人，以及成为教师之前的决定。",
    sections: [
      initialModules[1],
      {
        id: "teacher-zhou",
        title: "周老师替我申请的补助",
        meta: "师范求学",
        description: "一次差点发生的退学，如何改变了后来的人生。",
        accent: "gold",
      },
    ],
  },
  {
    id: "teaching",
    order: "第三章",
    title: "四十年乡村讲台",
    period: "1976—2016",
    summary: "从第一次站上讲台，到真正理解教师这份工作的意义。",
    sections: [
      initialModules[0],
      initialModules[2],
      {
        id: "first-home-visit",
        title: "第一次翻山去家访",
        meta: "初到石桥小学",
        description: "走进学生家里，也第一次看见课堂之外的生活。",
        accent: "gray",
      },
    ],
  },
  {
    id: "family",
    order: "第四章",
    title: "两个人撑起一个家",
    period: "1978—至今",
    summary: "工作、婚姻和养育子女交织在一起的家庭生活。",
    sections: [
      initialModules[3],
      {
        id: "hard-years",
        title: "最紧巴的那些年",
        meta: "家庭生活",
        description: "日子并不宽裕，两个人如何分担工作和家庭。",
        accent: "gray",
      },
    ],
  },
  {
    id: "looking-back",
    order: "第五章",
    title: "离开讲台以后",
    period: "2016—至今",
    summary: "退休、重逢与回望，什么最终留在了她的人生里。",
    sections: [
      initialModules[4],
      {
        id: "words-for-children",
        title: "想留给孩子们的话",
        meta: "人生回望",
        description: "关于选择、遗憾，以及最希望家人记住的事情。",
        accent: "gold",
      },
    ],
  },
];

const updatedChapters: ChapterItem[] = initialChapters.map((chapter) => {
  if (chapter.id === "teaching") {
    return {
      ...chapter,
      changeNote: "本次更新：新增 2 节，完成 1 节",
      sections: [
        {
          ...initialModules[0],
          meta: "已生成文章 · 1976 年",
          description: "《二十岁那年，我第一次站上讲台》",
          status: "completed",
          changeNote: "本次已成文",
        },
        {
          id: "umbrella",
          title: "王校长借给我的那把伞",
          meta: "新线索 · 建议下次采访",
          description: "一把旧雨伞，和一位年轻教师最终留下来的原因。",
          accent: "gold",
          status: "new",
          changeNote: "本次采访新增",
        },
        {
          id: "home-visit",
          title: "第一次翻山去家访",
          meta: "新线索",
          description: "走了三个小时山路，只为了把一个孩子劝回课堂。",
          accent: "gray",
          status: "new",
          changeNote: "由原有线索拆分为独立小节",
        },
        {
          ...initialModules[2],
          status: "moved",
          changeNote: "顺序后移",
        },
      ],
    };
  }
  return chapter;
});

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
  const [screen, setScreen] = useState<Screen>("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isDiscoveryRecording, setIsDiscoveryRecording] = useState(false);
  const [discoverySeconds, setDiscoverySeconds] = useState(0);
  const [selectedModule, setSelectedModule] = useState(initialModules[0]);
  const [selectedChapter, setSelectedChapter] = useState(initialChapters[0]);
  const [chapterParentScreen, setChapterParentScreen] = useState<
    "outline" | "updated"
  >("outline");
  const [articleParentScreen, setArticleParentScreen] = useState<
    "chapter" | "records" | "guide"
  >("chapter");
  const [recordView, setRecordView] = useState<"discovery" | "deep">(
    "discovery",
  );
  const [journeyStage, setJourneyStage] = useState<"discovery" | "deep">(
    "discovery",
  );
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeInterviewQuestion, setActiveInterviewQuestion] = useState(0);
  const [questionStates, setQuestionStates] = useState<
    Array<"pending" | "done" | "skipped">
  >(interviewQuestions.map(() => "pending"));
  const [showOptional, setShowOptional] = useState(false);
  const [factConfirmed, setFactConfirmed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showNewBiography, setShowNewBiography] = useState(false);
  const [biographyName, setBiographyName] = useState("林秀兰");
  const [newBiographyName, setNewBiographyName] = useState("");

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
      const timer = window.setTimeout(() => {
        setJourneyStage("deep");
        setScreen("outline");
      }, 1300);
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
  const answeredCount = answers.filter(Boolean).length;
  const navTitle =
    screen === "home"
      ? "山顶传记"
      : screen === "discovery" || screen === "processing-outline"
      ? "初步了解"
      : screen === "outline" || screen === "updated" || screen === "chapter"
        ? "采访提纲"
        : screen === "records"
          ? "采访记录"
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

  function skipDiscoveryQuestion() {
    if (questionIndex < discoveryQuestions.length - 1) {
      setQuestionIndex((value) => value + 1);
      setDiscoverySeconds(0);
      setIsDiscoveryRecording(false);
      return;
    }
    setScreen("processing-outline");
  }

  function generateOutlineEarly() {
    setIsDiscoveryRecording(false);
    setScreen("processing-outline");
  }

  function openModule(module: ModuleItem) {
    setSelectedModule(module);
    setJourneyStage("deep");
    setScreen("guide");
  }

  function openChapter(chapter: ChapterItem) {
    setSelectedChapter(chapter);
    setChapterParentScreen(screen === "updated" ? "updated" : "outline");
    setJourneyStage("deep");
    setScreen("chapter");
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

  function resetPrototype() {
    setShowMenu(false);
    setScreen("home");
    setQuestionIndex(0);
    setAnswers([]);
    setIsDiscoveryRecording(false);
    setDiscoverySeconds(0);
    setSeconds(0);
    setFactConfirmed(false);
    setJourneyStage("discovery");
  }

  function navigateFromSideMenu(nextScreen: "home" | "outline") {
    setShowSideMenu(false);
    setScreen(nextScreen);
  }

  function openRecords(view: "discovery" | "deep") {
    setRecordView(view);
    setShowSideMenu(false);
    setScreen("records");
  }

  function createBiography() {
    const nextName = newBiographyName.trim();
    if (nextName) setBiographyName(nextName);
    setNewBiographyName("");
    setShowNewBiography(false);
    resetPrototype();
  }

  const leftControl: "menu" | "back" | "close" | "none" =
    screen.startsWith("processing")
      ? "none"
      : screen === "home" ||
          screen === "outline" ||
          screen === "records" ||
          screen === "updated"
        ? "menu"
        : screen === "discovery" || screen === "recording"
          ? "close"
          : "back";

  function handleLeftControl() {
    if (leftControl === "menu") {
      setShowSideMenu(true);
      return;
    }
    if (screen === "discovery") {
      setScreen("home");
      return;
    }
    if (screen === "recording") {
      setScreen("guide");
      return;
    }
    if (screen === "chapter") {
      setScreen(chapterParentScreen);
      return;
    }
    if (screen === "guide") {
      setScreen("chapter");
      return;
    }
    if (screen === "article") {
      setScreen(articleParentScreen);
    }
  }

  const backdropClass =
    screen === "home" ||
    screen === "discovery" ||
    screen === "processing-outline"
      ? "backdrop-archive"
      : screen === "outline" ||
          screen === "updated" ||
          screen === "chapter" ||
          screen === "records"
        ? "backdrop-school"
        : screen === "guide" || screen === "recording"
          ? "backdrop-voice"
          : "backdrop-book";

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
            onClick={handleLeftControl}
            disabled={leftControl === "none"}
            aria-label={
              leftControl === "menu"
                ? "打开功能菜单"
                : leftControl === "close"
                  ? "退出当前任务"
                  : "返回"
            }
            title={
              leftControl === "menu"
                ? "功能菜单"
                : leftControl === "close"
                  ? "退出"
                  : "返回"
            }
          >
            {leftControl === "menu" ? (
              <Menu size={22} />
            ) : leftControl === "close" ? (
              <X size={21} />
            ) : (
              <ArrowLeft size={21} />
            )}
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
                    setJourneyStage("deep");
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

        {showSideMenu && (
          <>
            <button
              type="button"
              className="side-menu-backdrop"
              aria-label="关闭功能菜单"
              onClick={() => setShowSideMenu(false)}
            />
            <aside className="side-menu" aria-label="功能菜单">
              <div className="side-menu-head">
                <div>
                  <span>山顶传记</span>
                  <strong>{biographyName}的人生故事</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSideMenu(false)}
                  aria-label="关闭"
                  title="关闭"
                >
                  <X size={19} />
                </button>
              </div>
              <div className="side-progress-title">
                <span>传记进度</span>
                <small>点击阶段查看相关记录</small>
              </div>
              <nav className="side-progress">
                <button
                  type="button"
                  className={journeyStage === "discovery" ? "current" : "complete"}
                  onClick={() => openRecords("discovery")}
                >
                  <i>1</i>
                  <span>
                    <strong>初步了解</strong>
                    <small>
                      {journeyStage === "deep"
                        ? `${answeredCount} 条历史记录`
                        : `${answeredCount}/8 个问题已回答`}
                    </small>
                  </span>
                  <em>{journeyStage === "discovery" ? "进行中" : "已完成"}</em>
                </button>
                <button
                  type="button"
                  className={journeyStage === "deep" ? "complete" : "upcoming"}
                  onClick={() => navigateFromSideMenu("outline")}
                >
                  <i>2</i>
                  <span>
                    <strong>提纲生成</strong>
                    <small>
                      {journeyStage === "deep"
                        ? "5 章 · 11 个采访小节"
                        : "完成初步了解后自动生成"}
                    </small>
                  </span>
                  <em>{journeyStage === "deep" ? "已生成" : "待开始"}</em>
                </button>
                <button
                  type="button"
                  className={journeyStage === "deep" ? "current" : "upcoming"}
                  onClick={() => openRecords("deep")}
                >
                  <i>3</i>
                  <span>
                    <strong>深度采访</strong>
                    <small>
                      {journeyStage === "deep"
                        ? "选择章节并开始采访"
                        : "提纲生成后开始"}
                    </small>
                  </span>
                  <em>{journeyStage === "deep" ? "进行中" : "待开始"}</em>
                </button>
              </nav>
              <button
                type="button"
                className="new-biography-button"
                onClick={() => {
                  setShowSideMenu(false);
                  setShowNewBiography(true);
                }}
              >
                <UserRound size={18} />
                新建传记
              </button>
            </aside>
          </>
        )}

        {showNewBiography && (
          <div className="dialog-backdrop" role="presentation">
            <div className="new-biography-dialog" role="dialog" aria-modal="true">
              <div className="dialog-head">
                <div>
                  <span className="eyebrow">新建传记</span>
                  <h2>这本传记要写给谁？</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewBiography(false)}
                  aria-label="关闭"
                  title="关闭"
                >
                  <X size={18} />
                </button>
              </div>
              <label>
                被记录人的姓名
                <input
                  value={newBiographyName}
                  onChange={(event) => setNewBiographyName(event.target.value)}
                  placeholder="例如：李建国"
                  autoFocus
                />
              </label>
              <p>创建后会从“初步了解”开始，逐步生成这本传记的采访提纲。</p>
              <div className="dialog-actions">
                <button type="button" onClick={() => setShowNewBiography(false)}>
                  取消
                </button>
                <button
                  type="button"
                  className="dialog-primary"
                  onClick={createBiography}
                  disabled={!newBiographyName.trim()}
                >
                  创建并开始
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`screen-content ${backdropClass}`}>
          {screen === "home" && (
            <HomeScreen
              biographyName={biographyName}
              onStart={() => setScreen("discovery")}
            />
          )}

          {screen === "discovery" && (
            <DiscoveryScreen
              questionIndex={questionIndex}
              answeredCount={answeredCount}
              currentAnswer={currentAnswer}
              isRecording={isDiscoveryRecording}
              seconds={discoverySeconds}
              onToggleRecording={toggleDiscoveryRecording}
              onResetRecording={resetDiscoveryRecording}
              onNext={nextDiscoveryQuestion}
              onSkip={skipDiscoveryQuestion}
              onGenerate={generateOutlineEarly}
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
              chapters={initialChapters}
              version="v1"
              onOpen={openChapter}
              onContinue={() => openChapter(initialChapters[2])}
            />
          )}

          {screen === "chapter" && (
            <ChapterScreen
              chapter={selectedChapter}
              onOpen={openModule}
              onArticle={() => {
                setArticleParentScreen("chapter");
                setScreen("article");
              }}
            />
          )}

          {screen === "records" && (
            <RecordsScreen
              view={recordView}
              answers={answers}
              onChangeView={setRecordView}
              onResume={(index) => {
                setQuestionIndex(index);
                setScreen("discovery");
              }}
              onArticle={() => {
                setArticleParentScreen("records");
                setScreen("article");
              }}
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
              onFinish={() => {
                setArticleParentScreen("guide");
                setScreen("processing-article");
              }}
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
              chapters={updatedChapters}
              onOpen={openChapter}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function HomeScreen({
  biographyName,
  onStart,
}: {
  biographyName: string;
  onStart: () => void;
}) {
  return (
    <div className="screen home-screen">
      <div className="intro-hero">
        <span className="eyebrow">第一步 · 初步了解</span>
        <h1>先认识这段人生，再开始深入采访</h1>
        <p>
          通过几个录音问题，了解重要的人生阶段、人物和故事线索，并生成第一版采访提纲。
        </p>
        <div className="intro-person">
          <img src="/lin-xiulan-teacher.png" alt={`${biographyName}的传记`} />
          <span>
            <small>本次记录对象</small>
            <strong>{biographyName}</strong>
          </span>
        </div>
      </div>

      <div className="intro-explain home-intro-explain">
        <div className="section-label">
          <span>初步了解会怎样进行</span>
          <small>预计 10—15 分钟</small>
        </div>
        <ol>
          <li>
            <span>1</span>
            <p>
              <strong>用录音回答推荐问题</strong>
              <small>本人或协助采访的家人都可以回答。</small>
            </p>
          </li>
          <li>
            <span>2</span>
            <p>
              <strong>不清楚的问题可以跳过</strong>
              <small>不必全部回答，也可以提前生成提纲。</small>
            </p>
          </li>
          <li>
            <span>3</span>
            <p>
              <strong>得到第一版完整采访提纲</strong>
              <small>再按章节选择小节，逐次进行深入采访。</small>
            </p>
          </li>
        </ol>
      </div>

      <button type="button" className="intro-start-button" onClick={onStart}>
        开始初步了解
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

function RecordsScreen({
  view,
  answers,
  onChangeView,
  onResume,
  onArticle,
}: {
  view: "discovery" | "deep";
  answers: string[];
  onChangeView: (view: "discovery" | "deep") => void;
  onResume: (index: number) => void;
  onArticle: () => void;
}) {
  const completedAnswers = discoveryQuestions
    .map((question, index) => ({
      ...question,
      index,
      answer: answers[index],
    }))
    .filter((item) => item.answer);

  return (
    <div className="screen records-screen">
      <div className="records-heading">
        <span className="eyebrow">采访记录</span>
        <h1>每一次谈话都保留在这里</h1>
        <p>可以回听录音、查看文字记录，也可以从未完成的位置继续。</p>
      </div>

      <div className="records-tabs">
        <button
          type="button"
          className={view === "discovery" ? "active" : ""}
          onClick={() => onChangeView("discovery")}
        >
          初步了解
        </button>
        <button
          type="button"
          className={view === "deep" ? "active" : ""}
          onClick={() => onChangeView("deep")}
        >
          深度采访
        </button>
      </div>

      {view === "discovery" && (
        <>
          <div className="records-summary">
            <span>
              <strong>{completedAnswers.length}</strong>
              <small>已回答</small>
            </span>
            <i />
            <span>
              <strong>{8 - completedAnswers.length}</strong>
              <small>待了解</small>
            </span>
            <i />
            <span>
              <strong>约 {completedAnswers.length * 2} 分钟</strong>
              <small>录音总时长</small>
            </span>
          </div>

          {completedAnswers.length > 0 ? (
            <div className="record-list">
              {completedAnswers.map((item) => (
                <button
                  type="button"
                  key={item.question}
                  onClick={() => onResume(item.index)}
                >
                  <span className="record-play">
                    <Play size={15} fill="currentColor" />
                  </span>
                  <span>
                    <strong>{item.question}</strong>
                    <small>录音 01:{18 + item.index * 3} · 已转成文字</small>
                    <p>{item.answer}</p>
                  </span>
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
          ) : (
            <div className="records-empty">
              <span>
                <Mic size={22} />
              </span>
              <strong>还没有初步了解记录</strong>
              <p>开始回答第一个问题后，录音和文字会自动保存在这里。</p>
              <button type="button" onClick={() => onResume(0)}>
                开始第一个问题
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {view === "deep" && (
        <div className="deep-records">
          <div className="records-summary">
            <span>
              <strong>1</strong>
              <small>次采访</small>
            </span>
            <i />
            <span>
              <strong>32 分钟</strong>
              <small>录音时长</small>
            </span>
            <i />
            <span>
              <strong>1</strong>
              <small>篇文章</small>
            </span>
          </div>

          <button type="button" className="deep-record-card" onClick={onArticle}>
            <div className="deep-record-top">
              <span>第三章 · 四十年乡村讲台</span>
              <em>已成文</em>
            </div>
            <h2>第一次走进乡村教室</h2>
            <p>2026 年 7 月 22 日 · 32:18 · 子女协助采访</p>
            <div>
              <span>
                <Play size={15} fill="currentColor" />
                回听录音
              </span>
              <span>
                查看文章
                <ChevronRight size={16} />
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

function DiscoveryScreen({
  questionIndex,
  answeredCount,
  currentAnswer,
  isRecording,
  seconds,
  onToggleRecording,
  onResetRecording,
  onNext,
  onSkip,
  onGenerate,
}: {
  questionIndex: number;
  answeredCount: number;
  currentAnswer?: string;
  isRecording: boolean;
  seconds: number;
  onToggleRecording: () => void;
  onResetRecording: () => void;
  onNext: () => void;
  onSkip: () => void;
  onGenerate: () => void;
}) {
  const question = discoveryQuestions[questionIndex];
  return (
    <div className="screen discovery-screen">
      {questionIndex === 0 && (
        <div className="discovery-intro">
          <div>
            <span className="intro-mark">
              <Mic size={18} />
            </span>
            <span>先简单聊聊这一生</span>
          </div>
          <p>8 个推荐问题都用录音回答，可以跳过；信息足够时可提前生成提纲。</p>
        </div>
      )}

      <div className="discovery-toolbar">
        <div className="progress-label discovery-progress">
          <span>
            问题 {questionIndex + 1} / {discoveryQuestions.length}
          </span>
          <strong>已回答 {answeredCount} 题</strong>
        </div>
        <button type="button" className="skip-bubble" onClick={onSkip}>
          <SkipForward size={15} />
          {questionIndex === discoveryQuestions.length - 1 ? "跳过并生成" : "跳过"}
        </button>
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
        {answeredCount >= 3 && questionIndex < discoveryQuestions.length - 1 && (
          <button
            className="early-generate-button"
            type="button"
            onClick={onGenerate}
          >
            已回答 {answeredCount} 题，直接生成提纲
          </button>
        )}
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
  chapters,
  version,
  onOpen,
  onContinue,
}: {
  chapters: ChapterItem[];
  version: string;
  onOpen: (chapter: ChapterItem) => void;
  onContinue: () => void;
}) {
  const sectionCount = chapters.reduce(
    (total, chapter) => total + chapter.sections.length,
    0,
  );
  return (
    <div className="screen outline-screen">
      <div className="screen-heading compact">
        <span className="eyebrow">完整采访提纲 {version}</span>
        <h1>林秀兰的人生故事</h1>
        <p>一级标题构成整本传记的章节，二级标题是可以逐次完成的采访小节。</p>
      </div>

      <div className="outline-stats">
        <div>
          <strong>{chapters.length}</strong>
          <span>个一级章节</span>
        </div>
        <div>
          <strong>{sectionCount}</strong>
          <span>个二级小节</span>
        </div>
        <div>
          <strong>0</strong>
          <span>篇文章完成</span>
        </div>
      </div>

      <div className="section-label">
        <span>全书结构</span>
        <small>点击一级章节选择采访小节</small>
      </div>

      <div className="chapter-list">
        {chapters.map((chapter) => (
          <button
            type="button"
            className={`chapter-card ${
              chapter.id === "teaching" ? "featured" : ""
            }`}
            onClick={() => onOpen(chapter)}
            key={chapter.id}
          >
            <span className="chapter-order">{chapter.order}</span>
            <span className="chapter-main">
              <span className="chapter-title-line">
                <strong>{chapter.title}</strong>
                <em>{chapter.period}</em>
                {chapter.id === "teaching" && <mark>建议先采访</mark>}
              </span>
              <p>{chapter.summary}</p>
              <span className="chapter-section-preview">
                {chapter.sections.map((section, index) => (
                  <span key={section.id}>
                    <i>{index + 1}</i>
                    {section.title}
                  </span>
                ))}
              </span>
            </span>
            <span className="chapter-enter">
              {chapter.sections.length} 节
              <ChevronRight size={17} />
            </span>
          </button>
        ))}
      </div>

      <div className="sticky-action outline-action">
        <button className="primary-button" type="button" onClick={onContinue}>
          选择章节，开始深度采访
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function ChapterScreen({
  chapter,
  onOpen,
  onArticle,
}: {
  chapter: ChapterItem;
  onOpen: (module: ModuleItem) => void;
  onArticle: () => void;
}) {
  return (
    <div className="screen chapter-screen">
      <div className="chapter-hero">
        <span>{chapter.order}</span>
        <h1>{chapter.title}</h1>
        <p>{chapter.summary}</p>
        <small>{chapter.period}</small>
      </div>

      {chapter.changeNote && (
        <div className="chapter-change-note">
          <Sparkles size={17} />
          {chapter.changeNote}
        </div>
      )}

      <div className="section-label">
        <span>选择本次采访小节</span>
        <small>二级标题 · 不必按顺序</small>
      </div>

      <div className="section-choice-list">
        {chapter.sections.map((section, index) => (
          <button
            type="button"
            className={`section-choice ${section.status ?? ""}`}
            key={section.id}
            onClick={() =>
              section.status === "completed" ? onArticle() : onOpen(section)
            }
          >
            <span className="section-number">
              {section.status === "completed" ? <Check size={16} /> : index + 1}
            </span>
            <span className="section-choice-copy">
              <span>
                <strong>{section.title}</strong>
                {section.status === "recommended" && <em>建议先采访</em>}
                {section.status === "new" && <em className="new">新增</em>}
                {section.status === "completed" && <em className="done">已成文</em>}
                {section.status === "moved" && <em className="moved">顺序调整</em>}
              </span>
              <small>{section.meta}</small>
              <p>{section.description}</p>
              {section.changeNote && (
                <mark>
                  <Sparkles size={13} />
                  {section.changeNote}
                </mark>
              )}
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>

      <div className="chapter-footnote">
        选择小节后，小青会给出这一节的采访问题；实际交流中仍可自由追问或跳过。
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
        <span className="eyebrow">本次采访小节</span>
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
          <img
            src="/lin-xiulan-teacher.png"
            alt="林秀兰老师站在教室里"
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
  chapters,
  onOpen,
}: {
  chapters: ChapterItem[];
  onOpen: (chapter: ChapterItem) => void;
}) {
  return (
    <div className="screen updated-screen">
      <div className="update-summary">
        <div className="update-icon">
          <Sparkles size={23} />
        </div>
        <div>
          <span className="eyebrow">采访提纲已更新为 v2</span>
          <h1>完整提纲已记录本次变化</h1>
          <p>全书仍保留 5 个一级章节；第三章新增 2 个二级小节，完成 1 节，并调整 1 节顺序。</p>
        </div>
      </div>

      <div className="outline-change-legend">
        <span>
          <i className="done" />
          已成文
        </span>
        <span>
          <i className="new" />
          本次新增
        </span>
        <span>
          <i className="moved" />
          顺序调整
        </span>
      </div>

      <div className="section-label">
        <span>更新后的完整提纲</span>
        <small>变化已标注在对应章节与小节</small>
      </div>

      <div className="chapter-list updated-outline-tree">
        {chapters.map((chapter) => (
          <button
            type="button"
            className={`chapter-card ${chapter.changeNote ? "has-change" : ""}`}
            onClick={() => onOpen(chapter)}
            key={chapter.id}
          >
            <span className="chapter-order">{chapter.order}</span>
            <span className="chapter-main">
              <span className="chapter-title-line">
                <strong>{chapter.title}</strong>
                <em>{chapter.period}</em>
              </span>
              {chapter.changeNote && (
                <mark className="chapter-change-label">
                  <Sparkles size={13} />
                  {chapter.changeNote}
                </mark>
              )}
              <span className="updated-section-lines">
                {chapter.sections.map((section, index) => (
                  <span className={section.status ?? ""} key={section.id}>
                    <i>{index + 1}</i>
                    <b>{section.title}</b>
                    {section.status === "completed" && <em>已成文</em>}
                    {section.status === "new" && <em>新增</em>}
                    {section.status === "moved" && <em>后移</em>}
                  </span>
                ))}
              </span>
            </span>
            <span className="chapter-enter">
              查看
              <ChevronRight size={17} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
