"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BatteryMedium,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  ChevronRight,
  Circle,
  Clock3,
  Flag,
  ListChecks,
  Menu,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Signal,
  SkipForward,
  Square,
  UserRound,
  Wifi,
} from "lucide-react";

type Screen =
  | "create-intro"
  | "create"
  | "home"
  | "discovery"
  | "processing-outline"
  | "outline"
  | "chapter"
  | "records"
  | "conversation"
  | "articles"
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
    hint: "这个回答会帮助生成更贴近您的完整采访提纲。",
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
          meta: "新线索 · 本次采访新增",
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
  const [screen, setScreen] = useState<Screen>("create-intro");
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
    "chapter" | "articles" | "guide"
  >("chapter");
  const [discoveryParentScreen, setDiscoveryParentScreen] = useState<
    "home" | "records"
  >("home");
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
  const [factConfirmed, setFactConfirmed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showBiographySwitcher, setShowBiographySwitcher] = useState(false);
  const [biographyName, setBiographyName] = useState("");
  const [biographyProfile, setBiographyProfile] = useState({
    relation: "",
    birthYear: "",
    hometown: "",
  });
  const [newBiographyName, setNewBiographyName] = useState("");
  const [newBiographyRelation, setNewBiographyRelation] = useState("母亲");
  const [newBiographyBirthYear, setNewBiographyBirthYear] = useState("");
  const [newBiographyHometown, setNewBiographyHometown] = useState("");
  const [outlineChapterChoice, setOutlineChapterChoice] =
    useState<ChapterItem | null>(null);

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
        setOutlineChapterChoice(null);
        setScreen("outline");
      }, 1300);
      return () => window.clearTimeout(timer);
    }
    if (screen === "processing-article") {
      const timer = window.setTimeout(() => setScreen("article"), 1700);
      return () => window.clearTimeout(timer);
    }
    if (screen === "processing-update") {
      const timer = window.setTimeout(() => {
        setOutlineChapterChoice(null);
        setScreen("updated");
      }, 1400);
      return () => window.clearTimeout(timer);
    }
  }, [screen]);

  const currentAnswer = answers[questionIndex];
  const answeredCount = answers.filter(Boolean).length;
  const navTitle =
    screen === "create-intro" || screen === "create"
      ? "山顶传记"
      : screen === "home"
      ? "山顶传记"
      : screen === "discovery" || screen === "processing-outline"
      ? "初步了解"
      : screen === "outline" || screen === "updated" || screen === "chapter"
        ? "采访提纲"
        : screen === "records" || screen === "conversation"
          ? "采访记录"
          : screen === "articles"
            ? "传记文章"
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
    setOutlineChapterChoice(null);
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
    if (!nextName) return;
    setBiographyName(nextName);
    setBiographyProfile({
      relation: newBiographyRelation,
      birthYear: newBiographyBirthYear.trim(),
      hometown: newBiographyHometown.trim(),
    });
    setNewBiographyName("");
    setNewBiographyRelation("母亲");
    setNewBiographyBirthYear("");
    setNewBiographyHometown("");
    resetPrototype();
    setScreen("home");
  }

  function prepareNewBiography() {
    setShowSideMenu(false);
    setNewBiographyName("");
    setNewBiographyRelation("母亲");
    setNewBiographyBirthYear("");
    setNewBiographyHometown("");
    setScreen("create-intro");
  }

  function openBiographySwitcher() {
    setShowSideMenu(false);
    setShowBiographySwitcher(true);
  }

  function switchBiography(name: string) {
    setBiographyName(name);
    setBiographyProfile(
      name === "林秀兰"
        ? {
            relation: "母亲",
            birthYear: "1956",
            hometown: "湖南湘潭",
          }
        : biographyProfile,
    );
    setShowBiographySwitcher(false);
    resetPrototype();
  }

  const leftControl: "none" | "menu" | "back" =
    screen === "create-intro"
      ? "none"
      : screen === "home" ||
    screen === "outline" ||
    screen === "records" ||
    screen === "articles" ||
    screen === "updated"
      ? "menu"
      : "back";

  function handleLeftControl() {
    if (leftControl === "none") return;
    if (leftControl === "menu") {
      setShowSideMenu(true);
      return;
    }
    if (screen === "create") {
      setScreen("create-intro");
      return;
    }
    if (screen === "discovery") {
      setScreen(discoveryParentScreen);
      return;
    }
    if (screen === "processing-outline") {
      setScreen("discovery");
      return;
    }
    if (screen === "recording") {
      setScreen("guide");
      return;
    }
    if (screen === "processing-article") {
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
    if (screen === "conversation") {
      setRecordView("deep");
      setScreen("records");
      return;
    }
    if (screen === "article") {
      setScreen(articleParentScreen);
      return;
    }
    if (screen === "processing-update") {
      setScreen("article");
    }
  }

  const backdropClass =
    screen === "create-intro" ||
    screen === "create" ||
    screen === "home" ||
    screen === "discovery" ||
    screen === "processing-outline"
      ? "backdrop-archive"
      : screen === "outline" || screen === "updated"
        ? "backdrop-outline"
        : screen === "chapter" ||
          screen === "records" ||
          screen === "conversation"
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
          {leftControl === "none" ? (
            <span className="icon-button-spacer" />
          ) : (
            <button
              className="icon-button"
              type="button"
              onClick={handleLeftControl}
              aria-label={leftControl === "menu" ? "打开功能菜单" : "返回"}
              title={leftControl === "menu" ? "功能菜单" : "返回"}
            >
              {leftControl === "menu" ? (
                <Menu size={22} />
              ) : (
                <ArrowLeft size={21} />
              )}
            </button>
          )}
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
                  <div className="side-biography-title">
                    <strong>{biographyName}的人生故事</strong>
                    <button type="button" onClick={openBiographySwitcher}>
                      <ChevronsUpDown size={12} />
                      切换
                    </button>
                  </div>
                </div>
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
                        ? "查看提问与回答聊天记录"
                        : "提纲生成后开始"}
                    </small>
                  </span>
                  <em>{journeyStage === "deep" ? "进行中" : "待开始"}</em>
                </button>
              </nav>
              <div className="side-content-title">
                <span>内容成果</span>
                <small>生成后的文章与资料</small>
              </div>
              <button
                type="button"
                className="side-article-entry"
                onClick={() => {
                  setShowSideMenu(false);
                  setScreen("articles");
                }}
              >
                <BookOpen size={18} />
                <span>
                  <strong>传记文章</strong>
                  <small>查看已生成的故事文章</small>
                </span>
                <em>1 篇</em>
              </button>
              <button
                type="button"
                className="new-biography-button"
                onClick={prepareNewBiography}
              >
                <UserRound size={18} />
                新建传记
              </button>
            </aside>
          </>
        )}

        {showBiographySwitcher && (
          <>
            <button
              type="button"
              className="biography-switcher-backdrop"
              aria-label="关闭传记切换"
              onClick={() => setShowBiographySwitcher(false)}
            />
            <section className="biography-switcher" aria-label="切换传记">
              <div className="biography-switcher-head">
                <div>
                  <span className="eyebrow">切换传记</span>
                  <h2>选择要继续记录的人</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBiographySwitcher(false)}
                >
                  取消
                </button>
              </div>
              <div className="biography-switcher-list">
                <button
                  type="button"
                  className="active"
                  onClick={() => switchBiography(biographyName)}
                >
                  <span>{biographyName.slice(0, 1)}</span>
                  <strong>{biographyName}的人生故事</strong>
                  <em>当前</em>
                </button>
                {biographyName !== "林秀兰" && (
                  <button
                    type="button"
                    onClick={() => switchBiography("林秀兰")}
                  >
                    <span>林</span>
                    <strong>林秀兰的人生故事</strong>
                    <small>上次记录</small>
                  </button>
                )}
              </div>
              <button
                type="button"
                className="switcher-new-biography"
                onClick={() => {
                  setShowBiographySwitcher(false);
                  prepareNewBiography();
                }}
              >
                <UserRound size={16} />
                新建传记
              </button>
            </section>
          </>
        )}

        <div className={`screen-content ${backdropClass} screen-content-${screen}`}>
          {screen === "create-intro" && (
            <CreateBiographyEntryScreen onStart={() => setScreen("create")} />
          )}

          {screen === "create" && (
            <CreateBiographyScreen
              name={newBiographyName}
              relation={newBiographyRelation}
              birthYear={newBiographyBirthYear}
              hometown={newBiographyHometown}
              onNameChange={setNewBiographyName}
              onRelationChange={setNewBiographyRelation}
              onBirthYearChange={setNewBiographyBirthYear}
              onHometownChange={setNewBiographyHometown}
              onCreate={createBiography}
            />
          )}

          {screen === "home" && (
            <HomeScreen
              biographyName={biographyName}
              profile={biographyProfile}
              onStart={() => {
                setDiscoveryParentScreen("home");
                setScreen("discovery");
              }}
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
              biographyName={biographyName}
              selectedChapter={outlineChapterChoice}
              version="v1"
              onSelect={setOutlineChapterChoice}
              onContinue={() => {
                if (outlineChapterChoice) openChapter(outlineChapterChoice);
              }}
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
                setDiscoveryParentScreen("records");
                setQuestionIndex(index);
                setScreen("discovery");
              }}
              onConversation={() => setScreen("conversation")}
            />
          )}

          {screen === "conversation" && <ConversationScreen />}

          {screen === "articles" && (
            <ArticlesScreen
              onOpen={() => {
                setArticleParentScreen("articles");
                setScreen("article");
              }}
            />
          )}

          {screen === "guide" && (
            <GuideScreen
              module={selectedModule}
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
              icon={<ListChecks size={26} />}
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
              selectedChapter={outlineChapterChoice}
              onSelect={setOutlineChapterChoice}
              onContinue={() => {
                if (outlineChapterChoice) openChapter(outlineChapterChoice);
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function CreateBiographyEntryScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="screen create-entry-screen">
      <section className="create-entry-card">
        <span className="eyebrow">山顶传记</span>
        <h1>创建一本传记</h1>
        <p>
          从一个想记录的人开始，把散落的回忆慢慢整理成可以留下来的故事。
        </p>
        <button
          type="button"
          className="create-entry-button"
          onClick={onStart}
          onPointerUp={onStart}
        >
          创建一本传记
          <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
}

function CreateBiographyScreen({
  name,
  relation,
  birthYear,
  hometown,
  onNameChange,
  onRelationChange,
  onBirthYearChange,
  onHometownChange,
  onCreate,
}: {
  name: string;
  relation: string;
  birthYear: string;
  hometown: string;
  onNameChange: (value: string) => void;
  onRelationChange: (value: string) => void;
  onBirthYearChange: (value: string) => void;
  onHometownChange: (value: string) => void;
  onCreate: () => void;
}) {
  return (
    <div className="screen create-biography-screen">
      <div className="create-biography-card">
        <div className="create-biography-mark">
          <UserRound size={24} />
        </div>
        <span className="eyebrow">从一个名字开始</span>
        <h1>想记录谁的人生？</h1>
        <p>先填写几项基本信息，让后面的提问更贴近这个人真实的生活。</p>

        <div className="create-biography-form">
          <label className="create-name-field">
            <span>
              被记录人姓名 <em>必填</em>
            </span>
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="例如：李建国"
              autoFocus
            />
          </label>

          <div className="create-form-row">
            <label>
              <span>你和 TA 的关系</span>
              <select
                value={relation}
                onChange={(event) => onRelationChange(event.target.value)}
              >
                <option>父亲</option>
                <option>母亲</option>
                <option>其他长辈</option>
                <option>伴侣</option>
                <option>自己</option>
              </select>
            </label>
            <label>
              <span>出生年份</span>
              <input
                value={birthYear}
                onChange={(event) => onBirthYearChange(event.target.value)}
                inputMode="numeric"
                placeholder="例如：1958"
              />
            </label>
          </div>

          <label>
            <span>家乡或长期生活地</span>
            <input
              value={hometown}
              onChange={(event) => onHometownChange(event.target.value)}
              placeholder="例如：湖南湘潭"
            />
          </label>
        </div>

        <button
          type="button"
          className="create-biography-submit"
          onClick={onCreate}
          disabled={!name.trim()}
        >
          创建传记
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function HomeScreen({
  biographyName,
  profile,
  onStart,
}: {
  biographyName: string;
  profile: {
    relation: string;
    birthYear: string;
    hometown: string;
  };
  onStart: () => void;
}) {
  const profileDetails = [
    profile.relation
      ? profile.relation === "自己"
        ? "为自己记录"
        : `我的${profile.relation}`
      : "",
    profile.birthYear ? `${profile.birthYear} 年出生` : "",
    profile.hometown,
  ].filter(Boolean);

  return (
    <div className="screen home-screen">
      <div className="home-stage-card">
        <div className="home-stage-person">
          <img src="./lin-xiulan-teacher.png" alt={`${biographyName}的传记`} />
          <span>
            正在为 <strong>{biographyName}</strong> 记录人生
          </span>
        </div>
        {profileDetails.length > 0 && (
          <div className="home-profile-meta">{profileDetails.join(" · ")}</div>
        )}
        <span className="home-stage-index">01</span>
        <h1>
          <small>第一步</small>
          初步了解
        </h1>
        <div className="home-stage-facts">
          <span>
            <strong>8 个</strong>
            推荐问题
          </span>
          <i />
          <span>
            <strong>可跳过</strong>
            不必全部回答
          </span>
          <i />
          <span>
            <strong>10—15 分钟</strong>
            预计用时
          </span>
        </div>
        <button type="button" className="intro-start-button" onClick={onStart}>
          开始初步了解
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function RecordsScreen({
  view,
  answers,
  onChangeView,
  onResume,
  onConversation,
}: {
  view: "discovery" | "deep";
  answers: string[];
  onChangeView: (view: "discovery" | "deep") => void;
  onResume: (index: number) => void;
  onConversation: () => void;
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
              <strong>4</strong>
              <small>个核心问题</small>
            </span>
          </div>

          <button
            type="button"
            className="deep-record-card"
            onClick={onConversation}
          >
            <div className="deep-record-top">
              <span>第三章 · 四十年乡村讲台</span>
              <em>采访完成</em>
            </div>
            <h2>第一次走进乡村教室</h2>
            <p>2026 年 7 月 22 日 · 32:18 · 子女协助采访</p>
            <div>
              <span>
                <Play size={15} fill="currentColor" />
                回听录音
              </span>
              <span>
                <MessageCircle size={15} />
                查看聊天记录
                <ChevronRight size={16} />
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

function ConversationScreen() {
  const messages = [
    {
      role: "question",
      speaker: "女儿",
      text: "还记得第一次走进那间教室时，看见了什么吗？",
      time: "00:42",
    },
    {
      role: "answer",
      speaker: "林秀兰",
      text: "教室比我想象中还要小，窗纸破了两块，二十几个孩子坐得很直。我提着藤箱站在门口，一下把准备好的开场白全忘了。",
      time: "01:16",
    },
    {
      role: "question",
      speaker: "女儿",
      text: "你后来提到王校长，他那天对你说了什么？",
      time: "04:08",
    },
    {
      role: "answer",
      speaker: "林秀兰",
      text: "他把一把旧雨伞递给我，说山里的雨说来就来，老师不能让孩子等。我后来一直记得这句话。",
      time: "04:31",
    },
    {
      role: "question",
      speaker: "女儿",
      text: "那一天之后，什么时候第一次觉得自己真的成了老师？",
      time: "09:12",
    },
    {
      role: "answer",
      speaker: "林秀兰",
      text: "下课以后，一个扎羊角辫的小姑娘跑过来喊我林老师。就是那一声，我突然觉得自己可能真的会留在这里。",
      time: "09:44",
    },
  ];

  return (
    <div className="screen conversation-screen">
      <div className="conversation-head">
        <span className="eyebrow">深度采访记录</span>
        <h1>第一次走进乡村教室</h1>
        <p>2026 年 7 月 22 日 · 32:18 · 女儿提问，林秀兰讲述</p>
      </div>
      <button type="button" className="conversation-audio">
        <span>
          <Play size={17} fill="currentColor" />
        </span>
        <i />
        <i />
        <i />
        <i />
        <strong>32:18</strong>
      </button>
      <div className="conversation-messages">
        {messages.map((message, index) => (
          <div
            className={`conversation-message ${message.role}`}
            key={`${message.time}-${index}`}
          >
            <span>{message.speaker}</span>
            <p>{message.text}</p>
            <small>{message.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticlesScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="screen articles-screen">
      <div className="records-heading">
        <span className="eyebrow">传记文章</span>
        <h1>已经写下来的故事</h1>
        <p>文章来自深度采访，可以继续确认事实、修改内容并收入传记。</p>
      </div>
      <div className="article-library-stats">
        <span>
          <strong>1</strong>
          已完成
        </span>
        <span>
          <strong>10</strong>
          待采访小节
        </span>
      </div>
      <button type="button" className="article-library-card" onClick={onOpen}>
        <img
          src="./first-classroom-1976.png"
          alt="1976 年，一位年轻教师第一次走进乡村教室"
        />
        <span>
          <small>第三章 · 四十年乡村讲台</small>
          <strong>二十岁那年，我第一次站上讲台</strong>
          <em>约 1,260 字 · 已确认</em>
        </span>
        <ChevronRight size={18} />
      </button>
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

function PhaseLead({
  number,
  step,
  title,
  copy,
  status,
}: {
  number: "02" | "03";
  step: string;
  title: string;
  copy: string;
  status: [string, string, string];
}) {
  return (
    <section className={`phase-lead phase-lead-${number}`}>
      <span className="phase-lead-index">{number}</span>
      <h1>
        <small>{step}</small>
        {title}
      </h1>
      <p>{copy}</p>
      <div className="phase-track" aria-label="传记流程进度">
        {status.map((label, index) => (
          <span
            className={
              index + 1 < Number(number)
                ? "complete"
                : index + 1 === Number(number)
                  ? "current"
                  : ""
            }
            key={label}
          >
            <i>{String(index + 1).padStart(2, "0")}</i>
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

function OutlineScreen({
  chapters,
  biographyName,
  selectedChapter,
  version,
  onSelect,
  onContinue,
}: {
  chapters: ChapterItem[];
  biographyName: string;
  selectedChapter: ChapterItem | null;
  version: string;
  onSelect: (chapter: ChapterItem) => void;
  onContinue: () => void;
}) {
  const sectionCount = chapters.reduce(
    (total, chapter) => total + chapter.sections.length,
    0,
  );
  return (
    <div className="screen outline-screen">
      <div className="outline-scroll-area">
        <PhaseLead
          number="02"
          step="第二步"
          title="采访提纲"
          copy={`${biographyName}的第一版完整提纲已经生成。先看全书结构，再选择一个章节开始采访。`}
          status={["初步了解", "采访提纲", "深度采访"]}
        />

        <div className="outline-version-line">
          <span>完整采访提纲 {version}</span>
          <small>一级标题为章节，二级标题为采访小节</small>
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
          <small>先选择一个一级章节</small>
        </div>

        <div className="chapter-list">
          {chapters.map((chapter) => {
            const isSelected = selectedChapter?.id === chapter.id;
            return (
              <button
                type="button"
                className={`chapter-card ${isSelected ? "selected" : ""}`}
                onClick={() => onSelect(chapter)}
                aria-pressed={isSelected}
                key={chapter.id}
              >
                <span className="chapter-order">{chapter.order}</span>
                <span className="chapter-main">
                  <span className="chapter-title-line">
                    <strong>{chapter.title}</strong>
                    <em>{chapter.period}</em>
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
                <span className="chapter-selection" aria-hidden="true">
                  {isSelected && <Check size={15} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky-action outline-action">
        <button
          className="primary-button"
          type="button"
          onClick={onContinue}
          disabled={!selectedChapter}
        >
          {selectedChapter
            ? `进入「${selectedChapter.title}」`
            : "请选择一个章节"}
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
      <PhaseLead
        number="03"
        step="第三步"
        title="深度采访"
        copy="从当前章节选择一个采访小节，按照问题提示完成一次有方向、有结果的交流。"
        status={["初步了解", "提纲已生成", "深度采访"]}
      />

      <div className="chapter-hero">
        <span>{chapter.order}</span>
        <h1>{chapter.title}</h1>
        <p>{chapter.summary}</p>
        <small>{chapter.period}</small>
      </div>

      {chapter.changeNote && (
        <div className="chapter-change-note">
          <ListChecks size={17} />
          {chapter.changeNote}
        </div>
      )}

      <div className="section-label">
        <span>选择本次采访小节</span>
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
                {section.status === "new" && <em className="new">新增</em>}
                {section.status === "completed" && <em className="done">已成文</em>}
                {section.status === "moved" && <em className="moved">顺序调整</em>}
              </span>
              <small>{section.meta}</small>
              <p>{section.description}</p>
              {section.changeNote && (
                <mark>
                  <ListChecks size={13} />
                  {section.changeNote}
                </mark>
              )}
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
    </div>
  );
}

function GuideScreen({
  module,
  onStart,
}: {
  module: ModuleItem;
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
      <article className="story-article">
        <header className="article-title-block">
          <span className="article-serial">第三章 · 故事 01</span>
          <h1>第一次站上讲台</h1>
          <div className="article-meta">
            林秀兰口述 · 子女采访整理 · 约 1,260 字
          </div>
        </header>

        <figure className="article-cover">
          <img
            src="./first-classroom-1976.png"
            alt="1976 年，一位年轻教师第一次走进乡村教室"
          />
          <figcaption>
            <span>1976 年秋</span>
            <small>石桥小学 · 场景还原图</small>
          </figcaption>
        </figure>

        <div className="article-body">
          <p className="article-lede">
            那是 1976
            年秋天，我提着一只旧藤箱，第一次走进石桥小学。教室比我想象中还要小，窗纸破了两块，二十几个孩子齐刷刷地看着我。那一刻，我连事先准备好的第一句话都忘了。
          </p>
          <blockquote>
            <p>王校长把一把旧雨伞递给我，说，山里的雨说来就来，老师不能让孩子等。</p>
          </blockquote>

          <p>
            第一堂课讲的是一篇短短的课文。下课铃响以后，没有一个孩子起身。我以为自己讲错了，后来才知道，他们只是从没见过这么年轻的老师。一个扎羊角辫的小姑娘跑过来，小声喊了第一句“林老师”。
          </p>
          <p>
            那天回宿舍的路上下起大雨。我撑着王校长借我的伞，鞋上全是泥，心里却第一次觉得，也许我真的可以留在这里。
          </p>
          <footer className="article-source-note">
            <span>故事来源</span>
            <p>根据 2026 年 7 月 22 日深度采访整理，涉及时间与人物信息仍可继续补充。</p>
          </footer>
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
  selectedChapter,
  onSelect,
  onContinue,
}: {
  chapters: ChapterItem[];
  selectedChapter: ChapterItem | null;
  onSelect: (chapter: ChapterItem) => void;
  onContinue: () => void;
}) {
  return (
    <div className="screen updated-screen">
      <div className="update-summary">
        <div className="update-icon">
          <ListChecks size={23} />
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
        {chapters.map((chapter) => {
          const isSelected = selectedChapter?.id === chapter.id;
          return (
            <button
              type="button"
              className={`chapter-card ${
                chapter.changeNote ? "has-change" : ""
              } ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(chapter)}
              aria-pressed={isSelected}
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
                    <ListChecks size={13} />
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
              <span className="chapter-selection" aria-hidden="true">
                {isSelected && <Check size={15} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="sticky-action outline-action">
        <button
          className="primary-button"
          type="button"
          onClick={onContinue}
          disabled={!selectedChapter}
        >
          {selectedChapter
            ? `进入「${selectedChapter.title}」`
            : "请选择下一次采访章节"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
