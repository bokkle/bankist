'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const account5 = {
//   owner: 'Mitch Riccio',
//   movements: [850, 550, -300, 1000, -220, 2400, -300, 8000],
//   interestRate: 1.1,
//   pin: 5555,
// };

// const account6 = {
//   owner: 'Daryl Sullivan',
//   movements: [2500, -80, 600, -440, 700, 450, 375, -3000, 500],
//   interestRate: 1.1,
//   pin: 6666,
// };

// const accounts = [account1, account2, account3, account4, account5, account6];

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-10-01T23:36:17.929Z',
    '2023-10-04T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2023-10-04T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, '0');
  // const month = `${date.getMonth() + 1}`.padStart(2, '0');
  // const year = date.getFullYear();
  // // day/month/year
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMovement = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovement}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = (acc) => {
  const incomes = acc.movements
    .filter((mov, i, arr) => {
      return mov > 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => {
      return mov < 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

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
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
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
  displayMovements(acc);
};

//Event Handler /////////////////////////
let currentAccount;

// FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

//Experimenting with internationalization API

// labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(now);

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

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', // 2 digit, long
      year: 'numeric', // 2 digit
      // weekday: 'long', // short, narrow
    };
    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    //LONG WAY, JUST USE THE ABOVE API
    //create current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, '0');
    // const month = `${now.getMonth() + 1}`.padStart(2, '0');
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, '0');
    // const minutes = `${now.getMinutes()}`.padStart(2, '0');
    // // day/month/year
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

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
    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    //update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);

    //add loan date
    currentAccount.movementsDates.push(new Date().toISOString());
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

// ARRAY METHODS PRACTICE

// 1. calculate how much has been deposited, in total, in all accs
const bankDepositSum = accounts
  .map((acc) => acc.movements)
  .flat()
  .filter((mov) => mov > 0)
  .reduce((acc, cur) => acc + cur);
// console.log(bankDepositSum);

// 2. count number of total deposits were at least $1000
const numDeposits1000 = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov >= 1000).length;
// console.log(numDeposits1000);

// 2. now do it with reduce
const numDeposits1000Reduce = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov >= 1000)
  .reduce((acc, cur, i, arr) => arr.length, 0);
// console.log(numDeposits1000Reduce);

// 2. now do it with reduce without filter
const numDeposits1000ReduceAgain = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// console.log(numDeposits1000ReduceAgain);

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
// console.log(sums);

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
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

// CONVERTING AND CHECKING NUMBERS
//all nums are represented as floating point numbers (decimals)
// Base 10 -> 0 - 9
// Binary Base -> 0 1

console.log(23 === 23.0); // true
//js struggles with certain nums
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(1 / 10 + 2 / 10); // 0.30000000000000004

//convert strings to nums
console.log(Number('8')); // convert string to num
console.log(+'23' + +'23'); // +'num' also converts str to num

//parsing
//js will try to figure out what the number is in the str
//if base 10, parseInt 2nd arg is 10
//if binary base, parseInt 2nd are is 2
console.log(Number.parseInt('30px', 10)); // 30
//but the str needs to start with a num, otherwise:
console.log(Number.parseInt('e23', 10)); // NaN

//parseInt doesnt read decimals
console.log(Number.parseInt('   2.5rem  ')); // 2 (doesnt care about whitespace)
//parseFloat reads decimals
console.log(Number.parseFloat('   2.5rem')); // 2.5

//the older way of doing it was:
console.log(parseFloat('2.5rem'));
//which works, but in modern JS, encouraged to call parse on Number object

//to check if something is NOT A NUMBER
console.log(Number.isNaN(20)); // false, it is a num
console.log(Number.isNaN('20')); // false, converted === number
console.log(Number.isNaN(+'20X')); // true, is NaN
console.log(Number.isNaN(23 / 0)); // false (even though it's infinity?)

//solution for infinity?:
//check if something IS A NUMBER
console.log(Number.isFinite(20)); // true -> is is a num
console.log(Number.isFinite('20')); // false -> it is a str
console.log(Number.isFinite(+'20X')); // false - X
console.log(Number.isFinite(23 / 0)); // false, infinity

console.log(Number.isInteger(23)); // true
console.log(Number.isInteger(23.0)); // true
console.log(Number.isInteger(23 / 0)); // false
console.log(Number.isInteger('20')); // false
console.log(Number.isInteger(Number.parseFloat('20')));
console.log(Number.isFinite(Number.parseFloat('20rem')));

//go-to if need to check if something is a number? isFinite
//go-to if need to read a value out of a string (like css '2.5rem')? parseFloat

// MATH AND ROUNDING

//square root
console.log(Math.sqrt(25)); // 5
console.log(25 ** (1 / 2)); // 5 -> same equation as above
//cubic root
console.log(Math.sqrt(8 ** (1 / 3))); // 1.41...

console.log(Math.max(5, 18, 23, 11, 2)); // 23
//Math.max does type coercion
console.log(Math.max(5, 18, '23', 11, 2)); // 23
//will not work if str has letters, etc
console.log(Math.max(5, 18, '23p', 11, 2)); // NaN

console.log(Math.min(5, 18, 23, 11, 2)); // 2
console.log(Math.min(5, 18, '23', 11, 2)); // 2

//calc radius of a circle with 10px:
console.log(Math.PI * Number.parseFloat('10px') ** 2); // 314.1592...

//random gen
console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));

//rounding integers
//all of these methods will convert string to num (type coercion)
console.log(Math.trunc(23.3)); // 23 -> removes decimal

console.log(Math.round(23.3)); // 23 -> rounds to nearest whole num (0.5^)
console.log(Math.round(23.9)); // 24

console.log(Math.ceil(23.3)); // 24 -> rounds UP to nearest int
console.log(Math.ceil('23.9')); // 24

console.log(Math.floor(23.3)); // 23 -> rounds DOWN to nearest int
console.log(Math.floor(23.9)); // 23

// negative numbers ?
console.log(Math.trunc(-23.3)); // -23 -> removes decimal
console.log(Math.floor(-23.3)); // -24 -> rounds LOWER
console.log(Math.ceil(-23.3)); // -23 -> rounds HIGHER
console.log(Math.round(-23.3)); // -23
console.log(Math.round(-23.9)); // -24

//rounding decimals
console.log((2.7).toFixed(0)); // '3' -> always returns a string
console.log((2.7).toFixed(3)); // '2.700' -> 3 decimal points
console.log((2.345).toFixed(2)); // '2.35' -> 2 decimal points
console.log(+(2.345).toFixed(2)); // 2.35 -> converted to num

// REMAINDER OPERATOR
// returns the remainder of a division
console.log(5 % 3); // 2
//good to use to check if num is even or odd
console.log(6 % 2); // 0 -> even
console.log(7 % 2); // 1 -> odd

const isEven = (n) => n % 2 === 0;
console.log(isEven(10)); // true
console.log(isEven(1111)); // false

labelBalance.addEventListener('click', () => {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    //0, 2, 4, 6...
    if (i % 2 === 0) {
      row.style.backgroundColor = 'ghostwhite';
    }
    //0, 3, 6, 9
    if (i % 3 === 0) {
      row.style.backgroundColor = 'skyblue';
    }
  });
});
//do something every Nth time? use % 

// NUMERIC SEPARATORS 
//287,460,000,000
//can add _ in place of commas for readability, JS ignores them
const diameter = 287_460_000_000
console.log(diameter) // 287460000000

const priceCents = 345_99
console.log(priceCents) // 34599 cents

//both the same, 1500
const transferFee1 = 15_00
const transferFee2 = 1_500

//cannot place at the begging, end, or before/after a decimal 
const PI = 3.14_15
console.log(PI) // 3.1415

//numeric separaters cannot be used when converting from string
console.log(Number('230000')) // 230000
console.log(Number('230_000')) // NaN
console.log(parseInt('230_000')) // 230

// BIG INT
//in js, numbers are stored in 64 bits (64 1s and 0s)
//only 53 of these bits store the digits itself, the rest store the decimal point, etc
//this means there is a limit to the size a number can be

//this is the biggest number can safely represent
console.log(2 ** 53 - 1); // 9007199254740991
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

//larger? cannot be represented accurately

//BIGINT was added to deal with this. Can store num with no limit
console.log(43523643737847847845636365); // 4.3523643737847845e+25 ERROR
//add n at the end to convert to bigint
console.log(43523643737847847845636365n); // 43523643737847847845636365n
//can also use the BigInt function for large numbers, but still wont work
//if num is too large
console.log(BigInt(43523643737847847845636365)); // 43523643737847845141610496n
console.log(BigInt(12345678912345678)); // 17 digits max

//operations
//are carried out as expected, even with n
console.log(10000n + 10000n); // 20000n
console.log(8888888888888888888888888888888n * 10000000n); // 88888888888888888888888888888880000000n
//but cannot mix BIGINT with REGULAR NUM
const huge = 35645746537364736473673456345n;
const num = 8;
// console.log(Math.sqrt(16n)) // ERROR
// console.log(huge * num) // TYPEERROR
console.log(huge * BigInt(num)) // 285165972298917891789387650760n

//exceptions
console.log(20n > 15) // true, > and < will work
//below, are 2 different types, and === does not do type coercion
console.log(20n === 20) // false
console.log(typeof 20n) // BigInt
console.log(typeof 20) // number
console.log(20n == '20')// true -> loose == does type coercion, will work

console.log(huge + ' is REALLY BIG!') // WORKS!

//divisions
console.log(10n / 3n) //3n // removes the decimals 
console.log(13n / 3n) //4n

// DATES AND TIMES
//create a date
// 4 ways
const now = new Date();
console.log(now); // current date and time

console.log(new Date(''));
console.log(new Date('December 24, 2015')); // can be unreliable
console.log(new Date(account1.movementsDates[0]));

// (year, month, day, hour, minute, second)
// months are 0 based, so 10 === november
console.log(new Date(2037, 10, 19, 15, 23, 5)); // Thu Nov 19 2037 15:23:05 GMT-0500 (Eastern Standard Time)
//there is no Nov 33rd, this returns Dec 3rd automatically
console.log(new Date(2037, 10, 33));
//this will display the amount of milliseconds passed the initial unix time
console.log(new Date(0)) // Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)
//1969!
//convert days to milliseconds
console.log(new Date(3 * 24 * 60 * 60 * 1000)) // exactly 3 days later than above

// working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
//dont use .getYear() ever
console.log(future.getFullYear()); // 2037
console.log(future.getMonth()); // 10 -> Nov
console.log(future.getDate()); // 19 -> 19th
console.log(future.getDay()); // 4 -> day of the week (thursday)
console.log(future.getHours()); // 15 -> time, hours
console.log(future.getMinutes()); // 23 -> time, mins
console.log(future.getSeconds()); // 0 -> time, secs
//convert to a date obj to string that you can store somewhere
console.log(future.toISOString())// 2037-11-19T20:23:00.000Z
//timestamp for the date
// this is the milliseconds which have passed since the 1969 unix date
console.log(future.getTime()) // 2142274980000 
console.log(new Date(2142274980000))
//CURRENT TIMESTAMP FOR THIS EXACT MOMENT
console.log(Date.now()) // 1696281538665

//set versions of all the methods as well
future.setFullYear(2040)
console.log(future)
//etc etc etc

// OPERATIONS WITH DATES
const future = new Date(2037, 10, 19, 15, 23);
console.log(Number(future));
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1); // 10 (bc 10 day difference bt dates)
const days2 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24, 8));
console.log(days2); // 10, rounds to nearest day
const num = 3884764.23;
// can use NumberFormat to format the number with commas, or however
//they are formatted in respective countries

//when using an object to set style/unites in Intl formatting, look up...
//the keys/values required (celsius, miles-per-hour)
const options = {
  style: 'unit',
  // style: 'percent',
  style: 'currency',
  // unit: 'celsius',
  // unit: 'mile-per-hour',
  currency: 'EUR',
  useGrouping: false, // prints the number without , separators
};
//below: outputs 'US: 3,884,764.23'
//commas automatically added in bc of the International api
console.log('US:     ', new Intl.NumberFormat('en-US').format(num));
// 'Germany: 3.884.764,23
console.log('Germany: ', new Intl.NumberFormat('de-DE').format(num));
// Syria:  ٣٬٨٨٤٬٧٦٤٫٢٣
console.log('Syria: ', new Intl.NumberFormat('ar-SY').format(num));
// automatically returns the formatting that corresponds with their browser
console.log('Browser: ', new Intl.NumberFormat(navigator.language).format(num));

//doing the above, except using the options object
//object is passed in as the second arg in NumberFormat()

// US: 3,884,764.23 mph
console.log('US: ', new Intl.NumberFormat('en-US', options).format(num));
// Germany:  3.884.764,23 mi/h
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
// Syria:  ٣٬٨٨٤٬٧٦٤٫٢٣ ميل/س
console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(num));
// Browser:  3,884,764.23 mph
console.log(
  'Browser: ',
  new Intl.NumberFormat(navigator.language, options).format(num)
);
*/

// SETTIMEOUT AND SETINTERVAL
// setInterval runs until we stop it

// setTimeout runs just once, after a set amt of time
// once JS hits this line of code, it continues to the next lines of code
// it counts in the background and the setTimeout will complete
//this is called asynchronous JS
setTimeout(() => console.log('Here is your pizza'), 3000);
//waiting... will be logged before 'here is your pizzas'
console.log('Waiting...');
setTimeout(() => console.log("I'd like a pepperoni pizza"), 2000);

//we cannot just pass arguments into the () => in setTimeout
//instead, we pass the arguments after the defined timeout time
setTimeout(
  (ing1, ing2) => console.log(`Order 2: ${ing1} & ${ing2} pizza`),
  4000,
  'olives',
  'spinach'
);

//we can cancel the timer until the delay has passed
const ingredients = ['cheese', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Order 3: ${ing1} + ${ing2} pizza`),
  5000,
  ...ingredients
);

if (ingredients.includes('spinach')) {
  clearTimeout();
}

const smallEnough = (a, limit) => a.every((num) => num <= limit);

console.log(smallEnough([66, 101], 200));
console.log(smallEnough([78, 117, 110, 99, 104, 117, 107, 115], 100));
console.log(
  smallEnough([9, 8, 8, 0, 2, 3, 7, 1, 6, 9, 2, 8, 2, 7, 2, 6, 2], 5)
);

const arithmetic = (a, b, operator) => {
  return operator === 'add'
    ? a + b
    : operator === 'subtract'
    ? a - b
    : operator === 'multiply'
    ? a * b
    : a / b;
};
console.log(arithmetic(1, 2, "add"))

const dutyFree = (normPrice, discount, hol) => Math.trunc(hol / (normPrice * (discount / 100)))
console.log(dutyFree(12, 50, 1000))
console.log(dutyFree(17, 17, 500))
console.log(dutyFree(24, 35, 3000))

const minValue = (values) => Number(Array.from(new Set(values.sort((a, b) => a - b))).join(''))
console.log(minValue([1, 3, 1])) // 13
console.log(minValue([4, 7, 5, 7])) // 457
console.log(minValue([4, 8, 1, 4])) // 148
console.log(minValue([5, 7, 9, 5, 7])) // 579
console.log(minValue([6, 7, 8, 7, 6, 6])) // 678
// kek kek
// kek

const reverse = (arr) => arr.split('').reverse().join('')
//.

const remove = (str) => str.split('').filter((char) => char !== '!').join('') + '!'
console.log(remove('!!!Hi!'))
console.log(remove('Hi'))
console.log(remove('!Hi! Hi!!'))

const bump = (x) => x.split('').reduce((acc, char) => char === 'n' ? acc + 1 : acc, 0) <= 15 ? 'Wohoo!' : 'Car Dead'

console.log(bump("__nn_nnnn__n_n___n____nn__nnn"))
console.log(bump("__nn_nnnn__n_n___n____nn__nnnn"))
console.log(bump("__nn_nnnn__n_n___n____nn__nnnnn"))
// :) :) :)