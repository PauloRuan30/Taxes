import React from "react";
import useColorMode from "../../hooks/UseColorMode";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <li>
      <label
        className={`relative block h-7.5 w-14 rounded-full ${
          colorMode === "dark" ? "bg-primary" : "bg-stroke"
        }`}
      >
        <input
          type="checkbox"
          onChange={() => setColorMode(colorMode === "light" ? "dark" : "light")}
          className="absolute top-0 left-0 h-full w-full opacity-0"
        />
        <span
          className={`absolute left-[3px] top-1/2 h-6 w-6 transform -translate-y-1/2 rounded-full bg-white ${
            colorMode === "dark" && "translate-x-full"
          }`}
        ></span>
      </label>
    </li>
  );
};

export default DarkModeSwitcher;
