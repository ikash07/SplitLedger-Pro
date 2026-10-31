import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  sortOption,
  onSortChange,
  groups = [],
  selectedGroup,
  onGroupChange,
  className = ''
}) => {
  return (
    <div 
      className={`glass-panel ${className}`} 
      style={{
        padding: '0.85rem 1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.85rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}
    >
      {/* Search Input */}
      <div style={{ flex: '1 1 240px', position: 'relative' }}>
        <Search 
          size={16} 
          style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
        />
        <input
          type="text"
          placeholder="Search bills by title or notes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.4rem', fontSize: '0.85rem', height: '40px' }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        {/* Category Dropdown */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '140px', height: '40px', fontSize: '0.85rem' }}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Group Dropdown if enabled */}
        {groups.length > 0 && onGroupChange && (
          <select
            value={selectedGroup}
            onChange={(e) => onGroupChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px', height: '40px', fontSize: '0.85rem' }}
          >
            <option value="all">All Groups</option>
            {groups.map(grp => (
              <option key={grp.id} value={grp.id}>{grp.name}</option>
            ))}
          </select>
        )}

        {/* Sort Options */}
        {onSortChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={15} color="var(--text-muted)" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '160px', height: '40px', fontSize: '0.85rem' }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="title-asc">A to Z</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
