import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Table, Input, Button, Popconfirm, Form,message } from "antd";
import { SearchOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";

const ClientDocuments = (props) => {
  const [documentType, setDocumentType] = useState("book");
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [bookMergedData, setBookMergedData] = useState([]);
  const [magazineMergedData, setMagazineMergedData] = useState([]);
  const [journalMergedData, setJournalMergedData] = useState([]);
  const [loanData, setLoanData] = useState({});
  const [borrow, setBorrow] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchAllLoanData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/library/api/v1/loans/list_all_loans/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        if (response.status === 200) {
          // Create a map of document_id to loan records
          const loanDataMap = response.data.reduce((acc, loan) => {
            acc[loan.document_id] = acc[loan.document_id] || [];
            acc[loan.document_id].push(loan);
            return acc;
          }, {});
          setLoanData(loanDataMap);
        }
      } catch (error) {
        console.error('Failed to fetch all loan data:', error);
      }
    };
  
    fetchAllLoanData();
  }, []);
  
// Example of how to map API response for each document type
const mapSearchResults = (searchResults, documentType) => {
  switch (documentType) {
    case 'book':
      return searchResults.map(result => ({
        key: result.id.toString(),
        title: result.title,
        name: result.author, 
        isbn: result.isbn, 
        edition: result.edition,
        document_copies: result.copies,
        document_is_electronic_copy: result.is_electronic_copy ? "Yes" : "No",
      }));
    
    case 'magazine':
      return searchResults.map(result => ({
        key: result.id.toString(),
        name_of_magazine: result.title,
        issn: result.issn,
        name: result.publisher, 
        year: result.year, 
        month: result.month, // Add this if your API includes month
        document_copies: result.copies,
        document_is_electronic_copy: result.is_electronic_copy ? "Yes" : "No",
        // ... other magazine-related mappings
      }));

    case 'journal':
      return searchResults.map(result => ({
        key: result.id.toString(),
        name_of_journal: result.source, // Assuming API key 'source' maps to 'name_of_journal'
        article_title: result.title, // Assuming API key 'title' maps to 'article_title'
        author_name: result.author, // Assuming API key 'author' maps to 'author_name'
        year: result.year, // Add this if your API includes year
        issue: result.issue, // Add this if your API includes issue
        publisher_name: result.publisher, // Assuming API key 'publisher' maps to 'publisher_name'
        document_copies: result.copies,
        document_is_electronic_copy: result.is_electronic_copy ? "Yes" : "No",
        // ... other journal-related mappings
      }));

    default:
      return []; // Return an empty array if the document type is not recognized
  }
};

// Additional state to store the original data before search
const [originalData, setOriginalData] = useState({
  books: [],
  magazines: [],
  journals: [],
});

// Function to handle search
const handleSearch = async () => {
  if (!searchTitle) {
    // If search field is cleared, reset data to original
    setBookMergedData(originalData.books);
    setMagazineMergedData(originalData.magazines);
    setJournalMergedData(originalData.journals);
    return;
  }

  setIsSearching(true);
  try {
    const response = await axios.get(`http://127.0.0.1:8000/library/api/v1/documents/search_documents`, {
      params: { query: searchTitle }, // Send the searchTitle as the query parameter
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (response.status === 200 && response.data) {
      const mappedResults = mapSearchResults(response.data, documentType);
      // Handle different document types if needed
      // Assuming response.data contains an array of items corresponding to the search
      if (documentType === 'book') {
        setBookMergedData(mappedResults);
      } else if (documentType === 'magazine') {
        setMagazineMergedData(mappedResults);
      } else if (documentType === 'journal') {
        setJournalMergedData(mappedResults);
      }
    }
  } catch (error) {
    console.error('Error during search:', error);
    message.error('Failed to perform search. Please try again.');
  }
  setIsSearching(false);
};

const handleBorrow = async (record) => {
  const documentId = record.document_id;
  const loanRecords = loanData[documentId] || []; // Ensure there's a default empty array

  // Check for an existing active loan
  const currentLoan = loanRecords.find(loan => loan.status === 'active' && !loan.return_date);
  
  if (currentLoan) {
    // Return the current loan
    try {
      const response = await axios.put(`http://127.0.0.1:8000/library/api/v1/loans/?id=${currentLoan.id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (response.status === 200) {
        setLoanData(prev => ({
          ...prev,
          [documentId]: prev[documentId].map(loan => 
            loan.id === currentLoan.id ? {...loan, return_date: new Date().toISOString(), status: 'returned'} : loan
          )
        }));
        setBorrow("no");
      }
    } catch (error) {
      console.error('Error returning the book:', error);
    }
  } else {
    // No active loan found, create a new loan
    try {
      const response = await axios.post(`http://127.0.0.1:8000/library/api/v1/loans/`, {
        document_id: documentId,
        lend_date: new Date().toISOString(),
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (response.status === 200) {
        // Use the snippet here to update the loan data
        setLoanData(prev => {
          const newLoanData = {
            ...prev,
            [documentId]: [...(prev[documentId] || []), {...response.data, status: 'active'}]
          };
          console.log(newLoanData); // Debug: log the new state
          return newLoanData;
        });
        setBorrow("yes");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`Error: ${error.response.data.detail}`);
      } else if (error.request) {
        message.error("Error: The server did not respond. Please try again later.");
      } else {
        message.error("Error: There was a problem with your request. Please check your network connection and try again.");
      }
    }
  }
};

  
  
  useEffect(() => {

    const fetchData = async () => {
      try {
        const [
          authorResponse,
          publisherResponse,
          booksResponse,
          magazinesResponse,
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
          axios.get("http://127.0.0.1:8000/library/api/v1/books/list_books", {
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
        const booksData = booksResponse.data;
        const magazinesData = magazinesResponse.data;
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

      const booksMergedData = booksData.map((book, index) => {
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
        setBookMergedData(booksMergedData);


      const mergedData = magazinesData.map((magazine, index) => {
        const publisher = publisherIdMap[magazine.publisher_id];
        const document = documentData.find(doc => doc.source_id === magazine.id);

        const { id: document_id, type, title, source, source_id, copies, is_electronic_copy } = document || {};

        // fetchAllLoanData(document_id);

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

      const journalMergedData = journalArticlesData.map((journalArticle, index) => {
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

      setJournalMergedData(journalMergedData);
      setOriginalData({
        books: booksMergedData,
        magazines: mergedData,
        journals: journalMergedData,
      });
    

      } catch (error) {
        console.error('Error:', error);
        // Handle error here
      }
    };
    
    fetchData();
  }, []);




  const columns = useMemo(() => {
  
    const specificColumns = {
      book: [
        { title: "Title", dataIndex: "title", key: "title" },
        { title: "Author", dataIndex: "name", key: "author" },
        { title: "ISBN", dataIndex: "isbn", key: "isbn" },
        { title: "Edition", dataIndex: "edition", key: "edition" },
        // { title: "Release year", dataIndex: "release_year", key: "release_year" },
        // { title: "Number of Pages", dataIndex: "no_of_pages", key: "no_of_pages" },
        { title: "Copies", dataIndex: "document_copies", key: "document_copies" },
        { title: "Electronic Copy", dataIndex: "document_is_electronic_copy", key: "document_is_electronic_copy" },
      ],
      magazine: [
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
      ],
      journal: [
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
      ],
    };
    

    return [...specificColumns[documentType], {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        // Determine if the current record is loaned out (active loan that hasn't been returned)
        const isLoanedOut = loanData[record.document_id]?.some(loan => loan.status === 'active' && !loan.return_date);
    
        return (
          <Button
            // Styling can be adjusted based on whether the item is loaned out
            style={{
              backgroundColor: isLoanedOut ? 'danger' : 'primary'
            }}
            onClick={() => handleBorrow(record)}
          >
            {isLoanedOut ? 'Return' : 'Borrow'}
          </Button>
        );
      },
    }];
    
  }, [documentType, loanData]);
  
  

  return (
    <div className="list row">
      <div className="col-md-8">
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
        >
          <option value="book">Book</option>
          <option value="magazine">Magazine</option>
          <option value="journal">Journal</option>
        </select>
        <div className="search-container">
          <Input
            className="search-input"
            placeholder="Search by title, author, copies..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <Button
            type="primary"
            className="search-button"
            onClick={handleSearch}
          >
            <SearchOutlined />
          </Button>
        </div>
      </div>
      <div className="col-md-12 list">
      {documentType === 'book' && (
        <Table
          bordered
          dataSource={bookMergedData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 740 }}
        />
      )}
      {documentType === 'magazine' && (
        <Table
          bordered
          dataSource={magazineMergedData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 740 }}
        />
      )}
      {documentType === 'journal' && (
        <Table
          bordered
          dataSource={journalMergedData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 740 }}
        />
      )}
</div>

      
    </div>
  );
};

export default ClientDocuments;