export interface Person {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  paidBy: string; // Person id
  sharedBy: string[]; // Array of Person ids
}

export interface PersonSummary {
  name: string;
  paid: number;
  owes: number;
  items: string[];
  balance: number;
}

export interface Payment {
  from: string;
  to: string;
  amount: number;
}
