CREATE TABLE form(
  pk_id      int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  form_id    uuid NOT NULL,
  name       text,
  created_at timestamp NOT NULL,
  data       json NOT NULL
);

CREATE TABLE layout(
  pk_id      int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  layout_id  text NOT NULL,
  name       text,
  created_at timestamp NOT NULL,
  data       jsonb NOT NULL
);

CREATE TABLE single_page(
  pk_id         int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  page_id       text NOT NULL,
  name          text NOT NULL,
  created_at    timestamp NOT NULL,
  fk_layout_id  int
);

/*
CREATE TABLE single_page_connection(
  pk_id               int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  connection_id      text NOT NULL,
  created_at          timestamp NOT NULL,

  fk_incoming_page_id INT FOREIGN KEY REFERENCES single_page(pk_id),
  fk_outgoing_page_id INT FOREIGN KEY REFERENCES single_page(pk_id),
);
*/
