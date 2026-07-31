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
    "Explore products designed and engineered by Anas Ahmed, beginning with the Kotlin Multiplatform receipt-splitting app TabTally.",
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
              <a className="public-primary" href={product.href}>
                View the product story <ArrowRight size={17} weight="bold" aria-hidden />
              </a>
            </div>
            <a className="product-feature-art" href={product.href} aria-label={`Explore ${product.name}`}>
              <img src={product.artwork} alt={`${product.name}: ${product.tagline}`} />
              <div>
                <img src="/products/tabtally/app-icon.png" alt="" />
                <span>Android + iOS</span>
                <strong>One shared product system</strong>
              </div>
            </a>
          </article>
        ))}
      </section>

      <section className="future-products">
        <span>PRODUCT SYSTEM · EXPANDABLE</span>
        <h2>This directory is designed to grow.</h2>
        <p>
          Future products will receive the same combination of a concise public
          story, authentic visuals, and engineering detail. This page will grow
          when another product is ready to show.
        </p>
      </section>

      <PublicFooter />
    </main>
  );
}
