# Referral Frontend

## Running locally

TODO

## End-to-end tests

End-to-end tests use [Protractor](https://github.com/angular/protractor) and are located under test/e2e/.

TODO -- folders structure and organization

### Installing and configuring

TODO -- Protractor

TODO -- IE

#### Setting up conf file

Repository contains a sample Protractor configuration file **ProtractorConf.js.sample**. Intended sequence is that each developer creates
a copy of it under the git-ignored name **ProtractorConf.js** and adjusts configuration for local running. This way developer's config
with passwords and everything does neither get into the repo nor irritates by staying uncommitted.

It's generally expected that each developer checks/sets the following params in the file:
* baseUrl;
* params.login.correct;
* params.viewReferralId;
* params.attachmentUrlPart.

### Running

Day-to-day local running sequence boils down to the following.

Open a standalone terminal and start webdriver-manager in it:

```Batchfile
webdriver-manager start
```

From project root, open another terminal and run tests:

```Batchfile
protractor ProtractorConf.js
```

#### Dev-time speedrun

When you're developing and debugging new tests you're likely to want quick results, not waiting for the whole sequence each time. The two
major places where you can manipulate with the amount of tests being run are:
* your **ProtractorConf.js** -- comment/uncomment individual browsers;
* **MainSpec.js** -- comment/uncomment sub-specs related to various application parts (Admin, Create Referral, View Referral, etc.).

### Known issues

Take the following into consideration:
* sometimes during first run some of the tests may fail. Please make sure you have run them all 2-3 times before taking actions on failures.


## Gulp

How to install and use:
1. Check the npm(node package manager) is already installed. If not, you should install Node.js, it included npm.
2. Run this to install the depended packages
```Batchfile
npm install
```
3. Rename the *GulpConfig.json.sample* to *GulpConfig.json* and replace inner keys on your.
4. Use command *gulp* and task name with params(if required), e.g.:
```Batchfile
gulp taskname --taskarg=argval
```

### Gulp tasks

#### Publish to amazon aws
Task format:
```Batchfile
gulp publish --bucket=[bucket_name]
```
The *bucket* argument is not required, default value: *dev1.dentallinks.org*.
This task required an *accessKeyId* and *secretAccessKey*. You should be put it in *GulpConfig.json*