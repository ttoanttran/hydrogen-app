import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import "../styles/ProductItem.css"

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */

export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/* This container will now hold both the product image AND its frame */}
      <div className="product-card-image-container"> 
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1" /* This aspectRatio is for the Hydrogen Image component itself */
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="product-image"
          />
        )}
        
        {/* The frame image, now positioned to cover only this container */}
        <img 
          src="/frame1.png" 
          alt="" 
          className="product-frame-overlay" /* Changed class name for clarity */
          aria-hidden="true"
        />
      </div>

      <div className="product-info-wrapper">
        <h4>{product.title}</h4>
        <small>
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </div>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */