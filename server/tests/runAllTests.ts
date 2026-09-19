import app from '../src/app';
import http from 'http';
import prisma from '../src/config/prisma';

let server: http.Server;
const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}/api`;

async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  console.log('🧪 Starting HerCart Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Start temporary test server
  server = app.listen(PORT);
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // 1. Health check
    const health = await fetchJson('/health');
    assert(health.status === 200 && health.data.status === 'ok', 'GET /api/health responds with status ok');

    // 2. Auth: Super Admin Login
    const adminLogin = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@hercart.demo', password: 'Admin@123' }),
    });
    assert(adminLogin.status === 200 && !!adminLogin.data.token, 'Super Admin login successful with JWT');
    const adminToken = adminLogin.data.token;

    // 3. Auth: Seller Login (Anu Handlooms)
    const sellerLogin = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'seller@hercart.demo', password: 'Seller@123' }),
    });
    assert(sellerLogin.status === 200 && sellerLogin.data.user.role === 'SELLER', 'Seller login successful with role SELLER');
    const sellerToken = sellerLogin.data.token;
    const sellerId = sellerLogin.data.user.sellerId;

    // 4. Auth: Invalid password rejection
    const badLogin = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@hercart.demo', password: 'WrongPassword' }),
    });
    assert(badLogin.status === 401, 'Invalid credentials rejected with 401');

    // 5. RBAC: Staff cannot update platform settings
    const staffLogin = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'staff@hercart.demo', password: 'Staff@123' }),
    });
    const staffToken = staffLogin.data.token;

    const staffSettingsAttempt = await fetchJson('/settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: JSON.stringify({ defaultCommissionRate: 10.0 }),
    });
    assert(staffSettingsAttempt.status === 403, 'Staff is forbidden from changing platform settings (RBAC 403)');

    // 6. Super Admin CAN update platform settings
    const adminSettingsUpdate = await fetchJson('/settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ defaultCommissionRate: 2.0 }),
    });
    assert(adminSettingsUpdate.status === 200, 'Super Admin can update platform settings (200 OK)');

    // 7. Product CRUD: Seller creates a product
    const newSku = `TEST-PRD-${Date.now().toString().slice(-4)}`;
    const createProd = await fetchJson('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: JSON.stringify({
        name: 'Handcrafted Test Cotton Scarf',
        categoryId: 1,
        sku: newSku,
        description: 'Test product for automated verification',
        price: 499.0,
        stockQuantity: 20,
        lowStockThreshold: 4,
      }),
    });
    assert(createProd.status === 201 && createProd.data.data.sku === newSku, 'Seller can create a product with 20 stock');
    const createdProductId = createProd.data.data.id;

    // 8. Seller Isolation: Sita Spices seller cannot update Anu Handlooms product
    const sitaLogin = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'sita.spices@hercart.demo', password: 'Seller@123' }),
    });
    const sitaToken = sitaLogin.data.token;

    const crossSellerAttempt = await fetchJson(`/products/${createdProductId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${sitaToken}` },
      body: JSON.stringify({ price: 999.0 }),
    });
    assert(crossSellerAttempt.status === 403, 'Seller data isolation: Sita cannot modify Anu product (403)');

    // 9. Inventory Adjustment & Audit Trail
    const invRes = await fetchJson('/inventory', {
      headers: { Authorization: `Bearer ${sellerToken}` },
    });
    const testInv = invRes.data.data.find((i: any) => i.productId === createdProductId);
    assert(!!testInv, 'Created product is present in seller inventory dashboard');

    if (testInv) {
      const adjustRes = await fetchJson(`/inventory/${testInv.id}/adjust`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${sellerToken}` },
        body: JSON.stringify({
          changeQuantity: 10,
          reason: 'Received fresh woven batch from artisan',
        }),
      });
      assert(adjustRes.status === 200 && adjustRes.data.data.inv.currentStock === 30, 'Inventory adjusted from 20 to 30 with audit note');
    }

    // 10. Orders: Status update & Commission calculation
    const ordersRes = await fetchJson('/orders', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(ordersRes.status === 200 && ordersRes.data.data.length > 0, 'Orders query returns seeded orders');

    const firstOrder = ordersRes.data.data[0];
    const updateOrder = await fetchJson(`/orders/${firstOrder.id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'PROCESSING', note: 'Packed and verified' }),
    });
    assert(updateOrder.status === 200 && updateOrder.data.data.status === 'PROCESSING', 'Order status progressed to PROCESSING');

    // 11. Reports & Analytics
    const analyticsOverview = await fetchJson('/analytics/overview', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(analyticsOverview.status === 200 && analyticsOverview.data.data.totalSales > 0, 'Analytics overview returns live DB sales data');

    const reportData = await fetchJson('/reports?type=commission', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(reportData.status === 200 && reportData.data.rows.length > 0, 'Commission report generated with transparent fee records');

    // Clean up test product
    await prisma.inventoryTransaction.deleteMany({ where: { inventory: { productId: createdProductId } } });
    await prisma.inventory.deleteMany({ where: { productId: createdProductId } });
    await prisma.productImage.deleteMany({ where: { productId: createdProductId } });
    await prisma.product.deleteMany({ where: { id: createdProductId } });

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
