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
a copy of it under the git-ignored name **ProtractorConf.js** and adjusts configuration for local running.

Sample file is generally configured for running agains the dev1 environment, and also contains comments for most of the parameters.

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

### Known issues

Take the following into consideration:
* sometimes during first run some of the tests may fail. Please make sure you have run them all 2-3 times before taking actions on failures.
