import type { Announcement } from "../../types/announcement";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { IoIosCalendar } from "react-icons/io";
interface PengumumanCardProps {
  item: Announcement;
  onPressEdit?: (item: Announcement) => void;
  onPressDelete?: (item: Announcement) => void;
  hideActions?: boolean;
}

export const PengumumanCard = ({
  item,
  onPressEdit,
  onPressDelete,
  hideActions = false,
}: PengumumanCardProps) => {
  const dateObj = new Date(item.datetime);
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="card-container flex flex-row items-start justify-between p-5 rounded-2xl border border-[#E4E9F7]">
      <div className="left-side flex flex-row items-start gap-4">
        <div className="bg-[#DBEAFE] p-2.5 rounded-lg">
          <IoIosCalendar className="w-6 h-6 text-[#122C93]" />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-semibold">{item.title}</h2>
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-2">
              <IoLocationOutline className="text-md text-[#122C93]" />
              <h2 className="text-xs text-[#122C93]">{item.location}</h2>
            </div>
            <div className="flex flex-row items-center gap-2">
              <GoClock className="text-md text-[#6B6B6B]" />
              <h2 className="text-xs text-[#6B6B6B]">
                {formattedDate}, {formattedTime} WIB
              </h2>
            </div>
          </div>
          <h2 className="text-xs">{item.description}</h2>
          <div className="assign-to">
            <h2 className="text-xs bg-[#DBEAFE] px-3 py-1 border border-[#122C93] font-light rounded-full">
              {item.recipient_type === "all_client" ? "Seluruh Satpam" : "Client"}
            </h2>
          </div>
        </div>
      </div>
      {!hideActions && (
        <div className="flex justify-center gap-2">
          <button
            className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] cursor-pointer"
            onClick={() => onPressEdit && onPressEdit(item)}
          >
            <FaRegEdit className="text-base" />
          </button>
          <button
            className="border border-[#C7D2FE] text-[#A70202] rounded-lg p-2 hover:bg-[#FDEDED] cursor-pointer"
            onClick={() => onPressDelete && onPressDelete(item)}
          >
            <FaRegTrashAlt className="text-base" />
          </button>
        </div>
      )}
    </div>
  );
};
