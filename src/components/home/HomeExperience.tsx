import Link from "next/link";
import { ApprovedImage } from "@/components/media/ApprovedImage";
import { wellnessThemeContent } from "@/components/ui/objects/wellnessThemeContent";
import {
  getApprovedImageAsset,
  responsiveImageSizes,
} from "@/lib/images/approved-assets";
import "./home-experience.css";

const homeStoryImage = getApprovedImageAsset("hero-reference");

export function HomeExperience() {
  return (
    <section id="wellness" className="home-experience" aria-label="Phekong wellness story">
      <div className="home-experience__story">
        <div className="home-experience__media">
          <ApprovedImage
            src={homeStoryImage.src}
            alt={homeStoryImage.alt}
            width={homeStoryImage.width}
            height={homeStoryImage.height}
            sizes={responsiveImageSizes.homeStory}
            quality={75}
            loading="lazy"
            fallbackLabel="Wellness image unavailable"
          />
        </div>
        <div className="home-experience__copy">
          <p className="home-experience__eyebrow">{wellnessThemeContent.hero.eyebrow}</p>
          <h2 className="home-experience__title">{wellnessThemeContent.hero.heading}</h2>
          <p className="home-experience__lede">{wellnessThemeContent.hero.description}</p>
          <p className="home-experience__lede">{wellnessThemeContent.brandStory}</p>
          <div className="home-experience__actions">
            <Link className="home-experience__cta" href="/booking">
              Book a service
            </Link>
            <Link className="home-experience__secondary" href="/products">
              Shop best sellers
            </Link>
            <Link className="home-experience__secondary" href="/services">
              Explore services
            </Link>
            <Link className="home-experience__secondary" href="/contact">
              Talk to us
            </Link>
          </div>
          <div className="home-experience__chips">
            {wellnessThemeContent.trustPoints.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
        </div>
      </div>

      <div id="shop-by-need" aria-label="Shop by need" className="home-experience__grid">
        {wellnessThemeContent.categories.map((category) => (
          <Link key={category.title} className="home-experience__card" href={category.href}>
            <h3>{category.title}</h3>
            <p>{category.copy}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
