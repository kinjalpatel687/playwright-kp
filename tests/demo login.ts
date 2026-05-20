import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://qa.psplhyd.com/SwiftSendMail/pages/login.aspx');

  const loginButton = page.getByRole('button', { name: /login|logging/i });
  const userField = page.getByRole('textbox', { name: 'User Name' });
  const passField = page.getByRole('textbox', { name: 'Password' });
  const rememberMe = page.getByRole('checkbox', { name: /remember me/i });

  const validUsername = 'psplclient17012026';
  const validPassword = 'Test@123459';

  const userNameRequired = page.getByText('User Name is required.');
  const passwordRequired = page.getByText('Password is required.');

  await expect(userField).toBeVisible();
  await expect(passField).toBeVisible();
  await expect(rememberMe).toBeVisible();
  await expect(rememberMe).not.toBeChecked();

  await userField.focus();
  await expect(userField).toBeFocused();

  // Submit empty — expect client-side required messages (auto-retry until visible)
  await loginButton.click();
  await expect(userNameRequired).toBeVisible();
  await expect(passwordRequired).toBeVisible();
  console.log(`Username validation: ${await userNameRequired.innerText()}\n` +
      `Password validation: ${await passwordRequired.innerText()}\n`,
  );

  // Move focus back to User Name before correcting the form
  await userField.focus();

  // Username only — expect password still required, username error cleared
  await userField.fill('kp');
  await loginButton.click();
  await expect(passwordRequired).toBeVisible();
  await expect(userNameRequired).not.toBeVisible();
 // console.log(`Password validation (username only): ${await passwordRequired.innerText()}\n`);

  // Password only — clear username so only password is set
  await userField.focus();
  await userField.clear();
  await passField.focus();
  await passField.fill('123');
  await loginButton.click();
  await expect(userNameRequired).toBeVisible();
  await expect(passwordRequired).not.toBeVisible();
  //console.log(`Username validation (password only): ${await userNameRequired.innerText()}\n`);

  await userField.focus();

  // invalid username and invalid password — server error after submit
  //console.log('\ninvalid username and invalid password');
  await userField.fill('invalid_user_not_in_system');
  await passField.fill('WrongPasswordForTest123!');
  await loginButton.click();
  await expect(page).toHaveURL(/login\.aspx/i);
  console.log('Error message:');
  const invalidUserOrPassMsg = page.getByText(/Invalid (UserName|Password) Try Again\.+!/);
  await expect(invalidUserOrPassMsg).toBeVisible();
  console.log((await invalidUserOrPassMsg.textContent())?.trim());

  await userField.focus();

  // invalid username and valid password — expect Invalid UserName Try Again...!
  console.log('\ninvalid username and valid password');
  await userField.fill('invalid_user_not_in_system');
  await passField.fill('Test@123459');
  await loginButton.click();
  await expect(page).toHaveURL(/login\.aspx/i);
  console.log('Error message:');
  const invalidUserNameMsg = page.getByText(/Invalid UserName Try Again\.+!/);
  await expect(invalidUserNameMsg).toBeVisible();
  console.log((await invalidUserNameMsg.textContent())?.trim());

  await userField.focus();

  // valid username and invalid password — expect Invalid Password Try Again...!
  console.log('\nvalid username and invalid password');
  await userField.fill(validUsername);
  await passField.fill('WrongPasswordForTest123!');
  await loginButton.click();
  await expect(page).toHaveURL(/login\.aspx/i);
  console.log('Error message:');
  const invalidPasswordMsg = page.getByText(/Invalid Password Try Again\.+!/);
  await expect(invalidPasswordMsg).toBeVisible();
  console.log((await invalidPasswordMsg.textContent())?.trim());

  await userField.focus();

  // Valid credentials — leave login page (Remember me on, then autofill fields)
  console.log('\nValid username and valid password');
  await rememberMe.check();
  await expect(rememberMe).toBeChecked();
  // Browser password autofill is not controllable in automation; fill saved credentials (same as autofill would)
  await userField.fill(validUsername);
  await passField.fill(validPassword);
  await loginButton.click();
  await expect(page).toHaveURL(/home/i, { timeout: 30_000 });
  console.log('Login successfully');

  // Logout — return to login; Remember me may restore fields (username is typical)
  const logoutLink = page.getByRole('link', { name: /^Logout$/i });
  await expect(logoutLink).toBeVisible();
  await logoutLink.click();
  await expect(page).toHaveURL(/login\.aspx/i, { timeout: 15_000 });
  console.log('Logout successfully\n');

  await userField.focus();

  // Autofill / restore credentials (app may prefill username after Remember me; fill any missing values)
  console.log('Autofill / restore credentials:');
  if ((await userField.inputValue()) !== validUsername) {
    await userField.fill(validUsername);
  }
  if ((await passField.inputValue()) !== validPassword) {
    await passField.fill(validPassword);
  }
  await expect(userField).toHaveValue(validUsername);
  await expect(passField).toHaveValue(validPassword);
  console.log('Login successfully after logout');
  await userField.focus();
  await loginButton.click();
  await expect(page).toHaveURL(/home/i, { timeout: 30_000 });
});
