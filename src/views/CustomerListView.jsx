// src/views/CustomerListView.jsx
import CustomerCard from "@components/CustomerCard";
import AddCustomerModal from "@components/customer/AddCustomerModal";
import CustomerToolbar from "@components/customer/CustomerToolbar";
import "@styles/customer-list-view.css";

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
      <CustomerToolbar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onClearSearch={onClearSearch}
        onAddCustomerClick={onAddCustomerClick}
      />

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
