import React from "react";
import { createRoot } from "react-dom/client";
import Lanyard from "./Lanyard";

export function mountLanyard(element) {

  const root = createRoot(element);

  root.render(
    <React.StrictMode>
      <Lanyard position={[0,0,20]} gravity={[0,-40,0]} />
    </React.StrictMode>
  );

}