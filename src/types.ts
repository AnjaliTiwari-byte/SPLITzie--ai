export interface Friend {
  id: string;
  name: string;
  avatarSeed: string;
  color: string;
  shareAmount: number;
  sharePercentage: number;
  items: string[];
  isPaid: boolean;
  isHighestPayer?: boolean;
  upiOrHandle?: string;
}

export interface BillState {
  occasionName: string;
  billAmount: number;
  peopleCount: number;
  tipPercent: number;
  taxPercent: number;
  discountAmount: number;
  currency: string;
  foodItems: string[];
  friends: Friend[];
  splitMode: 'equal' | 'custom';
  highestPayerId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  matchPercentage: number;
  location: string;
  distance: string;
  avgPerPerson: number;
  savingsPercent: number;
  cuisine: string;
  image: string;
  discountCode: string;
  popularItems: string[];
  tagline: string;
}

export interface ChatAction {
  id: string;
  label: string;
  actionType: 'set_tip' | 'mark_paid' | 'add_food' | 'settle_all' | 'roll_tip_roulette' | 'copy_text';
  payload?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  actions?: ChatAction[];
  isStreaming?: boolean;
}
