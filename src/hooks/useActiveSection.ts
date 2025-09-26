import { useEffect, useState } from "react";

const SECTION_IDS = [
  "map-success",
  "specifications",
  "big-picture",
  "benefits",
  "data-visualization",
  "contact"
];

export function useActiveSection() {
  const [active, setActive] = useState(SECTION_IDS[0]);

  useEffect(() => {
    const handleScroll = () => {
      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) {
            current = id;
          }
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return active;
}
