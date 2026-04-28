export default function MilkSummary({ rate, quantity, amount }) {
  const isZero = quantity === 0;
  return (
    <div className={`mtf-summary ${isZero ? "mtf-summary-zero" : ""}`}>
      <div className="mtf-summary-row">
        <span>Rate:</span>
        <span>₹{rate}/L</span>
      </div>
      <div className="mtf-summary-row">
        <span>Quantity:</span>
        <span>{quantity} L</span>
      </div>
      <div className="mtf-summary-row">
        <span>Amount:</span>
        <span>₹{amount}</span>
      </div>
    </div>
  );
};
