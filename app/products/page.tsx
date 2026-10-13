import type { Metadata } from "next";
import {
  ArrowRight,
  DeviceMobile,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { PublicFooter, PublicHeader } from "../components/PublicHeader";
import { PRODUCTS } from "../data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore products designed and engineered by Anas Ahmed, including SplitDish, SmartShopper, and Highlight Corner, an NFL web app for scores, game labels, highlights, fantasy, and recaps.",
};

export default function ProductsPage() {
  return (
    <main className="public-shell products-shell">
      <PublicHeader active="products" />

      <section className="products-hero" aria-labelledby="products-title">
        <p className="public-kicker"><span /> PRODUCT DIRECTORY</p>
        <h1 id="products-title">Products built with the same standard as production systems.</h1>
        <p>
          Focused tools where clear interaction, dependable engineering, and
          responsible data handling shape the product from the start.
        </p>
        <div className="products-principles" aria-label="Product principles">
          <span><Sparkle size={18} weight="duotone" aria-hidden /> Focused utility</span>
          <span><ShieldCheck size={18} weight="duotone" aria-hidden /> Human control</span>
          <span><DeviceMobile size={18} weight="duotone" aria-hidden /> Mobile-first craft</span>
        </div>
      </section>

      <section className="product-directory" aria-label="Products">
        {PRODUCTS.map((product, index) => (
          <article className="product-feature" key={product.id}>
            <div className="product-feature-copy">
              <div className="product-feature-status">
                <span>0{index + 1}</span>
                <small>{product.status}</small>
              </div>
              <h2>{product.name}</h2>
              <h3>{product.tagline}</h3>
              <p>{product.engineeringSummary}</p>
              <div className="product-platforms">
                {product.platforms.map((platform) => <span key={platform}>{platform}</span>)}
              </div>
              <div className="product-tech">
                {product.technologies.map((technology) => <span key={technology}>{technology}</span>)}
              </div>
              <a
                className="public-primary"
                href={product.href}
                target={product.external ? "_blank" : undefined}
                rel={product.external ? "noreferrer" : undefined}
              >
                {product.external ? `Open ${product.name}` : "View the product story"}
                <ArrowRight size={17} weight="bold" aria-hidden />
              </a>
            </div>
            <a
              className={`product-feature-art product-feature-art-${product.id}`}
              href={product.href}
              aria-label={`Explore ${product.name}`}
              target={product.external ? "_blank" : undefined}
              rel={product.external ? "noreferrer" : undefined}
            >
              {product.artwork ? (
                <img src={product.artwork} alt={product.artworkAlt ?? `${product.name}: ${product.tagline}`} />
              ) : (
                <div className="smartshopper-art" aria-hidden="true">
                  <div className="smartshopper-art-head">
                    <span>SMARTSHOPPER</span>
                    <i>RESEARCH BRIEF</i>
                  </div>
                  <strong>What matters most?</strong>
                  <p>Budget · material · fit · retailer</p>
                  <div className="smartshopper-options">
                    <span><b>01</b> Best value</span>
                    <span><b>02</b> Balanced pick</span>
                    <span><b>03</b> Premium option</span>
                  </div>
                  <small>Recommendations include sources, purchase links, and clear tradeoffs.</small>
                </div>
              )}
              <div>
                {product.icon ? (
                  <img src={product.icon} alt="" />
                ) : (
                  <b className="product-art-monogram" aria-hidden="true">{product.monogram}</b>
                )}
                <span>{product.artworkLabel}</span>
                <strong>{product.artworkDetail}</strong>
              </div>
            </a>
          </article>
        ))}
      </section>

      <section className="future-products">
        <span>PRODUCT SYSTEM · EXPANDABLE</span>
        <h2>Three products, one standard for useful software.</h2>
        <p>
          SplitDish demonstrates cross-platform product engineering. SmartShopper
          demonstrates structured AI research and recommendation design. Highlight
          Corner brings scores, official highlight links, fantasy views, and original
          game stories together in a live sports product.
        </p>
      </section>

      <PublicFooter />
    </main>
  );
}
