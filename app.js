/** TODO LIST */
const tempContainer = document.createElement("div");
const selector = (path, parent = document) => parent.querySelector(path);

const emptyList = selector(".empty-list");
const listContainer = selector(".list-wrapper");
const formContainer = selector(".form-container form");
const inputElement = selector(".form-container input[type='text']");
const buttonElement = selector(".form-container input[type='submit']");


const todoData = {
    data: [], // { text: "TEXT CONTENT", done: false, id: 10 }
    current: null
}

formContainer.addEventListener("submit", (event) => {
    event.preventDefault();
    if (inputElement.value == "")
        return;

    if (todoData.current == null) {
        const data = { text: inputElement.value, done: false, id: Math.random() };
        emptyList.style.display = 'none';
        todoData.data.push(data);

        createList(data);
    } else {
        selector(`li:nth-child(${todoData.current + 1}) span`, listContainer).textContent = inputElement.value;
        todoData.data[todoData.current].text = inputElement.value;
        todoData.current = null;
        buttonElement.value = "Add";
    }

    inputElement.value = "";
    setLocalStorageData();
});

const getIndex = id => {
    return todoData.data.findIndex(el => el.id == id);
}

const createList = data => {
    tempContainer.innerHTML =`<li class="list-item${data.done?" marked":""}">
        <div class="marker"></div>
        <span>${data.text}</span>
        <div class="icons">
            <div class="edit icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            </div>
            <div class="delete icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
        </div>
    </li>`;

    const currentElement = tempContainer.firstElementChild;
    listContainer.append(currentElement);

    // LISTENER FOR SELECT ROW
    selector(".marker", currentElement).addEventListener("click", () => {
        let index = getIndex(data.id);
        if (todoData.data[index].done) 
            currentElement.classList.remove("marked");
        else currentElement.classList.add("marked");

        todoData.data[index].done = !todoData.data[index].done;
        setLocalStorageData();
    });

    // LISTENER TO EDIT BUTTON
    selector(".edit", currentElement).addEventListener("click", () => {
        let index = getIndex(data.id);
        todoData.current = index;
        buttonElement.value = 'Update';
        inputElement.value = todoData.data[index].text;
    });

    // LISTENER TO DELETE BUTTON
    selector(".delete", currentElement).addEventListener("click", () => {
        let index = getIndex(data.id);
        currentElement.remove();
        todoData.data.splice(index, 1);

        inputElement.value = "";
        todoData.current = null;
        buttonElement.value = 'Add';
        setLocalStorageData();

        if (todoData.data.length == 0)
            emptyList.style.display = 'flex';
    });
}

const getLocalStorageData = () => {
    const data = window.localStorage.getItem("tododata");
    if (data) {
        todoData.data = JSON.parse(data);
        todoData.data.forEach(createList);
        if (todoData.data.length > 0)
            emptyList.style.display = 'none';
    }
}

const setLocalStorageData = () => {
    const data = JSON.stringify(todoData.data);
    window.localStorage.setItem("tododata", data);
}

// GET LOCALSTORAGE VALUE
getLocalStorageData();