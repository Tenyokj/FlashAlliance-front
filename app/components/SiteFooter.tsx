import Link from "next/link";
import { siteLinks } from "@/lib/siteLinks";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <h4>FlashAlliance</h4>
        <p>Collective NFT module for tokenized alliance trading.</p>
      </div>

      <div className="footer-col">
        <h5>Product</h5>
        {siteLinks.product.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="footer-col">
        <h5>Ecosystem</h5>
        {siteLinks.ecosystem.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="footer-col">
        <h5>Community</h5>
        {siteLinks.community.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
          >
            {item.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
