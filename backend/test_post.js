import fetch from "node-fetch"; // Node 18 has fetch built-in, but in common environments we can use standard fetch

async function run() {
  try {
    // 1. Log in as admin
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@authorgallery.com",
        password: "AdminPass123!",
      }),
    });

    console.log("Login Status:", loginRes.status);
    const loginData = await loginRes.json();
    console.log("Login Response:", loginData);

    const cookieHeader = loginRes.headers.get("set-cookie");
    console.log("Cookie:", cookieHeader);

    // Parse the token from cookie
    let tokenCookie = "";
    if (cookieHeader) {
      tokenCookie = cookieHeader.split(";")[0];
    }

    // 2. Publish book
    const publishRes = await fetch("http://localhost:5000/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": tokenCookie,
      },
      body: JSON.stringify({
        title: "Test Notepad Book",
        description: "Test notepad description",
        genres: "Fiction",
        price: "0",
        publishDate: "2026-06-24",
        content: "This is test notepad content written in the editor.",
        coverImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      }),
    });

    console.log("Publish Status:", publishRes.status);
    const publishData = await publishRes.json();
    console.log("Publish Response:", publishData);

  } catch (err) {
    console.error("Test error:", err);
  }
  process.exit(0);
}

run();
