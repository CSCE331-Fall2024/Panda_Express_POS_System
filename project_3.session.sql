-- SELECT * 
-- FROM payments
-- ORDER BY payment_id DESC
-- LIMIT 1;

-- SELECT *
-- FROM orders
-- ORDER BY order_id DESC
-- LIMIT 1;

-- SELECT *
-- FROM menu_item_order_jt
-- WHERE order_id = (SELECT MAX(order_id) FROM orders);

-- SELECT * FROM menu_item;

-- SELECT * FROM staff;

-- SELECT * FROM orders ORDER BY order_id DESC LIMIT 200;

SELECT 
    EXTRACT(HOUR FROM payment_time) AS hour,
    COUNT(payment_id) AS total_transactions,
    SUM(payment_amount) AS total_sales, 
    SUM(CASE WHEN payment_type = 'TAMU_ID' THEN payment_amount ELSE 0 END) AS tamu_id_sales,
    SUM(CASE WHEN payment_type = 'Credit Card' THEN payment_amount ELSE 0 END) AS credit_card_sales
FROM payments
WHERE DATE(payment_time) = '2023-09-21'
GROUP BY hour
ORDER BY hour;