# dice
Provably Fair Dice Script with chat box written in Node.JS, MongoDB and Socket.IO  

Written as a single page application providing complete crypto gambling experience like professional crypto casinos.  

Minimal frontend is written in pure Javascript which is not optimized for mobile view.  

Check Implementation Here: [casino.webtricks.website](https://casino.webtricks.website)  

Created By: [webtricks](https://bitcointalk.org/index.php?action=profile;u=921974)

**Note: I have written the whole script in just over 4 hours and haven't tested any code so make sure to test each and every line of code if you plan to use any part of this script for PRODUCTION PURPOSE.**

---

## How to run script locally
```
$ git clone https://github.com/webt-tricks/dice.git
$ cd dice
$ npm install
# (make sure to install MongoDB before moving to next step. If you don't know how to install, please check YouTube guide, there are many)
# (Once MongoDB is installed and running locally, edit database name in `config/dev.env` file. 
# Example: MONGOOSE=mongodb://127.0.0.1:27017/casino-database)
$ npm run dev
```
---

## How to run script on web
You any cloud MongoDB service provider like MongoDB Atlas. Set-up production database. Retrieve database string and set up MONGOOSE environment variable equals to that string. 

---
## Other Informations:
1. To edit front-end of the script. Use `src/frontend` folder. To save changes, run `npm run build` command.
2. I have uploaded `config` folder which includes dev.env file which is intended to use only for development purposes. Make sure to delete that file and use your own environment variables if you plan to use script in any way.  
3. Anyone is free to use this script for whatever purpose he/she likes. There is no obligation.  


__BTC Address: 3G8uPe3XKGhyQ2HGZfrmT7yJSxeQ6kJHK4__
