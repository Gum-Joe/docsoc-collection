import React from 'react';
import './App.css';
import ShortcodeSearch from './components/ShortcodeSearch';
import MerchTable from './components/MerchTable';
import FileUpload from './components/FileUpload';
import { AxiosProvider, useAxios } from "./context/axios.context";

import { OrderResponse } from '@react-monorepo/docsoc-types';
import { AxiosError } from "axios";
import { it } from "node:test";

interface OrderUI {
  orderNo: string;
  date: string;
  item: string;
  variant: string;
  collected: boolean;
  itemID: number;
  quantity: number;
}

const App: React.FC = () => {
  const [data, setData] = React.useState<OrderUI[]>([]);

  const axios = useAxios();

  const handleSearch = async (shortcode: string) => {
    // Fetch data

    try {

      setData([]);
      const orders = await axios.get<OrderResponse[]>(`/items/shortcode?shortcode=${shortcode}`);

      const pending: OrderUI[] = [];


      orders.data.order.forEach((order) => {
        order.items
          .map((item) => ({
            orderNo: order.orderNoShop.toString(),
            date: order.date.toString(),
            item: item.name,
            variant: item.variant,
            collected: item.collected,
            itemID: item.id,
            quantity: item.quantity
          })) 
          .forEach((item) => pending.push(item));
      });

      setData(pending);
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 404) {
        alert('Shortcode not found');
      }

      return;
    }

  
  
  };

  const handleToggleCollected = (orderNo: string, itemID: number) => {
    console.log(itemID);

    const currState = data.find((item) => item.itemID === itemID)?.collected;
    console.log(!currState);

    axios.post(`/items/${itemID}/set`, {
      state: !currState
    })
      .then((response) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.itemID === itemID ? { ...item, collected: !item.collected } : item
          )
        );
      })
      .catch((error: AxiosError) => {
        console.error(error);
      })
    // // Placeholder for toggling collected status
    
  };

  return (
    <AxiosProvider>
      <div className="container mx-auto my-8 p-4">
        <h1 className="text-center text-2xl font-bold mb-6">DoCSoc Collection</h1>
        <ShortcodeSearch onSearch={handleSearch} />
        <MerchTable data={data} onToggleCollected={handleToggleCollected} />
        <FileUpload />
      </div>
    </AxiosProvider>
  );
};

export default App;
