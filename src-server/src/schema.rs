table! {
  pages(pk_id) {
    pk_id -> Int4,
    page_id -> Text,
    name -> Text,
    created_at -> Timestamp,
    fk_layout_id -> Int4,
  }
}

table! {
    forms (id) {
        id -> Int4,
        form_id -> Text,
        name -> Text,
        created_at -> Timestamp,
        data -> Json,
    }
}

table! {
    layouts (pk_id) {
        pk_id -> Int4,
        layout_id -> Text,
        name -> Text,
        created_at -> Timestamp,
        data -> Jsonb,
    }
}

table! {
    users (id) {
        id -> Int4,
        created_at -> Nullable<Timestamp>,
        name -> Nullable<Text>,
        email -> Nullable<Text>,
        address -> Nullable<Text>,
        city -> Nullable<Text>,
        state -> Nullable<Text>,
        zip -> Nullable<Text>,
        birth_date -> Nullable<Text>,
        latitude -> Nullable<Float8>,
        longitude -> Nullable<Float8>,
        password -> Nullable<Text>,
        source -> Nullable<Text>,
    }
}


allow_tables_to_appear_in_same_query!(
    forms,
    layouts,
    users,
    pages
);
