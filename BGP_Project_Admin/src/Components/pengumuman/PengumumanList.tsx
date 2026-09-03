import { Spinner, Pagination } from "@heroui/react";
import type { Announcement } from "../../types/announcement";
import { PengumumanCard } from "./PengumumanCard";

interface PengumumanListProps {
  data: Announcement[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  userRole: string;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (item: Announcement) => void;
  onDelete: (item: Announcement) => void;
}

export const PengumumanList = ({
  data,
  loading,
  hasMore,
  currentPage,
  userRole,
  onNextPage,
  onPrevPage,
  onEdit,
  onDelete,
}: PengumumanListProps) => {
  return (
    <>
      <div className="main-content flex flex-col p-2.5 gap-2 rounded-2xl border border-[#E4E9F7] bg-white">
        {loading && data.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px] p-4">
            <Spinner size="lg" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px] p-4 text-gray-500">
            Tidak ada pengumuman
          </div>
        ) : (
          data.map((item) => (
            <PengumumanCard
              key={item.uuid}
              item={item}
              onPressEdit={onEdit}
              onPressDelete={onDelete}
              hideActions={userRole === "client"}
            />
          ))
        )}
      </div>

      <div className="flex w-full justify-center items-center px-4 py-2 mt-2">
        <Pagination
          showControls
          page={currentPage}
          total={Math.max(currentPage + (hasMore ? 1 : 0), 1)}
          onChange={(page) => {
            if (page > currentPage) onNextPage();
            else if (page < currentPage) onPrevPage();
          }}
          classNames={{
            item: "[&:not([data-active=true])]:hidden",
          }}
        />
      </div>
    </>
  );
};
