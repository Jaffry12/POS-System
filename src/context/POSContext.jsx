// src/contexts/POSContext.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { POSContext } from "./createPOSContext";
import { DEFAULT_MENU, SETTINGS } from "../data/menuData";

const ORDER_NO_KEY = "pos_weekly_order_number";
const ORDER_WEEK_KEY = "pos_order_week_key";
const TX_KEY = "transactions";
const CUSTOM_MENU_KEY = "pos_custom_menu_items";
const DELETED_ITEM_IDS_KEY = "pos_deleted_item_ids";
const TX_SEQ_KEY = "pos_tx_seq";
const HELD_ORDERS_KEY = "pos_held_orders";

// ✅ Week key that changes on SUNDAY (week starts Sunday)
const getWeekKey = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();

  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  start.setDate(d.getDate() - d.getDay());

  const firstSunday = new Date(year, 0, 1);
  firstSunday.setHours(0, 0, 0, 0);
  firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());

  const weekNo = Math.floor((start - firstSunday) / 86400000 / 7) + 1;
  const pad = String(weekNo).padStart(2, "0");

  return `${year}-WS${pad}`;
};

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

    customItems.forEach((item) => {
      if (!item?.id) return;
      if (deletedIds.includes(item.id)) return;

      removeIdEverywhere(item.id);

      if (!merged[item.category]) merged[item.category] = [];
      merged[item.category].push(item);
    });

    Object.keys(merged).forEach((cat) => {
      merged[cat] = (merged[cat] || []).filter((it) => !deletedIds.includes(it.id));
    });

    Object.keys(merged).forEach((cat) => {
      if (!DEFAULT_MENU[cat] && (merged[cat] || []).length === 0) {
        delete merged[cat];
      }
    });

    return merged;
  });

  const [currentOrder, setCurrentOrder] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);

  const [heldOrders, setHeldOrders] = useState(() => {
    return safeParseArray(localStorage.getItem(HELD_ORDERS_KEY), []);
  });

  useEffect(() => {
    try {
      localStorage.setItem(HELD_ORDERS_KEY, JSON.stringify(heldOrders));
    } catch (error) {
      console.error("Failed to save held orders:", error);
    }
  }, [heldOrders]);

  const [orderNumber, setOrderNumber] = useState(() => {
    const weekKey = getWeekKey();
    const savedWeek = localStorage.getItem(ORDER_WEEK_KEY);
    const savedOrder = Number(localStorage.getItem(ORDER_NO_KEY));

    if (savedWeek === weekKey && Number.isFinite(savedOrder) && savedOrder > 0) {
      return savedOrder;
    }

    localStorage.setItem(ORDER_WEEK_KEY, weekKey);
    localStorage.setItem(ORDER_NO_KEY, "1");
    return 1;
  });

  const [txSeq, setTxSeq] = useState(() => {
    const saved = Number(localStorage.getItem(TX_SEQ_KEY));
    if (Number.isFinite(saved) && saved > 0) return saved;
    localStorage.setItem(TX_SEQ_KEY, "1");
    return 1;
  });

  useEffect(() => {
    localStorage.setItem(TX_SEQ_KEY, String(txSeq));
  }, [txSeq]);

  useEffect(() => {
    localStorage.setItem(ORDER_NO_KEY, String(orderNumber));
  }, [orderNumber]);

  useEffect(() => {
    const interval = setInterval(() => {
      const wk = getWeekKey();
      const savedWeek = localStorage.getItem(ORDER_WEEK_KEY);

      if (savedWeek !== wk) {
        localStorage.setItem(ORDER_WEEK_KEY, wk);
        localStorage.setItem(ORDER_NO_KEY, "1");
        setOrderNumber(1);
      }
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

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

  const addMenuItem = useCallback(
    (newItem) => {
      setMenu((prev) => {
        const updated = deepCloneMenu(prev);

        removeDeletedId(newItem.id);

        Object.keys(updated).forEach((cat) => {
          updated[cat] = (updated[cat] || []).filter((it) => it.id !== newItem.id);
        });

        if (!updated[newItem.category]) updated[newItem.category] = [];
        updated[newItem.category].push(newItem);

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

        Object.keys(next).forEach((cat) => {
          next[cat] = (next[cat] || []).filter((it) => it.id !== updatedItem.id);
        });

        if (!next[updatedItem.category]) next[updatedItem.category] = [];
        next[updatedItem.category].push(updatedItem);

        if (
          originalCategory &&
          next[originalCategory] &&
          next[originalCategory].length === 0 &&
          !DEFAULT_MENU[originalCategory]
        ) {
          delete next[originalCategory];
        }

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

        if (updated[category]) {
          updated[category] = updated[category].filter((it) => it.id !== itemId);

          if (updated[category].length === 0 && !DEFAULT_MENU[category]) {
            delete updated[category];
          }
        }

        addDeletedId(itemId);

        const customItems = safeParseArray(localStorage.getItem(CUSTOM_MENU_KEY), []);
        const nextCustom = customItems.filter((it) => it.id !== itemId);
        localStorage.setItem(CUSTOM_MENU_KEY, JSON.stringify(nextCustom));

        return updated;
      });

      if (menu[category]?.length === 1 && activeCategory === category) {
        const cats = Object.keys(menu).filter((c) => (menu[c] || []).length > 0);
        if (cats.length > 0) setActiveCategory(cats[0]);
        else setActiveCategory("");
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

        itemsToDelete.forEach((it) => addDeletedId(it.id));

        delete updated[category];

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
        else setActiveCategory("");
      }

      return true;
    },
    [menu, activeCategory, addDeletedId]
  );

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
          price: finalUnitPrice,
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

  // ✅ FIXED: Accept optional payment method parameter
  const completePayment = useCallback((overridePaymentMethod = null) => {
    const itemsForReceipt = toReceiptItems(currentOrder);
    const { subtotal, tax, discountAmount, total, totalQty } = computeTotals(itemsForReceipt, discount);

    const dateKey = new Date().toISOString().slice(0, 10);

    // ✅ Use the passed payment method if provided, otherwise use state
    const actualPaymentMethod = overridePaymentMethod || paymentMethod;
    
    console.log("💰 completePayment called with:", {
      overridePaymentMethod,
      statePaymentMethod: paymentMethod,
      actualPaymentMethod
    });

    const transaction = {
      id: `ORD-${dateKey}-${txSeq}`,
      txSeq,
      orderNumber,
      items: itemsForReceipt,
      paymentMethod: actualPaymentMethod, // ✅ Use actualPaymentMethod
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

    setTxSeq((prev) => prev + 1);
    setOrderNumber((prev) => prev + 1);
    clearOrder();

    return transaction;
  }, [
    txSeq,
    orderNumber,
    currentOrder,
    paymentMethod,
    discount,
    clearOrder,
    toReceiptItems,
    computeTotals,
    persistTransaction,
  ]);

  // ✅ FIXED: Accept optional payment method parameter as second argument
  const completePartialPayment = useCallback(
    (selectedOrderIds = [], overridePaymentMethod = null) => {
      const ids = new Set(selectedOrderIds || []);
      if (ids.size === 0) return null;

      const selectedCents = (currentOrder || []).filter((it) => ids.has(it.orderId));
      if (selectedCents.length === 0) return null;

      const itemsForReceipt = toReceiptItems(selectedCents);

      const splitDiscount = 0;

      const { subtotal, tax, discountAmount, total, totalQty } = computeTotals(
        itemsForReceipt,
        splitDiscount
      );

      const dateKey = new Date().toISOString().slice(0, 10);

      // ✅ Use the passed payment method if provided, otherwise use state
      const actualPaymentMethod = overridePaymentMethod || paymentMethod;
      
      console.log("💰 completePartialPayment called with:", {
        overridePaymentMethod,
        statePaymentMethod: paymentMethod,
        actualPaymentMethod
      });

      const transaction = {
        id: `ORD-${dateKey}-${txSeq}-SPLIT`,
        txSeq,
        orderNumber,
        items: itemsForReceipt,
        paymentMethod: actualPaymentMethod, // ✅ Use actualPaymentMethod
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

      setTxSeq((prev) => prev + 1);

      setCurrentOrder((prev) => {
        const remaining = (prev || []).filter((it) => !ids.has(it.orderId));

        if (remaining.length === 0) {
          setDiscount(0);
          setOrderNumber((n) => n + 1);
        }

        return remaining;
      });

      return transaction;
    },
    [
      txSeq,
      currentOrder,
      orderNumber,
      paymentMethod,
      toReceiptItems,
      computeTotals,
      persistTransaction,
    ]
  );

  // ✅ Updated: No staff name prompt, auto-generate hold ID
  const holdOrder = useCallback(() => {
    if (!currentOrder || currentOrder.length === 0) {
      return null;
    }

    const holdId = `HOLD-${Date.now()}`;
    const heldOrder = {
      id: holdId,
      items: [...currentOrder],
      discount: discount,
      paymentMethod: paymentMethod,
      timestamp: Date.now(),
      orderNumber: orderNumber,
    };

    setHeldOrders((prev) => [...prev, heldOrder]);
    clearOrder();

    return heldOrder;
  }, [currentOrder, discount, paymentMethod, orderNumber, clearOrder]);

  const unholdOrder = useCallback((holdId) => {
    setHeldOrders((prev) => {
      const order = prev.find((o) => o.id === holdId);
      if (!order) return prev;

      setCurrentOrder(order.items);
      setDiscount(order.discount);
      setPaymentMethod(order.paymentMethod);

      return prev.filter((o) => o.id !== holdId);
    });
  }, []);

  const deleteHeldOrder = useCallback((holdId) => {
    setHeldOrders((prev) => prev.filter((o) => o.id !== holdId));
  }, []);

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
      txSeq,
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

      heldOrders,
      holdOrder,
      unholdOrder,
      deleteHeldOrder,
    }),
    [
      menu,
      currentOrder,
      activeCategory,
      searchQuery,
      paymentMethod,
      discount,
      orderNumber,
      txSeq,
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
      heldOrders,
      holdOrder,
      unholdOrder,
      deleteHeldOrder,
    ]
  );

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
};