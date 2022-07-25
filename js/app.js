// write your code here

// Creating the table

let table = document.querySelector(".mytable");
let expenseList = document.createElement("table");
expenseList.classList.add("table", "text-center");
let header = document.createElement("thead");
header.style.borderTop = "2px solid #dee2e6";
let row = document.createElement("tr");
let col = document.createElement("th");
col.innerHTML = "Expense Title";
col.style.paddingLeft = "90px";
let col1 = document.createElement("th");
col1.innerHTML = "Expense Amount";
col1.style.paddingLeft = "130px";
let col2 = document.createElement("th");
col2.style.paddingLeft = "200px";
let tbody = document.createElement("tbody");

table.appendChild(expenseList);
expenseList.append(header, tbody);
header.append(row);
row.append(col, col1, col2);

// hiding the table at the beginning

expenseList.style.display = "none";

function Budget() {
  this.budgetAmount = document.querySelector("#budget-amount");
  this.balanceAmount = document.querySelector("#balance-amount");
  this.expenseAmount = document.querySelector("#expense-amount");
  this.budgetInput = document.querySelector("#budget-input");
  this.expenseInputText = document.querySelector("#expense-input");
  this.expenseInputNumber = document.querySelector("#amount-input");
  this.budgetForm = document.querySelector("#budget-form");
  this.expenseForm = document.querySelector("#expense-form");
  this.elementID = 0;
  this.elementList = [];
}

let newAddBudget = new Budget();

newAddBudget.budgetForm.addEventListener("submit", AddBudget);

// submiting the budget form

function AddBudget(e) {
  e.preventDefault();

  let inputValue = newAddBudget.budgetInput.value;
  let feedback = document.querySelector(".budget-feedback");

  if (inputValue === "" || inputValue < 0) {
    feedback.classList.add("showItem");
    feedback.textContent = "Value cannot be empty or negative";

    newAddBudget.budgetInput.addEventListener("click", () => {
      feedback.classList.remove("showItem");
    });
  } else {
    newAddBudget.budgetAmount.textContent = inputValue;
    newAddBudget.budgetInput.value = "";
    balance();
  }
}

newAddBudget.expenseForm.addEventListener("submit", AddExpenses);

let isInEditMode = false;
let editingIndex;

// submiting the expense form

function AddExpenses(event) {
  event.preventDefault();

  let inputExpense = newAddBudget.expenseInputText.value;
  let inputAmountExpense = newAddBudget.expenseInputNumber.value;
  let expenseFeedback = document.querySelector(".expense-feedback");

  if (isInEditMode) {
    // find element in elementList array and update values

    newAddBudget.elementList[editingIndex - 1].title =
      newAddBudget.expenseInputText.value;
    newAddBudget.elementList[editingIndex - 1].amount =
      newAddBudget.expenseInputNumber.value;

    console.log(newAddBudget.elementList);

    // find tr in table and update td innerHtml

    const allTrs = document.querySelectorAll("table tr");
    const currentTr = allTrs[editingIndex];
    const allTds = currentTr.querySelectorAll("td");
    allTds[0].innerHTML = ` <h5 class="expense-title mb-0 font-weight-bold list-item">${newAddBudget.expenseInputText.value}</h5>`;
    allTds[1].innerHTML = `<h5 class="expense-title mb-0 font-weight-bold list-item">$${newAddBudget.expenseInputNumber.value}</h5>`;

    balance();

    isInEditMode = false;

    newAddBudget.expenseInputText.value = "";
    newAddBudget.expenseInputNumber.value = "";
  } else {
    if (
      inputExpense === "" ||
      inputAmountExpense === "" ||
      inputAmountExpense < 0
    ) {
      expenseFeedback.classList.add("showItem");
      expenseFeedback.textContent = "Value cannot be empty or negative";

      [newAddBudget.expenseInputText, newAddBudget.expenseInputNumber].forEach(
        (item) => {
          item.addEventListener("click", () => {
            expenseFeedback.classList.remove("showItem");
          });
        }
      );
    } else {
      let amount = parseInt(inputAmountExpense);

      let expense = {
        id: newAddBudget.elementID,
        title: inputExpense,
        amount: amount,
      };
      newAddBudget.elementID++;
      newAddBudget.elementList.push(expense);
      expenseList.style.display = "block";
      balance();
      createRow(expense);
      console.log(newAddBudget.elementList);
      newAddBudget.elementList.forEach((el, i) => (el.id = i));
      newAddBudget.expenseInputText.value = "";
      newAddBudget.expenseInputNumber.value = "";
    }
  }
}

// function for showing the balance on the top right

function balance() {
  const expense = totalExpense();
  const total = parseInt(newAddBudget.budgetAmount.textContent) - expense;
  newAddBudget.balanceAmount.textContent = total;
}
function totalExpense() {
  let total = 0;
  if (newAddBudget.elementList.length > 0) {
    total = newAddBudget.elementList.reduce(function (
      accumulator,
      currentValue
    ) {
      accumulator += parseInt(currentValue.amount);
      return accumulator;
    },
    0);
  }
  newAddBudget.expenseAmount.textContent = total;
  return total;
}

// function for creating the row in the table

function createRow(expense) {
  let tr2 = document.createElement("tr");
  tr2.classList.add("expense-td");
  tr2.innerHTML = `<td><h5 class="expense-title mb-0 font-weight-bold list-item">${expense.title}</h5> </td>
    <td><h5 class="expense-amount mb-0 font-weight-bold list-item">$${expense.amount}</h5></td>
     <td> <a href="#" class="edit-icon pl-5 mx-2 mt-0">
    <i class="fas fa-edit"></i>
     </a>
     <a href="#" class="delete-icon mt-0">
    <i class="fas fa-trash"></i>
     </a> </td>
     `;
  tbody.append(tr2);
}

// editing the row in the table

function editExpense(element) {
  isInEditMode = true;

  // fiding the row index

  let parent = element.parentElement.parentElement;
  editingIndex = parent.rowIndex;

  // updating the values
  let expense = newAddBudget.elementList[editingIndex - 1];
  newAddBudget.expenseInputText.value = expense.title;
  newAddBudget.expenseInputNumber.value = expense.amount;
}

// deleting the row from the table

function deleteExpense(element) {
  let parent = element.parentElement.parentElement;

  // remove from the array

  const idx = parent.rowIndex;
  newAddBudget.elementList.splice(idx - 1, 1);
  console.log(newAddBudget.elementList);

  // remove from the DOM
  parent.remove();

  // hide the table if there is not any rows left

  if (newAddBudget.elementList.length === 0) {
    expenseList.style.display = "none";
  }

  // after deleting row update the id

  newAddBudget.elementList.forEach((el, i) => (el.id = i));

  balance();
}

expenseList.addEventListener("click", function (event) {
  if (event.target.parentElement.classList.contains("edit-icon")) {
    editExpense(event.target.parentElement);
  } else if (event.target.parentElement.classList.contains("delete-icon")) {
    deleteExpense(event.target.parentElement);
  }
});
