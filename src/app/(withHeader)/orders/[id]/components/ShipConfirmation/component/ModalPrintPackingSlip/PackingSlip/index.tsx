/* eslint-disable jsx-a11y/alt-text */
import { Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { Order } from '@/app/(withHeader)/orders/interface';
import { InfoBottomLowes } from '../../ModalGS1/Gs1';
import PackingSlipHomeDepot from '../PackingSlipHomeDepot';

const PackingSlip = ({ orderDetail }: { orderDetail: Order }) => {
  return (
    <Page size="A4" style={styles.page}>
      {orderDetail.batch.retailer.name.toLowerCase().includes('lowes') ? (
        <View style={styles.view}>
          <View style={styles.rlt}>
            <View style={styles.header}>
              <Image style={styles.logo} src="/lowes.png" />
            </View>

            <View style={styles.contentLeft}>
              <View>
                <Text style={styles.textHeader}>Contact Us</Text>
                <Text style={styles.textHeaderDescription}>{`Lowe's Customer Care`}</Text>
                <Text style={styles.textHeaderDescription}>Phone: 1-800-44-LOWES (56937)</Text>
              </View>
            </View>

            <View style={styles.my10}>
              <Text style={styles.textHeaderSub}>{`Thank you for shopping at Lowe's!`} </Text>
              <Text style={styles.textHeadSub}>We hope you enjoy your new purchase!</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.contentSubHead}>
              <Text style={styles.textDescriptions}>Page 1 of 1</Text>
              <Text
                style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  fontFamily: 'Times-Bold'
                }}
              >
                Refer to this information for all inquiries
              </Text>
            </View>
            <View style={styles.container}>
              <View style={styles.section}>
                <Text style={styles.content}>Sold To:</Text>
                <Text style={styles.textDescriptions}>
                  {orderDetail.customer?.name || orderDetail.ship_to?.name}
                </Text>
                <Text style={styles.textDescriptions}>
                  {orderDetail.customer?.day_phone || orderDetail.ship_to?.day_phone}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.content}>Ship To:</Text>
                <Text style={styles.textDescriptionsUpperCase}>
                  {orderDetail.verified_ship_to?.contact_name || orderDetail.ship_to?.name}
                </Text>
                <Text style={styles.textDescriptionsUpperCase}>
                  {orderDetail.verified_ship_to?.address_1 || orderDetail.ship_to?.address_1}
                </Text>
                <Text style={styles.textDescriptionsUpperCase}>
                  {orderDetail.verified_ship_to?.address_2 || orderDetail.ship_to?.address_2 || '-'}
                </Text>

                <Text style={styles.textDescriptionsUpperCase}>
                  {orderDetail.verified_ship_to?.city || orderDetail.ship_to?.city}{' '}
                  {orderDetail.verified_ship_to?.state || orderDetail.ship_to?.state}{' '}
                  {orderDetail.verified_ship_to?.postal_code || orderDetail.ship_to?.postal_code}{' '}
                  {orderDetail.verified_ship_to?.country || orderDetail.ship_to?.country}
                </Text>

                <Text style={styles.textDescriptionsUpperCase}>
                  {orderDetail.verified_ship_to?.phone || orderDetail.ship_to?.day_phone}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.content}>Order Information:</Text>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.textDescriptions}>Customer Order Number:</Text>
                  <Text style={styles.textDescriptions}>{orderDetail.cust_order_number}</Text>
                </View>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.textDescriptions}>PO Number:</Text>
                  <Text style={styles.textDescriptions}>{orderDetail.po_number}</Text>
                </View>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.textDescriptions}>Sales Date::</Text>
                  <Text style={styles.textDescriptions}>{'-'}</Text>
                </View>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.textDescriptions}>Location:</Text>
                  <Text style={styles.textDescriptions}>{'-'}</Text>
                </View>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.textDescriptions}>Salesperson:</Text>
                  <Text style={styles.textDescriptions}>{'-'}</Text>
                </View>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.textDescriptions}>Shipment Expectation:</Text>
                  <Text style={styles.textDescriptions}>{'-'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.table}>
                <View
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor: '#000'
                    }
                  ]}
                >
                  <View style={[styles.headerCell, { flex: 1 }]}>
                    <Text>Item #</Text>
                  </View>
                  <View style={[styles.headerCell, styles.fixedWidthCell, { flex: 6 }]}>
                    <Text>Item Description</Text>
                  </View>
                  <View style={[styles.headerCell, { flex: 2 }]}>
                    <Text>Model #</Text>
                  </View>
                  <View style={[styles.headerCell, { flex: 1, width: '30px' }]}>
                    <View style={styles.wFull}>
                      <Text style={styles.textTable}>Qty.</Text>
                      <Text style={styles.textTable}>Ordered</Text>
                    </View>
                  </View>
                  <View style={[styles.headerCell, { flex: 1, width: '30px' }]}>
                    <View style={styles.wFull}>
                      <Text style={styles.textTable}>Qty.</Text>
                      <Text style={styles.textTable}>Shipped</Text>
                    </View>
                  </View>
                </View>
                {orderDetail.items.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{item?.merchant_sku}</Text>
                    <Text style={[styles.tableCell, styles.fixedWidthCell, { flex: 6 }]}>
                      {item?.description}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{item?.product_alias?.sku}</Text>
                    <Text style={[styles.tableCell, { flex: 1, width: '30px' }]}>
                      {item?.qty_ordered}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>-</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <InfoBottomLowes />
        </View>
      ) : (
        <PackingSlipHomeDepot orderDetail={orderDetail} />
      )}
    </Page>
  );
};

export default PackingSlip;

const styles = StyleSheet.create({
  rlt: {
    position: 'relative'
  },
  contentLeft: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%'
  },
  textHeadSub: {
    textAlign: 'center',
    fontSize: '8px',
    marginTop: '4px',
    marginBottom: '4px'
  },
  headerCell: {
    fontSize: '8px',
    textAlign: 'center',
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    padding: '3px',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: '0px',
    justifyContent: 'center'
  },
  fixedWidthCell: {
    width: 600
  },
  logo: {
    height: '60px',
    width: '150px'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  textHeader: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '2px',
    textAlign: 'right',
    fontFamily: 'Times-Bold'
  },
  textHeaderDescription: {
    fontSize: '8px',
    textAlign: 'right',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  textDescriptions: {
    fontSize: '6px'
  },
  textDescriptionsUpperCase: {
    fontSize: '6px',
    textTransform: 'uppercase'
  },
  page: {
    fontFamily: 'Helvetica',
    padding: '16px',
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
    padding: '3px 0px 3px 2px',
    fontSize: '8px',
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
    textAlign: 'center',
    padding: '4px 0px'
  },
  my10: {
    margin: '10px 0px'
  },
  textHeaderSub: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '2px',
    textAlign: 'center',
    fontFamily: 'Times-Bold'
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
    justifyContent: 'space-between',
    marginBottom: '2px',
    marginTop: '2px'
  },
  contentBottom: {
    borderWidth: '1px',
    padding: '4px',
    gap: '4px',
    marginTop: 'auto'
  },
  view: {
    flexDirection: 'column',
    height: '100%'
  },
  textTable: {
    flexDirection: 'row',
    justifyContent: 'center',
    color: '#ffff',
    textAlign: 'center'
  },
  wFull: {
    width: '100%'
  }
});
