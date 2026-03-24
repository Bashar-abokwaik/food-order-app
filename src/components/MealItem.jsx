import { useContext, useEffect } from "react";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import CartContext from "../store/CartContext";

// Component to display individual meal item
export default function MealItem({ meal }) {
  // Access cart context
  const cartCtx = useContext(CartContext);
  // Handler to add meal to cart
function handleAddMealToCart() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const index = cartItems.findIndex(item => item.id === meal.id);

  if (index >= 0) {
    cartItems[index].quantity += 1;
  } else {
    cartItems.push({ ...meal, quantity: 1 });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  cartCtx.addItem({ ...meal, quantity: 1 });
}

  return (
    <li className="meal-item">
      <article>
        <img src={`https://meals-backend-42v0.onrender.com/${meal.image}`} alt={meal.name} />
        <div>
          <h3>{meal.name}</h3>
          <p className="meal-item-price">
            {currencyFormatter.format(meal.price)}
          </p>
          <p className="meal-item-description">{meal.description}</p>
        </div>
        <p className="meal-item-actions">
          <Button onClick={handleAddMealToCart}>Add to Cart</Button>
        </p>
      </article>
    </li>
  );
}
