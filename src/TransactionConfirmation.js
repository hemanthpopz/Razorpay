import React from 'react';
import { useParams } from 'react-router-dom';

const TransactionConfirmation = () => {
  const { transactionId, name, address } = useParams();

  return (
    <div>
      <h2>Transaction Confirmation</h2>
      <p>Transaction ID: {transactionId}</p>
      <p>Name: {name}</p>
      <p>Address: {address}</p>
      {/* Display other transaction details */}
    </div>
  );
};

export default TransactionConfirmation;
