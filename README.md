# PFA
An Ionic, health related, demo app for the 1st year final project at National School for Computer Science(ENSIAS).
## Running the app
Make sure [NodeJS](https://nodejs.org/en/) is installed.
### Open up your system console / terminal
Install Ionic CLI.
```
npm install -g @ionic/cli
```
Clone this repo.
```
git clone https://github.com/Hamza-IT/PFA.git
```
With the console/terminal, cd into the cloned folder and install any dependencies.
```
npm install
```
Build the app (the first command uses node to build while the second one builds with angular/cli, choose either).
```
npm run build
or
ng build
```
Serve the app
```
ionic serve
```
Head to http://localhost:8100 in your browser and you should hopefully see the app running :clap:.
(Tap CTRL+SHIFT+I to open the web console and then CTRL+SHIFT+M to get a mobile view of the app)
## Built APK
We've also got a pre-built, ready to test apk version to test on your android device: [DailyHealth.apk](http://www.mediafire.com/file/8irxceksnqqmthy/app-debug.apk/file)
## About the backend
It's ready to use with the current state of the app and is already deployed with the help of AWS Elastic Beanstalk. If you're using its source code, you'll need to specify the following environment:
```
    MONGO_ATLAS_USER: Your Mongo Atlas username for the cloud database,
    MONGO_ATLAS_PW: Your Mongo Atlas password,
    ONESIGNAL_REST_KEY: Your OneSignal REST API Key for push notifications,
    APP_ID: Your OneSignal app id,
    GMAIL_USER: Your Gmail username (If other service then modify the misc/mailer.js accordingly),
    GMAIL_PASS: Your Gmail password,
    JWT_ACCESS_KEY: A jsonwebtoken key,
    JWT_REFRESH_KEY: Another jsonwebtoken key
```

