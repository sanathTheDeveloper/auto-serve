import React from "react";
import {
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Shield,
} from "lucide-react";

interface PaymentDetails {
  totalAmount: number;
  depositAmount?: number;
  remainingAmount?: number;
  paidAmount: number;
  escrowStatus: "holding" | "released" | "refunded";
  paymentMethod: string;
  transactionId: string;
  paidAt: string;
  releasedAt?: string;
}

interface PaymentStatusBadgeProps {
  paymentStatus: "pending" | "deposit_paid" | "fully_paid" | "released";
  paymentDetails: PaymentDetails;
  size?: "sm" | "md" | "lg";
  showAmount?: boolean;
}

export function PaymentStatusBadge({
  paymentStatus,
  paymentDetails,
  size = "md",
  showAmount = true,
}: PaymentStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (paymentStatus) {
      case "pending":
        return {
          text: "Payment Pending",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="w-3 h-3" />,
        };
      case "deposit_paid":
        return {
          text: showAmount 
            ? `Deposit Paid ($${paymentDetails.paidAmount.toFixed(0)})`
            : "Deposit Paid",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <DollarSign className="w-3 h-3" />,
        };
      case "fully_paid":
        return {
          text: showAmount 
            ? `Paid in Full ($${paymentDetails.paidAmount.toFixed(0)})`
            : "Paid in Full",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="w-3 h-3" />,
        };
      case "released":
        return {
          text: "Payment Released",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: <CheckCircle className="w-3 h-3" />,
        };
      default:
        return {
          text: "Unknown Status",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <AlertTriangle className="w-3 h-3" />,
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-0.5";
      case "lg":
        return "text-sm px-4 py-2";
      default:
        return "text-xs px-3 py-1";
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.color} ${getSizeClasses()}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}

interface EscrowStatusBadgeProps {
  escrowStatus: "holding" | "released" | "refunded";
  size?: "sm" | "md" | "lg";
}

export function EscrowStatusBadge({ escrowStatus, size = "md" }: EscrowStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (escrowStatus) {
      case "holding":
        return {
          text: "Escrow Protected",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          icon: <Shield className="w-4 h-4 text-blue-600" />,
        };
      case "released":
        return {
          text: "Funds Released",
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        };
      case "refunded":
        return {
          text: "Refunded",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          icon: <Shield className="w-4 h-4 text-purple-600" />,
        };
      default:
        return {
          text: "No Protection",
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          icon: <AlertTriangle className="w-4 h-4 text-gray-500" />,
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1";
      case "lg":
        return "text-sm px-4 py-2";
      default:
        return "text-xs px-3 py-1.5";
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-lg font-medium ${config.bgColor} ${config.color} ${getSizeClasses()}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}