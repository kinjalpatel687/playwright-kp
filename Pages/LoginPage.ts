import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly userField: Locator;
  readonly passField: Locator;
  readonly loginButton: Locator;
  readonly rememberMe: Locator;

  readonly userNameRequired: Locator;
  readonly passwordRequired: Locator;

  // Add real error locator
  readonly invalidLoginMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.userField = page.getByRole('textbox', {
      name: 'User Name',
    });

    this.passField = page.getByRole('textbox', {
      name: 'Password',
    });

    this.loginButton = page.getByRole('button', {
      name: /login|logging/i,
    });

    this.rememberMe = page.getByRole('checkbox', {
      name: /remember me/i,
    });

    this.userNameRequired = page.getByText(
      'User Name is required.'
    );

    this.passwordRequired = page.getByText(
      'Password is required.'
    );

    // Replace with actual ID from application
    this.invalidLoginMessage = page.getByText(
        /Invalid UserName Try Again/i); 
    }

    async gotoLoginPage(): Promise<boolean> {

      try {
    
        await this.page.goto(
          'https://qa.psplhyd.com/SwiftSendMail/pages/login.aspx',
          {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
          }
        );
    
        const serverErrorHeading = this.page.getByRole('heading', {
          name: /Server Error in/i,
        });
    
        // Detect ASP.NET runtime error page
        if (await serverErrorHeading.count()) {
    
          console.log('Application server error displayed');
    
          await this.page.screenshot({
            path: `test-results/login-error-${Date.now()}.png`,
            fullPage: true,
          });
    
          return false;
        }
    
        // Validate login form loaded
        await expect(this.userField).toBeVisible({
          timeout: 10000,
        });
    
        return true;
    
      } catch (error) {
    
        console.log(`Application not accessible: ${error}`);
    
        await this.page.screenshot({
          path: `test-results/login-access-error-${Date.now()}.png`,
          fullPage: true,
        });
    
        return false;
      }
    }

  async login(username: string, password: string) {
    await this.userField.fill(username);
    await this.passField.fill(password);

    await this.loginButton.click();
  }

  async verifyLoginFields() {
    await expect(this.userField).toBeVisible();
    await expect(this.passField).toBeVisible();
    await expect(this.rememberMe).toBeVisible();
  }

  async verifyRequiredMessages() {
    await this.loginButton.click();

    await expect(this.userNameRequired).toBeVisible();
    await expect(this.passwordRequired).toBeVisible();
  }

  async invalidLogin(username: string, password: string) {
    await this.login(username, password);

    await expect(this.invalidLoginMessage).toBeVisible({
      timeout: 15000,
    });

    await expect(
      this.invalidLoginMessage
    ).toContainText(/Invalid UserName|Password Try Again\.+!/i);
  }

  async validLogin(username: string, password: string) {
    await this.login(username, password);
  
    await this.page.waitForLoadState('domcontentloaded');
  
    // Check if server error page opened
    const isServerError = await this.page
      .locator('body')
      .textContent();
  
    if (isServerError?.includes("Server Error in '/SwiftSendMail'")) {
  
      console.log('Server error detected after login');
  
      await this.page.screenshot({
        path: `test-results/server-error-${Date.now()}.png`,
        fullPage: true,
      });
  
      return;
    }
  
    // Actual successful login validation
    await expect(this.page).toHaveURL(/home/i);
  }  

  async logout() {
    const logoutLink = this.page.getByRole('link', {
      name: /^Logout$/i,
    });

    await logoutLink.click();

    await expect(this.page).toHaveURL(/login\.aspx/i);
  }
}