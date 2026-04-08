SELECT type, count(*) as count FROM "Place" GROUP BY type;
SELECT count(*) as count FROM "Place" WHERE city ILIKE '%Addis%' AND type = 'hotel';
SELECT count(*) as count FROM "Place" WHERE city ILIKE '%Addis%' AND type = 'tour';
