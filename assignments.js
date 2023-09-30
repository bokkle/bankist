'use strict';
/*
console.log('CODING CHALLENGE 1:');
// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
// about their dog's age, and stored the data into an array (one array for each). For
// now, they are just interested in knowing whether a dog is an adult or a puppy.
// A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
// old.
// Your tasks:
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages
// ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the first and the last two dogs actually have
// cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
// ages from that copied array (because it's a bad practice to mutate function
// parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
// �
// ")
// 4. Run the function for both test datasets
// Test data:
// § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// Hints: Use tools from all lectures in this section so far

const checkDogs = (dogsJulia, dogsKate) => {
  const noCats = dogsJulia.slice(1, 3);
  const dogs = [...noCats, ...dogsKate];
  dogs.forEach((dog, i) => {
    const year = dog === 1 ? 'year' : 'years';
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} ${year} old`);
    } else {
      console.log(
        `Dog number ${i + 1} is still a puppy, and is ${dog} ${year} old`
      );
    }
  });
};
console.log('data set 1:');
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
console.log('data set 2:');
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

console.log('CODING CHALLENGE 2:');
// Let's go back to Julia and Kate's study about dogs. This time, they want to convert
// dog ages to human ages and calculate the average age of the dogs in their study.
// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
// ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is
// <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
// humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old (which is the same as
// keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know
// from other challenges how we calculate averages �)
// 4. Run the function for both test datasets
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]

const calcAverageHumanAge = (ages) => {
  const dogAge = ages.map((age) => {
    if (age <= 2) {
      return 2 * age;
    } else {
      return 16 + age * 4;
    }
  });
  const adults = dogAge.filter((age) => {
    return age >= 18;
  });
  const avgAdultAge = dogAge.reduce((acc, curr) => {
    if (curr >= 18) {
      return acc + curr;
    } else {
      return acc;
    }
  }, 0);
  return `Human ages: ${dogAge.join(', ')}. 
Adults: ${adults.join(', ')}. 
Average adult age: ${avgAdultAge / adults.length} years.`;
};
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// instructor answer
const calcAverageHumanAgeInstructor = (ages) => {
  const humanAges = ages.map((age) => {
    return age <= 2 ? 2 * age : 16 + age * 4;
  });
  const adults = humanAges.filter((age) => {
    return age >= 18;
  });
  const average = adults.reduce((acc, age) => {
    return acc + age / adults.length;
  }, 0);
  console.log(humanAges);
  console.log(adults);
  console.log(average);
};
calcAverageHumanAgeInstructor([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAgeInstructor([16, 6, 10, 5, 6, 1, 4]);

console.log('CODING CHALLENGE 3:');
// Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
// as an arrow function, and using chaining!
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]

const calcAverageHumanAgeArrow = (ages) => {
  const info = ages
    .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter((age) => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  return info;
};
console.log(calcAverageHumanAgeArrow([5, 2, 4, 1, 15, 8, 3]));


console.log('CODING CHALLENGE 4:');
// Julia and Kate are still studying dogs, and this time they are studying if dogs are
// eating too much or too little.
// Eating too much means the dog's current food portion is larger than the
// recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10%
// above and 10% below the recommended portion (see hint).
// Your tasks:
// 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
// the recommended food portion and add it to the object as a new property. Do
// not create a new array, simply loop over the array. Forumla:
// recommendedFood = weight ** 0.75 * 28. (The result is in grams of
// food, and the weight needs to be in kg)
// 2. Find Sarah's dog and log to the console whether it's eating too much or too
// little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
// the owners array, and so this one is a bit tricky (on purpose) �
// 3. Create an array containing all owners of dogs who eat too much
// ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
// ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"
// 5. Log to the console whether there is any dog eating exactly the amount of food
// that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an okay amount of food
// (just true or false)
// 7. Create an array containing the dogs that are eating an okay amount of food (try
// to reuse the condition used in 6.)
// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects �)
// The Complete JavaScript Course 26
// Hints:
// § Use many different tools to solve these challenges, you can use the summary
// lecture to choose between them �
// § Being within a range 10% above and below the recommended portion means:
// current > (recommended * 0.90) && current < (recommended *
// 1.10). Basically, the current portion should be between 90% and 110% of the
// recommended portion.
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(
  (dog) => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);

// 2.
const sarahDog = dogs.find((cur) => cur.owners.includes('Sarah'));

if (sarahDog.curFood < sarahDog.recommendedFood * 0.9) {
  console.log(
    `Sarah's dog eats too little by ${Math.abs(
      Math.ceil(sarahDog.curFood - sarahDog.recommendedFood * 0.9)
    )} grams`
  );
} else if (sarahDog.curFood > sarahDog.recommendedFood * 1.1) {
  console.log(
    `Sarah's dog eat's too much by ${Math.ceil(
      sarahDog.curFood - sarahDog.recommendedFood * 1.1
    )} grams`
  );
} else {
  console.log(`Sarah's dog eats the perfect amount`);
}

// 3.

const ownersEatTooMuch = dogs
  .filter((dog) => dog.curFood > dog.recommendedFood * 1.1)
  .map((dog) => dog.owners)
  .flat();
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter((dog) => dog.curFood < dog.recommendedFood * 0.9)
  .flatMap((dog) => dog.owners);
console.log(ownersEatTooLittle);
// ownersEatTooLittle.splice(0);

// 4.
const tooMuchStr =
  ownersEatTooMuch.length > 1
    ? ownersEatTooMuch.join(` and `) + `'s dogs eat too much!`
    : `No dog eats too much!`;

const tooLittleStr =
  ownersEatTooLittle.length > 1
    ? ownersEatTooLittle.join(' and ') + `'s dogs eat too little!`
    : `No dog's eat to little!`;
console.log(tooMuchStr);
console.log(tooLittleStr);

// 5.
const perfectFood = dogs.some((dog) => dog.curFood === dog.recommendedFood);
console.log(perfectFood);

// 6.
const okayFood = dogs.some(
  (dog) =>
    dog.curFood < dog.recommendedFood * 1.1 &&
    dog.curFood > dog.recommendedFood * 0.9
);
console.log(okayFood);

// 7.
const dogsEatingOkay = dogs.filter((dog) => {
  if (
    dog.curFood < dog.recommendedFood * 1.1 &&
    dog.curFood > dog.recommendedFood * 0.9
  ) {
    return dog;
  }
});
console.log(dogsEatingOkay);

// 8.
const ascendingRecommended = [...dogs].sort(
  (a, b) => a.recommendedFood - b.recommendedFood
);
console.log(ascendingRecommended);
console.log(dogs);

// INSTRUCTOR ANSWERS
/*
console.log('instructor answers');

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach((dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
// console.log(dogs);

// 2.
const dogSarah = dogs.find((dog) => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  }`
);

// 3.
const ownersEatTooMuch = dogs
  .filter((dog) => dog.curFood > dog.recFood)
  .flatMap((dog) => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter((dog) => dog.curFood < dog.recFood)
  .flatMap((dog) => dog.owners);
console.log(ownersEatTooLittle);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dog's eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dog's eat too little`);

// 5.
console.log(dogs.some((dog) => dog.cur === dog.recFood));

// 6.
const checkEatingOkay = (dog) =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(dogs.some(checkEatingOkay));

// 7.
dogs.filter(checkEatingOkay);

// 8.
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);
*/
