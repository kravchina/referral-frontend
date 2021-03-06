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

TODO -- installing Protractor

TODO -- IE and replacing its 32-bit vs 64-bit Selenium drivers

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

E2E tests expect special data in the DB and in the Amazon S3 bucket, and also require a full data reset before each run (both in the DB and on S3).
Also, E2E tests require special token generation for various use cases. The server is prepared for that and generates tokens in a special
way when run on **test** Rails environment, and this is how server should be run for tests.

Day-to-day local running sequence boils down to the following.

Open a standalone rails terminal and reset the DB and S3 data:
```Batchfile
rake db:reset db:seed_test prepare_s3 RAILS_ENV=test STRIPE_API_SECRET_KEY=<your_stripe_api_key>
```

After that run your rails server in a test mode (or using predefined test configuration in your IDE):
```Batchfile
rails server -b 127.0.0.1 -p 3000 -e test
```

Next, open a standalone terminal and start webdriver-manager in it:
```Batchfile
webdriver-manager start
```

From the frontend project root, open another terminal and run the tests:
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
* sometimes during first run some of the tests may fail. Please make sure you have run them all 2-3 times before taking actions on failures;
* the tests were initially working in three browsers, Chrome, FF and IE, but at some point new versions of FF became incompatible with its drivers;
* E2E tests perform complex UI operations and don't work under PhantomJS;
* the most stable environment for running tests was 64-bit Windows 2008 R2 on Amazon t2.small intance with 2 GB RAM. There were problems running on Mac.

## Unit tests

### Installing and configuring the runner

Install karma stuff:

```Batchfile
npm install -g karma
npm install -g karma-cli
npm install -g karma-firefox-launcher
npm install -g karma-ie-launcher
```

Check the version of karma-jasmine:

```Batchfile
npm list -g karma-jasmine
```

It should output something like "karma-jasmine@0.3.6", NOT "karma-jasmine@0.1.6".

Note: if after these commands you don't have karma-jasmine at all, add `npm install -g karma-jasmine` above and run it yourself.

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

## Automated task runner

1. Install NPM and package dependencies
2. Setup GulpConfig file
3. Gulp tasks
    * Build
    * Run
    * Publish

### Install NPM and package dependencies

First you should install NodeJS for your platform. That contains the node package manager (NPM), that we use for installation of developers libraries. After installing try to use it: type `npm` in console (Linux/Max) or in *Node.js command promt* in Start -> All programs -> Node.js (Windows). 

For install developers dependencies you should go to the project directory. Run `npm install` for installation of dependencies from *package.json* file. Try to run `gulp` command. If this catches error (sometimes it happens), run `npm install gulp -g` in console.

If someone of developers added new dependencies and you have got an error when you tried to run gulp, you should run `npm install` again.

### Setup GulpConfig file

Copy `GulpConfig.json.sample` file and rename to GulpConfig.json. This file contains settings and keys for aws publish, app environments and dev server config.

### Gulp tasks

#### Build

Compile, minify and copy all the files to the `build` directory.

Task format:
```Batchfile
gulp build --env=environment_name
```

The **env** argument is not required, default value is: **local**.

#### Run

This runs the `build` task and after that it runs developer web server and opens browser with index page.

Task format:
```Batchfile
gulp run --env=environment_name
```
The **env** argument is not required, default value is: **local**.

#### Publish

This runs the `build` task and after that publish in amazon bucket.

Task format:
```Batchfile
gulp publish --env=environment_name
```
