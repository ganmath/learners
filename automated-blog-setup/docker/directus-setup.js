const axios = require("axios");

const directusUrl = "http://localhost:8055"; // Replace with your Directus public IP or domain
const adminEmail = "admin@example.com";
const adminPassword = "admin123";

// First Doha of Hanuman Chalisa
const firstDoha = {
  verse_number: 1,
  verse_text: "श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।",
  transliteration: "Sri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhari.",
  meaning: "I clean the mirror of my mind with the dust of Guru’s lotus feet.",
  explanation:
    "The first Doha of Hanuman Chalisa is an invocation to the Guru. It highlights the disciple’s humility and desire to purify their mind to receive knowledge and wisdom. The poet Tulsidas compares his mind to a mirror that reflects divine knowledge once cleaned of impurities.",
};

(async () => {
  try {
    console.log("Logging in to Directus...");
    // Step 1: Authenticate with Directus and get an access token
    const authResponse = await axios.post(`${directusUrl}/auth/login`, {
      email: adminEmail,
      password: adminPassword,
    });
    const accessToken = authResponse.data.data.access_token;
    console.log("Logged in successfully!");

    // Step 2: Update permissions for Admin role
    console.log("Updating permissions for Admin role...");
    const adminRoleId = "c4c37559-327e-44ba-b12c-6d8e6400491a"; // Replace with your Admin role ID

    const permissionPayload = {
      role: adminRoleId,
      collection: "*", // Apply to all collections
      action: "*", // Allow all actions
      fields: "*", // Apply to all fields
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      policy: {}, // Use an empty object for policy
    };

    await axios.post(`${directusUrl}/permissions`, permissionPayload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Permissions updated successfully!");

    // Step 3: Ensure 'verses' collection exists
    console.log("Creating 'verses' collection if not already present...");
    await axios.post(
      `${directusUrl}/collections`,
      {
        collection: "verses",
        fields: [
          { field: "verse_number", type: "integer", required: true },
          { field: "verse_text", type: "text", required: true },
          { field: "transliteration", type: "string", required: true },
          { field: "meaning", type: "text", required: true },
          { field: "explanation", type: "text", required: true },
        ],
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log("'verses' collection created or already exists!");

    // Step 4: Add the first Doha to the 'verses' collection
    console.log("Adding the first Doha...");
    const response = await axios.post(
      `${directusUrl}/items/verses`,
      firstDoha,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log("First Doha added successfully:", response.data);

    console.log("Directus setup completed successfully!");
  } catch (error) {
    console.error("Error setting up Directus:", error.response?.data || error.message);
  }
})();