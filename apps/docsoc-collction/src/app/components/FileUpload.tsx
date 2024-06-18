import { stringify } from "querystring";
import React, { useEffect, useState } from 'react';
import { useAxios } from "../context/axios.context";

const FileUpload: React.FC = () => {
	const [items, setItems] = useState<{ name: string, id: number }[]>([])
  const [selectedItem, setSelectedItem] = useState('NULL');

	const axios = useAxios();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log(event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      // Placeholder for file upload logic
      console.log(`Uploading file: ${file.name} for item: ${selectedItem}`);
			console.log(`Item id is ${items.filter((item) => item.name === selectedItem)[0].id}`)

			// Upload with axios
			const formData = new FormData();
			formData.append('file', file);
			formData.append('itemId', items.filter((item) => item.name === selectedItem)[0].id.toString())
			axios.put('/orders', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
				.then((response) => {
					console.log(response.data);
				})
    }
  };



	useEffect(() => {
		axios
      .get<{ name: string; id: number }[]>('/items')
      .then((response) => {
        setItems(response.data);
				setSelectedItem(response.data[0].name);
      })
      .catch((error: any) => {
        console.error(error);
      });
	}, [axios])

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Upload File</h2>
      <div className="mb-4">
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
					{
						items.map((item) => (
							<option value={item.name}>{item.name}</option>
						))
					}
        </select>
      </div>
      <div className="border-2 border-dashed border-gray-300 p-6 text-center">
        <label
          htmlFor="file-upload"
          className="block w-full h-full cursor-pointer"
        >
          Drag file here
        </label>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default FileUpload;
