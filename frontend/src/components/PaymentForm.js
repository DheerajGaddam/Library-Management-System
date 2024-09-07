import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Table, Modal, Input, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import '../AddTutorial.css'; 

export default function PaymentForm(props) {
  const [formData, setFormData] = useState({
    cardnumber: '',
    email: '',
    payment_address: '',
  });

  const [tableData, setTableData] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [editingCreditCard, setEditingCreditCard] = useState(null);
  var user_id = 0

  const onSubmitHandler = async (event) => {
    event.preventDefault();    
    try {
      console.log(formData)
      const cardResponse = await axios.post("http://127.0.0.1:8000/library/api/v1/creditcards", formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      toast.success(cardResponse.data.detail);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.detail);
    }
  };


  const getData = async () => {
    try {
      const getCardResponse = await axios.get("http://127.0.0.1:8000/library/api/v1/creditcards/?id=8", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      console.log(getCardResponse)
      setTableData(getCardResponse.data);
      setFormData(getCardResponse.data);
      toast.success(getCardResponse.data.detail);
    } catch (error) {
      toast.error(error.response.data.detail);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    { title: "Card Number", dataIndex: "cardnumber", key: "cardnumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Address", dataIndex: "payment_address", key: "payment_address" },
    {
      key: "actions",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditCreditCard(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteCreditCard(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onDeleteCreditCard = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this credit card record?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const creditCardResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/creditcards/${record.id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          if (creditCardResponse.status === 200) {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            message.success("Record deleted successfully");
          }
        } catch (error) {
          console.error('Error deleting record:', error);
        }
      },
    });
  };

  const onEditCreditCard = (record) => {
    setIsEditing(true);
    setEditingCreditCard({ ...record });
  };

  const handleSave = async () => {
    try {
      const creditCard = {
        cardnumber: editingCreditCard.cardnumber,
        email: editingCreditCard.email,
        payment_address: editingCreditCard.payment_address,
      };
      const creditCardResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/creditcards/${editingCreditCard.id}`, creditCard, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      message.success('Credit card updated successfully');
      resetEditing();
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update credit card record');
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingCreditCard(null);
  };  

  return (
    <div>
      <div className="submit-form">
        <h1 className="text-3xl font-bold text-center mb-4">Payment Form</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="space-y-4">
            <input
              required
              type="text"
              placeholder="Card Number"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              value={formData.cardnumber}
              onChange={(e) => setFormData({ ...formData, cardnumber: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="Email"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="Address"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              value={formData.payment_address}
              onChange={(e) => setFormData({ ...formData, payment_address: e.target.value })}
            />
          </div>
          <div className="text-center mt-6">
            <button
              type="submit"
              className="py-3 w-64 text-xl text-white bg-green-400 rounded-2xl hover:bg-yellow-300 active:bg-yellow-500 outline-none"
            >
              Make Payment
            </button>
          </div>
        </form>
      </div>
  
      <div className="list row" style={{ marginTop: 50 }}>
        <div className="col-md-12 list">
        <Table
            bordered
            dataSource={tableData} // Use tableData instead of formData
            columns={columns}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 740 }}
          />
          <Modal
            title="Edit Credit Card"
            visible={isEditing}
            okText="Save"
            onCancel={() => resetEditing()}
            onOk={handleSave}
          >
            {editingCreditCard && columns.map((column) => (
              <Input
                key={column.key || column.dataIndex}
                value={editingCreditCard[column.dataIndex]}
                placeholder={column.title || column.Header} // Use either 'title' or 'Header' as placeholder
                onChange={(e) => {
                  setEditingCreditCard((prev) => ({
                    ...prev,
                    [column.dataIndex]: e.target.value,
                  }));
                }}
              />
            ))}
          </Modal>
        </div>
      </div>
    </div>
  );
}
