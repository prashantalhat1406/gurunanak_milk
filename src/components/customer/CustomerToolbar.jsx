const CustomerToolbar = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  onAddCustomerClick,
}) => {
  return (
    <div className="toolbar">
      <div className="search-box">
        <div className="search-box-premium">
          <span className="icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={onSearchChange}
          />

          {searchTerm && (
            <button onClick={onClearSearch} aria-label="Clear search">
              &times;
            </button>
          )}
        </div>
      </div>

      <button className="btn-primary" onClick={onAddCustomerClick}>
        + Add Customer
      </button>
    </div>
  );
};

export default CustomerToolbar;