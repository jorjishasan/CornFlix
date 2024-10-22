import { useState } from "react";
import { LOGO } from "../utils/constants";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleAiSearchComponent } from "../redux/aiSearchSlice";
import lang from "../config/languages";
import { switchLanguage } from "../redux/langSlice";
import aiIcon from "../assets/magicoon.svg";

const Header = () => {
  const user = useSelector((store) => store.user);
  const showAiSearchComponent = useSelector(
    (store) => store.aiSearch.showAiSearchComponent,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch((error) => console.error("Sign out error:", error));
  };

  const handleAiSearchComponent = () => {
    dispatch(toggleAiSearchComponent());
  };

  const handleDropDown = (event) => {
    dispatch(switchLanguage(event.target.value));
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="absolute z-50 w-full bg-gradient-to-b from-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <img className="h-8 w-auto sm:h-10" src={LOGO} alt="MovieDock" />

          <div className="flex items-center space-x-4">
            {showAiSearchComponent && (
              <select
                id="language-dropdown"
                name="language"
                className="rounded bg-gray-800 p-2 text-sm text-white sm:text-base"
                onChange={handleDropDown}
              >
                {Object.keys(lang).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            )}

            {user && (
              <button
                className="group flex items-center justify-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base lg:px-5 lg:py-2.5"
                onClick={handleAiSearchComponent}
              >
                <img
                  src={aiIcon}
                  alt=""
                  className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                />
                <span className="xs:inline hidden">AI</span>
                <span className="hidden sm:inline">Search</span>
              </button>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.photoURL}
                  alt=""
                />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {user.displayName}
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Settings
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:px-6 sm:text-base"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
