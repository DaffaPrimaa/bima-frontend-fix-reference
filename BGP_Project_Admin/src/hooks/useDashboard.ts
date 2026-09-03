import { useState, useEffect, useMemo } from "react";
import {
  decodeUserToken,
  getTimeBasedGreeting,
} from "../Utils/dashboardHelpers";
import { DASHBOARD_MENU_ITEMS } from "../constants/menuItems";
import type { UserPayload } from "../types/dashboard";

export const useDashboard = () => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const userData = decodeUserToken();
    if (userData) {
      setUser(userData);
    }
    setGreeting(getTimeBasedGreeting());
  }, []);

  const filteredMenuItems = useMemo(() => {
    if (!user) return [];
    return DASHBOARD_MENU_ITEMS.filter((item) =>
      item.allowedRoles.includes(user.role),
    );
  }, [user]);

  return {
    user,
    greeting,
    filteredMenuItems,
  };
};
