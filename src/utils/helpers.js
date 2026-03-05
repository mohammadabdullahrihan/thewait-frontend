import {
  format,
  parseISO,
  startOfWeek,
  addDays,
  differenceInDays,
} from "date-fns";

export const todayStr = () => format(new Date(), "yyyy-MM-dd");
export const formatDate = (d) => format(parseISO(d), "dd MMM yyyy");
export const formatBanglaDate = (d) => {
  const date = parseISO(d);
  const days = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];
  return `${days[date.getDay()]}, ${format(date, "dd MMM yyyy")}`;
};

export const getWeekDates = (startDate) => {
  const start = startOfWeek(parseISO(startDate), { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) =>
    format(addDays(start, i), "yyyy-MM-dd"),
  );
};

export const daysUntil = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  return differenceInDays(target, today);
};

export const xpToNextLevel = (xp) => {
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXp = (level - 1) * 100;
  const progress = xp - currentLevelXp;
  return { level, progress, needed: 100, percentage: Math.min(100, progress) };
};

export const getHabitEmoji = (key) => {
  const map = {
    wakeUp6am: "AlarmClock",
    workout: "Dumbbell",
    study: "Book",
    noFap: "Shield",
    noCartoon: "MonitorOff",
    sleep10pm: "Moon",
    journal: "Scroll",
  };
  return map[key] || "Check";
};

export const getHabitName = (key) => {
  const map = {
    wakeUp6am: "সকাল ৬টায় ওঠা",
    workout: "ওয়ার্কআউট",
    study: "পড়াশোনা",
    noFap: "নো ফ্যাপ",
    noCartoon: "নো কার্টুন",
    sleep10pm: "রাত ১০টায় ঘুম",
    journal: "ডায়েরি লেখা",
  };
  return map[key] || key;
};

export const moodLabel = (score) => {
  if (score <= 2) return { label: "খুব খারাপ", icon: "Frown" };
  if (score <= 4) return { label: "খারাপ", icon: "Meh" };
  if (score <= 6) return { label: "ঠিকঠাক", icon: "Smile" };
  if (score <= 8) return { label: "ভালো", icon: "Laugh" };
  return { label: "দারুণ!", icon: "Flame" };
};

export const getMilestones = () => [
  {
    phase: "Phase 1",
    title: "SSC Preparation",
    start: "Apr 2025",
    end: "Sep 2025",
    status: "active",
    tasks: ["সিলেবাস কমপ্লিট", "প্র্যাকটিস পেপার", "মক টেস্ট"],
  },
  {
    phase: "Phase 2",
    title: "GED Preparation",
    start: "Oct 2025",
    end: "Mar 2026",
    status: "upcoming",
    tasks: ["Math", "Science", "Social Studies", "Language Arts"],
  },
  {
    phase: "Phase 3",
    title: "IELTS Preparation",
    start: "Apr 2026",
    end: "Sep 2026",
    status: "upcoming",
    tasks: ["Listening", "Reading", "Writing", "Speaking"],
  },
  {
    phase: "Phase 4",
    title: "University Application",
    start: "Oct 2026",
    end: "Dec 2026",
    status: "upcoming",
    tasks: ["SOP লেখা", "রেকমেন্ডেশন লেটার", "Application Submit"],
  },
  {
    phase: "Phase 5",
    title: "Visa Process",
    start: "Jan 2027",
    end: "Feb 2027",
    status: "upcoming",
    tasks: ["ডকুমেন্টস সংগ্রহ", "Visa Apply", "Interview"],
  },
  {
    phase: "Phase 6",
    title: "Journey to EU",
    start: "Mar 2027",
    end: "",
    status: "upcoming",
    tasks: ["নতুন জীবনের শুরু"],
  },
];

export const dailyQuotes = [
  {
    text: "শৃঙ্খলা স্বাধীনতার পথ। তুমি যত বেশি নিয়মানুবর্তী হবে, তত বেশি স্বাধীন হবে।",
    author: "Jocko Willink",
  },
  {
    text: "সফলতা হলো প্রতিদিন ছোট ছোট প্রচেষ্টার সমষ্টি।",
    author: "Robert Collier",
  },
  {
    text: "তুমি যা হতে চাও, তার জন্য প্রতিদিন একটু একটু করে কাজ করো।",
    author: "Anonymous",
  },
  {
    text: "কষ্ট ছাড়া অর্জন নেই। আজকের ব্যথা আগামীকালের শক্তি।",
    author: "The Wait",
  },
  {
    text: "যে ব্যক্তি আজ কষ্ট করে, সে আগামীকাল গল্প বলে।",
    author: "Bengali Wisdom",
  },
  {
    text: "এক হাজার মাইলের যাত্রা শুরু হয় একটি পদক্ষেপ দিয়ে।",
    author: "Lao Tzu",
  },
  {
    text: "তোমার স্বপ্ন কেউ দেখে না, কিন্তু তোমার পরিশ্রম সবাই দেখে।",
    author: "The Wait",
  },
];

export const getTodayQuote = () => {
  const idx = new Date().getDate() % dailyQuotes.length;
  return dailyQuotes[idx];
};
