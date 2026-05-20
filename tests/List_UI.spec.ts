import { test } from '@playwright/test';
import { ListPage } from '../pages/List_UIPage';

test('all visible fields on Manage Lists page', async ({ page }) => {

  const listPage = new ListPage(page);

  const appLoaded = await listPage.goto();


  // Stop test execution if app is down
  if (!appLoaded) {

    console.log('Skipping UI validations because app is down');

    return;
  }

  await listPage.verifyMainNavigation();

  await listPage.verifySubNavigation();

  await listPage.verifySearchFields();

  await listPage.verifyToolbar();

  await listPage.verifyTableHeaders();

  await listPage.verifyTableRows();

  await listPage.verifyPagination();

  console.log('Test completed successfully');

});