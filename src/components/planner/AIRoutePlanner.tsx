import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Wallet, Sparkles, Info, Train, Bus, Car, Save, Loader2 } from "lucide-react";
import { useTrips } from "@/hooks/useTrips";
import { useUserStats } from "@/hooks/useUserStats";
import { formatCurrency, SavedTrip, TripStop } from "@/lib/storageService";
import { useToast } from "@/hooks/use-toast";

const circuits = [
  { id: "spiritual", label: "Spiritual", tamilLabel: "ஆன்மீகம்", emoji: "🙏" },
  { id: "heritage", label: "Heritage", tamilLabel: "பாரம்பரியம்", emoji: "🏛️" },
  { id: "nature", label: "Nature", tamilLabel: "இயற்கை", emoji: "🌿" },
];

// Tamil Nadu destinations with coordinates and tips
const destinationDatabase: Record<string, { lat: number; lng: number; tamilName: string }> = {
  "chennai": { lat: 13.0827, lng: 80.2707, tamilName: "சென்னை" },
  "madurai": { lat: 9.9252, lng: 78.1198, tamilName: "மதுரை" },
  "thanjavur": { lat: 10.7870, lng: 79.1378, tamilName: "தஞ்சாவூர்" },
  "trichy": { lat: 10.7905, lng: 78.7047, tamilName: "திருச்சி" },
  "rameswaram": { lat: 9.2876, lng: 79.3129, tamilName: "ராமேஸ்வரம்" },
  "kanchipuram": { lat: 12.8342, lng: 79.7036, tamilName: "காஞ்சிபுரம்" },
  "mahabalipuram": { lat: 12.6172, lng: 80.1927, tamilName: "மாமல்லபுரம்" },
  "ooty": { lat: 11.4102, lng: 76.6950, tamilName: "ஊட்டி" },
  "kodaikanal": { lat: 10.2381, lng: 77.4892, tamilName: "கொடைக்கானல்" },
  "pondicherry": { lat: 11.9416, lng: 79.8083, tamilName: "புதுச்சேரி" },
  "kumbakonam": { lat: 10.9617, lng: 79.3881, tamilName: "கும்பகோணம்" },
  "tirunelveli": { lat: 8.7139, lng: 77.7567, tamilName: "திருநெல்வேலி" },
  "kanyakumari": { lat: 8.0883, lng: 77.5385, tamilName: "கன்னியாகுமரி" },
};

// System prompt for AI
const SYSTEM_PROMPT = `You are Wayora AI, a Tamil Nadu travel expert. You always start responses with "Vanakkam! 🙏"

You specialize in three types of circuits:
1. Spiritual - Temple tours, religious sites, pilgrimage routes
2. Heritage - UNESCO sites, Chola/Pallava/Pandya era monuments, museums
3. Nature - Hill stations, beaches, wildlife sanctuaries

IMPORTANT CULTURAL RULES:
- All temples close between 1 PM - 4 PM (include this warning)
- Recommend early morning darshan (before 7 AM) for popular temples
- Suggest traditional attire for temple visits
- Include local food recommendations

Generate a JSON response with this exact structure:
{
  "name": "Route name in English",
  "tamilName": "Route name in Tamil",
  "stops": [
    {
      "name": "Stop name",
      "tamilName": "Tamil name",
      "day": 1,
      "duration": "2-3 hours",
      "highlight": true/false,
      "tips": ["tip1", "tip2"]
    }
  ],
  "localIntelligence": [
    "Important tip 1",
    "Important tip 2"
  ],
  "estimatedCost": {
    "transport": 5000,
    "stay": 8000,
    "food": 3000,
    "tickets": 1000
  }
}

Always include at least one temple timing warning and one food recommendation.`;

interface AIRoutePlannerProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

interface GeneratedRoute {
  name: string;
  tamilName: string;
  stops: TripStop[];
  localIntelligence: string[];
  estimatedCost?: {
    transport: number;
    stay: number;
    food: number;
    tickets: number;
  };
}

export const AIRoutePlanner = ({ onBack, onNavigate }: AIRoutePlannerProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    budget: "",
    circuit: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRoute | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('wayora_api_key') || '');
  const [showApiInput, setShowApiInput] = useState(false);

  const { saveTrip } = useTrips();
  const { addRouteXP, addTripXP } = useUserStats();
  const { toast } = useToast();

  // Generate route using AI API
  const generateRoute = async () => {
    setIsLoading(true);

    try {
      // Check for API key
      const storedKey = localStorage.getItem('wayora_api_key');

      if (!storedKey) {
        // Use fallback mock data if no API key
        await generateMockRoute();
        return;
      }

      const userPrompt = `Plan a ${formData.circuit} circuit trip from ${formData.source} to ${formData.destination} with a budget of ₹${formData.budget}. Include stops, timings, and local tips.`;

      // Try Gemini API first
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${storedKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${SYSTEM_PROMPT}\n\nUser request: ${userPrompt}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Extract JSON from response
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const routeData = JSON.parse(jsonMatch[0]);
        setGeneratedRoute({
          name: routeData.name || `${formData.source} to ${formData.destination}`,
          tamilName: routeData.tamilName || '',
          stops: routeData.stops?.map((stop: any, index: number) => ({
            name: stop.name,
            tamilName: stop.tamilName || '',
            day: stop.day || index + 1,
            duration: stop.duration || '2-3 hours',
            highlight: stop.highlight || index === 0,
            tips: stop.tips || [],
          })) || [],
          localIntelligence: routeData.localIntelligence || [],
          estimatedCost: routeData.estimatedCost,
        });

        addRouteXP();
        toast({
          title: "🗺️ Route Generated!",
          description: "Your personalized itinerary is ready",
          duration: 3000,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      // Fallback to mock data
      await generateMockRoute();
    } finally {
      setIsLoading(false);
      setShowResults(true);
    }
  };

  // Mock route generator for demo/fallback
  const generateMockRoute = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockRoutes: Record<string, GeneratedRoute> = {
      spiritual: {
        name: "Great Chola Temple Circuit",
        tamilName: "சோழப் பேரரசு கோயில் சுற்றுலா",
        stops: [
          {
            name: `${formData.source} - Departure`,
            tamilName: destinationDatabase[formData.source.toLowerCase()]?.tamilName || '',
            day: 1,
            duration: "Morning",
            highlight: false,
            tips: ["Start early for best experience"],
          },
          {
            name: "Brihadeeswarar Temple",
            tamilName: "பெருவுடையார் கோயில்",
            day: 1,
            duration: "3-4 hours",
            highlight: true,
            tips: [
              "Temple closes 1 PM - 4 PM",
              "Photography allowed in outer areas only",
              "Wear traditional attire",
            ],
          },
          {
            name: "Gangaikonda Cholapuram",
            tamilName: "கங்கைகொண்ட சோழபுரம்",
            day: 2,
            duration: "2-3 hours",
            highlight: false,
            tips: [
              "Less crowded than Thanjavur",
              "Temple closes 12 PM - 4 PM",
            ],
          },
          {
            name: `${formData.destination} - Arrival`,
            tamilName: destinationDatabase[formData.destination.toLowerCase()]?.tamilName || '',
            day: 3,
            duration: "Evening",
            highlight: true,
            tips: ["Explore local cuisine"],
          },
        ],
        localIntelligence: [
          "⚠️ All temples close between 1 PM - 4 PM",
          "🚂 Thanjavur has best rail connectivity",
          "🍛 Try the authentic Thanjavur meals with banana leaf",
          "👗 Wear dhoti/saree for temple entry",
        ],
        estimatedCost: {
          transport: 3000,
          stay: 5000,
          food: 2000,
          tickets: 500,
        },
      },
      heritage: {
        name: "Pallava Heritage Trail",
        tamilName: "பல்லவ பாரம்பரிய பாதை",
        stops: [
          {
            name: `${formData.source} - Start`,
            day: 1,
            duration: "Morning",
            highlight: false,
            tips: ["Book your transport in advance"],
          },
          {
            name: "Mahabalipuram Shore Temple",
            tamilName: "கடற்கரை கோயில்",
            day: 1,
            duration: "4-5 hours",
            highlight: true,
            tips: [
              "Visit at sunrise for best photos",
              "UNESCO World Heritage Site",
              "Carry water - can get hot",
            ],
          },
          {
            name: "Kanchipuram Temples",
            tamilName: "காஞ்சிபுரம் கோயில்கள்",
            day: 2,
            duration: "Full day",
            highlight: true,
            tips: [
              "Famous for silk sarees",
              "Multiple temples to visit",
            ],
          },
          {
            name: `${formData.destination}`,
            day: 3,
            duration: "Evening",
            highlight: false,
            tips: ["Complete your journey"],
          },
        ],
        localIntelligence: [
          "🏛️ Both sites are UNESCO World Heritage",
          "⚠️ Temple timings: 6 AM - 12 PM, 4 PM - 8 PM",
          "🛕 Kanchipuram has 1000+ temples",
          "🧵 Shop for Kanchipuram silk sarees",
        ],
        estimatedCost: {
          transport: 2500,
          stay: 4000,
          food: 1800,
          tickets: 300,
        },
      },
      nature: {
        name: "Nilgiri Nature Escape",
        tamilName: "நீலகிரி இயற்கை சுற்றுலா",
        stops: [
          {
            name: `${formData.source} - Departure`,
            day: 1,
            duration: "Early morning",
            highlight: false,
            tips: ["Start early to reach hills by noon"],
          },
          {
            name: "Nilgiri Mountain Railway",
            tamilName: "நீலகிரி மலை ரயில்",
            day: 1,
            duration: "5 hours",
            highlight: true,
            tips: [
              "Book 30 days in advance",
              "Sit on right side for best views",
              "UNESCO World Heritage rail",
            ],
          },
          {
            name: "Ooty Botanical Gardens",
            tamilName: "ஊட்டி தாவரவியல் பூங்கா",
            day: 2,
            duration: "3-4 hours",
            highlight: true,
            tips: [
              "Best during flower season",
              "Carry warm clothing",
            ],
          },
          {
            name: `${formData.destination}`,
            day: 3,
            duration: "Evening",
            highlight: false,
            tips: ["Try homemade chocolates before leaving"],
          },
        ],
        localIntelligence: [
          "🚂 Toy train is a UNESCO Heritage Railway",
          "🌡️ Temperature: 10-20°C, carry warm clothes",
          "🍫 Ooty is famous for homemade chocolates",
          "☕ Try fresh Nilgiri tea",
        ],
        estimatedCost: {
          transport: 4000,
          stay: 6000,
          food: 2500,
          tickets: 800,
        },
      },
    };

    const route = mockRoutes[formData.circuit] || mockRoutes.spiritual;
    setGeneratedRoute(route);

    addRouteXP();
    toast({
      title: "🗺️ Route Generated!",
      description: "Your personalized itinerary is ready",
      duration: 3000,
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      generateRoute();
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      setGeneratedRoute(null);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleSaveTrip = () => {
    if (!generatedRoute) return;

    const trip: Omit<SavedTrip, 'id' | 'createdAt'> = {
      name: generatedRoute.name,
      tamilName: generatedRoute.tamilName,
      source: formData.source,
      destination: formData.destination,
      circuit: formData.circuit as 'spiritual' | 'heritage' | 'nature',
      budget: parseInt(formData.budget) || 0,
      stops: generatedRoute.stops,
      localIntelligence: generatedRoute.localIntelligence,
      isActive: true,
    };

    saveTrip(trip);
    addTripXP();

    toast({
      title: "✅ Trip Saved!",
      description: "Find it in your profile's saved trips",
      duration: 3000,
    });
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('wayora_api_key', apiKey);
    setShowApiInput(false);
    toast({
      title: "API Key Saved",
      description: "Gemini API key configured successfully",
      duration: 2000,
    });
  };

  const totalEstimatedCost = generatedRoute?.estimatedCost
    ? Object.values(generatedRoute.estimatedCost).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="min-h-full bg-background pb-24">
      <motion.header
        className="flex items-center gap-3 px-5 py-4 bg-card border-b-[1.5px] border-foreground"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button onClick={handleBack} className="brutalist-btn-secondary p-2">
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">AI Route Optimizer</h1>
          <p className="text-xs text-muted-foreground font-tamil">AI வழி திட்டமிடல்</p>
        </div>
        {!showResults && (
          <button
            onClick={() => setShowApiInput(!showApiInput)}
            className="brutalist-btn-secondary p-2 text-xs"
          >
            ⚙️
          </button>
        )}
      </motion.header>

      {/* API Key Input */}
      <AnimatePresence>
        {showApiInput && (
          <motion.div
            className="px-5 py-3 bg-muted border-b-[1.5px] border-foreground"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <p className="text-xs mb-2">Enter Gemini API Key (optional)</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="brutalist-input flex-1 text-xs py-2"
              />
              <button onClick={handleSaveApiKey} className="brutalist-btn-dark px-3 py-2 text-xs">
                Save
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Without an API key, demo routes will be generated
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Progress */}
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 rounded-[7px] border-[1.5px] border-foreground ${s <= step ? "bg-foreground" : "bg-muted"
                      }`}
                  />
                ))}
              </div>

              {/* Step Content */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="brutalist-card p-4">
                    <label className="flex items-center gap-2 text-sm font-bold mb-2">
                      <MapPin size={16} /> Starting Point
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Chennai"
                      className="brutalist-input w-full"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Chennai', 'Madurai', 'Trichy'].map(city => (
                        <button
                          key={city}
                          className="brutalist-badge bg-muted text-xs"
                          onClick={() => setFormData({ ...formData, source: city })}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="brutalist-card p-4">
                    <label className="flex items-center gap-2 text-sm font-bold mb-2">
                      <MapPin size={16} /> Destination
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Madurai"
                      className="brutalist-input w-full"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Thanjavur', 'Rameswaram', 'Ooty', 'Kanyakumari'].map(city => (
                        <button
                          key={city}
                          className="brutalist-badge bg-muted text-xs"
                          onClick={() => setFormData({ ...formData, destination: city })}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="brutalist-card p-4">
                    <label className="flex items-center gap-2 text-sm font-bold mb-2">
                      <Wallet size={16} /> Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 25000"
                      className="brutalist-input w-full"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['10000', '25000', '50000'].map(budget => (
                        <button
                          key={budget}
                          className="brutalist-badge bg-muted text-xs"
                          onClick={() => setFormData({ ...formData, budget })}
                        >
                          {formatCurrency(parseInt(budget))}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-bold">Select Circuit Type</h3>
                  <p className="text-xs text-muted-foreground font-tamil">சுற்றுலா வகையைத் தேர்ந்தெடுக்கவும்</p>
                  <div className="grid grid-cols-3 gap-3">
                    {circuits.map((circuit) => (
                      <button
                        key={circuit.id}
                        className={`brutalist-card p-4 text-center ${formData.circuit === circuit.id
                            ? "bg-foreground text-background"
                            : ""
                          }`}
                        onClick={() => setFormData({ ...formData, circuit: circuit.id })}
                      >
                        <span className="text-2xl">{circuit.emoji}</span>
                        <p className="font-bold text-sm mt-2">{circuit.label}</p>
                        <p className="text-[10px] font-tamil opacity-70">{circuit.tamilLabel}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="brutalist-btn-dark w-full mt-6 py-3 flex items-center justify-center gap-2"
                onClick={handleNext}
                disabled={
                  (step === 1 && !formData.source) ||
                  (step === 2 && !formData.destination) ||
                  (step === 3 && !formData.budget) ||
                  (step === 4 && !formData.circuit) ||
                  isLoading
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Generating...
                  </>
                ) : step === 4 ? (
                  <>
                    <Sparkles size={18} /> Generate Route
                  </>
                ) : (
                  <>
                    Next <ArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Route Header */}
              <div className="brutalist-card p-4 bg-primary">
                <div className="flex items-start gap-3">
                  <Sparkles size={24} className="mt-1" />
                  <div>
                    <h3 className="font-bold text-lg">{generatedRoute?.name}</h3>
                    <p className="text-xs font-tamil opacity-80">{generatedRoute?.tamilName}</p>
                  </div>
                </div>
              </div>

              {/* Route Stops */}
              <div className="brutalist-card p-4">
                <h4 className="font-bold mb-3">Your Itinerary</h4>
                <div className="space-y-3">
                  {generatedRoute?.stops.map((stop, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-[7px] border-[1.5px] border-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 ${stop.highlight ? 'bg-primary' : 'bg-card'}`}>
                        D{stop.day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{stop.name}</p>
                        {stop.tamilName && (
                          <p className="text-[10px] font-tamil text-muted-foreground">{stop.tamilName}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{stop.duration}</p>
                        {stop.tips && stop.tips.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {stop.tips.slice(0, 2).map((tip, i) => (
                              <p key={i} className="text-[10px] text-muted-foreground">• {tip}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Intelligence */}
              <div className="brutalist-card p-4 bg-foreground text-background">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Info size={16} /> Local Intelligence
                </h4>
                <div className="space-y-2">
                  {generatedRoute?.localIntelligence.map((tip, index) => (
                    <p key={index} className="text-sm">{tip}</p>
                  ))}
                </div>
              </div>

              {/* Estimated Cost */}
              {generatedRoute?.estimatedCost && (
                <div className="brutalist-card p-4">
                  <h4 className="font-bold mb-3">Estimated Cost</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transport</span>
                      <span className="font-bold">{formatCurrency(generatedRoute.estimatedCost.transport)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stay</span>
                      <span className="font-bold">{formatCurrency(generatedRoute.estimatedCost.stay)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Food</span>
                      <span className="font-bold">{formatCurrency(generatedRoute.estimatedCost.food)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tickets</span>
                      <span className="font-bold">{formatCurrency(generatedRoute.estimatedCost.tickets)}</span>
                    </div>
                  </div>
                  <div className="border-t border-background/20 mt-3 pt-3 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">{formatCurrency(totalEstimatedCost)}</span>
                  </div>
                </div>
              )}

              {/* Transport Options */}
              <div className="grid grid-cols-3 gap-3">
                <button className="brutalist-btn-secondary p-3 flex flex-col items-center gap-1">
                  <Train size={20} />
                  <span className="text-[10px] font-semibold">Train</span>
                </button>
                <button className="brutalist-btn-secondary p-3 flex flex-col items-center gap-1">
                  <Bus size={20} />
                  <span className="text-[10px] font-semibold">Bus</span>
                </button>
                <button className="brutalist-btn-secondary p-3 flex flex-col items-center gap-1">
                  <Car size={20} />
                  <span className="text-[10px] font-semibold">Car</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="brutalist-btn-secondary py-3 flex items-center justify-center gap-2"
                  onClick={handleSaveTrip}
                >
                  <Save size={18} /> Save Trip
                </button>
                <button className="brutalist-btn-primary py-3">
                  Start Journey
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
