'use client'
import React from 'react';

interface SearchProps {
<<<<<<< HEAD
    onSearch: (searchTerm: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        onSearch(searchTerm);
    };

    return (
        <div>
            <input
                type="text"
                onChange={handleInputChange}
                placeholder="Search by email"
            />
        </div>
    );
};

export default Search;
=======
  onSearch: (searchTerm: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm);
  };

  return (
    <div>
      <input
        type="text"
        onChange={handleInputChange}
        placeholder="Search by email"
      />
    </div>
  );
};

export default Search;
>>>>>>> 0ef000a0c6c904cfd340f3ee14826c25af953aca
