import { useContext } from "react";
import Modal from "./UI/Modal";
import Button from "./UI/Button";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import UserProgressContext from "../store/UserProgressContext";
import CartItem from "./CartItem";

// Component to display the shopping cart
export default function Cart() {
  // Access cart and user progress contexts
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  // Calculate total price of items in cart
  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  // Handlers to close cart and go to checkout
  function handleCloseCart() {
    userProgressCtx.hideCart();
  }

  // Go to checkout
  function handleGoToCheckout() {
    userProgressCtx.showCheckout();
  }

  function handleClearCart() {
    cartCtx.clearCart();
    localStorage.removeItem("cartItems");
  }
  function onIncrease(item) {
    cartCtx.addItem(item);
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const index = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (index >= 0) {
      cartItems[index].quantity += 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
  
function onDecrease(itemId) {
  cartCtx.removeItem(itemId);

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const index = cartItems.findIndex(item => item.id === itemId);

  if (index >= 0) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
    } else {
      cartItems.splice(index, 1); // remove completely
    }
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

  return (
    <Modal
      className="cart"
      open={userProgressCtx.progress === "cart"}
      onClose={userProgressCtx.progress === "cart" ? handleCloseCart : null}
    >
      <h2>Your Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onIncrease={() => onIncrease(item)}
            onDecrease={() => onDecrease(item.id)}
          />
        ))}
      </ul>
      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>
          Close
        </Button>
        <Button textOnly onClick={handleClearCart}>Clear Cart</Button>
        {cartCtx.items.length > 0 && (
          <Button onClick={handleGoToCheckout}>Go to Checkout</Button>
        )}
      </p>
    </Modal>
  );
}
