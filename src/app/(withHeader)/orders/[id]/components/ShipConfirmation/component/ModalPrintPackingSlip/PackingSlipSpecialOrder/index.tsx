/* eslint-disable jsx-a11y/alt-text */
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';

import { ItemOrder, Order } from '@/app/(withHeader)/orders/interface';

export default function PackingSlipSpecialOrder({
  orderDetail
}: // itemEachPackingSlip
{
  orderDetail: Order;
  // itemEachPackingSlip: ItemOrder[];
}) {
  return (
    <View style={styles.wFull}>
      <View style={styles.view}>
        <View style={styles.w40}>
          <View style={styles.view}>
            <Image style={styles.logo} src="/The_Home_Depot.png" />
          </View>
          <Text style={[styles.text18, styles.my16]}>Thank you for your order!</Text>
        </View>
        <View
          style={[
            styles.w60,
            {
              flexDirection: 'row'
            }
          ]}
        >
          <View style={[styles.border, styles.w40, { marginRight: '8px' }]}>
            <Text style={[styles.text10, styles.headerTable]}>Ship To:</Text>
            <View style={styles.bodyTable}>
              <Text style={styles.text10}>
                {orderDetail?.verified_ship_to?.contact_name || orderDetail?.ship_to?.name}
              </Text>
              <Text style={styles.text10}>
                {orderDetail?.verified_ship_to?.address_2 || orderDetail?.ship_to?.address_2 || '-'}
              </Text>
              <Text style={styles.text10}>
                {orderDetail?.verified_ship_to?.city || orderDetail?.ship_to?.city}{' '}
                {orderDetail?.verified_ship_to?.state || orderDetail?.ship_to?.state}{' '}
                {orderDetail?.verified_ship_to?.postal_code || orderDetail?.ship_to?.postal_code}{' '}
                {orderDetail?.verified_ship_to?.country || orderDetail?.ship_to?.country}
              </Text>
              <Text style={styles.text10}>
                {orderDetail?.verified_ship_to?.phone ||
                  orderDetail?.ship_to?.day_phone ||
                  orderDetail?.bill_to?.day_phone}
              </Text>
            </View>
          </View>
          <View style={styles.w60}>
            <View style={styles.border}>
              <Text style={[styles.text9, styles.headerTable]}>Ordered By:</Text>
              <View style={styles.bodyTable}>
                <Text style={styles.textTable}>
                  {orderDetail?.verified_ship_to?.contact_name || orderDetail?.ship_to?.name}
                </Text>
              </View>
            </View>
            <View style={[styles.border, { marginTop: '2px' }]}>
              <View style={styles.bodyTable}>
                <View style={styles.rowTableOrderBy}>
                  <Text style={styles.textTable}>Customer Order #:</Text>
                  <Text style={styles.textTable}>{orderDetail?.cust_order_number}</Text>
                </View>
                <View style={styles.rowTableOrderBy}>
                  <Text style={styles.textTable}>Purchase Order #:</Text>
                  <Text style={styles.textTable}>{orderDetail?.po_number}</Text>
                </View>
                <View style={styles.rowTableOrderBy}>
                  <Text style={styles.textTable}>Home Depot Order #:</Text>
                  <Text style={styles.textTable}>-</Text>
                </View>
                <View style={styles.rowTableOrderBy}>
                  <Text style={styles.textTable}>Store #:</Text>
                  <Text style={styles.textTable}>-</Text>
                </View>
                <View style={styles.rowTableOrderBy}>
                  <Text style={styles.textTable}>Order Date:</Text>
                  <Text style={styles.textTable}>
                    {dayjs(orderDetail?.order_date).format('MM/DD/YYYY')}
                  </Text>
                </View>
                <View style={styles.rowTableOrderBy}>
                  <Text style={styles.textTable}>Store Phone #:</Text>
                  <Text style={styles.textTable}>-</Text>
                </View>
                <View style={styles.rowTableOrderBy}>
                  <Text style={styles.textTable}>Delivery Req. Date:</Text>
                  <Text style={styles.textTable}>
                    {orderDetail?.estimated_delivery_date
                      ? dayjs(orderDetail?.estimated_delivery_date).format('MM/DD/YYYY')
                      : '-'}
                  </Text>
                </View>
                <View style={[styles.rowTableOrderBy, { marginBottom: 0 }]}>
                  <Text style={styles.textTable}>Vendor #:</Text>
                  <Text style={styles.textTable}>{orderDetail?.buying_contract}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, { flex: 1 }]}>PO Line Number</Text>
          <Text style={[styles.tableHeader, { flex: 1 }]}>SKU</Text>
          <Text style={[styles.tableHeader, { flex: 1.5 }]}>Model Number</Text>
          <Text style={[styles.tableHeader, { flex: 2.5, width: '300px' }]}>Item Description</Text>
          <Text style={[styles.tableHeader, { flex: 1 }]}>Qty Shipped</Text>
          <Text style={[styles.tableHeader, { flex: 1, borderRight: '0px' }]}>UOM</Text>
        </View>
        {orderDetail?.items?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { border: '0px', flex: 1 }]}>
              {item?.order_line_number || '-'}
            </Text>
            <Text style={[styles.tableCell, { border: '0px', flex: 1 }]}>
              {item?.merchant_sku || '-'}
            </Text>
            <Text style={[styles.tableCell, { border: '0px', flex: 1.5 }]}>
              {item?.vendor_sku || '-'}
            </Text>
            <Text style={[styles.tableCell, { border: '0px', flex: 2.5, width: '300px' }]}>
              {item?.description}
            </Text>
            <Text style={[styles.tableCell, { border: '0px', flex: 1 }]}>
              {item?.ship_qty_ordered || '-'}
            </Text>
            <Text style={[styles.tableCell, { border: '0px', flex: 1 }]}>
              {item?.unit_of_measure || '-'}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.textBottom}>
        Thank you for shopping at The Home Depot and please come again soon!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: '60px',
    height: '60px'
  },
  rowTableOrderBy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  wFull: {
    width: '100%'
  },
  view: {
    flexDirection: 'row',
    width: '100%',
    gap: '8px'
  },
  w40: {
    width: '40%'
  },
  w60: {
    width: '60%'
  },
  headerTable: {
    borderBottom: '1px',
    backgroundColor: '#b7b7b7',
    fontFamily: 'Times-Bold',
    padding: '2px',
    fontWeight: 'bold'
  },
  border: {
    borderWidth: '1px',
    width: '100%'
  },
  bodyTable: {
    padding: '4px'
  },
  textTable: {
    fontSize: '9px'
  },
  table: {
    width: '100%',
    height: '485px',
    marginTop: '4px',
    borderWidth: '1px'
  },
  tableHeader: {
    backgroundColor: '#b7b7b7',
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    padding: '2px',
    fontSize: '9px',
    borderRight: '1px',
    borderBottom: '1px'
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCell: {
    flex: 1,
    fontSize: '8px',
    borderRight: '1px',
    paddingBottom: '3px',
    paddingTop: '3px',
    paddingLeft: '3px'
  },
  BottomCell: {
    flex: 1,
    fontSize: '6px',
    borderBottom: '1px',
    borderRight: '1px'
  },
  text10: {
    fontSize: '10px'
  },
  text18: {
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'Times-Bold'
  },
  fontBold: {
    fontWeight: 'bold',
    fontFamily: 'Times-Bold'
  },
  text9: {
    fontSize: '9px',
    fontWeight: 'bold',
    fontFamily: 'Times-Bold'
  },
  my16: {
    margin: '16px 0px'
  },
  viewBottom: {
    flexDirection: 'row',
    width: '100%',
    gap: '6px',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  textBottom: {
    textAlign: 'center',
    fontSize: '12px',
    marginTop: '16px',
    fontStyle: 'italic'
  }
});
