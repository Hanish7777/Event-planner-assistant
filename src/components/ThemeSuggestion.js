import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { eventData } from '../data/eventData';
import { useNavigate } from 'react-router-dom';

const ThemeSuggestions = ({ eventType }) => {
  const [themes, setThemes] = useState(() => JSON.parse(localStorage.getItem('themes')) || []);
  const [customTheme, setCustomTheme] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || null);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favoriteThemes')) || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('themes', JSON.stringify(themes));
    localStorage.setItem('favoriteThemes', JSON.stringify(favorites));
    localStorage.setItem('selectedTheme', selectedTheme || '');
  }, [themes, favorites, selectedTheme]);

  useEffect(() => {
    if (!eventType) {
      setThemes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const fetchThemes = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/ai/theme', { eventType });
        const validThemes = (response.data.themes || eventData[eventType]?.themes || [])
          .filter((theme) => theme && theme.trim() !== '')
          .map((theme) => ({ name: theme.trim(), popularity: Math.random() }));
        setThemes(validThemes);
      } catch (err) {
        console.error('Theme fetch error:', err);
        setError('Failed to load AI themes. Using defaults.');
        const validThemes = (eventData[eventType]?.themes || [])
          .filter((theme) => theme && theme.trim() !== '')
          .map((theme) => ({ name: theme.trim(), popularity: Math.random() }));
        setThemes(validThemes);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, [eventType]);

  const addCustomTheme = () => {
    if (!customTheme.trim()) {
      setError('Please enter a custom theme name.');
      return;
    }

    if (themes.some((t) => t.name.toLowerCase() === customTheme.trim().toLowerCase())) {
      setError('This theme already exists.');
      return;
    }

    const newTheme = { name: customTheme.trim(), popularity: 0.5 };
    setThemes((prev) => [...prev, newTheme]);
    setCustomTheme('');
    setError('');
  };

  const handleThemeSelect = (themeName) => {
    setSelectedTheme(themeName);
    setTimeout(() => {
      navigate('/dashboard/timeline');
    }, 300);
  };

  const toggleFavorite = (themeName) => {
    setFavorites((prev) =>
      prev.includes(themeName)
        ? prev.filter((t) => t !== themeName)
        : [...prev, themeName]
    );
  };

  const resetSelection = () => {
    setSelectedTheme(null);
    localStorage.removeItem('selectedTheme');
  };

  const exportThemes = () => {
    const dataStr = JSON.stringify(themes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'themes.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredThemes = themes
    .filter((theme) => theme.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'alphabetical') return a.name.localeCompare(b.name);
      if (sortOrder === 'popularity') return b.popularity - a.popularity;
      return 0;
    });

  const getThemePreview = (themeName) => ({
    description: `A vibrant and elegant theme inspired by ${themeName.toLowerCase()}.`,
    colors: [
      `hsl(${Math.random() * 360}, 70%, 60%)`,
      `hsl(${Math.random() * 360}, 70%, 70%)`,
      `hsl(${Math.random() * 360}, 70%, 80%)`,
    ],
  });

  if (!eventType) {
    return (
      <div className="theme-suggestions bg-white/80 p-6 rounded-2xl shadow-xl max-w-3xl mx-auto my-10">
        <p className="text-gray-600 text-center text-lg font-medium">
          Please select an event type to see theme suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="theme-suggestions bg-white/80 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto my-10 overflow-y-auto max-h-[80vh]">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        Theme Suggestions for Your Event
      </h2>

      {loading && <p className="text-blue-600 text-center">Loading themes...</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search themes"
          className="p-3 rounded-lg border flex-1"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-3 rounded-lg border"
        >
          <option value="default">Default</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={customTheme}
          onChange={(e) => setCustomTheme(e.target.value)}
          placeholder="Add custom theme"
          className="p-3 rounded-lg border flex-1"
        />
        <button onClick={addCustomTheme} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Add Theme
        </button>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredThemes.map((theme, index) => {
          const preview = getThemePreview(theme.name);
          return (
            <li
              key={index}
              onClick={() => handleThemeSelect(theme.name)}
              className={`cursor-pointer p-4 rounded-lg border transition hover:shadow-md ${
                selectedTheme === theme.name ? 'bg-indigo-100 border-indigo-400' : 'bg-white'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{theme.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(theme.name);
                  }}
                  className={favorites.includes(theme.name) ? 'text-yellow-400' : 'text-gray-400'}
                  aria-label={`Toggle favorite for ${theme.name}`}
                >
                  ★
                </button>
              </div>
              <p className="text-sm mb-2">{preview.description}</p>
              <div className="flex gap-1">
                {preview.colors.map((color, i) => (
                  <span key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {selectedTheme && (
        <div className="mt-6 text-center">
          <p className="font-semibold">
            Selected Theme: <span className="text-indigo-700">{selectedTheme}</span>
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={resetSelection}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Reset Selection
            </button>
            <button
              onClick={exportThemes}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Export Themes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSuggestions;
