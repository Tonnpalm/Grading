import axios from "axios";

let config = axios.create({
  baseURL: `http://score.sc.chula.ac.th:80/api`,
  // baseURL: `http://localhost:8000/api`,
});

export { config as axios };
