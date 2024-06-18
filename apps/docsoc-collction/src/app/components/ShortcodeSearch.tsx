import React, { useState } from 'react';

interface ShortcodeSearchProps {
  onSearch: (shortcode: string) => void;
}

const ShortcodeSearch: React.FC<ShortcodeSearchProps> = ({ onSearch }) => {
  const [shortcode, setShortcode] = useState('');

  const handleSearch = () => {
    onSearch(shortcode);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Shortcode"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
    </div>
  );
};

export default ShortcodeSearch;
