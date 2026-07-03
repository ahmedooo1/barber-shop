"use client";

import { useState } from "react";
import { ScissorsIcon, RazorIcon, BuildingIcon, DropIcon } from "./Icons";

const ICONS = { coupes: ScissorsIcon, barbe: RazorIcon, salon: BuildingIcon, soins: DropIcon };
const FILTERS = [
  { key: "all", label: "Tout" },
  { key: "coupes", label: "Coupes" },
  { key: "barbe", label: "Barbe" },
  { key: "salon", label: "Salon" },
];

export default function GalleryFilter({ tiles }) {
  const [active, setActive] = useState("all");

  return (
    <>
      <div className="gallery-filter">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-btn${active === f.key ? " active" : ""}`}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-4">
        {tiles.map((tile, i) => {
          const Icon = ICONS[tile.cat] || ScissorsIcon;
          const hidden = active !== "all" && active !== tile.cat;
          return (
            <div key={i} className={`tile${hidden ? " hide" : ""}`}>
              {tile.photo && (
                <img
                  className="photo-fill"
                  src={`https://images.unsplash.com/${tile.photo}?q=80&w=600&auto=format&fit=crop`}
                  alt={tile.label}
                  loading="lazy"
                />
              )}
              <span className="tile-icon"><Icon width="20" height="20" /></span>
              <div>
                <span className="tile-cat">{tile.catLabel}</span>
                <span className="tile-label">{tile.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
