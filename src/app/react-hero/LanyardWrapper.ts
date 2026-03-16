import React from "react";
import { createRoot } from "react-dom/client";
import Lanyard from "./Lanyard";

export function mountLanyard(element: HTMLElement) {

  const root = createRoot(element);

  root.render(
    React.createElement(Lanyard, {
      position: [0,0,20],
      gravity: [0,-40,0]
    })
  );

}