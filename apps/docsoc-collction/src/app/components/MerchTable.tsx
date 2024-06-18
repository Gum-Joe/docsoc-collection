import React from 'react';

interface OrderUI {
  orderNo: string;
  date: string;
  item: string;
  variant: string;
  collected: boolean;
  itemID: number;
	quantity: number;
}

interface MerchTableProps {
  data: Array<OrderUI>;
  onToggleCollected: (orderNo: string, itemNo: number) => void;
}

const MerchTable: React.FC<MerchTableProps> = ({ data, onToggleCollected }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Order No</th>
          <th className="border p-2">Date</th>
          <th className="border p-2">Item</th>
          <th className="border p-2">Variant</th>
          <th className="border p-2">Quantity</th>
          <th className="border p-2">Collected</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.orderNo} className="odd:bg-white even:bg-gray-100">
            <td className="border p-2">{row.orderNo}</td>
            <td className="border p-2">{new Date(row.date).toLocaleDateString("en-GB")}</td>
            <td className="border p-2">{row.item}</td>
            <td className="border p-2">{row.variant}</td>
            <td className="border p-2">{row.quantity}</td>
            <td className="border p-2 text-center">
              <input
                type="checkbox"
                checked={row.collected}
                onChange={() => onToggleCollected(row.orderNo, row.itemID)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MerchTable;
