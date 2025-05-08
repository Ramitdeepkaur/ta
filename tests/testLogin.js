const { Builder, By, until } = require("selenium-webdriver");
(async function testLogin() {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
      await driver.get("http://localhost:3000/login");
      await driver.findElement(By.name("email")).sendKeys("test1@example.com");
      await driver.findElement(By.name("password")).sendKeys("password1234");
      await driver.findElement(By.tagName("button")).click();
  
      await driver.wait(until.urlContains("/home"), 15000);
      console.log("Login Test Passed!");
    } catch (error) {
      console.error("Login Test Failed!", error);
    } finally {
      await driver.quit();
    }
  })();
  