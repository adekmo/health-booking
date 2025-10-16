import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";


interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 text-gray-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

export default StatsCard