-- Seed data generated from the original mock catalogue

insert into public.categories (slug, name, icon, sort_order) values
  ('burgers', 'Burgers', '🍔', 1),
  ('pizza', 'Pizza', '🍕', 2),
  ('chicken', 'Chicken', '🍗', 3),
  ('african', 'African', '🥘', 4),
  ('drinks', 'Drinks', '🥤', 5),
  ('shawarma', 'Shawarma', '🌯', 6)
on conflict (slug) do nothing;

with r as (
  insert into public.restaurants (name, image_url, cuisine, tags, rating, delivery_min_minutes, delivery_max_minutes, delivery_fee)
  values ('Chicken Republic', 'https://i.pinimg.com/736x/53/e9/0e/53e90e1b5d9fe8b5f4206c87fc56f11b.jpg', 'Chicken • Fast Food', array['chicken', 'fast food'], 4.6, 25, 35, 0)
  returning id
)
insert into public.menu_items (restaurant_id, name, description, price, image_url, sort_order)
select r.id, v.name, v.description, v.price, v.image_url, v.sort_order from r, (values
  ('Chicken Burger Meal', 'Crispy chicken burger with fries and a drink', 2500, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&q=80', 1),
  ('Spicy Chicken Wings (6 pcs)', 'Golden fried wings tossed in spicy sauce', 3200, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300&q=80', 2),
  ('Jollof Rice & Chicken', 'Smoky jollof rice served with a grilled chicken thigh', 2800, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&q=80', 3),
  ('Chicken Sharwarma', 'Wrap with spiced chicken, veggies and garlic sauce', 2200, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&q=80', 4)
) as v(name, description, price, image_url, sort_order);

with r as (
  insert into public.restaurants (name, image_url, cuisine, tags, rating, delivery_min_minutes, delivery_max_minutes, delivery_fee)
  values ('Domino''s Pizza', 'https://i.pinimg.com/736x/b9/90/62/b99062caaf580dbd38b59edbe69d40d9.jpg', 'Pizza • Fast Food', array['pizza', 'fast food'], 4.4, 30, 45, 0)
  returning id
)
insert into public.menu_items (restaurant_id, name, description, price, image_url, sort_order)
select r.id, v.name, v.description, v.price, v.image_url, v.sort_order from r, (values
  ('Pepperoni Pizza (Medium)', 'Classic pepperoni with mozzarella on hand-tossed dough', 5500, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&q=80', 1),
  ('BBQ Chicken Pizza (Large)', 'Smoky BBQ sauce, grilled chicken, onions and peppers', 8500, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80', 2),
  ('Garlic Bread Sticks', 'Warm breadsticks with garlic butter and parmesan', 1800, 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=300&q=80', 3)
) as v(name, description, price, image_url, sort_order);

with r as (
  insert into public.restaurants (name, image_url, cuisine, tags, rating, delivery_min_minutes, delivery_max_minutes, delivery_fee)
  values ('Mega Chicken', 'https://i.pinimg.com/1200x/71/90/ae/7190ae594a421797e226c9f333f2cc3c.jpg', 'African • Chicken', array['african', 'chicken'], 4.8, 20, 30, 1000)
  returning id
)
insert into public.menu_items (restaurant_id, name, description, price, image_url, sort_order)
select r.id, v.name, v.description, v.price, v.image_url, v.sort_order from r, (values
  ('Fried Rice & Turkey', 'Nigerian fried rice with seasoned turkey and salad', 3500, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&q=80', 1),
  ('Pounded Yam & Egusi', 'Smooth pounded yam with rich egusi soup and assorted meat', 4000, 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300&q=80', 2),
  ('Grilled Chicken Platter', 'Half chicken grilled with herbs, served with coleslaw', 4500, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&q=80', 3)
) as v(name, description, price, image_url, sort_order);

with r as (
  insert into public.restaurants (name, image_url, cuisine, tags, rating, delivery_min_minutes, delivery_max_minutes, delivery_fee)
  values ('Cold Stone Creamery', 'https://i.pinimg.com/1200x/2e/da/3b/2eda3b1b8e4f5697cb288600ffce5406.jpg', 'Dessert • Ice Cream', array['dessert', 'ice cream'], 4.7, 15, 25, 500)
  returning id
)
insert into public.menu_items (restaurant_id, name, description, price, image_url, sort_order)
select r.id, v.name, v.description, v.price, v.image_url, v.sort_order from r, (values
  ('Cookie Dough Delight', 'Vanilla ice cream with cookie dough and fudge', 3000, 'https://images.unsplash.com/photo-1570197788417-0e82375c9be0?w=300&q=80', 1),
  ('Berry Berry Good', 'Strawberry ice cream with raspberries and blueberries', 3200, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&q=80', 2),
  ('Chocolate Devotion', 'Rich chocolate ice cream with brownies and fudge', 3500, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80', 3)
) as v(name, description, price, image_url, sort_order);

with r as (
  insert into public.restaurants (name, image_url, cuisine, tags, rating, delivery_min_minutes, delivery_max_minutes, delivery_fee)
  values ('The Place Restaurant', 'https://i.pinimg.com/1200x/2b/6c/42/2b6c4279f686658cf58e9098c0d6171b.jpg', 'African • Rice', array['african', 'rice'], 4.5, 30, 40, 1500)
  returning id
)
insert into public.menu_items (restaurant_id, name, description, price, image_url, sort_order)
select r.id, v.name, v.description, v.price, v.image_url, v.sort_order from r, (values
  ('Jollof Rice Special', 'Signature smoky jollof rice with grilled chicken', 2500, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&q=80', 1),
  ('Amala & Ewedu', 'Soft amala with ewedu and gbegiri soup, assorted meat', 3000, 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300&q=80', 2),
  ('Suya Platter', 'Spicy grilled beef suya with onions and tomatoes', 3500, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&q=80', 3)
) as v(name, description, price, image_url, sort_order);

with r as (
  insert into public.restaurants (name, image_url, cuisine, tags, rating, delivery_min_minutes, delivery_max_minutes, delivery_fee)
  values ('Burger King', 'https://i.pinimg.com/736x/91/00/2e/91002e7ad4055a36626209ae723c1e2a.jpg', 'Burgers • Fast Food', array['burgers', 'fast food'], 4.3, 25, 40, 1000)
  returning id
)
insert into public.menu_items (restaurant_id, name, description, price, image_url, sort_order)
select r.id, v.name, v.description, v.price, v.image_url, v.sort_order from r, (values
  ('Whopper Meal', 'Flame-grilled beef patty with lettuce, tomato, fries and drink', 4500, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80', 1),
  ('Chicken Royale', 'Crispy chicken fillet with mayo and fresh lettuce', 3800, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&q=80', 2),
  ('Onion Rings (Large)', 'Crispy battered onion rings with dipping sauce', 1500, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300&q=80', 3)
) as v(name, description, price, image_url, sort_order);

with r as (
  insert into public.restaurants (name, image_url, cuisine, tags, rating, delivery_min_minutes, delivery_max_minutes, delivery_fee)
  values ('Kilimanjaro', 'https://i.pinimg.com/736x/b7/58/8d/b7588df9ec3a1f1ad49f1dd11bab644c.jpg', 'Nigerian • Fast Food', array['nigerian', 'fast food'], 4.5, 25, 40, 800)
  returning id
)
insert into public.menu_items (restaurant_id, name, description, price, image_url, sort_order)
select r.id, v.name, v.description, v.price, v.image_url, v.sort_order from r, (values
  ('Shawarma (Regular)', 'Chicken shawarma with garlic sauce, veggies and chips', 2500, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&q=80', 1),
  ('Peppered Chicken & Chips', 'Spicy peppered chicken served with crispy chips', 3000, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&q=80', 2),
  ('Meat Pie (2 pcs)', 'Flaky pastry filled with seasoned minced meat', 1200, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&q=80', 3)
) as v(name, description, price, image_url, sort_order);

with r as (
  insert into public.restaurants (name, image_url, cuisine, tags, rating, delivery_min_minutes, delivery_max_minutes, delivery_fee)
  values ('McDonald''s', 'https://i.pinimg.com/736x/3a/8e/e6/3a8ee6db18894fa3c02990350d728e34.jpg', 'Burgers & Drinks • Fast Food', array['burgers & drinks', 'fast food'], 4.6, 25, 40, 1000)
  returning id
)
insert into public.menu_items (restaurant_id, name, description, price, image_url, sort_order)
select r.id, v.name, v.description, v.price, v.image_url, v.sort_order from r, (values
  ('Big Mac Meal', 'Iconic double-patty burger with special sauce, fries and drink', 4800, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80', 1),
  ('McChicken Sandwich', 'Crispy chicken patty with mayo and shredded lettuce', 2800, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&q=80', 2),
  ('Chicken McNuggets (9 pcs)', 'Golden chicken nuggets with your choice of dipping sauce', 3200, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&q=80', 3),
  ('McChicken', 'Crispy, seasoned chicken patty topped with shredded lettuce and creamy mayonnaise-style sauce, served in a soft toasted bun.', 2600, 'https://i.pinimg.com/736x/74/4f/43/744f4380a986a662530e812f1c8a62a1.jpg', 4)
) as v(name, description, price, image_url, sort_order);

