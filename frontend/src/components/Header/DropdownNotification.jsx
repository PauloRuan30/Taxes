import React, { useState } from "react";
import { Link } from "react-router-dom";
import ClickOutside from "../ClickOutside";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full bg-gray"
        >
          {notifying && (
            <span className="absolute -top-0.5 right-0 h-2 w-2 rounded-full bg-meta-1"></span>
          )}
        </Link>

        {dropdownOpen && (
          <div className="absolute mt-2.5 w-80 rounded-sm border bg-white dark:bg-boxdark">
            <ul className="py-3">
              <li>
                <Link to="#" className="px-4 py-3 hover:bg-gray-200">
                  New notification available!
                </Link>
              </li>
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
