export const getStatusColor = (status: string): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/30 text-yellow-300";
    case "confirmed":
      return "bg-emerald-500/30 text-emerald-300";
    case "cancelled":
      return "bg-red-500/30 text-red-300";
    default:
      return "bg-gray-500/30 text-gray-300";
  }
};