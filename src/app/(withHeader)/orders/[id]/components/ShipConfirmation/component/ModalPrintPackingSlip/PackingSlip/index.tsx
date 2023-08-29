/* eslint-disable jsx-a11y/alt-text */
import { Order } from '@/app/(withHeader)/orders/interface';
import { Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const PackingSlip = ({ orderDetail }: { orderDetail: Order }) => {
  return (
    <Page size="A6" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src="/InfiBrite.png" />
        <View>
          <Text style={styles.textHeader}>Contact Us</Text>
          <Text style={styles.textDescriptions}>InfiBrite</Text>
          <Text style={styles.textDescriptions}>Phone:</Text>
        </View>
      </View>

      <View style={styles.my10}>
        <Text style={styles.textHeaderSub}>Thank you for shopping </Text>
        <Text style={styles.tableCell}>We hope you enjoy your new purchase!</Text>
      </View>
      <View style={styles.line} />
      <View style={styles.contentSubHead}>
        <Text style={styles.textDescriptions}>Page 1 of 1</Text>
        <Text style={styles.textDescriptions}>Refer to this information for all inquiries</Text>
      </View>
      <View style={styles.container}>
        {/* <View style={styles.section}>
          <Text style={styles.content}>Sold To:</Text>
          <Text style={styles.textDescriptions}>
            {orderDetail.customer?.name || orderDetail.ship_to?.name}
          </Text>
          <Text style={styles.textDescriptions}>
            {' '}
            {orderDetail.customer?.day_phone || orderDetail.ship_to?.day_phone}
          </Text>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.content}>Ship To:</Text>
          <Text style={styles.textDescriptions}>
            {orderDetail.verified_ship_to?.contact_name || orderDetail.ship_to?.name}
          </Text>
          <Text style={styles.textDescriptions}>
            {orderDetail.verified_ship_to?.address_1 || orderDetail.ship_to?.address_1}
          </Text>
          <Text style={styles.textDescriptions}>
            {orderDetail.verified_ship_to?.address_2 || orderDetail.ship_to?.address_2 || '-'}
          </Text>

          <Text style={styles.textDescriptions}>
            {orderDetail.verified_ship_to?.city || orderDetail.ship_to?.city}{' '}
            {orderDetail.verified_ship_to?.state || orderDetail.ship_to?.state}{' '}
            {orderDetail.verified_ship_to?.postal_code || orderDetail.ship_to?.postal_code}{' '}
            {orderDetail.verified_ship_to?.country || orderDetail.ship_to?.country}
          </Text>

          <Text style={styles.textDescriptions}>
            {orderDetail.verified_ship_to?.phone || orderDetail.ship_to?.day_phone}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.content}>Order Information:</Text>
          <View style={styles.contentOrderInfo}>
            <Text style={styles.textDescriptions}>Order Number:</Text>
            <Text style={styles.textDescriptions}>{orderDetail.cust_order_number}</Text>
          </View>
          <View style={styles.contentOrderInfo}>
            <Text style={styles.textDescriptions}>PO Number:</Text>
            <Text style={styles.textDescriptions}>{orderDetail.po_number}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Item #</Text>
            {/* <Text style={[styles.tableCell, styles.tableHeader]}>Item Description</Text> */}
            <Text style={[styles.tableCell, styles.tableHeader]}>Model #</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Qty. Ordered</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Qty. Shipped</Text>
          </View>
          {orderDetail.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item?.merchant_sku}</Text>
              {/* <Text style={[styles.tableCell]}>{item?.description}</Text> */}
              <Text style={styles.tableCell}>{item?.product_alias.sku}</Text>
              <Text style={styles.tableCell}>{item?.qty_ordered}</Text>
              <Text style={styles.tableCell}>{'-'}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
};

export default PackingSlip;

const styles = StyleSheet.create({
  logo: {
    height: '25px',
    width: '75px'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  textHeader: {
    fontSize: '10px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  textDescriptions: {
    fontSize: '6px'
  },
  page: {
    fontFamily: 'Helvetica',
    padding: 20,
    flexDirection: 'column'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '10px'
  },
  section: {
    marginBottom: 20,
    width: '100%'
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  content: {
    padding: '2px 0px 2px 2px',
    fontSize: '10px',
    backgroundColor: 'black',
    color: 'white'
  },
  row: {
    flexDirection: 'row'
  },
  label: {
    width: '30%'
  },
  value: {
    width: '70%'
  },
  table: {
    width: '100%',
    marginTop: 10
  },
  tableHeader: {
    backgroundColor: 'black',
    fontWeight: 'bold',
    color: 'white',
    padding: '4px',
    textAlign: 'center',
    fontSize: '8px'
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCell: {
    flex: 1,
    fontSize: '8px',
    textAlign: 'center'
  },
  my10: {
    margin: '10px 0px'
  },
  textHeaderSub: {
    fontSize: '10px',
    fontWeight: 'bold',
    marginBottom: '4px',
    textAlign: 'center'
  },
  line: {
    height: '1px',
    width: '100%',
    backgroundColor: 'black'
  },
  contentSubHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '4px 0px'
  },
  contentOrderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  contentBottom: {
    borderWidth: '1px',
    padding: '4px',
    gap: '4px',
    marginTop: 'auto'
  }
});
