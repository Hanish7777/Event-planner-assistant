import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/dashboard/themes', label: 'Themes' },
  { path: '/dashboard/timeline', label: 'Timeline' },
  { path: '/dashboard/invitation', label: 'Invitations' },
  { path: '/dashboard/budget', label: 'Budget' },
  { path: '/dashboard/tasks', label: 'Tasks' },
  { path: '/dashboard/guests', label: 'Guests' },
];

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white p-4 rounded-lg mb-6">
      <ul className="flex flex-wrap justify-center gap-4">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200 ${
                  isActive ? 'bg-indigo-800' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
