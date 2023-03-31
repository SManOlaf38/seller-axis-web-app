order_batch_key_dictionary = {
    "@batchNumber": "batch_number",
    "partnerID": "partner",
    "hubOrder": "orders",
}

partner_key_dictionary = {
    "@name": "name",
    "@roleType": "role_type",
    "#text": "retailer_partner_id",
}

participating_party_key_dictionary = {
    "@name": "name",
    "@roleType": "role_type",
    "@participationCode": "participation_code",
    "#text": "retailer_participating_party_id",
}

person_place_key_dictionary = {
    "@personPlaceID": "retailer_person_place_id",
    "name1": "name",
    "addressRateClass": "address_rate_class",
    "address1": "address_1",
    "address2": "address_2",
    "city": "city",
    "state": "state",
    "country": "country",
    "postalCode": "postal_code",
    "dayPhone": "day_phone",
    "nightPhone": "night_phone",
    "partnerPersonPlaceId": "partner_person_place_id",
    "email": "email",
}

purchase_order_key_dictionary = {
    "@transactionID": "transaction_id",
    "participatingParty": "participating_party",
    "sendersIdForReceiver": "senders_id_for_receiver",
    "orderId": "retailer_purchase_order_id",
    "poNumber": "po_number",
    "orderDate": "order_date",
    "shipTo": "ship_to",
    "billTo": "bill_to",
    "invoiceTo": "invoice_to",
    "customer": "customer",
    "shippingCode": "shipping_code",
    "salesDivision": "sales_division",
    "vendorWarehouseId": "vendor_warehouse_id",
    "custOrderNumber": "cust_order_number",
    "poHdrData": "po_hdr_data",
    "lineItem": "items",
    "personPlace": "person_place",
    "controlNumber": "control_number",
    "buyingContract": "buying_contract",
}

purchase_order_item_key_dictionary = {
    "lineItemId": "retailer_purchase_order_item_id",
    "orderLineNumber": "order_line_number",
    "merchantLineNumber": "merchant_line_number",
    "qtyOrdered": "qty_ordered",
    "unitOfMeasure": "unit_of_measure",
    "UPC": "upc",
    "description": "description",
    "description2": "description_2",
    "merchantSKU": "merchant_sku",
    "vendorSKU": "vendor_sku",
    "unitCost": "unit_cost",
    "shippingCode": "shipping_code",
    "expectedShipDate": "expected_ship_date",
    "poLineData": "po_line_data",
}
