// Placeholder for API constants

const BASE_URL = "https://advocai-backend.onrender.com";

export const API = {
  login: `${BASE_URL}/api/login`,
  register: `${BASE_URL}/api/register`,
  summarize: `${BASE_URL}/api/summarize`,
  chat: `${BASE_URL}/api/chat/:caseId`,
  cases: `${BASE_URL}/api/cases`,
   
};

export default API;