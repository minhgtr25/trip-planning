export type ItineraryItem = {
  id: string;
  time: string;
  activity: string;
  location: string;
  link: string;
  notes: string;
  done: boolean;
};

export type ItineraryDay = {
  id: string;
  date: string; // ISO date of the day (no time)
  items: ItineraryItem[];
};

export type BudgetItem = {
  id: string;
  category: 'Ăn uống' | 'Di chuyển' | 'Chỗ ở' | 'Vui chơi' | 'Khác';
  estimated: number;
  actual: number;
  payer: string;
  notes: string;
};

export type PackingItem = {
  id: string;
  item: string;
  quantity: number;
  category: 'Giấy tờ' | 'Điện tử' | 'Quần áo' | 'Vệ sinh' | 'Sức khỏe' | 'Khác';
  packed: boolean;
  assignee: string;
};

export type TripData = {
  name: string;
  startDate: string;
  location: string;
  imageUrl?: string;
  itinerary: ItineraryDay[];
  budget: BudgetItem[];
  packing: PackingItem[];
  participants: string[];
};
