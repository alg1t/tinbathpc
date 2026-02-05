"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
// import { Cart } from "@prisma/client";
import { PlusIcon, MinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useTransition } from "react";

import { toast } from "sonner"; // <-- Changed this import

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(`${item.name} added to cart`, {
        // Changed to use toast.success (dot notation)
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(`${item.name} removed from cart`, {
        // Changed to use toast.success (dot notation)
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });

      // toast({
      //   variant: res.success ? "default" : "destructive",
      //   description: res.message,
      // });

      return;
    });
  };
  // Add item to cart logic here
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <MinusIcon className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <PlusIcon className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <PlusIcon className="w-4 h-4" />
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
// toast.success(`${item.name} added to cart`, {
//   action: (
//     <Button
//       className="bg-primary text-white hover:bg-gray-800"
//       onClick={() => router.push("/cart")}
//     >
//       Go to cart
//     </Button>
//   ),
// });

// Handel successful add to cart
// toast.custom((t) => (
//   <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex items-center space-x-4">
//     <span className=" text-gray-700">{`${item.name} added to cart`}</span>
//     <Button
//       onClick={() => {
//         router.push("/cart"); // Navigate to cart page
//         // toast.dismiss(t.id); // Dismiss toast after clicking
//       }}
//       className="ml-auto bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
//     >
//       Go to Cart
//     </Button>
//   </div>
// ));

// const handleRemoveFromCart = () => {
//   return;
// };
//
//   return (
//     <Button className="w-full" type="button" onClick={handelAddToCart}>
//       <PlusIcon />
//       Add To Cart
//     </Button>
//   );
// };
