import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting HerCart database seed...');

  // Clean existing data in reverse dependency order
  await prisma.review.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.platformSettings.deleteMany();

  // 1. Platform Settings
  await prisma.platformSettings.create({
    data: {
      id: 1,
      platformName: 'HerCart',
      tagline: 'Affordable Digital Commerce for Every Seller',
      defaultCommissionRate: 2.0, // 2% transparent commission
      defaultGstRate: 5.0, // 5% GST
      shippingFeeFlat: 50.0,
      freeShippingThreshold: 999.0,
      currencySymbol: '₹',
      supportEmail: 'support@hercart.demo',
    },
  });

  // 2. Permissions
  const permissionsData = [
    { name: 'PRODUCT_CREATE', description: 'Create new products', rolesJson: JSON.stringify(['SUPER_ADMIN', 'SELLER', 'STAFF']) },
    { name: 'PRODUCT_READ', description: 'View products', rolesJson: JSON.stringify(['SUPER_ADMIN', 'SELLER', 'STAFF', 'CUSTOMER']) },
    { name: 'PRODUCT_UPDATE', description: 'Edit existing products', rolesJson: JSON.stringify(['SUPER_ADMIN', 'SELLER', 'STAFF']) },
    { name: 'PRODUCT_DELETE', description: 'Delete products', rolesJson: JSON.stringify(['SUPER_ADMIN', 'SELLER']) },
    { name: 'ORDER_READ', description: 'View orders', rolesJson: JSON.stringify(['SUPER_ADMIN', 'SELLER', 'STAFF', 'CUSTOMER']) },
    { name: 'ORDER_UPDATE', description: 'Update order status and fulfillment', rolesJson: JSON.stringify(['SUPER_ADMIN', 'SELLER', 'STAFF']) },
    { name: 'CUSTOMER_READ', description: 'View customer directory and histories', rolesJson: JSON.stringify(['SUPER_ADMIN', 'SELLER', 'STAFF']) },
    { name: 'INVENTORY_READ', description: 'View inventory and low stock alerts', rolesJson: JSON.stringify(['SUPER_ADMIN', 'SELLER', 'STAFF']) },
    { name: 'INVENTORY_UPDATE', description: 'Record manual stock adjustments', rolesJson: JSON.stringify(['SUPER_ADMIN', 'SELLER', 'STAFF']) },
    { name: 'REPORT_READ', description: 'Generate and export reports', rolesJson: JSON.stringify(['SUPER_ADMIN', 'SELLER', 'STAFF']) },
    { name: 'USER_MANAGE', description: 'Manage users and roles', rolesJson: JSON.stringify(['SUPER_ADMIN']) },
    { name: 'SETTINGS_MANAGE', description: 'Configure commission and platform settings', rolesJson: JSON.stringify(['SUPER_ADMIN']) },
    { name: 'AUDIT_READ', description: 'Inspect audit trail', rolesJson: JSON.stringify(['SUPER_ADMIN']) },
  ];

  for (const perm of permissionsData) {
    await prisma.permission.create({ data: perm });
  }

  // Common password hashes
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const sellerPasswordHash = await bcrypt.hash('Seller@123', 10);
  const staffPasswordHash = await bcrypt.hash('Staff@123', 10);
  const customerPasswordHash = await bcrypt.hash('Customer@123', 10);

  // 3. Core Users
  const superAdminUser = await prisma.user.create({
    data: {
      email: 'admin@hercart.demo',
      passwordHash: adminPasswordHash,
      name: 'Radhika Sen (Super Admin)',
      role: 'SUPER_ADMIN',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@hercart.demo',
      passwordHash: staffPasswordHash,
      name: 'Pooja Verma (Store Operations)',
      role: 'STAFF',
      phone: '+91 98765 43211',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 4. Five Realistic Sellers
  const sellersData = [
    {
      email: 'seller@hercart.demo', // Primary Demo Seller
      password: sellerPasswordHash,
      name: 'Anasuya (Anu) Rao',
      phone: '+91 98450 12345',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      businessName: 'Anu Handlooms',
      businessCategory: "Women's Clothing",
      description: 'Handcrafted cotton kurtis, handloom sarees, and traditional ethnic wear woven by local weavers in Pochampally.',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      bankName: 'State Bank of India',
      bankAccountNo: '98765432101',
      ifscCode: 'SBIN0004567',
      commissionRate: 2.0,
      status: 'APPROVED',
    },
    {
      email: 'sita.spices@hercart.demo',
      password: sellerPasswordHash,
      name: 'Sita Devi Sharma',
      phone: '+91 94140 23456',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      businessName: 'Sita Organic Spices & Pickles',
      businessCategory: 'Food & Local Products',
      description: 'Sun-dried homemade pickles, stone-ground masalas, and organically farmed turmeric sourced from Guntur farms.',
      city: 'Guntur',
      state: 'Andhra Pradesh',
      pincode: '522002',
      bankName: 'HDFC Bank',
      bankAccountNo: '87654321092',
      ifscCode: 'HDFC0001234',
      commissionRate: 2.0,
      status: 'APPROVED',
    },
    {
      email: 'meera.crafts@hercart.demo',
      password: sellerPasswordHash,
      name: 'Meera Kumhar',
      phone: '+91 98290 34567',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      businessName: 'Meera Artisan Terracotta & Pottery',
      businessCategory: 'Home Decor',
      description: 'Eco-friendly terracotta cookware, earthen water pots, hand-painted festive diyas, and sustainable planters.',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
      bankName: 'Bank of Baroda',
      bankAccountNo: '76543210983',
      ifscCode: 'BARB0JAIPUR',
      commissionRate: 2.0,
      status: 'APPROVED',
    },
    {
      email: 'kavya.jewels@hercart.demo',
      password: sellerPasswordHash,
      name: 'Kavya Subramaniam',
      phone: '+91 98401 45678',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      businessName: 'Kavya Thread & Bead Jewelry',
      businessCategory: 'Jewelry',
      description: 'Exquisite silk thread bangles, temple jhumkas, beaded chokers, and handmade bridal terracotta jewelry.',
      city: 'Madurai',
      state: 'Tamil Nadu',
      pincode: '625001',
      bankName: 'Canara Bank',
      bankAccountNo: '65432109874',
      ifscCode: 'CNRB0002345',
      commissionRate: 2.5,
      status: 'APPROVED',
    },
    {
      email: 'priya.herbal@hercart.demo',
      password: sellerPasswordHash,
      name: 'Priya Nambiar',
      phone: '+91 94471 56789',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      businessName: 'Priya Herbal Wellness',
      businessCategory: 'Beauty & Personal Care',
      description: 'Cold-pressed virgin coconut oil, pure Kannauj rose water mist, and herbal ubtan made using Ayurvedic recipes.',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682001',
      bankName: 'Federal Bank',
      bankAccountNo: '54321098765',
      ifscCode: 'FDRL0001122',
      commissionRate: 2.0,
      status: 'APPROVED',
    },
    {
      email: 'uma.weaves@hercart.demo',
      password: sellerPasswordHash,
      name: 'Uma Devi Patel',
      phone: '+91 98250 67890',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
      businessName: 'Uma Heritage Khadi',
      businessCategory: "Men's Clothing",
      description: 'Breathable hand-spun khadi kurtas and handcrafted organic Nehru jackets.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      bankName: 'ICICI Bank',
      bankAccountNo: '43210987654',
      ifscCode: 'ICIC0003456',
      commissionRate: 2.0,
      status: 'PENDING', // One pending seller for onboarding demo!
    },
  ];

  const createdSellers = [];

  for (const s of sellersData) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash: s.password,
        name: s.name,
        role: 'SELLER',
        phone: s.phone,
        avatar: s.avatar,
      },
    });

    const seller = await prisma.seller.create({
      data: {
        userId: user.id,
        businessName: s.businessName,
        businessCategory: s.businessCategory,
        description: s.description,
        phone: s.phone,
        address: `${s.city} Artisan Colony`,
        city: s.city,
        state: s.state,
        pincode: s.pincode,
        bankName: s.bankName,
        bankAccountNo: s.bankAccountNo,
        ifscCode: s.ifscCode,
        commissionRate: s.commissionRate,
        status: s.status,
      },
    });

    createdSellers.push(seller);
  }

  const anuSeller = createdSellers[0];
  const sitaSeller = createdSellers[1];
  const meeraSeller = createdSellers[2];
  const kavyaSeller = createdSellers[3];
  const priyaSeller = createdSellers[4];

  // 5. Categories
  const categoriesData = [
    { name: "Women's Clothing", slug: 'womens-clothing', description: 'Handcrafted kurtis, sarees, dupattas, and suits', icon: 'Shirt', taxRate: 5.0 },
    { name: "Men's Clothing", slug: 'mens-clothing', description: 'Khadi shirts, kurtas, and organic cotton wear', icon: 'Sparkles', taxRate: 5.0 },
    { name: 'Handmade Products', slug: 'handmade-products', description: 'Artisanal local crafts and home decor', icon: 'Palette', taxRate: 5.0 },
    { name: 'Jewelry', slug: 'jewelry', description: 'Handmade terracotta, silk thread, and silver jewelry', icon: 'Gem', taxRate: 3.0 },
    { name: 'Home Decor', slug: 'home-decor', description: 'Earthen pottery, brassware, and handcrafted lights', icon: 'Home', taxRate: 12.0 },
    { name: 'Beauty & Personal Care', slug: 'beauty', description: 'Organic herbal oils, mists, and ubtan powders', icon: 'Heart', taxRate: 18.0 },
    { name: 'Food & Local Products', slug: 'food-local-products', description: 'Authentic regional spices, pickles, and dry sweets', icon: 'Coffee', taxRate: 5.0 },
    { name: 'Accessories', slug: 'accessories', description: 'Jute tote bags, embroidered pouches, and dupattas', icon: 'ShoppingBag', taxRate: 5.0 },
  ];

  const createdCategories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.create({ data: cat });
    createdCategories[c.name] = c;
  }

  // 6. 20 Customers across India
  const customersRaw = [
    { name: 'Aarohi Nair', email: 'customer@hercart.demo', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
    { name: 'Pooja Bhatt', email: 'pooja.bhatt@gmail.com', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
    { name: 'Shreya Kulkarni', email: 'shreya.k@gmail.com', city: 'Pune', state: 'Maharashtra', pincode: '411004' },
    { name: 'Deepa Patel', email: 'deepa.patel@gmail.com', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' },
    { name: 'Meenakshi Sundaram', email: 'meenakshi.s@gmail.com', city: 'Chennai', state: 'Tamil Nadu', pincode: '600028' },
    { name: 'Kavita Joshi', email: 'kavita.joshi@gmail.com', city: 'Jaipur', state: 'Rajasthan', pincode: '302004' },
    { name: 'Nandini Das', email: 'nandini.das@gmail.com', city: 'Kolkata', state: 'West Bengal', pincode: '700019' },
    { name: 'Ritu Aggarwal', email: 'ritu.aggarwal@gmail.com', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
    { name: 'Ananya Mukherjee', email: 'ananya.m@gmail.com', city: 'Hyderabad', state: 'Telangana', pincode: '500081' },
    { name: 'Sunita Chauhan', email: 'sunita.c@gmail.com', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010' },
    { name: 'Geeta Menghani', email: 'geeta.m@gmail.com', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' },
    { name: 'Sneha Roy', email: 'sneha.roy@gmail.com', city: 'Chandigarh', state: 'Punjab', pincode: '160017' },
    { name: 'Asha Hegde', email: 'asha.hegde@gmail.com', city: 'Mangalore', state: 'Karnataka', pincode: '575001' },
    { name: 'Jyoti Deshmukh', email: 'jyoti.d@gmail.com', city: 'Nagpur', state: 'Maharashtra', pincode: '440010' },
    { name: 'Bhavna Parekh', email: 'bhavna.p@gmail.com', city: 'Surat', state: 'Gujarat', pincode: '395007' },
    { name: 'Tanvi Saxena', email: 'tanvi.s@gmail.com', city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462001' },
    { name: 'Lakshmi Varma', email: 'lakshmi.v@gmail.com', city: 'Kochi', state: 'Kerala', pincode: '682016' },
    { name: 'Preeti Mittal', email: 'preeti.m@gmail.com', city: 'Gurugram', state: 'Haryana', pincode: '122002' },
    { name: 'Swati Sen', email: 'swati.sen@gmail.com', city: 'Guwahati', state: 'Assam', pincode: '781001' },
    { name: 'Divya Reddy', email: 'divya.reddy@gmail.com', city: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: '530002' },
  ];

  const createdCustomers = [];
  for (let i = 0; i < customersRaw.length; i++) {
    const cr = customersRaw[i];
    const u = await prisma.user.create({
      data: {
        email: cr.email,
        passwordHash: customerPasswordHash,
        name: cr.name,
        role: 'CUSTOMER',
        phone: `+91 99000 ${String(10000 + i).slice(1)}`,
        avatar: `https://images.unsplash.com/photo-${1530000000000 + i * 10000}?w=150&auto=format&fit=crop&q=80`,
      },
    });

    const c = await prisma.customer.create({
      data: {
        userId: u.id,
        phone: u.phone,
        totalOrders: 0,
        totalSpending: 0,
      },
    });

    await prisma.address.create({
      data: {
        customerId: c.id,
        name: cr.name,
        phone: u.phone || '+91 99000 00000',
        street: `Flat ${101 + i}, Shanti Nilayam Apartments, 4th Cross`,
        city: cr.city,
        state: cr.state,
        pincode: cr.pincode,
        isDefault: true,
      },
    });

    createdCustomers.push(c);
  }

  // 7. 50+ Realistic Products with Indian Rupee (₹) Pricing
  const productsList = [
    // Anu Handlooms (Women's Clothing)
    {
      seller: anuSeller,
      category: createdCategories["Women's Clothing"],
      name: "Handcrafted Pure Cotton Kurti - Indigo Bagru Print",
      sku: "ANU-KRT-001",
      description: "Breathable 100% pure cotton kurti crafted with traditional hand block Indigo print from Bagru artisans. Featuring wooden buttons and a relaxed fit.",
      price: 899.0,
      discountPrice: 799.0,
      stock: 45,
      threshold: 8,
      img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: anuSeller,
      category: createdCategories["Women's Clothing"],
      name: "Handloom Pochampally Ikat Cotton Saree with Blouse Piece",
      sku: "ANU-SAR-002",
      description: "Authentic Pochampally Ikat handloom saree woven with geometric patterns in vibrant crimson and cream shades. Soft, comfortable, and celebratory.",
      price: 2499.0,
      discountPrice: 2199.0,
      stock: 22,
      threshold: 5,
      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: anuSeller,
      category: createdCategories["Women's Clothing"],
      name: "Chanderi Silk Printed Dupatta with Zari Border",
      sku: "ANU-DUP-003",
      description: "Feather-light Chanderi silk dupatta with subtle gold zari border and floral hand-prints. Elegantly drapes with any ethnic kurta.",
      price: 649.0,
      discountPrice: 549.0,
      stock: 35,
      threshold: 6,
      img: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: anuSeller,
      category: createdCategories["Women's Clothing"],
      name: "Embroidered Kashmiri Tilla Work Festive Dress",
      sku: "ANU-DRS-004",
      description: "Rich mulberry cotton-silk dress adorned with intricate Kashmiri needlework along the neckline and cuffs. Perfect for family celebrations.",
      price: 1899.0,
      discountPrice: 1699.0,
      stock: 18,
      threshold: 4,
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: anuSeller,
      category: createdCategories["Women's Clothing"],
      name: "Kalamkari Hand-Painted Floral Cotton Kurta",
      sku: "ANU-KRT-005",
      description: "Natural vegetable dyed Kalamkari artwork depicting traditional temple motifs on soft Andhra handloom cotton.",
      price: 1199.0,
      discountPrice: 999.0,
      stock: 28,
      threshold: 5,
      img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: anuSeller,
      category: createdCategories["Women's Clothing"],
      name: "Mulmul Cotton Anarkali Suit Set with Kota Dupatta",
      sku: "ANU-SUT-006",
      description: "Three-piece suit crafted from cloud-soft Jaipur mulmul with flared Anarkali silhouette and breezy Kota Doria dupatta.",
      price: 2899.0,
      discountPrice: 2499.0,
      stock: 14,
      threshold: 3,
      img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: anuSeller,
      category: createdCategories["Women's Clothing"],
      name: "Hand-Woven Mangalgiri Cotton Tunic - Mustard Gold",
      sku: "ANU-TNC-007",
      description: "Crisp Mangalgiri cotton with micro-checked zari border. Designed for everyday office elegance and summer comfort.",
      price: 949.0,
      discountPrice: 849.0,
      stock: 30,
      threshold: 6,
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: anuSeller,
      category: createdCategories["Women's Clothing"],
      name: "Ajrakh Hand-Block Print Modal Silk Stole",
      sku: "ANU-STL-008",
      description: "Genuine 14-stage resist printed Ajrakh stole made with natural indigo and madder red dyes in Kutch.",
      price: 799.0,
      discountPrice: 699.0,
      stock: 4, // Low stock demo!
      threshold: 5,
      img: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&auto=format&fit=crop&q=80",
    },

    // Sita Organic Spices & Pickles (Food & Local Products)
    {
      seller: sitaSeller,
      category: createdCategories['Food & Local Products'],
      name: "Traditional Avakaya Spicy Mango Pickle (Homemade, 500g)",
      sku: "STA-PCK-001",
      description: "Authentic grandmother recipe raw mango pickle made with wood-cold pressed sesame oil, Guntur chili, and mustard powder. No synthetic preservatives.",
      price: 349.0,
      discountPrice: 299.0,
      stock: 60,
      threshold: 10,
      img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: sitaSeller,
      category: createdCategories['Food & Local Products'],
      name: "Stone-Ground Organic High-Curcumin Lakadong Turmeric (250g)",
      sku: "STA-SPC-002",
      description: "Tested 7.2% curcumin content Meghalaya Lakadong turmeric. Naturally golden, intensely aromatic, and immunity boosting.",
      price: 249.0,
      discountPrice: 199.0,
      stock: 80,
      threshold: 15,
      img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: sitaSeller,
      category: createdCategories['Food & Local Products'],
      name: "Handcrafted Iyengar Sambar Powder - 18 Spice Blend (200g)",
      sku: "STA-SPC-003",
      description: "Slow dry-roasted by hand in iron pans. Blended with Byadgi chillies, coriander seeds, chana dal, and curry leaves.",
      price: 180.0,
      discountPrice: 150.0,
      stock: 75,
      threshold: 10,
      img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: sitaSeller,
      category: createdCategories['Food & Local Products'],
      name: "Sun-Dried Gongura Chutney with Garlic & Sesame (400g)",
      sku: "STA-PCK-004",
      description: "Tangy Andhra roselle leaves slow-cooked in cold-pressed oil with whole crushed garlic cloves.",
      price: 299.0,
      discountPrice: 260.0,
      stock: 40,
      threshold: 8,
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: sitaSeller,
      category: createdCategories['Food & Local Products'],
      name: "Handmade Organic Jaggery Balls (Gur) with Cardamom (1kg)",
      sku: "STA-JAG-005",
      description: "Unrefined mineral-rich jaggery prepared from sugarcane juice boiled in traditional open pans. Chemical-free.",
      price: 220.0,
      discountPrice: 190.0,
      stock: 50,
      threshold: 10,
      img: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: sitaSeller,
      category: createdCategories['Food & Local Products'],
      name: "Spicy Andhra Gunpowder (Kandi Podi) - 250g",
      sku: "STA-POD-006",
      description: "Roasted lentils, cumin, red chillies, and garlic ground to perfection. Savor with hot steamed rice and desi ghee.",
      price: 160.0,
      discountPrice: 135.0,
      stock: 3, // Low stock demo!
      threshold: 5,
      img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    },

    // Meera Artisan Terracotta & Pottery (Home Decor)
    {
      seller: meeraSeller,
      category: createdCategories['Home Decor'],
      name: "Handcrafted Terracotta Clay Biryani Handi with Lid (2L)",
      sku: "MRA-POT-001",
      description: "Natural non-toxic unglazed earthen cooking pot. Retains essential nutrients, balances pH with natural alkaline clay.",
      price: 799.0,
      discountPrice: 699.0,
      stock: 32,
      threshold: 5,
      img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: meeraSeller,
      category: createdCategories['Home Decor'],
      name: "Set of 6 Hand-Painted Terracotta Kullad Chai Cups",
      sku: "MRA-KLD-002",
      description: "Artisanal clay cups decorated with Warli tribal motifs using organic non-toxic pigments. Brings village authenticity to your morning chai.",
      price: 499.0,
      discountPrice: 420.0,
      stock: 55,
      threshold: 8,
      img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: meeraSeller,
      category: createdCategories['Home Decor'],
      name: "Terracotta Hanging Bird Feeder & Water Pot",
      sku: "MRA-BRD-003",
      description: "Naturally cooling clay bird feeder with jute hanging rope. Beautiful balcony adornment that shelters local sparrows and parakeets.",
      price: 399.0,
      discountPrice: 349.0,
      stock: 24,
      threshold: 5,
      img: "https://images.unsplash.com/photo-1582881804966-59e2b8a66414?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: meeraSeller,
      category: createdCategories['Home Decor'],
      name: "Hand-Carved Terracotta Jali Lantern for Tea-Lights",
      sku: "MRA-LNT-004",
      description: "Intricately carved lattice cuts emit mesmerizing floral shadow patterns when a candle or oil lamp is lit inside.",
      price: 649.0,
      discountPrice: 549.0,
      stock: 19,
      threshold: 4,
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: meeraSeller,
      category: createdCategories['Home Decor'],
      name: "Festive Earthen Diya Set of 12 (Hand-Painted Gold Trim)",
      sku: "MRA-DYA-005",
      description: "Traditional river clay deepaks hand-shaped on potter wheels, painted in auspicious vermillion and gold accents.",
      price: 299.0,
      discountPrice: 249.0,
      stock: 90,
      threshold: 15,
      img: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: meeraSeller,
      category: createdCategories['Home Decor'],
      name: "Self-Watering Terracotta Herb Planter with Saucer",
      sku: "MRA-PLN-006",
      description: "Porous earthenware allows roots to breathe and naturally regulates moisture for tulsi, mint, and coriander plants.",
      price: 450.0,
      discountPrice: 399.0,
      stock: 2, // Low stock demo!
      threshold: 5,
      img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80",
    },

    // Kavya Thread & Bead Jewelry (Jewelry)
    {
      seller: kavyaSeller,
      category: createdCategories['Jewelry'],
      name: "Handcrafted Antique Matte Gold Temple Jhumkas",
      sku: "KVY-JHM-001",
      description: "South Indian temple style Lakshmi motif jhumkas adorned with ruby-red micro beads and hanging pearl drops. Brass based, hypoallergenic.",
      price: 799.0,
      discountPrice: 699.0,
      stock: 38,
      threshold: 6,
      img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: kavyaSeller,
      category: createdCategories['Jewelry'],
      name: "Handmade Silk Thread Bangle Set (Pack of 12, Rani Pink)",
      sku: "KVY-BNG-002",
      description: "Wrapped in pure mulberry silk thread and studded with sparkling crystal chain and golden stone rings. Perfect for weddings and festivals.",
      price: 599.0,
      discountPrice: 499.0,
      stock: 25,
      threshold: 5,
      img: "https://images.unsplash.com/photo-1611591475166-508544976c66?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: kavyaSeller,
      category: createdCategories['Jewelry'],
      name: "Hand-Painted Terracotta Choker Necklace & Earring Set",
      sku: "KVY-CHK-003",
      description: "Baked terracotta clay medallions shaped and hand-painted in peacock turquoise and gold hues on adjustable cotton dori.",
      price: 999.0,
      discountPrice: 849.0,
      stock: 15,
      threshold: 4,
      img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: kavyaSeller,
      category: createdCategories['Jewelry'],
      name: "Brass Ghungroo Payal (Anklet Pair) with Filigree Bell",
      sku: "KVY-PYL-004",
      description: "Traditional dual-strand brass anklets with melodious musical bells and secure clasp.",
      price: 499.0,
      discountPrice: 420.0,
      stock: 28,
      threshold: 5,
      img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: kavyaSeller,
      category: createdCategories['Jewelry'],
      name: "Oxidised Silver Boho Hasli Statement Necklace",
      sku: "KVY-HAS-005",
      description: "Tribal German silver choker neckpiece featuring coin drops and antique mirror work.",
      price: 650.0,
      discountPrice: 550.0,
      stock: 20,
      threshold: 5,
      img: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&auto=format&fit=crop&q=80",
    },

    // Priya Herbal Wellness (Beauty & Personal Care)
    {
      seller: priyaSeller,
      category: createdCategories['Beauty & Personal Care'],
      name: "Pure Steam-Distilled Kannauj Rose Water Mist (200ml)",
      sku: "PRY-ROS-001",
      description: "Distilled from fresh desi damask roses grown in Kannauj using copper deg-bhapka vessels. Calms inflammation, tones pores naturally.",
      price: 399.0,
      discountPrice: 349.0,
      stock: 45,
      threshold: 8,
      img: "https://images.unsplash.com/photo-1608248597359-57e3f8ec47d3?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: priyaSeller,
      category: createdCategories['Beauty & Personal Care'],
      name: "Cold-Pressed Extra Virgin Kerala Coconut Oil (500ml)",
      sku: "PRY-OIL-002",
      description: "Extracted without heat from fresh coastal coconuts. Unrefined, unbleached, edible grade nourishing elixir for hair and skin.",
      price: 320.0,
      discountPrice: 280.0,
      stock: 50,
      threshold: 10,
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: priyaSeller,
      category: createdCategories['Beauty & Personal Care'],
      name: "Ayurvedic 18-Herb Kesh Sanjeevani Hair Growth Oil (100ml)",
      sku: "PRY-KSH-003",
      description: "Infused with Bhringraj, Amla, Brahmi, Fenugreek, and Hibiscus simmered for 72 hours over slow wood fire in sesame oil base.",
      price: 499.0,
      discountPrice: 425.0,
      stock: 35,
      threshold: 6,
      img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: priyaSeller,
      category: createdCategories['Beauty & Personal Care'],
      name: "Herbal Glow Ubtan Powder with Wild Turmeric & Sandalwood (150g)",
      sku: "PRY-UBT-004",
      description: "Traditional bridal body polishing powder blended with Kasturi Manjal, chickpea flour, orange peel, and pure Chandan.",
      price: 350.0,
      discountPrice: 299.0,
      stock: 40,
      threshold: 8,
      img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    },
    {
      seller: priyaSeller,
      category: createdCategories['Beauty & Personal Care'],
      name: "Handmade Saffron & Goat Milk Cold-Processed Soap Bar (125g)",
      sku: "PRY-SOP-005",
      description: "Cured for 6 weeks. Rich in natural lactic acid, raw shea butter, and real Kashmiri saffron strands for ultra-hydrated skin.",
      price: 249.0,
      discountPrice: 210.0,
      stock: 60,
      threshold: 12,
      img: "https://images.unsplash.com/photo-1607006314167-9c988a3857d4?w=600&auto=format&fit=crop&q=80",
    },
  ];

  // Also add remaining items up to 50+ products across categories
  for (let i = 1; i <= 20; i++) {
    const isClothes = i % 2 === 0;
    const cat = isClothes ? createdCategories["Women's Clothing"] : createdCategories['Accessories'];
    const s = isClothes ? anuSeller : sitaSeller;
    productsList.push({
      seller: s,
      category: cat,
      name: isClothes ? `Handcrafted Cotton Print Stole #${i} - Artisanal Weave` : `Eco-Friendly Jute Tote Handbag #${i} with Pouch`,
      sku: isClothes ? `ANU-STL-0${10 + i}` : `STA-JUT-0${10 + i}`,
      description: `Locally made sustainable handcrafted product. Supports small women artisans and home makers across rural workshops.`,
      price: 399.0 + (i * 25),
      discountPrice: 349.0 + (i * 20),
      stock: 15 + (i * 3),
      threshold: 5,
      img: isClothes 
        ? "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    });
  }

  const createdProducts = [];
  for (const p of productsList) {
    const prod = await prisma.product.create({
      data: {
        sellerId: p.seller.id,
        categoryId: p.category.id,
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        sku: p.sku,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        taxRate: p.category.taxRate || 5.0,
        stockQuantity: p.stock,
        lowStockThreshold: p.threshold,
        status: 'ACTIVE',
        images: {
          create: [{ url: p.img, isPrimary: true, sortOrder: 0 }],
        },
      },
    });

    // Create 1-to-1 inventory
    const inv = await prisma.inventory.create({
      data: {
        productId: prod.id,
        currentStock: p.stock,
        reservedStock: 0,
        availableStock: p.stock,
        lowStockThreshold: p.threshold,
        lastRestockedAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 86400000)),
      },
    });

    // Create initial stock transaction
    await prisma.inventoryTransaction.create({
      data: {
        inventoryId: inv.id,
        previousStock: 0,
        changeQuantity: p.stock,
        newStock: p.stock,
        reason: 'Initial stock intake from workshop',
        recordedByUserId: p.seller.userId,
      },
    });

    createdProducts.push(prod);
  }

  console.log(`✅ Seeded ${createdProducts.length} products with inventory and transactions.`);

  // 8. 35 Realistic Orders with Lifecycle Statuses & Commissions
  const statuses = ['DELIVERED', 'DELIVERED', 'DELIVERED', 'SHIPPED', 'SHIPPED', 'PROCESSING', 'CONFIRMED', 'PENDING', 'CANCELLED'];
  const paymentMethods = ['UPI', 'NetBanking', 'Card', 'COD'];

  let orderCount = 1001;
  const createdOrders = [];

  for (let i = 0; i < 35; i++) {
    const cust = createdCustomers[i % createdCustomers.length];
    // Pick 1 to 3 products
    const p1 = createdProducts[(i * 3) % createdProducts.length];
    const p2 = (i % 2 === 0) ? createdProducts[(i * 3 + 1) % createdProducts.length] : null;

    const seller = p1.sellerId === anuSeller.id ? anuSeller : (p1.sellerId === sitaSeller.id ? sitaSeller : meeraSeller);
    const orderStatus = statuses[i % statuses.length];
    const paymentStatus = orderStatus === 'CANCELLED' ? 'FAILED' : (orderStatus === 'PENDING' ? 'PENDING' : 'PAID');
    const paymentMethod = paymentMethods[i % paymentMethods.length];

    const qty1 = (i % 3) + 1;
    const price1 = p1.discountPrice || p1.price;
    let subtotal = price1 * qty1;

    let qty2 = 0;
    let price2 = 0;
    if (p2 && p2.sellerId === seller.id) {
      qty2 = 1;
      price2 = p2.discountPrice || p2.price;
      subtotal += price2 * qty2;
    }

    const gstRate = 5.0;
    const tax = Math.round((subtotal * (gstRate / 100)) * 100) / 100;
    const shipping = subtotal > 999 ? 0.0 : 50.0;
    
    // Transparent HerCart platform fee: 2%
    const commRate = seller.commissionRate || 2.0;
    const platformFee = Math.round((subtotal * (commRate / 100)) * 100) / 100;
    const sellerPayout = Math.round((subtotal + tax - platformFee) * 100) / 100;
    const totalAmount = Math.round((subtotal + tax + shipping) * 100) / 100;

    // Timeline JSON
    const timeline = [
      { status: 'Order Placed', timestamp: new Date(Date.now() - (35 - i) * 86400000).toISOString(), note: 'Order placed by customer' },
    ];
    if (orderStatus !== 'PENDING') {
      timeline.push({ status: 'Confirmed', timestamp: new Date(Date.now() - (35 - i) * 86400000 + 3600000).toISOString(), note: 'Confirmed by seller' });
    }
    if (['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(orderStatus)) {
      timeline.push({ status: 'Processing', timestamp: new Date(Date.now() - (35 - i) * 86400000 + 7200000).toISOString(), note: 'Packed & ready for dispatch' });
    }
    if (['SHIPPED', 'DELIVERED'].includes(orderStatus)) {
      timeline.push({ status: 'Shipped', timestamp: new Date(Date.now() - (35 - i) * 86400000 + 14400000).toISOString(), note: 'Dispatched with Delhivery Tracking #DL789012' });
    }
    if (orderStatus === 'DELIVERED') {
      timeline.push({ status: 'Delivered', timestamp: new Date(Date.now() - (35 - i) * 86400000 + 86400000).toISOString(), note: 'Delivered to customer' });
    }
    if (orderStatus === 'CANCELLED') {
      timeline.push({ status: 'Cancelled', timestamp: new Date(Date.now() - (35 - i) * 86400000 + 3600000).toISOString(), note: 'Cancelled on customer request' });
    }

    const orderNumber = `ORD-${orderCount++}`;
    const ord = await prisma.order.create({
      data: {
        orderNumber,
        customerId: cust.id,
        sellerId: seller.id,
        status: orderStatus,
        paymentStatus,
        subtotal,
        discount: 0.0,
        tax,
        shippingFee: shipping,
        platformFee,
        sellerPayout,
        totalAmount,
        shippingAddressJson: JSON.stringify({
          name: cust.phone ? `Customer ${cust.id}` : 'Customer',
          street: '123 Main Road, MG Cross',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          phone: '+91 99000 12345',
        }),
        timelineJson: JSON.stringify(timeline),
        createdAt: new Date(Date.now() - (35 - i) * 86400000),
      },
    });

    // Order items
    await prisma.orderItem.create({
      data: {
        orderId: ord.id,
        productId: p1.id,
        quantity: qty1,
        unitPrice: price1,
        taxRate: gstRate,
        totalPrice: price1 * qty1,
      },
    });

    if (p2 && qty2 > 0) {
      await prisma.orderItem.create({
        data: {
          orderId: ord.id,
          productId: p2.id,
          quantity: qty2,
          unitPrice: price2,
          taxRate: gstRate,
          totalPrice: price2 * qty2,
        },
      });
    }

    // Payment record
    await prisma.payment.create({
      data: {
        orderId: ord.id,
        method: paymentMethod,
        transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: totalAmount,
        status: paymentStatus,
        paidAt: paymentStatus === 'PAID' ? ord.createdAt : null,
      },
    });

    // Commission record (transparent breakdown)
    await prisma.commission.create({
      data: {
        orderId: ord.id,
        sellerId: seller.id,
        grossSale: subtotal,
        commissionRate: commRate,
        commissionAmount: platformFee,
        taxOnCommission: Math.round(platformFee * 0.18 * 100) / 100, // 18% GST on platform service fee
        sellerNetAmount: sellerPayout,
        status: orderStatus === 'DELIVERED' ? 'SETTLED' : 'PENDING',
        settledAt: orderStatus === 'DELIVERED' ? new Date(ord.createdAt.getTime() + 86400000 * 2) : null,
        createdAt: ord.createdAt,
      },
    });

    // Update customer lifetime stats
    if (orderStatus === 'DELIVERED') {
      await prisma.customer.update({
        where: { id: cust.id },
        data: {
          totalOrders: { increment: 1 },
          totalSpending: { increment: totalAmount },
          lastOrderAt: ord.createdAt,
        },
      });
    }

    createdOrders.push(ord);
  }

  console.log(`✅ Seeded ${createdOrders.length} orders with payments and commissions.`);

  // 9. Realistic Audit Logs
  const auditLogsData = [
    {
      userId: superAdminUser.id,
      userName: superAdminUser.name,
      userRole: 'SUPER_ADMIN',
      action: 'APPROVE_SELLER',
      entity: 'Seller',
      entityId: String(anuSeller.id),
      detailsJson: JSON.stringify({ seller: 'Anu Handlooms', status: 'APPROVED', note: 'Documentation verified' }),
      createdAt: new Date(Date.now() - 30 * 86400000),
    },
    {
      userId: superAdminUser.id,
      userName: superAdminUser.name,
      userRole: 'SUPER_ADMIN',
      action: 'UPDATE_SETTINGS',
      entity: 'Settings',
      entityId: '1',
      detailsJson: JSON.stringify({ defaultCommissionRate: 2.0, rationale: 'Low affordable rate for women artisans' }),
      createdAt: new Date(Date.now() - 25 * 86400000),
    },
    {
      userId: anuSeller.userId,
      userName: 'Anu Rao',
      userRole: 'SELLER',
      action: 'CREATE_PRODUCT',
      entity: 'Product',
      entityId: 'ANU-KRT-001',
      detailsJson: JSON.stringify({ name: 'Indigo Bagru Kurti', price: 899.0, stock: 45 }),
      createdAt: new Date(Date.now() - 20 * 86400000),
    },
    {
      userId: anuSeller.userId,
      userName: 'Anu Rao',
      userRole: 'SELLER',
      action: 'UPDATE_INVENTORY',
      entity: 'Inventory',
      entityId: 'ANU-KRT-001',
      detailsJson: JSON.stringify({ previousStock: 25, added: 20, newStock: 45, reason: 'New batch received from weavers' }),
      createdAt: new Date(Date.now() - 5 * 86400000),
    },
    {
      userId: staffUser.id,
      userName: staffUser.name,
      userRole: 'STAFF',
      action: 'UPDATE_ORDER',
      entity: 'Order',
      entityId: 'ORD-1004',
      detailsJson: JSON.stringify({ previousStatus: 'CONFIRMED', newStatus: 'SHIPPED', trackingNo: 'DL789012' }),
      createdAt: new Date(Date.now() - 2 * 86400000),
    },
  ];

  for (const log of auditLogsData) {
    await prisma.auditLog.create({ data: log });
  }

  // 10. In-App Notifications
  const notificationsData = [
    {
      userId: superAdminUser.id,
      title: 'New Seller Onboarding',
      message: 'Uma Heritage Khadi submitted registration details for approval.',
      type: 'SELLER',
      isRead: false,
      link: '/dashboard/sellers',
    },
    {
      userId: superAdminUser.id,
      title: 'Platform Commission Milestone',
      message: 'Monthly gross platform volume crossed ₹2,50,000.',
      type: 'SYSTEM',
      isRead: true,
      link: '/dashboard/analytics',
    },
    {
      userId: anuSeller.userId,
      title: 'New Order Received #ORD-1032',
      message: 'Customer Aarohi placed an order for Handcrafted Cotton Kurti.',
      type: 'ORDER',
      isRead: false,
      link: '/dashboard/orders',
    },
    {
      userId: anuSeller.userId,
      title: 'Low Stock Alert',
      message: 'Ajrakh Modal Silk Stole (ANU-STL-008) has reached 4 items remaining.',
      type: 'INVENTORY',
      isRead: false,
      link: '/dashboard/inventory',
    },
  ];

  for (const notif of notificationsData) {
    await prisma.notification.create({ data: notif });
  }

  console.log('🎉 HerCart database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
