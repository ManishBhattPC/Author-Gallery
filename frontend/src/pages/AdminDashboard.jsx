import React, { useEffect, useState, useMemo } from "react";
import { 
  getAdminDashboardData, 
  deleteBookByAdmin, 
  deleteAuthorByAdmin, 
  dismissReportByAdmin, 
  deleteReviewByAdmin 
} from "../services/adminService.js";
import { 
  BookOpen, 
  Users, 
  AlertTriangle, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  ExternalLink,
  Shield,
  Loader,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Menu,
  Settings,
  LogOut,
  DollarSign,
  Activity,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  BarChart2,
  CreditCard,
  ShoppingBag,
  Info,
  Sliders,
  Calendar,
  TrendingUp,
  UserCheck,
  MoreVertical,
  SlidersHorizontal,
  ChevronUp
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Platform & API States
  const [data, setData] = useState({ books: [], authors: [], reports: [], reviews: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // UI Panel Layouts
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, users, authors, books, categories, reports, reviews, analytics, payments, settings
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  
  // Table Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [roleFilter, setRoleFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Mock Notification logs
  const [notificationLogs, setNotificationLogs] = useState([
    { id: 1, text: "Yash Bhatt published a new book 'wefbkjasbfwef'", time: "5 mins ago", read: false },
    { id: 2, text: "Review report filed on 'Hey' by Yashuu", time: "1 hour ago", read: false },
    { id: 3, text: "System security status verified at 100%", time: "3 hours ago", read: true },
    { id: 4, text: "Weekly platform database backup completed successfully", time: "12 hours ago", read: true },
  ]);

  // Mock Settings Config State
  const [settingsConfig, setSettingsConfig] = useState({
    maintenanceMode: false,
    autoModeration: true,
    allowRegistration: true,
    stripeLiveMode: false,
    announcementText: "System upgrade scheduled for Sunday, July 5th at 02:00 UTC.",
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminDashboardData();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // Moderator CRUD Functions
  const handleDeleteBook = (bookId) => {
    setConfirmModal({
      title: "Purge eBook Listing",
      message: "Are you sure you want to delete this book? This will permanently delete its Cloudinary assets (Cover & PDF), along with associated reviews and reports.",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteBookByAdmin(bookId);
          triggerToast("Book and Cloudinary assets successfully purged", "success");
          loadDashboardData();
        } catch (err) {
          triggerToast("Failed to delete book", "error");
        }
        setConfirmModal(null);
      }
    });
  };

  const handleDeleteAuthor = (authorId) => {
    setConfirmModal({
      title: "Block User Account",
      message: "Are you sure you want to block/delete this user? All books, reviews, and profile documents will be purged.",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteAuthorByAdmin(authorId);
          triggerToast("Author account blocked and data deleted successfully", "success");
          loadDashboardData();
        } catch (err) {
          triggerToast("Failed to delete author", "error");
        }
        setConfirmModal(null);
      }
    });
  };

  const handleDismissReport = async (reportId) => {
    try {
      await dismissReportByAdmin(reportId);
      triggerToast("Report dismissed successfully", "success");
      loadDashboardData();
    } catch (err) {
      triggerToast("Failed to dismiss report", "error");
    }
  };

  const handleDeleteReview = (reviewId) => {
    setConfirmModal({
      title: "Delete Review Comment",
      message: "Are you sure you want to delete this review comment?",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteReviewByAdmin(reviewId);
          triggerToast("Review comment successfully deleted", "success");
          loadDashboardData();
        } catch (err) {
          triggerToast("Failed to delete review", "error");
        }
        setConfirmModal(null);
      }
    });
  };

  const handleLogout = () => {
    setConfirmModal({
      title: "Confirm Admin Logout",
      message: "Log out from the admin moderation center?",
      type: "warning",
      onConfirm: async () => {
        try {
          await logout();
          navigate("/login");
        } catch (err) {
          triggerToast("Logout failed", "error");
        }
        setConfirmModal(null);
      }
    });
  };

  // Mock quick action toggles
  const handleToggleSetting = (field) => {
    setSettingsConfig(prev => {
      const next = { ...prev, [field]: !prev[field] };
      triggerToast(`${field.replace(/([A-Z])/g, ' $1')} updated successfully`, "success");
      return next;
    });
  };

  // Extract unique genres for filtration
  const allGenres = useMemo(() => {
    const genres = new Set();
    data.books?.forEach(b => {
      b.genres?.forEach(g => genres.add(g));
    });
    return Array.from(genres);
  }, [data.books]);

  // Derived KPI Calculations
  const kpiData = useMemo(() => {
    const totalUsers = data.authors?.length || 0;
    const authorsCount = data.authors?.filter(u => u.works > 0 || u.role === "author").length || 0;
    const publishedBooks = data.books?.length || 0;
    const pendingReports = data.reports?.filter(r => r.status === "pending").length || 0;
    
    // Calculated mock finance values
    const mockRevenue = publishedBooks * 850 + totalUsers * 120;
    const mockMonthlySales = Math.floor(publishedBooks * 1.5 + totalUsers * 0.4);

    return [
      { id: "users", label: "Total Users", value: totalUsers + 120, change: "+14.3%", trend: "up", icon: <Users className="w-5 h-5 text-blue-400" /> },
      { id: "authors", label: "Active Authors", value: authorsCount + 15, change: "+8.7%", trend: "up", icon: <UserCheck className="w-5 h-5 text-emerald-400" /> },
      { id: "books", label: "Published Books", value: publishedBooks, change: `+${publishedBooks > 0 ? 1 : 0} today`, trend: "up", icon: <BookOpen className="w-5 h-5 text-amber-400" /> },
      { id: "reports", label: "Pending Reports", value: pendingReports, change: pendingReports > 0 ? "Needs Review" : "Healthy", trend: pendingReports > 0 ? "down" : "up", icon: <AlertTriangle className="w-5 h-5 text-red-400" /> },
      { id: "revenue", label: "Total Revenue", value: `₹${mockRevenue}`, change: "+22.4%", trend: "up", icon: <DollarSign className="w-5 h-5 text-emerald-400" /> },
      { id: "sales", label: "Monthly Sales", value: `${mockMonthlySales} Books`, change: "+14.1%", trend: "up", icon: <ShoppingBag className="w-5 h-5 text-indigo-400" /> },
      { id: "newReg", label: "New Registrations", value: 38, change: "+5.3%", trend: "up", icon: <Activity className="w-5 h-5 text-cyan-400" /> },
      { id: "growth", label: "Platform Growth", value: "+18.4%", change: "Steady", trend: "up", icon: <TrendingUp className="w-5 h-5 text-amber-400" /> },
    ];
  }, [data]);

  // Filters / Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAuthors = useMemo(() => {
    let list = [...data.authors];
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
    }
    
    // Role filter
    if (roleFilter !== "all") {
      list = list.filter(a => a.role === roleFilter);
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";
      
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [data.authors, searchQuery, roleFilter, sortField, sortOrder]);

  const paginatedAuthors = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAuthors.slice(start, start + rowsPerPage);
  }, [filteredAuthors, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredAuthors.length / rowsPerPage);

  // Custom SVG Chart Generators (Guarantees zero package build dependency issues)
  const drawLineChart = () => {
    const points = [[20, 160], [70, 140], [120, 150], [170, 90], [220, 110], [270, 40], [320, 70], [370, 20]];
    const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
    const areaD = `${pathD} L 370 180 L 20 180 Z`;
    
    return (
      <svg className="w-full h-44 mt-3" viewBox="0 0 400 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d87f4a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d87f4a" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        <line x1="20" y1="20" x2="370" y2="20" stroke="#27272a" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="20" y1="70" x2="370" y2="70" stroke="#27272a" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="20" y1="120" x2="370" y2="120" stroke="#27272a" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="20" y1="170" x2="370" y2="170" stroke="#3f3f46" strokeWidth="1" />
        
        {/* Glow Line */}
        <path d={pathD} fill="none" stroke="#d87f4a" strokeWidth="3" filter="drop-shadow(0px 4px 6px rgba(216,127,74,0.4))" />
        <path d={areaD} fill="url(#chartGradient)" />
        
        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#18181b" stroke="#d87f4a" strokeWidth="2.5" className="transition-all duration-300 hover:r-6 cursor-pointer" />
        ))}
      </svg>
    );
  };

  const drawBarChart = () => {
    const barValues = [35, 55, 45, 80, 65, 95, 85, 110, 75, 90];
    const maxVal = 120;
    const chartHeight = 150;
    
    return (
      <svg className="w-full h-44 mt-3" viewBox="0 0 400 180" preserveAspectRatio="none">
        <line x1="20" y1="20" x2="380" y2="20" stroke="#27272a" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="20" y1="75" x2="380" y2="75" stroke="#27272a" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="20" y1="130" x2="380" y2="130" stroke="#27272a" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="20" y1="160" x2="380" y2="160" stroke="#3f3f46" strokeWidth="1" />
        
        {barValues.map((val, idx) => {
          const barHeight = (val / maxVal) * chartHeight;
          const x = 30 + idx * 35;
          const y = 160 - barHeight;
          return (
            <g key={idx} className="group">
              <rect
                x={x}
                y={y}
                width="16"
                height={barHeight}
                fill="#3B82F6"
                rx="3"
                opacity="0.8"
                className="transition-all duration-300 hover:opacity-100 hover:fill-[#60A5FA] cursor-pointer"
              />
              {/* Tooltip on hover */}
              <text x={x + 8} y={y - 5} fill="#a1a1aa" fontSize="8" textAnchor="middle" className="opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                {val}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const drawPieChart = () => {
    // 4 Slices representing genre distribution: Fiction, Thriller, Poetry, Other
    // radius = 50, center = (100, 100)
    return (
      <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="70" fill="none" stroke="#27272a" strokeWidth="20" />
        {/* Simulated glow donut rings */}
        <circle cx="100" cy="100" r="70" fill="none" stroke="#d87f4a" strokeWidth="20" strokeDasharray="130 440" strokeDashoffset="0" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="110 440" strokeDashoffset="-135" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="90 440" strokeDashoffset="-250" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#a78bfa" strokeWidth="20" strokeDasharray="80 440" strokeDashoffset="-345" />
        
        <text x="100" y="105" fill="#ffffff" textAnchor="middle" className="font-serif font-bold text-sm">
          Genres
        </text>
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex flex-col items-center justify-center py-20 text-zinc-100">
        <Loader className="w-12 h-12 text-[#d87f4a] animate-spin mb-4" />
        <h3 className="font-serif font-bold text-xl text-zinc-100">Synchronizing Dashboard</h3>
        <p className="text-sm text-zinc-400 mt-1.5">Fetching publication logs & accounts...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container min-h-screen flex text-zinc-100 font-sans">
      
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
        />
      )}

      {/* 1. COLLAPSIBLE LEFT SIDEBAR */}
      <aside className={`admin-sidebar shrink-0 p-4 transition-all duration-300 flex flex-col justify-between
        fixed md:relative inset-y-0 left-0 z-[100] bg-[#0B0B0D] md:bg-transparent
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
        ${isSidebarCollapsed ? "md:w-20" : "md:w-64"}
      `}>
        <div className="space-y-8">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between px-2 py-3 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d87f4a] to-[#a05a3a] flex items-center justify-center text-white font-serif font-black text-xl shadow-lg shrink-0">
                AG
              </div>
              {!isSidebarCollapsed && (
                <div className="text-left leading-none">
                  <h1 className="font-serif font-black text-base tracking-wide text-white">Author Gallery</h1>
                  <span className="text-[10px] uppercase tracking-widest text-[#d87f4a] font-bold">Admin Portal</span>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 border border-zinc-800 hover:bg-zinc-800 rounded-lg md:hidden text-zinc-400 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Navigation Links list */}
          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "Dashboard", icon: <BarChart2 size={18} /> },
              { id: "users", label: "Users List", icon: <Users size={18} /> },
              { id: "books", label: "Books Catalog", icon: <BookOpen size={18} /> },
              { id: "reports", label: "Content Reports", icon: <AlertTriangle size={18} />, badge: data.reports?.filter(r => r.status === "pending").length },
              { id: "reviews", label: "User Reviews", icon: <MessageSquare size={18} /> },
              { id: "payments", label: "Payments / Orders", icon: <CreditCard size={18} /> },
              { id: "super-admin", label: "Super Admin", icon: <Shield size={18} /> },
              { id: "settings", label: "Portal Settings", icon: <Settings size={18} /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchQuery("");
                  setCurrentPage(1);
                  setIsMobileMenuOpen(false); // Close mobile drawer
                }}
                className={`admin-sidebar-item ${activeTab === item.id ? "active" : ""}`}
                title={item.label}
              >
                {item.icon}
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                {!isSidebarCollapsed && item.badge > 0 && (
                  <span className="ml-auto bg-rose-500/20 border border-rose-500/30 text-rose-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="space-y-2">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center p-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition cursor-pointer"
            title="Expand/Collapse Sidebar"
          >
            <SlidersHorizontal size={16} />
          </button>
          
          <button
            onClick={handleLogout}
            className="admin-sidebar-item hover:text-red-400 hover:bg-red-950/15"
            title="Log Out"
          >
            <LogOut size={18} className="text-red-400" />
            {!isSidebarCollapsed && <span className="text-red-400">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Sticky Top Navigation Bar */}
        <header className="sticky top-0 bg-[#0B0B0D]/85 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-40 gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 border border-zinc-800 hover:bg-zinc-900 rounded-xl md:hidden cursor-pointer text-zinc-400 hover:text-white"
            >
              <Menu size={18} />
            </button>
            
            {/* Breadcrumb Navigation */}
            <div className="text-left hidden sm:block">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Moderation Desk</div>
              <div className="text-xs text-zinc-300 font-semibold flex items-center gap-1.5">
                <Shield size={12} className="text-[#d87f4a]" />
                <span>Admin</span>
                <span className="text-zinc-600">/</span>
                <span className="capitalize text-zinc-100">{activeTab}</span>
              </div>
            </div>
          </div>

          {/* Search and Action items */}
          <div className="flex items-center gap-4">
            
            {/* Global Search Bar (Only render on searchable tabs) */}
            {["users", "books", "reports", "reviews", "payments"].includes(activeTab) ? (
              <div className="relative max-w-xs w-48 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-pulse" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === "users" ? "members" : activeTab.replace("-", " ")}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-input text-xs focus:ring-1 focus:ring-[#d87f4a]/50"
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 bg-zinc-900/35 border border-zinc-800/80 px-3.5 py-1.5 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Workspace Synced</span>
              </div>
            )}

            {/* Quick action button */}
            <button
              onClick={() => setShowQuickActionModal(true)}
              className="bg-gradient-to-r from-[#d87f4a] to-[#a05a3a] hover:from-[#c26e3d] hover:to-[#8c4e35] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer transition active:scale-[0.98] hidden sm:block"
            >
              System Controls
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-850 hover:text-white text-zinc-400 cursor-pointer relative"
              >
                <Bell size={16} />
                {notificationLogs.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-[#0B0B0D] shadow-sm animate-pulse" />
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-[calc(100vw-32px)] sm:w-80 max-w-sm bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 text-left">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5 mb-2.5">
                    <span className="text-xs font-bold text-zinc-300">Live Activity Feed</span>
                    {notificationLogs.length > 0 && (
                      <button 
                        onClick={() => {
                          setNotificationLogs([]);
                          triggerToast("All notifications cleared", "success");
                        }} 
                        className="text-[10px] text-[#d87f4a] font-bold hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto admin-scroll">
                    {notificationLogs.length === 0 ? (
                      <div className="text-center py-8 text-zinc-500 text-xs font-sans font-medium">
                        No new notifications
                      </div>
                    ) : (
                      notificationLogs.map(log => (
                        <div 
                          key={log.id} 
                          className={`p-2.5 rounded-xl text-[11px] leading-relaxed transition relative group flex justify-between gap-2 items-start ${
                            log.read 
                              ? "text-zinc-400 hover:bg-zinc-900/20" 
                              : "bg-[#d87f4a]/5 border border-[#d87f4a]/10 text-zinc-200"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="break-words pr-4 text-xs font-medium">{log.text}</p>
                            <span className="text-[9px] text-zinc-500 mt-1 block">{log.time}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotificationLogs(prev => prev.filter(n => n.id !== log.id));
                              triggerToast("Notification cleared", "success");
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 rounded-lg cursor-pointer transition-all duration-155 absolute top-2 right-2"
                            title="Dismiss notification"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 rounded-xl hover:bg-zinc-850 cursor-pointer transition select-none"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-rose-700 flex items-center justify-center text-xs font-serif font-black text-white">
                  SA
                </div>
                <span className="text-xs font-semibold text-zinc-200 hidden sm:inline">Super Admin</span>
                <ChevronDown size={14} className="text-zinc-500" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-left">
                  <div className="p-3 bg-zinc-900/40 border-b border-zinc-800">
                    <span className="text-xs font-bold block text-zinc-200">Moderator Account</span>
                    <span className="text-[10px] text-zinc-500">admin@authorgallery.com</span>
                  </div>
                  <div className="p-1.5 space-y-1">
                    <button onClick={() => { setActiveTab("super-admin"); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg cursor-pointer transition flex items-center gap-2">
                      <Shield size={13} /> Super Admin Page
                    </button>
                    <button onClick={() => { setActiveTab("settings"); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg cursor-pointer transition flex items-center gap-2">
                      <Settings size={13} /> Portal Settings
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 rounded-lg cursor-pointer transition flex items-center gap-2">
                      <LogOut size={13} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Toast Alerts System */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-[99999] admin-toast flex items-center gap-2 px-5 py-3.5 rounded-2xl">
            <CheckCircle className={`w-4 h-4 ${toast.type === "success" ? "text-emerald-500" : "text-rose-500"}`} />
            <span className="text-xs font-bold text-zinc-200">{toast.message}</span>
          </div>
        )}

        {/* 3. SCROLLABLE WORKSPACE WINDOW */}
        <div className="flex-grow overflow-y-auto px-6 py-8 space-y-8 admin-scroll">
          
          {/* A. OVERVIEW PANEL (DASHBOARD) */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              
              {/* 8 KPI CARDS CONTAINER */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiData.map((kpi) => (
                  <div key={kpi.id} className="admin-glass-card p-5 flex flex-col justify-between text-left space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{kpi.label}</span>
                      <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800">
                        {kpi.icon}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-serif font-bold text-white leading-none">{kpi.value}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        <span className={kpi.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                          {kpi.change}
                        </span>
                        <span className="text-zinc-500">vs last month</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ANALYTICS CHARTS VIEW */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User Growth Line Chart */}
                <div className="admin-glass-card p-5 text-left flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-300">User Registrations</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Active growth cycle this week</p>
                  </div>
                  {drawLineChart()}
                </div>

                {/* Book Uploads Bar Chart */}
                <div className="admin-glass-card p-5 text-left flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-300">Weekly Book Uploads</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Submissions statistics chart</p>
                  </div>
                  {drawBarChart()}
                </div>

                {/* Genre Pie Chart */}
                <div className="admin-glass-card p-5 text-left flex flex-col justify-between md:col-span-2 lg:col-span-1">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-300">Category Share</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Top performing book genres</p>
                  </div>
                  <div className="py-4">
                    {drawPieChart()}
                  </div>
                </div>
              </div>

              {/* TRANSACTION / ACTIVITY MIXED FEED */}
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Recent transaction log */}
                <div className="admin-glass-card p-6 text-left">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                    <h4 className="text-sm font-bold text-zinc-300">Recent Transactions</h4>
                    <button onClick={() => setActiveTab("payments")} className="text-xs text-[#d87f4a] font-bold hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { tx: "TXN-827419", user: "Yashu Bhatt", date: "June 25, 2026", amt: "₹499.00", status: "succeeded" },
                      { tx: "TXN-827392", user: "Raj Kumar", date: "June 24, 2026", amt: "₹1,200.00", status: "succeeded" },
                      { tx: "TXN-827310", user: "Aisha Sen", date: "June 24, 2026", amt: "₹350.00", status: "failed" },
                      { tx: "TXN-827299", user: "Nikhil Joshi", date: "June 23, 2026", amt: "₹750.00", status: "succeeded" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <span className="text-xs font-serif font-bold text-zinc-200 block">{item.tx}</span>
                          <span className="text-[10px] text-zinc-500">{item.user} • {item.date}</span>
                        </div>
                        <div className="text-right space-y-1.5">
                          <span className="text-xs font-bold block text-zinc-100">{item.amt}</span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${item.status === "succeeded" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" : "bg-rose-950/40 text-rose-400 border border-rose-900/30"}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending requests overview */}
                <div className="admin-glass-card p-6 text-left">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                    <h4 className="text-sm font-bold text-zinc-300">Pending Moderator Requests</h4>
                    <button onClick={() => setActiveTab("reports")} className="text-xs text-[#d87f4a] font-bold hover:underline">Manage</button>
                  </div>
                  {data.reports?.filter(r => r.status === "pending").length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 space-y-2">
                      <CheckCircle className="w-8 h-8 mx-auto text-emerald-500" />
                      <p className="text-xs font-bold">Workspace clean! No reports pending review.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {data.reports?.filter(r => r.status === "pending").slice(0, 3).map((rep) => (
                        <div key={rep._id} className="p-3 bg-zinc-900/35 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <span className="inline-block bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                              {rep.reason}
                            </span>
                            <p className="text-xs text-zinc-200 font-semibold truncate">
                              Target: {rep.book?.title || rep.author?.name || "General Message"}
                            </p>
                          </div>
                          <button
                            onClick={() => { setActiveTab("reports"); setSearchQuery(rep.book?.title || rep.author?.name || ""); }}
                            className="p-2 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-lg transition shrink-0 cursor-pointer"
                            title="Inspect Report details"
                          >
                            <ExternalLink size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* B. USERS / AUTHORS MANAGEMENT PANEL */}
          {activeTab === "users" && (
            <div className="admin-glass-card p-6 text-left animate-fade-in space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-4 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-200">System Members</h3>
                  <p className="text-xs text-zinc-500">Filter, edit, and moderate registered accounts</p>
                </div>
                
                {/* Filtration Toolbar */}
                <div className="flex gap-2">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <select
                      value={roleFilter}
                      onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                      className="admin-input pl-8 py-1.5 text-xs w-36 bg-zinc-950/80 border-zinc-800/80"
                    >
                      <option value="all">All Roles</option>
                      <option value="author">Authors Only</option>
                      <option value="user">Readers Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              {filteredAuthors.length === 0 ? (
                <p className="text-center text-zinc-500 py-16 text-sm">No registered users match your search query.</p>
              ) : (
                <div className="overflow-x-auto admin-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th className="cursor-pointer hover:text-zinc-200" onClick={() => handleSort("name")}>User Detail</th>
                        <th className="cursor-pointer hover:text-zinc-200 text-center" onClick={() => handleSort("role")}>Role</th>
                        <th className="cursor-pointer hover:text-zinc-200 text-center" onClick={() => handleSort("works")}>Publications</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAuthors.map((author) => {
                        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=8C4E35&color=FAF6F0&bold=true`;
                        const isAuthor = author.role === "author" || author.works > 0;
                        
                        return (
                          <tr key={author._id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <img
                                  src={author.profileImage || fallbackAvatar}
                                  alt={author.name}
                                  onError={(e) => { e.currentTarget.src = fallbackAvatar; e.currentTarget.onerror = null; }}
                                  className="w-9 h-9 rounded-full object-cover border border-zinc-800"
                                />
                                <div className="text-left">
                                  <span className="font-semibold text-zinc-200 block text-sm">{author.name}</span>
                                  <span className="text-xs text-zinc-500">{author.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${isAuthor ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/30" : "bg-zinc-800 text-zinc-400 border-zinc-700/60"}`}>
                                {author.role}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="text-sm font-semibold text-zinc-300">{author.works || 0} books</span>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setPreviewItem({ type: "author", data: author })}
                                  className="p-1.5 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
                                  title="Inspect Account Profile"
                                >
                                  <ExternalLink size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteAuthor(author._id)}
                                  className="p-1.5 border border-zinc-850 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-500 rounded-lg transition cursor-pointer"
                                  title="Block/Delete Account"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-zinc-800 pt-5">
                  <span className="text-xs text-zinc-500">
                    Showing page <span className="font-bold text-zinc-300">{currentPage}</span> of {totalPages} ({filteredAuthors.length} total)
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-zinc-800 rounded-xl text-zinc-400 disabled:opacity-30 cursor-pointer hover:bg-zinc-900 transition"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-zinc-800 rounded-xl text-zinc-400 disabled:opacity-30 cursor-pointer hover:bg-zinc-900 transition"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* C. BOOKS CATALOG PANEL */}
          {activeTab === "books" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="admin-glass-card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-200">Catalog Registry</h3>
                    <p className="text-xs text-zinc-500">Inspect, delete, and moderate published eBooks</p>
                  </div>
                  
                  {/* Genre Filter toolbar */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <select
                      value={genreFilter}
                      onChange={(e) => setGenreFilter(e.target.value)}
                      className="admin-input pl-8 py-1.5 text-xs w-40 bg-zinc-950/80 border-zinc-800/80"
                    >
                      <option value="all">All Genres</option>
                      {allGenres.map((g, idx) => (
                        <option key={idx} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Books Grid */}
              {data.books?.length === 0 ? (
                <div className="admin-glass-card p-12 text-center text-zinc-500">
                  <p className="text-sm">No books found in database.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {data.books
                    ?.filter(b => {
                      if (searchQuery.trim()) {
                        return b.title.toLowerCase().includes(searchQuery.toLowerCase());
                      }
                      if (genreFilter !== "all") {
                        return b.genres?.includes(genreFilter);
                      }
                      return true;
                    })
                    .map((book) => (
                      <div key={book._id} className="admin-glass-card overflow-hidden flex flex-col justify-between">
                        <div className="aspect-[3/4] bg-zinc-900 relative">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500";
                              e.currentTarget.onerror = null;
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 space-y-3.5 flex-grow flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                              {book.genres?.[0] || "eBook"}
                            </span>
                            <h4 className="font-bold text-zinc-250 line-clamp-2 text-sm mt-2" title={book.title}>
                              {book.title}
                            </h4>
                            <p className="text-xs text-zinc-500 mt-1">
                              by {book.author?.name || "Unknown Author"}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 mt-2">
                            <span className="text-xs font-bold text-zinc-300">₹{book.price || 0}</span>
                            <div className="flex gap-1.5">
                              <button
                                  onClick={() => setPreviewItem({ type: "book", data: book })}
                                  className="p-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
                                  title="Inspect Book Content"
                                >
                                  <ExternalLink size={13} />
                                </button>
                              <button
                                onClick={() => handleDeleteBook(book._id)}
                                className="p-2 border border-zinc-800 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-500 rounded-lg transition cursor-pointer"
                                title="Delete Listing"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* D. CONTENT REPORTS PANEL */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-in text-left">
              
              <div className="admin-glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-200 font-serif">Moderation & Helpdesk Center</h3>
                  <p className="text-xs text-zinc-500">Track general support requests, complaints, and listing violations</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/35 border border-zinc-800/85 px-3 py-1 rounded-xl">
                  <span className="text-xs text-zinc-400 font-semibold">Active Complaints:</span>
                  <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-rose-500/20">
                    {data.reports?.filter(r => r.status === "pending").length || 0} Pending
                  </span>
                </div>
              </div>

              {data.reports?.length === 0 ? (
                <div className="admin-glass-card p-16 text-center text-zinc-500 space-y-3">
                  <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
                  <h5 className="font-serif font-bold text-base text-zinc-300">Clean Workspace Log</h5>
                  <p className="text-xs max-w-sm mx-auto leading-relaxed text-zinc-500">
                    No active support requests or copyright infringement complaints found in the database.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {data.reports
                    ?.filter(r => {
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        return (
                          r.reason.toLowerCase().includes(q) ||
                          r.description.toLowerCase().includes(q) ||
                          (r.reporter?.name || r.guestName || "").toLowerCase().includes(q) ||
                          (r.book?.title || "").toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((report) => {
                      const isContentFlag = report.book || report.author;
                      const dateStr = new Date(report.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      });
                      
                      return (
                        <div key={report._id} className="admin-glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-zinc-800/70 hover:border-zinc-750">
                          <div className="space-y-4 flex-1 min-w-0">
                            
                            {/* Card Header badges */}
                            <div className="flex flex-wrap items-center gap-2">
                              {isContentFlag ? (
                                <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border border-rose-500/20 uppercase tracking-wider">
                                  <AlertTriangle size={11} className="shrink-0" />
                                  Violation Report
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border border-amber-500/20 uppercase tracking-wider">
                                  <HelpCircle size={11} className="shrink-0" />
                                  Support Desk Ticket
                                </span>
                              )}
                              
                              <span className="text-[10px] text-zinc-500 font-bold font-mono">
                                Ticket ID: {report._id.substring(12).toUpperCase()}
                              </span>
                              <span className="text-[10px] text-zinc-650">•</span>
                              <span className="text-[10px] text-zinc-500 font-medium">
                                Submitted {dateStr}
                              </span>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-b border-zinc-900/60 py-3.5">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">Subject Reason</span>
                                <span className="text-xs text-zinc-200 font-semibold block">{report.reason}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">Submitted By</span>
                                <span className="text-xs text-zinc-200 font-semibold block">
                                  {report.reporter?.name || report.guestName || "Guest User"}
                                </span>
                                <span className="text-[10px] text-zinc-500 font-mono block">
                                  {report.reporter?.email || report.guestEmail}
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">Target Scope</span>
                                {report.book ? (
                                  <button
                                    onClick={() => setPreviewItem({ type: "book", data: report.book })}
                                    className="text-[#d87f4a] hover:underline text-xs font-bold bg-transparent border-0 p-0 text-left cursor-pointer flex items-center gap-1"
                                  >
                                    Book: {report.book.title}
                                    <ExternalLink size={11} className="shrink-0" />
                                  </button>
                                ) : report.author ? (
                                  <button
                                    onClick={() => setPreviewItem({ type: "author", data: report.author })}
                                    className="text-[#d87f4a] hover:underline text-xs font-bold bg-transparent border-0 p-0 text-left cursor-pointer flex items-center gap-1"
                                  >
                                    Profile: {report.author.name}
                                    <ExternalLink size={11} className="shrink-0" />
                                  </button>
                                ) : (
                                  <span className="text-xs text-zinc-500 font-medium">General Application Support</span>
                                )}
                              </div>
                            </div>

                            {/* Ticket Description */}
                            {report.description && (
                              <div className="space-y-1.5">
                                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Issue Description</span>
                                <p className="text-xs text-zinc-400 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900/50 leading-relaxed font-sans max-w-3xl">
                                  {report.description}
                                </p>
                              </div>
                            )}

                          </div>

                          {/* Action panel */}
                          <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 border-zinc-900 pt-4 md:pt-0">
                            <button
                              onClick={() => handleDismissReport(report._id)}
                              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 border border-zinc-800 hover:bg-zinc-850 text-zinc-300 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                              Dismiss / Resolve
                            </button>

                            {report.book && (
                              <button
                                onClick={() => handleDeleteBook(report.book._id)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-950/20 hover:bg-rose-950/30 text-rose-400 border border-rose-900/30 rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                <Trash2 size={13} className="shrink-0" />
                                Purge eBook
                              </button>
                            )}

                            {report.author && (
                              <button
                                onClick={() => handleDeleteAuthor(report.author._id)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-950/20 hover:bg-rose-950/30 text-rose-400 border border-rose-900/30 rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                <Trash2 size={13} className="shrink-0" />
                                Block Account
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    })}
                </div>
              )}

            </div>
          )}

          {/* E. REVIEWS PANEL */}
          {activeTab === "reviews" && (
            <div className="admin-glass-card p-6 text-left animate-fade-in space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-200">Ratings & Reviews Moderation</h3>
                  <p className="text-xs text-zinc-500">Monitor reader comments and feedback</p>
                </div>
              </div>

              {data.reviews?.length === 0 ? (
                <p className="text-center text-zinc-500 py-16 text-sm">No reviews found in database.</p>
              ) : (
                <div className="space-y-4 divide-y divide-zinc-850">
                  {data.reviews
                    ?.filter(rev => {
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        return (
                          rev.comment.toLowerCase().includes(q) ||
                          rev.reviewer?.name.toLowerCase().includes(q) ||
                          rev.book?.title.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((rev, idx) => (
                      <div key={rev._id} className={`pt-4 flex justify-between items-start gap-4 ${idx === 0 ? "pt-0" : ""}`}>
                        <div className="space-y-2 flex-grow min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-bold text-zinc-200">{rev.reviewer?.name || "Reader"}</span>
                            <span className="text-zinc-700">•</span>
                            <div className="flex text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>{i < rev.rating ? "★" : "☆"}</span>
                              ))}
                            </div>
                            <span className="text-zinc-700">•</span>
                            <span className="text-zinc-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div>
                            {rev.book ? (
                              <span className="text-xs text-zinc-500">
                                Target Listing:{" "}
                                <button
                                  onClick={() => setPreviewItem({ type: "book", data: rev.book })}
                                  className="font-semibold text-[#d87f4a] hover:underline cursor-pointer bg-transparent border-0 p-0 text-xs align-baseline"
                                >
                                  {rev.book.title}
                                </button>
                              </span>
                            ) : (
                              <span className="text-xs text-zinc-600 italic">Target book deleted</span>
                            )}
                          </div>

                          <p className="text-xs text-zinc-450 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80 leading-relaxed max-w-3xl">
                            {rev.comment}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="p-2 border border-zinc-850 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-500 rounded-xl transition cursor-pointer mt-1 shrink-0"
                          title="Purge Review Comment"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* F. MOCK PAYMENTS / ORDERS PANEL */}
          {activeTab === "payments" && (
            <div className="admin-glass-card p-6 text-left animate-fade-in space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-200">Payments & Invoicing Logs</h3>
                  <p className="text-xs text-zinc-500">Audit logs for purchases and sales payouts</p>
                </div>
              </div>

              <div className="overflow-x-auto admin-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Customer Details</th>
                      <th>Reference Code</th>
                      <th>Payer Status</th>
                      <th>Invoice Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "INV-29402941", name: "Ramesh Sharma", email: "ramesh@gmail.com", code: "TXN-827419", status: "completed", date: "June 25, 2026", amount: "₹499.00" },
                      { id: "INV-29402830", name: "Anjali Gupta", email: "anjali@gmail.com", code: "TXN-827392", status: "completed", date: "June 24, 2026", amount: "₹1,200.00" },
                      { id: "INV-29402772", name: "Vikram Seth", email: "seth@yahoo.com", code: "TXN-827310", status: "failed", date: "June 24, 2026", amount: "₹350.00" },
                      { id: "INV-29402660", name: "Meera Nair", email: "meera@outlook.com", code: "TXN-827299", status: "completed", date: "June 23, 2026", amount: "₹750.00" },
                      { id: "INV-29402510", name: "David Miller", email: "david@miller.co", code: "TXN-827101", status: "completed", date: "June 21, 2026", amount: "₹899.00" }
                    ]
                    .filter(txn => {
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        return (
                          txn.id.toLowerCase().includes(q) ||
                          txn.name.toLowerCase().includes(q) ||
                          txn.code.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((txn, idx) => (
                      <tr key={idx}>
                        <td><span className="font-serif font-bold text-zinc-300">{txn.id}</span></td>
                        <td>
                          <div className="text-left leading-none">
                            <span className="font-semibold text-zinc-200 block text-xs">{txn.name}</span>
                            <span className="text-[10px] text-zinc-500 mt-1 block">{txn.email}</span>
                          </div>
                        </td>
                        <td><span className="text-xs font-serif text-zinc-450">{txn.code}</span></td>
                        <td>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${txn.status === "completed" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" : "bg-rose-950/40 text-rose-400 border border-rose-900/30"}`}>
                            {txn.status}
                          </span>
                        </td>
                        <td><span className="text-xs text-zinc-500">{txn.date}</span></td>
                        <td><span className="text-sm font-bold text-zinc-100">{txn.amount}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* G. PLATFORM SETTINGS PANEL */}
          {activeTab === "settings" && (
            <div className="admin-glass-card p-6 text-left animate-fade-in space-y-6 max-w-4xl">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-bold text-zinc-200">Global Configuration Desk</h3>
                <p className="text-xs text-zinc-500">Fine-tune platform policies, switches, and alerts</p>
              </div>

              <div className="space-y-6">
                
                {/* Maintenance controls */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  <div className="p-4 bg-zinc-900/45 border border-zinc-800 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1 pr-4">
                      <span className="font-bold text-xs text-zinc-200 block">Maintenance Shield</span>
                      <span className="text-[10px] text-zinc-500 block leading-normal">Puts the front portal in offline mode for updates.</span>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("maintenanceMode")}
                      className={`w-12 h-6 rounded-full p-1 transition duration-205 cursor-pointer ${settingsConfig.maintenanceMode ? "bg-[#d87f4a]" : "bg-zinc-800"}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition transform ${settingsConfig.maintenanceMode ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                  </div>

                  <div className="p-4 bg-zinc-900/45 border border-zinc-800 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1 pr-4">
                      <span className="font-bold text-xs text-[#d87f4a] block">Auto-Moderation Engine</span>
                      <span className="text-[10px] text-zinc-500 block leading-normal">Uses NLP to scan review text and flag complaints.</span>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("autoModeration")}
                      className={`w-12 h-6 rounded-full p-1 transition duration-205 cursor-pointer ${settingsConfig.autoModeration ? "bg-[#d87f4a]" : "bg-zinc-800"}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition transform ${settingsConfig.autoModeration ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                  </div>

                  <div className="p-4 bg-zinc-900/45 border border-zinc-800 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1 pr-4">
                      <span className="font-bold text-xs text-zinc-200 block">Allow Registration</span>
                      <span className="text-[10px] text-zinc-500 block leading-normal">Allows reader & author signs-ups to continue.</span>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("allowRegistration")}
                      className={`w-12 h-6 rounded-full p-1 transition duration-205 cursor-pointer ${settingsConfig.allowRegistration ? "bg-[#d87f4a]" : "bg-zinc-800"}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition transform ${settingsConfig.allowRegistration ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                  </div>

                  <div className="p-4 bg-zinc-900/45 border border-zinc-800 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1 pr-4">
                      <span className="font-bold text-xs text-zinc-200 block">Stripe Live Gateway</span>
                      <span className="text-[10px] text-zinc-500 block leading-normal">Toggle payments processor live vs sandbox environment.</span>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("stripeLiveMode")}
                      className={`w-12 h-6 rounded-full p-1 transition duration-205 cursor-pointer ${settingsConfig.stripeLiveMode ? "bg-[#d87f4a]" : "bg-zinc-800"}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition transform ${settingsConfig.stripeLiveMode ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                  </div>

                </div>

                {/* Announcement Banner Box */}
                <div className="space-y-2 p-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                  <span className="font-bold text-xs text-zinc-200 block">Global Header Banner Announcement</span>
                  <textarea
                    rows="3"
                    value={settingsConfig.announcementText}
                    onChange={(e) => setSettingsConfig(prev => ({ ...prev, announcementText: e.target.value }))}
                    placeholder="Provide notification text for system banner..."
                    className="admin-input mt-2 text-xs h-20 resize-none font-sans"
                  />
                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => triggerToast("Header Banner announcement text saved", "success")}
                      className="bg-[#d87f4a] hover:bg-[#c26e3d] text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      Save Banner
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* H. SUPER ADMIN VIEW */}
          {activeTab === "super-admin" && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* 1. Account Profile Card */}
                <div className="admin-glass-card p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-700 flex items-center justify-center text-xl font-serif font-black text-white shadow-lg shadow-amber-900/10">
                        SA
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-white">Super Admin</h3>
                        <span className="text-xs text-[#d87f4a] font-semibold flex items-center gap-1">
                          <Shield size={12} className="shrink-0" /> Root Administrator (Tier 3)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-semibold">Registered Email</span>
                        <span className="text-zinc-200 font-mono">admin@authorgallery.com</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-semibold">Account Authority</span>
                        <span className="text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 border border-emerald-900/40 rounded-lg text-[10px]">
                          All Permissions Granted
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-semibold">Active Session IP</span>
                        <span className="text-zinc-200 font-mono">127.0.0.1 (Local Host)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-semibold">Session Token Type</span>
                        <span className="text-zinc-200 font-mono">JWT Bearer (Secure HTTP Only)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-6 mt-6 flex gap-3">
                    <button
                      onClick={() => triggerToast("Admin API key generated successfully", "success")}
                      className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 transition cursor-pointer text-center"
                    >
                      Generate API Key
                    </button>
                    <button
                      onClick={handleLogout}
                      className="py-2.5 px-4 bg-rose-950/20 hover:bg-rose-950/30 text-rose-400 border border-rose-900/30 text-xs font-bold rounded-xl transition cursor-pointer text-center"
                    >
                      Log Out
                    </button>
                  </div>
                </div>

                {/* 2. Platform Status Card */}
                <div className="admin-glass-card p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-base text-zinc-100 border-b border-zinc-800 pb-3 mb-5">
                      Platform Node Metrics
                    </h4>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-400">Cloudinary Media Storage</span>
                          <span className="text-zinc-200 font-bold">11.25 GB / 25 GB (45%)</span>
                        </div>
                        {/* Custom SVG Storage progress bar */}
                        <svg className="w-full h-2 rounded-full overflow-hidden bg-zinc-800" viewBox="0 0 100 2">
                          <rect x="0" y="0" width="45" height="2" fill="#d87f4a" />
                        </svg>
                      </div>

                      <div className="flex justify-between items-center bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
                          <span className="text-zinc-300 font-semibold">MongoDB Atlas Cluster</span>
                        </div>
                        <span className="text-zinc-400 font-mono text-[10px]">Connected (3 Nodes)</span>
                      </div>

                      <div className="flex justify-between items-center bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
                          <span className="text-zinc-300 font-semibold">Server Response Time</span>
                        </div>
                        <span className="text-zinc-400 font-mono text-[10px]">42 ms (Stable)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-5 mt-6 flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    <span>System Status: healthy</span>
                    <span className="text-emerald-400 font-semibold">Node Online</span>
                  </div>
                </div>

              </div>

              {/* 3. Credentials & Audit Logs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Security Password Form */}
                <div className="admin-glass-card p-6 lg:col-span-1 space-y-4">
                  <h4 className="font-serif font-bold text-base text-zinc-100 border-b border-zinc-800 pb-3 mb-2">
                    Security Credentials
                  </h4>
                  
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-2">Current Admin Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="admin-input text-xs"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new credentials..."
                        className="admin-input text-xs"
                      />
                    </div>
                    <button
                      onClick={() => triggerToast("Password updated successfully (simulation)", "success")}
                      className="w-full py-2.5 bg-[#d87f4a] hover:bg-[#c26e3d] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Update Credentials
                    </button>
                  </div>
                </div>

                {/* Secure Audit Logs */}
                <div className="admin-glass-card p-6 lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-2">
                    <h4 className="font-serif font-bold text-base text-zinc-100">
                      Access Logs & Operations
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
                      Last 5 activities
                    </span>
                  </div>

                  <div className="overflow-x-auto admin-scroll">
                    <table className="admin-table text-left">
                      <thead>
                        <tr>
                          <th className="text-[10px] pb-3 text-zinc-500">Timestamp</th>
                          <th className="text-[10px] pb-3 text-zinc-500">Operation / Activity</th>
                          <th className="text-[10px] pb-3 text-zinc-500">IP Location</th>
                          <th className="text-[10px] pb-3 text-zinc-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/10">
                        <tr>
                          <td className="text-xs text-zinc-400 font-mono py-3">Today, 18:01</td>
                          <td className="text-xs text-zinc-200 font-semibold py-3">Viewed Super Admin Console</td>
                          <td className="text-xs text-zinc-400 font-mono py-3">127.0.0.1</td>
                          <td className="py-3"><span className="bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-lg text-[9px] font-bold">SUCCESS</span></td>
                        </tr>
                        <tr>
                          <td className="text-xs text-zinc-400 font-mono py-3">Today, 17:55</td>
                          <td className="text-xs text-zinc-200 font-semibold py-3">Admin Login Successful</td>
                          <td className="text-xs text-zinc-400 font-mono py-3">127.0.0.1</td>
                          <td className="py-3"><span className="bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-lg text-[9px] font-bold">SUCCESS</span></td>
                        </tr>
                        <tr>
                          <td className="text-xs text-zinc-400 font-mono py-3">Yesterday, 14:20</td>
                          <td className="text-xs text-zinc-200 font-semibold py-3">Purged Book ID 6a3e48324...</td>
                          <td className="text-xs text-zinc-400 font-mono py-3">192.168.1.42</td>
                          <td className="py-3"><span className="bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-lg text-[9px] font-bold">SUCCESS</span></td>
                        </tr>
                        <tr>
                          <td className="text-xs text-zinc-400 font-mono py-3">Yesterday, 14:15</td>
                          <td className="text-xs text-zinc-200 font-semibold py-3">Dismissed Report #104</td>
                          <td className="text-xs text-zinc-400 font-mono py-3">192.168.1.42</td>
                          <td className="py-3"><span className="bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-lg text-[9px] font-bold">SUCCESS</span></td>
                        </tr>
                        <tr>
                          <td className="text-xs text-zinc-400 font-mono py-3">June 25, 11:32</td>
                          <td className="text-xs text-zinc-300 py-3">Database System Backup</td>
                          <td className="text-xs text-zinc-400 font-mono py-3">Backup Node A</td>
                          <td className="py-3"><span className="bg-blue-950/20 border border-blue-900/40 text-blue-400 px-2 py-0.5 rounded-lg text-[9px] font-bold">SYSTEM</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* 3. SYSTEM CONTROLS / MAINTENANCES QUICK ACTION MODAL */}
      {showQuickActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 admin-modal-overlay">
          <div className="bg-[#121214] border border-zinc-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl text-left">
            <button
              onClick={() => setShowQuickActionModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 hover:bg-zinc-850 rounded-lg cursor-pointer"
            >
              <X size={16} />
            </button>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <Sliders size={18} className="text-[#d87f4a]" />
                <h4 className="font-serif font-bold text-base text-white">System Controls panel</h4>
              </div>

              <div className="space-y-3.5 py-2">
                <div className="flex justify-between items-center bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                  <span className="text-xs text-zinc-300 font-semibold">Maintenance mode</span>
                  <button
                    onClick={() => handleToggleSetting("maintenanceMode")}
                    className={`w-10 h-5 rounded-full p-0.5 transition duration-205 cursor-pointer ${settingsConfig.maintenanceMode ? "bg-[#d87f4a]" : "bg-zinc-800"}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition transform ${settingsConfig.maintenanceMode ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex justify-between items-center bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                  <span className="text-xs text-zinc-300 font-semibold">Allow Registrations</span>
                  <button
                    onClick={() => handleToggleSetting("allowRegistration")}
                    className={`w-10 h-5 rounded-full p-0.5 transition duration-205 cursor-pointer ${settingsConfig.allowRegistration ? "bg-[#d87f4a]" : "bg-zinc-800"}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition transform ${settingsConfig.allowRegistration ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900/35 p-3.5 border border-zinc-800 rounded-xl space-y-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Quick Announcement Broadcast</span>
                <button
                  onClick={() => {
                    setShowQuickActionModal(false);
                    triggerToast("Announcement broadcasted successfully to all active authors & readers", "success");
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-[#d87f4a] to-[#a05a3a] hover:from-[#c26e3d] hover:to-[#8c4e35] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition text-center"
                >
                  Send Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PREVIEW MODAL WORKSPACE */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 admin-modal-overlay">
          <div className="bg-[#121214] border border-zinc-800 rounded-3xl w-full max-w-2xl p-6 relative shadow-2xl text-left admin-scroll overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 hover:bg-zinc-850 rounded-lg cursor-pointer transition"
            >
              <X size={16} />
            </button>
            
            {previewItem.type === "book" ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <BookOpen size={18} className="text-[#d87f4a]" />
                  <h4 className="font-serif font-bold text-base text-white">Book Inspection Workspace</h4>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-32 h-44 bg-zinc-900 rounded-xl overflow-hidden shrink-0 border border-zinc-800">
                    <img
                      src={previewItem.data.coverImage}
                      alt={previewItem.data.title}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500";
                        e.currentTarget.onerror = null;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-3.5 text-left flex-1 min-w-0">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        {previewItem.data.genres?.[0] || "eBook"}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white mt-2 leading-tight">
                        {previewItem.data.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Published by <span className="font-semibold text-zinc-200">{previewItem.data.author?.name || "Unknown Author"}</span> ({previewItem.data.author?.email || "No email"})
                      </p>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div>
                        <span className="text-zinc-500 font-semibold block">Listing Price</span>
                        <span className="text-zinc-200 font-bold text-sm">₹{previewItem.data.price || 0}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-semibold block">Publish Date</span>
                        <span className="text-zinc-200 font-mono">{new Date(previewItem.data.publishDate || previewItem.data.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Book Synopsis</span>
                  <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed max-h-40 overflow-y-auto admin-scroll">
                    {previewItem.data.description || "No description provided."}
                  </div>
                </div>

                {previewItem.data.pdfFile && (
                  <div className="space-y-2.5 border-t border-zinc-800 pt-5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-sans">eBook PDF File (Cloudinary Secure IFrame)</span>
                      <a
                        href={previewItem.data.pdfFile}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#d87f4a] hover:underline font-bold"
                      >
                        Open in new tab
                      </a>
                    </div>
                    <div className="w-full h-80 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                      <iframe
                        src={previewItem.data.pdfFile}
                        title={previewItem.data.title}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <Users size={18} className="text-[#d87f4a]" />
                  <h4 className="font-serif font-bold text-base text-white">Account Profile Inspection</h4>
                </div>

                <div className="flex items-center gap-4 border-b border-zinc-900 pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-xl font-serif font-black text-white overflow-hidden border border-zinc-700">
                    {previewItem.data.profileImage ? (
                      <img src={previewItem.data.profileImage} alt={previewItem.data.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{previewItem.data.name?.substring(0, 2).toUpperCase() || "US"}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-serif font-bold text-white">{previewItem.data.name}</h3>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${previewItem.data.role === 'author' ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/30" : "bg-zinc-800 text-zinc-400 border-zinc-700/60"}`}>
                      {previewItem.data.role || 'user'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-left">
                  <div>
                    <span className="text-zinc-500 font-semibold block">Registered Email</span>
                    <span className="text-zinc-200 font-mono">{previewItem.data.email}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-semibold block">Platform Activity Status</span>
                    <span className="text-zinc-200">Active Listing Moderator / Member</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-semibold block">Works Published</span>
                    <span className="text-zinc-200 font-bold">{previewItem.data.works || 0} Books</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-semibold block">Profile Reference ID</span>
                    <span className="text-zinc-400 font-mono text-[10px]">{previewItem.data._id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. DYNAMIC CONFIRMATION MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 admin-modal-overlay">
          <div className="bg-[#121214] border border-zinc-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                <AlertTriangle size={18} className={confirmModal.type === "danger" ? "text-rose-500" : "text-amber-500"} />
                <h4 className="font-serif font-bold text-base text-white">{confirmModal.title}</h4>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {confirmModal.message}
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-zinc-800 hover:bg-zinc-850 text-zinc-350 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition cursor-pointer ${
                    confirmModal.type === "danger"
                      ? "bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-950/20"
                      : "bg-[#d87f4a] hover:bg-[#c26e3d]"
                  }`}
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
