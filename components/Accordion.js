"use client";

import { useState } from "react";

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div style={{ maxWidth: "760px", marginInline: "auto" }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className={`accordion-item${isOpen ? " open" : ""}`}>
            <button
              className="accordion-trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
            >
              {item.q}
              <span className="plus">+</span>
            </button>
            <div
              className="accordion-panel"
              style={{ maxHeight: isOpen ? "200px" : "0px" }}
            >
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
