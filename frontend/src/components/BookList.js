import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Table, Modal, Input, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const TutorialsList = (props) => {
  const [bookMergedData, setBookMergedData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const fetchData = async () => {
    try {
      const [
        authorResponse,
        booksResponse,
        documentResponse
      ] = await Promise.all([
        axios.get("http://127.0.0.1:8000/library/api/v1/authors/list_authors", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        }),
        axios.get("http://127.0.0.1:8000/library/api/v1/books/list_books", {
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

      const authorData = authorResponse.data;
      const booksData = booksResponse.data;
      const documentData = documentResponse.data;

      const authorIdMap = {}; 
        authorData.forEach(author => {
        authorIdMap[author.id] = author;
      });

      const mergedData = booksData.map((book, index) => {
      const author = authorIdMap[book.author_id];
      const document = documentData.find(doc => doc.source_id === book.id);

      const { id: document_id, type, title, source, source_id, copies, is_electronic_copy } = document || {};

      return {
          ...book,
          key: index.toString(), 
          ...author,
          document_id,
          document_type: type || "", 
          document_title: title || "",
          document_source: source || "",
          document_source_id: source_id || "",
          document_copies: copies || "",
          document_is_electronic_copy: is_electronic_copy ? "Yes" : "No"
      };
    });
      setBookMergedData(mergedData);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 


  const columns = [
    // { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Author", dataIndex: "name", key: "author" },
    { title: "ISBN", dataIndex: "isbn", key: "isbn" },
    { title: "Edition", dataIndex: "edition", key: "edition" },
    // { title: "Release year", dataIndex: "release_year", key: "release_year" },
    // { title: "Number of Pages", dataIndex: "no_of_pages", key: "no_of_pages" },
    { title: "Copies", dataIndex: "document_copies", key: "document_copies" },
    { title: "Electronic Copy", dataIndex: "document_is_electronic_copy", key: "document_is_electronic_copy" },
    {
      key: "actions",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditBook(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteBook(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ]
      


const onDeleteBook = (record) => {
  console.log(record)
    Modal.confirm({
      title: "Are you sure, you want to delete this Book record?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {

          const authorResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/authors/?id=${record.author_id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          const booksResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/books/?id=${record.document_source_id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          const documentResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/documents/?id=${record.document_id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (booksResponse.status === 200 && documentResponse.status === 200 && authorResponse.status === 200) {
              setBookMergedData((prev) => {
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

  const onEditBook = (record) => {
    setIsEditing(true);
    setEditingBook({ ...record });
  };

  const handleSave = async () => {
    try {
      console.log(editingBook)
      const author = {
        name: editingBook.name,
        status: "active",
      };
      const authorResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/authors/?id=${editingBook.author_id}`, author, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
          }
        });


      const books = {
        title: editingBook.title,
        isbn: editingBook.isbn,
        edition: editingBook.edition,
        status: "active",
      };

      if(editingBook.document_source='book'){
        const booksResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/books/?id=${editingBook.document_source_id}`, books, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
      }
  

      const document = {
        title: editingBook.title,
        author: editingBook.name,
        copies: editingBook.document_copies,
        is_electronic_copy: editingBook.document_is_electronic_copy === "no" ? false : true,
      };

      const documentResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/documents/?id=${editingBook.document_id}`, document, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      message.success('Book updated successfully');
      resetEditing();
      fetchData(); 
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update book record');
    }
  };
  
  const resetEditing = () => {
    setIsEditing(false);
    setEditingBook(null);
  };

  return (
    <div className="list row">
      <div className="col-md-12 list">
        <Table
          bordered
          dataSource={bookMergedData}
          columns={columns}
          pagination={{ pageSize: 50 }}
          scroll={{ y: 740 }}
        />
        <Modal
          title="Edit Book"
          visible={isEditing}
          okText="Save"
          onCancel={resetEditing}
          onOk={handleSave}
        >
          {editingBook && columns.map((column) => (
            <Input
              key={column.key || column.dataIndex}
              value={editingBook[column.dataIndex]}
              placeholder={column.title || column.Header}
              onChange={(e) => {
                const { dataIndex } = column;
                setEditingBook(prev => ({
                  ...prev,
                  [dataIndex]: e.target.value,
                }));
              }}
            />
          ))}
        </Modal>
      </div>
    </div>
  );
};

export default TutorialsList;
