import React, { useState, useEffect } from 'react';
import {
  Users, Briefcase, Plus, Search, Filter, Phone, MapPin, DollarSign,
  Calendar, CheckCircle2, Clock, Trash2, Edit3, X, ArrowLeft, ShieldCheck,
  Check, MessageCircle, AlertCircle, Wrench, Award, RefreshCw, FileText,
  CreditCard, TrendingUp, Package, Printer, CheckSquare, Layers, LogOut, Lock
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/useAuth';
import QuotationPdfModal from './QuotationPdfModal';

export default function AdminPortal({ onClose }) {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('workforce');
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search and filters
  const [searchWorker, setSearchWorker] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');

  // Modals
  const [showQuotationPdfModal, setShowQuotationPdfModal] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [completingProject, setCompletingProject] = useState(null);
  const [completionReview, setCompletionReview] = useState('');

  // Payment Recording Modal
  const [recordingPaymentFor, setRecordingPaymentFor] = useState(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');

  // Add Expense Modal
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    projectTitle: 'Architectural Teak TV Media Console',
    itemName: '',
    category: 'Plywood & Boards',
    supplierName: '',
    quantity: 1,
    unit: 'sheets',
    totalCost: 5000
  });

  // Worker Form State
  const [workerForm, setWorkerForm] = useState({
    fullName: '',
    phone: '',
    emergencyContact: '',
    tradeRole: 'Lead Master Carpenter',
    payType: 'DAILY',
    payRate: 1200,
    status: 'ACTIVE',
    assignedProject: 'Main Workshop (Plot 42)',
    experienceYears: 5
  });

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Kitchen & Cabinetry',
    clientName: '',
    clientPhone: '',
    siteLocation: '',
    budget: 150000,
    status: 'IN_PROGRESS',
    highlights: ''
  });

  // Load data from Spring Boot API & Supabase
  const loadData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    const isOnline = await api.checkHealth();
    setBackendOnline(isOnline);

    const [empData, projData, invData, expData, quoteData] = await Promise.all([
      api.getEmployees(),
      api.getProjects(),
      api.getInvoices(),
      api.getExpenses(),
      api.getQuotes()
    ]);

    setEmployees(empData);
    setProjects(projData);
    setInvoices(invData);
    setExpenses(expData);
    setQuotes(quoteData);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Worker Save
  const handleSaveWorker = async (e) => {
    e.preventDefault();
    if (editingWorker) {
      await api.updateEmployee(editingWorker.id, workerForm);
      setEmployees(prev => prev.map(emp => emp.id === editingWorker.id ? { ...emp, ...workerForm } : emp));
      setEditingWorker(null);
    } else {
      const created = await api.createEmployee(workerForm);
      setEmployees(prev => [created, ...prev]);
    }
    setShowAddWorkerModal(false);
    resetWorkerForm();
  };

  const resetWorkerForm = () => {
    setWorkerForm({
      fullName: '',
      phone: '',
      emergencyContact: '',
      tradeRole: 'Lead Master Carpenter',
      payType: 'DAILY',
      payRate: 1200,
      status: 'ACTIVE',
      assignedProject: 'Main Workshop (Plot 42)',
      experienceYears: 5
    });
    setEditingWorker(null);
  };

  const handleEditClick = (emp) => {
    setEditingWorker(emp);
    setWorkerForm({
      fullName: emp.fullName,
      phone: emp.phone,
      emergencyContact: emp.emergencyContact || '',
      tradeRole: emp.tradeRole,
      payType: emp.payType,
      payRate: emp.payRate,
      status: emp.status,
      assignedProject: emp.assignedProject || '',
      experienceYears: emp.experienceYears || 5
    });
    setShowAddWorkerModal(true);
  };

  const handleDeleteWorker = async (id) => {
    if (window.confirm("Are you sure you want to remove this employee record?")) {
      await api.deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  // Project Save
  const handleSaveProject = async (e) => {
    e.preventDefault();
    const created = await api.createProject({
      ...projectForm,
      startDate: new Date().toISOString().split('T')[0]
    });
    setProjects(prev => [created, ...prev]);
    setShowAddProjectModal(false);
  };

  // Complete Project Handover
  const handleConfirmComplete = async () => {
    if (!completingProject) return;
    await api.completeProject(completingProject.id, completionReview);
    setProjects(prev => prev.map(p =>
      p.id === completingProject.id
        ? { ...p, status: 'COMPLETED', clientReview: completionReview, completionDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    setCompletingProject(null);
    setCompletionReview('');
  };

  // Record Payment
  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(paymentAmountInput);
    if (!amount || amount <= 0 || !recordingPaymentFor) return;

    await api.recordPayment(recordingPaymentFor.id, amount);
    setInvoices(prev => prev.map(inv => {
      if (inv.id === recordingPaymentFor.id) {
        const newPaid = inv.amountPaid + amount;
        return {
          ...inv,
          amountPaid: newPaid,
          paymentStatus: newPaid >= inv.totalAmount ? 'PAID' : 'PARTIALLY_PAID'
        };
      }
      return inv;
    }));
    setRecordingPaymentFor(null);
    setPaymentAmountInput('');
  };

  // Save Material Expense
  const handleSaveExpense = async (e) => {
    e.preventDefault();
    const created = await api.addExpense(expenseForm);
    setExpenses(prev => [created, ...prev]);
    setShowAddExpenseModal(false);
  };

  // Calculations
  const activeWorkersCount = employees.filter(e => e.status === 'ACTIVE').length;
  const completedProjectsCount = projects.filter(p => p.status === 'COMPLETED').length;
  const inProgressProjectsCount = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const pipelineValue = projects.filter(p => p.status === 'IN_PROGRESS').reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const totalBilled = invoices.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalCollected = invoices.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchWorker.toLowerCase()) ||
                          emp.tradeRole.toLowerCase().includes(searchWorker.toLowerCase()) ||
                          (emp.assignedProject && emp.assignedProject.toLowerCase().includes(searchWorker.toLowerCase()));
    const matchesRole = filterRole === 'All' || emp.tradeRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredProjects = projects.filter(proj => {
    if (projectFilter === 'All') return true;
    return proj.status === projectFilter;
  });

  const roleOptions = [
    'All',
    'Lead Master Carpenter',
    'Modular Kitchen Specialist',
    'Italian PU & Veneer Polish Master',
    'CNC & Beam Saw Operator',
    'Heavy Teak Door Artisan',
    'Wardrobe Track & Louver Specialist',
    'Assistant Joiner / Fitter',
    'Site Assembly Carpenter'
  ];

  const handleLogoutClick = async () => {
    await logout();
    onClose();
  };

  // If user is not authenticated, show protected access screen
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#140d08] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#1a120b] border border-stone-300 dark:border-[#382518] rounded-2xl p-8 shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#2b1a0e] dark:bg-amber-500 text-amber-300 dark:text-stone-950 mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">Protected Contractor Area</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              This portal contains sensitive employee wages, project contracts, and billing records. Authentication via Supabase is required.
            </p>
          </div>
          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => {
                onClose();
                // trigger login modal
                window.location.hash = '';
                setTimeout(() => {
                  const btn = document.querySelector('button[title*="Contractor"]');
                  if (btn) btn.click();
                }, 100);
              }}
              className="w-full py-3 rounded-lg bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950 font-bold text-xs shadow-md"
            >
              Sign In to Access Dashboard
            </button>
            <button
              onClick={onClose}
              className="text-xs text-stone-500 hover:underline pt-1"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#140d08] text-stone-900 dark:text-[#f6f1e8] font-sans pb-20">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1a120b]/95 backdrop-blur-md border-b border-stone-200 dark:border-[#382518] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3.5">
            <button
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-[#382518] text-xs font-semibold hover:bg-stone-100 dark:hover:bg-[#291c13] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Public Website</span>
            </button>

            <div className="h-6 w-[1px] bg-stone-300 dark:bg-[#382518]" />

            <div>
              <h1 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-white leading-tight">
                Vishwakarma Woods Work &bull; <span className="text-[#825936] dark:text-amber-400 font-sans text-sm">Master Contractor Portal</span>
              </h1>
              <div className="flex items-center space-x-2 text-[11px] text-stone-500 dark:text-stone-400">
                <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{backendOnline ? 'Spring Boot ➔ Supabase PostgreSQL Connected' : 'Local Offline Mode (Synced Cache)'}</span>
                {user?.email && (
                  <>
                    <span>&bull;</span>
                    <span className="text-stone-600 dark:text-stone-300 font-semibold">{user.email}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tab Navigation */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#f6f1e8] dark:bg-[#291c13] p-1 rounded-xl border border-[#ebe2d2] dark:border-[#382518]">
              <button
                onClick={() => setActiveTab('workforce')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'workforce'
                    ? 'bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950 shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Carpenters ({employees.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'projects'
                    ? 'bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950 shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Project Sites ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('invoices')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'invoices'
                    ? 'bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950 shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Invoices ({invoices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('expenses')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'expenses'
                    ? 'bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950 shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Expenses ({expenses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('quotes')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'quotes'
                    ? 'bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950 shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Quotes ({quotes.length})</span>
              </button>
            </div>

            {/* Official Quotation PDF Generator Button */}
            <button
              onClick={() => setShowQuotationPdfModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="Create and Download Official Quotation PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Quotation PDF</span>
            </button>

            {/* Secure Sign Out Button */}
            <button
              onClick={handleLogoutClick}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-colors"
              title="Sign Out of Contractor Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* KPI Dashboard Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1f150e] border border-stone-200 dark:border-[#382518] shadow-sm space-y-1">
            <div className="text-xs font-medium text-stone-500 dark:text-stone-400">Total Workforce</div>
            <div className="text-2xl sm:text-3xl font-serif font-black text-stone-900 dark:text-white">
              {employees.length} <span className="text-xs font-sans font-normal text-stone-500">Carpenters</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {activeWorkersCount} Active On-Site
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1f150e] border border-stone-200 dark:border-[#382518] shadow-sm space-y-1">
            <div className="text-xs font-medium text-stone-500 dark:text-stone-400">Active Sites In-Progress</div>
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#825936] dark:text-amber-400">
              {inProgressProjectsCount} <span className="text-xs font-sans font-normal text-stone-500">Live Sites</span>
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              {completedProjectsCount} Handed Over
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1f150e] border border-stone-200 dark:border-[#382518] shadow-sm space-y-1">
            <div className="text-xs font-medium text-stone-500 dark:text-stone-400">Client Payments Collected</div>
            <div className="text-2xl sm:text-3xl font-serif font-black text-emerald-700 dark:text-emerald-400">
              ₹{(totalCollected / 100000).toFixed(2)}L
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              Total Billed: ₹{(totalBilled / 100000).toFixed(2)}L
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1f150e] border border-stone-200 dark:border-[#382518] shadow-sm space-y-1">
            <div className="text-xs font-medium text-stone-500 dark:text-stone-400">Material Purchases Spent</div>
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#2b1a0e] dark:text-amber-300">
              ₹{(totalExpenses / 100000).toFixed(2)}L
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Net Profit: ₹{((totalBilled - totalExpenses) / 100000).toFixed(2)}L
            </div>
          </div>
        </section>

        {/* TAB 1: WORKFORCE */}
        {activeTab === 'workforce' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 flex-grow max-w-2xl">
                <div className="relative flex-grow min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by carpenter name, trade, or site..."
                    value={searchWorker}
                    onChange={(e) => setSearchWorker(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-[#1f150e] border border-stone-300 dark:border-[#382518] text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#825936]"
                  />
                </div>

                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-[#1f150e] border border-stone-300 dark:border-[#382518] text-xs text-stone-700 dark:text-stone-300 focus:outline-none"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  resetWorkerForm();
                  setShowAddWorkerModal(true);
                }}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[#2b1a0e] dark:bg-amber-500 hover:bg-[#4a2f1b] dark:hover:bg-amber-400 text-amber-100 dark:text-stone-950 font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Carpenter / Artisan</span>
              </button>
            </div>

            <div className="bg-white dark:bg-[#1f150e] border border-stone-200 dark:border-[#382518] rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f6f1e8] dark:bg-[#291c13] border-b border-[#ebe2d2] dark:border-[#382518] text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Worker & Contact</th>
                      <th className="py-3.5 px-4">Trade Specialization</th>
                      <th className="py-3.5 px-4">Wage / Rate</th>
                      <th className="py-3.5 px-4">Assigned Jobsite</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-[#2d1e13]">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-stone-50/70 dark:hover:bg-[#241910] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900 dark:text-white text-sm">
                            {emp.fullName}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center space-x-2 mt-0.5">
                            <span>{emp.phone}</span>
                            <span>&bull;</span>
                            <span>{emp.experienceYears} Yrs Exp</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#ebe2d2] dark:bg-[#382518] text-[#4a2f1b] dark:text-amber-200">
                            {emp.tradeRole}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                            ₹{emp.payRate?.toLocaleString('en-IN')}
                            <span className="text-[11px] font-normal text-stone-500 ml-1">
                              / {emp.payType === 'MONTHLY' ? 'mo' : emp.payType === 'HOURLY' ? 'hr' : 'day'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1.5 text-stone-800 dark:text-stone-200 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#825936] dark:text-amber-400 flex-shrink-0" />
                            <span>{emp.assignedProject || 'Workshop Pool'}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            emp.status === 'ACTIVE'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                            <span>{emp.status}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center space-x-1">
                            <button
                              onClick={() => handleEditClick(emp)}
                              className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-[#382518] text-stone-600 dark:text-stone-300"
                              title="Edit Worker Details / Wage"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteWorker(emp.id)}
                              className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === 'projects' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                {['All', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setProjectFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      projectFilter === status
                        ? 'bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950'
                        : 'bg-white dark:bg-[#1f150e] border border-stone-300 dark:border-[#382518] text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {status === 'All' ? 'All Projects' : status === 'IN_PROGRESS' ? 'Active In-Progress' : 'Completed Sites'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddProjectModal(true)}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[#2b1a0e] dark:bg-amber-500 hover:bg-[#4a2f1b] dark:hover:bg-amber-400 text-amber-100 dark:text-stone-950 font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project Site</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-xl bg-white dark:bg-[#1f150e] border border-stone-200 dark:border-[#382518] p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#825936] transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f6f1e8] dark:bg-[#291c13] text-[#825936] dark:text-amber-300 border border-[#ebe2d2] dark:border-[#382518]">
                        {proj.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        proj.status === 'COMPLETED'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}>
                        {proj.status === 'COMPLETED' ? 'Completed & Handed Over' : 'In Execution'}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base leading-snug">
                      {proj.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#825936] dark:text-amber-400 flex-shrink-0" />
                        <span>{proj.siteLocation}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#825936] dark:text-amber-400 flex-shrink-0" />
                        <span>Client: {proj.clientName} ({proj.clientPhone || 'Direct'})</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#f6f1e8] dark:bg-[#291c13] border border-[#ebe2d2] dark:border-[#382518] flex items-center justify-between text-xs">
                      <span className="text-stone-500 dark:text-stone-400">Total Contract Value:</span>
                      <span className="font-serif font-bold text-stone-900 dark:text-amber-300 text-sm">
                        ₹{proj.budget?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {proj.highlights && (
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                        {proj.highlights}
                      </p>
                    )}

                    {proj.clientReview && (
                      <div className="p-2.5 rounded bg-stone-50 dark:bg-[#140d08] border border-stone-200 dark:border-[#382518] text-[11px] text-stone-600 dark:text-stone-300 italic">
                        "{proj.clientReview}"
                      </div>
                    )}
                  </div>

                  {proj.status === 'IN_PROGRESS' && (
                    <div className="pt-2 border-t border-stone-100 dark:border-[#2d1e13]">
                      <button
                        onClick={() => setCompletingProject(proj)}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Completed & Handover</span>
                      </button>
                    </div>
                  )}

                  {proj.status === 'COMPLETED' && (
                    <div className="pt-2 border-t border-stone-100 dark:border-[#2d1e13] flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                      <span>Handed Over: {proj.completionDate || 'Recent'}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>In Public Showcase</span>
                      </span>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: INVOICES & BILLING */}
        {activeTab === 'invoices' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                  Milestone Invoicing & Client Payments
                </h3>
                <p className="text-xs text-stone-500">
                  Track 30% advance, 50% carcase handover, and final balance payments.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1f150e] border border-stone-200 dark:border-[#382518] rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f6f1e8] dark:bg-[#291c13] border-b border-[#ebe2d2] dark:border-[#382518] text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Invoice # & Client</th>
                      <th className="py-3.5 px-4">Milestone Stage</th>
                      <th className="py-3.5 px-4">Total Amount</th>
                      <th className="py-3.5 px-4">Amount Paid</th>
                      <th className="py-3.5 px-4">Balance Due</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-[#2d1e13]">
                    {invoices.map((inv) => {
                      const balance = inv.totalAmount - inv.amountPaid;
                      return (
                        <tr key={inv.id} className="hover:bg-stone-50/70 dark:hover:bg-[#241910] transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900 dark:text-white text-sm">
                              {inv.invoiceNumber}
                            </div>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400">
                              {inv.clientName} &bull; {inv.siteLocation}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-medium text-stone-700 dark:text-stone-300">
                              {inv.milestoneStage}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                            ₹{inv.totalAmount?.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400">
                            ₹{inv.amountPaid?.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3 px-4 font-bold text-stone-700 dark:text-stone-300">
                            ₹{Math.max(0, balance)?.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.paymentStatus === 'PAID'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            }`}>
                              {inv.paymentStatus}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            {balance > 0 ? (
                              <button
                                onClick={() => setRecordingPaymentFor(inv)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                              >
                                Record Payment
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end space-x-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Fully Settled</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: MATERIAL EXPENSES & PROFIT */}
        {activeTab === 'expenses' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                  Jobsite Material Purchases & Expense Log
                </h3>
                <p className="text-xs text-stone-500">
                  Track BWP ply sheets, hardware, Burma teak timber logs, and polish expenses against contract budgets.
                </p>
              </div>

              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[#2b1a0e] dark:bg-amber-500 hover:bg-[#4a2f1b] dark:hover:bg-amber-400 text-amber-100 dark:text-stone-950 font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Log Material Purchase</span>
              </button>
            </div>

            <div className="bg-white dark:bg-[#1f150e] border border-stone-200 dark:border-[#382518] rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f6f1e8] dark:bg-[#291c13] border-b border-[#ebe2d2] dark:border-[#382518] text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Material Item & Supplier</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Associated Project Site</th>
                      <th className="py-3.5 px-4">Quantity</th>
                      <th className="py-3.5 px-4">Cost (₹)</th>
                      <th className="py-3.5 px-4">Purchase Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-[#2d1e13]">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-stone-50/70 dark:hover:bg-[#241910] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900 dark:text-white text-sm">
                            {exp.itemName}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            Supplier: {exp.supplierName || 'Timber Market'}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-[#ebe2d2] dark:bg-[#382518] text-[#4a2f1b] dark:text-amber-200">
                            {exp.category}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-medium text-stone-800 dark:text-stone-200">
                          {exp.projectTitle}
                        </td>

                        <td className="py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                          {exp.quantity} {exp.unit}
                        </td>

                        <td className="py-3 px-4 font-bold text-rose-700 dark:text-rose-400 text-sm">
                          ₹{exp.totalCost?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4 text-stone-500 dark:text-stone-400">
                          {exp.expenseDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: QUOTES INBOX */}
        {activeTab === 'quotes' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                  Client Quote Inquiries (From Cost Estimator)
                </h3>
                <p className="text-xs text-stone-500">
                  Direct client leads submitted via your website calculator. Stored live in Supabase.
                </p>
              </div>

              <button
                onClick={() => setShowQuotationPdfModal(true)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>+ Create Quotation PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl bg-white dark:bg-[#1f150e] border border-stone-200 dark:border-[#382518] p-5 shadow-sm space-y-4 hover:border-[#825936] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#825936] dark:text-amber-400 bg-[#f6f1e8] dark:bg-[#291c13] px-2 py-0.5 rounded border border-[#ebe2d2] dark:border-[#382518]">
                      {q.quoteReference}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {q.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white text-base">
                      {q.clientName}
                    </h4>
                    <div className="text-xs text-stone-500 flex items-center space-x-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-[#825936]" />
                      <span>{q.phone}</span>
                    </div>
                    <div className="text-xs text-stone-500 flex items-center space-x-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#825936]" />
                      <span>{q.siteLocation}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#f6f1e8] dark:bg-[#291c13] border border-[#ebe2d2] dark:border-[#382518] space-y-1 text-xs">
                    <div className="text-stone-500 dark:text-stone-400">{q.serviceTitle}</div>
                    <div className="font-bold text-stone-900 dark:text-amber-300">
                      Estimated: ₹{q.estimatedLow?.toLocaleString('en-IN')} &ndash; ₹{q.estimatedHigh?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-stone-400 capitalize">Grade: {q.finishTier} ({q.projectSizeSqFt} sq ft)</div>
                  </div>

                  <a
                    href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(q.clientName)},%20this%20is%20Vishwakarma%20Woods%20Work%20regarding%20your%20quote%20request%20${q.quoteReference}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Client Directly</span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* MODAL: RECORD PAYMENT */}
      {recordingPaymentFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#1a120b] border border-stone-300 dark:border-[#382518] p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-white">
              Record Client Milestone Payment
            </h3>
            <p className="text-stone-500">
              For <strong>{recordingPaymentFor.clientName}</strong> ({recordingPaymentFor.invoiceNumber})
            </p>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 pt-1">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300">Payment Amount Received (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white text-sm font-bold"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-200 dark:border-[#382518]">
                <button
                  type="button"
                  onClick={() => setRecordingPaymentFor(null)}
                  className="px-4 py-2 rounded-lg border border-stone-300 dark:border-[#382518]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 text-white font-bold"
                >
                  Confirm & Update Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MATERIAL EXPENSE */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#1a120b] border border-stone-300 dark:border-[#382518] p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-white">
              Log Jobsite Material Purchase
            </h3>

            <form onSubmit={handleSaveExpense} className="space-y-3">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300">Material Item Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Greenply 19mm BWP Marine Ply"
                  value={expenseForm.itemName}
                  onChange={(e) => setExpenseForm({ ...expenseForm, itemName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  >
                    <option value="Plywood & Boards">Plywood & Boards</option>
                    <option value="Hardware & Fittings">Hardware & Fittings</option>
                    <option value="Solid Timber">Solid Timber</option>
                    <option value="Veneer & Laminate">Veneer & Laminate</option>
                    <option value="Polish & Finishing">Polish & Finishing</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Total Purchase Cost (₹) *</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.totalCost}
                    onChange={(e) => setExpenseForm({ ...expenseForm, totalCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={expenseForm.quantity}
                    onChange={(e) => setExpenseForm({ ...expenseForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Unit (sheets, sets, etc.)</label>
                  <input
                    type="text"
                    value={expenseForm.unit}
                    onChange={(e) => setExpenseForm({ ...expenseForm, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300">Supplier / Timber Depot Name</label>
                <input
                  type="text"
                  placeholder="e.g. Timber Market Yard, Plot 12"
                  value={expenseForm.supplierName}
                  onChange={(e) => setExpenseForm({ ...expenseForm, supplierName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-200 dark:border-[#382518]">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 dark:border-[#382518]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950 font-bold"
                >
                  Save Material Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT WORKER */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#1a120b] border border-stone-300 dark:border-[#382518] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-[#382518]">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                {editingWorker ? 'Edit Carpenter Record & Wage' : 'Add New Carpenter / Artisan'}
              </h3>
              <button onClick={() => setShowAddWorkerModal(false)} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-[#291c13]">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveWorker} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={workerForm.fullName}
                    onChange={(e) => setWorkerForm({ ...workerForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={workerForm.phone}
                    onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Trade Specialization *</label>
                  <select
                    value={workerForm.tradeRole}
                    onChange={(e) => setWorkerForm({ ...workerForm, tradeRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  >
                    {roleOptions.filter(r => r !== 'All').map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Years of Experience</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={workerForm.experienceYears}
                    onChange={(e) => setWorkerForm({ ...workerForm, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Pay Frequency</label>
                  <select
                    value={workerForm.payType}
                    onChange={(e) => setWorkerForm({ ...workerForm, payType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  >
                    <option value="DAILY">Daily Wage (Per Day)</option>
                    <option value="MONTHLY">Fixed Monthly Salary</option>
                    <option value="HOURLY">Hourly Rate</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Pay Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    value={workerForm.payRate}
                    onChange={(e) => setWorkerForm({ ...workerForm, payRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Assigned Jobsite Location</label>
                <input
                  type="text"
                  placeholder="e.g. Greenwood Palms Villa or Main Workshop"
                  value={workerForm.assignedProject}
                  onChange={(e) => setWorkerForm({ ...workerForm, assignedProject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-200 dark:border-[#382518]">
                <button
                  type="button"
                  onClick={() => setShowAddWorkerModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 dark:border-[#382518] text-stone-600 dark:text-stone-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2b1a0e] dark:bg-amber-500 hover:bg-[#4a2f1b] dark:hover:bg-amber-400 text-amber-100 dark:text-stone-950 font-bold"
                >
                  {editingWorker ? 'Update Record' : 'Save Carpenter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROJECT */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#1a120b] border border-stone-300 dark:border-[#382518] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-[#382518]">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                Register New Project Site
              </h3>
              <button onClick={() => setShowAddProjectModal(false)} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-[#291c13]">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Acrylic Kitchen & Island"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  >
                    <option value="Kitchen & Cabinetry">Kitchen & Cabinetry</option>
                    <option value="Bedroom & Storage">Bedroom & Storage</option>
                    <option value="Living & Interior">Living & Interior</option>
                    <option value="Doors & Partitions">Doors & Partitions</option>
                    <option value="Outdoor & Terraces">Outdoor & Terraces</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Contract Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Mehta"
                    value={projectForm.clientName}
                    onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Client Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98XXX XXXXX"
                    value={projectForm.clientPhone}
                    onChange={(e) => setProjectForm({ ...projectForm, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Site Address / Apartment *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palm Meadows, Villa 42"
                  value={projectForm.siteLocation}
                  onChange={(e) => setProjectForm({ ...projectForm, siteLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-200 dark:border-[#382518]">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 dark:border-[#382518] text-stone-600 dark:text-stone-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2b1a0e] dark:bg-amber-500 hover:bg-[#4a2f1b] dark:hover:bg-amber-400 text-amber-100 dark:text-stone-950 font-bold"
                >
                  Create Project Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MARK AS COMPLETED */}
      {completingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#1a120b] border border-stone-300 dark:border-[#382518] p-6 shadow-2xl space-y-4">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                Handover & Complete Site
              </h3>
              <p className="text-xs text-stone-500">
                You are marking <strong className="text-stone-800 dark:text-white">{completingProject.title}</strong> as completed. This will finalize budget records and sync to your public showcase!
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-stone-700 dark:text-stone-300">Client Feedback / Testimonial (Optional)</label>
              <textarea
                rows="3"
                placeholder="e.g. Master craftsmanship! Delivered ahead of schedule with zero-defect joinery."
                value={completionReview}
                onChange={(e) => setCompletionReview(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-stone-900 dark:text-white"
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-200 dark:border-[#382518]">
              <button
                type="button"
                onClick={() => setCompletingProject(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 dark:border-[#382518] text-stone-600 dark:text-stone-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Confirm Site Handover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Letterhead Quotation PDF Generator Modal */}
      <QuotationPdfModal
        isOpen={showQuotationPdfModal}
        onClose={() => setShowQuotationPdfModal(false)}
      />

    </div>
  );
}
