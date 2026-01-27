import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChatbotDialog } from "./ChatbotDialog";
import { 
  MapPin, 
  Calendar, 
  Home, 
  UtensilsCrossed, 
  Bell, 
  Gamepad2, 
  Trophy, 
  Camera, 
  Navigation,
  DollarSign,
  Star,
  Users,
  Shield,
  Share2,
  Bot,
  Plus,
  Search,
  Map,
  Compass,
  Wallet,
  User,
  ChevronRight,
  TrendingUp,
  Globe,
  MessageCircle,
  Zap,
  BookOpen,
  CalendarCheck,
  History
} from "lucide-react";

type Screen = 'home' | 'explore' | 'trips' | 'budget' | 'profile';

export function MobileApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const currentTrip = {
    destination: "Paris, France",
    dates: "Dec 15-22, 2024",
    daysLeft: 12,
    budget: 2500,
    spent: 450,
    image: "https://images.unsplash.com/photo-1646494836291-dccc011e3d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbiUyMHN1bnNldCUyMGJlYWNofGVufDF8fHx8MTc1Nzk1Mjg2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  };

  const quickActions = [
    { icon: <BookOpen className="w-5 h-5" />, label: "Trip Atlas", color: "bg-blue-50 text-blue-600" },
    { icon: <Zap className="w-5 h-5" />, label: "Post Generator", color: "bg-yellow-50 text-yellow-600" },
    { icon: <CalendarCheck className="w-5 h-5" />, label: "Bookings", color: "bg-green-50 text-green-600" },
    { icon: <History className="w-5 h-5" />, label: "Location History", color: "bg-purple-50 text-purple-600" },
    { icon: <Shield className="w-5 h-5" />, label: "Emergency Finder", color: "bg-red-50 text-red-600" }
  ];

  const upcomingTrips = [
    {
      destination: "Tokyo, Japan",
      dates: "Jan 10-20, 2025",
      image: "https://images.unsplash.com/photo-1542909356-08e5625abea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBtYXAlMjBuYXZpZ2F0aW9uJTIwcGhvbmV8ZW58MXx8fHwxNzU3OTUyODY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "Planning"
    },
    {
      destination: "Swiss Alps",
      dates: "Mar 5-12, 2025",
      image: "https://images.unsplash.com/photo-1615472767332-e5615c7e617a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBoaWtpbmclMjBtb3VudGFpbnxlbnwxfHx8fDE3NTc5NTI4NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "Saved"
    }
  ];

  const exploriaChallenges = [
    { title: "Hidden Gem Hunter", progress: 75, points: 150, icon: <Compass className="w-4 h-4" /> },
    { title: "Budget Master", progress: 60, points: 120, icon: <DollarSign className="w-4 h-4" /> },
    { title: "Photo Explorer", progress: 90, points: 200, icon: <Camera className="w-4 h-4" /> },
    { title: "Cultural Connector", progress: 45, points: 80, icon: <Globe className="w-4 h-4" /> }
  ];

  const renderHomeScreen = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back!</p>
          <h2 className="text-xl font-bold">Alex Thompson</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-[rgba(255,0,0,1)]">
            <Bell className="w-5 h-5" />
          </Button>
          <Avatar>
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Current Trip Card */}
      <Card className="overflow-hidden rounded-[7px]">
        <div className="relative h-32">
          <ImageWithFallback 
            src={currentTrip.image}
            alt={currentTrip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-semibold">{currentTrip.destination}</h3>
            <p className="text-sm opacity-90">{currentTrip.dates}</p>
          </div>
          <Badge className="absolute top-3 right-3 bg-green-500">
            {currentTrip.daysLeft} days left
          </Badge>
        </div>
        <CardContent className="p-4 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="flex justify-between text-sm mb-2">
            <span>Budget Progress</span>
            <span>${currentTrip.spent} / ${currentTrip.budget}</span>
          </div>
          <Progress value={(currentTrip.spent / currentTrip.budget) * 100} className="h-2 [&>div]:bg-black" />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.slice(0, 4).map((action, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-[rgba(142,180,245,0.2)] rounded-[7px]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}>
                  {action.icon}
                </div>
                <span className="font-medium text-sm">{action.label}</span>
              </div>
            </Card>
          ))}
        </div>
        {/* Additional Quick Action */}
        <div className="mt-3">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-[rgba(255,76,76,0.25)] rounded-[7px]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${quickActions[4].color} flex items-center justify-center`}>
                {quickActions[4].icon}
              </div>
              <span className="font-medium text-sm">{quickActions[4].label}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Upcoming Trips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Upcoming Trips</h3>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Trip
          </Button>
        </div>
        <div className="space-y-3">
          {upcomingTrips.map((trip, index) => (
            <Card key={index} className="p-3 rounded-[7px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[7px] overflow-hidden">
                  <ImageWithFallback 
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{trip.destination}</h4>
                  <p className="text-sm text-muted-foreground">{trip.dates}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{trip.status}</Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExploreScreen = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Exploria</h2>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">1,250 pts</span>
        </div>
      </div>

      {/* Level Progress */}
      <Card className="p-4 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">Explorer Level 12</h3>
            <p className="text-sm text-muted-foreground">Next level in 350 points</p>
          </div>
          <Badge className="bg-gradient-to-r from-orange-500 to-amber-500">
            Level 12
          </Badge>
        </div>
        <Progress value={75} className="h-2" />
      </Card>

      {/* Active Challenges */}
      <div>
        <h3 className="font-semibold mb-3">Active Challenges</h3>
        <div className="space-y-3">
          {exploriaChallenges.map((challenge, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                  {challenge.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{challenge.title}</h4>
                  <p className="text-sm text-muted-foreground">{challenge.points} points</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{challenge.progress}%</p>
                </div>
              </div>
              <Progress value={challenge.progress} className="h-2" />
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h3 className="font-semibold mb-3">Recent Achievements</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { title: "First Check-in", icon: <MapPin className="w-4 h-4" />, earned: "2 days ago" },
            { title: "Budget Saver", icon: <DollarSign className="w-4 h-4" />, earned: "1 week ago" },
            { title: "Photo Pro", icon: <Camera className="w-4 h-4" />, earned: "2 weeks ago" }
          ].map((achievement, index) => (
            <Card key={index} className="p-3 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                {achievement.icon}
              </div>
              <h4 className="text-xs font-medium mb-1">{achievement.title}</h4>
              <p className="text-xs text-muted-foreground">{achievement.earned}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Friends Leaderboard</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="space-y-2">
          {[
            { name: "Sarah Chen", points: 1520, rank: 1 },
            { name: "You", points: 1250, rank: 2 },
            { name: "Mike Johnson", points: 980, rank: 3 }
          ].map((user, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                user.rank === 1 ? 'bg-yellow-500 text-white' : 
                user.rank === 2 ? 'bg-gray-300 text-gray-700' : 
                'bg-orange-400 text-white'
              }`}>
                {user.rank}
              </div>
              <Avatar className="w-8 h-8">
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
              </div>
              <div className="text-sm font-semibold">{user.points} pts</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderTripsScreen = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Trips</h2>
        <Button size="sm" className="bg-gradient-to-r from-orange-600 to-pink-500">
          <Plus className="w-4 h-4 mr-1" />
          Plan Trip
        </Button>
      </div>

      {/* Trip Planning Tools */}
      <div>
        <h3 className="font-semibold mb-3">Planning Tools</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Navigation className="w-5 h-5" />, title: "Smart Route", desc: "AI-powered navigation" },
            { icon: <Calendar className="w-5 h-5" />, title: "Itinerary Builder", desc: "Personalized schedules" },
            { icon: <Home className="w-5 h-5" />, title: "Find Stays", desc: "Budget to luxury options" },
            { icon: <UtensilsCrossed className="w-5 h-5" />, title: "Food", desc: "Local dining spots" }
          ].map((tool, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-[rgba(142,180,245,0.2)]">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-2 bg-[rgba(0,0,0,0)]">
                  {tool.icon}
                </div>
                <h4 className="font-medium text-sm">{tool.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Current Trip Details */}
      <Card className="p-4 bg-[rgba(255,56,56,0.15)]">
        <h3 className="font-semibold mb-3">Current Trip: Paris</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[7px]">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Itinerary</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[7px]">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Bookmarks</span>
            </div>
            <Badge variant="outline">12 places</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[7px]">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Travel Companions</span>
            </div>
            <Badge variant="outline">3 people</Badge>
          </div>
        </div>
      </Card>

      {/* Trip History */}
      <div>
        <h3 className="font-semibold mb-3">Recent Trips</h3>
        <div className="space-y-3">
          {[
            { destination: "Barcelona, Spain", dates: "Sep 2024", rating: 5 },
            { destination: "Amsterdam, Netherlands", dates: "Jul 2024", rating: 4 },
            { destination: "Prague, Czech Republic", dates: "May 2024", rating: 5 }
          ].map((trip, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{trip.destination}</h4>
                  <p className="text-sm text-muted-foreground">{trip.dates}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(trip.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBudgetScreen = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Budget Tracker</h2>
      </div>

      {/* Detailed Budget Summary */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50">
        <h3 className="font-semibold mb-4 text-center">Paris Trip Budget</h3>
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/70 rounded-[7px] p-3">
              <p className="text-2xl font-bold text-orange-600">${currentTrip.budget}</p>
              <p className="text-xs text-muted-foreground">Total Budget</p>
            </div>
            <div className="bg-white/70 rounded-[7px] p-3">
              <p className="text-2xl font-bold text-green-600">${currentTrip.spent}</p>
              <p className="text-xs text-muted-foreground">Spent</p>
            </div>
            <div className="bg-white/70 rounded-[7px] p-3">
              <p className="text-2xl font-bold text-amber-600">${currentTrip.budget - currentTrip.spent}</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Budget Progress</span>
              <span>{Math.round((currentTrip.spent / currentTrip.budget) * 100)}%</span>
            </div>
            <Progress value={(currentTrip.spent / currentTrip.budget) * 100} className="h-3" />
          </div>
          
          {/* Daily Average */}
          <div className="flex justify-between items-center bg-white/50 rounded-[7px] p-3">
            <span className="text-sm">Daily average so far</span>
            <span className="font-semibold">${Math.round(currentTrip.spent / 3)}</span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-12 border-2 hover:bg-gray-50">
          <Plus className="w-5 h-5 mr-2" />
          Add Manually
        </Button>
        <Button className="h-12 bg-gradient-to-r from-orange-600 to-pink-500 hover:from-orange-700 hover:to-pink-600">
          <Camera className="w-5 h-5 mr-2" />
          Scan Receipt
        </Button>
      </div>

      {/* Detailed Expense Breakdown */}
      <div>
        <h3 className="font-semibold mb-4">Expense Breakdown by Category</h3>
        <div className="space-y-4">
          {[
            { category: "Accommodation", amount: 180, budget: 800, icon: <Home className="w-5 h-5" />, color: "bg-blue-50 text-blue-600", bgColor: "bg-blue-500" },
            { category: "Food & Dining", amount: 150, budget: 600, icon: <UtensilsCrossed className="w-5 h-5" />, color: "bg-orange-50 text-orange-600", bgColor: "bg-orange-500" },
            { category: "Transportation", amount: 80, budget: 400, icon: <Navigation className="w-5 h-5" />, color: "bg-green-50 text-green-600", bgColor: "bg-green-500" },
            { category: "Activities", amount: 40, budget: 500, icon: <Camera className="w-5 h-5" />, color: "bg-amber-50 text-amber-600", bgColor: "bg-amber-500" }
          ].map((expense, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-full ${expense.color} flex items-center justify-center`}>
                  {expense.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold">{expense.category}</h4>
                    <span className="text-sm font-medium">{Math.round((expense.amount / expense.budget) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>${expense.amount} of ${expense.budget}</span>
                    <span>${expense.budget - expense.amount} left</span>
                  </div>
                </div>
              </div>
              <Progress value={(expense.amount / expense.budget) * 100} className="h-2" />
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Transactions</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="space-y-3">
          {[
            { description: "Hotel Le Marais", amount: 120, category: "Accommodation", date: "Dec 10", time: "14:30", icon: <Home className="w-4 h-4" />, color: "text-blue-600" },
            { description: "Café de Flore", amount: 28, category: "Food", date: "Dec 10", time: "12:15", icon: <UtensilsCrossed className="w-4 h-4" />, color: "text-orange-600" },
            { description: "Metro Pass", amount: 15, category: "Transport", date: "Dec 9", time: "09:45", icon: <Navigation className="w-4 h-4" />, color: "text-green-600" },
            { description: "Louvre Museum", amount: 17, category: "Activities", date: "Dec 9", time: "10:30", icon: <Camera className="w-4 h-4" />, color: "text-amber-600" },
            { description: "Boulangerie Patisserie", amount: 12, category: "Food", date: "Dec 8", time: "08:20", icon: <UtensilsCrossed className="w-4 h-4" />, color: "text-orange-600" },
            { description: "Taxi to Airport", amount: 35, category: "Transport", date: "Dec 8", time: "06:00", icon: <Navigation className="w-4 h-4" />, color: "text-green-600" },
            { description: "Seine River Cruise", amount: 25, category: "Activities", date: "Dec 7", time: "16:00", icon: <Camera className="w-4 h-4" />, color: "text-amber-600" }
          ].map((transaction, index) => (
            <Card key={index} className="p-3 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${transaction.color}`}>
                  {transaction.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{transaction.description}</h4>
                  <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date} at {transaction.time}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold">${transaction.amount}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Smart Budget Tip */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          Smart Budget Tip
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          You're 18% under budget for food! Consider trying a Michelin-starred restaurant for a special dinner.
        </p>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">On Track</Badge>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Under Budget</Badge>
        </div>
      </Card>
    </div>
  );

  const renderProfileScreen = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-pink-50 rounded-[7px]">
        <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-white shadow-sm">
          <AvatarImage src="/api/placeholder/80/80" />
          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">AT</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">Alex Thompson</h2>
        <p className="text-sm text-muted-foreground">Wanderlust Explorer • Level 12</p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center p-3 bg-white/70 rounded-[7px] shadow-sm">
            <div className="font-bold text-orange-600">24</div>
            <div className="text-xs text-muted-foreground">Countries</div>
          </div>
          <div className="text-center p-3 bg-white/70 rounded-[7px] shadow-sm">
            <div className="font-bold text-pink-600">1,250</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
          <div className="text-center p-3 bg-white/70 rounded-[7px] shadow-sm">
            <div className="font-bold text-amber-600">48</div>
            <div className="text-xs text-muted-foreground">Badges</div>
          </div>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="p-4 bg-gradient-to-br from-orange-25 to-amber-25 rounded-[7px]">
        <h3 className="font-semibold mb-3 text-orange-800">Account</h3>
        <div className="space-y-2">
          {[
            { icon: <User className="w-4 h-4" />, label: "Edit Profile", action: "chevron", iconColor: "text-orange-600" },
            { icon: <Bell className="w-4 h-4" />, label: "Notifications", action: "chevron", iconColor: "text-amber-600" },
            { icon: <Shield className="w-4 h-4" />, label: "Privacy & Security", action: "chevron", iconColor: "text-pink-600" },
            { icon: <Globe className="w-4 h-4" />, label: "Language", action: "English", iconColor: "text-coral-600" }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/60 hover:bg-white/80 transition-colors rounded-[7px] shadow-sm">
              <div className="flex items-center gap-3">
                <div className={item.iconColor}>{item.icon}</div>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.action === "chevron" ? (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              ) : (
                <span className="text-sm text-muted-foreground">{item.action}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Travel Preferences */}
      <div className="p-4 bg-gradient-to-br from-pink-25 to-orange-25 rounded-[7px]">
        <h3 className="font-semibold mb-3 text-pink-800">Travel Preferences</h3>
        <div className="space-y-2">
          {[
            { icon: <DollarSign className="w-4 h-4" />, label: "Budget Range", value: "Mid-range", iconColor: "text-green-600" },
            { icon: <Users className="w-4 h-4" />, label: "Travel Style", value: "Cultural Explorer", iconColor: "text-purple-600" },
            { icon: <Home className="w-4 h-4" />, label: "Accommodation", value: "Hotels & B&Bs", iconColor: "text-blue-600" },
            { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Cuisine", value: "Local & International", iconColor: "text-orange-600" }
          ].map((pref, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/60 hover:bg-white/80 transition-colors rounded-[7px] shadow-sm">
              <div className="flex items-center gap-3">
                <div className={pref.iconColor}>{pref.icon}</div>
                <span className="font-medium text-sm">{pref.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">{pref.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Support */}
      <div className="p-4 bg-gradient-to-br from-amber-25 to-yellow-25 rounded-[7px]">
        <h3 className="font-semibold mb-3 text-amber-800">Support</h3>
        <div className="space-y-2">
          {[
            { icon: <MessageCircle className="w-4 h-4" />, label: "Help Center", iconColor: "text-blue-600" },
            { icon: <Bot className="w-4 h-4" />, label: "Chat with Tavi", action: () => setIsChatbotOpen(true), iconColor: "text-orange-600" },
            { icon: <Star className="w-4 h-4" />, label: "Rate App", iconColor: "text-yellow-600" },
            { icon: <Share2 className="w-4 h-4" />, label: "Share with Friends", iconColor: "text-pink-600" }
          ].map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-white/60 hover:bg-white/80 transition-colors rounded-[7px] shadow-sm cursor-pointer"
              onClick={item.action}
            >
              <div className="flex items-center gap-3">
                <div className={item.iconColor}>{item.icon}</div>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home': return renderHomeScreen();
      case 'explore': return renderExploreScreen();
      case 'trips': return renderTripsScreen();
      case 'budget': return renderBudgetScreen();
      case 'profile': return renderProfileScreen();
      default: return renderHomeScreen();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Status Bar */}
      <div className="bg-[rgba(242,111,153,0.27)] p-2 text-center border-b">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-orange-600 to-pink-500 rounded-[7px] flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">
            Wayora
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-20">
        {renderCurrentScreen()}
      </div>

      {/* Floating Chat Button */}
      <Button
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg hover:shadow-xl z-20"
        onClick={() => setIsChatbotOpen(true)}
      >
        <Bot className="w-6 h-6" />
      </Button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t">
        <div className="flex items-center justify-around py-2 bg-[rgba(142,180,245,0)]">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'trips', icon: Map, label: 'Trips' },
            { id: 'budget', icon: Wallet, label: 'Budget' },
            { id: 'explore', icon: Gamepad2, label: 'Explore' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentScreen(tab.id as Screen)}
              className={`flex flex-col items-center p-2 rounded-[7px] transition-colors ${
                currentScreen === tab.id 
                  ? 'text-orange-600 bg-orange-50' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chatbot Dialog */}
      <ChatbotDialog 
        open={isChatbotOpen} 
        onOpenChange={setIsChatbotOpen} 
      />
    </div>
  );
}