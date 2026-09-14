import React from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

interface Stat {
  Icon: SvgIconComponent;
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { Icon: ShoppingCartOutlinedIcon, value: "10,000+", label: "Accounts Listed" },
  { Icon: GroupsOutlinedIcon,        value: "2,500+",  label: "Happy Customers" },
  { Icon: VerifiedUserOutlinedIcon,  value: "98%",     label: "Successful Transfers" },
  { Icon: ScheduleOutlinedIcon,      value: "24/7",    label: "Customer Support" },
];

export default function StatsRibbon() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y-0 md:divide-x divide-gray-100">
        {STATS.map(({ Icon, value, label }, index) => (
          <div
            key={label}
            className={`flex items-center gap-4 ${index > 0 && index < 2 ? "pt-6 md:pt-0" : ""} ${index >= 2 ? "pt-6 md:pt-0" : ""} md:pl-6 first:pl-0`}
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF4500] shrink-0">
              <Icon className="!text-[28px]" aria-hidden="true" />
            </div>
            <div>
              <dd className="text-xl sm:text-2xl font-black text-gray-900">{value}</dd>
              <dt className="text-xs text-gray-500 font-medium">{label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
