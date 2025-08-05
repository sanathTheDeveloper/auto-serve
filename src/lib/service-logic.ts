interface ServiceEntry {
  id: string;
  date: string;
  serviceType: string;
  mechanicName: string;
  mechanicAddress: string;
  totalCost: number;
  odometer: number;
  status: "completed" | "in-progress" | "cancelled";
  items: ServiceItem[];
  notes?: string;
  warranty?: string;
}

interface ServiceItem {
  name: string;
  price: number;
  category: "parts" | "labor" | "fees";
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  odometer: number;
  color?: string;
  licensePlate?: string;
  serviceHistory: ServiceEntry[];
}

export type ServiceStatus = 'Up to Date' | 'Due Soon' | 'Overdue';

export interface ServiceStatusResult {
  status: ServiceStatus;
  message: string;
  kmUntilService: number;
  daysUntilService: number;
  progressPercentage: number; // 0-100, where 100 means service is due
}

// Australian service standards
const SERVICE_INTERVAL_KM = 10000; // 10,000 km
const SERVICE_INTERVAL_MONTHS = 6; // 6 months

export function calculateNextService(vehicle: Vehicle): ServiceStatusResult {
  const currentOdometer = vehicle.odometer;
  const now = new Date();
  
  // Get the most recent completed service
  const completedServices = vehicle.serviceHistory
    .filter(service => service.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (completedServices.length === 0) {
    // No service history - assume needs service
    return {
      status: 'Overdue',
      message: 'Service history needed',
      kmUntilService: 0,
      daysUntilService: 0,
      progressPercentage: 100
    };
  }
  
  const lastService = completedServices[0];
  const lastServiceDate = new Date(lastService.date);
  const lastServiceOdometer = lastService.odometer;
  
  // Calculate km since last service
  const kmSinceService = currentOdometer - lastServiceOdometer;
  const kmUntilService = SERVICE_INTERVAL_KM - kmSinceService;
  
  // Calculate time since last service
  const daysSinceService = Math.floor((now.getTime() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilService = (SERVICE_INTERVAL_MONTHS * 30) - daysSinceService;
  
  // Calculate progress percentage based on the more critical factor
  const kmProgressPercentage = Math.min((kmSinceService / SERVICE_INTERVAL_KM) * 100, 100);
  const timeProgressPercentage = Math.min((daysSinceService / (SERVICE_INTERVAL_MONTHS * 30)) * 100, 100);
  const progressPercentage = Math.max(kmProgressPercentage, timeProgressPercentage);
  
  // Determine status based on both criteria
  const isKmOverdue = kmSinceService >= SERVICE_INTERVAL_KM;
  const isTimeOverdue = daysSinceService >= (SERVICE_INTERVAL_MONTHS * 30);
  const isKmDueSoon = kmSinceService >= (SERVICE_INTERVAL_KM * 0.8); // Due soon at 80%
  const isTimeDueSoon = daysSinceService >= (SERVICE_INTERVAL_MONTHS * 30 * 0.8);
  
  if (isKmOverdue || isTimeOverdue) {
    const overdueDays = Math.max(0, -daysUntilService);
    const overdueKm = Math.max(0, -kmUntilService);
    
    let message = 'Service overdue';
    if (overdueKm > 0 && overdueDays > 0) {
      message = `Overdue by ${overdueKm.toLocaleString()} km and ${Math.floor(overdueDays / 7)} weeks`;
    } else if (overdueKm > 0) {
      message = `Overdue by ${overdueKm.toLocaleString()} km`;
    } else if (overdueDays > 0) {
      message = `Overdue by ${Math.floor(overdueDays / 7)} weeks`;
    }
    
    return {
      status: 'Overdue',
      message,
      kmUntilService,
      daysUntilService,
      progressPercentage: Math.min(progressPercentage, 100)
    };
  }
  
  if (isKmDueSoon || isTimeDueSoon) {
    let message = '';
    if (kmUntilService > 0 && daysUntilService > 0) {
      const weeksUntil = Math.floor(daysUntilService / 7);
      message = `Due in ${kmUntilService.toLocaleString()} km or ${weeksUntil} weeks`;
    } else if (kmUntilService > 0) {
      message = `Due in ${kmUntilService.toLocaleString()} km`;
    } else {
      const weeksUntil = Math.floor(daysUntilService / 7);
      message = `Due in ${weeksUntil} weeks`;
    }
    
    return {
      status: 'Due Soon',
      message,
      kmUntilService,
      daysUntilService,
      progressPercentage
    };
  }
  
  // Service is up to date
  const nextServiceKm = kmUntilService;
  const nextServiceWeeks = Math.floor(daysUntilService / 7);
  
  return {
    status: 'Up to Date',
    message: `Next service in ${nextServiceKm.toLocaleString()} km or ${nextServiceWeeks} weeks`,
    kmUntilService,
    daysUntilService,
    progressPercentage
  };
}

export function getStatusColor(status: ServiceStatus): string {
  switch (status) {
    case 'Up to Date':
      return 'text-green-600';
    case 'Due Soon':
      return 'text-yellow-600';
    case 'Overdue':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getStatusBadgeColor(status: ServiceStatus): string {
  switch (status) {
    case 'Up to Date':
      return 'bg-green-50 text-green-600 border-green-200';
    case 'Due Soon':
      return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    case 'Overdue':
      return 'bg-red-50 text-red-600 border-red-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

export function getStatusDotColor(status: ServiceStatus): string {
  switch (status) {
    case 'Up to Date':
      return 'bg-green-500';
    case 'Due Soon':
      return 'bg-yellow-500';
    case 'Overdue':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}