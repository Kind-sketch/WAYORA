import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Camera, Utensils, Train, Hotel, ShoppingBag, Ticket, MoreHorizontal, Trash2, X } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { useUserStats } from "@/hooks/useUserStats";
import { formatCurrency, Expense } from "@/lib/storageService";
import { useToast } from "@/hooks/use-toast";

const categoryConfig: Record<string, { icon: typeof Utensils; color: string; label: string }> = {
  food: { icon: Utensils, color: "bg-primary", label: "Food" },
  transport: { icon: Train, color: "bg-foreground text-background", label: "Transport" },
  stay: { icon: Hotel, color: "bg-card", label: "Stay" },
  shopping: { icon: ShoppingBag, color: "bg-muted", label: "Shopping" },
  tickets: { icon: Ticket, color: "bg-accent", label: "Tickets" },
  other: { icon: MoreHorizontal, color: "bg-secondary", label: "Other" },
};

interface BudgetTrackerProps {
  onBack: () => void;
}

export const BudgetTracker = ({ onBack }: BudgetTrackerProps) => {
  const [showScanner, setShowScanner] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [scannerResult, setScannerResult] = useState<{ amount: number; category: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { expenses, summary, addExpense, deleteExpense, getRecentExpenses } = useExpenses();
  const { addExpenseXP, addScanXP } = useUserStats();
  const { toast } = useToast();

  // Form state for manual expense
  const [newExpense, setNewExpense] = useState({
    category: "food" as Expense['category'],
    amount: "",
    description: "",
  });

  const totalBudget = 25000; // This could be configurable
  const totalSpent = summary.total;
  const remaining = totalBudget - totalSpent;
  const spentPercent = Math.min((totalSpent / totalBudget) * 100, 100);

  // OCR Simulation - regex-based parsing for common receipt patterns
  const simulateOCR = (text: string): { amount: number; category: string } | null => {
    // Common patterns for Total/Amount in receipts
    const totalPatterns = [
      /total[:\s]*₹?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /grand\s*total[:\s]*₹?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /amount[:\s]*₹?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /₹\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/,
      /rs\.?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /inr\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    ];

    let amount = 0;
    for (const pattern of totalPatterns) {
      const match = text.match(pattern);
      if (match) {
        amount = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }

    // Category detection
    let category = 'other';
    const lowerText = text.toLowerCase();

    if (/restaurant|cafe|coffee|food|biryani|meals|hotel.*restaurant|swiggy|zomato/i.test(lowerText)) {
      category = 'food';
    } else if (/bus|train|uber|ola|petrol|diesel|fuel|irctc|railway/i.test(lowerText)) {
      category = 'transport';
    } else if (/hotel|lodge|guest\s*house|oyo|room|accommodation|stay/i.test(lowerText)) {
      category = 'stay';
    } else if (/ticket|entry|museum|temple|darshan|booking/i.test(lowerText)) {
      category = 'tickets';
    } else if (/shop|store|mall|purchase|supermarket/i.test(lowerText)) {
      category = 'shopping';
    }

    if (amount > 0) {
      return { amount, category };
    }
    return null;
  };

  // Handle file upload for OCR
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScannerResult(null);

    // Simulate OCR processing
    setTimeout(() => {
      // In a real app, we'd use Google Vision or Tesseract.js
      // For demo, we'll generate a random realistic result
      const mockReceiptTexts = [
        "THANJAVUR HOTEL\nFilter Coffee Rs. 45\nMeals Rs. 180\nTotal: ₹ 225",
        "IRCTC BOOKING\nChennai - Madurai\nSleeper Class\nAmount: Rs 450",
        "OYO ROOMS\nRoom Charges 1 Night\nGrand Total: ₹ 1,200",
        "MUSEUM ENTRY\nAdult Ticket x 2\nTotal: Rs 100",
      ];

      const randomReceipt = mockReceiptTexts[Math.floor(Math.random() * mockReceiptTexts.length)];
      const result = simulateOCR(randomReceipt);

      setIsScanning(false);

      if (result) {
        setScannerResult(result);
        toast({
          title: "📸 Receipt Scanned!",
          description: `Detected: ${formatCurrency(result.amount)} - ${result.category}`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Scan Failed",
          description: "Couldn't extract amount from receipt",
          variant: "destructive",
          duration: 3000,
        });
      }
    }, 1500);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Confirm scanned expense
  const confirmScannedExpense = () => {
    if (!scannerResult) return;

    addExpense({
      category: scannerResult.category as Expense['category'],
      amount: scannerResult.amount,
      description: "Scanned receipt",
      date: new Date().toISOString(),
    });

    addScanXP();
    addExpenseXP();

    toast({
      title: "✅ Expense Added",
      description: `${formatCurrency(scannerResult.amount)} added to ${scannerResult.category}`,
      duration: 2000,
    });

    setScannerResult(null);
    setShowScanner(false);
  };

  // Handle manual expense submission
  const handleAddExpense = () => {
    const amount = parseFloat(newExpense.amount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    addExpense({
      category: newExpense.category,
      amount,
      description: newExpense.description || `${categoryConfig[newExpense.category].label} expense`,
      date: new Date().toISOString(),
    });

    addExpenseXP();

    toast({
      title: "✅ Expense Added",
      description: `${formatCurrency(amount)} added to ${newExpense.category}`,
      duration: 2000,
    });

    setNewExpense({ category: "food", amount: "", description: "" });
    setShowAddExpense(false);
  };

  // Delete expense handler
  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    toast({
      title: "Expense Deleted",
      description: "The expense has been removed",
      duration: 2000,
    });
  };

  // Calculate category breakdown
  const categoryBreakdown = Object.entries(categoryConfig).map(([key, config]) => ({
    category: key,
    ...config,
    amount: summary.byCategory[key] || 0,
    percent: summary.total > 0 ? ((summary.byCategory[key] || 0) / summary.total) * 100 : 0,
  })).filter(c => c.amount > 0);

  const recentTransactions = getRecentExpenses(5);

  return (
    <div className="min-h-full bg-background pb-24">
      <motion.header
        className="flex items-center gap-3 px-5 py-4 bg-card border-b-[1.5px] border-foreground"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button onClick={onBack} className="brutalist-btn-secondary p-2">
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Budget Tracker</h1>
          <p className="text-xs text-muted-foreground font-tamil">பட்ஜெட் கண்காணிப்பான்</p>
        </div>
      </motion.header>

      <div className="p-5 space-y-6">
        {/* Budget Overview */}
        <motion.div
          className="brutalist-card p-5 bg-foreground text-background"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs opacity-70">Total Budget</p>
              <p className="text-3xl font-bold">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">Remaining</p>
              <p className={`text-xl font-bold ${remaining < 0 ? 'text-destructive' : 'text-primary'}`}>
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Spent: {formatCurrency(totalSpent)}</span>
              <span className="font-bold">{spentPercent.toFixed(0)}%</span>
            </div>
            <div className="brutalist-progress bg-card/20 border-primary">
              <motion.div
                className={`brutalist-progress-fill ${spentPercent > 90 ? 'bg-destructive' : 'bg-primary'}`}
                initial={{ width: 0 }}
                animate={{ width: `${spentPercent}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-1">Expense Categories</h2>
            <p className="text-xs text-muted-foreground font-tamil mb-3">செலவு வகைகள்</p>

            <div className="grid grid-cols-2 gap-3">
              {categoryBreakdown.map((expense, index) => {
                const Icon = expense.icon;
                return (
                  <motion.div
                    key={expense.category}
                    className={`brutalist-card p-4 ${expense.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={18} />
                      <span className="font-bold text-sm">{expense.label}</span>
                    </div>
                    <p className="text-xl font-bold">{formatCurrency(expense.amount)}</p>
                    <div className="brutalist-progress mt-2 h-2">
                      <div className="h-full bg-foreground" style={{ width: `${expense.percent}%` }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            className="brutalist-btn-primary py-4 flex items-center justify-center gap-3"
            onClick={() => setShowScanner(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Camera size={22} strokeWidth={2.5} />
            <span className="font-bold">Scan Receipt</span>
          </motion.button>

          <motion.button
            className="brutalist-btn-secondary py-4 flex items-center justify-center gap-3"
            onClick={() => setShowAddExpense(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={22} strokeWidth={2.5} />
            <span className="font-bold">Add Manual</span>
          </motion.button>
        </div>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold">Recent Transactions</h2>
              <p className="text-xs text-muted-foreground font-tamil">சமீபத்திய பரிவர்த்தனைகள்</p>
            </div>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="brutalist-card divide-y divide-border">
              {recentTransactions.map((tx, index) => {
                const config = categoryConfig[tx.category] || categoryConfig.other;
                const Icon = config.icon;
                const date = new Date(tx.date);
                const timeAgo = getTimeAgo(date);

                return (
                  <motion.div
                    key={tx.id}
                    className="p-4 flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-[7px] ${config.color} flex items-center justify-center`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{tx.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="brutalist-badge text-[10px]">{config.label}</span>
                          <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">-{formatCurrency(tx.amount)}</p>
                      <button
                        onClick={() => handleDeleteExpense(tx.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="brutalist-card p-8 text-center">
              <p className="text-muted-foreground">No expenses yet</p>
              <p className="text-xs text-muted-foreground font-tamil mt-1">செலவுகள் இல்லை</p>
            </div>
          )}
        </section>
      </div>

      {/* Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isScanning && setShowScanner(false)}
          >
            <motion.div
              className="brutalist-card bg-card p-6 w-full max-w-[350px]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Scan Receipt</h3>
                <button onClick={() => setShowScanner(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>

              {!scannerResult ? (
                <>
                  <div className="aspect-[4/3] bg-muted rounded-[7px] border-[1.5px] border-foreground flex items-center justify-center mb-4 relative overflow-hidden">
                    {isScanning ? (
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-sm">Processing receipt...</p>
                        <p className="text-xs font-tamil text-muted-foreground">ரசீது செயலாக்கப்படுகிறது</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera size={48} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload receipt image</p>
                        <p className="text-xs font-tamil text-muted-foreground">ரசீது படத்தை பதிவேற்றவும்</p>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label
                    htmlFor="receipt-upload"
                    className="brutalist-btn-dark w-full py-3 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera size={18} />
                    <span>{isScanning ? 'Processing...' : 'Upload Receipt'}</span>
                  </label>
                </>
              ) : (
                <>
                  <div className="bg-muted rounded-[7px] border-[1.5px] border-foreground p-4 mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Detected Amount</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(scannerResult.amount)}</p>
                    <p className="text-sm mt-2">Category: <span className="font-bold capitalize">{scannerResult.category}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setScannerResult(null)}
                      className="brutalist-btn-secondary py-3"
                    >
                      Retry
                    </button>
                    <button
                      onClick={confirmScannedExpense}
                      className="brutalist-btn-dark py-3"
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && (
          <motion.div
            className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddExpense(false)}
          >
            <motion.div
              className="brutalist-card bg-card p-6 w-full max-w-[350px]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Add Expense</h3>
                <button onClick={() => setShowAddExpense(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="text-sm font-bold mb-2 block">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(categoryConfig).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={key}
                          className={`brutalist-card p-3 text-center ${newExpense.category === key ? 'bg-foreground text-background' : ''
                            }`}
                          onClick={() => setNewExpense({ ...newExpense, category: key as Expense['category'] })}
                        >
                          <Icon size={20} className="mx-auto mb-1" />
                          <span className="text-[10px] font-semibold">{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm font-bold mb-2 block">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g., 500"
                    className="brutalist-input w-full"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-bold mb-2 block">Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Temple prasadam"
                    className="brutalist-input w-full"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                </div>

                <button
                  onClick={handleAddExpense}
                  className="brutalist-btn-dark w-full py-3"
                >
                  Add Expense
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function for time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}
