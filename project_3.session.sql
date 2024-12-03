-- SELECT * 
-- FROM payments
-- ORDER BY payment_id DESC
-- LIMIT 1;

-- SELECT *
-- FROM orders
-- ORDER BY order_id DESC
-- LIMIT 1;

SELECT *
FROM menu_item_order_jt
WHERE order_id = (SELECT MAX(order_id) FROM orders);

-- SELECT * FROM menu_item;

-- SELECT * FROM staff;

-- SELECT * FROM orders ORDER BY order_id DESC LIMIT 200;

-- Update Regular items to $8.50

-- SELECT * FROM menu_item;