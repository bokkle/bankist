'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Mitch Riccio',
  movements: [850, 550, -300, 1000, -220, 2400, -300, 8000],
  interestRate: 1.1,
  pin: 5555,
};

const account6 = {
  owner: 'Daryl Sullivan',
  movements: [2500, -80, 600, -440, 700, 450, 375, -3000, 500],
  interestRate: 1.1,
  pin: 6666,
};

const accounts = [account1, account2, account3, account4, account5, account6];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSummary = document.querySelector('.summary');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = (acc) => {
  const incomes = acc.movements
    .filter((mov) => {
      return mov > 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => {
      return mov < 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => {
      return mov > 0;
    })
    .map((deposit) => {
      return (deposit * acc.interestRate) / 100;
    })
    .filter((int) => {
      return int >= 1;
    })
    .reduce((acc, int) => {
      return acc + int;
    }, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = (accs) => {
  accs.forEach((acc) => {
    //do not have to return... bc forEach creates 'side effects'
    acc.username = acc.owner //the work gets done
      .toLowerCase()
      .split(' ')
      .map((names) => {
        return names[0];
      })
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts); //usernames are created

const updateUI = (acc) => {
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
  // display movements
  displayMovements(acc.movements);
};

//Event Handler
let currentAccount;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault(); // prevent form from submitting

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and a welcome msg
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //removes the text cursor
    // update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    //delete acc
    accounts.splice(index, 1);
    //hide ui
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// why do arrays have methods?
//methods are functions attached to objects (arrays)
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE METHOD
// extract part of an array, without changing original
console.log(arr.slice(2)); // [c, d, e]
console.log(arr.slice(2, 4)); // end parameter isn't inclusive // [c, d]
// negative counts backwards from the end
console.log(arr.slice(-2)); // [d, e]
console.log(arr.slice(-1)); // [e]
console.log(arr.slice(1, -2)); // [b, c]

console.log(arr.slice()); // creates a shallow copy of the array
console.log([...arr]); // same as this. doesnt matter which u use

// SPLICE METHOD
//mutates the original array!
//usually only use splice to delete some elements from an array
//such as arr.splice(-1) to remove the last element
arr.splice(-1); // [e] is removed
console.log(arr);
//2nd parameter is the number of elements that you want to delete
arr.splice(1, 2); // [a, d]... [b, c] are deleted
console.log(arr);

// REVERSE METHOD
//mutates the original array!
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse())
console.log(arr2) // it has been reversed

// CONCAT
//used to concatenate 2 arrays
//does not mutate!
const letters = arr.concat(arr2)
console.log(letters)
console.log([...arr, ...arr2]) // same as above

// JOIN
console.log(letters.join(' - ')) // all letters separated by ' - '3

// THE NEW AT METHOD
//works on strings!
const arr = [23, 11, 64];
console.log(arr[0]) // [23]
console.log(arr.at(0)) // same as above

//to get the last element
console.log(arr[arr.length - 1]) // 64
console.log(arr.slice(-1)[0]) // 64
//using at
//this is typically what it is most useful for
//especially if method chaining
console.log(arr.at(-1)) // 64
console.log(arr.at(-2)) // 11 

console.log('Mitch'.at(0)) // M
console.log('Mitch'.at(-1)) // h
console.log('Mitch'[1])

// FOR EACH METHOD
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const movement of movements) {
  if (movement > 0) {
    console.log(`You deposited $${movement}`);
  } else {
    console.log(`You withdrew $${Math.abs(movement)}`);
  }
}
console.log('---FOREACH---');
//the above, with for each (easier?)
//foreach is a higher order function that requires a callback
//loops over the array, and in each iteration, executes the callback
//recieves the current element of the array as an argument
movements.forEach((movement) => {
  if (movement > 0) {
    console.log(`You deposited $${movement}`);
  } else {
    console.log(`You withdrew $${Math.abs(movement)}`);
  }
});
// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...

//what if we need access to a counter?
console.log('COUNTER?');
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: Deposited $${movement}`);
  } else {
    console.log(`Movement ${i + 1}: Withdrew $${Math.abs(movement)}`);
  }
}
//USING FOR EACH
//for each passes in the current element, the index, and the entire
console.log('FOR EACH');
movements.forEach((mov, i, arr) => {
    if (mov > 0) {
        console.log(`Movement ${i + 1}: Deposited $${mov}`);
      } else {
        console.log(`Movement ${i + 1}: Withdrew $${Math.abs(mov)}`);
      }
});
//1st parameter always needs to be the current element
//2nd parameter always needs to be the index
//3rd parameter always needs to be the array

// when to use forEach vs for of?
//main difference, you cannot break out of a forEach loop using..
//break or continue
//forEach will always loop over the entire array
//if you need to break out of a loop, use for of
// FOR EACH WITH MAPS AND SETS

// const currencies = new Map([
//     ['USD', 'United States dollar'],
//     ['EUR', 'Euro'],
//     ['GBP', 'Pound sterling'],
//   ]);

// MAP
currencies.forEach((value, key, map) => {
  console.log(`${key}: ${value}`); // USD: United States Dollar (etc)
});

// SET
// a set doesnt have keys or indexes
//therefore, the value === key
//still have to put value, key, map bc thats how it works
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique); // {USD, GBP, EUR}
//below: can just do (value, _, map) cannot drop key param altogether tho
currenciesUnique.forEach((value, key, map) => {
  console.log(`${key}: ${value}`); // USD: USD
});

// DATA TRANSFORMATIONS
//MAP, FILTER, REDUCE

//MAP
//another way to loop over arrays (like forEach), except MAP returns
//a brand new array, instead of mutating the original
// "MAPS THE VALUES OF ORIGINAL ARRAY TO A NEW ARRAY"
//has access to the exact same 3 params as forEach (elem, i, arr)

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUSD = 1.1;
// const movementsUSD = movements.map((mov) => {
//     return mov * eurToUSD
// })

const movementsUSD = movements.map((mov) => mov * eurToUSD);
console.log(movements);
console.log(movementsUSD);

const USDmov = [];
for (const mov of movements) {
  USDmov.push(mov * eurToUSD);
}
console.log(USDmov); //same result as map

const movementsDescriptions = movements.map((mov, i) => {
  return mov > 0
    ? `Movement ${i + 1}: You deposited ${mov}`
    : `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
});
console.log(movementsDescriptions);

//FILTER
// filters for elements in original array, which satisfy a condition
//returns a new, 'filtered' array
const deposits = movements.filter((mov) => {
  return mov > 0;
});

const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov);
  }
}
console.log(deposits);
console.log(depositsFor); //same as using filter

const withdrawals = movements.filter((mov) => {
  return mov < 0;
});
console.log(withdrawals);
//REDUCE
//"reduces" all array elements into a single value (ie, adding together)
console.log(movements);
//accumulator -> SNOWBALL
const balance = movements.reduce((acc, cur, i, arr) => {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);
console.log(balance);

let sum = 0;
for (const mov of movements) {
  sum += mov;
}
console.log(sum); // same as reduce

// maximum value of the movements array?
// 3000
//can use reduce...
const max = movements.reduce((acc, mov) => {
    if (acc > mov) {
        return acc
    } else {
        return mov
    }
}, movements[0])
console.log(max)

// METHOD CHAINING
const eurToUSD = 1.1;

// PIPELINE
const totalDepositsUSD = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * eurToUSD)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);

// FIND METHOD
//the callback function returns a boolean
//will not return a new array, but returns the first element in the array
//that satisfies the condition
//returns the element itself, not a new array
const firstWithdrawal = movements.find((mov) => mov < 0)
console.log(movements)
console.log(firstWithdrawal) // -400 first value that matches

console.log(accounts)
const account = accounts.find((acc) => acc.owner === 'Jessica Davis')
console.log(account)

//now do it with a for of loop
for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    console.log(acc)
  }
}

//OG loop 
for (let i = 0; i < accounts.length; i++) {
  if (accounts[i].owner === 'Jessica Davis') {
    console.log(accounts[i])
  }
}

// FIND INDEX (cousin of .find)
//returns the index of the found element, and not the elem itself

// SOME AND EVERY
console.log(movements);
//here we check for equality
console.log(movements.includes(-130));

//SOME
//here we can check for any specified condition
console.log(movements.some((mov) => mov === -130)); // equal to above
const anyDeposits = movements.some((mov) => mov > 1500);
console.log(anyDeposits);

//EVERY
//every only returns true if all of the elemts in array satisfy condition
console.log(movements.every((mov) => mov > 0))

//separate callback 
const deposit = mov => mov > 0
console.log(movements.some(deposit))
console.log(movements.every(deposit))
console.log(movements.filter(deposit))

//FLAT AND FLATMAP

//FLAT
//removes the nested arrays and flattens the array
//only goes 1 nested level deep
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat()); // [1, 2, 3, 4, 5, 6, 7, 8]

// FLATMAP
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat()); // doesnt quite flatten the deep nesting
console.log(arrDeep.flat(2)); // flattens bc the it looks 2 nested lvls deep

const accountMovements = accounts.map((acc) => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
const overallBalace = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalace);

const overall = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overall)

// instead of .map then .flat, we have .flatMap
//flatmap only goes 1 level deep, if you need more, still need to use
//the .map and .flat methods
const overall2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overall2)

// SORT
//mutates the original array
//does the sorting based on strings (converts everything to strings)
//if the array has both strings and numbers, dont use this.
const owners = ['Jonas', 'Zach', 'Mitch', 'Daryl'];
console.log(owners.sort()); // returns sorted in alphabetical order

console.log(movements);
// console.log(movements.sort()) // DOES NOT WORK
movements.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
});
//ascending
movements.sort((a, b) => a - b);
console.log(movements);
//descending
movements.sort((a, b) => b - a);
console.log(movements);

// MORE WAYS TO CREATE AND FILL ARRAYS

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

//empty arrays + fill method
const x = new Array(7);
console.log(x);

// x.fill(1)
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 4, 6);
console.log(arr); // 1, 2, 3, 4, 23, 23, 7

//what if we want to recreate arr ^ programatically?
const y = Array.from({ length: 7 }, () => 1);
console.log(y); // [1,1,1,1,1,1,1,1]

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

//create 100 random dice rolls
const rolls = Array.from({ length: 100 }, () => Math.ceil(Math.random() * 6));
console.log(rolls);

//ARRAY.FROM CONVERTS QUERYSELECTORALL NODELIST INTO ARRAY

labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    (el) => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')].map(
    (cur) => Number(cur.textContent.replace('€', ''))
  );
  console.log(movementsUI2);
});
*/

// ARRAY METHODS PRACTICE

// 1. calculate how much has been deposited, in total, in all accs
const bankDepositSum = accounts
  .map((acc) => acc.movements)
  .flat()
  .filter((mov) => mov > 0)
  .reduce((acc, cur) => acc + cur);
console.log(bankDepositSum);

// 2. count number of total deposits were at least $1000
const numDeposits1000 = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov >= 1000).length;
console.log(numDeposits1000);

// 2. now do it with reduce
const numDeposits1000Reduce = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov >= 1000)
  .reduce((acc, cur, i, arr) => arr.length, 0);
console.log(numDeposits1000Reduce);

// 2. now do it with reduce without filter
const numDeposits1000ReduceAgain = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000ReduceAgain);

// 3. create a new object which contains the sum of the deposits and the withdrawals
const sums = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur; // either one
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);

// 4. title case function
// this is a nice title => This Is a Nice Title
const convertTitleCase = (title) => {
  const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const converted = title
    .toLowerCase()
    .split(' ')
    .map((word) =>
      exceptions.includes(word)
        ? word
        : word.replace(word[0], word[0].toUpperCase())
    )
    .join(' ');
  return capitalize(converted);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
