export interface TransportData {
  vehicle_number: string;
  route_name: string;
  driver_name: string;
  driver_number: string | null;
  helper_name: string | null;
  helper_number: string | null;
  pickup_location: string;
  monthly_fee: string;
}

export interface TransportApiResponse {
  status: boolean;
  data: TransportData;
  message?: string;
}