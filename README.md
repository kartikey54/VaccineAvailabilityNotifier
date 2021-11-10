# VaccineNotifier
VaccineNotifier checks the cowin portal periodically to find vaccination slots available in your pin code and for your age. If found, it will send you emails every minute until the slots are available.


## Steps to run the script:

1. Download/clone this repository.

2. To enable this script to be able to send emails using your Gmail account, generate an application-specific password for this script, in your Google account with steps given here: https://support.google.com/accounts/answer/185833  
(This will require you to have 2-step verification enabled in your Google account)

3. Enter the details for your email account in the [`.env` file](./.env), present in the same folder in which you cloned this repository.

4. Make sure you have [nodejs](https://nodejs.org/en/download/) installed.

5. To run this process in the background, install the [pm2 package](https://www.npmjs.com/package/pm2) globally. Enter the below command in your terminal:

	```
	npm install -g pm2
	```

	**Note:** This command usually requires elevation, so run it as administrator or use `sudo` depending on your platform.

5. Open a terminal inside the folder where this repository is cloned, and run:

	```
	npm install
	pm2 start vaccineNotifier.js
	```

6. To stop the script running in the background, run:

	```
	pm2 stop vaccineNotifier.js
	```

7. To unregister this script from pm2 (do this if you never want to run this script again), run:

	```
	pm2 delete vaccineNotifier.js
	```

Here's a sample of the resultant E-mail sent by this script:

![Sample email screenshot](./sampleEmail.png)
