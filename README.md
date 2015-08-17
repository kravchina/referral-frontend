# Referral Frontend

## Running locally

TODO

## End-to-end tests

End-to-end tests use [Protractor](https://github.com/angular/protractor) and are located under test/e2e/.

Tests have evolved into a separate framework with considerable amount of code, and thus with responsibilities separation, code reuse, libs with auxiliary code, etc. Please read below carefully and always make sure you know where and why you add your testing code.

Testing framework has the following top-level structure:
```
|
|- commons
|- pages
|- specs
\- MainSpec.js
```

Folder **commons** contains libraries with common functions used by many tests.

Folder **pages** contains files with [page objects](https://github.com/SeleniumHQ/selenium/wiki/PageObjects).

Folder **specs** contains the test suites themselves, with hierarchy inside.

File **MainSpec.js** is the entry point for running all specs.

Each and every test is expected to be reasonably (to the extent possible for e2e-tests) isolated. Particular e2e-related reason for isolation is that, depending on the browser, the whole set may take up to 5-15 minutes to run. Without isolation, supporting and debugging of each particular test would be a total nightmare.

Consequently, each and every test is expected to:
1. Prepare the website for itself (e.g. login with particular user, navigate to a particular page, etc.). Nobody else should prepare this -- isolation!
2. "Clean up after itself" (e.g. answer an alert question, if needed, perform a sign out, etc.). Test should not complicate life for other tests -- isolation!

Of course these actions are repeated for many tests (although not for all). This is where code reuse comes into play. For example, re-usable simple functions may be put into **commons**.

However, if we have 100 tests, moving log in and log out functions into **commons** doesn't save us from mentioning them 100 times. This is similarly true for, say, 10 different tests which check something on page X.

This is why a significant subset of tests is organized into a tree-like specs structure under **specs/StandardLogin**. It contains many various isolated tests and at the same time only one explicit mentioning of signInPage.clickLogin(), as well as, for example, only one mentioning of createReferralPage.open(). Reusing of these calls is achieved through hierarchical usage of proper beforeEach() and afterEach() definitions -- i.e. clickLogin() is located in the beforeEach() which is "above" all these tests, while createReferralPage.open() is in the beforeEach() above Create Referral tests. See the code for details. Many major use cases could be tested with the same single standard login and same standard page navigations, so if your test fits, save time by integrating it into the **StandardLogin** tree.

But of course standard approach will not suit all possible tests. If particular test requires, for example, two login operations one after another, or even simply special user's login operation, don't try to put it into the tree. This test should be located separately -- see samples directly under **specs**.

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

###Prepare running
It is highly recommended to run your tests on a test Rails environment.
Before every run you will need to your database to a initial ready-to-test state.
You can do that using two consequent commands:

```Batchfile
rake db:reset RAILS_ENV=test
rake db:seed_test RAILS_ENV=test STRIPE_API_SECRET_KEY=<your_stripe_api_key>
```
After that run your rails server in a test mode (or using predefined test configuration in your IDE):
```Batchfile
rails server -b 127.0.0.1 -p 3000 -e test
```
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

## Unit tests

### Installing and configuring the runner

Install karma stuff:

```Batchfile
npm install -g karma
npm install -g karma-cli
npm install -g karma-firefox-launcher
npm install -g karma-ie-launcher
```

Check presense of karma executable:

```Batchfile
karma --version
```

Read through **karma.conf.js** carefully. Most of the parameters are self-explaining and have comments.

### Running

For a single run:

```Batchfile
karma start karma.conf.js
```

## Gulp

How to install and use:  
1. Check the npm(node package manager) is already installed. If not, you should install Node.js, it included npm.  
2. Run this to install the depended packages `npm install`  
3. Rename the *GulpConfig.json.sample* to *GulpConfig.json* and replace inner keys on your.  
4. Use command *gulp* and task name with params(if required), e.g.: `gulp taskname --taskarg=argval`  

### Gulp tasks

#### Publish to amazon aws
Task format:
```Batchfile
gulp publish --bucket=[bucket_name]
```
The *bucket* argument is not required, default value: *dev1.dentallinks.org*.  
This task required an *accessKeyId* and *secretAccessKey*. You should be put it in *GulpConfig.json*