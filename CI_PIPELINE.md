# Practical 12: CI/CD Pipeline with GitHub Actions

## Pipeline

The workflow at `.github/workflows/ci.yml` runs on pushes and pull requests targeting `main`. It has independent jobs to install backend dependencies and run the Node.js test suite, and to install frontend dependencies, run ESLint, and build the Vite app. Both use Node.js 22, which is required by the current frontend tooling and backend dependencies.

## Demonstrate a passing run

1. Push the workflow to GitHub on `main`.
2. Open the repository's **Actions** tab and select **CI Pipeline**.
3. Open the newest run and confirm both **Backend tests** and **Frontend lint and build** pass.
4. Capture the run summary with the green check mark.

Suggested caption: *Figure 1: GitHub Actions CI pipeline passes backend tests and frontend lint/build.*

## Demonstrate a failed test and fixed run

Do not intentionally push a broken test to `main`. Use a temporary branch for the required failure demonstration:

1. Create a branch such as `practical-12-failure-demo`.
2. Temporarily change one existing test assertion to an incorrect expected value, then commit and push that branch.
3. Since direct push runs are limited to `main`, open a pull request from the demo branch to `main` to trigger CI. Keep the deliberately failing assertion on this demo PR, and capture the failed run and test log.
4. Restore the correct assertion, commit, and push to the same branch. Capture the passing workflow run.
5. Close the demo pull request without merging if the demonstration is only for the lab.

Suggested captions:

- *Figure 2: GitHub Actions reports a failing test assertion on the demonstration pull request.*
- *Figure 3: GitHub Actions passes after the test assertion is corrected.*

Never leave a deliberately broken test on `main`. Do not make screenshots that claim a run occurred unless it is visible in GitHub Actions.

## Conclusion

In this practical, I configured GitHub Actions to install backend and frontend dependencies automatically and validate the project on pushes and pull requests to `main`. The pipeline runs backend tests, frontend linting, and a production build, reporting a clear pass or failure for each job. A temporary pull request can demonstrate how a broken test fails and how correcting it restores a passing run. This is continuous integration: it checks changes automatically; it does not deploy the application.
