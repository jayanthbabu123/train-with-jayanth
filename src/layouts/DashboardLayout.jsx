import { Fragment, useState } from 'react';
import { Dialog, Transition, Menu } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  UserCircleIcon,
  CodeBracketIcon,
  UserIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const trainerNavigation = [
  { name: 'Dashboard', href: '/trainer/dashboard', icon: HomeIcon },
  { name: 'Batches', href: '/trainer/batches', icon: UserGroupIcon },
  { name: 'Materials', href: '/trainer/materials', icon: DocumentTextIcon },
  { name: 'Assignments', href: '/trainer/assignments', icon: ClipboardDocumentListIcon },
];

const studentNavigation = [
  { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
  { name: 'Courses', href: '/student/courses', icon: BookOpenIcon },
  { name: 'Assignments', href: '/student/assignments', icon: ClipboardDocumentListIcon },
  { name: 'Practice', href: '/student/practice', icon: CodeBracketIcon },
  { name: 'Profile', href: '/student/profile', icon: UserIcon },
];

const Logo = () => (
  <div className="flex items-center">
    <div className="relative flex items-center justify-center w-10 h-10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] rounded-xl transform rotate-45"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xl font-bold transform -rotate-45">TJ</span>
      </div>
    </div>
    <div className="ml-3">
      <span className="text-xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#1e3a8a] bg-clip-text text-transparent">
        TrainWith
      </span>
      <span className="text-xl font-bold bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] bg-clip-text text-transparent">
        Jayanth
      </span>
    </div>
  </div>
);

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Choose navigation based on role
  const navigation = currentUser?.role === 'trainer' ? trainerNavigation : studentNavigation;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-xl">
                  <div className="flex h-16 shrink-0 items-center">
                    <Logo />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={`
                                  group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200
                                  ${location.pathname === item.href
                                    ? 'bg-[#3b82f6]/10 text-[#3b82f6] shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#3b82f6]'
                                  }
                                `}
                              >
                                <item.icon
                                  className={`h-6 w-6 shrink-0 ${
                                    location.pathname === item.href
                                      ? 'text-[#3b82f6]'
                                      : 'text-gray-400 group-hover:text-[#3b82f6]'
                                  }`}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 shadow-lg">
          <div className="flex h-16 shrink-0 items-center">
            <Logo />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200
                          ${location.pathname === item.href
                            ? 'bg-[#3b82f6]/10 text-[#3b82f6] shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#3b82f6]'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            location.pathname === item.href
                              ? 'text-[#3b82f6]'
                              : 'text-gray-400 group-hover:text-[#3b82f6]'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        {/* Top header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:text-[#3b82f6] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Header Navigation */}
          <div className="hidden lg:flex lg:gap-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  text-sm font-semibold leading-6 transition-colors duration-200
                  ${location.pathname === item.href
                    ? 'text-[#3b82f6]'
                    : 'text-gray-700 hover:text-[#3b82f6]'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-[#3b82f6] transition-colors"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center gap-x-4">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] flex items-center justify-center text-white font-semibold">
                      {currentUser?.displayName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="text-sm font-semibold leading-6 text-gray-900">
                        {currentUser?.displayName}
                      </span>
                    </span>
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={currentUser?.role === 'trainer' ? '/trainer/profile' : '/student/profile'}
                          className={`block px-4 py-2 text-sm leading-6 ${
                            active ? 'bg-gray-50 text-[#3b82f6]' : 'text-gray-700'
                          }`}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm leading-6 text-red-600 ${
                            active ? 'bg-gray-50' : ''
                          }`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
} 