"use client";

import React, { useState, useEffect } from 'react';
import { CalendarScreen } from '@/components/calendar/Calendar';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 860);
    const on = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  return <CalendarScreen isMobile={isMobile} />;
}
