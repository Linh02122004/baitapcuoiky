const api_url = "http://127.0.0.1:3000";

var addedShoesList = document.getElementById("added_shoes_list");
var maGiayHtml = document.getElementById("ma_giay");
var maGiayBlockHtml = document.getElementById("ma_giay_block");
var imageInputTag = document.getElementById("imageInput");
var previewImageHtml = document.getElementById("previewImage");
var checkImage = null;
function previewImageFn(event) {
  console.log("event: ", event);
  var imageInput = event.target;
  checkImage = imageInput.files[0];
  // Check if there's a file selected
  if (imageInput.files && imageInput.files[0]) {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const base64String = e.target.result;
      // Do something with the base64 string
      //   console.log(base64String);

      // Display the image preview
      previewImageHtml.src = base64String;
      previewImageHtml.style.display = "block";
    };

    reader.readAsDataURL(file);
  }
}
// console.log("previewImageHtml.src: ", previewImageHtml.src);
var giays = [];
maGiayBlockHtml.style.display = "none";
function updateAddedShoesList() {
  addedShoesList.innerHTML = "Danh sách giày đã thêm mới: "; // Xóa nội dung cũ
  giays.forEach(function (giay) {
    console.log("giay: ", giay);
    var shoeInfo = document.createElement("p");
    shoeInfo.textContent = `Mã giày: ${giay.maGiay}, Tên: ${giay.tenGiay}, Số lượng: ${giay.soLuong}, Nhà sản xuất: ${giay.nhaSX}, Size: ${giay.size}`;

    var addButton = document.createElement("button");
    addButton.textContent = "Submit One";
    addButton.onclick = function () {
      addOneGiay(giay);
      alert(`1 shoes created successfully!`);
    };

    shoeInfo.appendChild(addButton);
    addedShoesList.appendChild(shoeInfo);
  });
}
function addOneGiay(giay) {
  console.log("giay", giay); // Kiểm tra giá trị của 'giay'
  fetch(`${api_url}/create1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(giay),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response from server:", data); // Kiểm tra phản hồi từ máy chủ
      giays = giays.filter((item) => item.maGiay !== giay.maGiay);
      updateAddedShoesList();
      addedShoesList.innerHTML = "";
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Có lỗi xảy ra khi thêm giày. Vui lòng thử lại sau.");
    });
}

function AddGiay() {
  // console.log("123");
  var tenGiay = document.getElementById("ten_giay").value;
  var soLuong = document.getElementById("so_luong").value;
  var nhaSX = document.getElementById("nha_san_xuat").value;
  var size = document.getElementById("size").value;

  if (!validateForm()) {
    alert("Có thông tin chưa được nhập vào!!!");
    return;
  }

  var currentTime = new Date();

  // Lấy phút và giây
  var minute = currentTime.getMinutes();
  var second = currentTime.getSeconds();

  // Tạo mã giày tự động từ phút và giây
  var maGiay = "MG" + minute + second;

  var giay = {
    tenGiay: tenGiay,
    soLuong: soLuong,
    nhaSX: nhaSX,
    size: size,
    maGiay: maGiay,
    imageGiay: previewImageHtml.src,
  };

  giays.push(giay);
  updateAddedShoesList();
  outputMessage(`Giày [${tenGiay}] thêm thành công`, "blue");
  maGiayHtml.value = maGiay;
  maGiayBlockHtml.style.display = "block";
}

function submitGiay() {
  if (!validateForm()) {
    alert("Có thông tin chưa được nhập vào!!!");
    return;
  }
  fetch(`${api_url}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(giays),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from server:", data);
      alert(data.message);
      resetForm();
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}
function outputMessage(message, color) {
  var messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.style.color = color;
}
function resetForm() {
  document.getElementById("createForm").reset();
  document.getElementById("message").textContent = "";
  setFocusGiay();
  giays = [];
}
function setFocusGiay() {
  document.getElementById("ten_giay").focus();
}
function validateForm() {
  var tenGiay = document.getElementById("ten_giay").value;
  var soLuong = document.getElementById("so_luong").value;
  var nhaSX = document.getElementById("nha_san_xuat").value;
  var size = document.getElementById("size").value;
  // Kiểm tra xem có trường nào trống không
  if (
    tenGiay === "" ||
    soLuong === "" ||
    nhaSX === "" ||
    size === "" ||
    checkImage === null
  ) {
    outputMessage("Vui lòng nhập đầy đủ thông tin", "red");
    return false;
  }
  return true;
}
function refreshAddedShoesList() {
  giays = [];
  updateAddedShoesList();
  return false;
}
