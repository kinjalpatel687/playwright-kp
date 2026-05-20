import { test } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

test.describe('Login Page', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {

    loginPage = new LoginPage(page);
  
    const appLoaded = await loginPage.gotoLoginPage();
  
    test.skip(!appLoaded, 'Application is down');
  });

  test('Verify if user clicks on Login button without enter Email and Password', async () => {

    await loginPage.verifyLoginFields();
  });

  test('Verify error message when user enters invalid email address', async () => {

    await loginPage.verifyRequiredMessages();
  });

  test('Verify invalid login', async () => {

    await loginPage.invalidLogin(
      'kp',
      'test'
    );
  });

  test('Verify valid login and logout', async () => {

    await loginPage.validLogin(
      'psplclient17012026',
      'Test@123459'
    );

    console.log('Login successful');

    await loginPage.logout();

    console.log('Logout successful');
  });

});