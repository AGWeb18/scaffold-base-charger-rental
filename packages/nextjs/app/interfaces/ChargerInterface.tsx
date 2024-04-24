export interface Charger {
  charger_id: string;
  created_at: string;
  location_name: string;
  pricePerHour: string;
  open_hour: number; // Represents the hour the charger becomes available
  close_hour: number; // Represents the hour the charger stops being available
  user_id: string;
  precise_long: number;
  precise_lat: number;
  approx_long: number;
  approx_lat: number;
  is_available: boolean;
}
