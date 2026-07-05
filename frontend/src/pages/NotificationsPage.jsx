import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Server, CheckCircle2, Clock, XCircle, BookOpen, AlertCircle, RefreshCw, Smartphone, MapPin, User, Calendar, Trash2, Mail, ShieldAlert, MessageSquare } from "lucide-react";
import { getMyBooks } from "../services/bookService.js";
import { fetchMyOrders, fetchAuthorRequests, approvePurchaseRequest, declinePurchaseRequest } from "../services/paymentService.js";
import { fetchMyReports } from "../services/reportService.js";
import apiClient from "../services/apiClient.js";

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("system"); // system, orders, sales, support
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // States
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesRequests, setSalesRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [serverStatus, setServerStatus] = useState("checking"); // checking, online, offline
  const [actionLoading, setActionLoading] = useState(null);

  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadNotificationData = async () => {
      try {
        setLoading(true);
        
        // Ping server for health check
        try {
          await apiClient.get("/api/books", { params: { limit: 1 } });
          setServerStatus("online");
        } catch (pingErr) {
          console.error("Server ping failed:", pingErr);
          setServerStatus("offline");
        }

        // Fetch user data in parallel
        const [myBooksData, myOrdersData, myRequestsData, myReportsData] = await Promise.all([
          getMyBooks().catch(() => []),
          fetchMyOrders().catch(() => []),
          fetchAuthorRequests().catch(() => []),
          fetchMyReports().catch(() => [])
        ]);

        setBooks(myBooksData);
        setOrders(myOrdersData);
        setSalesRequests(myRequestsData);
        setReports(myReportsData);
      } catch (err) {
        console.error("Failed to load notifications page data:", err);
        triggerToast("Failed to sync some dashboard notifications", "error");
      } finally {
        setLoading(false);
      }
    };

    loadNotificationData();
  }, [refreshTrigger]);

  const handleApproveRequest = async (requestId) => {
    try {
      setActionLoading(requestId);
      await approvePurchaseRequest(requestId);
      triggerToast("Purchase request approved! Access granted.", "success");
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      triggerToast(err.message || "Failed to approve request", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      setActionLoading(requestId);
      await declinePurchaseRequest(requestId);
      triggerToast("Purchase request declined.", "success");
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      triggerToast(err.message || "Failed to decline request", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Limits
  const maxBooks = 10;
  const bookCount = books.length;
  const usagePercentage = Math.min(100, (bookCount / maxBooks) * 100);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-250 text-rose-800"
        }`}>
          <AlertCircle size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-5 text-left">
          <div>
            <h1 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2.5">
              <Bell className="w-8 h-8 text-amber-800" />
              Notification Center
            </h1>
            <p className="text-sm text-slate-655 mt-1 font-medium">
              Monitor your book limits, purchased orders, client requests, and ticket feedbacks.
            </p>
          </div>

          <button
            onClick={() => setRefreshTrigger(p => p + 1)}
            disabled={loading}
            className="p-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl transition duration-200 text-slate-700 disabled:opacity-50 flex items-center gap-1.5 font-bold text-xs cursor-pointer bg-white"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sync Now
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
          {[
            { id: "system", label: "System Health & Limits" },
            { id: "orders", label: `My Purchases (${orders.length})` },
            { id: "sales", label: `Sales Requests (${salesRequests.length})` },
            { id: "support", label: `Reports Feedback (${reports.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-amber-800 text-amber-900"
                  : "border-transparent text-slate-650 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <RefreshCw className="w-8 h-8 text-amber-800 animate-spin mx-auto mb-3" />
            <h3 className="font-bold text-slate-800">Synchronizing Center...</h3>
            <p className="text-xs text-slate-600 mt-1">Fetching account statuses and server logs.</p>
          </div>
        ) : (
          <div className="space-y-6 text-left">
            
            {/* 1. System Health & Account Limits */}
            {activeTab === "system" && (
              <div className="space-y-6">
                
                {/* Maintenance / Health Status Notification */}
                {(serverStatus === "offline" || localStorage.getItem("admin_setting_maintenanceMode") === "true") ? (
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl shadow-sm space-y-3.5">
                    <h3 className="text-lg font-serif font-bold text-amber-900 flex items-center gap-2">
                      <ShieldAlert className="text-amber-800 w-5.5 h-5.5 shrink-0" />
                      Active Maintenance Mode
                    </h3>
                    <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                      Notice: The platform is currently undergoing system maintenance. Uploading files, purchasing premium books, and making account profile adjustments are temporarily disabled. We appreciate your patience.
                    </p>
                    {localStorage.getItem("admin_setting_announcementText") && (
                      <p className="text-[11px] text-amber-900/80 italic font-medium bg-amber-100/50 p-2.5 rounded-xl border border-amber-200/10">
                        Message: "{localStorage.getItem("admin_setting_announcementText")}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-50/60 border border-emerald-200/60 p-6 rounded-3xl shadow-sm space-y-2">
                    <h3 className="text-lg font-serif font-bold text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="text-emerald-700 w-5.5 h-5.5 shrink-0" />
                      System Status: Operational
                    </h3>
                    <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
                      All systems are active and functional. No maintenance alerts or down schedules are currently reported on your profile.
                    </p>
                  </div>
                )}

                {/* Account Limits */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-slate-900">Account Publishing Limits</h3>
                    <p className="text-xs text-slate-655 mt-0.5">Current storage allocations matched with the free plan parameters.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-800">eBooks Published</span>
                      <span className="text-amber-900 font-bold">{bookCount} / {maxBooks} books</span>
                    </div>

                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner">
                      <div 
                        style={{ width: `${usagePercentage}%` }} 
                        className={`h-full transition-all duration-500 rounded-full ${
                          usagePercentage >= 90 
                            ? "bg-rose-500" 
                            : usagePercentage >= 70 
                              ? "bg-amber-600" 
                              : "bg-amber-800"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-600 font-medium pt-1">
                      <span>Tier: Professional Free Plan</span>
                      <span>{maxBooks - bookCount} upload slots remaining</span>
                    </div>
                  </div>

                  {bookCount >= maxBooks && (
                    <div className="bg-amber-50 border border-amber-250 text-amber-900 p-4 rounded-2xl flex items-start gap-2 text-xs font-medium">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <p>
                        <strong>Free Limit Reached:</strong> You have published the maximum of 10 books. To publish new books, you will need to delete one of your existing books in the <strong>My Collection</strong> tab.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. My Purchases (Orders) */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-350 rounded-3xl bg-white">
                    <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800">No books purchased yet</h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">Explore our catalog and send direct payment requests to authors to download premium reads.</p>
                    <Link to="/books" className="inline-block mt-4 text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 rounded-full shadow transition cursor-pointer">
                      Browse Books Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {orders.map((order) => (
                      <div 
                        key={order._id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition hover:shadow-md"
                      >
                        {/* Book details & info */}
                        <div className="flex gap-4">
                          <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            <img 
                              src={order.book?.coverImage} 
                              alt={order.book?.title}
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60";
                                e.currentTarget.onerror = null;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-1 select-text">
                            <h4 className="font-bold text-slate-900 font-serif leading-tight">{order.book?.title || "Deleted Book"}</h4>
                            <p className="text-xs text-slate-600">Price: <strong>₹{order.book?.price}</strong></p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Calendar size={11} /> 
                              Requested: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge & Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 justify-between md:justify-end">
                          
                          {/* Badges */}
                          {order.status === "pending" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">
                              <Clock size={12} />
                              Pending Approval
                            </span>
                          )}
                          {order.status === "paid" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-250 rounded-full text-xs font-bold text-emerald-800">
                              <CheckCircle2 size={12} />
                              Request Approved
                            </span>
                          )}
                          {order.status === "declined" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-250 rounded-full text-xs font-bold text-rose-800">
                              <XCircle size={12} />
                              Request Declined
                            </span>
                          )}

                          {/* Quick details */}
                          {order.status === "pending" && (
                            <div className="text-right text-[11px] text-slate-600 max-w-xs font-medium">
                              Note: Check WhatsApp or email to pay the author offline.
                            </div>
                          )}

                          {order.status === "paid" && order.book?._id && (
                            <Link 
                              to={`/books/${order.book._id}`}
                              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer text-center"
                            >
                              Open e-Reader
                            </Link>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Sales Requests (For Books Authored by Me) */}
            {activeTab === "sales" && (
              <div className="space-y-4">
                {salesRequests.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-350 rounded-3xl bg-white">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800">All caught up!</h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">You have no pending book purchase approvals from other users.</p>
                  </div>
                ) : (
                  <div className="space-y-4 select-text">
                    {salesRequests.map((req) => (
                      <div 
                        key={req._id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 transition hover:shadow-md"
                      >
                        {/* Header details */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-amber-800/10 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                              {req.user?.name?.charAt(0).toUpperCase() || "B"}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{req.user?.name}</h4>
                              <p className="text-[10px] text-slate-500">{req.user?.email}</p>
                            </div>
                          </div>

                          <div className="text-right text-xs">
                            <span className="text-slate-600">Buying: </span>
                            <strong className="text-slate-900 font-serif">{req.book?.title}</strong>
                            <span className="text-slate-600"> for </span>
                            <strong className="text-emerald-700 font-semibold">₹{req.book?.price}</strong>
                          </div>
                        </div>

                        {/* Customer direct parameters */}
                        <div className="grid gap-3 sm:grid-cols-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/50">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Smartphone size={14} className="text-amber-800 shrink-0" />
                            <div className="truncate">
                              <span className="font-bold block text-[10px] uppercase text-slate-550">WhatsApp</span>
                              <a 
                                href={`https://wa.me/${req.whatsapp?.replace(/[^0-9]/g, "")}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="underline font-semibold hover:text-amber-900"
                              >
                                {req.whatsapp}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-slate-700 sm:col-span-2">
                            <MapPin size={14} className="text-amber-800 shrink-0" />
                            <div className="truncate">
                              <span className="font-bold block text-[10px] uppercase text-slate-550">Shipping Address</span>
                              <span className="font-semibold block truncate" title={req.address}>{req.address}</span>
                            </div>
                          </div>
                        </div>

                        {req.note && (
                          <div className="text-xs italic bg-amber-50/50 border border-amber-250/20 px-3.5 py-2.5 rounded-xl text-slate-700">
                            <strong>Note:</strong> "{req.note}"
                          </div>
                        )}

                        {/* Action triggers */}
                        <div className="flex gap-2 justify-end border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            disabled={actionLoading !== null}
                            onClick={() => handleDeclineRequest(req._id)}
                            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition disabled:opacity-50"
                          >
                            Decline Request
                          </button>

                          <button
                            type="button"
                            disabled={actionLoading !== null}
                            onClick={() => handleApproveRequest(req._id)}
                            className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-xs cursor-pointer transition disabled:opacity-50 shadow shadow-amber-800/10 flex items-center gap-1"
                          >
                            {actionLoading === req._id ? "Approving..." : "Approve Purchase"}
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Support Tickets Feedback */}
            {activeTab === "support" && (
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-350 rounded-3xl bg-white">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800">No support tickets found</h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">Have a problem or noticed a content violation? Send a support ticket on the Helpdesk page.</p>
                    <Link to="/helpdesk" className="inline-block mt-4 text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 rounded-full shadow transition cursor-pointer">
                      Open Support Helpdesk
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 select-text">
                    {reports.map((report) => (
                      <div 
                        key={report._id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5 transition hover:shadow-md text-left"
                      >
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-full">
                            Reason: {report.reason}
                          </span>

                          <span className="text-[10px] text-slate-500 font-semibold uppercase">
                            Date: {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="font-bold text-slate-900 text-sm">Ticket Description</h4>
                          <p className="text-xs text-slate-655 bg-slate-50 border border-slate-200/50 p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap">
                            {report.description || "No detailed description was provided."}
                          </p>
                        </div>

                        {report.book && (
                          <p className="text-[11px] text-slate-600 font-medium">
                            Reported Content: <strong className="text-slate-800">Book "{report.book.title}"</strong>
                          </p>
                        )}
                        {report.author && (
                          <p className="text-[11px] text-slate-600 font-medium">
                            Reported Content: <strong className="text-slate-800">Author Profile "{report.author.name}"</strong>
                          </p>
                        )}

                        {/* Moderator Resolution Status */}
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs">
                          <span className="text-slate-500">Moderator Feedback:</span>
                          
                          {report.status === "pending" ? (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-800">
                              <Clock size={12} /> Under Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-800">
                              <CheckCircle2 size={12} /> Resolved / Actioned
                            </span>
                          )}

                          <span className="text-[10px] text-slate-500 font-semibold ml-auto italic">
                            {report.status === "pending" 
                              ? "Support is analyzing this report. Thank you for keeping the platform safe."
                              : "Resolved: Administrative action has been taken."
                            }
                          </span>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default NotificationsPage;
