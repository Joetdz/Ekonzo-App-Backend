
# About The Projet
Ekonzo App is a 100% online, secure and accessible Neo Cooperative Savings for everyone

An application allows people with a mobile money account to save their money in a fun way, without pressure and accessible to all budgets.


### Tech Stack

**Server:** Express, Mongo DB, 

## Getting Started

To get a local copy up and running follow these simple example steps.

**Prerequisites**

To run this project on your computer you will need the following tools

**NodeJS** ≥ v18.16.0 

**Npm** ≥ 9.5.1




## Installation

- This project uses the API exposed by the project https://github.com/Joetdz/Ekonzo-App-Backend.git so you must set up it in your local.


- Clone repos

```bash
 https://github.com/Joetdz/Ekonzo-App-Backend.git
```
- Switch to the repo folde


```bash
 cd Ekonzo-App-Backend
```

- Install all the dependencies using npm


```bash
 npm install
```
- Copy the example env file and make the required configuration changes in the .env file


```bash
 cp .env.example .env
```
- Upadate .env

```bash
MONGO_URL="url of Bdd"
MAISHAPAY_URL="url of  maishai pay"
MAISHAPAY_PUBLICKEY=" MAISHAPAY_PUBLICKEY"
MAISHAPAY_SECRETKEY="MAISHAPAY_SECRETKEY"

```

- Start projcet local
```bash
 npm run dev
```









    