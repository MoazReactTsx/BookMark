const websiteNameInput = document.getElementById("websiteName");
const websiteUrlInput = document.getElementById("websiteUrl");
const marksTable = document.getElementById("marksTable");

const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[\w\-]*)*$/;
websiteUrlInput.addEventListener("input", () => {
    validateInputs(websiteUrlInput, urlRegex);
})

addEventListener("DOMContentLoaded", (event) => {
    setBookmarks()
});


// to clear input data
function clearInputsData() {
    websiteNameInput.value = "";
    websiteUrlInput.value = "";
}

function getStoredBookmarks() {
    let soredItems = localStorage.getItem("bookmarks");
    let result = []
    if (!soredItems || soredItems == 'undefined') {
        result = [];
    } else {
        result = JSON.parse(soredItems);
    }
    return result;
}
function setStoredBookmarks(bookmarks) {
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
// Handle form submission
function submitForm(e) {
    e.preventDefault();
    console.log('submitForm');

    const websiteName = websiteNameInput.value.trim();
    const websiteUrl = websiteUrlInput.value.trim();

    if (!urlRegex.test(websiteUrl)) {
        alert("Please enter a valid URL.");
        return;
    }


    const bookmark = { name: websiteName, url: websiteUrl };
    const bookmarks = getStoredBookmarks();
    setStoredBookmarks([...bookmarks, bookmark]);
    setBookmarks();
    clearInputsData();
}




function setBookmarks() {
    marksTable.innerHTML = "";

    const bookmarks = getStoredBookmarks();

    bookmarks.forEach((el, _) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${el.name}</td>
            <td>${el.url}</td>
            <td>
                <a href="${el.url}" target="_blank" class="btn btn-success">
                    <i class="fa-solid fa-link"></i>
                </a>
            </td>
            <td>
                <button class="btn btn-warning" onclick="editBookmark(${_})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-danger" onclick="deleteBookmark(${_})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;

        marksTable.appendChild(row);
    });
}

// Delete a bookmark
function deleteBookmark(index) {
    const bookmarks = getStoredBookmarks();
    bookmarks.splice(index, 1);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    setBookmarks();
}

// Edit a bookmark
function editBookmark(index) {
    const bookmarks = getStoredBookmarks();
    const bookmark = bookmarks[index];
    removeValidation( websiteUrlInput);

    websiteNameInput.value = bookmark.name;
    websiteUrlInput.value = bookmark.url;

    document.getElementById("addBookmark").innerText = "Update";
    document.getElementById("addBookmark").onclick = function () {
        updateBookmark(index);
    };
}


// Update a bookmark
function updateBookmark(index) {
    const bookmarks = getStoredBookmarks();
    const updatedName = websiteNameInput.value.trim();
    const updatedUrl = websiteUrlInput.value.trim();

    if (!urlRegex.test(updatedUrl)) {
        alert("Please enter a valid URL.");
        return;
    }

    bookmarks[index] = { name: updatedName, url: updatedUrl };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    // Reset button and inputs
    document.getElementById("addBookmark").textContent = "Submit";
    document.getElementById("addBookmark").onclick = submitForm;
    
    clearInputsData();

    setBookmarks();
}

// Load bookmarks initially
function loadBookmarks() {
    setBookmarks();
}

function validateInputs(element, regex) {
    if (regex.test(element.value)) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
    } else {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
    }
}

function removeValidation(element) {
    element.classList.remove("is-valid");
    element.classList.remove("is-invalid");
}