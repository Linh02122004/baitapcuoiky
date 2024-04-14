const api_url = "http://127.0.0.1:3000";

function handleGetData() {
  const magiayInput = document.getElementById("maGiay");
  const maGiay = magiayInput.value;

  fetch(`${api_url}/read/for/update?maGiay=${maGiay}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data received:", data);

      // Check if data is not empty
      if (Object.keys(data).length !== 0) {
        // Redirect to update.html with query parameters
        // const queryParams = new URLSearchParams(data).toString();
        console.log("maGiay: ", maGiay);
        localStorage.setItem("maGiay", maGiay);
        window.location.href = `./update.html`;
      } else {
        console.log("No data received for the given maGiay");
        // Handle the case where no data is received for the given maGiay
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      // Handle error, show error message to user, etc.
    });
}
