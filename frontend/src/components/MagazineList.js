import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Button, Table, Modal, Input, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const MagazineList = (props) => {
  const [magazineMergedData, setMagazineMergedData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          publisherResponse,
          magazinesResponse,
          documentResponse
        ] = await Promise.all([
          axios.get("http://127.0.0.1:8000/library/api/v1/publishers/list_publishers", {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          }),
          axios.get("http://127.0.0.1:8000/library/api/v1/magazines/list_magazines", {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          }),
          axios.get("http://127.0.0.1:8000/library/api/v1/documents/list_documents", {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          })
        ]);
    
        // Extract data from responses
        const publisherData = publisherResponse.data;
        const magazinesData = magazinesResponse.data;
        const documentData = documentResponse.data;
    
        const publisherIdMap = {}; // Map to store publishers by their ID
            publisherData.forEach(publisher => {
            publisherIdMap[publisher.id] = publisher;
        });

        const mergedData = magazinesData.map((magazine, index) => {
        const publisher = publisherIdMap[magazine.publisher_id];
        const document = documentData.find(doc => doc.source_id === magazine.id);

        const { id: document_id, type, title, source, source_id, copies, is_electronic_copy } = document || {};

        return {
            ...magazine,
            key: index.toString(), // Assign a unique key based on the index
            ...publisher,
            document_id,
            document_type: type || "", // Provide default values if properties are undefined
            document_title: title || "",
            document_source: source || "",
            document_source_id: source_id || "",
            document_copies: copies || "",
            document_is_electronic_copy: is_electronic_copy ? "Yes" : "No"
        };
        });

        

        setMagazineMergedData(mergedData);
        console.log(mergedData)

      } catch (error) {
        console.error('Error:', error);
        // Handle error here
      }
    };
    
    fetchData();
  }, []);


  const columns = [
    { title: "Magazine Name", dataIndex: "name_of_magazine", key: "name_of_magazine" },
    { title: "ISSN", dataIndex: "issn", key: "issn" },
    // { title: "Author", dataIndex: "author", key: "author" },
    { title: "Publisher", dataIndex: "name", key: "publisher" },
    // { title: "Publisher Type", dataIndex: "type", key: "publisher_type" },
    // { title: "Publisher Company", dataIndex: "publisher", key: "publisher_company" },
    { title: "Year", dataIndex: "year", key: "year" },
    { title: "Month", dataIndex: "month", key: "month" },
    { title: "Copies", dataIndex: "document_copies", key: "copies" },
    { title: "Electronic Copy", dataIndex: "document_is_electronic_copy", key: "is_electronic_copy" },
    {
        key: "actions",
        title: "Actions",
        render: (record) => {
        return (
            <>
            <EditOutlined
                onClick={() => {
                onEditMagazine(record);
                }}
            />
            <DeleteOutlined
                onClick={() => {
                onDeleteMagazine(record);
                }}
                style={{ color: "red", marginLeft: 12 }}
            />
            </>
        );
        },
    },
  ];


  const onDeleteMagazine = (record) => {

    console.log(record)
      Modal.confirm({
        title: "Are you sure, you want to delete this Magazine record?",
        okText: "Yes",
        okType: "danger",
        onOk: async () => {
          try {
    
            const publisherResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/publishers/?id=${record.publisher_id}`,  {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
            });
            const magazineResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/magazines/?id=${record.document_source_id}`,  {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
            });
            const documentResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/documents/?id=${record.document_id}`,{
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
            });
  
            if (publisherResponse.status === 200 && magazineResponse.status === 200 && documentResponse.status === 200) {
                setMagazineMergedData((prev) => {
                    return prev.filter((book) => book.id !== record.id);
                });
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

  const onEditMagazine = (record) => {
    setIsEditing(true);
    setEditingMagazine({ ...record });
  };

  const handleSave = async () => {
    try {

      const publishers = {
      name: editingMagazine.name,
      // type: editingMagazine.type,
      // publisher: editingMagazine.publisher,
      };
      const publisherResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/publishers/?id=${editingMagazine.publisher_id}`, publishers, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
          }
        });

      const magazines = {
        name_of_magazine: editingMagazine.name_of_magazine,
        issn: editingMagazine.issn,
        year: editingMagazine.year,
        month: editingMagazine.month,
      };

      const magazinesResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/magazines/?id=${editingMagazine.document_source_id}`, magazines, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const document = {
        title: editingMagazine.name_of_magazine,
        publisher: editingMagazine.name,
        copies: editingMagazine.document_copies,
        is_electronic_copy: editingMagazine.document_is_electronic_copy === "no" ? false : true,
      };

      const documentResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/documents/?id=${editingMagazine.document_id}`, document, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      message.success('Magazine updated successfully');
      resetEditing();
      // fetchData(); 
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update book record');
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingMagazine(null);
  };

  return (
    <div className="list row">
      <div className="col-md-12 list">
        <Table
          bordered
          dataSource={magazineMergedData}
          columns={columns}
          pagination={{ pageSize: 50 }}
          scroll={{ y: 740 }}
        />
        <Modal
          title="Edit Magazine"
          visible={isEditing}
          okText="Save"
          onCancel={() => resetEditing()}
          onOk={handleSave}
        >
          {editingMagazine && columns.map((column) => (
            <Input
              key={column.key || column.dataIndex}
              value={editingMagazine[column.dataIndex]}
              placeholder={column.title || column.Header} // Use either 'title' or 'Header' as placeholder
              onChange={(e) => {
                setEditingMagazine((prev) => ({
                  ...prev,
                  [column.dataIndex]: e.target.value,
                }));
              }}
            />
          ))}
        </Modal>
      </div>
    </div>
  );
};

export default MagazineList;
