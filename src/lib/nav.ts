import {
  LayoutDashboard, Briefcase, GraduationCap, BookOpen, Workflow, LifeBuoy,
  ClipboardList, CalendarDays, Users, Megaphone, HelpCircle, Settings, Shield,
} from "lucide-react";

export type NavItem = { title: string; url: string; icon: typeof LayoutDashboard };

export const mainNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Workspace", url: "/workspace", icon: Briefcase },
  { title: "Learning Center", url: "/learning", icon: GraduationCap },
  { title: "Knowledge Base", url: "/knowledge", icon: BookOpen },
  { title: "Process Library", url: "/processes", icon: Workflow },
  { title: "Support Center", url: "/support", icon: LifeBuoy },
  { title: "Service Requests", url: "/service-requests", icon: ClipboardList },
  { title: "Book a Meeting", url: "/meetings", icon: CalendarDays },
  { title: "Team Directory", url: "/team", icon: Users },
  { title: "Announcements", url: "/announcements", icon: Megaphone },
  { title: "FAQs", url: "/faqs", icon: HelpCircle },
];

export const footerNav: NavItem[] = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Admin Panel", url: "/admin", icon: Shield },
];
