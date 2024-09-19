import { useEffect, useRef, useState } from "react";
import { FaBell, FaEnvelope } from "react-icons/fa";
import { capitalizeFirstLetter, formatDateTime } from "@/utils/formater";
import useSWR from "swr";
import { fetcher_2 } from "@/utils/helper";
import { apiMarkNotifRead } from "@/lib/apiHelper";
import { Notif } from "@/types/interface";
import { useRouter } from 'next/navigation';

const DropdownNotifications: React.FC<{ user: any, onClick: () => void, isMenuOpen: boolean }> = ({ user, onClick, isMenuOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sortedNotifs, setSortedNotifs] = useState<any[]>([]);
  const router = useRouter();

  const { data: notifications = [] } = useSWR<any>('/api/main/notif/get-notifs-id', (url) => fetcher_2(url, user.id, user.type), {
    revalidateOnFocus: true,
  });

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const unreadNotifs = notifications.filter((notif: any) => !notif.isRead);
      setUnreadCount(unreadNotifs.length);

      const sortedNotifications = notifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setSortedNotifs(sortedNotifications);
    }
  }, [notifications]);

  const markRead = async (notifIds: any[]) => {
    if (notifIds.length > 0) {
      await apiMarkNotifRead(notifIds);
      setUnreadCount(0); 
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    onClick();

    if (unreadCount > 0) {
      const unreadNotifIds = sortedNotifs
        .filter((notif: any) => !notif.isRead)
        .map((notif: any) => notif.id);
      markRead(unreadNotifIds);
    }
  };

  const handleNotifClick = (notif : Notif) => {
    console.log("notif", notif);
    console.log("notif.type", notif.type);
    console.log("notif.receiverId", notif.receiverId);
    switch(notif.type){
      case "task_completed":
      case "task_commented_by_child":
      case "reward_claimed":
      case "reward_commented_by_child":
        router.push(`/main/child/${notif.receiverId}`); 
        break;
      case "task_assigned":
      case "task_commented_by_parent":
        router.push("/main/home");
        break;
      case "task_approved":
        router.push(`/main/child/${user.userId}`);
      case "reward_added": 
      case "reward_commented_by_parent":
        console.log("push");
        router.push('/main/rewards');
        break;
      case "reward_approved":
        router.push(`/main/child/${user.userId}`);
    }
  }


  useEffect(() => {
    if (isMenuOpen) setIsDropdownOpen(false);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 relative"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-light-primary dark:bg-dark-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {isDropdownOpen && (
        <div  ref={dropdownRef} 
        className="absolute right-[-50px] mt-3 w-72 h-[32rem] bg-light-background dark:bg-dark-background border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 overflow-y-scroll scrollbar-hide">
        <div className="py-2">
            {sortedNotifs.length === 0 ? (
              <p className="text-center text-light-text dark:text-dark-text">No notifications</p>
            ) : (
              sortedNotifs.map((notif: any) => (
                <div onClick={() => {handleNotifClick(notif)}}
                  key={notif.id}
                  className="flex items-start p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-light-accent dark:hover:bg-dark-accent text-light-text dark:text-dark-text hover:text-dark-text  transition-colors duration-300 cursor-pointer"
                >
                  <div className="mr-3 text-xl text-light-primary dark:text-dark-primary">
                    {notif.icon ? notif.icon : <FaEnvelope />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{capitalizeFirstLetter(notif.title)}</p>
                    <div className="flex flex-row mb-1">
                      <p className="text-base mr-1">{capitalizeFirstLetter(notif.content)}</p>
                      {notif.description && notif.description !== null && notif.description !== undefined && notif.description !== "undefined" 
                      && notif.description !== "null" && notif.description.trim() !== '' 
                      && <p className="text-base">: {notif.description}</p>}
                    </div>
                    <p className="text-xs">
                      {capitalizeFirstLetter(formatDateTime(new Date(notif.createdAt)))}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownNotifications;
