import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Table, Modal, Input, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import '../AddTutorial.css'; 

export default function ClientList(props) {
  const [formData, setFormData] = useState({
    user_type: 'client',
    email: '',
    name: '',
    password: '',
    address: ''
  });

  const [tableData, setTableData] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formData);
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/library/api/v1/users/", formData);
      toast.success(response.data.detail);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.detail);
    }
  };

  const getClients = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/library/api/v1/users/clients/", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      console.log(response);
      setTableData(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch clients");
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      key: "actions",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditClient(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteClient(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onDeleteClient = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this client?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const deleteResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/users/${record.id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          if (deleteResponse.status === 200) {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            message.success("Client deleted successfully");
          }
        } catch (error) {
          console.error('Error deleting client:', error);
          message.error("Failed to delete client");
        }
      },
    });
  };

  const onEditClient = (record) => {
    setIsEditing(true);
    setEditingClient({ ...record });
  };

  const handleSave = async () => {
    try {
      const updatedClient = {
        name: editingClient.name,
        email: editingClient.email,
        address: editingClient.address,
        // Add other fields as needed
      };
      const updateResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/users/?id=${editingClient.id}`, updatedClient, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      message.success("Client updated successfully");
      resetEditing();
    } catch (error) {
      console.error('Error updating client:', error);
      message.error("Failed to update client");
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingClient(null);
  };

  return (
    <div>
      <div className="submit-form">
        <h1 className="text-3xl font-bold text-center mb-4">Add Clients</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="space-y-4">
            <input
              required
              type="text"
              placeholder="Name"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              required
              type="password"
              placeholder="Password"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="Address"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="text-center mt-6">
            <button
              type="submit"
              className="py-3 w-64 text-xl text-white bg-green-400 rounded-2xl hover:bg-yellow-300 active:bg-yellow-500 outline-none"
            >
              Register Client
            </button>
          </div>
        </form>
      </div>

      <div className="list row" style={{ marginTop: 50 }}>
        <div className="col-md-12 list">
          <Table
            bordered
            dataSource={tableData}
            columns={columns}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 740 }}
          />
          <Modal
            title="Edit Client"
            visible={isEditing}
            okText="Save"
            onCancel={() => resetEditing()}
            onOk={handleSave}
          >
            {editingClient && columns.map((column) => (
              <Input
                key={column.key || column.dataIndex}
                value={editingClient[column.dataIndex]}
                placeholder={column.title || column.Header}
                onChange={(e) => {
                  setEditingClient((prev) => ({
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
