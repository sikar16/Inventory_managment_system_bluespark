import { useState } from "react";
import { Link } from "react-router-dom";
import List from "@mui/material/List";

const WarehouseSidebar = () => {
  const [currentView, setCurrentView] = useState("");

  const handleToggleView = (view: string) => {
    setCurrentView(currentView === view ? "" : view);
  };

  return (
    <>
      <List>
        <nav
          className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
          data-hs-accordion-always-open
        >
          <ul className="space-y-1.5">
            <li>
              <Link
                to="/warehouse/dashbord"
                onClick={() => handleToggleView("dashbord")}
              >
                <a
                  className="flex items-center gap-x-3.5 py-[5px] px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-[#002A47] hover:text-white dark:bg-neutral-700 dark:text-white"
                  href="#"
                >
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Dashboard
                </a>
              </Link>
            </li>
            <li className="hs-accordion" id="users-accordion">
              <Link
                to="/warehouse/inventory"
                onClick={() => handleToggleView("incoming-requests")}
              >
                <button
                  type="button"
                  className="hs-accordion-toggle hs-accordion-active:text-[#002a47] hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-[5px] px-2.5 text-sm text-gray-700 rounded-lg hover:bg-[#002A47] hover:text-white focus:outline-none  dark:bg-neutral-800 dark:text-neutral-400 dark:hs-accordion-active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                  aria-expanded="true"
                  aria-controls="users-accordion"
                >
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Inventory
                </button>
              </Link>
            </li>
            <li className="hs-accordion" id="users-accordion">
              <Link
                to="/warehouse/stoke"
                onClick={() => handleToggleView("purchase-requests")}
              >
                <button
                  type="button"
                  className="hs-accordion-toggle hs-accordion-active:text-[#002a47] hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-[5px] px-2.5 text-sm text-gray-700 rounded-lg hover:bg-[#002A47] hover:text-white focus:outline-none  dark:bg-neutral-800 dark:text-neutral-400 dark:hs-accordion-active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                  aria-expanded="true"
                  aria-controls="users-accordion"
                >
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 9.5q-.425 0-.712-.288T11 8.5t.288-.712T12 7.5t.713.288T13 8.5t-.288.713T12 9.5M11 6V1h2v5zM7 22q-.825 0-1.412-.587T5 20t.588-1.412T7 18t1.413.588T9 20t-.587 1.413T7 22m10 0q-.825 0-1.412-.587T15 20t.588-1.412T17 18t1.413.588T19 20t-.587 1.413T17 22M1 4V2h3.275l4.25 9h7l3.9-7H21.7l-4.4 7.95q-.275.5-.737.775T15.55 13H8.1L7 15h12v2H7q-1.125 0-1.713-.975T5.25 14.05L6.6 11.6L3 4z"
                    ></path>
                  </svg>
                  Stoke
                </button>
              </Link>
            </li>

            <li className="hs-accordion" id="users-accordion">
              <Link
                to="/warehouse/report"
                onClick={() => handleToggleView("report")}
              >
                <button
                  type="button"
                  className="hs-accordion-toggle hs-accordion-active:text-[#002a47] hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-[5px] px-2.5 text-sm text-gray-700 rounded-lg hover:bg-[#002A47] hover:text-white focus:outline-none  dark:bg-neutral-800 dark:text-neutral-400 dark:hs-accordion-active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                  aria-expanded="true"
                  aria-controls="users-accordion"
                >
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="currentColor"
                      d="M4 26h4v4H4zm10 0h4v4h-4zm10 0h4v4h-4zm1-8h-8v-2h-2v2H7c-1.103 0-2 .898-2 2v4h2v-4h8v4h2v-4h8v4h2v-4c0-1.102-.897-2-2-2M20 2h-8c-1.103 0-2 .898-2 2v8c0 1.103.897 2 2 2h8c1.103 0 2-.897 2-2V4c0-1.102-.897-2-2-2m-1.414 2L12 10.586V4zm-5.172 8L20 5.414L20.001 12z"
                    ></path>
                  </svg>
                  Report
                </button>
              </Link>
            </li>
          </ul>
        </nav>
      </List>
    </>
  );
};

export default WarehouseSidebar;
