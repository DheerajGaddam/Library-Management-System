import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, Input, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const JournalList = (props) => {
  const [journalMergedData, setJournalMergedData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          authorResponse,
          publisherResponse,
          journalArticlesResponse,
          documentResponse
        ] = await Promise.all([
          axios.get("http://127.0.0.1:8000/library/api/v1/authors/list_authors", {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          }),
          axios.get("http://127.0.0.1:8000/library/api/v1/publishers/list_publishers", {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          }),
          axios.get("http://127.0.0.1:8000/library/api/v1/journal_articles/list_journal_articles", {
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
        const authorData = authorResponse.data;
        const publisherData = publisherResponse.data;
        const journalArticlesData = journalArticlesResponse.data;
        const documentData = documentResponse.data;

        const authorIdMap = {};
          authorData.forEach(author => {
          authorIdMap[author.id] = author;
        });

        const publisherIdMap = {};
        publisherData.forEach(publisher => {
            publisherIdMap[publisher.id] = publisher;
        });

        const mergedData = journalArticlesData.map((journalArticle, index) => {
            const document = documentData.find(doc => doc.source_id === journalArticle.id);
            const { id: document_id, type, title, source, source_id, copies, is_electronic_copy } = document || {};

            // Get the author and publisher information using their respective IDs
            const author = authorIdMap[journalArticle.author_id];
            const publisher = publisherIdMap[journalArticle.publisher_id];

            return {
                ...journalArticle,
                key: index.toString(),
                author_name: author ? author.name : '', // Change name to author_name
                publisher_name: publisher ? publisher.name : '', // Change name to publisher_name
                document_id,
                document_type: type || "",
                document_title: title || "",
                document_source: source || "",
                document_source_id: source_id || "",
                document_copies: copies || "",
                document_is_electronic_copy: is_electronic_copy ? "Yes" : "No"

            };
        });

        setJournalMergedData(mergedData);
        console.log(mergedData)



      } catch (error) {
        console.error('Error:', error);
        // Handle error here
      }
    };
    
    fetchData();
  }, []);


  const columns = [
    { title: "Journal Name", dataIndex: "name_of_journal", key: "name_of_journal" },
    { title: "Article Title", dataIndex: "title", key: "article_title" },
    { title: "Author", dataIndex: "author_name", key: "author" },
    { title: "Year", dataIndex: "year", key: "year" },
    { title: "Issue", dataIndex: "issue", key: "issue" },
    // { title: "Publisher", dataIndex: "publisher_name", key: "publisher" },
    // { title: "Publisher Type", dataIndex: "type", key: "publisher_type" },
    { title: "Publisher", dataIndex: "publisher_name", key: "publisher" },
    { title: "Copies", dataIndex: "document_copies", key: "copies" },
    { title: "Electronic Copy", dataIndex: "document_is_electronic_copy", key: "is_electronic_copy" },

    {
      key: "actions",
      title: "Actions",
      render: (record) => (
        <>
          <EditOutlined onClick={() => onEditJournal(record)} />
          <DeleteOutlined onClick={() => onDeleteJournal(record)} style={{ color: "red", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onDeleteJournal = (record) => {

    console.log(record)
      Modal.confirm({
        title: "Are you sure, you want to delete this Journal record?",
        okText: "Yes",
        okType: "danger",
        onOk: async () => {
          try {
  
            const authorResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/authors/?id=${record.author_id}`,  {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
            });
   
            const publisherResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/publishers/?id=${record.publisher_id}`,{
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
            });

            const journalResponse = await axios.delete(`http://127.0.0.1:8000/library/api/v1/journal_articles/?id=${record.document_source_id}`,  {
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
  
            if (publisherResponse.status === 200 && journalResponse.status === 200 && documentResponse.status === 200 && authorResponse.status === 200) {
                setJournalMergedData((prev) => {
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

  const onEditJournal = (record) => {
    setIsEditing(true);
    setEditingJournal({ ...record });
  };

  const handleSave = async () => {
    try {
      console.log(editingJournal)

      const author = {
        name: editingJournal.author_name,
      };
      const authorResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/authors/?id=${editingJournal.author_id}`, author, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
          }
        });

      const publishers = {
      name: editingJournal.publisher_name,
      // type: editingJournal.type,
      // publisher: editingJournal.publisher,
      };
      const publisherResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/publishers/?id=${editingJournal.publisher_id}`, publishers, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
          }
        });

      const journal_articles = {
        "name_of_journal": editingJournal.name_of_journal,
        "title": editingJournal.title,
        "issue": editingJournal.issue,
        "year": editingJournal.year,
      };
      const journal_articlesResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/journal_articles/?id=${editingJournal.document_source_id}`, journal_articles, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
        }
      });

      const document = {
        title: editingJournal.title,
        publisher: editingJournal.publisher_name,
        copies: editingJournal.document_copies,
        is_electronic_copy: editingJournal.document_is_electronic_copy === "no" ? false : true,
      };

      const documentResponse = await axios.put(`http://127.0.0.1:8000/library/api/v1/documents/?id=${editingJournal.document_id}`, document, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      message.success('Journal updated successfully');
      resetEditing();
      // fetchData(); 
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update book record');
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingJournal(null);
  };

  return (
    <div className="list row">
      <div className="col-md-12 list">
        <Table
          bordered
          dataSource={journalMergedData}
          columns={columns}
          pagination={{ pageSize: 50 }}
          scroll={{ y: 740 }}
        />
        <Modal
          title="Edit Journal"
          visible={isEditing}
          okText="Save"
          onCancel={resetEditing}
          onOk={handleSave}
        >
          {editingJournal &&
            columns.map((column) => (
              <Input
                key={column.key || column.dataIndex}
                value={editingJournal[column.dataIndex]}
                placeholder={column.title || column.Header}
                onChange={(e) => {
                  setEditingJournal((prev) => ({ ...prev, [column.dataIndex]: e.target.value }));
                }}
              />
            ))}
        </Modal>
      </div>
    </div>
  );
};

export default JournalList;
