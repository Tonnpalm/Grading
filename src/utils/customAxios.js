import axios from "axios";

let config = axios.create({
  baseURL: `http://score.sc.chula.ac.th:80/api`,
});

export { config as axios };
