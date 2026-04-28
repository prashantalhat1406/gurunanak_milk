// src/views/CustomerListView.jsx
import CustomerCard from "@components/customer/CustomerCard";
import AddCustomerModal from "@components/customer/AddCustomerModal";
import CustomerToolbar from "@components/customer/CustomerToolbar";
import MilkTransactionForm from "@components/milk/AddMilkTransactionForm";
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
  onAddMilk,
  showQuickMilkForm,
  quickMilkCustomer,
  onQuickMilkSubmit,
  onQuickMilkCancel,
}) {
  const getTodayStr = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const sortedCustomers = [...customers].sort(
  (a, b) => a.customerID - b.customerID
);

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

      {showQuickMilkForm && (
        <MilkTransactionForm
          onSubmit={onQuickMilkSubmit}
          onCancel={onQuickMilkCancel}
          initialDate={getTodayStr()}
          initialQuantity=""
          isEditing={false}
          customerName={quickMilkCustomer?.name}
        />
      )}

      <div className="customer-list">
        {sortedCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            id={customer.id}
            customerID={customer.customerID}
            name={customer.name}
            mobile={customer.mobile}
            totalMilk={customer.totalMilk}
            totalAmount={customer.totalAmount}
            onEdit={onEditCustomer}
            onClick={onCustomerClick}
            onAddMilk={onAddMilk}
          />
        ))}
      </div>
    </>
  );
}
