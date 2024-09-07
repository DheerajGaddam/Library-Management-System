import React, { useState } from "react";
import TutorialDataService from "../services/TutorialService";
import '../AddTutorial.css'; // Add this import at the top of your file
import axios from "axios";
import { toast } from "react-toastify";


const AddTutorial = () => {
  const [documentType, setDocumentType] = useState('book');
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    edition: "",
    release_year: "",
    no_of_pages: ""
  });

  const documentAttributes = {
    book: ["title", "author", "isbn", "edition","copies","is_electronic_copy"],
    magazine: ["name_of_magazine", "issn", "publisher", "year", "month","copies","is_electronic_copy"],
    journal: ["name_of_journal", "article_title", "author", "year", "issue", "publisher","copies","is_electronic_copy"]
  };

  const handleDocumentTypeChange = (event) => {
    const newType = event.target.value;
    setDocumentType(newType);
    // Reset form data and set up keys based on the selected document type
    const newFormData = {};
    documentAttributes[newType].forEach(attr => newFormData[attr] = '');
    setFormData(newFormData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const saveDocument = async (event) => {
    event.preventDefault();

    let authorData, booksData, publisherData, journal_articlesData, magazinesData;

    var data = {
      type: documentType,
      ...formData
    };

    const author = {
      name: formData.author,
      author_info: ""
    };
    const publishers = {
      "name": formData.publisher,
      // "type": formData.publisher_type,
      "author": authorData && authorData.name ? authorData.name : "",
      // "publisher": formData.publisher_company,
    };



    try {
      // Create author
      if(documentType ===  'book' || documentType === "journal"){
        const authorResponse = await axios.post("http://127.0.0.1:8000/library/api/v1/authors", author, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
          }
        });
        authorData = authorResponse.data;
        toast.success('Author created successfully!');
      }

      // Create publisher
      if(documentType ===  'magazine' || documentType === "journal"){
        const publisherResponse = await axios.post("http://127.0.0.1:8000/library/api/v1/publishers", publishers, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
          }
        });
        publisherData = publisherResponse.data;
        toast.success('Publisher created successfully!');
      }


      // Create book
      if(documentType ===  'book'){
        const books = {
          title: formData.title,
          isbn: formData.isbn,
          edition: formData.edition,
          author_id: authorData.id
        };
        const booksResponse = await axios.post("http://127.0.0.1:8000/library/api/v1/books", books, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
          }
        });
        booksData = booksResponse.data;
        toast.success('Book created successfully!');
      }

      // Create magazine
      if(documentType ===  'magazine'){
        const magazines = {
          "name_of_magazine": formData.name_of_magazine,
          "publisher_id": publisherData.id,
          "issn": formData.issn,
          "volume": formData.copies,
          "year": formData.year,
          "month": formData.month,
        };
        const magazinesResponse = await axios.post("http://127.0.0.1:8000/library/api/v1/magazines", magazines, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
          }
        });
        magazinesData = magazinesResponse.data;
        toast.success('Magazines created successfully!');
      }


      // Create journal articles
      if(documentType ===  'journal'){
        const journal_articles = {
          "name_of_journal": formData.name_of_journal,
          "title": formData.article_title,
          "author_id": authorData.id,
          // "date_of_article": "2024-04-25",
          "issue": formData.issue,
          "year": formData.year,
          "publisher_id": publisherData.id,
        };
        const journal_articlesResponse = await axios.post("http://127.0.0.1:8000/library/api/v1/journal_articles", journal_articles, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
          }
        });
        journal_articlesData = journal_articlesResponse.data;
        toast.success('Journals created successfully!');
      }


      // Create document
      let doc_title = "";
      let source_id_doc = 0;
      
      if (documentType === "book") {
        doc_title = formData.title;
        source_id_doc = booksData.id;
      } else if (documentType === "magazine") {
        doc_title = formData.name_of_magazine;
        source_id_doc = magazinesData.id;
      } else {
        doc_title = formData.name_of_journal;
        source_id_doc = journal_articlesData.id;
      }
      
      const document = {
        type: documentType === "journal" ? "article" : documentType,
        title: doc_title,
        author: (documentType === "book" || documentType === "journal") ? authorData.name : "",
        publisher: (documentType === "magazine" || documentType === "journal") ? formData.publisher : "",
        source: documentType === "journal" ? "journal_article" : documentType,
        source_id: source_id_doc,
        copies: formData.copies,
        is_electronic_copy: formData.is_electronic_copy === "no" ? false : true,
      };
      console.log(document)
  
      const documentResponse = await axios.post("http://127.0.0.1:8000/library/api/v1/documents", document, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include bearer token
        }
      });
  
      toast.success('Document created successfully!');
  
    } catch (error) {
      // You should refine error handling based on the error structures your APIs return
      console.error('An error occurred:', error);
      toast.error("An error occurred during document creation!");
    }
  };
  
  return (
    <div className="submit-form">
      <h4>Add New Document</h4>
      <div className="form-group">
        <label htmlFor="type">Document Type</label>
        <select id="type" required value={documentType} onChange={handleDocumentTypeChange}>
          <option value="book">Book</option>
          <option value="magazine">Magazine</option>
          <option value="journal">Journal</option>
        </select>
      </div>

      {documentAttributes[documentType].map((field) => (
        <input
          key={field}
          type={field.includes('year') || field.includes('issue') || field.includes('edition') || field.includes('no_of_pages') ? "number" : "text"}
          name={field}
          placeholder={field.split('_').join(' ').replace('no of pages', 'Number of Pages').replace('name of', 'Name of')}
          value={formData[field]}
          onChange={handleInputChange}
          required
        />
      ))}

      <button onClick={saveDocument} className="btn btn-success">
        Submit
      </button>
    </div>
  );
};

export default AddTutorial;
