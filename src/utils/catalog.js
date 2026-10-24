export function filterProducts(catalog, options = {}) {
  const {
    kind = 'shop', query = '', category = '', gender = '', size = '', color = '',
    minPrice = '', maxPrice = '', saleOnly = false, sort = 'featured', lang = 'en',
  } = options;
  const minimum = minPrice !== '' && minPrice != null && Number.isFinite(Number(minPrice)) && Number(minPrice) >= 0 ? Number(minPrice) : null;
  const maximum = maxPrice !== '' && maxPrice != null && Number.isFinite(Number(maxPrice)) && Number(maxPrice) >= 0 ? Number(maxPrice) : null;
  const needle = String(query).trim().toLocaleLowerCase(lang === 'ar' ? 'ar' : 'en');
  const filtered = catalog.filter(product => {
    if (kind === 'men' && product.gender !== 'Men') return false;
    if (kind === 'women' && product.gender !== 'Women') return false;
    if (kind === 'new' && !product.isNew) return false;
    if (kind === 'sale' && !product.isSale) return false;
    if (category && product.category !== category) return false;
    if (gender && product.gender.toLowerCase() !== String(gender).toLowerCase()) return false;
    if (size && !product.sizes.includes(size)) return false;
    if (color && !product.colors.some(item => item.name === color)) return false;
    if (minimum !== null && product.price < minimum) return false;
    if (maximum !== null && product.price > maximum) return false;
    if (saleOnly && !product.isSale) return false;
    if (needle) {
      const searchable = [product.name, product.nameAr, product.description, product.descriptionAr, product.category, product.categoryAr,
        ...product.colors.flatMap(item => [item.name, item.nameAr])].join(' ').toLocaleLowerCase(lang === 'ar' ? 'ar' : 'en');
      if (!searchable.includes(needle)) return false;
    }
    return true;
  });

  const validSort = ['featured', 'newest', 'priceAsc', 'priceDesc', 'alphaAsc'].includes(sort) ? sort : 'featured';
  return filtered.sort((a, b) => {
    if (validSort === 'newest') return Number(b.isNew) - Number(a.isNew) || Number(b.id) - Number(a.id);
    if (validSort === 'priceAsc') return a.price - b.price;
    if (validSort === 'priceDesc') return b.price - a.price;
    if (validSort === 'alphaAsc') return (lang === 'ar' ? a.nameAr : a.name).localeCompare(lang === 'ar' ? b.nameAr : b.name, lang === 'ar' ? 'ar' : 'en');
    return Number(b.isFeatured) - Number(a.isFeatured) || Number(b.isBestseller) - Number(a.isBestseller);
  });
}
