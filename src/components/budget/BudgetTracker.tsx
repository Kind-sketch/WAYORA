import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Camera, Utensils, Train, Hotel, ShoppingBag, Ticket, MoreHorizontal, Trash2, X, Loader2, Image, CheckCircle2 } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { useUserStats } from "@/hooks/useUserStats";
import { formatCurrency, Expense } from "@/lib/storageService";
import { useToast } from "@/hooks/use-toast";
import Tesseract from "tesseract.js";

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
  const [scannerResult, setScannerResult] = useState<{ amount: number; category: string; rawText: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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

  // Parse OCR text to extract amount and category
  const parseOCRResult = (text: string): { amount: number; category: string } | null => {
    // Common patterns for Total/Amount in receipts
    const totalPatterns = [
      /total[:\s]*₹?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /grand\s*total[:\s]*₹?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /amount[:\s]*₹?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /net\s*amount[:\s]*₹?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /₹\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/,
      /rs\.?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /inr\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:only|total)/i,
    ];

    let amount = 0;
    for (const pattern of totalPatterns) {
      const match = text.match(pattern);
      if (match) {
        amount = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }

    // If no pattern matched, try to find the largest number (likely the total)
    if (amount === 0) {
      const numbers = text.match(/\d+(?:,\d{3})*(?:\.\d{2})?/g);
      if (numbers) {
        const parsed = numbers.map(n => parseFloat(n.replace(/,/g, '')));
        amount = Math.max(...parsed.filter(n => n < 100000)); // Cap at reasonable amount
      }
    }

    // Category detection based on keywords
    let category = 'other';
    const lowerText = text.toLowerCase();

    if (/restaurant|cafe|coffee|food|biryani|meals|hotel.*restaurant|swiggy|zomato|kitchen|dine|eat/i.test(lowerText)) {
      category = 'food';
    } else if (/bus|train|uber|ola|petrol|diesel|fuel|irctc|railway|cab|taxi|auto|flight|airline/i.test(lowerText)) {
      category = 'transport';
    } else if (/hotel|lodge|guest\s*house|oyo|room|accommodation|stay|resort|inn/i.test(lowerText)) {
      category = 'stay';
    } else if (/ticket|entry|museum|temple|darshan|booking|park|zoo|cinema|movie/i.test(lowerText)) {
      category = 'tickets';
    } else if (/shop|store|mall|purchase|supermarket|mart|retail|amazon|flipkart/i.test(lowerText)) {
      category = 'shopping';
    }

    if (amount > 0) {
      return { amount, category };
    }
    return null;
  };

  // Real OCR using Tesseract.js
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsScanning(true);
    setScanProgress(0);
    setScannerResult(null);

    try {
      // Run Tesseract.js OCR
      const result = await Tesseract.recognize(
        file,
        'eng', // English language
        {
          logger: (info) => {
            if (info.status === 'recognizing text') {
              setScanProgress(Math.round(info.progress * 100));
            }
          },
        }
      );

      const extractedText = result.data.text;
      console.log("OCR Result:", extractedText);

      const parsed = parseOCRResult(extractedText);

      setIsScanning(false);

      if (parsed) {
        setScannerResult({ ...parsed, rawText: extractedText });
        toast({
          title: "📸 Receipt Scanned!",
          description: `Detected: ${formatCurrency(parsed.amount)} - ${parsed.category}`,
          duration: 3000,
        });
      } else {
        toast({
          title: "No Amount Found",
          description: "Couldn't extract amount. Try manual entry.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("OCR Error:", error);
      setIsScanning(false);
      toast({
        title: "Scan Failed",
        description: "Error processing image. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }

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
      description: `+75 XP earned for scanning!`,
      duration: 3000,
    });

    setScannerResult(null);
    setPreviewImage(null);
    setShowScanner(false);
  };

  // Add manual expense
  const handleAddExpense = () => {
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    addExpense({
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description || categoryConfig[newExpense.category].label,
      date: new Date().toISOString(),
    });

    addExpenseXP();

    toast({
      title: "✅ Expense Added",
      description: `+25 XP earned!`,
      duration: 2000,
    });

    setNewExpense({ category: "food", amount: "", description: "" });
    setShowAddExpense(false);
  };

  const recentExpenses = getRecentExpenses(5);

  return (
    <div className="min-h-full bg-background pb-24">
      {/* Header */}
      <motion.header
        className="flex items-center gap-3 px-5 py-4 bg-card/80 backdrop-blur-xl border-b border-foreground/10 sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button onClick={onBack} className="brutalist-btn-secondary p-2.5 rounded-xl">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Budget Tracker</h1>
          <p className="text-xs text-primary font-tamil">பட்ஜெட் கண்காணிப்பான்</p>
        </div>
      </motion.header>

      {/* Budget Overview Card */}
      <motion.section
        className="px-5 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-card p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={`text-2xl font-bold ${remaining < 0 ? 'text-destructive' : 'text-primary'}`}>
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${spentPercent > 80 ? 'bg-destructive' : 'gradient-primary'}`}
              initial={{ width: 0 }}
              animate={{ width: `${spentPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {formatCurrency(totalSpent)} spent ({spentPercent.toFixed(0)}%)
          </p>
        </div>
      </motion.section>

      {/* Action Buttons */}
      <motion.section
        className="px-5 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-3">
          <motion.button
            className="flex-1 brutalist-btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
            onClick={() => setShowScanner(true)}
            whileTap={{ scale: 0.98 }}
          >
            <Camera size={18} />
            <span className="font-bold">Scan Receipt</span>
          </motion.button>
          <motion.button
            className="flex-1 brutalist-btn-secondary py-3 rounded-xl flex items-center justify-center gap-2"
            onClick={() => setShowAddExpense(true)}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            <span className="font-bold">Add Manual</span>
          </motion.button>
        </div>
      </motion.section>

      {/* Category Breakdown */}
      <motion.section
        className="px-5 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-lg font-bold mb-3 text-foreground">Spending by Category</h2>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const amount = summary.byCategory[key] || 0;
            const Icon = config.icon;
            return (
              <motion.div
                key={key}
                className="glass-card p-3 text-center"
                whileHover={{ y: -2 }}
              >
                <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center mx-auto mb-2 border border-foreground/10`}>
                  <Icon size={18} />
                </div>
                <p className="text-xs text-muted-foreground">{config.label}</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(amount)}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Recent Expenses */}
      <motion.section
        className="px-5 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-bold mb-3 text-foreground">Recent Expenses</h2>
        {recentExpenses.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <p className="text-muted-foreground">No expenses yet</p>
            <p className="text-xs text-muted-foreground mt-1">Scan a receipt to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map((expense) => {
              const config = categoryConfig[expense.category];
              const Icon = config.icon;
              return (
                <motion.div
                  key={expense.id}
                  className="glass-card p-3 flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center border border-foreground/10`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <p className="font-bold text-foreground">{formatCurrency(expense.amount)}</p>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowScanner(false);
              setScannerResult(null);
              setPreviewImage(null);
            }}
          >
            <motion.div
              className="w-full max-w-[430px] bg-card rounded-t-3xl p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Scan Receipt (OCR)</h3>
                <button
                  onClick={() => {
                    setShowScanner(false);
                    setScannerResult(null);
                    setPreviewImage(null);
                  }}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />

              {!scannerResult && !isScanning && (
                <motion.button
                  className="w-full aspect-video brutalist-btn-secondary rounded-2xl flex flex-col items-center justify-center gap-3 border-2 border-dashed border-foreground/20"
                  onClick={() => fileInputRef.current?.click()}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera size={40} className="text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-bold text-foreground">Tap to capture receipt</p>
                    <p className="text-xs text-muted-foreground mt-1">Real OCR powered by Tesseract.js</p>
                  </div>
                </motion.button>
              )}

              {isScanning && (
                <div className="w-full aspect-video rounded-2xl bg-secondary flex flex-col items-center justify-center gap-3 overflow-hidden relative">
                  {previewImage && (
                    <img src={previewImage} alt="Receipt" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                  )}
                  <Loader2 size={40} className="animate-spin text-primary relative z-10" />
                  <p className="font-bold text-foreground relative z-10">Scanning receipt...</p>
                  <div className="w-48 h-2 bg-muted rounded-full overflow-hidden relative z-10">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground relative z-10">{scanProgress}% complete</p>
                </div>
              )}

              {scannerResult && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {previewImage && (
                    <div className="w-full h-32 rounded-xl overflow-hidden relative">
                      <img src={previewImage} alt="Receipt" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-primary/90 text-foreground text-xs px-2 py-1 rounded-lg font-bold">
                        <CheckCircle2 size={12} className="inline mr-1" />
                        Scanned
                      </div>
                    </div>
                  )}

                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-muted-foreground">Detected Amount</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(scannerResult.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="px-3 py-1 bg-secondary rounded-lg font-bold capitalize text-foreground">
                        {scannerResult.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setScannerResult(null);
                        setPreviewImage(null);
                      }}
                      className="flex-1 brutalist-btn-secondary py-3 rounded-xl font-bold"
                    >
                      Retry
                    </button>
                    <button
                      onClick={confirmScannedExpense}
                      className="flex-1 brutalist-btn-primary py-3 rounded-xl font-bold"
                    >
                      Add Expense
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && (
          <motion.div
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddExpense(false)}
          >
            <motion.div
              className="w-full max-w-[430px] bg-card rounded-t-3xl p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Add Expense</h3>
                <button onClick={() => setShowAddExpense(false)} className="p-2 hover:bg-muted rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(categoryConfig).map(([key, config]) => {
                      const Icon = config.icon;
                      const isSelected = newExpense.category === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setNewExpense(prev => ({ ...prev, category: key as Expense['category'] }))}
                          className={`p-3 rounded-xl border-2 transition-all ${isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-foreground/10 hover:border-primary/50'
                            }`}
                        >
                          <Icon size={20} className={`mx-auto mb-1 ${isSelected ? 'text-primary' : ''}`} />
                          <p className="text-xs text-center">{config.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Amount (₹)</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0"
                    className="brutalist-input w-full text-2xl font-bold"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Description (optional)</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Lunch at Saravana Bhavan"
                    className="brutalist-input w-full"
                  />
                </div>

                <button
                  onClick={handleAddExpense}
                  className="w-full brutalist-btn-primary py-3 rounded-xl font-bold"
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
