'use client'
import React from 'react';

interface SearchProps {
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
