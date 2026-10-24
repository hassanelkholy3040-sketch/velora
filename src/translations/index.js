// Centralized Translation Strings — VELORA
// en = English (LTR)  |  ar = Arabic (RTL)

const translations = {
  en: {
    announcement: 'Complimentary shipping on orders over $100.',
    lang: { en: 'English', ar: 'العربية', switch: 'Switch language' },

    nav: {
      home: 'Home',
      shopAll: 'Shop All',
      men: 'Men',
      women: 'Women',
      newArrivals: 'New Arrivals',
      sale: 'Sale',
      search: 'Search',
      cart: 'Cart',
      wishlist: 'Wishlist',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },

    hero: {
      badge: 'Autumn / Winter Collection',
      headline: 'Style That\nSpeaks.',
      sub: 'Thoughtfully crafted pieces for the modern wardrobe. Premium materials, enduring design.',
      cta1: 'Shop Collection',
      cta2: 'Discover New Arrivals',
      scrollHint: 'Scroll',
    },

    collections: {
      title: 'Our Collections',
      subtitle: 'Shop by Collection',
      shopNow: 'Shop Now',
      mens: { title: "Men's Collection", sub: 'Refined essentials' },
      womens: { title: "Women's Collection", sub: 'Effortless elegance' },
      newArrivals: { title: 'New Arrivals', sub: 'The latest edit' },
    },

    featured: {
      title: 'Featured Pieces',
      subtitle: 'Carefully Selected',
      viewAll: 'View All',
    },

    newArrivalsSec: {
      title: 'New Arrivals',
      subtitle: 'Just In',
      viewAll: 'View All New Arrivals',
    },

    brand: {
      subtitle: 'Our Philosophy',
      title: 'Designed for the\nModern Individual.',
      para1:
        'At VELORA, we believe that great clothing is more than fabric and stitching. It is an expression of character, a daily practice of care and intention.',
      para2:
        'Each piece is developed with premium materials sourced from trusted suppliers, refined silhouettes designed to flatter a range of proportions, and finishes that age gracefully.',
      cta: 'About VELORA',
    },

    promo: {
      label: 'Limited Time',
      title: 'Up to 40% Off Selected Styles',
      sub: "Discover this season's most coveted pieces at exceptional prices.",
      cta: 'Shop the Sale',
    },

    newsletter: {
      title: 'Join the VELORA Circle',
      sub: 'Be the first to know about new arrivals, exclusive offers, and brand stories.',
      placeholder: 'Your email address',
      submit: 'Subscribe',
      successTitle: 'Thank you for subscribing.',
      successSub: 'Thanks for your interest. This is a demo only; no email was sent or saved to a mailing list.',
      errorEmail: 'Please enter a valid email address.',
    },

    footer: {
      brand: 'A contemporary fashion label crafting timeless pieces for the modern individual.',
      shop: {
        title: 'Shop',
        shopAll: 'Shop All',
        men: "Men's",
        women: "Women's",
        newArrivals: 'New Arrivals',
        sale: 'Sale',
      },
      help: {
        title: 'Help',
        faq: 'FAQ',
        returns: 'Returns & Exchanges',
        sizeGuide: 'Size Guide',
        contact: 'Contact Us',
      },
      contact: {
        title: 'Contact',
        email: 'hello@velora.demo',
        phone: '+1 (000) 000-0000',
        hours: 'Mon – Fri, 9 am – 6 pm',
        note: 'Demo contact info only.',
      },
      social: {
        title: 'Follow Us',
        note: 'Social links are placeholders for demo purposes.',
      },
      rights: '© 2024 VELORA. All rights reserved.',
      demo: 'This is a front-end demonstration. No real store, orders, or payments exist.',
    },

    // Shop / Filters
    shop: {
      title: 'Shop All',
      menTitle: "Men's Collection",
      womenTitle: "Women's Collection",
      newArrivalsTitle: 'New Arrivals',
      saleTitle: 'Sale',
      intro: 'Explore the full VELORA collection.',
      products: 'products',
      product: 'product',
      showing: 'Showing',
      noResults: 'No products found',
      noResultsSub: 'Try adjusting your search or filters.',
      clearFilters: 'Clear All Filters',
      loadMore: 'Load More',
    },

    filters: {
      title: 'Filters',
      search: 'Search',
      searchPlaceholder: 'Search products...',
      gender: 'Gender',
      category: 'Category',
      collection: 'Collection',
      size: 'Size',
      color: 'Color',
      price: 'Price Range',
      maxPrice: 'Max Price',
      saleOnly: 'Sale Items Only',
      close: 'Close filters',
      viewResults: 'View Results',
      clearAll: 'Clear All',
      activeFilters: 'Active Filters',
      all: 'All',
    },

    sort: {
      label: 'Sort by',
      featured: 'Featured',
      newest: 'Newest',
      priceAsc: 'Price: Low to High',
      priceDesc: 'Price: High to Low',
      alphaAsc: 'Name: A to Z',
    },

    genders: { Men: 'Men', Women: 'Women' },
    collections_: {
      Essentials: 'Essentials',
      'New Arrivals': 'New Arrivals',
      Tailoring: 'Tailoring',
    },

    // Product Detail
    product: {
      selectSize: 'Select Size',
      selectColor: 'Select Color',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to Cart',
      added: 'Added!',
      quantity: 'Quantity',
      description: 'Description',
      details: 'Details',
      shipping: 'Shipping & Returns',
      shippingInfo: 'Free shipping on orders over $100. Free returns within 30 days.',
      back: 'Back',
      outOfStock: 'Out of Stock',
      onlyLeft: 'Only {n} left',
      validationSize: 'Please select a size.',
      validationColor: 'Please select a colour.',
      relatedTitle: 'You May Also Like',
      sizeGuide: 'Size Guide',
      category: 'Category',
      color: 'Colour',
      size: 'Size',
      notFound: 'Product not found.',
      notFoundSub: 'This product does not exist or may have been removed.',
      continueShopping: 'Continue Shopping',
    },

    badges: {
      new: 'New',
      bestseller: 'Bestseller',
      sale: 'Sale',
    },

    // Cart
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      emptySub: 'Discover our curated collection and find your perfect piece.',
      continueShopping: 'Continue Shopping',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      freeShipping: 'Free',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      clearCart: 'Clear cart',
      remove: 'Remove',
      qty: 'Qty',
      addMoreForFree: 'Add {amount} more for free shipping',
      freeShippingUnlocked: 'You qualify for free shipping!',
      shippingNote: 'Shipping calculated at checkout.',
    },

    // Wishlist
    wishlist: {
      title: 'Wishlist',
      empty: 'Your wishlist is empty',
      emptySub: 'Save your favourite pieces here to revisit them later.',
      continueShopping: 'Start Shopping',
      addToCart: 'Add to Cart',
      remove: 'Remove',
      items: 'items',
    },

    // Checkout
    checkout: {
      title: 'Checkout',
      contact: 'Contact Information',
      shipping: 'Shipping Address',
      orderSummary: 'Order Summary',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Street Address',
      city: 'City',
      postal: 'Postal Code',
      country: 'Country',
      placeOrder: 'Place Demo Order',
      backToCart: 'Back to Cart',
      required: 'This field is required.',
      emailInvalid: 'Please enter a valid email address.',
      emptyCart: 'Your cart is empty. Please add items before checking out.',
      processing: 'Processing...',
      demoNotice: 'Demo checkout — no real payment or order will be placed.',
    },

    // Order Confirmation
    confirmation: {
      title: 'Order Confirmed',
      sub: 'Thank you for your demo order! This is a front-end demonstration — no real order has been placed and no payment has been processed.',
      orderRef: 'Order Reference',
      continueShopping: 'Continue Shopping',
      backHome: 'Return to Home',
      yourItems: 'Your Items',
      total: 'Total',
      shippingTo: 'Shipping to',
    },

    // 404
    notFound: {
      title: '404 — Page Not Found',
      sub: 'The page you are looking for does not exist.',
      backHome: 'Return to Home',
      browse: 'Browse Collection',
    },

    // Toasts
    toast: {
      addedToCart: 'Added to cart',
      removedFromCart: 'Removed from cart',
      addedToWishlist: 'Added to wishlist',
      removedFromWishlist: 'Removed from wishlist',
      cartCleared: 'Cart cleared',
    },

    // Common
    common: {
      loading: 'Loading...',
      free: 'Free',
      backToTop: 'Back to top',
      close: 'Close',
      or: 'or',
      all: 'All',
    },
  },

  // ─── Arabic ─────────────────────────────────────────────────────────────────
  ar: {
    announcement: 'شحن مجاني للطلبات التي تزيد قيمتها عن 100 دولار.',
    lang: { en: 'English', ar: 'العربية', switch: 'تغيير اللغة' },

    nav: {
      home: 'الرئيسية',
      shopAll: 'تسوق الكل',
      men: 'رجال',
      women: 'نساء',
      newArrivals: 'وصل حديثاً',
      sale: 'تخفيضات',
      search: 'بحث',
      cart: 'سلة التسوق',
      wishlist: 'المفضلة',
      openMenu: 'فتح قائمة التنقل',
      closeMenu: 'إغلاق قائمة التنقل',
    },

    hero: {
      badge: 'مجموعة الخريف / الشتاء',
      headline: 'أناقة\nتتحدث.',
      sub: 'قطع مصممة بعناية لخزانة ملابس عصرية. مواد فاخرة وتصميم لا يعتريه الزمن.',
      cta1: 'تسوق المجموعة',
      cta2: 'اكتشف الوصول الجديد',
      scrollHint: 'تمرير',
    },

    collections: {
      title: 'مجموعاتنا',
      subtitle: 'تسوق حسب المجموعة',
      shopNow: 'تسوق الآن',
      mens: { title: 'مجموعة الرجال', sub: 'أساسيات راقية' },
      womens: { title: 'مجموعة النساء', sub: 'أناقة بلا مجهود' },
      newArrivals: { title: 'وصل حديثاً', sub: 'أحدث الإضافات' },
    },

    featured: {
      title: 'قطع مختارة',
      subtitle: 'اختيار دقيق',
      viewAll: 'عرض الكل',
    },

    newArrivalsSec: {
      title: 'وصل حديثاً',
      subtitle: 'الجديد',
      viewAll: 'عرض كل الوصول الجديد',
    },

    brand: {
      subtitle: 'فلسفتنا',
      title: 'مصمم للفرد\nالعصري.',
      para1:
        'في VELORA، نؤمن بأن الملابس الرائعة تتخطى القماش والخياطة. إنها تعبير عن الشخصية وممارسة يومية للاهتمام بالتفاصيل.',
      para2:
        'تُصنع كل قطعة من مواد فاخرة، بقوالب مدروسة تناسب مختلف أشكال الجسم، ولمسات نهائية راقية تزداد جمالاً مع الوقت.',
      cta: 'عن VELORA',
    },

    promo: {
      label: 'لفترة محدودة',
      title: 'خصم يصل إلى 40% على أزياء مختارة',
      sub: 'اكتشف أكثر قطع هذا الموسم رواجاً بأسعار استثنائية.',
      cta: 'تسوق التخفيضات',
    },

    newsletter: {
      title: 'انضم إلى دائرة VELORA',
      sub: 'كن أول من يعلم بالوصول الجديد والعروض الحصرية وقصص العلامة التجارية.',
      placeholder: 'بريدك الإلكتروني',
      submit: 'اشترك',
      successTitle: 'شكراً على اشتراكك.',
      successSub: 'شكراً لاهتمامك. هذا عرض تجريبي فقط؛ لم يُرسل بريد إلكتروني ولم تُحفظ بياناتك في قائمة بريدية.',
      errorEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
    },

    footer: {
      brand: 'علامة تجارية عصرية تصنع قطعاً خالدة للفرد الحديث.',
      shop: {
        title: 'تسوق',
        shopAll: 'تسوق الكل',
        men: 'رجال',
        women: 'نساء',
        newArrivals: 'وصل حديثاً',
        sale: 'تخفيضات',
      },
      help: {
        title: 'مساعدة',
        faq: 'الأسئلة الشائعة',
        returns: 'الإرجاع والتبديل',
        sizeGuide: 'دليل المقاسات',
        contact: 'تواصل معنا',
      },
      contact: {
        title: 'تواصل',
        email: 'hello@velora.demo',
        phone: '+1 (000) 000-0000',
        hours: 'الاثنين – الجمعة، 9 ص – 6 م',
        note: 'بيانات تواصل توضيحية فقط.',
      },
      social: {
        title: 'تابعنا',
        note: 'روابط وسائل التواصل الاجتماعي هي روابط توضيحية للعرض فقط.',
      },
      rights: '© 2024 VELORA. جميع الحقوق محفوظة.',
      demo: 'هذا عرض توضيحي للواجهة الأمامية. لا يوجد متجر أو طلبات أو مدفوعات حقيقية.',
    },

    shop: {
      title: 'تسوق الكل',
      menTitle: 'مجموعة الرجال',
      womenTitle: 'مجموعة النساء',
      newArrivalsTitle: 'وصل حديثاً',
      saleTitle: 'تخفيضات',
      intro: 'استكشف مجموعة VELORA الكاملة.',
      products: 'منتجات',
      product: 'منتج',
      showing: 'يُعرض',
      noResults: 'لم يُعثر على منتجات',
      noResultsSub: 'حاول تعديل البحث أو الفلاتر.',
      clearFilters: 'مسح كل الفلاتر',
      loadMore: 'تحميل المزيد',
    },

    filters: {
      title: 'الفلاتر',
      search: 'بحث',
      searchPlaceholder: 'ابحث عن منتج...',
      gender: 'الجنس',
      category: 'الفئة',
      collection: 'المجموعة',
      size: 'المقاس',
      color: 'اللون',
      price: 'نطاق السعر',
      maxPrice: 'أقصى سعر',
      saleOnly: 'المنتجات المخفضة فقط',
      close: 'إغلاق الفلاتر',
      viewResults: 'عرض النتائج',
      clearAll: 'مسح الكل',
      activeFilters: 'الفلاتر النشطة',
      all: 'الكل',
    },

    sort: {
      label: 'ترتيب حسب',
      featured: 'المميز',
      newest: 'الأحدث',
      priceAsc: 'السعر: من الأقل للأعلى',
      priceDesc: 'السعر: من الأعلى للأقل',
      alphaAsc: 'الاسم: من أ إلى ي',
    },

    genders: { Men: 'رجال', Women: 'نساء' },
    collections_: {
      Essentials: 'الأساسيات',
      'New Arrivals': 'وصل حديثاً',
      Tailoring: 'الملابس الرسمية',
    },

    product: {
      selectSize: 'اختر المقاس',
      selectColor: 'اختر اللون',
      addToCart: 'أضف إلى السلة',
      addedToCart: 'أُضيف إلى السلة',
      added: 'أُضيف!',
      quantity: 'الكمية',
      description: 'الوصف',
      details: 'التفاصيل',
      shipping: 'الشحن والإرجاع',
      shippingInfo: 'شحن مجاني للطلبات التي تزيد عن 100 دولار. إرجاع مجاني خلال 30 يوماً.',
      back: 'رجوع',
      outOfStock: 'نفذ من المخزون',
      onlyLeft: 'تبقى {n} فقط',
      validationSize: 'يرجى اختيار المقاس.',
      validationColor: 'يرجى اختيار اللون.',
      relatedTitle: 'قد يعجبك أيضاً',
      sizeGuide: 'دليل المقاسات',
      category: 'الفئة',
      color: 'اللون',
      size: 'المقاس',
      notFound: 'المنتج غير موجود.',
      notFoundSub: 'هذا المنتج غير موجود أو ربما تمت إزالته.',
      continueShopping: 'تابع التسوق',
    },

    badges: {
      new: 'جديد',
      bestseller: 'الأكثر مبيعاً',
      sale: 'تخفيض',
    },

    cart: {
      title: 'سلة التسوق',
      empty: 'سلة التسوق فارغة',
      emptySub: 'اكتشف مجموعتنا المختارة وأوجد قطعتك المثالية.',
      continueShopping: 'تابع التسوق',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      freeShipping: 'مجاني',
      total: 'الإجمالي',
      checkout: 'المتابعة للدفع',
      clearCart: 'إفراغ السلة',
      remove: 'حذف',
      qty: 'الكمية',
      addMoreForFree: 'أضف {amount} للحصول على شحن مجاني',
      freeShippingUnlocked: 'تأهلت للشحن المجاني!',
      shippingNote: 'يُحسب الشحن عند الدفع.',
    },

    wishlist: {
      title: 'المفضلة',
      empty: 'قائمة المفضلة فارغة',
      emptySub: 'احفظ قطعك المفضلة هنا لمراجعتها لاحقاً.',
      continueShopping: 'ابدأ التسوق',
      addToCart: 'أضف إلى السلة',
      remove: 'حذف',
      items: 'عناصر',
    },

    checkout: {
      title: 'إتمام الطلب',
      contact: 'معلومات التواصل',
      shipping: 'عنوان الشحن',
      orderSummary: 'ملخص الطلب',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      address: 'العنوان',
      city: 'المدينة',
      postal: 'الرمز البريدي',
      country: 'الدولة',
      placeOrder: 'تأكيد الطلب التجريبي',
      backToCart: 'العودة إلى السلة',
      required: 'هذا الحقل مطلوب.',
      emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح.',
      emptyCart: 'سلة التسوق فارغة. يرجى إضافة منتجات قبل إتمام الطلب.',
      processing: 'جاري المعالجة...',
      demoNotice: 'طلب تجريبي — لن يتم إجراء أي دفع أو طلب حقيقي.',
    },

    confirmation: {
      title: 'تم تأكيد الطلب',
      sub: 'شكراً على طلبك التجريبي! هذا عرض توضيحي للواجهة الأمامية — لم يتم تقديم أي طلب حقيقي ولم يتم معالجة أي دفع.',
      orderRef: 'رقم مرجع الطلب',
      continueShopping: 'تابع التسوق',
      backHome: 'العودة إلى الرئيسية',
      yourItems: 'طلباتك',
      total: 'الإجمالي',
      shippingTo: 'الشحن إلى',
    },

    notFound: {
      title: '404 — الصفحة غير موجودة',
      sub: 'الصفحة التي تبحث عنها غير موجودة.',
      backHome: 'العودة إلى الرئيسية',
      browse: 'استعراض المجموعة',
    },

    toast: {
      addedToCart: 'أُضيف إلى السلة',
      removedFromCart: 'حُذف من السلة',
      addedToWishlist: 'أُضيف إلى المفضلة',
      removedFromWishlist: 'حُذف من المفضلة',
      cartCleared: 'تم إفراغ السلة',
    },

    common: {
      loading: 'جاري التحميل...',
      free: 'مجاني',
      backToTop: 'العودة للأعلى',
      close: 'إغلاق',
      or: 'أو',
      all: 'الكل',
    },
  },
};

export default translations;

