// src/data/modifiersData.js

// Modifier groups per category (you can expand later)
export const MODIFIERS_BY_CATEGORY = {
  coffee: [
    {
      id: "drink_toppings",
      title: "Drink Toppings",
      required: false,
      maxSelect: 10,
      options: [
        { id: "boba", name: "Boba", price: 60 },
        { id: "jelly", name: "Jelly", price: 50 },
        { id: "popping_pearls", name: "Popping Pearls", price: 80 },
      ],
    },
  ],

  pizza: [
    {
      id: "pizza_extras",
      title: "Extras",
      required: false,
      maxSelect: 10,
      options: [
        { id: "extra_cheese", name: "Extra Cheese", price: 150 },
        { id: "olives", name: "Olives", price: 120 },
        { id: "jalapeno", name: "Jalapeño", price: 100 },
      ],
    },
  ],

  burger: [
    {
      id: "burger_extras",
      title: "Extras",
      required: false,
      maxSelect: 10,
      options: [
        { id: "cheese_slice", name: "Cheese Slice", price: 80 },
        { id: "extra_patty", name: "Extra Patty", price: 250 },
        { id: "fries", name: "Add Fries", price: 200 },
      ],
    },
  ],

  momo: [
    {
      id: "momo_addons",
      title: "Add-ons",
      required: false,
      maxSelect: 10,
      options: [
        { id: "spicy_sauce", name: "Spicy Sauce", price: 50 },
        { id: "mayo_dip", name: "Mayo Dip", price: 60 },
      ],
    },
  ],
};

// fallback if category not found
export const getModifiersForCategory = (categoryId) => {
  return MODIFIERS_BY_CATEGORY[categoryId] || [];
};
