import React from "react";
import "../styles/header-style.css";

export default function GurunankHeader() {
  return (
    <header className="gurunank-header">
      <h1 className="gurunank-title">Gurunanak</h1>

      <div className="gurunank-sub-wrapper">
        <div className="line" />
        <span className="subtitle">Dairy & Sweets</span>
        <div className="line" />
      </div>
    </header>
  );
}