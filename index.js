import { select, intro, outro, isCancel, log } from "@clack/prompts";

const acceptedCoins = [
  {
    label: "0.05",
    value: 0.05,
  },
  {
    label: "0.10",
    value: 0.1,
  },
  {
    label: "0.25",
    value: 0.25,
  },
  {
    label: "1",
    value: 1,
  },
];

const coinValues = acceptedCoins.map((coin) => coin.value).reverse();

const products = [
  {
    name: "Water",
    price: 0.65,
  },
  {
    name: "Juice",
    price: 1,
  },
  {
    name: "Soda",
    price: 1.5,
  },
];

const truncate = (num) => Math.trunc(num * 100) / 100;

intro(`Welcome to Refuel Hub.`);

let exit = false;

let coins = [];

function clearCoins() {
  log.info(coins.join(", "));
  coins = [];
  exit = true;
}

while (!exit) {
  const option = await select({
    message: "Select an option",
    options: [
      {
        value: 0,
        label: "Insert money",
      },
      {
        value: 1,
        label: "Return coins",
      },
      {
        value: 2,
        label: "GET Water, GET Juice, GET Soda",
      },
      {
        value: 3,
        label: "Exit (all money will be returned)",
      },
    ],
  });
  if (isCancel(option) || option === 3 || option === 1) {
    clearCoins();
  } else if (option === 0) {
    const option = await select({
      message: "Select coin",
      options: acceptedCoins,
    });
    coins.push(option);
  } else {
    const option = await select({
      message: "Select product",
      options: products.map((product) => ({
        value: product,
        label: product.name,
      })),
    });
    const totalCoins = coins.reduce((acc, cur) => cur + acc, 0);
    const trunc = truncate(totalCoins);
    if (option.price > trunc) {
      log.warn("Not enougth coins");
    } else {
      if (option.price < trunc) {
        const returnCoins = [];
        let rem = truncate((trunc * 100 - option.price * 100) / 100);
        while (rem > 0) {
          const coin = coinValues.find((c) => c <= rem);
          returnCoins.push(coin);
          rem = truncate((rem * 100 - coin * 100) / 100);
        }
        log.info(returnCoins.join(", "));
      }
      log.success(option.name);
      exit = true;
    }
  }
}

outro("Thank you for using Refuel Hub! See you next time!");
