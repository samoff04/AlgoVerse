import { Binary, GitBranch, Network, ListTree, Hash, Boxes } from "lucide-react";
import { useEffect, useState } from "react";

const icons = [Binary, GitBranch, Network, ListTree, Hash, Boxes];

export function FloatingIcons() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(
      Array.from({ length: 10 }).map(() => ({
        Icon: icons[Math.floor(Math.random() * icons.length)],
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 100}%`,
        size: 18 + Math.random() * 22,
        duration: 5 + Math.random() * 4,
        delay: Math.random() * 3,
        opacity: 0.12 + Math.random() * 0.18,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{ top: item.top, left: item.left, animationDuration: `${item.duration}s`, animationDelay: `${item.delay}s` }}
        >
          <item.Icon size={item.size} style={{ opacity: item.opacity }} className="text-purple-300" />
        </div>
      ))}
    </div>
  );
}