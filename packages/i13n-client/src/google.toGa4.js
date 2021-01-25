import get from "get-object-value";
import set from "set-object-value";
import callfunc from "call-func";
import { removeEmpty } from "array.merge";

const toGa4 = (config) => {
  const { ecommerce, ...nextConfig } = config || {};
  const viewConfig = { ...nextConfig };
  if (ecommerce) {
    const nextEcommerce = {
      currency: ecommerce.currencyCode,
    };
    [
      {
        bool: ecommerce.impressions,
        prods: ecommerce.impressions,
        action: "view_item_list",
      },
      {
        bool: ecommerce.click,
        prods: ecommerce.click?.products,
        action: "select_item",
      },
      {
        bool: ecommerce.detail,
        prods: ecommerce.detail?.products,
        action: "view_item",
      },
      {
        bool: ecommerce.add,
        prods: ecommerce.add?.products,
        action: "add_to_cart",
      },
      {
        bool: ecommerce.remove,
        prods: ecommerce.remove?.products,
        action: "remove_from_cart",
      },
      {
        bool: ecommerce.checkout,
        prods: ecommerce.checkout?.products,
        action: "begin_checkout",
      },
      {
        bool: ecommerce.purchase,
        prods: ecommerce.purchase?.products,
        action: "purchase",
        callback: ({ nextEcommerce, nextConfig, prods, action, promos }) => {
          const actionField = ecommerce.purchase.actionField;
          nextEcommerce.transaction_id = actionField.id;
          nextEcommerce.affiliation = actionField.affiliation;
          nextEcommerce.value = actionField.revenue;
          nextEcommerce.tax = actionField.tax;
          nextEcommerce.shipping = actionField.shipping;
          nextEcommerce.coupon = actionField.coupon;
        },
      },
      {
        bool: ecommerce.refund,
        prods: ecommerce.refund?.products,
        action: "refund",
      },
      {
        bool: ecommerce.promoView,
        promos: ecommerce.promoView?.promotions,
        action: "view_promotion",
      },
      {
        bool: ecommerce.promoClick,
        promos: ecommerce.promoClick?.promotions,
        action: "select_promotion",
      },
    ].forEach(({ bool, prods, promos, action, callback }) => {
      if (bool) {
        const handlerPayload = {
          nextEcommerce,
          nextConfig,
          prods,
          promos,
          action,
        };
        handleItems(handlerPayload);
        callfunc(callback, handlerPayload);
      }
    });
    nextConfig.ecommerce = removeEmpty(nextEcommerce);
  }
  return { actionConfig: nextConfig, viewConfig };
};

const getOneItem = ({ prod, promo }) => {
  const arrCategory = (prod?.category || "").split("/") || [];
  const item = {
    item_name: prod.name,
    item_id: prod.id,
    price: prod.price,
    item_brand: prod.brand,
    item_category: arrCategory[0]?.trim(),
    item_category2: arrCategory[1]?.trim(),
    item_category3: arrCategory[2]?.trim(),
    item_category4: arrCategory[3]?.trim(),
    item_category5: arrCategory[4]?.trim(),
    item_variant: prod.variant,
    item_list_name: prod.list,
    item_list_id: prod.listId,
    index: prod.position,
    quantity: prod.quantity,

    // promotion
    promotion_name: promo.name,
    promotion_id: promo.id,
    creative_name: promo.creative,
    creative_slot: promo.creativeSlot,
    /**
     * In UA version promo.position more like a string type or a desc of id, so it should compare with GA4 location_id
     * Check the following link.
     * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce
     *
     * The GA4 creative_slot
     * Check the following link.
     * https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#select_promotion_item
     */
    location_id: promo.position,
  };
  return removeEmpty(item);
};

const handleItems = ({ nextEcommerce, nextConfig, action, prods, promos }) => {
  const items = [];
  prods?.forEach((prod) => {
    items.push(getOneItem({ prod }));
  });
  promos?.forEach((prod) => {
    items.push(getOneItem({ promo }));
  });
  nextEcommerce.items = items;
  nextConfig.action = action;
};

export default toGa4;
