import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(10000);

// 1. Truy cập /provider khi chưa login → phải redirect về login
await page.goto("http://localhost:8080/provider");
await page.waitForLoadState("networkidle");
console.log("Chưa login -> /provider redirect tới:", page.url());

// 2. Kiểm tra trang login có role picker
await page.goto("http://localhost:8080/auth/login");
await page.waitForLoadState("networkidle");
const h1 = await page.locator("h1").first().textContent();
console.log("Login page h1:", h1);

const providerVisible = await page.locator("button", { hasText: "Provider" }).first().isVisible();
const receiverVisible = await page.locator("button", { hasText: "Receiver" }).first().isVisible();
console.log("Provider button:", providerVisible, "| Receiver button:", receiverVisible);

await page.screenshot({ path: "C:/tmp/1-login.png" });

// 3. Login as Provider
await page.locator("button", { hasText: "Provider" }).first().click();
await page.locator('button[type="submit"]').click();
await page.waitForLoadState("networkidle");
console.log("Login provider -> redirect tới:", page.url());

await page.screenshot({ path: "C:/tmp/2-provider.png" });

// Kiểm tra tên user trong sidebar
const sidebarText = await page.locator("aside").textContent();
console.log("Sidebar có tên 'Nguyễn Minh Anh':", sidebarText?.includes("Nguyễn Minh Anh"));

// 4. Logout
const logoutVisible = await page.locator("button", { hasText: "Đăng xuất" }).first().isVisible();
console.log("Logout button visible:", logoutVisible);
await page.locator("button", { hasText: "Đăng xuất" }).first().click();
await page.waitForLoadState("networkidle");
console.log("Sau logout redirect tới:", page.url());

// 5. Login as Receiver
await page.goto("http://localhost:8080/auth/login");
await page.waitForLoadState("networkidle");
await page.locator("button", { hasText: "Receiver" }).first().click();
await page.locator('button[type="submit"]').click();
await page.waitForLoadState("networkidle");
console.log("Login receiver -> redirect tới:", page.url());

await page.screenshot({ path: "C:/tmp/3-receiver.png" });

// 6. Provider cố truy cập /provider khi đang là receiver → phải redirect
await page.goto("http://localhost:8080/provider");
await page.waitForLoadState("networkidle");
console.log("Receiver truy cập /provider → redirect tới:", page.url());

await browser.close();
console.log("--- DONE ---");
