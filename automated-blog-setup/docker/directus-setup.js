const axios = require('axios');

const API_URL = "http://localhost:8055";
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

async function setupDirectus() {
  try {
    // Step 1: Log in to Directus and get the access token
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    const accessToken = loginResponse.data.data.access_token;
    console.log("Logged in successfully. Access Token:", accessToken);

    // Step 2: Check if "blog_posts" collection already exists
    const collectionsResponse = await axios.get(`${API_URL}/collections`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const existingCollections = collectionsResponse.data.data.map((c) => c.collection);
    if (existingCollections.includes("blog_posts")) {
      console.log('Collection "blog_posts" already exists. Skipping creation.');
    } else {
      // Step 3: Create "blog_posts" collection if it doesn't exist
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
    }

    // Step 4: Add fields to the "blog_posts" collection
    const fields = [
      {
        field: "title",
        type: "string",
        schema: {
          name: "title",
          table: "blog_posts",
          data_type: "varchar",
          max_length: 255,
          is_nullable: false,
        },
      },
      {
        field: "content",
        type: "text",
        schema: {
          name: "content",
          table: "blog_posts",
          data_type: "text",
          is_nullable: false,
        },
      },
      {
        field: "published",
        type: "boolean",
        schema: {
          name: "published",
          table: "blog_posts",
          data_type: "boolean",
          is_nullable: true,
        },
      },
      {
        field: "created_at",
        type: "dateTime", // Corrected type
        schema: {
          name: "created_at",
          table: "blog_posts",
          data_type: "datetime",
          is_nullable: false,
          default_value: "CURRENT_TIMESTAMP",
        },
      },
    ];

    for (const field of fields) {
      // Check if the field already exists
      const fieldResponse = await axios.get(`${API_URL}/fields/blog_posts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const existingFields = fieldResponse.data.data.map((f) => f.field);

      if (existingFields.includes(field.field)) {
        console.log(`Field "${field.field}" already exists in collection "blog_posts". Skipping creation.`);
      } else {
        const createFieldResponse = await axios.post(
          `${API_URL}/fields/blog_posts`,
          field,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        console.log(`Field '${field.field}' created:`, createFieldResponse.data.data);
      }
    }

    console.log("Directus setup completed successfully!");
  } catch (error) {
    console.error("Error setting up Directus:", error.response?.data || error.message);
  }
}

setupDirectus();