import React, { useEffect, useState } from 'react';
import { listAllTransaction } from '../services/transaction';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await listAllTransaction();
      console.log("Transactions: ", data.data.data);
      
      setTransactions(data.data.data);
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                NFT
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Buyer
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Seller
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Sale type
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Sale Price
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 border-b border-gray-200">
                  {transaction.nft.title}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {transaction.buyer.username}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {transaction.seller.username}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {transaction.nft.saleType}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  ${transaction.salePrice}
                </td> 
                <td className="px-6 py-4 border-b border-gray-200">
                  {formatDate(transaction.transactionDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
};

export default TransactionsList;
