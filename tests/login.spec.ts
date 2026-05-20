import { test } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

test.describe('Login Page', () => {

  test('Verify if user clicks on Login button without enter Email and Password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage();
    await loginPage.verifyLoginFields();
  });

  test('Verify error message when user enters invalid email address', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage();
    await loginPage.verifyRequiredMessages();
  });

  test('Verify invalid login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage();

    await loginPage.invalidLogin(
      'kp',
      'test'
    );
  });

  test('Verify valid login and logout', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage();

    await loginPage.validLogin(
      'psplclient17012026',
      'Test@123459'
    );

    console.log('Login successful');

    await loginPage.logout();

    console.log('Logout successful');
  });

});