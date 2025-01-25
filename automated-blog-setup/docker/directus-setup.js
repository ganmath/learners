const axios = require('axios');

const API_URL = "http://localhost:8055"; // Directus API URL (update if needed)
const ADMIN_EMAIL = "admin@example.com"; // Admin email from docker-compose.yml
const ADMIN_PASSWORD = "admin123";       // Admin password from docker-compose.yml

async function setupDirectus() {
  try {
    // Step 1: Log in to Directus and get the access token
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    const accessToken = loginResponse.data.data.access_token;
    console.log("Logged in successfully. Access Token:", accessToken);

    // Step 2: Create a new collection called "blog_posts"
    const collectionResponse = await axios.post(
      `${API_URL}/collections`,
      {
        collection: "blog_posts",
        schema: {
          name: "Blog Posts",
          hidden: false,
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("Collection 'blog_posts' created:", collectionResponse.data.data);

    // Step 3: Add fields to the "blog_posts" collection
    const fields = [
      {
        field: "title",
        type: "string",
        schema: {
          name: "Title",
          required: true,
        },
      },
      {
        field: "content",
        type: "text",
        schema: {
          name: "Content",
          required: true,
        },
      },
      {
        field: "published",
        type: "boolean",
        schema: {
          name: "Published",
          required: false,
        },
      },
      {
        field: "created_at",
        type: "datetime",
        schema: {
          name: "Created At",
          required: true,
        },
      },
    ];

    for (const field of fields) {
      const fieldResponse = await axios.post(
        `${API_URL}/fields/blog_posts`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(`Field '${field.field}' created:`, fieldResponse.data.data);
    }

    console.log("Directus setup completed successfully!");
  } catch (error) {
    console.error("Error setting up Directus:", error.response?.data || error.message);
  }
}

setupDirectus();
