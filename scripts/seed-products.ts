import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { productsTable } from "../lib/db/src/schema/products";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const dressImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
  "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
  "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  "https://images.unsplash.com/photo-1611042553365-9b101441c135?w=600&q=80",
  "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=600&q=80",
  "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80",
  "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=80",
  "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80",
  "https://images.unsplash.com/photo-1583744946564-b52d01a7b321?w=600&q=80",
  "https://images.unsplash.com/photo-1594938374182-b6a12c8c3196?w=600&q=80",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
  "https://images.unsplash.com/photo-1533659828870-95ee305cee3e?w=600&q=80",
  "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=600&q=80",
];

const lifestyleImages = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&q=80",
  "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=600&q=80",
  "https://images.unsplash.com/photo-1452457521682-21b40e3e6de1?w=600&q=80",
  "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&q=80",
  "https://images.unsplash.com/photo-1519219788971-8d9797e0928e?w=600&q=80",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80",
  "https://images.unsplash.com/photo-1542596594-649edbc13630?w=600&q=80",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
  "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?w=600&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
  "https://images.unsplash.com/photo-1472666033780-b04ad78e7f8a?w=600&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80",
];

const essentialsImages = [
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  "https://images.unsplash.com/photo-1614436163996-25cee5f54290?w=600&q=80",
  "https://images.unsplash.com/photo-1586495777744-4e6232bf4dc4?w=600&q=80",
  "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80",
  "https://images.unsplash.com/photo-1502393759-a49b36f4e1e0?w=600&q=80",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
  "https://images.unsplash.com/photo-1583342788075-93a0c18ceef9?w=600&q=80",
  "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1575995872537-3793d29d972c?w=600&q=80",
  "https://images.unsplash.com/photo-1603903631918-a5f4c1cc0759?w=600&q=80",
  "https://images.unsplash.com/photo-1549388604-817d15aa0110?w=600&q=80",
  "https://images.unsplash.com/photo-1556760544-74068565f05c?w=600&q=80",
];

const electronicsImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
  "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
  "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
  "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80",
  "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80",
  "https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=600&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
  "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&q=80",
];

const accessoriesImages = [
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
  "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&q=80",
  "https://images.unsplash.com/photo-1614159869943-cd97c5b71e06?w=600&q=80",
  "https://images.unsplash.com/photo-1611010344445-5b4b6b8fad84?w=600&q=80",
  "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&q=80",
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
  "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=600&q=80",
  "https://images.unsplash.com/photo-1519235106657-c7ab42e07e5b?w=600&q=80",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
  "https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&q=80",
  "https://images.unsplash.com/photo-1608731267464-c0c889c2ff92?w=600&q=80",
  "https://images.unsplash.com/photo-1603217039863-aa0c865404f7?w=600&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
];

const products = [
  // DRESS - 20 products
  { name: "Floral Midi Dress", category: "Dress", price: 2499, stock: 15, image: dressImages[0], description: "A beautiful floral midi dress perfect for spring and summer occasions. Features a flattering A-line silhouette." },
  { name: "Classic Black Evening Dress", category: "Dress", price: 3999, stock: 8, image: dressImages[1], description: "Elegant black evening dress with a timeless design. Perfect for formal events and dinners." },
  { name: "White Summer Wrap Dress", category: "Dress", price: 1899, stock: 22, image: dressImages[2], description: "Lightweight white wrap dress ideal for beach days and casual outings. Breezy and comfortable." },
  { name: "Striped Shirt Dress", category: "Dress", price: 2199, stock: 18, image: dressImages[3], description: "Classic striped shirt dress that transitions effortlessly from day to night. A wardrobe essential." },
  { name: "Boho Maxi Dress", category: "Dress", price: 2799, stock: 12, image: dressImages[4], description: "Free-spirited boho maxi dress with beautiful patterns. Ideal for festivals and casual wear." },
  { name: "Little Red Cocktail Dress", category: "Dress", price: 3499, stock: 6, image: dressImages[5], description: "Stand out in this bold red cocktail dress. Fitted cut with elegant draping." },
  { name: "Denim Mini Dress", category: "Dress", price: 1699, stock: 25, image: dressImages[6], description: "Casual denim mini dress for everyday wear. Pairs well with sneakers or sandals." },
  { name: "Satin Slip Dress", category: "Dress", price: 4299, stock: 10, image: dressImages[7], description: "Luxurious satin slip dress with a smooth, elegant finish. Perfect for special evenings." },
  { name: "Floral Sundress", category: "Dress", price: 1599, stock: 30, image: dressImages[8], description: "Breezy floral sundress perfect for warm days. Features adjustable straps and a flattering cut." },
  { name: "Office Pencil Dress", category: "Dress", price: 2899, stock: 14, image: dressImages[9], description: "Professional pencil dress ideal for the workplace. Sophisticated design with comfortable fit." },
  { name: "Velvet Party Dress", category: "Dress", price: 3799, stock: 7, image: dressImages[10], description: "Rich velvet party dress that radiates luxury. A showstopper for any celebration." },
  { name: "Casual Knit Dress", category: "Dress", price: 1999, stock: 20, image: dressImages[11], description: "Comfortable knit dress for relaxed days. Soft fabric with a relaxed fit." },
  { name: "Polka Dot Tea Dress", category: "Dress", price: 2299, stock: 16, image: dressImages[12], description: "Charming polka dot tea dress with a vintage-inspired look. Feminine and playful." },
  { name: "Linen Beach Dress", category: "Dress", price: 1799, stock: 28, image: dressImages[13], description: "Natural linen beach dress that keeps you cool. Effortlessly chic for summer getaways." },
  { name: "Asymmetric Hem Dress", category: "Dress", price: 3199, stock: 9, image: dressImages[14], description: "Fashion-forward asymmetric hem dress. A unique piece that makes a bold statement." },
  { name: "Tiered Ruffle Dress", category: "Dress", price: 2599, stock: 11, image: dressImages[15], description: "Romantic tiered ruffle dress with flowing layers. Elegant and feminine." },
  { name: "Monochrome Shift Dress", category: "Dress", price: 2099, stock: 19, image: dressImages[16], description: "Clean monochrome shift dress with a modern silhouette. Versatile and stylish." },
  { name: "Flowy Chiffon Dress", category: "Dress", price: 2699, stock: 13, image: dressImages[17], description: "Ethereal chiffon dress that moves beautifully. Perfect for garden parties and events." },
  { name: "Sports Casual Dress", category: "Dress", price: 1399, stock: 35, image: dressImages[18], description: "Athletic-inspired casual dress for active days. Comfortable and stylish for gym or errands." },
  { name: "Embroidered Ethnic Dress", category: "Dress", price: 3299, stock: 10, image: dressImages[19], description: "Beautifully embroidered ethnic dress showcasing traditional craftsmanship. Rich colors and intricate patterns." },

  // LIFESTYLE - 20 products
  { name: "Leather Wallet", category: "Lifestyle", price: 1299, stock: 40, image: lifestyleImages[0], description: "Premium genuine leather bifold wallet with multiple card slots. Slim profile that fits comfortably in your pocket." },
  { name: "Scented Candle Set", category: "Lifestyle", price: 899, stock: 50, image: lifestyleImages[1], description: "Set of 3 luxury scented candles in soy wax. Create a relaxing ambiance at home." },
  { name: "Yoga Mat Premium", category: "Lifestyle", price: 1799, stock: 25, image: lifestyleImages[2], description: "Non-slip premium yoga mat with alignment lines. 6mm thick for ultimate comfort and support." },
  { name: "Minimalist Wall Clock", category: "Lifestyle", price: 1499, stock: 20, image: lifestyleImages[3], description: "Sleek minimalist wall clock with a silent movement. A timeless piece for any room." },
  { name: "Ceramic Coffee Mug", category: "Lifestyle", price: 499, stock: 80, image: lifestyleImages[4], description: "Handcrafted ceramic coffee mug with a comfortable handle. Holds 350ml, perfect for morning coffee." },
  { name: "Cotton Throw Blanket", category: "Lifestyle", price: 1999, stock: 30, image: lifestyleImages[5], description: "Soft cotton throw blanket for cozy evenings. Machine washable and long-lasting." },
  { name: "Bamboo Desk Organizer", category: "Lifestyle", price: 799, stock: 45, image: lifestyleImages[6], description: "Eco-friendly bamboo desk organizer with multiple compartments. Keeps your workspace tidy." },
  { name: "Aromatherapy Diffuser", category: "Lifestyle", price: 2299, stock: 18, image: lifestyleImages[7], description: "Ultrasonic essential oil diffuser with ambient light. Quiet operation for better sleep and focus." },
  { name: "Planner & Journal Set", category: "Lifestyle", price: 699, stock: 60, image: lifestyleImages[8], description: "Premium planner and dotted journal set. Organize your life and capture your thoughts." },
  { name: "Indoor Plant Pot", category: "Lifestyle", price: 599, stock: 55, image: lifestyleImages[9], description: "Elegant ceramic plant pot with drainage holes. Perfect for succulents and small houseplants." },
  { name: "Portable Speaker", category: "Lifestyle", price: 2999, stock: 22, image: lifestyleImages[10], description: "Compact wireless portable speaker with rich sound. Waterproof and up to 12 hours battery life." },
  { name: "Photo Frame Set", category: "Lifestyle", price: 899, stock: 35, image: lifestyleImages[11], description: "Set of 3 minimalist photo frames in different sizes. Display your favorite memories in style." },
  { name: "Linen Cushion Cover", category: "Lifestyle", price: 549, stock: 70, image: lifestyleImages[12], description: "Natural linen cushion cover with a textured finish. Available in earthy tones for a warm home aesthetic." },
  { name: "Macrame Wall Hanging", category: "Lifestyle", price: 1699, stock: 15, image: lifestyleImages[13], description: "Handwoven macrame wall hanging. A beautiful boho accent for any room." },
  { name: "Travel Skincare Kit", category: "Lifestyle", price: 1299, stock: 28, image: lifestyleImages[14], description: "Complete travel-sized skincare kit with cleanser, toner, and moisturizer. TSA-approved packaging." },
  { name: "Reusable Water Bottle", category: "Lifestyle", price: 799, stock: 90, image: lifestyleImages[15], description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours. Leak-proof design." },
  { name: "Meditation Cushion", category: "Lifestyle", price: 1499, stock: 20, image: lifestyleImages[16], description: "Comfortable meditation cushion with buckwheat filling. Supports proper posture during practice." },
  { name: "Leather Coaster Set", category: "Lifestyle", price: 699, stock: 40, image: lifestyleImages[17], description: "Set of 4 genuine leather coasters. Protect your surfaces in style." },
  { name: "Wooden Serving Board", category: "Lifestyle", price: 1199, stock: 25, image: lifestyleImages[18], description: "Handcrafted acacia wood serving board. Perfect for cheese, charcuterie, and entertaining." },
  { name: "Himalayan Salt Lamp", category: "Lifestyle", price: 999, stock: 32, image: lifestyleImages[19], description: "Natural Himalayan salt lamp with warm amber glow. Creates a calming atmosphere and unique ambiance." },

  // ESSENTIALS - 20 products
  { name: "Classic White T-Shirt", category: "Essentials", price: 599, stock: 100, image: essentialsImages[0], description: "Premium quality white t-shirt in 100% cotton. A wardrobe staple that goes with everything." },
  { name: "Black Skinny Jeans", category: "Essentials", price: 1799, stock: 45, image: essentialsImages[1], description: "Essential black skinny jeans with a comfortable stretch fabric. Perfect fit for all body types." },
  { name: "White Sneakers", category: "Essentials", price: 2299, stock: 30, image: essentialsImages[2], description: "Clean minimalist white sneakers that pair with any outfit. Cushioned sole for all-day comfort." },
  { name: "Plain Crew Neck Sweater", category: "Essentials", price: 1299, stock: 40, image: essentialsImages[3], description: "Soft crew neck sweater in a classic fit. Perfect for layering in cooler months." },
  { name: "Canvas Tote Bag", category: "Essentials", price: 499, stock: 80, image: essentialsImages[4], description: "Durable canvas tote bag for everyday use. Spacious interior with internal pocket." },
  { name: "Neutral Hoodie", category: "Essentials", price: 1699, stock: 50, image: essentialsImages[5], description: "Cozy pullover hoodie in neutral tones. Soft fleece lining for warmth and comfort." },
  { name: "Slim Fit Chinos", category: "Essentials", price: 1599, stock: 35, image: essentialsImages[6], description: "Versatile slim fit chinos that work for casual and semi-formal occasions." },
  { name: "Hair Care Set", category: "Essentials", price: 899, stock: 60, image: essentialsImages[7], description: "Complete hair care set with shampoo, conditioner, and hair mask. Formulated for all hair types." },
  { name: "Skincare Starter Kit", category: "Essentials", price: 1499, stock: 25, image: essentialsImages[8], description: "Essential skincare kit with cleanser, serum, and moisturizer. Begin or revamp your skincare routine." },
  { name: "Everyday Backpack", category: "Essentials", price: 2199, stock: 28, image: essentialsImages[9], description: "Functional everyday backpack with laptop compartment and multiple pockets. Durable and stylish." },
  { name: "Cotton Socks Pack", category: "Essentials", price: 399, stock: 120, image: essentialsImages[10], description: "Pack of 5 comfortable cotton socks. Breathable and durable for everyday wear." },
  { name: "Face Wash Gel", category: "Essentials", price: 349, stock: 90, image: essentialsImages[11], description: "Gentle daily face wash gel that removes impurities without drying. Suitable for all skin types." },
  { name: "Sunscreen SPF 50", category: "Essentials", price: 549, stock: 75, image: essentialsImages[12], description: "Lightweight SPF 50 sunscreen for daily use. Non-greasy formula that works under makeup." },
  { name: "Classic Cap", category: "Essentials", price: 699, stock: 55, image: essentialsImages[13], description: "Adjustable cotton cap in classic style. Provides sun protection with a casual look." },
  { name: "Deodorant Roll-On", category: "Essentials", price: 249, stock: 150, image: essentialsImages[14], description: "Long-lasting 48-hour protection deodorant. Gentle formula for sensitive skin." },
  { name: "Travel Toiletry Bag", category: "Essentials", price: 799, stock: 42, image: essentialsImages[15], description: "Compact travel toiletry bag with waterproof lining. Keeps your essentials organized on the go." },
  { name: "Moisturizing Body Lotion", category: "Essentials", price: 449, stock: 85, image: essentialsImages[16], description: "Deeply hydrating body lotion for smooth and supple skin. Absorbs quickly without greasiness." },
  { name: "Lip Balm Set", category: "Essentials", price: 299, stock: 110, image: essentialsImages[17], description: "Set of 3 nourishing lip balms in different flavors. Keeps lips soft and moisturized." },
  { name: "Sleep Eye Mask", category: "Essentials", price: 349, stock: 65, image: essentialsImages[18], description: "Soft and comfortable sleep eye mask for better rest. Blocks light completely for quality sleep." },
  { name: "Compact Umbrella", category: "Essentials", price: 899, stock: 38, image: essentialsImages[19], description: "Windproof compact umbrella that fits in any bag. Automatic open and close mechanism." },

  // ELECTRONICS - 20 products
  { name: "True Wireless Earbuds", category: "Electronics", price: 4999, stock: 20, image: electronicsImages[0], description: "Premium true wireless earbuds with active noise cancellation. Up to 30 hours battery life with case." },
  { name: "Smart Watch", category: "Electronics", price: 8999, stock: 12, image: electronicsImages[1], description: "Feature-packed smartwatch with health tracking, GPS, and notifications. Water-resistant to 50m." },
  { name: "Portable Power Bank", category: "Electronics", price: 1999, stock: 35, image: electronicsImages[2], description: "20,000mAh portable power bank with fast charging. Charges multiple devices simultaneously." },
  { name: "USB-C Hub", category: "Electronics", price: 2499, stock: 25, image: electronicsImages[3], description: "7-in-1 USB-C hub with HDMI, USB-A, SD card reader, and more. Compatible with all USB-C devices." },
  { name: "Wireless Charging Pad", category: "Electronics", price: 1499, stock: 30, image: electronicsImages[4], description: "10W fast wireless charging pad for Qi-compatible devices. Slim design with LED indicator." },
  { name: "Laptop Stand", category: "Electronics", price: 1799, stock: 22, image: electronicsImages[5], description: "Adjustable aluminum laptop stand for ergonomic working. Foldable and portable design." },
  { name: "Mechanical Keyboard", category: "Electronics", price: 5999, stock: 15, image: electronicsImages[6], description: "Compact mechanical keyboard with RGB backlight. Clicky switches for satisfying typing experience." },
  { name: "Webcam HD", category: "Electronics", price: 3499, stock: 18, image: electronicsImages[7], description: "Full HD 1080p webcam with built-in microphone. Auto-focus and light correction for video calls." },
  { name: "Bluetooth Mouse", category: "Electronics", price: 1999, stock: 28, image: electronicsImages[8], description: "Ergonomic Bluetooth mouse with silent clicks. Connects to 3 devices simultaneously." },
  { name: "Phone Camera Lens Kit", category: "Electronics", price: 1299, stock: 32, image: electronicsImages[9], description: "4-in-1 phone camera lens kit including wide angle, macro, fisheye, and telephoto lenses." },
  { name: "LED Desk Lamp", category: "Electronics", price: 2199, stock: 20, image: electronicsImages[10], description: "Smart LED desk lamp with adjustable color temperature and brightness. USB charging port included." },
  { name: "Mini Projector", category: "Electronics", price: 12999, stock: 8, image: electronicsImages[11], description: "Compact mini projector with 150-inch display capability. Built-in speaker and HDMI input." },
  { name: "Noise Cancelling Headphones", category: "Electronics", price: 9999, stock: 10, image: electronicsImages[12], description: "Over-ear noise cancelling headphones with 40-hour battery. Premium sound quality with deep bass." },
  { name: "Smart Home Plug", category: "Electronics", price: 799, stock: 50, image: electronicsImages[13], description: "Wi-Fi enabled smart plug with energy monitoring. Control any device from your smartphone." },
  { name: "USB Microphone", category: "Electronics", price: 4499, stock: 15, image: electronicsImages[14], description: "Professional USB condenser microphone for podcasting and streaming. Cardioid pickup pattern." },
  { name: "E-Reader Case", category: "Electronics", price: 999, stock: 40, image: electronicsImages[15], description: "Protective e-reader case with auto sleep/wake function. Multiple viewing angles." },
  { name: "Car Phone Mount", category: "Electronics", price: 699, stock: 55, image: electronicsImages[16], description: "Universal car phone mount with strong suction cup. 360° rotation for optimal viewing." },
  { name: "Screen Protector Kit", category: "Electronics", price: 349, stock: 80, image: electronicsImages[17], description: "Premium tempered glass screen protector with 9H hardness. Includes cleaning kit and guide frame." },
  { name: "Cable Management Kit", category: "Electronics", price: 499, stock: 65, image: electronicsImages[18], description: "Complete cable management kit with clips, ties, and sleeves. Keep your desk organized and tidy." },
  { name: "Portable LED Ring Light", category: "Electronics", price: 1699, stock: 25, image: electronicsImages[19], description: "Portable LED ring light for selfies and video calls. Clip-on design with 3 color temperatures." },

  // ACCESSORIES - 20 products
  { name: "Leather Crossbody Bag", category: "Accessories", price: 3499, stock: 20, image: accessoriesImages[0], description: "Genuine leather crossbody bag with adjustable strap. Multiple compartments for organized storage." },
  { name: "Minimalist Watch", category: "Accessories", price: 5999, stock: 12, image: accessoriesImages[1], description: "Slim minimalist watch with Japanese quartz movement. Sapphire crystal glass and genuine leather strap." },
  { name: "Aviator Sunglasses", category: "Accessories", price: 1999, stock: 30, image: accessoriesImages[2], description: "Classic aviator sunglasses with UV400 protection. Polarized lenses for clear vision in bright sunlight." },
  { name: "Gold Hoop Earrings", category: "Accessories", price: 1299, stock: 45, image: accessoriesImages[3], description: "Elegant 18K gold plated hoop earrings. Timeless design that complements any outfit." },
  { name: "Silk Scarf", category: "Accessories", price: 1799, stock: 25, image: accessoriesImages[4], description: "Luxurious 100% silk scarf with vibrant print. Wear as a headscarf, neck scarf, or belt." },
  { name: "Beaded Bracelet Set", category: "Accessories", price: 799, stock: 60, image: accessoriesImages[5], description: "Set of 5 handmade beaded bracelets in complementary colors. Stack them for a boho look." },
  { name: "Canvas Weekender Bag", category: "Accessories", price: 2899, stock: 18, image: accessoriesImages[6], description: "Spacious canvas weekender bag with leather handles. Perfect for short trips and gym sessions." },
  { name: "Pearl Necklace", category: "Accessories", price: 2499, stock: 15, image: accessoriesImages[7], description: "Classic freshwater pearl necklace with sterling silver clasp. Timeless elegance for any occasion." },
  { name: "Woven Belt", category: "Accessories", price: 899, stock: 35, image: accessoriesImages[8], description: "Handwoven fabric belt with metal buckle. Adds texture and interest to any outfit." },
  { name: "Knit Beanie", category: "Accessories", price: 699, stock: 50, image: accessoriesImages[9], description: "Cozy ribbed knit beanie in neutral shades. Keeps you warm while staying stylish." },
  { name: "Straw Hat", category: "Accessories", price: 1299, stock: 28, image: accessoriesImages[10], description: "Natural straw bucket hat with wide brim. Sun protection meets summer style." },
  { name: "Chunky Chain Necklace", category: "Accessories", price: 1499, stock: 22, image: accessoriesImages[11], description: "Bold chunky chain necklace in gold tone. Makes a statement with minimal or layered outfits." },
  { name: "Running Sneakers", category: "Accessories", price: 3999, stock: 20, image: accessoriesImages[12], description: "High-performance running sneakers with cushioned sole. Breathable mesh upper for comfort." },
  { name: "Leather Gloves", category: "Accessories", price: 1799, stock: 15, image: accessoriesImages[13], description: "Genuine leather driving gloves with touchscreen fingertips. Keep hands warm without sacrificing style." },
  { name: "Hair Clip Set", category: "Accessories", price: 499, stock: 80, image: accessoriesImages[14], description: "Set of 6 trendy hair clips in various styles. Tortoiseshell and gold-tone options included." },
  { name: "Ankle Boots", category: "Accessories", price: 4299, stock: 14, image: accessoriesImages[15], description: "Chic ankle boots with block heel. Versatile style that pairs with jeans, dresses, and skirts." },
  { name: "Statement Ring Set", category: "Accessories", price: 999, stock: 55, image: accessoriesImages[16], description: "Set of 5 stackable statement rings in various sizes. Mix and match for your perfect combination." },
  { name: "Travel Jewelry Case", category: "Accessories", price: 899, stock: 30, image: accessoriesImages[17], description: "Compact travel jewelry case with velvet-lined compartments. Keeps necklaces tangle-free." },
  { name: "Bucket Hat", category: "Accessories", price: 849, stock: 42, image: accessoriesImages[18], description: "Trendy reversible bucket hat in two colorways. Adjustable fit for all head sizes." },
  { name: "Vintage Camera Bag", category: "Accessories", price: 2699, stock: 16, image: accessoriesImages[19], description: "Stylish vintage-inspired camera bag that doubles as a fashion accessory. Padded interior for protection." },
];

async function seed() {
  console.log(`Seeding ${products.length} products...`);

  let inserted = 0;
  for (const p of products) {
    const id = `P${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    await db.insert(productsTable).values({
      id,
      name: p.name,
      category: p.category,
      price: String(p.price),
      stock: p.stock,
      image: p.image,
      description: p.description,
    });
    inserted++;
    process.stdout.write(`\r${inserted}/${products.length} products inserted`);
    await new Promise(r => setTimeout(r, 20));
  }

  console.log(`\nDone! Inserted ${inserted} products.`);
  await pool.end();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
