const api_url = "http://127.0.0.1:3000";

document
  .getElementById("searchForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const searchParams = new URLSearchParams(formData).toString();

    try {
      const response = await fetch(`${api_url}/read?${searchParams}`);
      const result = await response.text();

      document.getElementById("searchResult").innerHTML = result;
    } catch (error) {
      console.error("Error:", error);
    }
  });
