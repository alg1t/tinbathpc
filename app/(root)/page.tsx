// import sampleData from "@/db/sample-data";
// import ProductList from "@/components/shared/product/product-list";
// import { getLatestProducts } from "@/lib/actions/product.actions";

// // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// const Homepage = async () => {
//   const latestProducts = await getLatestProducts();
//   return (
//     <>
//
//       <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
//     </>
//   );
// };

import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}

      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </>
  );
};

export default Homepage;
// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// import ProductList from "@/components/shared/product/product-list";
// // import sampleData from "../../../db/sample-data";
// import { getLatestProducts } from "@/lib/actions/product.actions";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Home",
// };

// export default async function HomePage() {
//   const latestProductsRaw = await getLatestProducts();
//   const latestProducts = latestProductsRaw.map((prod) => ({
//     ...prod,
//     price: prod.price.toString(),
//     rating: prod.rating.toString(),
//   }));

//   return (
//     <>
//       <ProductList data={latestProducts} title="Newest Arrival" limit={4} />
//     </>
//   );
// }
