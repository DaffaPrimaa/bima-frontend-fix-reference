import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
import type { MenuItem } from "../../types/dashboard";

interface DashboardCardProps {
  item: MenuItem;
  onClick: (path: string) => void;
}

export const DashboardCard = ({ item, onClick }: DashboardCardProps) => {
  return (
    <Card
      isPressable
      onPress={() => onClick(item.path)}
      className="border border-gray-200 hover:scale-[1.02] transition-transform duration-200 h-full"
      shadow="sm"
    >
      <CardHeader className="flex gap-4 px-6 pt-6 items-start">
        <div
          className={`p-3 rounded-lg ${item.color} shadow-md flex items-center justify-center min-w-[48px] min-h-[48px]`}
        >
          {item.icon}
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-bold text-gray-800 leading-tight">
            {item.title}
          </p>
        </div>
      </CardHeader>
      <CardBody className="px-6 py-2">
        <p className="text-small text-gray-500 line-clamp-2">{item.desc}</p>
      </CardBody>
      <CardFooter className="px-6 pb-6 pt-2 mt-auto">
        <Button
          size="sm"
          variant="flat"
          color="primary"
          className="w-full font-semibold bg-[#122C93]/10 text-[#122C93]"
          onPress={() => onClick(item.path)}
        >
          Buka Menu
        </Button>
      </CardFooter>
    </Card>
  );
};
