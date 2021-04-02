
table! {
    order_lines (order_line_id) {
        order_line_id -> Int4,
        order_id -> Int4,
        product_id -> Int4,
        units -> Int2,
    }
}

table! {
    orders (order_id) {
        order_id -> Int4,
        order_total -> Numeric,
        user_id -> Int4,
    }
}

table! {
    products (product_id) {
        product_id -> Int4,
        product_name -> Varchar,
        description -> Varchar,
        price -> Numeric,
    }
}

table! {
    users (id) {
        id -> Int4,
        name -> Varchar,
        address -> Varchar,
        email -> Varchar,
        birth_date -> Varchar,
    }
}

/*
joinable!(order_lines -> orders (order_id));
joinable!(order_lines -> products (product_id));
joinable!(orders -> users (user_id));

allow_tables_to_appear_in_same_query!(order_lines, orders, products, users,);
*/
