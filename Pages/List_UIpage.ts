import { Page } from '@playwright/test';

export class ListPage {

  readonly page: Page;

  readonly listUrl =
    'https://qa.psplhyd.com/SwiftSendMail/pages/List.aspx';

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<boolean> {

    try {

      const response = await this.page.goto(this.listUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      // Handle null response
      if (!response) {

        console.log('No response received from application');

        return false;
      }

      // Handle server error status
      if (response.status() >= 500) {

        console.log(
          `Application returned server status: ${response.status()}`
        );

        return false;
      }

      // Detect server error page
      const pageContent = await this.page.content();

      if (
        pageContent.includes(
          "Server Error in '/SwiftSendMail' Application."
        ) ||
        pageContent.includes('Runtime Error')
      ) {

        console.log('Server error page displayed');

        return false;
      }

      // Validate page loaded
      const manageLists = this.page.getByText(
        'Manage Lists',
        { exact: true }
      );

      const isVisible = await manageLists
        .isVisible()
        .catch(() => false);

      if (!isVisible) {

        console.log('Manage Lists page not loaded');

        return false;
      }

      console.log('Application loaded successfully');

      return true;

    } catch (error) {

      console.log('Application is inaccessible');

      return false;
    }
  }
}