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

const accounts = [account1, account2, account3, account4];

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

const displayMovements = (movements) => {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
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
displayMovements(account1.movements);

const calcDisplayBalance = (movements) => {
  const balance = movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${balance}€`;
};
calcDisplayBalance(account1.movements);

const calcDisplaySummary = (movements) => {
  const incomes = movements
    .filter((mov) => {
      return mov > 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = movements
    .filter((mov) => {
      return mov < 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

//   const interest = movements.
};
calcDisplaySummary(account1.movements);

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
console.log(accounts); //usernames are created

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
*/
