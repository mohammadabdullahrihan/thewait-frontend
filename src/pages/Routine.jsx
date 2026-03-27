import { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
  Clock,
  Layout,
  MoreVertical,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Settings,
  Sun,
  Moon,
  Coffee,
  Brain,
  Dumbbell,
  Target,
  Star,
  Activity,
  Smile,
  BookOpen,
} from "lucide-react";
import { routineAPI, authAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { todayStr } from "../utils/helpers";
import { format, addDays, parseISO } from "date-fns";
import toast from "react-hot-toast";
import {
  TaskSkeleton,
  HeaderSkeleton,
} from "../components/Common/SkeletonLoader";
import EmptyState from "../components/Common/EmptyState";
import confetti from "canvas-confetti";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTask } from "../components/Routine/SortableTask";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// MY COMPLETE DAILY ROUTINE TEMPLATE
// ============================================================
const MY_DAILY_ROUTINE_TEMPLATE = [
  {
    time: "05:50",
    task: "ঘুম থেকে ওঠা — Snooze বন্ধ, কোনো শর্ত নেই",
    category: "Discipline",
    completed: false,
  },
  {
    time: "05:50",
    task: "ঠান্ডা পানি মুখে + ১ গ্লাস পানি পান (ফোন নয়)",
    category: "Health",
    completed: false,
  },
  {
    time: "06:00",
    task: "স্ট্রেচিং ১০ মিনিট + গভীর শ্বাস ৫ মিনিট",
    category: "Health",
    completed: false,
  },
  {
    time: "06:15",
    task: "কার্ডিও/দৌড় ৪৫ মিনিট (Motivational Playlist)",
    category: "Health",
    completed: false,
  },
  {
    time: "07:00",
    task: "স্ট্রেংথ: পুশ-আপ ৩x১৫, স্কোয়াট ৩x২০, প্ল্যাঙ্ক ৩x৪৫s",
    category: "Health",
    completed: false,
  },
  {
    time: "07:30",
    task: "ঠান্ডা পানিতে গোসল (বাধ্যতামূলক) + প্রোটিন নাস্তা",
    category: "Discipline",
    completed: false,
  },
  {
    time: "08:00",
    task: 'মাইন্ড সেট: চোখ বন্ধ ৫ মিনিট — "আজকের মিশন শুরু"',
    category: "Mindfulness",
    completed: false,
  },
  {
    time: "08:15",
    task: "পোমোডোরো ১ — GED Math (২৫+৫ মিনিট)",
    category: "Study",
    completed: false,
  },
  {
    time: "08:45",
    task: "পোমোডোরো ২ — GED Math চালিয়ে (২৫+৫)",
    category: "Study",
    completed: false,
  },
  {
    time: "09:15",
    task: "পোমোডোরো ৩ — GED Science (২৫+৫)",
    category: "Study",
    completed: false,
  },
  {
    time: "09:45",
    task: "পোমোডোরো ৪ — GED Science চালিয়ে (২৫+৫)",
    category: "Study",
    completed: false,
  },
  {
    time: "10:15",
    task: "লং ব্রেক: হাঁটুন, পানি পান — ফোন নয়",
    category: "Discipline",
    completed: false,
  },
  {
    time: "10:30",
    task: "ইংরেজি লিসেনিং: VOA / BBC 6 Minute English",
    category: "Study",
    completed: false,
  },
  {
    time: "11:00",
    task: "ভোকাবুলারি: ১০টি নতুন ইংরেজি শব্দ (Anki-তে সেভ)",
    category: "Study",
    completed: false,
  },
  {
    time: "11:30",
    task: "রাইটিং: ১টি ইংরেজি প্যারাগ্রাফ (Google Keep)",
    category: "Study",
    completed: false,
  },
  {
    time: "12:00",
    task: "ইউরোপ বিশ্ববিদ্যালয় রিসার্চ: ১টি বিশ্ববিদ্যালয় (Notion)",
    category: "Study",
    completed: false,
  },
  {
    time: "12:30",
    task: "ফ্রি টাইম (ফোন ছাড়া) — নিজের মতো কাটান",
    category: "Discipline",
    completed: false,
  },
  {
    time: "13:00",
    task: "দুপুরের খাবার — ফোন বন্ধ, শুধু খাওয়ায় ফোকাস",
    category: "Discipline",
    completed: false,
  },
  {
    time: "13:40",
    task: "Power Nap / হালকা বিশ্রাম (টাইমার ২৫ মিনিট)",
    category: "Health",
    completed: false,
  },
  {
    time: "14:10",
    task: "ডে প্ল্যান রিভিউ: বাকি কাজ চেক (Todoist / Tasks)",
    category: "Discipline",
    completed: false,
  },
  {
    time: "14:30",
    task: "পোমোডোরো ৫ — GED Social Studies (২৫+৫)",
    category: "Study",
    completed: false,
  },
  {
    time: "15:00",
    task: "পোমোডোরো ৬ — GED RLA Reading (২৫+৫)",
    category: "Study",
    completed: false,
  },
  {
    time: "15:30",
    task: "পোমোডোরো ৭ — IELTS Listening Practice (২৫+৫)",
    category: "Study",
    completed: false,
  },
  {
    time: "16:00",
    task: "পোমোডোরো ৮ — IELTS Reading Practice (২৫+৫)",
    category: "Study",
    completed: false,
  },
  {
    time: "16:30",
    task: "লং ব্রেক: হাঁটুন, চা/কফি",
    category: "Discipline",
    completed: false,
  },
  {
    time: "17:00",
    task: "ওয়ার্ম আপ: স্ট্রেচিং, জাম্পিং জ্যাক",
    category: "Health",
    completed: false,
  },
  {
    time: "17:15",
    task: "মেইন ওয়ার্কআউট (দিন ১,৩,৫: পুশ-আপ/পুল-আপ/ডিপস | দিন ২,৪,৬: দৌড়/স্কিপিং/স্কোয়াট)",
    category: "Health",
    completed: false,
  },
  {
    time: "17:45",
    task: "কুল ডাউন: স্ট্রেচিং, গভীর শ্বাস",
    category: "Health",
    completed: false,
  },
  {
    time: "18:00",
    task: "গোসল + পোশাক পরিবর্তন",
    category: "Health",
    completed: false,
  },
  {
    time: "18:30",
    task: "পরিবারের সাথে সময় — ফোন অন্য রুমে",
    category: "Discipline",
    completed: false,
  },
  {
    time: "19:30",
    task: "রাতের খাবার পরিবারের সাথে — ফোন নয়",
    category: "Discipline",
    completed: false,
  },
  {
    time: "20:15",
    task: "হালকা রিডিং: গল্পের বই বা স্ট্র্যাটেজি",
    category: "Mindfulness",
    completed: false,
  },
  {
    time: "20:45",
    task: "ইবাদত/ধ্যান: ১৫ মিনিট শান্ত হয়ে বসুন",
    category: "Ibadat",
    completed: false,
  },
  {
    time: "21:00",
    task: "ডে রিভিউ: ৫ প্রশ্নের উত্তর লিখুন (কন্ট্রোল? ডিটাচমেন্ট? অপসিক? মিশন ফার্স্ট? কী শিখলাম?)",
    category: "Mindfulness",
    completed: false,
  },
  {
    time: "21:15",
    task: "আগামীকালের To-Do লিস্ট তৈরি (Todoist)",
    category: "Discipline",
    completed: false,
  },
  {
    time: "21:30",
    task: "ডিজিটাল ডিটক্স: মোবাইল বন্ধ — বই পড়ো বা ডায়েরি লেখো",
    category: "Discipline",
    completed: false,
  },
  {
    time: "22:00",
    task: "ঘুম — ফোন চার্জারে অন্য রুমে, অ্যালার্ম ০৫:৫০ AM",
    category: "Discipline",
    completed: false,
  },
];

// ============================================================
// FRIDAY (RECHARGE DAY) ROUTINE TEMPLATE
// ============================================================
const FRIDAY_ROUTINE_TEMPLATE = [
  {
    time: "06:00",
    task: "স্বাভাবিক সময়ে উঠুন — কোনো চাপ নেই",
    category: "Discipline",
    completed: false,
  },
  {
    time: "06:30",
    task: "হালকা যোগব্যায়াম / স্ট্রেচিং (ভারী ওয়ার্কআউট নয়)",
    category: "Health",
    completed: false,
  },
  {
    time: "07:30",
    task: "নাস্তা + পানি পান",
    category: "Health",
    completed: false,
  },
  {
    time: "08:00",
    task: "রিভিশন পড়া ১ — GED Math (নতুন কিছু নয়, পুরনো রিভিউ)",
    category: "Study",
    completed: false,
  },
  {
    time: "09:00",
    task: "রিভিশন পড়া ২ — GED Science রিভিউ",
    category: "Study",
    completed: false,
  },
  {
    time: "10:00",
    task: "জুমার নামাজের প্রস্তুতি + মসজিদে যাওয়া",
    category: "Ibadat",
    completed: false,
  },
  {
    time: "12:00",
    task: "পরিবারের সাথে সময় কাটান — ফোন ছাড়া",
    category: "Discipline",
    completed: false,
  },
  {
    time: "14:00",
    task: "বিশ্রাম / Power Nap",
    category: "Health",
    completed: false,
  },
  {
    time: "15:00",
    task: "বাইরে হাঁটতে যান বা পরিবারের সাথে ঘুরতে যান",
    category: "Health",
    completed: false,
  },
  {
    time: "18:00",
    task: "হালকা রিডিং: গল্পের বই বা মোটিভেশনাল বই",
    category: "Mindfulness",
    completed: false,
  },
  {
    time: "19:30",
    task: "রাতের খাবার পরিবারের সাথে",
    category: "Discipline",
    completed: false,
  },
  {
    time: "21:00",
    task: "সাপ্তাহিক রিভিউ: এই সপ্তাহে কী করলাম? কী শিখলাম?",
    category: "Mindfulness",
    completed: false,
  },
  {
    time: "21:30",
    task: "আগামী সপ্তাহের প্ল্যান তৈরি করো",
    category: "Discipline",
    completed: false,
  },
  {
    time: "22:00",
    task: "ঘুম — অ্যালার্ম ০৬:০০ AM",
    category: "Discipline",
    completed: false,
  },
];

// ============================================================
// SATURDAY (COMMANDO DAY) ROUTINE TEMPLATE
// ============================================================
const SATURDAY_ROUTINE_TEMPLATE = [
  {
    time: "06:00",
    task: "উঠুন — কমান্ডো ডে শুরু!",
    category: "Discipline",
    completed: false,
  },
  {
    time: "06:30",
    task: "লং রান ৫-১০ কিমি অথবা লং ওয়ার্কআউট সেশন",
    category: "Health",
    completed: false,
  },
  {
    time: "08:00",
    task: "ঠান্ডা পানিতে গোসল + প্রোটিন নাস্তা",
    category: "Discipline",
    completed: false,
  },
  {
    time: "09:00",
    task: "মডেল টেস্ট — GED Math (পুরো সেট)",
    category: "Study",
    completed: false,
  },
  {
    time: "10:00",
    task: "মডেল টেস্ট — GED Science (পুরো সেট)",
    category: "Study",
    completed: false,
  },
  {
    time: "11:00",
    task: "মডেল টেস্ট — GED Social Studies",
    category: "Study",
    completed: false,
  },
  {
    time: "12:00",
    task: "মডেল টেস্ট — GED RLA Reading",
    category: "Study",
    completed: false,
  },
  {
    time: "13:00",
    task: "দুপুরের খাবার + বিশ্রাম",
    category: "Health",
    completed: false,
  },
  {
    time: "15:00",
    task: "দুর্বল বিষয় নিয়ে এক্সট্রা কাজ — ভুলগুলো বিশ্লেষণ করো",
    category: "Study",
    completed: false,
  },
  {
    time: "16:00",
    task: "IELTS Practice — দুর্বল সেকশনে ফোকাস",
    category: "Study",
    completed: false,
  },
  {
    time: "17:00",
    task: "নিজের মতো কাটান — বিশ্রাম, পরিবার, বা হাঁটা",
    category: "Discipline",
    completed: false,
  },
  {
    time: "19:30",
    task: "রাতের খাবার",
    category: "Discipline",
    completed: false,
  },
  {
    time: "21:00",
    task: "সাপ্তাহিক ডে রিভিউ: কমান্ডো মিশন কেমন গেল?",
    category: "Mindfulness",
    completed: false,
  },
  {
    time: "21:30",
    task: "আগামীকালের রুটিন প্ল্যান করো (Daily-তে ফিরে যাও)",
    category: "Discipline",
    completed: false,
  },
  {
    time: "22:00",
    task: "ঘুম — অ্যালার্ম ০৫:৫০ AM (রবিবার থেকে আবার Daily)",
    category: "Discipline",
    completed: false,
  },
];

// All templates map
const ALL_TEMPLATES = {
  Daily: {
    key: "Daily",
    label: "ডেইলি রুটিন",
    emoji: "⚔️",
    description: "সকাল ৫:৫০ থেকে রাত ১০:০০ — পূর্ণ মিশন মোড",
    tasks: MY_DAILY_ROUTINE_TEMPLATE,
    color: "emerald",
    highlights: [
      "🌅 সকাল ৫:৫০ — কার্ডিও, স্ট্রেংথ, ঠান্ডা গোসল",
      "📚 GED Math + Science (৪ পোমোডোরো)",
      "🔤 ইংরেজি লিসেনিং + ভোকাব + রাইটিং",
      "🌍 বিশ্ববিদ্যালয় রিসার্চ",
      "📖 GED Social + IELTS (৪ পোমোডোরো)",
      "💪 বিকালের ওয়ার্কআউট সেশন",
      "🌙 ডে রিভিউ + ডিজিটাল ডিটক্স + ঘুম",
    ],
  },
  Friday: {
    key: "Friday",
    label: "শুক্রবার (রিচার্জ ডে)",
    emoji: "🌿",
    description: "হালকা রুটিন — রিভিশন, পরিবার ও মন রিচার্জ",
    tasks: FRIDAY_ROUTINE_TEMPLATE,
    color: "teal",
    highlights: [
      "🕌 জুমার নামাজ",
      "📖 হালকা রিভিশন (নতুন কিছু নয়)",
      "👨‍👩‍👧 পরিবারের সাথে সময়",
      "🌳 বাইরে ঘুরতে যাওয়া",
      "📅 সাপ্তাহিক রিভিউ + পরের সপ্তাহের প্ল্যান",
    ],
  },
  Saturday: {
    key: "Saturday",
    label: "শনিবার (কমান্ডো ডে)",
    emoji: "🔥",
    description: "লং রান + পুরো মডেল টেস্ট + দুর্বল বিষয়ে এক্সট্রা",
    tasks: SATURDAY_ROUTINE_TEMPLATE,
    color: "rose",
    highlights: [
      "🏃 লং রান ৫-১০ কিমি বা লং ওয়ার্কআউট",
      "📝 GED Math মডেল টেস্ট",
      "📝 GED Science মডেল টেস্ট",
      "📝 GED Social + RLA মডেল টেস্ট",
      "🎯 দুর্বল বিষয়ে এক্সট্রা প্র্যাকটিস",
      "📖 IELTS দুর্বল সেকশন ফোকাস",
    ],
  },
};

const categoryMeta = {
  Discipline: {
    icon: <Target size={14} />,
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-100",
  },
  Study: {
    icon: <Brain size={14} />,
    color: "bg-sky-50 text-sky-600",
    border: "border-sky-100",
  },
  Health: {
    icon: <Dumbbell size={14} />,
    color: "bg-rose-50 text-rose-600",
    border: "border-rose-100",
  },
  Mindfulness: {
    icon: <Sparkles size={14} />,
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
  Ibadat: {
    icon: <Moon size={14} />,
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
  },
  Other: {
    icon: <Layout size={14} />,
    color: "bg-gray-50 text-gray-600",
    border: "border-gray-100",
  },
};

const Routine = () => {
  const { user, updateUser } = useAuth();
  const [date, setDate] = useState(todayStr());
  const [activeName, setActiveName] = useState(
    user?.activeRoutineName || "Daily",
  );
  const [routineNames, setRoutineNames] = useState(["Daily", "Ramadan"]);
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTemplateShelf, setShowTemplateShelf] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [pendingRoutine, setPendingRoutine] = useState(null);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newTask, setNewTask] = useState({
    time: "",
    task: "",
    category: "Discipline",
  });
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(() => {
    const dayOfWeek = new Date().getDay(); // 0=Sun, 5=Fri, 6=Sat
    if (dayOfWeek === 5) return "Friday";
    if (dayOfWeek === 6) return "Saturday";
    return "Daily";
  });

  // scroll lock
  useEffect(() => {
    if (showNewRoutineModal || showConfirmModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showNewRoutineModal, showConfirmModal]);

  // Sync activeName with user preference once user is loaded
  useEffect(() => {
    if (user?.activeRoutineName && user.activeRoutineName !== activeName) {
      setActiveName(user.activeRoutineName);
    }
  }, [user]);

  // Helper: detect which template key to use for a given date string
  const getTemplateKeyForDate = (dateStr) => {
    const dayOfWeek = new Date(dateStr + "T00:00:00").getDay(); // 0=Sun, 5=Fri, 6=Sat
    if (dayOfWeek === 5) return "Friday";
    if (dayOfWeek === 6) return "Saturday";
    return "Daily";
  };

  const fetchRoutineData = async (d, name) => {
    setLoading(true);
    try {
      const [routineRes, allRes] = await Promise.all([
        routineAPI.get(d, name),
        routineAPI.getAllForDate(d),
      ]);
      const fetchedRoutine = routineRes.data.routine;
      setRoutine(fetchedRoutine);
      const names = allRes.data.routines?.map((r) => r.name) || [];
      if (!names.includes("Daily")) names.unshift("Daily");
      if (!names.includes("Ramadan")) names.push("Ramadan");
      if (user?.activeRoutineName && !names.includes(user.activeRoutineName))
        names.push(user.activeRoutineName);
      setRoutineNames([...new Set(names)]);

      // ✅ AUTO-LOAD: যদি "Daily" রুটিনে কোনো টাস্ক না থাকে, তাহলে দিন বুঝে auto-load
      const tasksEmpty =
        !fetchedRoutine?.tasks || fetchedRoutine.tasks.length === 0;
      if (tasksEmpty && name === "Daily") {
        const templateKey = getTemplateKeyForDate(d);
        const template = ALL_TEMPLATES[templateKey];
        if (template) {
          try {
            const res = await routineAPI.save({
              date: d,
              name,
              tasks: template.tasks,
            });
            setRoutine(res.data.routine);
            if (templateKey === "Friday") {
              toast(
                "🌿 শুক্রবার — রিচার্জ ডে রুটিন স্বয়ংক্রিয়ভাবে লোড হয়েছে!",
                {
                  style: {
                    borderRadius: "2rem",
                    background: "#0f766e",
                    color: "#fff",
                    border: "1px solid #14b8a6",
                  },
                  duration: 4000,
                },
              );
            } else if (templateKey === "Saturday") {
              confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
              toast(
                "🔥 শনিবার — কমান্ডো ডে রুটিন স্বয়ংক্রিয়ভাবে লোড হয়েছে!",
                {
                  style: {
                    borderRadius: "2rem",
                    background: "#be123c",
                    color: "#fff",
                    border: "1px solid #f43f5e",
                  },
                  duration: 4000,
                },
              );
            } else {
              toast(
                "⚔️ Daily রুটিন স্বয়ংক্রিয়ভাবে লোড হয়েছে — মিশন শুরু করো!",
                {
                  style: {
                    borderRadius: "2rem",
                    background: "#064e3b",
                    color: "#fff",
                    border: "1px solid #10b981",
                  },
                  duration: 4000,
                },
              );
            }
          } catch (autoErr) {
            console.error("Auto-load failed:", autoErr);
          }
        }
      }
    } catch (e) {
      toast.error("ডেটা লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutineData(date, activeName);
  }, [date, activeName]);

  const handleRoutineSwitchRequest = (name) => {
    if (name === activeName) return;
    setPendingRoutine(name);
    setShowConfirmModal(true);
  };

  const confirmRoutineSwitch = async () => {
    const name = pendingRoutine;
    setActiveName(name);
    setShowConfirmModal(false);

    if (name === "Ramadan" || name === "রমজান") {
      toast("🌙 রমজান রুটিন সক্রিয় করা হয়েছে!", {
        icon: "✨",
        style: {
          borderRadius: "2rem",
          background: "#064e3b",
          color: "#fff",
          border: "1px solid #10b981",
        },
      });
    }

    try {
      const res = await authAPI.updateProfile({ activeRoutineName: name });
      updateUser(res.data.user);
    } catch (e) {
      console.error("Failed to save active routine preference");
    }
  };

  const toggleTask = async (taskId, completed, index) => {
    try {
      if (navigator.vibrate) navigator.vibrate(50);

      if (!routine?._id || !taskId) {
        // Not saved yet or ID missing, toggle locally and save
        const updatedTasks = [...(routine?.tasks || [])];
        if (updatedTasks[index]) updatedTasks[index].completed = !completed;
        const res = await routineAPI.save({
          date,
          name: activeName,
          tasks: updatedTasks,
        });
        setRoutine(res.data.routine);
        if (!completed) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          toast.success("+5 XP অর্জিত! 🔥", { position: "bottom-center" });
        }
        return;
      }

      const res = await routineAPI.toggleTask(
        date,
        taskId,
        !completed,
        activeName,
      );
      setRoutine(res.data.routine);
      if (!completed) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success("+5 XP অর্জিত! 🔥", { position: "bottom-center" });
      }
    } catch (e) {
      toast.error("আপডেট ব্যর্থ");
    }
  };

  const addTask = async () => {
    if (!newTask.task.trim()) {
      toast.error("টাস্কের নাম দিন");
      return;
    }
    const tasks = [...(routine?.tasks || []), newTask];
    try {
      const res = await routineAPI.save({ date, name: activeName, tasks });
      setRoutine(res.data.routine);
      setNewTask({ time: "", task: "", category: "Discipline" });
      setShowAdd(false);
      toast.success("টাস্ক যোগ হয়েছে");
    } catch (e) {
      toast.error("টাস্ক যোগ করা যায়নি");
    }
  };

  const deleteTask = async (taskId, index) => {
    try {
      if (!routine?._id) {
        // Not saved yet, just remove locally
        const updatedTasks = (routine?.tasks || []).filter(
          (_, i) => i !== index,
        );
        setRoutine({ ...routine, tasks: updatedTasks });
        toast.success("টাস্ক মুছে ফেলা হয়েছে");
        return;
      }

      const res = await routineAPI.deleteTask(date, taskId, activeName);
      setRoutine(res.data.routine);
      toast.success("টাস্ক মুছে ফেলা হয়েছে");
    } catch (e) {
      toast.error("মুছে ফেলা ব্যর্থ");
    }
  };

  const deleteFullRoutine = async () => {
    if (
      !window.confirm(
        `আপনি কি নিশ্চিতভাবে এই (${activeName}) রুটিনটি আজ থেকে ডিলিট করতে চান?`,
      )
    )
      return;
    try {
      await routineAPI.deleteRoutine(date, activeName);
      fetchRoutineData(date, activeName);
      toast.success("রুটিন পুরোপুরি ডিলিট করা হয়েছে");
    } catch (e) {
      toast.error("ডিলিট করা সম্ভব হয়নি");
    }
  };

  const createNewRoutine = () => {
    if (!newRoutineName.trim()) return;
    if (routineNames.includes(newRoutineName)) {
      setActiveName(newRoutineName);
    } else {
      setRoutineNames((prev) => [...prev, newRoutineName]);
      setActiveName(newRoutineName);
    }
    setNewRoutineName("");
    setShowNewRoutineModal(false);
  };

  const changeDate = (delta) => {
    const d = addDays(parseISO(date), delta);
    setDate(format(d, "yyyy-MM-dd"));
  };

  const completedCount = routine?.tasks?.filter((t) => t.completed).length || 0;
  const totalCount = routine?.tasks?.length || 0;
  const completionRate = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  const handleRoutineChange = async (name) => {
    setActiveName(name);
    if (name === "Ramadan" || name === "রমজান") {
      toast("🌙 রমজান রুটিন সক্রিয় করা হয়েছে!", {
        icon: "✨",
        style: {
          borderRadius: "2rem",
          background: "#064e3b",
          color: "#fff",
          border: "1px solid #10b981",
        },
      });
    }
    try {
      const res = await authAPI.updateProfile({ activeRoutineName: name });
      updateUser(res.data.user);
    } catch (e) {
      console.error("Failed to save active routine preference");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = routine.tasks.findIndex(
        (t, i) => (t._id || `task-${i}`) === active.id,
      );
      const newIndex = routine.tasks.findIndex(
        (t, i) => (t._id || `task-${i}`) === over.id,
      );
      const newTasks = arrayMove(routine.tasks, oldIndex, newIndex);
      setRoutine({ ...routine, tasks: newTasks });

      if (navigator.vibrate) navigator.vibrate(20);

      if (routine?._id) {
        try {
          await routineAPI.save({ date, name: activeName, tasks: newTasks });
        } catch (e) {
          toast.error("ক্রম সেভ ব্যর্থ হয়েছে");
          setRoutine(routine); // revert
        }
      }
    }
  };

  const copyRoutineToTarget = async () => {
    const targetDate = prompt(
      "কোন তারিখে এই রুটিনটি কপি করতে চান? (Format: YYYY-MM-DD)",
      todayStr(),
    );
    if (!targetDate) return;
    try {
      await routineAPI.copy({ sourceDate: date, targetDate, name: activeName });
      toast.success(`রুটিনটি ${targetDate} তারিখে কপি করা হয়েছে!`);
      if (targetDate === todayStr()) changeDate(0); // refresh if today
    } catch (e) {
      toast.error("কপি ব্যর্থ হয়েছে");
    }
  };

  const loadDefaultTemplate = async (key) => {
    const template = ALL_TEMPLATES[key];
    if (!template) return;
    setLoadingTemplate(true);
    setShowTemplateShelf(false);
    try {
      const res = await routineAPI.save({
        date,
        name: activeName,
        tasks: template.tasks,
      });
      setRoutine(res.data.routine);
      confetti({ particleCount: 250, spread: 120, origin: { y: 0.6 } });
      toast.success(
        `${template.emoji} ${template.label} লোড হয়েছে! এখন মিশনে যাও।`,
        { duration: 4000 },
      );
    } catch (e) {
      toast.error("টেমপ্লেট লোড করা যায়নি");
    } finally {
      setLoadingTemplate(false);
    }
  };

  if (loading && !routine)
    return (
      <div className="animate-in fade-in duration-500 space-y-8 pb-24">
        <HeaderSkeleton />
        <TaskSkeleton count={5} />
      </div>
    );

  return (
    <div className="animate-in fade-in duration-700 pb-24 space-y-8">
      {/* 🚀 Header: Ultra Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-50 pb-8 mt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
              ELITE DISCIPLINE
            </span>
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 rounded-full uppercase tracking-widest">
              LV.{Math.floor(completionRate / 10)} REWARDS
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-emerald-950 flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-emerald-100 text-emerald-500">
              <ClipboardList size={28} />
            </div>
            দৈনিক রুটিন
          </h1>
          <p className="text-emerald-950/40 font-bold text-sm pl-1">
            শৃঙ্খলাই হলো সাফল্যের একমাত্র চাবিকাঠি
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className={`px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl ${showAdd ? "bg-emerald-50 text-emerald-800" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"}`}
          >
            {showAdd ? <X size={18} /> : <Plus size={18} />}
            {showAdd ? "বাতিল" : "নতুন টাস্ক"}
          </button>

          {/* ✨ Desktop/Universal Action Bar Toggle */}
          <button
            onClick={() => setShowTemplateShelf(!showTemplateShelf)}
            disabled={loadingTemplate}
            className={`px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 ${showTemplateShelf ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 shadow-amber-500/10"}`}
            title="লাইব্রেরি থেকে রুটিন লোড করো"
          >
            <Sparkles size={18} />
            <span className="hidden md:inline">
              {showTemplateShelf ? "রুটিনে ফেরো" : "টেমপ্লেট লাইব্রেরি"}
            </span>
          </button>

          {routine?._id && (
            <>
              <button
                onClick={copyRoutineToTarget}
                className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-3xl hover:bg-emerald-100 transition-all shadow-sm hidden md:flex"
                title="অন্য দিনে কপি করুন"
              >
                <Layers size={20} />
              </button>
              <button
                onClick={deleteFullRoutine}
                className="p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-3xl hover:bg-rose-100 transition-all shadow-sm"
                title="আজকের রুটিন মুছুন"
              >
                <X size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* The Template Shelf/Modal code is removed from here as we will inline it below in the main area */}

      {/* 📅 Date & Routine Meta Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-4 flex items-center gap-3 bg-white p-2 rounded-[2rem] border border-emerald-50 shadow-sm w-max">
          <button
            onClick={() => changeDate(-1)}
            className="p-4 rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="px-4 text-center">
            <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none mb-1">
              CURRENT DATE
            </p>
            <p className="text-sm font-black text-emerald-950">
              {format(parseISO(date), "EEEE, dd MMM")}
            </p>
          </div>
          <button
            onClick={() => changeDate(1)}
            disabled={date === todayStr()}
            className="p-4 rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 📚 Multiple Routine Tabs */}
        <div className="lg:col-span-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 bg-emerald-50/50 p-2 rounded-[2rem] border border-emerald-100/50">
            {routineNames.map((name) => (
              <button
                key={name}
                onClick={() => handleRoutineSwitchRequest(name)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeName === name ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-emerald-900/50 hover:text-emerald-700"}`}
              >
                <div className="flex items-center gap-2">
                  <Layers size={14} /> {name}
                </div>
              </button>
            ))}
            <button
              onClick={() => setShowNewRoutineModal(true)}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-emerald-100 text-emerald-500 hover:bg-emerald-50 transition-all"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* 📋 Main Content Area (Routine Tasks OR Template Library) */}
        <div className="xl:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {showTemplateShelf ? (
              <motion.div
                key="templates"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="p-8 sm:p-10 rounded-[3rem] bg-amber-50 border border-amber-100 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                     <div>
                       <h3 className="text-2xl font-black text-amber-950 flex items-center gap-3">
                         <Sparkles className="text-amber-500" /> এক্সপার্ট টেমপ্লেট লাইব্রেরি
                       </h3>
                       <p className="text-xs font-bold text-amber-900/40 mt-1 uppercase tracking-widest">শুরু করার জন্য একটি আধুনিক ফ্রেমওয়ার্ক বেছে নাও</p>
                     </div>
                     <button onClick={() => setShowTemplateShelf(false)} className="hidden sm:block px-6 py-2 bg-white text-[10px] font-black text-amber-700 rounded-xl border border-amber-200">লাইব্রেরি বন্ধ করো</button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {Object.values(ALL_TEMPLATES).map(tmpl => {
                        const colorMap = {
                          emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 focus:ring-emerald-500",
                          teal: "bg-teal-50 text-teal-600 border-teal-100 focus:ring-teal-500",
                          rose: "bg-rose-50 text-rose-600 border-rose-100 focus:ring-rose-500",
                        };
                        const colors = colorMap[tmpl.color] || colorMap.emerald;
                        return (
                          <div key={tmpl.key} className="bg-white rounded-[2rem] p-6 border border-amber-100 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colors} border group-hover:scale-110 transition-transform`}>
                                  {tmpl.emoji}
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${colors} border`}>
                                  {tmpl.tasks.length} Missions
                                </span>
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-lg font-black text-emerald-950">{tmpl.label}</h4>
                                <p className="text-xs font-bold text-emerald-950/40 leading-relaxed">{tmpl.description}</p>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-2">
                                {tmpl.highlights.map((h, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-50 text-[8px] font-black text-gray-400 rounded-lg uppercase tracking-tight">{h}</span>
                                ))}
                              </div>
                            </div>
                            <button 
                              onClick={() => loadDefaultTemplate(tmpl.key)}
                              disabled={loadingTemplate}
                              className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/10 transition-all"
                            >
                              {loadingTemplate ? "প্রসেসিং..." : "এই রুটিন লোড করো"}
                            </button>
                          </div>
                        );
                     })}
                   </div>
                </div>
                <button 
                  onClick={() => setShowTemplateShelf(false)} 
                  className="w-full py-6 rounded-[2.5rem] bg-amber-100/30 border border-dashed border-amber-200 text-amber-700 font-black text-xs uppercase tracking-widest hover:bg-amber-100 transition-all"
                >
                  ফিরে যাও (লাইব্রেরি বন্ধ করো)
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="routine"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Progress Card */}
                <div className="p-8 rounded-[3rem] bg-white border border-emerald-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500 border border-emerald-100 shadow-inner">
                        <Target size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">
                          {activeName} প্রগ্রেস
                        </h3>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                          {completedCount} OF {totalCount} TASKS COMPLETED
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-emerald-500 leading-none">
                        {completionRate}%
                      </p>
                      <p className="text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.2em] mt-1">
                        SUCCESS RATE
                      </p>
                    </div>
                  </div>

                  <div className="relative h-4 w-full bg-emerald-50 rounded-full border border-emerald-100 shadow-inner overflow-hidden p-1">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Add Task Form (Expanded) */}
                <AnimatePresence>
                  {showAdd && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, scale: 0.95 }}
                      animate={{ height: "auto", opacity: 1, scale: 1 }}
                      exit={{ height: 0, opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="overflow-hidden"
                    >
                      {/* ... rest of the Add Task Form ... same as before */}
                <div className="p-8 rounded-[3rem] bg-emerald-50 border border-emerald-200 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                      <Plus className="text-emerald-500" /> নতুন টাস্ক যোগ করো
                    </h3>
                    <div className="p-2 bg-white rounded-xl text-emerald-900/20">
                      <Settings size={16} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">
                        সময় নির্ধারণ (ঐচ্ছিক)
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400">
                          <Clock size={16} />
                        </div>
                        <input
                          type="time"
                          className="w-full bg-white rounded-2xl px-12 py-4 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-950"
                          value={newTask.time}
                          onChange={(e) =>
                            setNewTask({ ...newTask, time: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">
                        টাস্কের নাম
                      </label>
                      <input
                        type="text"
                        placeholder="কি অর্জন করতে চাও আজ?"
                        className="w-full bg-white rounded-2xl px-6 py-4 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-950"
                        value={newTask.task}
                        onChange={(e) =>
                          setNewTask({ ...newTask, task: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-emerald-100 flex-wrap">
                      {[
                        "Discipline",
                        "Study",
                        "Health",
                        "Mindfulness",
                        "Ibadat",
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setNewTask({ ...newTask, category: cat })
                          }
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newTask.category === cat ? "bg-emerald-500 text-white shadow-md" : "text-emerald-900/40 hover:text-emerald-600"}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={addTask}
                      className="px-10 py-4 bg-emerald-600 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-3"
                    >
                      <Check size={18} /> রুটিন আপডেট করো
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Task List Grid */}
          <div className="space-y-4">
            {routine?.tasks?.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={routine.tasks.map((t, i) => t._id || `task-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {routine.tasks.map((task, i) => {
                    const meta =
                      categoryMeta[task.category] || categoryMeta.Other;
                    return (
                      <SortableTask
                        key={task._id || i}
                        id={task._id || `task-${i}`}
                        task={task}
                        index={i}
                        toggleTask={toggleTask}
                        deleteTask={deleteTask}
                        meta={meta}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            ) : (
              <EmptyState type="routine" onAction={() => setShowAdd(true)} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>

        {/* 📋 Sidebar: Deep View & Templates */}
        <div className="xl:col-span-4 space-y-8">
          {/* Routine Summary Mini-Chart */}
          <div className="p-8 rounded-[3rem] bg-white border border-emerald-100 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">
              CATEGORICAL LOAD
            </h4>
            <div className="space-y-4">
              {["Discipline", "Study", "Health", "Mindfulness", "Ibadat"].map(
                (cat) => {
                  const count =
                    routine?.tasks?.filter((t) => t.category === cat).length ||
                    0;
                  const meta = categoryMeta[cat] || categoryMeta.Other;
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black">
                        <span className="flex items-center gap-2 text-emerald-950 uppercase">
                          {meta.icon} {cat}
                        </span>
                        <span className="text-emerald-400">{count} Tasks</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden p-[2px]">
                        <div
                          className={`h-full rounded-full ${meta.color.split(" ")[1]}`}
                          style={{
                            width: `${totalCount ? (count / totalCount) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* Motivational Quote for Routine */}
          <div className="p-8 rounded-[3rem] bg-emerald-950 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full -mr-16 -mt-16 blur-xl" />
            <div className="relative z-10 space-y-4">
              <div className="p-2 bg-white/10 rounded-xl w-max border border-white/10">
                <Zap size={20} className="text-emerald-400" />
              </div>
              <p className="text-lg font-black leading-tight tracking-tight italic">
                "যে তার সকালের নিয়ন্ত্রণ হারিয়ে ফেলে, সে তার পুরো জীবনের
                নিয়ন্ত্রণ হারায়।"
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                  WARRIOR CODE
                </span>
                <button className="text-[9px] font-black uppercase tracking-widest hover:text-emerald-400 transition-colors">
                  READ MORE
                </button>
              </div>
            </div>
          </div>

          {/* Today's Task Breakdown - Real Data */}
          <div className="p-8 rounded-[3rem] bg-white border border-emerald-100 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">
              আজকের রিয়েল ব্রেকডাউন
            </h4>
            <div className="space-y-5">
              {/* Completion Rate Visual */}
              <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                    TODAY'S SCORE
                  </p>
                  <p className="text-3xl font-black text-emerald-950 leading-none">
                    {completedCount}
                    <span className="text-base text-emerald-400">
                      /{totalCount}
                    </span>
                  </p>
                  <p className="text-[9px] font-bold text-emerald-400/60 uppercase tracking-widest mt-1">
                    Tasks Done
                  </p>
                </div>
                <div className="w-20 h-20 relative flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="#ecfdf5"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray={`${completionRate} ${100 - completionRate}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-sm font-black text-emerald-600">
                    {completionRate}%
                  </span>
                </div>
              </div>

              {/* Pending tasks count */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-amber-700">
                    {totalCount - completedCount} টি টাস্ক বাকি
                  </p>
                  <p className="text-[9px] font-bold text-amber-500/60 uppercase tracking-widest">
                    Remaining Today
                  </p>
                </div>
              </div>

              {/* Routine name tag */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Layers size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-700">
                    {activeName} রুটিন
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Active Module
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ Modals section removed and replaced with inline shelves for better UX */}

      {/* New Routine Modal */}
      <AnimatePresence>
        {showNewRoutineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-start p-6 bg-emerald-950/40 backdrop-blur-sm sm:pt-20"
            onClick={() => setShowNewRoutineModal(false)}
          >
            <motion.div
              initial={{ y: "-50%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-50%", opacity: 0 }}
              className="w-full max-w-md bg-white rounded-[3rem] p-8 sm:p-10 shadow-2xl border border-emerald-50 space-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-50 rounded-[1.8rem] flex items-center justify-center text-emerald-500 mx-auto shadow-inner border border-emerald-100">
                  <Layers size={32} />
                </div>
                <h3 className="text-2xl font-black text-emerald-950">
                  নতুন রুটিন মডিউল
                </h3>
                <p className="text-xs font-bold text-emerald-900/30 px-8">
                  যেমন: Morning Routine, Exam Routine, বা Weekend Routine
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-4 pt-4 border-t border-emerald-50">
                  <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest text-center">
                    দ্রুত সাজেশন
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["Ramadan", "Morning", "Study Focus", "Weekend"].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setNewRoutineName(s);
                        }}
                        className="px-4 py-2 bg-emerald-50 text-[10px] font-black text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all uppercase tracking-widest border border-emerald-100"
                      >
                        {s === "Ramadan" ? "🌙 Ramadan" : s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">
                    রুটিনের নাম
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: Work Focus"
                      className="w-full bg-emerald-50/50 rounded-2xl px-6 py-4 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-950"
                      value={newRoutineName}
                      onChange={(e) => setNewRoutineName(e.target.value)}
                    />
                    {newRoutineName === "Ramadan" && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-pulse">
                        <Moon size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowNewRoutineModal(false)}
                  className="flex-1 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-emerald-900/40 hover:bg-gray-50 transition-all"
                >
                  বাতিল
                </button>
                <button
                  onClick={createNewRoutine}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all"
                >
                  তৈরি করো
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ Routine Change Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-start p-6 bg-emerald-950/40 backdrop-blur-sm sm:pt-24"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ y: "-50%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-50%", opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl border border-emerald-50 space-y-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto border border-amber-100">
                <Settings size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-emerald-950">
                  রুটিন পরিবর্তন?
                </h3>
                <p className="text-xs font-bold text-emerald-900/40">
                  আপনি কি নিশ্চিতভাবে{" "}
                  <span className="text-emerald-600">"{pendingRoutine}"</span>{" "}
                  রুটিনে সুইচ করতে চান?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-emerald-900/40 hover:bg-gray-50 transition-all"
                >
                  না, থাক
                </button>
                <button
                  onClick={confirmRoutineSwitch}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  হ্যাঁ, নিশ্চিত
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Routine;
