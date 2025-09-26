import test, { expect, Page } from "@playwright/test";

async function acceptCookies(page: Page) {
  // On localise le bouton "Accepter les cookies" et on clique dessus
  const acceptCookiesButton = page.getByRole("button", { name: "Consent" });

  // On vérifie si le bouton est visible avant de cliquer
  if (await acceptCookiesButton.isVisible()) {
    await acceptCookiesButton.click();
  }
}

test.describe("Ecommerce's product page", () => {
  // Avant chaque test, on va sur la page d'accueil du site ecommerce
  // et on accepte les cookies
  test.beforeEach(async ({ page }) => {
    // On va sur la page d'accueil du site ecommerce
    await page.goto("https://automationexercise.com/");
    await acceptCookies(page);
  });

test("should go to product page", async ({ page }) => {
    // Ceci est un Locator, il permet de localiser un élément de la page
    // https://playwright.dev/docs/api/class-framelocator#frame-locator-get-by-label
    // Ici nous localisons le lien vers la page products.
    await page.getByRole("link", { name: " Products" }).click();

    // On vérifie que l'URL de la page est bien celle de la page des produits
    expect(page).toHaveURL("https://automationexercise.com/products");
    // On vérifie que le titre de la page est bien celui de la page des produits
    expect(await page.title()).toBe("Automation Exercise - All Products");
  });

test("should find a t-shirt", async ({ page }) => {
    await page.getByRole("link", { name: " Products" }).click();

    // On écrit dans la barre de recherche le mot "t-shirt"
    await page.getByRole("textbox", { name: "Search Product" }).fill("t-shirt");

    // On clique sur le bouton de recherche
    await page.getByRole("button", { name: "" }).click();

    // On vérifie qu'il n'y a que 3 produits affichés
    const products = page.locator(".features_items .product-image-wrapper");

    // On vérifie que le nombre de produits affichés est bien de 3
    await expect(products).toHaveCount(3);
  });

test("should contains product's details like title and price", async ({
    page,
  }) => {
    await page.goto("https://automationexercise.com/product_details/30");

    // On vérifie que le titre de la page est bien celle du produit
    expect(await page.title()).toBe("Automation Exercise - Product Details");
    // On vérifie que le titre du produit est bien celui attendu
    await expect(
      page.getByRole("heading", { name: "Premium Polo T-Shirts" })
    ).toBeVisible();
    // On vérifie que le prix du produit est bien présent
    await expect(page.getByText("Rs.")).toBeVisible();
    // On vérifie que le bouton "Add to cart" est bien visible
    await expect(page.getByRole("button", { name: " Add to cart" })).toBeVisible();
  });

test("should add to cart and display product in cart", async ({ page }) => {
  // Go to the Products page
  const productsLink = page.getByRole("link", { name: /products/i });
  if (await productsLink.isVisible().catch(() => false)) {
    await productsLink.click();
  } else {
    await page.locator('a[href="/products"]').first().click();
  }

  // Open any product details (use a stable one)
  await page.goto("https://automationexercise.com/product_details/30");
  await expect(page).toHaveTitle(/Product Details/i);

  // Click "Add to cart"
  await page.getByRole("button", { name: /add to cart/i }).click();

  // A modal pops: click "View Cart"
  await page.getByRole("link", { name: /view cart/i }).click();

  // We are on the cart page; verify URL
  await expect(page).toHaveURL(/\/view_cart/);

  // Check that the product row is visible and has info
  const firstRow = page.locator("#cart_info_table tbody tr").first();

  // product title appears somewhere in the row
  await expect(firstRow.getByText(/premium polo t-shirts/i)).toBeVisible();

  // price exists
  await expect(firstRow.locator(".cart_price")).toContainText("Rs.");

  // quantity updated to 1 (default)
  await expect(firstRow.locator(".cart_quantity")).toContainText("1");
});
});

