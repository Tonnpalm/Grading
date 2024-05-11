import axios from "axios";

let config = axios.create({
    baseURL:`score.sc.chula.ac.th:33/api`
});

export {config as axios}