// src/views/CustomerListView.jsx
import CustomerCard from "../components/CustomerCard";
import AddCustomerModal from "../components/AddCustomerModal";
import "../styles/customer-list-view.css";

export default function CustomerListView({
  customers,
  searchTerm,
  onSearchChange,
  onClearSearch,
  showForm,
  editingCustomer,
  onAddCustomerClick,
  onSubmitCustomer,
  onCancelCustomer,
  onEditCustomer,
  onCustomerClick,
}) {
  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <div className="search-box-premium">
            <span className="icon">
              {/* SVG search icon — replaces emoji */}
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

      {showForm && (
        <AddCustomerModal
          onSubmit={onSubmitCustomer}
          onCancel={onCancelCustomer}
          initialName={editingCustomer?.name || ""}
          initialPhone={editingCustomer?.mobile || ""}
          isEditing={!!editingCustomer}
        />
      )}

      <div className="customer-list">
        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customerID={customer.id}
            name={customer.name}
            mobile={customer.mobile}
            totalMilk={customer.totalMilk}
            totalAmount={customer.totalAmount}
            onEdit={onEditCustomer}
            onClick={onCustomerClick}
          />
        ))}
      </div>
    </>
  );
}