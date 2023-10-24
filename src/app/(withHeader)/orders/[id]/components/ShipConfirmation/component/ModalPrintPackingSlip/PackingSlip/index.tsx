/* eslint-disable jsx-a11y/alt-text */
import { Order } from '@/app/(withHeader)/orders/interface';
import { Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { InfoBottomLowes } from '../../ModalGS1/Gs1';
import PackingSlipHomeDepot from '../PackingSlipHomeDepot';
import PackingSlipSpecialOrder from '../PackingSlipSpecialOrder';
import PackingSlipCanada from '../PackingSlipCanada';

const PackingSlip = ({ orderDetail }: { orderDetail: Order }) => {
  return (
    <Page size="A4" style={styles.page}>
      {orderDetail.batch.retailer.name.toLowerCase() === 'lowes' ? (
        <View style={styles.view}>
          <View>
            <View style={styles.header}>
              <Image style={styles.logo} src="/lowes.png" />
              <View style={styles.viewTextHeader}>
                <Text style={styles.textHeader}>Contact Us</Text>
                <Text style={styles.text8}>{`Lowe’s Customer Care`}</Text>
                <Text style={styles.text8}>Phone: 1-800-44-LOWES (56937)</Text>
              </View>
            </View>

            <View style={styles.my10}>
              <Text style={styles.textHeaderSub}>Thank you for shopping at Lowe’s!</Text>
              <Text style={styles.textHeaderSmall}>We hope you enjoy your new purchase!</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.contentSubHead}>
              <Text style={styles.textPagination}>Page 1 of 1</Text>
              <Text style={[styles.textPagination, styles.fontBold]}>
                Refer to this information for all inquiries
              </Text>
            </View>
            <View style={styles.container}>
              <View style={styles.section}>
                <Text style={[styles.content, styles.text7]}>Sold To:</Text>
                <Text style={styles.text7}>
                  {orderDetail.customer?.name || orderDetail.ship_to?.name}
                </Text>
                <Text style={styles.text7}>
                  {orderDetail.customer?.day_phone || orderDetail.ship_to?.day_phone}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.content, styles.text7]}>Ship To:</Text>
                <Text style={styles.text7}>
                  {orderDetail.verified_ship_to?.contact_name || orderDetail.ship_to?.name}
                </Text>
                <Text style={styles.text7}>
                  {orderDetail.verified_ship_to?.address_1 || orderDetail.ship_to?.address_1}
                </Text>
                <Text style={styles.text7}>
                  {orderDetail.verified_ship_to?.address_2 || orderDetail.ship_to?.address_2 || '-'}
                </Text>

                <Text style={styles.text7}>
                  {orderDetail.verified_ship_to?.city || orderDetail.ship_to?.city}{' '}
                  {orderDetail.verified_ship_to?.state || orderDetail.ship_to?.state}{' '}
                  {orderDetail.verified_ship_to?.postal_code || orderDetail.ship_to?.postal_code}{' '}
                  {orderDetail.verified_ship_to?.country || orderDetail.ship_to?.country}
                </Text>

                <Text style={styles.text7}>
                  {orderDetail.verified_ship_to?.phone || orderDetail.ship_to?.day_phone}
                </Text>
                {orderDetail?.verified_ship_to?.classification === 'RESIDENTIAL' && (
                  <Text style={styles.text7}>RESIDENTIAL ADDRESS</Text>
                )}
              </View>

              <View style={styles.section}>
                <Text style={[styles.content, styles.text7]}>Order Information:</Text>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.text7}>Customer Order Number:</Text>
                  <Text style={styles.text7}>{orderDetail.cust_order_number}</Text>
                </View>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.text7}>PO Number:</Text>
                  <Text style={styles.text7}>{orderDetail.po_number}</Text>
                </View>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.text7}>Sales Date:</Text>
                  <Text style={styles.text7}>{orderDetail.order_date}</Text>
                </View>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.text7}>Location:</Text>
                  <Text style={styles.text7}>
                    {orderDetail.ship_to?.partner_person_place_id || '-'}
                  </Text>
                </View>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.textDescriptions}>Salesperson:</Text>
                  <Text style={styles.textDescriptions}>
                    {orderDetail?.po_hdr_data?.salesAgent || '-'}
                  </Text>
                </View>
                <View style={styles.contentOrderInfo}>
                  <Text style={styles.textDescriptions}>Shipment Expectation:</Text>
                  <Text style={styles.textDescriptions}>{'Single Shipment Required'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableHeader]}>Item #</Text>
                  <Text style={[styles.tableCell, styles.tableHeader]}>Item Description</Text>
                  <Text style={[styles.tableCell, styles.tableHeader]}>Model #</Text>
                  <Text style={[styles.tableCell, styles.tableHeader]}>Qty. Ordered</Text>
                  <Text style={[styles.tableCell, styles.tableHeader]}>Qty. Shipped</Text>
                </View>
                {orderDetail.items.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item?.merchant_sku}</Text>
                    <Text style={styles.tableCell}>{item?.description}</Text>
                    <Text style={styles.tableCell}>{item?.product_alias?.sku}</Text>
                    <Text style={styles.tableCell}>{item?.qty_ordered}</Text>
                    <Text style={styles.tableCell}>-</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <InfoBottomLowes />
        </View>
      ) : orderDetail?.batch?.retailer?.name === 'The Home Depot' ? (
        <PackingSlipHomeDepot orderDetail={orderDetail} />
      ) : orderDetail.batch.retailer.name.toLowerCase() === 'thdca' ? (
        <PackingSlipCanada orderDetail={orderDetail} />
      ) : (
        <PackingSlipSpecialOrder orderDetail={orderDetail} />
      )}
    </Page>
  );
};

export default PackingSlip;

const styles = StyleSheet.create({
  logo: {
    height: '80px',
    width: '173px'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  viewTextHeader: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  textPagination: {
    fontSize: '8px',
    fontStyle: 'italic',
    fontFamily: 'Times-Bold'
  },
  textHeader: {
    fontSize: '10px',
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    marginBottom: '4px'
  },
  text8: {
    fontSize: '8px'
  },
  text7: {
    fontSize: '7px'
  },
  textDescriptions: {
    fontSize: '7px'
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
    padding: '2px 0px 2px 2px',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Times-Bold'
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
    fontFamily: 'Times-Bold',
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
    fontSize: '7px',
    textAlign: 'center'
  },
  my10: {
    margin: '10px 0px'
  },
  textHeaderSub: {
    fontSize: '12px',
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    marginBottom: '4px',
    textAlign: 'center'
  },
  textHeaderSmall: {
    flex: 1,
    fontSize: '9px',
    textAlign: 'center'
  },
  line: {
    height: '1px',
    width: '100%',
    backgroundColor: 'black',
    marginTop: '10px'
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
    marginTop: '4px'
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
  fontBold: {
    fontWeight: 'bold',
    fontFamily: 'Times-Bold'
  }
});
