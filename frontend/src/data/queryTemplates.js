export const queryTemplates = {
  PostgreSQL: {
    slowJoin: [
      `SELECT o.id, o.total_amount, c.name, p.payment_status FROM orders o JOIN customers c ON o.customer_id = c.id JOIN payments p ON o.id = p.order_id WHERE EXTRACT(YEAR FROM o.created_at) = 2025 ORDER BY o.created_at DESC;`,
      `SELECT p.name AS product_name, c.category_name, s.supplier_name, i.stock_quantity FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN suppliers s ON p.supplier_id = s.id LEFT JOIN inventory i ON p.id = i.product_id WHERE p.is_active = true ORDER BY p.created_at DESC;`,
      `SELECT e.first_name, e.last_name, d.department_name, l.city, l.country FROM employees e JOIN departments d ON e.department_id = d.id JOIN locations l ON d.location_id = l.id WHERE d.is_active = true ORDER BY e.hire_date;`,
      `SELECT t.ticket_id, u.username, a.agent_name, s.status_name FROM support_tickets t INNER JOIN users u ON t.reporter_id = u.id LEFT JOIN support_agents a ON t.assignee_id = a.id INNER JOIN ticket_statuses s ON t.status_id = s.id WHERE t.created_at > '2024-06-01'::timestamp ORDER BY t.priority DESC;`,
      `SELECT inv.invoice_number, cli.company_name, pay.amount_paid, pay.payment_date, ref.reference_code FROM invoices inv JOIN clients cli ON inv.client_id = cli.id LEFT JOIN payments pay ON inv.id = pay.invoice_id LEFT JOIN payment_references ref ON pay.id = ref.payment_id WHERE inv.due_date < CURRENT_DATE AND inv.status = 'unpaid';`,
      `SELECT v.video_title, c.channel_name, s.sponsor_name, a.ad_revenue FROM videos v JOIN channels c ON v.channel_id = c.id LEFT JOIN video_sponsors vs ON v.id = vs.video_id LEFT JOIN sponsors s ON vs.sponsor_id = s.id LEFT JOIN analytics a ON v.id = a.video_id WHERE v.views > 1000000;`
    ],
    subquery: [
      `SELECT u.id, u.name, (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count FROM users u WHERE u.status = 'active';`,
      `SELECT p.id, p.name, p.price, (SELECT AVG(price) FROM products WHERE category_id = p.category_id) as avg_category_price FROM products p WHERE p.price > 100;`,
      `SELECT c.customer_name, c.email FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.total_amount > 5000);`,
      `SELECT emp.name, emp.salary FROM employees emp WHERE emp.salary > (SELECT AVG(salary) FROM employees WHERE department_id = emp.department_id);`,
      `SELECT d.department_name FROM departments d WHERE d.id NOT IN (SELECT DISTINCT department_id FROM employees WHERE hire_date > '2023-01-01');`,
      `SELECT t.team_name, (SELECT SUM(score) FROM matches m WHERE m.team_id = t.id AND m.season_year = 2024) AS total_score FROM teams t ORDER BY total_score DESC;`
    ],
    fullScan: [
      `SELECT * FROM customers WHERE LOWER(email) = 'john@example.com' AND EXTRACT(YEAR FROM created_at) = 2025;`,
      `SELECT * FROM user_logs WHERE action_type ILIKE '%login%' AND created_at >= '2024-01-01 00:00:00'::timestamp;`,
      `SELECT id, name, status, last_login FROM accounts WHERE status != 'deleted' ORDER BY last_login DESC;`,
      `SELECT * FROM product_reviews WHERE UPPER(review_text) ILIKE '%EXCELLENT%' OR rating = 5;`,
      `SELECT id, username, ip_address FROM session_history WHERE login_time::date = '2023-12-25';`,
      `SELECT * FROM transactions WHERE amount / 100 > 50 AND currency = 'USD';`
    ]
  },
  MySQL: {
    slowJoin: [
      `SELECT pt.patient_name, dr.doctor_name, appt.appointment_date, d.diagnosis_code FROM appointments appt JOIN patients pt ON appt.patient_id = pt.id JOIN doctors dr ON appt.doctor_id = dr.id LEFT JOIN diagnoses d ON appt.id = d.appointment_id WHERE YEAR(appt.appointment_date) = 2025 ORDER BY appt.appointment_date DESC;`,
      `SELECT sh.shipment_id, r.route_name, v.vehicle_type, d.driver_name FROM shipments sh LEFT JOIN routes r ON sh.route_id = r.id LEFT JOIN vehicles v ON sh.vehicle_id = v.id LEFT JOIN drivers d ON v.driver_id = d.id WHERE sh.status = 'IN_TRANSIT' ORDER BY sh.expected_delivery ASC;`,
      `SELECT prop.address, prop.price, a.agent_name, o.office_city FROM properties prop JOIN agents a ON prop.agent_id = a.id JOIN offices o ON a.office_id = o.id WHERE prop.is_sold = 0 ORDER BY prop.list_date;`,
      `SELECT crs.course_name, prof.last_name, dep.department_name, r.room_number FROM courses crs INNER JOIN professors prof ON crs.professor_id = prof.id LEFT JOIN departments dep ON prof.department_id = dep.id INNER JOIN rooms r ON crs.room_id = r.id WHERE crs.semester = 'Fall_2024' ORDER BY crs.credits DESC;`,
      `SELECT fl.flight_number, al.airline_name, a_dep.airport_code AS origin, a_arr.airport_code AS dest FROM flights fl JOIN airlines al ON fl.airline_id = al.id LEFT JOIN airports a_dep ON fl.origin_id = a_dep.id LEFT JOIN airports a_arr ON fl.destination_id = a_arr.id WHERE fl.departure_time < CURDATE() AND fl.status = 'Delayed';`,
      `SELECT g.game_title, p.publisher_name, d.developer_name, r.review_score FROM games g JOIN publishers p ON g.publisher_id = p.id LEFT JOIN game_developers gd ON g.id = gd.game_id LEFT JOIN developers d ON gd.developer_id = d.id LEFT JOIN reviews r ON g.id = r.game_id WHERE g.copies_sold > 500000;`
    ],
    subquery: [
      `SELECT pt.id, pt.patient_name, (SELECT COUNT(*) FROM visits v WHERE v.patient_id = pt.id) AS visit_count FROM patients pt WHERE pt.status = 'admitted';`,
      `SELECT m.id, m.movie_title, m.budget, (SELECT AVG(budget) FROM movies WHERE genre_id = m.genre_id) as avg_genre_budget FROM movies m WHERE m.budget > 100000000;`,
      `SELECT s.student_name, s.email FROM students s WHERE EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id = s.id AND e.grade = 'A+');`,
      `SELECT dr.doctor_name, dr.surgery_count FROM doctors dr WHERE dr.surgery_count > (SELECT AVG(surgery_count) FROM doctors WHERE hospital_id = dr.hospital_id);`,
      `SELECT b.branch_name FROM branches b WHERE b.id NOT IN (SELECT DISTINCT branch_id FROM staff WHERE hire_date > '2023-01-01');`,
      `SELECT c.campaign_name, (SELECT SUM(clicks) FROM ads a WHERE a.campaign_id = c.id AND a.year = 2024) AS total_clicks FROM campaigns c ORDER BY total_clicks DESC;`
    ],
    fullScan: [
      `SELECT * FROM users_medical_records WHERE LOWER(blood_type) = 'o-' AND YEAR(last_checkup) = 2025;`,
      `SELECT * FROM server_logs WHERE error_message LIKE '%timeout%' AND created_at >= '2024-01-01 00:00:00';`,
      `SELECT id, name, status, last_maintenance FROM vehicles WHERE status != 'scrapped' ORDER BY last_maintenance DESC;`,
      `SELECT * FROM hotel_reviews WHERE UPPER(comments) LIKE '%TERRIBLE%' OR rating = 1;`,
      `SELECT id, username, ip_address FROM login_attempts WHERE DATE(attempt_time) = '2023-12-25';`,
      `SELECT * FROM wire_transfers WHERE amount_cents / 100 > 10000 AND currency = 'EUR';`
    ]
  },
  SQLite: {
    slowJoin: [
      `SELECT s.sensor_id, s.type, r.reading_value, l.location_name FROM sensors s JOIN readings r ON s.id = r.sensor_id JOIN locations l ON s.location_id = l.id WHERE strftime('%Y', r.timestamp) = '2025' ORDER BY r.timestamp DESC;`,
      `SELECT exp.amount, cat.category_name, acc.account_name, t.tag_name FROM expenses exp LEFT JOIN categories cat ON exp.category_id = cat.id LEFT JOIN accounts acc ON exp.account_id = acc.id LEFT JOIN expense_tags et ON exp.id = et.expense_id LEFT JOIN tags t ON et.tag_id = t.id WHERE exp.is_cleared = 1 ORDER BY exp.date DESC;`,
      `SELECT r.title, c.cuisine_name, i.ingredient_name, u.username FROM recipes r JOIN cuisines c ON r.cuisine_id = c.id JOIN recipe_ingredients ri ON r.id = ri.recipe_id JOIN ingredients i ON ri.ingredient_id = i.id JOIN users u ON r.author_id = u.id WHERE r.is_published = 1 ORDER BY r.created_at;`,
      `SELECT b.book_title, a.author_name, g.genre_name, p.publisher_name FROM books b INNER JOIN authors a ON b.author_id = a.id LEFT JOIN genres g ON b.genre_id = g.id INNER JOIN publishers p ON b.publisher_id = p.id WHERE b.published_date > '2024-06-01' ORDER BY b.rating DESC;`,
      `SELECT l.loan_id, m.member_name, b.book_title, f.fine_amount FROM loans l JOIN members m ON l.member_id = m.id LEFT JOIN books b ON l.book_id = b.id LEFT JOIN fines f ON l.id = f.loan_id WHERE l.due_date < date('now') AND l.status = 'overdue';`,
      `SELECT p.playlist_name, u.username, t.track_name, a.artist_name FROM playlists p JOIN users u ON p.user_id = u.id LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id LEFT JOIN tracks t ON pt.track_id = t.id LEFT JOIN artists a ON t.artist_id = a.id WHERE p.is_public = 1;`
    ],
    subquery: [
      `SELECT d.device_id, d.name, (SELECT COUNT(*) FROM sync_logs s WHERE s.device_id = d.device_id) AS sync_count FROM devices d WHERE d.status = 'online';`,
      `SELECT w.id, w.weather_station, w.temp, (SELECT AVG(temp) FROM weather_data WHERE region_id = w.region_id) as avg_regional_temp FROM weather_data w WHERE w.temp > 35;`,
      `SELECT u.username, u.email FROM app_users u WHERE EXISTS (SELECT 1 FROM premium_subscriptions p WHERE p.user_id = u.id AND p.amount > 50);`,
      `SELECT c.car_model, c.top_speed FROM cars c WHERE c.top_speed > (SELECT AVG(top_speed) FROM cars WHERE manufacturer_id = c.manufacturer_id);`,
      `SELECT s.store_name FROM stores s WHERE s.id NOT IN (SELECT DISTINCT store_id FROM inventory WHERE last_restock > '2023-01-01');`,
      `SELECT b.brand_name, (SELECT SUM(sales) FROM monthly_reports m WHERE m.brand_id = b.id AND m.year = 2024) AS total_sales FROM brands b ORDER BY total_sales DESC;`
    ],
    fullScan: [
      `SELECT * FROM device_configs WHERE LOWER(mac_address) = '00:1b:44:11:3a:b7' AND strftime('%Y', created_at) = '2025';`,
      `SELECT * FROM system_events WHERE event_desc LIKE '%kernel panic%' AND timestamp >= '2024-01-01 00:00:00';`,
      `SELECT id, name, status, last_ping FROM nodes WHERE status != 'offline' ORDER BY last_ping DESC;`,
      `SELECT * FROM feedback WHERE UPPER(comment) LIKE '%CRASH%' OR rating = 0;`,
      `SELECT id, username, ip_address FROM access_logs WHERE date(access_time) = '2023-12-25';`,
      `SELECT * FROM budget_items WHERE amount / 100 > 500 AND category = 'Entertainment';`
    ]
  },
  'SQL Server': {
    slowJoin: [
      `SELECT emp.employee_id, emp.salary, dept.dept_name, man.manager_name FROM hr_employees emp JOIN hr_departments dept ON emp.department_id = dept.id JOIN hr_managers man ON dept.manager_id = man.id WHERE YEAR(emp.hire_date) = 2025 ORDER BY emp.hire_date DESC;`,
      `SELECT m.machine_name, f.factory_name, s.supervisor_name, p.part_produced FROM manufacturing_machines m LEFT JOIN factories f ON m.factory_id = f.id LEFT JOIN supervisors s ON f.supervisor_id = s.id LEFT JOIN produced_parts p ON m.id = p.machine_id WHERE m.is_operational = 1 ORDER BY m.installation_date DESC;`,
      `SELECT a.account_number, a.balance, c.customer_name, b.branch_city, r.region_name FROM bank_accounts a JOIN bank_customers c ON a.customer_id = c.id JOIN bank_branches b ON a.branch_id = b.id JOIN bank_regions r ON b.region_id = r.id WHERE a.is_active = 1 ORDER BY a.opened_date;`,
      `SELECT p.policy_number, u.underwriter_name, a.agency_name, t.tier_name FROM insurance_policies p INNER JOIN underwriters u ON p.underwriter_id = u.id LEFT JOIN agencies a ON u.agency_id = a.id INNER JOIN policy_tiers t ON p.tier_id = t.id WHERE p.start_date > '2024-06-01' ORDER BY p.premium_amount DESC;`,
      `SELECT po.purchase_order_id, v.vendor_name, d.delivery_status, r.receipt_date FROM purchase_orders po JOIN vendors v ON po.vendor_id = v.id LEFT JOIN deliveries d ON po.id = d.po_id LEFT JOIN goods_receipts r ON d.id = r.delivery_id WHERE po.expected_date < GETDATE() AND po.status = 'Pending';`,
      `SELECT s.server_name, dc.datacenter_name, r.rack_location, a.alert_level FROM enterprise_servers s JOIN datacenters dc ON s.datacenter_id = dc.id LEFT JOIN server_racks r ON s.rack_id = r.id LEFT JOIN monitoring_alerts a ON s.id = a.server_id WHERE s.uptime_percentage < 99.9;`
    ],
    subquery: [
      `SELECT c.client_id, c.client_name, (SELECT COUNT(*) FROM contracts ct WHERE ct.client_id = c.client_id) AS contract_count FROM corporate_clients c WHERE c.status = 'Active';`,
      `SELECT a.asset_id, a.asset_name, a.value, (SELECT AVG(value) FROM assets WHERE class_id = a.class_id) as avg_class_value FROM assets a WHERE a.value > 100000;`,
      `SELECT v.vendor_name, v.contact_email FROM enterprise_vendors v WHERE EXISTS (SELECT 1 FROM procurements p WHERE p.vendor_id = v.id AND p.total_cost > 50000);`,
      `SELECT e.engineer_name, e.billable_hours FROM software_engineers e WHERE e.billable_hours > (SELECT AVG(billable_hours) FROM software_engineers WHERE team_id = e.team_id);`,
      `SELECT f.facility_name FROM facilities f WHERE f.id NOT IN (SELECT DISTINCT facility_id FROM compliance_audits WHERE audit_date > '2023-01-01');`,
      `SELECT p.portfolio_name, (SELECT SUM(return_amount) FROM investments i WHERE i.portfolio_id = p.id AND i.fiscal_year = 2024) AS total_return FROM portfolios p ORDER BY total_return DESC;`
    ],
    fullScan: [
      `SELECT * FROM enterprise_clients WHERE LOWER(contact_email) = 'admin@corp.com' AND YEAR(onboarded_date) = 2025;`,
      `SELECT * FROM audit_trails WHERE action_details LIKE '%unauthorized access%' AND created_at >= '2024-01-01 00:00:00';`,
      `SELECT id, process_name, status, last_execution FROM batch_jobs WHERE status != 'failed' ORDER BY last_execution DESC;`,
      `SELECT * FROM incident_reports WHERE UPPER(description) LIKE '%DATA BREACH%' OR severity_level = 1;`,
      `SELECT id, username, workstation_ip FROM active_directory_logs WHERE CAST(login_time AS DATE) = '2023-12-25';`,
      `SELECT * FROM international_transfers WHERE amount / 100 > 50000 AND currency_code = 'GBP';`
    ]
  }
};
