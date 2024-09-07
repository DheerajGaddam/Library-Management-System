import axios from "axios";

export default axios.create({
  baseURL: "http://127.0.0.1:80sdfgbsf00/library/api/v1/",
  headers: {
    "Content-type": "application/json"
  }
});