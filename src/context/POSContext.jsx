// src/context/POSContext.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { POSContext } from "./createPOSContext";
import { DEFAULT_MENU, SETTINGS } from "../data/menuData";

const ORDER_NO_KEY = "pos_order_number";
const ORDER_DATE_KEY = "pos_order_date";
const TX_KEY = "transactions";
const CUSTOM_MENU_KEY = "pos_custom_menu_items";
const DELETED_ITEM_IDS_KEY = "pos_deleted_item_ids";

const getTodayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const safeParseArray = (value, fallback = []) => {
  try {
    const parsed = value ? JSON.parse(value) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const deepCloneMenu = (menuObj) => {
  const cloned = {};
  Object.entries(menuObj || {}).forEach(([cat, arr]) => {
    cloned[cat] = Array.isArray(arr) ? arr.map((x) => ({ ...x })) : [];
  });
  return cloned;
};

export const POSProvider = ({ children }) => {
  // ---------------------------
  // Menu init: DEFAULT + custom overrides - deleted ids removed
  // ---------------------------
  const [menu, setMenu] = useState(() => {
    const deletedIds = safeParseArray(localStorage.getItem(DELETED_ITEM_IDS_KEY), []);
    const storedCustom = localStorage.getItem(CUSTOM_MENU_KEY);
    const customItems = safeParseArray(storedCustom, []);

    const merged = deepCloneMenu(DEFAULT_MENU);

    const removeIdEverywhere = (id) => {
      Object.keys(merged).forEach((cat) => {
        merged[cat] = (merged[cat] || []).filter((it) => it.id !== id);
      });
    };

    // apply custom items
    customItems.forEach((item) => {
      if (!item?.id) return;
      if (deletedIds.includes(item.id)) return;

      removeIdEverywhere(item.id);

      if (!merged[item.category]) merged[item.category] = [];
      merged[item.category].push(item);
    });

    // remove deleted ids from DEFAULT too
    Object.keys(merged).forEach((cat) => {
      merged[cat] = (merged[cat] || []).filter((it) => !deletedIds.includes(it.id));
    });

    // cleanup empty custom categories
    Object.keys(merged).forEach((cat) => {
      if (!DEFAULT_MENU[cat] && (merged[cat] || []).length === 0) {
        delete merged[cat];
      }
    });

    return merged;
  });

  const [currentOrder, setCurrentOrder] = useState([]);
  const [activeCategory, setActiveCategory] = useState("subs");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);

  // ---------------------------
  // ✅ Daily-reset Order Number
  // ---------------------------
  const [orderNumber, setOrderNumber] = useState(() => {
    const today = getTodayKey();
    const savedDate = localStorage.getItem(ORDER_DATE_KEY);
    const savedOrder = Number(localStorage.getItem(ORDER_NO_KEY));

    if (savedDate === today && Number.isFinite(savedOrder) && savedOrder > 0) {
      return savedOrder;
    }

    localStorage.setItem(ORDER_DATE_KEY, today);
    localStorage.setItem(ORDER_NO_KEY, "1");
    return 1;
  });

  useEffect(() => {
    localStorage.setItem(ORDER_NO_KEY, String(orderNumber));
  }, [orderNumber]);

  // also handle "new day" while app is open
  useEffect(() => {
    const interval = setInterval(() => {
      const today = getTodayKey();
      const savedDate = localStorage.getItem(ORDER_DATE_KEY);

      if (savedDate !== today) {
        localStorage.setItem(ORDER_DATE_KEY, today);
        localStorage.setItem(ORDER_NO_KEY, "1");
        setOrderNumber(1);
      }
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------------------------
  // Deleted IDs helpers (permanent delete) - ✅ memoized for lint
  // ---------------------------
  const getDeletedIds = useCallback(() => {
    return safeParseArray(localStorage.getItem(DELETED_ITEM_IDS_KEY), []);
  }, []);

  const addDeletedId = useCallback(
    (id) => {
      if (!id) return;
      const ids = getDeletedIds();
      if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(DELETED_ITEM_IDS_KEY, JSON.stringify(ids));
      }
    },
    [getDeletedIds]
  );

  const removeDeletedId = useCallback(
    (id) => {
      const ids = getDeletedIds().filter((x) => x !== id);
      localStorage.setItem(DELETED_ITEM_IDS_KEY, JSON.stringify(ids));
    },
    [getDeletedIds]
  );

  // ---------------------------
  // Menu Management Functions
  // ---------------------------
  const addMenuItem = useCallback(
    (newItem) => {
      setMenu((prev) => {
        const updated = deepCloneMenu(prev);

        // if it was deleted before, undelete it
        removeDeletedId(newItem.id);

        // remove id from all categories (avoid duplicates / category moves)
        Object.keys(updated).forEach((cat) => {
          updated[cat] = (updated[cat] || []).filter((it) => it.id !== newItem.id);
        });

        if (!updated[newItem.category]) updated[newItem.category] = [];
        updated[newItem.category].push(newItem);

        // save to localStorage (custom items)
        const customItems = safeParseArray(localStorage.getItem(CUSTOM_MENU_KEY), []);
        const filtered = customItems.filter((it) => it.id !== newItem.id);
        filtered.push(newItem);
        localStorage.setItem(CUSTOM_MENU_KEY, JSON.stringify(filtered));

        return updated;
      });
    },
    [removeDeletedId]
  );

  const updateMenuItem = useCallback(
    (updatedItem, originalCategory) => {
      setMenu((prev) => {
        const next = deepCloneMenu(prev);

        removeDeletedId(updatedItem.id);

        // remove from ALL categories
        Object.keys(next).forEach((cat) => {
          next[cat] = (next[cat] || []).filter((it) => it.id !== updatedItem.id);
        });

        // add to new category
        if (!next[updatedItem.category]) next[updatedItem.category] = [];
        next[updatedItem.category].push(updatedItem);

        // remove empty custom category
        if (
          originalCategory &&
          next[originalCategory] &&
          next[originalCategory].length === 0 &&
          !DEFAULT_MENU[originalCategory]
        ) {
          delete next[originalCategory];
        }

        // persist
        const customItems = safeParseArray(localStorage.getItem(CUSTOM_MENU_KEY), []);
        const filtered = customItems.filter((it) => it.id !== updatedItem.id);
        filtered.push(updatedItem);
        localStorage.setItem(CUSTOM_MENU_KEY, JSON.stringify(filtered));

        return next;
      });
    },
    [removeDeletedId]
  );

  const deleteMenuItem = useCallback(
    (itemId, category) => {
      setMenu((prev) => {
        const updated = deepCloneMenu(prev);

        // remove from menu
        if (updated[category]) {
          updated[category] = updated[category].filter((it) => it.id !== itemId);

          // remove empty custom category
          if (updated[category].length === 0 && !DEFAULT_MENU[category]) {
            delete updated[category];
          }
        }

        // mark as deleted permanently
        addDeletedId(itemId);

        // remove from custom storage too
        const customItems = safeParseArray(localStorage.getItem(CUSTOM_MENU_KEY), []);
        const nextCustom = customItems.filter((it) => it.id !== itemId);
        localStorage.setItem(CUSTOM_MENU_KEY, JSON.stringify(nextCustom));

        return updated;
      });

      // if active category became empty, switch
      if (menu[category]?.length === 1 && activeCategory === category) {
        const cats = Object.keys(menu).filter((c) => (menu[c] || []).length > 0);
        if (cats.length > 0) setActiveCategory(cats[0]);
      }

      return true;
    },
    [menu, activeCategory, addDeletedId]
  );

  const deleteCategory = useCallback(
    (category) => {
      if (DEFAULT_MENU[category]) {
        alert("Cannot delete default categories");
        return false;
      }

      setMenu((prev) => {
        const updated = deepCloneMenu(prev);
        const itemsToDelete = updated[category] || [];

        // mark all item ids as deleted permanently
        itemsToDelete.forEach((it) => addDeletedId(it.id));

        delete updated[category];

        // remove these from custom storage
        const customItems = safeParseArray(localStorage.getItem(CUSTOM_MENU_KEY), []);
        const idsToDelete = new Set(itemsToDelete.map((it) => it.id));
        const nextCustom = customItems.filter((it) => !idsToDelete.has(it.id));
        localStorage.setItem(CUSTOM_MENU_KEY, JSON.stringify(nextCustom));

        return updated;
      });

      if (activeCategory === category) {
        const categories = Object.keys(menu).filter(
          (cat) => cat !== category && (menu[cat] || []).length > 0
        );
        if (categories.length > 0) setActiveCategory(categories[0]);
      }

      return true;
    },
    [menu, activeCategory, addDeletedId]
  );

  // ---------------------------
  // helpers
  // ---------------------------
  const normalizeModifiers = useCallback((modifiers = []) => {
    return (modifiers || [])
      .map((g) => ({
        groupId: g.groupId,
        groupTitle: g.groupTitle,
        options: (g.options || [])
          .map((o) => ({ id: o.id, name: o.name, price: Number(o.price || 0) }))
          .sort((a, b) => String(a.id).localeCompare(String(b.id))),
      }))
      .sort((a, b) => String(a.groupId).localeCompare(String(b.groupId)));
  }, []);

  const calcModifiersTotal = useCallback((mods = []) => {
    return (mods || []).reduce((sum, g) => {
      const groupSum = (g.options || []).reduce((s, opt) => s + Number(opt.price || 0), 0);
      return sum + groupSum;
    }, 0);
  }, []);

  const buildSignature = useCallback(({ id, size, modifiers }) => {
    return JSON.stringify({
      id,
      size: size || null,
      mods: (modifiers || []).map((g) => ({
        groupId: g.groupId,
        optionIds: (g.options || []).map((o) => o.id),
      })),
    });
  }, []);

  const toReceiptItems = useCallback((itemsCents = []) => {
    return (itemsCents || []).map((it) => ({
      ...it,
      price: Number(it.price || 0) / 100,
      basePrice: Number(it.basePrice || 0) / 100,
      modifiersTotal: Number(it.modifiersTotal || 0) / 100,
      finalUnitPrice: Number(it.finalUnitPrice || 0) / 100,
    }));
  }, []);

  const computeTotals = useCallback((itemsDollars = [], pctDiscount = 0) => {
    const subtotal = (itemsDollars || []).reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
      0
    );

    const tax = subtotal * SETTINGS.taxRate;
    const discountAmount = (subtotal * (pctDiscount || 0)) / 100;
    const total = subtotal + tax - discountAmount;

    const totalQty = (itemsDollars || []).reduce((sum, it) => sum + (it.quantity || 0), 0);

    return { subtotal, tax, discountAmount, total, totalQty };
  }, []);

  const persistTransaction = useCallback((tx) => {
    const transactions = safeParseArray(localStorage.getItem(TX_KEY), []);
    transactions.push(tx);
    localStorage.setItem(TX_KEY, JSON.stringify(transactions));
  }, []);

  // ---------------------------
  // actions
  // ---------------------------
  const addToOrder = useCallback(
    (item, size = null, modifiers = []) => {
      const basePrice = item.prices
        ? size
          ? Number(item.prices[size] || 0)
          : Number(Object.values(item.prices)[0] || 0)
        : Number(item.price || 0);

      const normalizedMods = normalizeModifiers(modifiers);
      const modifiersTotal = calcModifiersTotal(normalizedMods);
      const finalUnitPrice = basePrice + modifiersTotal;

      const signature = buildSignature({
        id: item.id,
        size,
        modifiers: normalizedMods,
      });

      setCurrentOrder((prev) => {
        const existingIndex = prev.findIndex((i) => i.signature === signature);

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
          };
          return updated;
        }

        const orderItem = {
          ...item,
          size: size || null,
          basePrice,
          modifiers: normalizedMods,
          modifiersTotal,
          finalUnitPrice,
          price: finalUnitPrice, // ✅ cents
          quantity: 1,
          orderId: `${item.id}-${size || "nosizes"}-${Date.now()}`,
          signature,
        };

        return [...prev, orderItem];
      });
    },
    [buildSignature, calcModifiersTotal, normalizeModifiers]
  );

  const removeFromOrder = useCallback((orderId) => {
    setCurrentOrder((prev) => prev.filter((item) => item.orderId !== orderId));
  }, []);

  const updateQuantity = useCallback(
    (orderId, newQuantity) => {
      const qty = Number(newQuantity || 0);
      if (qty <= 0) {
        removeFromOrder(orderId);
        return;
      }

      setCurrentOrder((prev) =>
        prev.map((item) => (item.orderId === orderId ? { ...item, quantity: qty } : item))
      );
    },
    [removeFromOrder]
  );

  const clearOrder = useCallback(() => {
    setCurrentOrder([]);
    setDiscount(0);
  }, []);

  // ✅ FULL payment
  const completePayment = useCallback(() => {
    const itemsForReceipt = toReceiptItems(currentOrder);
    const { subtotal, tax, discountAmount, total, totalQty } = computeTotals(itemsForReceipt, discount);

    const transaction = {
      id: `ORD-${orderNumber}`,
      orderNumber,
      items: itemsForReceipt,
      paymentMethod,
      discount,
      subtotal,
      tax,
      discountAmount,
      total,
      totalQty,
      timestamp: Date.now(),
      timestampISO: new Date().toISOString(),
      type: "full",
    };

    persistTransaction(transaction);

    setOrderNumber((prev) => prev + 1);
    clearOrder();
    return transaction;
  }, [
    orderNumber,
    currentOrder,
    paymentMethod,
    discount,
    clearOrder,
    toReceiptItems,
    computeTotals,
    persistTransaction,
  ]);

  // ✅ PARTIAL payment (Split by Item)
  const completePartialPayment = useCallback(
    (selectedOrderIds = []) => {
      const ids = new Set(selectedOrderIds || []);
      if (ids.size === 0) return null;

      const selectedCents = (currentOrder || []).filter((it) => ids.has(it.orderId));
      if (selectedCents.length === 0) return null;

      const itemsForReceipt = toReceiptItems(selectedCents);

      // Best practice for MVP:
      // Do NOT apply global % discount to split bills until proportional discount is implemented
      const splitDiscount = 0;

      const { subtotal, tax, discountAmount, total, totalQty } = computeTotals(
        itemsForReceipt,
        splitDiscount
      );

      const transaction = {
        id: `ORD-${orderNumber}-SPLIT-${Date.now()}`,
        orderNumber,
        items: itemsForReceipt,
        paymentMethod,
        discount: splitDiscount,
        subtotal,
        tax,
        discountAmount,
        total,
        totalQty,
        timestamp: Date.now(),
        timestampISO: new Date().toISOString(),
        type: "split",
        split: { paidOrderIds: Array.from(ids) },
      };

      persistTransaction(transaction);

      // remove only paid items from cart
      setCurrentOrder((prev) => {
        const remaining = (prev || []).filter((it) => !ids.has(it.orderId));

        // if everything is paid, move to next order number + reset discount
        if (remaining.length === 0) {
          setDiscount(0);
          setOrderNumber((n) => n + 1);
        }

        return remaining;
      });

      return transaction;
    },
    [currentOrder, orderNumber, paymentMethod, toReceiptItems, computeTotals, persistTransaction]
  );

  const getFilteredItems = useCallback(() => {
    let items = menu[activeCategory] || [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(q));
    }

    return items;
  }, [activeCategory, menu, searchQuery]);

  const value = useMemo(
    () => ({
      menu,
      currentOrder,
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery,
      paymentMethod,
      setPaymentMethod,
      discount,
      setDiscount,
      orderNumber,
      addToOrder,
      updateQuantity,
      removeFromOrder,
      clearOrder,
      completePayment,
      completePartialPayment,
      getFilteredItems,

      // menu mgmt
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      deleteCategory,
    }),
    [
      menu,
      currentOrder,
      activeCategory,
      searchQuery,
      paymentMethod,
      discount,
      orderNumber,
      addToOrder,
      updateQuantity,
      removeFromOrder,
      clearOrder,
      completePayment,
      completePartialPayment,
      getFilteredItems,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      deleteCategory,
    ]
  );

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
};
