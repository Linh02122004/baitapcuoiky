const api_url = "http://127.0.0.1:3000";

const queryParams = new URLSearchParams(window.location.search);
console.log("queryParams: ", queryParams);
const oldShoes = Object.fromEntries(queryParams.entries());
let newShoes = { ...oldShoes }; // Use spread syntax to create a copy of oldShoes
const maGiay = localStorage.getItem("maGiay"); // Retrieve maGiay from localStorage
const tenGiayTag = document.getElementById("tenGiay");
const maGiayHtmlTag = document.getElementById("maGiayHtml");
const soLuongTag = document.getElementById("soLuong");
const nhaSXTag = document.getElementById("nhaSX");
const sizeTag = document.getElementById("size");
var imageInputTag = document.getElementById("imageInput");
var previewImageHtml = document.getElementById("previewImage");

function handleGetData() {
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
        maGiayHtmlTag.value = data.maGiay;
        tenGiayTag.value = data.tenGiay;
        soLuongTag.value = data.soLuong;
        nhaSXTag.value = data.nhaSX;
        sizeTag.value = data.size;
        previewImageHtml.src = data.imageGiay;

        previewImageHtml.style.display = "block";
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

handleGetData();

function updateShoes() {
  newShoes.tenGiay = document.getElementById("tenGiay").value;
  newShoes.soLuong = document.getElementById("soLuong").value;
  newShoes.nhaSX = document.getElementById("nhaSX").value;
  newShoes.size = document.getElementById("size").value;

  fetch(`${api_url}/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newShoes),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      resetForm();
    })
    .catch((err) => {
      alert("Can not update: " + err);
    });
}

function resetForm() {
  document.getElementById("updateForm").reset();
}

document
  .getElementById("updateForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    updateShoes();
  });
