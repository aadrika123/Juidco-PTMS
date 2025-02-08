import { useLocation } from "react-router-dom";

import { FaArrowLeftLong } from "react-icons/fa6";

import useSetTitle from "../../assets/common/useSetTitle";
// import useSetTitle from "../../Common/useSetTitle"

function TitleBar(props) {
  const routeLocation = useLocation();
  useSetTitle("Verification");

  const backFunction = () => {
    const currentURL = window.location.href;
    const referrerURL = document.referrer;
    if (currentURL !== referrerURL) {
      window.history.replaceState(null, null, ""); // Remove current URL from history
      window.history.back(); // Navigate back in history
    } else {
      // Do nothing if current URL is the same as referrer URL
      console.log("Already at the previous page.");
    }
  };

  if (
    routeLocation.pathname == "/" ||
    (routeLocation?.pathname == "/login" &&
      routeLocation?.pathname == "/mobile-modules")
  ) {
    return;
  }

  if (props?.titleBarVisibility === false) {
    return;
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-center items-center pr-2 z-40 pb-2">
          <div className="flex-1 flex pl-2 text-gray-700">
            <span
              className="cursor-pointer hover:text-[#122031] text-[#1A4D8C]"
              onClick={backFunction}
            >
              <FaArrowLeftLong className="inline font-semibold mr-1" />
              Back
            </span>
          </div>
          <div className="flex justify-right items-center text-xl font-semibold text-[#1A4D8C]"></div>
          <h1 className="text-lg font-bold">{props?.titleText}</h1>
        </div>
        <hr className="" />
      </div>
    </>
  );
}

export default TitleBar;
