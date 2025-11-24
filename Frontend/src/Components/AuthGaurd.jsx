import { useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

export default function AuthGuard({ children }) {
  const { pathname } = useLocation();
  const searchParam = useParams();
  const navigate = useNavigate();
  const [requestedLocation, setRequestedLocation] = useState(null);
  const menuItems = JSON.parse(localStorage.getItem('menuList'));
  console.log('menuItems', menuItems);
  const flattenedMenu = menuItems?.flatMap((item) => [
    { ...item, children: item?.children?.map((c) => c?.id) },
    ...item?.children
  ]);
  console.log('pt', flattenedMenu);

  const path = flattenedMenu
    ?.map((item) => {
      if (item?.path?.includes(':id')) {
        return item?.path?.replace(':id', searchParam?.id);
      }
      return item?.path;
    })
    ?.flat(1);

  const logout = () => {
    localStorage.clear(); // Clear user data
    window.location.replace('/ptms'); // Redirect to login without reload
  };

  if (!menuItems) {
    return (
      <div className="font-bold text-lg italic h-screen w-screen flex items-center justify-center">
        Please wait...
      </div>
    );
  }

  if (!path?.includes(pathname)) {
    return (
      <div className="flex h-screen flex-col">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-gray-600">
              403
              <span className="text-lg font-medium text-gray-400"> | </span>
              Unauthorized
            </h1>
            {/* Log out Buttons */}
            <button
              onClick={logout}
              className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
