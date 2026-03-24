import { createContext, useReducer, useEffect } from "react";

// Create Cart Context
const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

// Reducer function to manage cart state
function cartReducer(state, action) {
  // Handle different action types
  // Add item to cart
  if (action.type === "ADD_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id,
    ); // Check if item already exists in cart

    const updatedItems = [...state.items];

    // If item already exists, update quantity
    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    } // Add new item to cart
    return { ...state, items: updatedItems };
  }

  // Remove item from cart
  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id,
    ); // Find item in cart

    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    // If item quantity is 1, remove it from cart
    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      }; // Decrease item quantity by 1
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return { ...state, items: updatedItems };
  }

  // Clear the cart
  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state;
}

// Cart Context Provider component
export function CartContextProvider({ children }) {
  // Initialize cart state from localStorage
  const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  // Use useReducer to manage cart state
  const [cart, dispatchCartAction] = useReducer(cartReducer, {
    items: storedItems,
  });

  // Sync cart state with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart.items));
  }, [cart.items]);

  // Functions to dispatch actions to the reducer
  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item });
  }
  // Remove item from cart
  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id });
  }
  // Clear the cart
  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });
  }
  // Context value to be provided to consumers
  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
