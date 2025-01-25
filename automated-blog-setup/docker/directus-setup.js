const axios = require('axios');

const API_URL = "http://localhost:8055";
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

(async () => {
  const loginRes = await axios.post(`${API_URL}/auth/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  const token = loginRes.data.data.access_token;

  await axios.post(
    `${API_URL}/collections`,
    {
      collection: "blog_posts",
      schema: {
        name: "Blog Posts",
        hidden: false,
      },
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
})();