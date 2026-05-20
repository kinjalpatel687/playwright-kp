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

  async gotoLoginPage() {
    await this.page.goto(
      'https://qa.psplhyd.com/SwiftSendMail/pages/login.aspx'
    );
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