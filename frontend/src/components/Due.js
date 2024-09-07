import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Button, Table, Modal, Input, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Due = (props) => {
    const [mergedData, setMergedData] = useState([]);
    const onSubmitHandler = async () => {
        try {
          // Fetch due data
          const dueResponse = await axios.get("http://127.0.0.1:8000/library/api/v1/payments/user/me", {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          const dues = dueResponse.data;  // Assume this returns an array
      
          // Fetch document data
          const docResponse = await axios.get("http://127.0.0.1:8000/library/api/v1/documents/list_documents", {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          const documents = docResponse.data;  // Assume this also returns an array
      
          // Merge dues and documents based on matching document_id with id
          const mergedResults = dues.map(due => {
            const docMatch = documents.find(doc => doc.id === due.document_id);
            return docMatch ? { ...docMatch, ...due } : null;
          }).filter(item => item !== null);
      
          setMergedData(mergedResults);
          console.log(mergedResults);  // Log to check data
        } catch (error) {
          console.error("Failed to fetch data:", error);
          // message.error("Failed to fetch data: " + error.message); // Uncomment if message is used
        }
      };
      
    
      useEffect(() => {
        onSubmitHandler(); // Automatically call when component mounts
      }, []);

    


      const columns = [
        { title: "Document Name", dataIndex: "title", key: "title" },  // Changed from mergedData.title to title
        { title: "Author", dataIndex: "author", key: "author" },       // Changed from mergedData.author to author
        // { title: "Publisher", dataIndex: "publisher", key: "publisher" },  // Changed from mergedData.publisher to publisher
        { title: "Fine ($) ", dataIndex: "amount", key: "amount" },         // Changed from mergedData.amount to amount
      ];
      

      return (
        <div className="list row">
          <div className="col-md-12 list">
            <Table
              bordered
              dataSource={mergedData}
              columns={columns}
              pagination={{ pageSize: 50 }}
              scroll={{ y: 740 }}
            />
          </div>
        </div>
      );
};

export default Due;
